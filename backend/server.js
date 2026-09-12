require('dotenv').config();
const express = require('express');
const cors = require('cors');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const FIREBASE_DB_URL = "https://streamingdpc-7e7fa-default-rtdb.firebaseio.com";

/**
 * Intenta obtener el código de 4 dígitos desde una URL de Netflix
 */
async function getCodeFromNetflixUrl(url) {
    try {
        console.log("Visitando URL de Netflix:", url);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        const pageText = $('body').text();
        const codeMatch = pageText.match(/\b\d{4}\b/);

        if (codeMatch) {
            console.log("Código encontrado en la web:", codeMatch[0]);
            return codeMatch[0];
        }
    } catch (error) {
        console.error("Error al visitar la URL de Netflix:", error.message);
    }
    return null;
}

app.post('/api/get-code', async (req, res) => {
    const { email, platform } = req.body;

    if (!email || !platform) {
        return res.status(400).json({ error: 'Email y plataforma son requeridos.' });
    }

    try {
        console.log(`[DEBUG] Nueva solicitud: ${email} para ${platform}`);

        // 1. Obtener cuentas
        const dbResponse = await axios.get(`${FIREBASE_DB_URL}/emailAccounts.json`);
        const accountsData = dbResponse.data;

        if (!accountsData) {
            console.log("[DEBUG] No hay cuentas en Firebase");
            return res.status(404).json({ success: false, error: 'No hay cuentas de correo configuradas en Firebase.' });
        }

        const accounts = Object.values(accountsData).filter(a => a && a.email && a.password);

        console.log(`[DEBUG] Procesando ${accounts.length} cuentas en PARALELO para mayor velocidad...`);

        // Función individual para procesar cada cuenta
        const checkAccount = async (account) => {
            let connection = null;
            try {
                console.log(`[DEBUG] Intentando conexión: ${account.email}`);
                const imapConfig = {
                    imap: {
                        user: account.email,
                        password: account.password.replace(/\s+/g, ''),
                        host: account.email.includes('gmail.com') ? 'imap.gmail.com' : 'imap.titan.email',
                        port: 993,
                        tls: true,
                        authTimeout: 5000, // Timeout más agresivo
                        tlsOptions: { rejectUnauthorized: false }
                    }
                };

                connection = await imaps.connect(imapConfig);
                const box = await connection.openBox('INBOX');

                // OPTIMIZACIÓN: En lugar de buscar en todo el buzón, pedimos directamente los últimos 15 correos
                const total = box.messages.total;
                if (total === 0) return null;

                const range = `${Math.max(1, total - 15)}:*`;
                let messages = await connection.fetch(range, { bodies: ['HEADER', 'TEXT'], markSeen: false });

                console.log(`[DEBUG] Realsando ${messages.length} últimos correos en ${account.email}`);

                for (let i = messages.length - 1; i >= 0; i--) {
                    const item = messages[i];
                    if (!item || !item.parts) continue;

                    const all = item.parts.find(a => a.which === 'TEXT');
                    if (!all || !all.body) continue;

                    const parsed = await simpleParser(all.body);
                    const subject = (parsed.subject || "").toString().toLowerCase();
                    const textContent = (parsed.text || "").toString().toLowerCase();
                    const htmlContent = (parsed.html || "").toString();

                    let fromText = "";
                    if (parsed.from && parsed.from.text) fromText = parsed.from.text.toLowerCase();

                    const targetEmail = email.toLowerCase();
                    const platformLower = platform.toLowerCase();

                    const isFromPlatform = platformLower === 'logincode' ? true : (subject.includes(platformLower) || fromText.includes(platformLower));
                    const mentionsEmail = textContent.includes(targetEmail) || htmlContent.toLowerCase().includes(targetEmail);

                    if (isFromPlatform || mentionsEmail) {
                        console.log(`[DEBUG] ¡MATCH ENCONTRADO en ${account.email}!`);
                        if (platformLower.includes('netflix')) {
                            const codeMatch = textContent.match(/\b\d{4}\b/);
                            if (codeMatch && (textContent.includes('código') || textContent.includes('access') || subject.includes('netflix'))) {
                                return codeMatch[0];
                            } else {
                                const $ = cheerio.load(htmlContent);
                                const links = [];
                                $('a').each((j, el) => {
                                    const href = $(el).attr('href');
                                    if (href && href.includes('netflix.com')) links.push(href);
                                });
                                for (const link of links) {
                                    if (link.includes('verify') || link.includes('token') || link.includes('travel') || link.includes('update-primary-location')) {
                                        const code = await getCodeFromNetflixUrl(link);
                                        if (code) return code;
                                    }
                                }
                            }
                        } else if (platformLower.includes('disney')) {
                            const codeMatch = textContent.match(/\b\d{6}\b/);
                            if (codeMatch) return codeMatch[0];
                        } else if (platformLower.includes('logincode')) {
                            // Busca el texto de los correos de inicio de sesión en el texto, HTML o ASUNTO
                            const loginKeywords = [
                                'ngresa este código para iniciar sesión',
                                'ngresa este codigo para iniciar sesion',
                                'tu código de inicio de sesión',
                                'tu codigo de inicio de sesion',
                                'código de inicio de sesión',
                                'codigo de inicio de sesion',
                                'enter this code to sign in',
                                'sign-in code',
                                'your sign in code',
                                'login code',
                                'verification code'
                            ];
                            const hasLoginText = loginKeywords.some(kw =>
                                textContent.includes(kw) ||
                                subject.includes(kw) ||
                                htmlContent.toLowerCase().includes(kw)
                            );

                            if (hasLoginText) {
                                // Extraer código numérico de 4 a 8 dígitos, pudiendo tener espacios (ej: 4 0 3 9)
                                const regexEspacios = /\b(\d(?:\s*\d){3,7})\b/;
                                const codeMatch = textContent.match(regexEspacios) || htmlContent.match(regexEspacios);

                                if (codeMatch) {
                                    const cleanCode = codeMatch[1].replace(/\s+/g, '');
                                    console.log(`[DEBUG] Código de inicio de sesión encontrado: ${cleanCode}`);
                                    return cleanCode;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(`[DEBUG] Error en ${account.email}:`, err.message);
            } finally {
                if (connection) {
                    try { connection.end(); } catch (e) { }
                }
            }
            return null;
        };

        // Ejecutar todas las búsquedas simultáneamente
        const results = await Promise.all(accounts.map(acc => checkAccount(acc)));
        const foundCode = results.find(r => r !== null);

        if (foundCode) {
            console.log(`[DEBUG] ÉXITO FINAL: ${foundCode}`);
            return res.json({ success: true, code: foundCode });
        } else {
            return res.status(404).json({ success: false, error: 'Código no encontrado. Revisa si el correo ya llegó o si faltan cuentas por vincular.' });
        }

    } catch (err) {
        console.error("DEBUG - Fallo Crítico:", err);
        return res.status(500).json({
            success: false,
            error: "Error interno del servidor.",
            details: err.message,
            stack: err.stack // Solo para diagnosticar el problema actual
        });
    }
});

// Ruta de salud para verificar que el servidor está vivo
app.get('/', (req, res) => {
    res.send('🚀 Backend de Streaming DPC está funcionando correctamente.');
});

app.listen(PORT, () => {
    console.log(`🚀 Servicio Backend ejecutándose en el puerto ${PORT}`);
});
