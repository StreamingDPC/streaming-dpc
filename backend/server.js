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

        const targetEmail = email.toLowerCase().trim();
        const accounts = Object.values(accountsData).filter(a =>
            a && a.email && a.password && a.email.toLowerCase().trim() === targetEmail
        );

        if (accounts.length === 0) {
            return res.status(404).json({ success: false, error: `La cuenta ${email} no está vinculada en el panel de Configuración.` });
        }

        console.log(`[DEBUG] Procesando ${accounts.length} cuentas en PARALELO para mayor velocidad...`);
        let debugInfo = [];

        // Función individual para procesar cada cuenta
        const checkAccount = async (account) => {
            let accountLogs = { email: account.email, scanned: 0, subjects: [], error: null, found: false };
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

                // OPTIMIZACIÓN VITAL: Filtramos explícitamente para que IMAP solo descargue correos recientes.
                // Si descargamos ['ALL'] con bodies, el servidor colapsa intentando descargar miles de correos antiguos a la memoria.
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                let searchCriteria = [['SINCE', yesterday]];
                let allMessages = await connection.search(searchCriteria, { bodies: ['HEADER', 'TEXT'], markSeen: false });

                // Extraer solo los últimos 20 para procesar rapidísimo
                let messages = allMessages.slice(-20);

                accountLogs.scanned = 0; // Iniciar contador

                for (let i = messages.length - 1; i >= 0; i--) {
                    const item = messages[i];
                    if (!item || !item.parts) continue;

                    const all = item.parts.find(a => a.which === 'TEXT');
                    if (!all || !all.body) continue;

                    const parsed = await simpleParser(all.body);

                    // Filtrar correos que tengan más de 15 minutos de antigüedad (15 * 60 * 1000 ms)
                    // Preferimos item.attributes.date (Fecha IMAP Interna) que es mucho más precisa.
                    const exactDate = (item.attributes && item.attributes.date) ? item.attributes.date : parsed.date;
                    const emailDate = exactDate ? new Date(exactDate).getTime() : 0;
                    const fifteenMinsAgo = Date.now() - 15 * 60 * 1000;

                    if (!emailDate || emailDate < fifteenMinsAgo) {
                        console.log(`[DEBUG] Correo ignorado (>15 min o sin fecha). Fecha email: ${exactDate}`);
                        continue;
                    }

                    const subject = (parsed.subject || "").toString().toLowerCase();
                    accountLogs.subjects.push(subject);
                    accountLogs.scanned++;

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
                                accountLogs.found = true;
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
                                        if (code) {
                                            accountLogs.found = true;
                                            return code;
                                        }
                                    }
                                }
                            }
                        } else if (platformLower.includes('disney')) {
                            // Disney: asunto debe decir "código de acceso único para Disney+"
                            const disneyKeywords = [
                                'código de acceso único para disney',
                                'codigo de acceso unico para disney',
                                'disney+ one-time passcode',
                                'disney+ access code',
                                'one-time passcode'
                            ];
                            const isDisneyEmail = disneyKeywords.some(kw => subject.includes(kw) || textContent.includes(kw));
                            if (isDisneyEmail) {
                                const codeMatch = textContent.match(/\b\d{6}\b/);
                                if (codeMatch) {
                                    accountLogs.found = true;
                                    return codeMatch[0];
                                }
                            }
                        } else if (platformLower.includes('hbomax')) {
                            // HBO Max: asunto "Urgente: Tu código de un solo uso de HBO Max"
                            const hboKeywords = [
                                'urgente: tu código de un solo uso de hbo max',
                                'urgente: tu codigo de un solo uso de hbo max',
                                'tu código de un solo uso de hbo',
                                'hbo max one-time passcode',
                                'hbo one-time code',
                                'código de un solo uso de max',
                                'codigo de un solo uso de max'
                            ];
                            const isHboEmail = hboKeywords.some(kw => subject.includes(kw) || textContent.includes(kw));
                            if (isHboEmail) {
                                const codeMatch = textContent.match(/\b\d{6}\b/);
                                if (codeMatch) {
                                    accountLogs.found = true;
                                    return codeMatch[0];
                                }
                            }
                        } else if (platformLower.includes('prime')) {
                            // Prime Video: asunto "amazon.com: Intento de acceso a los datos de la cuenta"
                            const primeKeywords = [
                                'intento de acceso a los datos de la cuenta',
                                'amazon.com: intento de acceso',
                                'amazon sign-in attempt',
                                'your amazon sign-in code',
                                'código de acceso de amazon',
                                'codigo de acceso de amazon'
                            ];
                            const isPrimeEmail = primeKeywords.some(kw => subject.includes(kw) || textContent.includes(kw));
                            if (isPrimeEmail) {
                                const codeMatch = textContent.match(/\b\d{6}\b/);
                                if (codeMatch) {
                                    accountLogs.found = true;
                                    return codeMatch[0];
                                }
                            }
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
                                // Algoritmo Extractor Global
                                const pureText = textContent.replace(/[\s\-_;&]+/g, '');
                                const pureHtml = htmlContent.replace(/<[^>]*>?/gm, '').toLowerCase().replace(/[\s\-_;&]+/g, '');
                                const combined = pureText + " " + pureHtml;

                                const regexGrupos = /(?:^|\D)(\d{4,8})(?=$|\D)/g;
                                const matches = combined.match(regexGrupos);

                                if (matches) {
                                    for (let m of matches) {
                                        const num = m.replace(/\D/g, '');
                                        if (num.length === 4 && (num.startsWith('202') || num.startsWith('199'))) {
                                            continue;
                                        }
                                        console.log(`[DEBUG] Código Extractor Global hallado: ${num}`);
                                        accountLogs.found = true;
                                        return num;
                                    }
                                }
                                console.log('[DEBUG] No se encontró ningún número válido en el mensaje de inicio de sesión.');
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(`[DEBUG] Error en ${account.email}:`, err.message);
                accountLogs.error = err.message;
            } finally {
                if (connection) {
                    try { connection.end(); } catch (e) { }
                }
                debugInfo.push(accountLogs);
            }
            return null;
        };

        // Ejecutar todas las búsquedas simultáneamente
        const results = await Promise.all(accounts.map(acc => checkAccount(acc)));
        const foundCode = results.find(r => r !== null);

        if (foundCode) {
            console.log(`[DEBUG] ÉXITO FINAL: ${foundCode}`);
            return res.json({ success: true, code: foundCode, debugTree: debugInfo });
        } else {
            return res.status(404).json({ success: false, error: 'Código no encontrado. Revisa si el correo ya llegó o si faltan cuentas por vincular.', debugTree: debugInfo });
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
