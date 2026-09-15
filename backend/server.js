require('dotenv').config();
const express = require('express');
const cors = require('cors');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

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
                let allMessages = await connection.search(searchCriteria, { bodies: [''], markSeen: false });

                // Extraer solo los últimos 20 para procesar rapidísimo
                let messages = allMessages.slice(-20);

                accountLogs.scanned = 0; // Iniciar contador

                for (let i = messages.length - 1; i >= 0; i--) {
                    const item = messages[i];
                    if (!item || !item.parts) continue;

                    // 'which: ""' (o identificador principal) trae el fuente crudo con headers MIME
                    const all = item.parts.find(a => a.which === '');
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

                    // isFromPlatform: verifica que el correo sea de la plataforma seleccionada
                    let isFromPlatform = false;
                    if (platformLower === 'logincode') {
                        isFromPlatform = true;
                    } else if (platformLower === 'hbomax') {
                        // HBO Max envía desde dominios hbo.com, max.com, hbomax.com
                        isFromPlatform = subject.includes('hbo') || subject.includes(' max') ||
                            fromText.includes('hbo') || fromText.includes('max.com');
                    } else if (platformLower === 'prime') {
                        // Prime Video / Amazon envía desde amazon.com
                        isFromPlatform = subject.includes('amazon') || fromText.includes('amazon');
                    } else {
                        isFromPlatform = subject.includes(platformLower) || fromText.includes(platformLower);
                    }
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
                            // Disney: el correo ya fue confirmado como de Disney por isFromPlatform
                            // (subject o from contiene 'disney'). Extraemos el 1er número de 6 dígitos.
                            // Buscamos primero en texto plano, luego en HTML limpio.
                            let matches = textContent.match(/\b\d{6}\b/g) || [];
                            if (matches.length === 0) {
                                const htmlText = htmlContent.replace(/<[^>]*>/gm, ' ').toLowerCase();
                                matches = htmlText.match(/\b\d{6}\b/g) || [];
                            }
                            const validCode = matches.find(m => m !== '000000');
                            if (validCode) {
                                accountLogs.found = true;
                                return validCode;
                            }
                        } else if (platformLower.includes('hbomax')) {
                            // HBO Max: correo confirmado por isFromPlatform (contiene hbo/max).
                            // Extraer el primer número de 6 dígitos.
                            let matches = textContent.match(/\b\d{6}\b/g) || [];
                            if (matches.length === 0) {
                                const htmlText = htmlContent.replace(/<[^>]*>/gm, ' ').toLowerCase();
                                matches = htmlText.match(/\b\d{6}\b/g) || [];
                            }
                            const validCode = matches.find(m => m !== '000000');
                            if (validCode) {
                                accountLogs.found = true;
                                return validCode;
                            }
                        } else if (platformLower.includes('prime')) {
                            // Prime Video: correo confirmado por isFromPlatform (contiene amazon).
                            // Extraer el primer número de 6 dígitos.
                            let matches = textContent.match(/\b\d{6}\b/g) || [];
                            if (matches.length === 0) {
                                const htmlText = htmlContent.replace(/<[^>]*>/gm, ' ').toLowerCase();
                                matches = htmlText.match(/\b\d{6}\b/g) || [];
                            }
                            const validCode = matches.find(m => m !== '000000');
                            if (validCode) {
                                accountLogs.found = true;
                                return validCode;
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

// ============================================================
// ENDPOINT: Activar Smart TV en Netflix (Robot Invisible)
// ============================================================
app.post('/api/activate-tv', async (req, res) => {
    const { email, tvCode, phone } = req.body;

    if (!email || !tvCode) {
        return res.status(400).json({ success: false, error: 'Email y código de TV son requeridos.' });
    }

    let browser = null;
    try {
        console.log(`[TV-BOT] Iniciando activación TV: email=${email}, code=${tvCode}`);

        // 1. Buscar la contraseña de Netflix en las ventas (clientSales y sellerSales)
        // La contraseña está en cada venta bajo sale.screens[n].password donde platform=Netflix
        let netflixPass = null;
        const targetEmail = email.toLowerCase().trim();

        // Buscar en clientSales
        try {
            const salesResp = await axios.get(`${FIREBASE_DB_URL}/clientSales.json`);
            const salesData = salesResp.data;
            if (salesData) {
                // clientSales es un objeto donde cada clave es teléfono y el valor es array de ventas
                for (const phone of Object.keys(salesData)) {
                    const sales = salesData[phone];
                    const salesArr = Array.isArray(sales) ? sales : Object.values(sales);
                    for (const sale of salesArr) {
                        if (!sale || !sale.items) continue;
                        const items = Array.isArray(sale.items) ? sale.items : Object.values(sale.items);
                        for (const item of items) {
                            if (!item || !item.specificEmails) continue;
                            const screens = Array.isArray(item.specificEmails) ? item.specificEmails : Object.values(item.specificEmails);
                            for (const screen of screens) {
                                if (screen && screen.email && screen.email.toLowerCase().trim() === targetEmail
                                    && screen.platform && screen.platform.toLowerCase().includes('netflix')
                                    && screen.pass) {
                                    netflixPass = screen.pass.trim();
                                    console.log(`[TV-BOT] Contraseña Netflix encontrada en clientSales (phone=${phone})`);
                                    break;
                                }
                            }
                            if (netflixPass) break;
                        }
                        if (netflixPass) break;
                    }
                    if (netflixPass) break;
                }
            }
        } catch (e) {
            console.warn('[TV-BOT] Error buscando en clientSales:', e.message);
        }

        // Si no encontró en clientSales, buscar en sellerSales
        if (!netflixPass) {
            try {
                const sellerResp = await axios.get(`${FIREBASE_DB_URL}/sellerSales.json`);
                const sellerData = sellerResp.data;
                if (sellerData) {
                    for (const seller of Object.keys(sellerData)) {
                        const sales = sellerData[seller];
                        const salesArr = Array.isArray(sales) ? sales : Object.values(sales);
                        for (const sale of salesArr) {
                            if (!sale || !sale.items) continue;
                            const items = Array.isArray(sale.items) ? sale.items : Object.values(sale.items);
                            for (const item of items) {
                                if (!item || !item.specificEmails) continue;
                                const screens = Array.isArray(item.specificEmails) ? item.specificEmails : Object.values(item.specificEmails);
                                for (const screen of screens) {
                                    if (screen && screen.email && screen.email.toLowerCase().trim() === targetEmail
                                        && screen.platform && screen.platform.toLowerCase().includes('netflix')
                                        && screen.pass) {
                                        netflixPass = screen.pass.trim();
                                        console.log(`[TV-BOT] Contraseña Netflix encontrada en sellerSales (seller=${seller})`);
                                        break;
                                    }
                                }
                                if (netflixPass) break;
                            }
                            if (netflixPass) break;
                        }
                        if (netflixPass) break;
                    }
                }
            } catch (e) {
                console.warn('[TV-BOT] Error buscando en sellerSales:', e.message);
            }
        }

        if (!netflixPass) {
            return res.status(404).json({ success: false, error: `No se encontró la contraseña de Netflix para ${email}. Verifica que esté registrada en la configuración de pantallas de la venta.` });
        }

        console.log(`[TV-BOT] Contraseña encontrada, iniciando navegador invisible...`);

        // 2. Lanzar Puppeteer con Chromium (compatible con Render)
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        // User-Agent real para no ser detectado como bot
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // 3. Ir a la página de login de Netflix
        console.log(`[TV-BOT] Navegando a Netflix login...`);
        await page.goto('https://www.netflix.com/login', { waitUntil: 'networkidle2', timeout: 30000 });

        // 4. Ingresar email
        await page.waitForSelector('input[name="userLoginId"]', { timeout: 10000 });
        await page.type('input[name="userLoginId"]', account.email, { delay: 80 });

        // 5. Ingresar contraseña
        await page.waitForSelector('input[name="password"]', { timeout: 10000 });
        await page.type('input[name="password"]', netflixPass.replace(/\s+/g, ''), { delay: 80 });

        // 6. Click en Sign In
        await page.click('button[type="submit"]');
        console.log(`[TV-BOT] Credenciales enviadas, esperando sesión...`);

        // 7. Esperar que cargue la sesión (hasta 20 seg)
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });

        // Verificar si el login fue exitoso (si redirige a /browse o /tv*)
        const currentUrl = page.url();
        console.log(`[TV-BOT] URL tras login: ${currentUrl}`);

        if (currentUrl.includes('/login')) {
            await browser.close();
            return res.status(401).json({ success: false, error: 'Credenciales de Netflix incorrectas. Verifica la contraseña en la configuración.' });
        }

        // 8. Navegar a la página de activación de TV
        console.log(`[TV-BOT] Navegando a netflix.com/tv8...`);
        await page.goto('https://www.netflix.com/tv8', { waitUntil: 'networkidle2', timeout: 20000 });

        // 9. Buscar el campo de código y escribirlo
        // Netflix usa inputs tipo text o number, uno por dígito o un solo campo
        await page.waitForSelector('input', { timeout: 10000 });

        // Intentar con campo único primero
        const singleInput = await page.$('input[type="text"], input[type="tel"], input[type="number"], input.code-input');
        if (singleInput) {
            await singleInput.click({ clickCount: 3 });
            await singleInput.type(tvCode.replace(/[^0-9]/g, ''), { delay: 100 });
        } else {
            // Múltiples inputs (uno por dígito)
            const inputs = await page.$$('input');
            const digits = tvCode.replace(/[^0-9]/g, '').split('');
            for (let i = 0; i < inputs.length && i < digits.length; i++) {
                await inputs[i].click();
                await inputs[i].type(digits[i], { delay: 80 });
            }
        }

        console.log(`[TV-BOT] Código ${tvCode} ingresado, buscando botón de confirmar...`);

        // 10. Click en el botón de confirmar / continuar
        await page.waitForTimeout(1000);
        const submitBtn = await page.$('button[type="submit"], button.nf-btn-primary, button[data-uia="action-button"]');
        if (submitBtn) {
            await submitBtn.click();
        } else {
            await page.keyboard.press('Enter');
        }

        // 11. Esperar resultado (3-5 seg)
        await page.waitForTimeout(4000);
        const finalUrl = page.url();
        const pageText = await page.evaluate(() => document.body.innerText);
        console.log(`[TV-BOT] URL final: ${finalUrl}`);

        await browser.close();
        browser = null;

        // Verificar si hubo éxito
        const successKeywords = ['activado', 'activated', 'connected', 'conectado', 'enjoy', 'listo', 'signed in', 'iniciado sesión'];
        const errorKeywords = ['invalid', 'inválido', 'incorrect', 'incorrecto', 'expired', 'expirado', 'vuelv', 'try again'];

        const isSuccess = successKeywords.some(kw => pageText.toLowerCase().includes(kw)) || finalUrl.includes('browse');
        const isError = errorKeywords.some(kw => pageText.toLowerCase().includes(kw));

        if (isError) {
            return res.json({ success: false, error: 'Código de TV inválido o expirado. Pide un nuevo código en tu TV e intenta de nuevo.' });
        }

        console.log(`[TV-BOT] ✅ Activación exitosa!`);
        return res.json({ success: true, message: '¡TV activado exitosamente! Ya puedes disfrutar Netflix en tu Smart TV.' });

    } catch (err) {
        console.error('[TV-BOT] Error:', err.message);
        if (browser) { try { await browser.close(); } catch (e) { } }

        // Dar mensaje específico según el error
        if (err.message.includes('timeout') || err.message.includes('Navigation')) {
            return res.status(500).json({ success: false, error: 'Netflix tardó demasiado en responder. Intenta de nuevo en un momento.' });
        }
        return res.status(500).json({ success: false, error: 'Error al activar la TV. Intenta de nuevo o contacta al administrador.' });
    }
});

// Ruta de salud para verificar que el servidor está vivo
app.get('/', (req, res) => {
    res.send('🚀 Backend de Streaming DPC está funcionando correctamente.');
});

app.listen(PORT, () => {
    console.log(`🚀 Servicio Backend ejecutándose en el puerto ${PORT}`);
});
