require('dotenv').config();
const express = require('express');
const cors = require('cors');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const axios = require('axios');
const cheerio = require('cheerio');

// Anti-bot
const puppeteerCore = require('puppeteer-core');
const { addExtra } = require('puppeteer-extra');
const puppeteer = addExtra(puppeteerCore);
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
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
    // Las URLs de Netflix no deben ser raspadas directamente con axios porque Netflix redirige al login
    // e inyecta la IP IPv6 de AWS (ej: 2600:xxxx) en reactContext, provocando falsos códigos '2600'.
    // El enlace debe ser retornado directamente para que el cliente/vendedor lo abra en su navegador.
    return null;
}

// ============================================================
// HELPER: Activar enlace de ViX con el Bot Invisible
// ============================================================
async function executeVixActivation(vixLink, email) {
    console.log(`[VIX-BOT] Bot ejecutando activación automática para ViX: ${vixLink}`);

    // 1º Si hay un Bot Local en Firebase, enviarle la petición para que abra Chrome en la PC del usuario
    try {
        const botUrlResp = await axios.get(`${FIREBASE_DB_URL}/config/botUrl.json`, { timeout: 3000 });
        const botUrl = botUrlResp.data;
        if (botUrl && botUrl.startsWith('http')) {
            console.log(`[VIX-BOT] 🔀 Bot local detectado en Firebase: ${botUrl}. Reenviando activación a la PC...`);
            const localResp = await axios.post(`${botUrl}/api/activate-vix`, { email, vixLink }, {
                timeout: 90000,
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (localResp.data && localResp.data.success) {
                console.log(`[VIX-BOT] ✅ Bot local en la PC completó la activación de ViX.`);
                return localResp.data;
            }
        }
    } catch (e) {
        console.warn(`[VIX-BOT] Bot local no disponible o falló (${e.message}). Continuando con navegador en Render...`);
    }

    let browser = null;
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');
        await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        await page.goto(vixLink, { waitUntil: 'networkidle2', timeout: 35000 });
        await new Promise(r => setTimeout(r, 2500));

        // Hacer clic en "Entendido", "Continuar", "Aceptar" o "Iniciar sesión"
        let clicked = null;
        for (let i = 0; i < 12; i++) {
            clicked = await page.evaluate(() => {
                const els = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
                for (const el of els) {
                    const t = (el.innerText || el.textContent || '').trim().toLowerCase();
                    if (t === 'entendido' || t === 'continuar' || t === 'aceptar' || t.includes('entendido')) {
                        el.click();
                        return (el.innerText || el.textContent || '').trim();
                    }
                }
                return null;
            });
            if (clicked) {
                console.log(`[VIX-BOT] ✅ Botón presionado en Render: "${clicked}"`);
                break;
            }
            await new Promise(r => setTimeout(r, 1000));
        }

        await new Promise(r => setTimeout(r, 3500));
        console.log(`[VIX-BOT] Sesión activada en ViX correctamente vía Puppeteer en Render.`);
        return { success: true };
    } catch (err) {
        console.error(`[VIX-BOT] Falló la automatización de ViX: ${err.message}`);
        return { success: false, error: 'No se pudo completar la activación automática de ViX.' };
    } finally {
        if (browser) {
            try { await browser.close(); } catch (e) { }
        }
    }
}

// ============================================================
// HELPER: Resolver código temporal de 4 dígitos de Netflix
// ============================================================
function extract4DigitCode(text) {
    if (!text) return null;
    const clean = text.toString();
    // 1. Coincidencia cercana a la palabra "código" o "code"
    const contextMatch = clean.match(/(?:c[oó]digo|code)[^\d]{1,30}(\b\d{4}\b)/i);
    if (contextMatch && contextMatch[1]) {
        const c = contextMatch[1];
        if (!['2023', '2024', '2025', '2026', '2027', '2028'].includes(c)) return c;
    }
    // 2. Coincidencia en todo el texto descartando años y resoluciones
    const allMatches = clean.match(/\b\d{4}\b/g);
    if (allMatches) {
        const valid = allMatches.filter(m => !['2023', '2024', '2025', '2026', '2027', '2028', '1080', '1920', '0000'].includes(m));
        if (valid.length > 0) return valid[0];
    }
    return null;
}

async function resolveNetflixTempCode(travelLink, email) {
    console.log(`[NETFLIX-TEMP] 🎫 Solicitando resolución de código temporal para: ${email}`);
    console.log(`[NETFLIX-TEMP] 🔗 Enlace: ${travelLink}`);

    // 1º Prioridad: Enviar al Bot Local en la PC del usuario (IP residencial)
    try {
        const botUrlResp = await axios.get(`${FIREBASE_DB_URL}/config/botUrl.json`, { timeout: 3000 });
        const botUrl = botUrlResp.data;
        if (botUrl && botUrl.startsWith('http')) {
            console.log(`[NETFLIX-TEMP] 🔀 Bot local detectado en Firebase: ${botUrl}. Solicitando extracción de código...`);
            const localResp = await axios.post(`${botUrl}/api/get-netflix-temp-code`, { email, travelLink }, {
                timeout: 90000,
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (localResp.data && localResp.data.success && localResp.data.code) {
                console.log(`[NETFLIX-TEMP] ✅ Bot local extrajo el código con éxito: ${localResp.data.code}`);
                return localResp.data.code;
            } else if (localResp.data && localResp.data.code) {
                return localResp.data.code;
            }
        }
    } catch (e) {
        console.warn(`[NETFLIX-TEMP] Bot local no disponible o falló (${e.message}). Intentando navegador en Render...`);
    }

    // 2º Fallback: Ejecución en Render con Puppeteer
    let browser = null;
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        await page.goto(travelLink, { waitUntil: 'networkidle2', timeout: 35000 });
        await new Promise(r => setTimeout(r, 2500));

        let bodyText = await page.evaluate(() => (document.body ? document.body.innerText : '') || '');
        let code = extract4DigitCode(bodyText);
        if (code) {
            console.log(`[NETFLIX-TEMP] Código encontrado en pantalla antes de clic: ${code}`);
            return code;
        }

        // Buscar y hacer clic en el botón "Obtener código"
        const clicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a, [role="button"], input[type="submit"]'));
            for (const b of buttons) {
                const txt = (b.innerText || b.textContent || b.value || '').trim().toLowerCase();
                if (txt.includes('obtener c') || txt.includes('obtener codigo') || txt.includes('get code') || (txt.includes('código') && !txt.includes('volver'))) {
                    b.click();
                    return txt;
                }
            }
            const primaryBtn = document.querySelector('button[type="submit"], [data-uia*="travel"], [data-uia*="verify"], [data-uia*="action-button"], .btn-submit, .btn-primary');
            if (primaryBtn) {
                primaryBtn.click();
                return 'primary-submit-btn';
            }
            return null;
        });

        if (clicked) {
            console.log(`[NETFLIX-TEMP] Clic en botón: ${clicked}. Esperando código...`);
            await new Promise(r => setTimeout(r, 3500));
            bodyText = await page.evaluate(() => (document.body ? document.body.innerText : '') || '');
            code = extract4DigitCode(bodyText);
            if (code) {
                console.log(`[NETFLIX-TEMP] ✅ Código extraído con éxito tras clic en Render: ${code}`);
                return code;
            }
        }
    } catch (renderErr) {
        console.warn(`[NETFLIX-TEMP] Render Puppeteer no pudo extraer el código: ${renderErr.message}`);
    } finally {
        if (browser) {
            try { await browser.close(); } catch (_) { }
        }
    }

    // 3º Fallback seguro: Si no se pudo obtener el número en headless, devolver el enlace de viaje
    console.log(`[NETFLIX-TEMP] Retornando enlace de viaje como fallback seguro: ${travelLink}`);
    return travelLink;
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

                    // Filtrar por antigüedad del correo:
                    // Para Prime Video y ViX el usuario requiere que no supere los 3 minutos de antigüedad.
                    const exactDate = (item.attributes && item.attributes.date) ? item.attributes.date : parsed.date;
                    const emailDate = exactDate ? new Date(exactDate).getTime() : 0;
                    const platformLower = platform.toLowerCase();
                    const maxAgeMinutes = (platformLower.includes('prime') || platformLower.includes('vix')) ? 3 : 10;
                    const minAllowedTime = Date.now() - (maxAgeMinutes * 60 * 1000);

                    if (!emailDate || emailDate < minAllowedTime) {
                        console.log(`[DEBUG] Correo ignorado (>${maxAgeMinutes} min o sin fecha). Fecha email: ${exactDate}`);
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

                    // isFromPlatform: verifica que el correo sea de la plataforma seleccionada
                    let isFromPlatform = false;
                    if (platformLower === 'logincode') {
                        isFromPlatform = true;
                    } else if (platformLower.includes('hbomax') || platformLower.includes('max')) {
                        // HBO Max envía desde dominios hbo.com, max.com, hbomax.com
                        const normSub = subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        const normTxt = textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        const normFr = fromText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                        isFromPlatform = normSub.includes('hbo') || normSub.includes('max') ||
                            normFr.includes('hbo') || normFr.includes('max.com') ||
                            normSub.includes('codigo de un solo uso') || normSub.includes('un solo uso') ||
                            normSub.includes('codigo unico') ||
                            normTxt.includes('codigo de un solo uso de hbo max') ||
                            normTxt.includes('codigo de un solo uso') ||
                            normTxt.includes('codigo unico para hbo max');
                    } else if (platformLower === 'prime') {
                        // Prime Video / Amazon envía desde amazon.com
                        isFromPlatform = subject.includes('amazon') || fromText.includes('amazon') ||
                            subject.includes('prime') || fromText.includes('prime') ||
                            subject.includes('intento de acceso a los datos de la cuenta') ||
                            textContent.includes('intento de acceso a los datos de la cuenta');
                    } else if (platformLower.includes('disney')) {
                        const normSub = subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        const normTxt = textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        const normFr = fromText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                        // Búsqueda 1: ¿Vas a actualizar tu Hogar de Disney+? (Actualizar Hogar)
                        const matchHogar = normSub.includes('vas a actualizar tu hogar') ||
                            normSub.includes('actualizar tu hogar') ||
                            normSub.includes('hogar de disney') ||
                            normTxt.includes('vas a actualizar tu hogar') ||
                            normTxt.includes('actualizar tu hogar');

                        // Búsqueda 2: Tu código de acceso único para Disney+ (Fuera de casa / Acceso Único / Disney TV)
                        const matchFueraCasa = normSub.includes('tu codigo de acceso unico') ||
                            normSub.includes('codigo de acceso unico') ||
                            normSub.includes('codigo de acceso') ||
                            normSub.includes('one-time passcode') ||
                            normSub.includes('one time passcode') ||
                            normTxt.includes('tu codigo de acceso unico') ||
                            normTxt.includes('codigo de acceso unico') ||
                            normTxt.includes('codigo de acceso unico para disney');

                        const isDisneySender = normFr.includes('disney') || normSub.includes('disney');

                        if (platformLower === 'disney_tv') {
                            isFromPlatform = matchFueraCasa || (isDisneySender && (normSub.includes('codigo') || normTxt.includes('codigo')));
                        } else {
                            isFromPlatform = matchHogar || matchFueraCasa || isDisneySender;
                        }
                    } else if (platformLower === 'vix') {
                        isFromPlatform = subject.includes('vix') || fromText.includes('vix') ||
                            subject.includes('inicia sesión en tu cuenta de vix') ||
                            subject.includes('inicia sesion en tu cuenta de vix') ||
                            textContent.includes('inicia sesión en tu cuenta de vix') ||
                            textContent.includes('inicia sesion en tu cuenta de vix') ||
                            textContent.includes('cuenta de vix');
                    } else if (platformLower.includes('hbo') || platformLower.includes('max')) {
                        const normSub = subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        const normTxt = textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        const normFr = fromText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        isFromPlatform = normSub.includes('hbo') || normSub.includes('max') ||
                            normFr.includes('hbo') || normFr.includes('max') ||
                            normTxt.includes('hbo') || normTxt.includes('max') ||
                            normSub.includes('codigo') || normTxt.includes('codigo');
                    } else if (platformLower.includes('netflix')) {
                        const isNetflixSender = fromText.includes('netflix') || subject.includes('netflix');
                        const isPasswordEmail = subject.includes('contraseña') || subject.includes('password') || subject.includes('restablec') || textContent.includes('restablecer tu contraseña');

                        if (isPasswordEmail) {
                            // Ignorar correos de restablecimiento de contraseña para códigos de streaming
                            isFromPlatform = false;
                        } else if (platformLower === 'netflix_temp') {
                            const isTempSubject = subject.includes('temporal') || subject.includes('viaje') || subject.includes('travel') || subject.includes('acceso') || subject.includes('código') || subject.includes('codigo') || textContent.includes('acceso temporal') || textContent.includes('temporal') || textContent.includes('15 minutos');
                            isFromPlatform = isNetflixSender && isTempSubject;
                        } else if (platformLower === 'netflix_update') {
                            const isUpdateSubject = subject.includes('hogar') || subject.includes('household') || subject.includes('actualiz') || textContent.includes('actualizar tu hogar');
                            isFromPlatform = isNetflixSender && isUpdateSubject;
                        } else {
                            isFromPlatform = isNetflixSender;
                        }
                    } else {
                        isFromPlatform = subject.includes(platformLower) || fromText.includes(platformLower);
                    }
                    const mentionsEmail = textContent.includes(targetEmail) || htmlContent.toLowerCase().includes(targetEmail);
                    const isPasswordEmail = subject.includes('contraseña') || subject.includes('password') || subject.includes('restablec') || textContent.includes('restablecer tu contraseña');

                    if ((isFromPlatform || mentionsEmail) && !isPasswordEmail) {
                        console.log(`[DEBUG] ¡MATCH ENCONTRADO en ${account.email}!`);
                        if (platformLower.includes('netflix')) {
                            if (platformLower.includes('mfa') || platformLower.includes('verify') || platformLower.includes('6digit')) {
                                // Código de verificación de 6 dígitos de Netflix (MFA)
                                const normSub = subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                                const isMfaSubject = normSub.includes('verificacion') || normSub.includes('seguridad') || normSub.includes('codigo') || normSub.includes('verification');
                                if (isMfaSubject || isNetflixSender) {
                                    let matches = textContent.match(/\b\d{6}\b/g) || [];
                                    if (matches.length === 0) {
                                        const htmlText = htmlContent.replace(/<[^>]*>/gm, ' ');
                                        matches = htmlText.match(/\b\d{6}\b/g) || [];
                                    }
                                    const validCode = matches.find(m => m !== '000000');
                                    if (validCode) {
                                        accountLogs.found = true;
                                        console.log(`[DEBUG] Código Netflix MFA de 6 dígitos encontrado: ${validCode}`);
                                        return validCode;
                                    }
                                }
                            } else if (platformLower === 'netflix_temp') {
                                // En correos de acceso temporal de Netflix, el código oficial se obtiene abriendo el enlace oficial de viaje
                                const $ = cheerio.load(htmlContent);
                                const links = [];
                                $('a').each((j, el) => {
                                    const href = $(el).attr('href');
                                    if (href && (href.includes('netflix.com') || href.includes('nflx.it'))) {
                                        const hrefL = href.toLowerCase();
                                        if (!hrefL.includes('password') && !hrefL.includes('reset') && !hrefL.includes('passwords')) {
                                            links.push(href);
                                        }
                                    }
                                });

                                for (const link of links) {
                                    if (link.includes('travel') || link.includes('verify') || link.includes('token') || link.includes('update-primary-location')) {
                                        accountLogs.found = true;
                                        console.log(`[DEBUG] Enlace temporal Netflix oficial encontrado: ${link}`);
                                        // Resolver automáticamente el código de 4 dígitos mediante el bot local / Render Puppeteer
                                        const resolvedCode = await resolveNetflixTempCode(link, account.email);
                                        return resolvedCode;
                                    }
                                }

                                // Si por alguna razón viniera un código de 4 dígitos explícito en el texto
                                const explicitCodeMatch = textContent.match(/c[oó]digo(?:\s+de\s+acceso)?(?:\s+temporal)?\s*[:\s]\s*(\b\d{4}\b)/i);
                                if (explicitCodeMatch && explicitCodeMatch[1]) {
                                    accountLogs.found = true;
                                    console.log(`[DEBUG] Código temporal Netflix explícito en texto: ${explicitCodeMatch[1]}`);
                                    return explicitCodeMatch[1];
                                }
                            } else if (platformLower === 'netflix_update') {
                                // Para actualizaciones de hogar, devolvemos el enlace directamente (excluyendo estrictamente passwords)
                                const $ = cheerio.load(htmlContent);
                                const links = [];
                                $('a').each((j, el) => {
                                    const href = $(el).attr('href');
                                    if (href && (href.includes('netflix.com') || href.includes('nflx.it'))) {
                                        const hrefL = href.toLowerCase();
                                        if (!hrefL.includes('password') && !hrefL.includes('reset') && !hrefL.includes('passwords')) {
                                            links.push(href);
                                        }
                                    }
                                });
                                for (const link of links) {
                                    if (link.includes('verify') || link.includes('token') || link.includes('travel') || link.includes('update-primary-location') || link.includes('account/update-primary-location')) {
                                        accountLogs.found = true;
                                        return link; // Retorna el link seguro para que el frontend lo abra
                                    }
                                }
                            } else {
                                // Para código normal de TV / CEL / PC de 4 dígitos
                                const codeMatch = textContent.match(/\b\d{4}\b/);
                                if (codeMatch && !subject.toLowerCase().includes('hogar') && (textContent.includes('código') || textContent.includes('codigo') || textContent.includes('access') || textContent.includes('acceso') || subject.includes('netflix'))) {
                                    accountLogs.found = true;
                                    return codeMatch[0];
                                } else {
                                    const $ = cheerio.load(htmlContent);
                                    const links = [];
                                    $('a').each((j, el) => {
                                        const href = $(el).attr('href');
                                        if (href && href.includes('netflix.com')) {
                                            const hrefL = href.toLowerCase();
                                            if (!hrefL.includes('password') && !hrefL.includes('reset') && !hrefL.includes('passwords')) {
                                                links.push(href);
                                            }
                                        }
                                    });
                                    for (const link of links) {
                                        if (link.includes('verify') || link.includes('token') || link.includes('travel') || link.includes('update-primary-location')) {
                                            accountLogs.found = true;
                                            return link;
                                        }
                                    }
                                }
                            }
                        } else if (platformLower.includes('disney')) {
                            // Normalización para búsqueda exacta sin problemas de tildes o signos
                            const normSubject = subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const normText = textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const normFrom = fromText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                            // BÚSQUEDA 1: ¿Vas a actualizar tu Hogar de Disney+? (Si el cliente le dio a "Actualizar Hogar")
                            const isHogarMatch = normSubject.includes('vas a actualizar tu hogar') ||
                                normSubject.includes('actualizar tu hogar') ||
                                normSubject.includes('hogar de disney') ||
                                normText.includes('vas a actualizar tu hogar') ||
                                normText.includes('actualizar tu hogar de disney');

                            // BÚSQUEDA 2: Tu código de acceso único para Disney+ (Si el cliente le dio a "Fuera de Casa" o "Disney TV")
                            const isFueraCasaMatch = normSubject.includes('tu codigo de acceso unico') ||
                                normSubject.includes('codigo de acceso unico') ||
                                normSubject.includes('codigo de acceso') ||
                                normSubject.includes('one-time passcode') ||
                                normSubject.includes('one time passcode') ||
                                normText.includes('tu codigo de acceso unico') ||
                                normText.includes('codigo de acceso unico') ||
                                normText.includes('codigo de acceso unico para disney');

                            const isDisneySender = normFrom.includes('disney') || normSubject.includes('disney');

                            const isMatch = platformLower === 'disney_tv'
                                ? (isFueraCasaMatch || (isDisneySender && (normSubject.includes('codigo') || normText.includes('codigo'))))
                                : (isHogarMatch || isFueraCasaMatch || isDisneySender);

                            if (isMatch) {
                                // Extraemos el código numérico de 6 dígitos
                                let matches = [];
                                const subjectCodeMatch = subject.match(/\b\d{6}\b/);
                                if (subjectCodeMatch) matches.push(subjectCodeMatch[0]);

                                const textMatches = textContent.match(/\b\d{6}\b/g) || [];
                                matches.push(...textMatches);

                                if (matches.length === 0) {
                                    const htmlText = htmlContent.replace(/<[^>]*>/gm, ' ').toLowerCase();
                                    const htmlMatches = htmlText.match(/\b\d{6}\b/g) || [];
                                    matches.push(...htmlMatches);
                                }

                                const validCode = matches.find(m => m !== '000000');
                                if (validCode) {
                                    const detected = platformLower === 'disney_tv'
                                        ? 'disney_tv'
                                        : (isHogarMatch ? 'hogar' : (isFueraCasaMatch ? 'fuera_de_casa' : 'disney'));
                                    console.log(`[DEBUG] Código Disney+ de 6 dígitos encontrado (${detected}): ${validCode}`);
                                    accountLogs.found = true;
                                    return {
                                        code: validCode,
                                        detectedType: detected
                                    };
                                }
                            }
                        } else if (platformLower.includes('hbomax') || platformLower.includes('max')) {
                            // HBO Max / Max: frase clave "Tu código de un solo uso de HBO Max", "Tu código único para HBO Max es" y extracción de 6 dígitos
                            const hboPhraseKeywords = [
                                'tu código de un solo uso de hbo max',
                                'tu codigo de un solo uso de hbo max',
                                'código de un solo uso de hbo max',
                                'codigo de un solo uso de hbo max',
                                'tu código de un solo uso de max',
                                'tu codigo de un solo uso de max',
                                'código de un solo uso de max',
                                'codigo de un solo uso de max',
                                'tu código de un solo uso',
                                'tu codigo de un solo uso',
                                'código de un solo uso',
                                'codigo de un solo uso',
                                'un solo uso de hbo max',
                                'un solo uso de max',
                                'un solo uso',
                                'tu código único para hbo max es',
                                'tu codigo unico para hbo max es',
                                'tu código único para hbo max',
                                'tu codigo unico para hbo max',
                                'código único para hbo max',
                                'codigo unico para hbo max',
                                'código único para max',
                                'codigo unico para max',
                                'tu código único',
                                'tu codigo unico',
                                'código único',
                                'codigo unico',
                                'one-time passcode for hbo max',
                                'one-time passcode',
                                'hbo max',
                                'max'
                            ];
                            const normSub = subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const normTxt = textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                            const hasHboPhrase = hboPhraseKeywords.some(kw => {
                                const normKw = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                return normSub.includes(normKw) ||
                                    normTxt.includes(normKw) ||
                                    subject.includes(kw) ||
                                    textContent.includes(kw) ||
                                    htmlContent.toLowerCase().includes(kw);
                            });

                            // Extraemos el código numérico de 6 dígitos
                            let matches = [];
                            const subjectCodeMatch = subject.match(/\b\d{6}\b/);
                            if (subjectCodeMatch) matches.push(subjectCodeMatch[0]);

                            const textMatches = textContent.match(/\b\d{6}\b/g) || [];
                            matches.push(...textMatches);

                            if (matches.length === 0) {
                                const htmlText = htmlContent.replace(/<[^>]*>/gm, ' ').toLowerCase();
                                const htmlMatches = htmlText.match(/\b\d{6}\b/g) || [];
                                matches.push(...htmlMatches);
                            }
                            const validCode = matches.find(m => m !== '000000');
                            if (validCode) {
                                const detected = platformLower === 'hbomax_tv' ? 'hbomax_tv' : (platformLower.includes('update') ? 'fuera_de_casa' : 'hbomax');
                                console.log(`[DEBUG] Código HBO Max de 6 dígitos encontrado (${detected}): ${validCode}`);
                                accountLogs.found = true;
                                return {
                                    code: validCode,
                                    detectedType: detected
                                };
                            }
                        } else if (platformLower.includes('prime')) {
                            // Prime Video / Amazon: frase clave "Intento de acceso a los datos de la cuenta" y código de 6 dígitos
                            const primePhraseKeywords = [
                                'intento de acceso a los datos de la cuenta',
                                'intento de acceso',
                                'código de verificación',
                                'codigo de verificacion',
                                'código temporal',
                                'codigo temporal',
                                'amazon',
                                'prime video'
                            ];
                            const hasPrimePhrase = primePhraseKeywords.some(kw =>
                                subject.includes(kw) ||
                                textContent.includes(kw) ||
                                htmlContent.toLowerCase().includes(kw)
                            );

                            // Extraemos el código numérico de 6 dígitos
                            let matches = textContent.match(/\b\d{6}\b/g) || [];
                            if (matches.length === 0) {
                                const htmlText = htmlContent.replace(/<[^>]*>/gm, ' ').toLowerCase();
                                matches = htmlText.match(/\b\d{6}\b/g) || [];
                            }
                            const validCode = matches.find(m => m !== '000000');
                            if (validCode) {
                                console.log(`[DEBUG] Código Prime Video de 6 dígitos encontrado: ${validCode}`);
                                accountLogs.found = true;
                                return validCode;
                            }
                        } else if (platformLower.includes('vix')) {
                            // ViX: Enlace en el botón 'Iniciar sesión' para activar directamente
                            const $ = cheerio.load(htmlContent);
                            let vixLink = null;

                            // 1. Buscar enlaces cuyo texto sea "Iniciar sesión" o variantes
                            $('a').each((j, el) => {
                                const text = $(el).text().toLowerCase().trim();
                                const href = $(el).attr('href');
                                if (href && (text.includes('iniciar sesión') || text.includes('iniciar sesion') || text.includes('acceder'))) {
                                    vixLink = href;
                                    return false;
                                }
                            });

                            // 2. Si no lo encuentra por texto, buscar enlaces a vix.com con tokens / click tracking
                            if (!vixLink) {
                                $('a').each((j, el) => {
                                    const href = $(el).attr('href');
                                    if (href && (href.includes('vix.com') || href.includes('vix')) && !href.includes('unsubscribe') && !href.includes('terms') && !href.includes('privacy')) {
                                        vixLink = href;
                                        return false;
                                    }
                                });
                            }

                            if (vixLink) {
                                console.log(`[DEBUG] Enlace de acceso a ViX encontrado: ${vixLink}`);
                                accountLogs.found = true;
                                return vixLink;
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
            const finalCode = (typeof foundCode === 'object' && foundCode.code) ? foundCode.code : foundCode;
            const detectedType = (typeof foundCode === 'object' && foundCode.detectedType) ? foundCode.detectedType : null;

            if (platform.toLowerCase() === 'vix') {
                console.log(`[DEBUG] ViX detectado. Ejecutando enlace en segundo plano por el bot...`);
                const vixResult = await executeVixActivation(finalCode, email);
                if (vixResult && vixResult.success) {
                    return res.json({
                        success: true,
                        activated: true,
                        platform: 'vix',
                        code: 'ACTIVADO',
                        message: '¡Tu dispositivo ViX ha sido activado con éxito! Ya puedes abrir la app en tu celular.'
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        error: vixResult && vixResult.error ? vixResult.error : 'No se pudo confirmar la activación en ViX.'
                    });
                }
            }

            console.log(`[DEBUG] ÉXITO FINAL: ${finalCode} (tipo: ${detectedType || 'estándar'})`);
            return res.json({ success: true, code: finalCode, detectedType: detectedType, debugTree: debugInfo });
        } else {
            const notFoundMsg = platform.toLowerCase() === 'vix'
                ? 'Aún no hemos detectado el correo de ViX. Abre la app en tu celular, pulsa "Iniciar sesión con enlace" y luego vuelve a pulsar "Activar Celular ViX".'
                : 'Código no encontrado. Revisa si el correo ya llegó o si faltan cuentas por vincular.';
            return res.status(404).json({ success: false, error: notFoundMsg, debugTree: debugInfo });
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

    // ── PROXY: Si hay un bot local registrado en Firebase, reenviarle la petición ──
    try {
        const botUrlResp = await axios.get(`${FIREBASE_DB_URL}/config/botUrl.json`, { timeout: 3000 });
        const botUrl = botUrlResp.data;
        if (botUrl && botUrl.startsWith('http')) {
            console.log(`[TV-BOT] 🔀 Bot local detectado en Firebase: ${botUrl}. Reenviando petición...`);
            try {
                const proxyResp = await axios.post(`${botUrl}/api/activate-tv`, req.body, {
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                console.log(`[TV-BOT] ✅ Respuesta del bot local recibida.`);
                return res.status(proxyResp.status).json(proxyResp.data);
            } catch (proxyErr) {
                console.warn(`[TV-BOT] ⚠️ Bot local no respondió (${proxyErr.message}). Usando Render como respaldo...`);
            }
        }
    } catch (e) {
        // Firebase no accesible o sin botUrl — continuar con flujo normal de Render
    }

    let browser = null;
    try {
        console.log(`[TV-BOT] Iniciando activación TV en Render: email=${email}, code=${tvCode}`);

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
            args: [
                ...chromium.args,
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            defaultViewport: { width: 1280, height: 800 },
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        // 3. Iniciar sesión en Netflix primero
        console.log(`[TV-BOT] Navegando a netflix.com/login...`);
        await page.goto('https://www.netflix.com/login', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1500));

        // 4. Ingresar email con soporte de múltiples selectores
        const emailSelectors = [
            'input[name="userLoginId"]',
            'input[data-uia="login-field"]',
            'input[autocomplete="email"]',
            'input[type="email"]',
            'input[id*="userLoginId"]'
        ];
        let emailInput = null;
        for (const sel of emailSelectors) {
            emailInput = await page.$(sel);
            if (emailInput) break;
        }

        if (!emailInput) {
            try {
                await page.waitForSelector('input[name="userLoginId"], input[data-uia="login-field"], input[type="email"], input[type="text"]', { visible: true, timeout: 8000 });
                emailInput = await page.$('input[name="userLoginId"], input[data-uia="login-field"], input[type="email"], input[type="text"]');
            } catch (e) {
                console.log(`[TV-BOT] Selector de email no apareció de inmediato en ${page.url()}`);
            }
        }

        if (!emailInput) {
            const screenshotBase64 = await page.screenshot({ encoding: 'base64' });
            await browser.close();
            return res.status(500).json({
                success: false,
                error: `Netflix no mostró el campo de correo en ${page.url()}.`,
                screenshot: `data:image/png;base64,${screenshotBase64}`
            });
        }

        await new Promise(r => setTimeout(r, 500));
        await emailInput.click({ clickCount: 3 });
        await emailInput.type(targetEmail, { delay: 90 });

        // Presionar Enter para avanzar a la contraseña si es flujo de 2 pasos
        await new Promise(r => setTimeout(r, 500));
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 3000));

        // Verificar si la contraseña está visible o pide "Usar contraseña"
        let passInput = await page.$('input[name="password"], input[type="password"]');
        let passVisible = false;
        if (passInput) {
            const box = await passInput.boundingBox();
            if (box && box.width > 0 && box.height > 0) passVisible = true;
        }

        if (!passVisible) {
            // Intentar pulsar "Usar contraseña" si Netflix sugiere inicio por link/código
            await page.evaluate(async () => {
                const elements = Array.from(document.querySelectorAll('button, a, span, div[role="button"]'));
                const el = elements.find(b => {
                    const txt = b.innerText ? b.innerText.toLowerCase().trim() : '';
                    return txt === 'usar contraseña' || txt.includes('usar contrase') || txt.includes('use password');
                });
                if (el) el.click();
            });
            await new Promise(r => setTimeout(r, 1500));
            passInput = await page.$('input[name="password"], input[type="password"]');
        }

        if (passInput) {
            console.log(`[TV-BOT] Escribiendo contraseña...`);
            await passInput.click({ clickCount: 3 });
            await passInput.type(netflixPass.replace(/\s+/g, ''), { delay: 75 });
            await new Promise(r => setTimeout(r, 500));
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => { }),
                page.keyboard.press('Enter')
            ]);
        }

        console.log(`[TV-BOT] Credenciales enviadas, esperando sesión...`);
        await new Promise(r => setTimeout(r, 3000));

        const afterLoginUrl = page.url();
        console.log(`[TV-BOT] URL tras login: ${afterLoginUrl}`);

        if (afterLoginUrl.includes('/login') && !afterLoginUrl.includes('/tv8')) {
            const errorText = await page.evaluate(() => {
                const errDiv = document.querySelector('.ui-message-contents, header, .error-message, [data-uia="error-message-container"]');
                return errDiv ? errDiv.innerText : document.body.innerText.substring(0, 300);
            });
            const screenshotBase64 = await page.screenshot({ encoding: 'base64' });
            await browser.close();
            return res.status(401).json({
                success: false,
                error: `Netflix rechazó el inicio de sesión: "${errorText.replace(/\n/g, ' ')}".`,
                screenshot: `data:image/png;base64,${screenshotBase64}`
            });
        }

        // 8. Navegar a netflix.com/tv8 con sesión activa
        console.log(`[TV-BOT] Navegando a netflix.com/tv8...`);
        await page.goto('https://www.netflix.com/tv8', { waitUntil: 'networkidle2', timeout: 25000 });
        await new Promise(r => setTimeout(r, 2000));

        // 9. Ingresar código de activación (8 dígitos)
        const cleanCode = tvCode.replace(/[^0-9]/g, '');
        console.log(`[TV-BOT] Código limpio a ingresar en tv8: ${cleanCode}`);

        await page.waitForSelector('input', { timeout: 10000 });

        const pinInputs = await page.$$('input[data-uia^="pin-number-"], input.pin-number-input');
        if (pinInputs.length >= cleanCode.length) {
            for (let i = 0; i < cleanCode.length; i++) {
                await pinInputs[i].click();
                await pinInputs[i].type(cleanCode[i], { delay: 80 });
            }
        } else {
            const singleInput = await page.$('input[type="text"], input[type="tel"], input[type="number"], input.code-input');
            if (singleInput) {
                await singleInput.click({ clickCount: 3 });
                await singleInput.type(cleanCode, { delay: 100 });
            } else {
                const inputs = await page.$$('input');
                if (inputs.length >= cleanCode.length) {
                    for (let i = 0; i < cleanCode.length; i++) {
                        await inputs[i].click();
                        await inputs[i].type(cleanCode[i], { delay: 80 });
                    }
                } else if (inputs.length > 0) {
                    await inputs[0].click({ clickCount: 3 });
                    await inputs[0].type(cleanCode, { delay: 100 });
                }
            }
        }

        console.log(`[TV-BOT] Código ${cleanCode} ingresado, buscando botón de confirmar...`);

        // 10. Click en el botón de confirmar
        await new Promise(r => setTimeout(r, 1000));
        const submitBtn = await page.$('button[data-uia="witcher-code-submit"], button[type="submit"], button.nf-btn-primary, button[data-uia="action-button"]');
        if (submitBtn) {
            await submitBtn.click();
        } else {
            await page.keyboard.press('Enter');
        }

        // 11. Esperar resultado
        await new Promise(r => setTimeout(r, 4000));
        const finalUrl = page.url();
        const pageText = await page.evaluate(() => document.body.innerText);
        console.log(`[TV-BOT] URL final: ${finalUrl}`);

        await browser.close();
        browser = null;

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

        let customScreenshot = null;
        if (browser && !err.message.includes('browser has disconnected')) {
            try {
                const pages = await browser.pages();
                if (pages.length > 0) {
                    customScreenshot = await pages[0].screenshot({ encoding: 'base64' });
                }
                await browser.close();
            } catch (e) { }
        }

        const errorPayload = {
            success: false,
            error: 'Error interno: ' + err.message
        };
        if (customScreenshot) {
            errorPayload.screenshot = `data:image/png;base64,${customScreenshot}`;
        }

        // Dar mensaje específico según el error
        if (err.message.includes('timeout') || err.message.includes('Navigation')) {
            errorPayload.error = 'Netflix tardó demasiado. Detalle: ' + err.message;
            return res.status(500).json(errorPayload);
        }
        return res.status(500).json(errorPayload);
    }
});

// ============================================================
// PROXIES PARA ACTIVACIONES DE TV HACIA EL BOT RESIDENCIAL LOCAL
// ============================================================
const forwardToLocalBot = async (endpoint, req, res) => {
    try {
        const botUrlResp = await axios.get(`${FIREBASE_DB_URL}/config/botUrl.json`, { timeout: 3000 });
        const botUrl = botUrlResp.data;
        if (botUrl && botUrl.startsWith('http')) {
            const proxyResp = await axios.post(`${botUrl}${endpoint}`, req.body, {
                timeout: 120000,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            return res.status(proxyResp.status).json(proxyResp.data);
        }
    } catch (e) {
        console.warn(`[PROXY] Error reenviando a bot local ${endpoint}:`, e.message);
    }
    return res.status(503).json({
        success: false,
        error: 'El bot local de activación en la PC del administrador no está disponible en este momento.'
    });
};

app.post('/api/activate-hbo-tv', (req, res) => forwardToLocalBot('/api/activate-hbomax-tv', req, res));
app.post('/api/activate-hbomax-tv', (req, res) => forwardToLocalBot('/api/activate-hbomax-tv', req, res));
app.post('/api/activate-prime-tv', (req, res) => forwardToLocalBot('/api/activate-prime-tv', req, res));
app.post('/api/activate-crunchyroll-tv', (req, res) => forwardToLocalBot('/api/activate-crunchyroll-tv', req, res));
app.post('/api/activate-disney-tv', (req, res) => forwardToLocalBot('/api/activate-disney-tv', req, res));
app.post('/api/activate-vix-tv', (req, res) => forwardToLocalBot('/api/activate-vix-tv', req, res));
app.post('/api/netflix-account-login', (req, res) => forwardToLocalBot('/api/netflix-account-login', req, res));
app.post('/api/disney-account-login', (req, res) => forwardToLocalBot('/api/disney-account-login', req, res));
app.post('/api/hbomax-account-login', (req, res) => forwardToLocalBot('/api/hbomax-account-login', req, res));
app.post('/api/prime-account-login', (req, res) => forwardToLocalBot('/api/prime-account-login', req, res));
app.post('/api/paramount-account-login', (req, res) => forwardToLocalBot('/api/paramount-account-login', req, res));
app.post('/api/activate-netflix-tv', (req, res) => {
    req.url = '/api/activate-tv';
    app._router.handle(req, res);
});

// Proxy para consultar estado de la cola
app.get('/api/queue-status', async (req, res) => {
    try {
        const botUrlResp = await axios.get(`${FIREBASE_DB_URL}/config/botUrl.json`, { timeout: 3000 });
        const botUrl = botUrlResp.data;
        if (botUrl && botUrl.startsWith('http')) {
            const qResp = await axios.get(`${botUrl}/api/queue-status`, {
                timeout: 5000,
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            return res.status(qResp.status).json(qResp.data);
        }
    } catch (e) { }
    return res.json({ success: true, isBusy: false, queueLength: 0 });
});

// Ruta de salud para verificar que el servidor está vivo
app.get('/', (req, res) => {
    res.send('🚀 Backend de Streaming DPC está funcionando correctamente.');
});

app.listen(PORT, () => {
    console.log(`🚀 Servicio Backend ejecutándose en el puerto ${PORT}`);
});
