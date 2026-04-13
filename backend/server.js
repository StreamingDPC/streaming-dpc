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
        
        // 2. Probar con cada cuenta configurada (EN PARALELO para evitar timeouts)
        console.log(`Iniciando búsqueda en paralelo en ${accounts.length} cuentas...`);

        const searchPromises = accounts.map(async (account) => {
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

            let connection = null;
            try {
                connection = await imaps.connect(imapConfig);
                
                // Para Gmail, lo mejor es buscar en "All Mail" (Todos) para no perder correos de Promociones/Social
                let folderToOpen = 'INBOX';
                if (account.email.includes('gmail.com')) {
                    const boxes = await connection.getBoxes();
                    // Intentamos encontrar la carpeta "All Mail" o "Todos"
                    const gmailBox = boxes['[Gmail]'] || boxes['[gmail]'];
                    if (gmailBox && gmailBox.children) {
                        if (gmailBox.children['All Mail']) folderToOpen = '[Gmail]/All Mail';
                        else if (gmailBox.children['Todos']) folderToOpen = '[Gmail]/Todos';
                    }
                }

                await connection.openBox(folderToOpen);
                console.log(`Buscando en ${account.email} - Carpeta: ${folderToOpen}`);

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const imapDate = `${yesterday.getDate()}-${monthNames[yesterday.getMonth()]}-${yesterday.getFullYear()}`;

                const searchCriteria = [['SINCE', imapDate]];
                
                if (platform === 'netflix') {
                    searchCriteria.push(['OR', ['FROM', 'netflix.com'], ['SUBJECT', 'Netflix']]);
                } else if (platform === 'disney') {
                    searchCriteria.push(['OR', ['FROM', 'disney'], ['SUBJECT', 'Disney']]);
                }

                const messages = await connection.search(searchCriteria, { bodies: ['HEADER', 'TEXT'], markSeen: false });
                console.log(`Cta ${account.email}: ${messages.length} msgs encontrados.`);

                for (let i = messages.length - 1; i >= 0; i--) {
                    const item = messages[i];
                    const all = item.parts.find(a => a.which === 'TEXT');
                    const parsed = await simpleParser(all.body);
                    const subject = (parsed.subject || "").toLowerCase();
                    const textContent = (parsed.text || "").toLowerCase();
                    const htmlContent = parsed.html || "";
                    const recipientText = (parsed.to && parsed.to.text) ? parsed.to.text.toLowerCase() : "";
                    const fromText = parsed.from ? parsed.from.text.toLowerCase() : "";

                    const isFromPlatform = subject.includes(platform) || fromText.includes(platform);
                    const mentionsEmail = textContent.includes(email.toLowerCase()) || 
                                         recipientText.includes(email.toLowerCase()) || 
                                         htmlContent.toLowerCase().includes(email.toLowerCase());

                    if (isFromPlatform || mentionsEmail) {
                        console.log(`¡Coincidencia! Analizando "${parsed.subject}" en ${account.email}`);
                        if (platform === 'netflix') {
                            const codeMatch = textContent.match(/\b\d{4}\b/);
                            if (codeMatch && (textContent.includes('código') || textContent.includes('access') || subject.includes('netflix'))) {
                                connection.end();
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
                                            connection.end();
                                            return code;
                                        }
                                    }
                                }
                            }
                        } else if (platform === 'disney') {
                            // Extraemos cualquier código de 6 dígitos que aparezca en un correo de Disney
                            const codeMatch = textContent.match(/\b\d{6}\b/);
                            if (codeMatch) {
                                connection.end();
                                return codeMatch[0];
                            }
                        }
                    }
                }
                connection.end();
            } catch (err) {
                if (connection) connection.end();
                console.error(`Error en cuenta ${account.email}:`, err.message);
            }
            return null;
        });

        const results = await Promise.all(searchPromises);
        let foundCode = results.find(code => code !== null);

        if (foundCode) {
            return res.json({ success: true, code: foundCode });
        } else {
            return res.status(404).json({ success: false, error: 'Código no encontrado. Verifica si el correo llegó a la bandeja de entrada y si la cuenta de Gmail vinculada es la correcta.' });
        }

    } catch (err) {
        console.error("General Backend Error:", err);
        return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servicio Backend ejecutándose en el puerto ${PORT}`);
});
