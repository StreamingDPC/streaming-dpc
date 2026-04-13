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
        // 1. Obtener todas las cuentas de correo registradas en Firebase
        console.log("Consultando cuentas de correo en Firebase...");
        const dbResponse = await axios.get(`${FIREBASE_DB_URL}/emailAccounts.json`);
        const accountsData = dbResponse.data;

        if (!accountsData) {
            return res.status(404).json({ success: false, error: 'No hay cuentas de correo configuradas en el sistema.' });
        }

        const accounts = Object.values(accountsData);
        let foundCode = null;

        // 2. Probar con cada cuenta configurada
        for (const account of accounts) {
            console.log(`Intentando buscar en la cuenta: ${account.email}...`);
            
            const imapConfig = {
                imap: {
                    user: account.email,
                    password: account.password,
                    host: account.email.includes('gmail.com') ? 'imap.gmail.com' : 'imap.titan.email',
                    port: 993,
                    tls: true,
                    authTimeout: 5000,
                    tlsOptions: { rejectUnauthorized: false }
                }
            };

            try {
                const connection = await imaps.connect(imapConfig);
                await connection.openBox('INBOX');

                const yesterday = new Date();
                yesterday.setTime(Date.now() - (24 * 3600 * 1000));

                const searchCriteria = [['SINCE', yesterday.toISOString()]];
                
                if (platform === 'netflix') {
                    searchCriteria.push(['OR', ['FROM', 'netflix.com'], ['SUBJECT', 'Hogar']]);
                } else if (platform === 'disney') {
                    searchCriteria.push(['OR', ['FROM', 'disneyplus.com'], ['SUBJECT', 'código']]);
                }

                const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false };
                const messages = await connection.search(searchCriteria, fetchOptions);

                for (let i = messages.length - 1; i >= 0; i--) {
                    const item = messages[i];
                    const all = item.parts.find(a => a.which === 'TEXT');
                    const parsed = await simpleParser(all.body);
                    const textContent = (parsed.text || "").toLowerCase();
                    const htmlContent = parsed.html || "";

                    // Verificar si el correo es para el cliente específico
                    if (textContent.includes(email.toLowerCase()) || htmlContent.toLowerCase().includes(email.toLowerCase()) || parsed.subject.toLowerCase().includes(email.toLowerCase())) {
                        
                        if (platform === 'netflix') {
                            const codeMatch = textContent.match(/\b\d{4}\b/);
                            if (codeMatch) {
                                foundCode = codeMatch[0];
                            } else {
                                const $ = cheerio.load(htmlContent);
                                const links = [];
                                $('a').each((i, el) => {
                                    const href = $(el).attr('href');
                                    if (href && href.includes('netflix.com')) links.push(href);
                                });

                                for (const link of links) {
                                    if (link.includes('verify') || link.includes('token') || link.includes('travel')) {
                                        foundCode = await getCodeFromNetflixUrl(link);
                                        if (foundCode) break;
                                    }
                                }
                            }
                        } else if (platform === 'disney') {
                            const codeMatch = textContent.match(/\b\d{6}\b/);
                            if (codeMatch) foundCode = codeMatch[0];
                        }
                    }
                    if (foundCode) break;
                }

                connection.end();
                if (foundCode) break; // Si encontramos código, dejamos de buscar en otras cuentas

            } catch (err) {
                console.error(`Error conectando a ${account.email}:`, err.message);
                // Continuar con la siguiente cuenta si esta falla
            }
        }

        if (foundCode) {
            return res.json({ success: true, code: foundCode });
        } else {
            return res.status(404).json({ success: false, error: 'Código no encontrado. Asegúrate de que el correo haya llegado recientemente.' });
        }

    } catch (err) {
        console.error("General Backend Error:", err);
        return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servicio Backend ejecutándose en el puerto ${PORT}`);
});
