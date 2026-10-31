/**
 * =====================================================================
 *  🤖 StreamingDPC — Bot Local de Activación de TV (IP Residencial)
 * =====================================================================
 *  ▸ Corre en tu PC, con tu IP de casa → Netflix no lo bloquea.
 *  ▸ Escucha en http://localhost:3099
 *  ▸ La contraseña se lee de Firebase y NUNCA se muestra al cliente ni al vendedor.
 *
 *  INSTALACIÓN (una sola vez):
 *    1. Abre una terminal (CMD o PowerShell) en esta carpeta
 *    2. Ejecuta:  npm install
 *    3. Ejecuta:  node local-bot.js
 *    4. Deja la ventana abierta mientras uses la app
 *
 *  Para que arranque automáticamente con Windows:
 *    Crea un acceso directo a este archivo en:
 *    C:\Users\TU_USUARIO\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
 * =====================================================================
 */

require('dotenv').config();
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// ── Puppeteer con Stealth (usa Chrome instalado en tu PC) ──────────────────
const { addExtra } = require('puppeteer-extra');
const puppeteerCore = require('puppeteer-core');
const puppeteer = addExtra(puppeteerCore);
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// ── Encontrar Chrome instalado automáticamente ─────────────────────────────
const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.CHROME_PATH || ''
].filter(Boolean);

function getChromePath() {
    const fs = require('fs');
    for (const p of chromePaths) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

// ── Firebase ───────────────────────────────────────────────────────────────
const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL || 'https://streamingdpc-7e7fa-default-rtdb.firebaseio.com';

// ── Servidor Express ───────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = 3099;

// ── Health check ───────────────────────────────────────────────────────────
app.get('/status', (req, res) => {
    res.json({ online: true, source: 'local-bot', time: new Date().toISOString() });
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Al arrancar: registrar y mantener URL pública de ngrok en Firebase ──────
let currentRegisteredNgrokUrl = null;

async function registerNgrokUrl() {
    try {
        const resp = await axios.get('http://localhost:4040/api/tunnels', { timeout: 3000 });
        const tunnels = resp.data && resp.data.tunnels;
        if (tunnels && tunnels.length > 0) {
            const https = tunnels.find(t => t.proto === 'https') || tunnels[0];
            const publicUrl = https.public_url;
            if (publicUrl) {
                // Verificar periódicamente si Firebase aún conserva la URL o si cambió
                try {
                    const fbCheck = await axios.get(`${FIREBASE_DB_URL}/config/botUrl.json`, { timeout: 3000 });
                    if (!fbCheck.data || fbCheck.data !== publicUrl) {
                        await axios.put(`${FIREBASE_DB_URL}/config/botUrl.json`, JSON.stringify(publicUrl));
                        console.log(`[BOT] 🌐 URL pública ngrok registrada/restaurada en Firebase: ${publicUrl}`);
                        console.log(`[BOT] ✅ Clientes desde celular y redes externas listos para activar TV.`);
                    }
                } catch (fbErr) {
                    await axios.put(`${FIREBASE_DB_URL}/config/botUrl.json`, JSON.stringify(publicUrl)).catch(() => {});
                }
                currentRegisteredNgrokUrl = publicUrl;
            }
            return publicUrl;
        }
    } catch (e) {
        // ngrok no disponible en este ciclo
    }
    return null;
}

// Mantener vivo y sincronizado el enlace de ngrok continuamente cada 15 segundos
setInterval(registerNgrokUrl, 15000);

// ── Al cerrar el bot: limpiar la URL de Firebase ───────────────────────────
async function clearBotUrl() {
    try {
        await axios.delete(`${FIREBASE_DB_URL}/config/botUrl.json`);
        console.log('[BOT] 🧹 URL pública eliminada de Firebase.');
    } catch (e) { /* silencioso */ }
}

// ── Función unificada: buscar contraseña por plataforma (Excel + Firebase Activas) ──
async function findPlatformPassword(targetEmail, platformKeywords, excelSheetKey, logTag = 'BOT') {
    const email = (targetEmail || '').toLowerCase().trim();
    if (!email) return null;

    const matchesPlat = (str) => {
        const low = (str || '').toLowerCase().trim();
        return platformKeywords.some(k => low.includes(k));
    };

    // 1. Buscar primero en el Excel en vivo (fuente de verdad exacta por hoja)
    try {
        const fs = require('fs');
        const { EXCEL_FILE_PATH, parseWorkbookFromBuffer } = require('./excel-sync');
        if (EXCEL_FILE_PATH && fs.existsSync(EXCEL_FILE_PATH)) {
            const recs = parseWorkbookFromBuffer(fs.readFileSync(EXCEL_FILE_PATH));
            const matchRec = recs.find(r =>
                r.sheetMeta && r.sheetMeta.key === excelSheetKey &&
                (r.email || '').toLowerCase().trim() === email &&
                r.password && r.password.trim() !== ''
            );
            if (matchRec) {
                console.log(`[${logTag}] ✅ Pass encontrado en Excel hoja ${excelSheetKey} (${matchRec.clientName})`);
                return matchRec.password.trim();
            }
        }
    } catch (e) {
        console.warn(`[${logTag}] Excel lookup warn:`, e.message);
    }

    // 2. Buscar en Firebase (clientSales y sellerSales), priorizando ventas ACTIVAS y más recientes
    try {
        const [csResp, ssResp] = await Promise.all([
            axios.get(`${FIREBASE_DB_URL}/clientSales.json`).catch(() => ({ data: null })),
            axios.get(`${FIREBASE_DB_URL}/sellerSales.json`).catch(() => ({ data: null }))
        ]);

        const allSales = [];
        const csData = csResp.data || {};
        for (const phone of Object.keys(csData)) {
            const salesArr = Array.isArray(csData[phone]) ? csData[phone] : Object.values(csData[phone] || {});
            for (const sale of salesArr) {
                if (sale && typeof sale === 'object') {
                    allSales.push({ source: `clientSales (${phone})`, sale });
                }
            }
        }

        const ssData = ssResp.data || {};
        for (const seller of Object.keys(ssData)) {
            const salesArr = Array.isArray(ssData[seller]) ? ssData[seller] : Object.values(ssData[seller] || {});
            for (const sale of salesArr) {
                if (sale && typeof sale === 'object') {
                    allSales.push({ source: `sellerSales (${seller})`, sale });
                }
            }
        }

        const now = Date.now();
        // Ordenar: activas primero, luego por fecha de vencimiento descendente (más recientes primero)
        allSales.sort((a, b) => {
            const expA = Number(a.sale.expirationDate) || 0;
            const expB = Number(b.sale.expirationDate) || 0;
            const actA = expA >= now ? 1 : 0;
            const actB = expB >= now ? 1 : 0;
            if (actA !== actB) return actB - actA;
            return expB - expA;
        });

        for (const { source, sale } of allSales) {
            if (!sale?.items) continue;
            const items = Array.isArray(sale.items) ? sale.items : Object.values(sale.items);
            for (const item of items) {
                if (!item) continue;
                const itemName = (item.name || '').toLowerCase();
                const isTargetItem = matchesPlat(itemName);

                if (item.specificEmails) {
                    const screens = Array.isArray(item.specificEmails) ? item.specificEmails : Object.values(item.specificEmails);
                    for (const s of screens) {
                        if (!s || (s.email || '').toLowerCase().trim() !== email || !s.pass) continue;
                        // Si la pantalla tiene plataforma asignada, DEBE coincidir con la plataforma buscada
                        // (evita tomar la contraseña de Netflix cuando el correo se repite en un combo con Prime Video)
                        const hasExplicitPlat = Boolean(s.platform && String(s.platform).trim() !== '');
                        const isMatch = hasExplicitPlat ? matchesPlat(s.platform) : (screens.length === 1 && isTargetItem);
                        if (isMatch) {
                            console.log(`[${logTag}] ✅ Pass encontrado en ${source}`);
                            return s.pass.trim();
                        }
                    }
                }

                if (isTargetItem && (!item.specificEmails || Object.keys(item.specificEmails).length <= 1)) {
                    if ((item.email || '').toLowerCase().trim() === email && item.pass) {
                        console.log(`[${logTag}] ✅ Pass encontrado en item de ${source}`);
                        return item.pass.trim();
                    }
                }
            }
        }
    } catch (e) {
        console.warn(`[${logTag}] Firebase lookup error:`, e.message);
    }

    return null;
}

async function findNetflixPassword(targetEmail) {
    return findPlatformPassword(targetEmail, ['netflix'], 'NO', 'BOT');
}

async function findPrimePassword(targetEmail) {
    return findPlatformPassword(targetEmail, ['prime', 'amazon'], 'PO', 'BOT-PRIME');
}

async function findCrunchyrollPassword(targetEmail) {
    return findPlatformPassword(targetEmail, ['crunch', 'roll'], 'CR', 'BOT-CRUNCHY');
}

async function findVixPassword(targetEmail) {
    return findPlatformPassword(targetEmail, ['vix'], 'VX', 'BOT-VIX');
}

// ── Cola de Activación Concurrente ─────────────────────────────────────────
const activationQueue = [];
let isProcessingQueue = false;

// Estado público de la cola
app.get('/api/queue-status', (req, res) => {
    const queueLength = activationQueue.length;
    const isBusy = isProcessingQueue;
    const estimatedSeconds = (queueLength + (isBusy ? 1 : 0)) * 32;
    res.json({
        success: true,
        isBusy,
        queueLength,
        estimatedSeconds
    });
});

// Función que procesa la cola elemento por elemento
async function processQueue() {
    if (isProcessingQueue || activationQueue.length === 0) return;
    isProcessingQueue = true;

    while (activationQueue.length > 0) {
        const item = activationQueue[0];
        try {
            if (item.platform === 'hbomax_tv') {
                console.log(`\n[BOT-QUEUE] ⏳ Procesando turno HBO Max TV: ${item.email} (Quedan en cola: ${activationQueue.length - 1})`);
                const result = await doActivateHboTv(item.email, item.tvCode);
                item.resolve(result);
            } else if (item.platform === 'prime_tv') {
                console.log(`\n[BOT-QUEUE] ⏳ Procesando turno Prime Video TV: ${item.email} (Quedan en cola: ${activationQueue.length - 1})`);
                const result = await doActivatePrimeTv(item.email, item.tvCode);
                item.resolve(result);
            } else if (item.platform === 'crunchyroll_tv') {
                console.log(`\n[BOT-QUEUE] ⏳ Procesando turno Crunchyroll TV: ${item.email} (Quedan en cola: ${activationQueue.length - 1})`);
                const result = await doActivateCrunchyrollTv(item.email, item.tvCode);
                item.resolve(result);
            } else if (item.platform === 'disney_code_tv') {
                console.log(`\n[BOT-QUEUE] ⏳ Procesando turno Disney+ TV con código: ${item.email} (Quedan en cola: ${activationQueue.length - 1})`);
                const result = await doActivateDisneyTv(item.email, item.tvCode);
                item.resolve(result);
            } else if (item.platform === 'vix_tv') {
                console.log(`\n[BOT-QUEUE] ⏳ Procesando turno ViX TV: ${item.email} (Quedan en cola: ${activationQueue.length - 1})`);
                const result = await doActivateVixTv(item.email, item.tvCode);
                item.resolve(result);
            } else if (item.platform === 'netflix_temp') {
                console.log(`\n[BOT-QUEUE] ⏳ Procesando turno Código Temporal Netflix: ${item.email} (Quedan en cola: ${activationQueue.length - 1})`);
                const result = await doGetNetflixTempCode(item.email, item.travelLink);
                item.resolve(result);
            } else if (item.platform === 'netflix_account_login') {
                console.log(`\n[BOT-QUEUE] ⏳ Procesando Ingreso de Cuenta Netflix (MFA + Dejar Abierta): ${item.email} (Quedan en cola: ${activationQueue.length - 1})`);
                const result = await doNetflixAccountLogin(item.email);
                item.resolve(result);
            } else {
                console.log(`\n[BOT-QUEUE] ⏳ Procesando turno Netflix TV: ${item.email} (Quedan en cola: ${activationQueue.length - 1})`);
                const result = await doActivateTv(item.email, item.tvCode);
                item.resolve(result);
            }
        } catch (err) {
            item.reject(err);
        } finally {
            activationQueue.shift(); // Remover el completado
        }
    }

    isProcessingQueue = false;
}

// ── ENDPOINT PRINCIPAL: Activar Netflix TV (Pasa por la cola ordenada) ──────
app.post('/api/activate-tv', async (req, res) => {
    const { email, tvCode } = req.body;

    if (!email || !tvCode) {
        return res.status(400).json({ success: false, error: 'Email y código de TV son requeridos.' });
    }

    // Colocar en la cola de espera para evitar colisiones
    const queuePromise = new Promise((resolve, reject) => {
        activationQueue.push({ platform: 'netflix_tv', email, tvCode, resolve, reject, time: Date.now() });
    });

    // Iniciar procesamiento en background si no estaba corriendo
    processQueue();

    try {
        const result = await queuePromise;
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'Error en la activación del bot local.'
        });
    }
});

// Alias para compatibilidad
app.post('/api/activate-netflix-tv', (req, res) => {
    req.url = '/api/activate-tv';
    app._router.handle(req, res);
});

// ── ENDPOINT: Ingreso de Cuentas Netflix (Login + MFA 6 Dígitos - Dejar Abierta) ──────
app.post('/api/netflix-account-login', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, error: 'Email de la cuenta es requerido.' });
    }

    const queuePromise = new Promise((resolve, reject) => {
        activationQueue.push({ platform: 'netflix_account_login', email, resolve, reject, time: Date.now() });
    });

    processQueue();

    try {
        const result = await queuePromise;
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'Error en el ingreso de cuenta Netflix en el bot local.'
        });
    }
});

// ── ENDPOINT: Activar HBO Max TV ───────────────────────────────────────────
app.post('/api/activate-hbomax-tv', async (req, res) => {
    const { email, tvCode } = req.body;

    if (!email || !tvCode) {
        return res.status(400).json({ success: false, error: 'Email y código de TV son requeridos.' });
    }

    const queuePromise = new Promise((resolve, reject) => {
        activationQueue.push({ platform: 'hbomax_tv', email, tvCode, resolve, reject, time: Date.now() });
    });

    processQueue();

    try {
        const result = await queuePromise;
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'Error en la activación de HBO Max en el bot local.'
        });
    }
});

// ── ENDPOINT: Activar Prime Video TV ───────────────────────────────────────
app.post('/api/activate-prime-tv', async (req, res) => {
    const { email, tvCode } = req.body;

    if (!email || !tvCode) {
        return res.status(400).json({ success: false, error: 'Email y código de TV son requeridos.' });
    }

    const queuePromise = new Promise((resolve, reject) => {
        activationQueue.push({ platform: 'prime_tv', email, tvCode, resolve, reject, time: Date.now() });
    });

    processQueue();

    try {
        const result = await queuePromise;
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'Error en la activación de Prime Video en el bot local.'
        });
    }
});

// ── ENDPOINT: Activar Crunchyroll TV ───────────────────────────────────────
app.post('/api/activate-crunchyroll-tv', async (req, res) => {
    const { email, tvCode } = req.body;

    if (!email || !tvCode) {
        return res.status(400).json({ success: false, error: 'Email y código de TV son requeridos.' });
    }

    const queuePromise = new Promise((resolve, reject) => {
        activationQueue.push({ platform: 'crunchyroll_tv', email, tvCode, resolve, reject, time: Date.now() });
    });

    processQueue();

    try {
        const result = await queuePromise;
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'Error en la activación de Crunchyroll en el bot local.'
        });
    }
});

// ── ENDPOINT: Activar Disney+ TV con código ─────────────────────────────────
app.post('/api/activate-disney-tv', async (req, res) => {
    const { email, tvCode } = req.body;

    if (!email || !tvCode) {
        return res.status(400).json({ success: false, error: 'Email y código de TV son requeridos.' });
    }

    const queuePromise = new Promise((resolve, reject) => {
        activationQueue.push({ platform: 'disney_code_tv', email, tvCode, resolve, reject, time: Date.now() });
    });

    processQueue();

    try {
        const result = await queuePromise;
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'Error en la activación de Disney+ en el bot local.'
        });
    }
});

// ── ENDPOINT: Activar ViX TV con código ─────────────────────────────────────
app.post('/api/activate-vix-tv', async (req, res) => {
    const { email, tvCode } = req.body;

    if (!email || !tvCode) {
        return res.status(400).json({ success: false, error: 'Email y código de TV son requeridos.' });
    }

    const queuePromise = new Promise((resolve, reject) => {
        activationQueue.push({ platform: 'vix_tv', email, tvCode, resolve, reject, time: Date.now() });
    });

    processQueue();

    try {
        const result = await queuePromise;
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'Error en la activación de ViX en el bot local.'
        });
    }
});

// ── ENDPOINT: Obtener Código Temporal Netflix (Pasa por la cola ordenada) ───
app.post('/api/get-netflix-temp-code', async (req, res) => {
    const { email, travelLink } = req.body;

    if (!travelLink) {
        return res.status(400).json({ success: false, error: 'travelLink es requerido.' });
    }

    const queuePromise = new Promise((resolve, reject) => {
        activationQueue.push({ platform: 'netflix_temp', email, travelLink, resolve, reject, time: Date.now() });
    });

    processQueue();

    try {
        const result = await queuePromise;
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || 'Error al obtener código temporal de Netflix en bot local.'
        });
    }
});

// ── LÓGICA DE ACTIVACIÓN CON CHROME (Segundo Plano) ────────────────────────
async function doActivateTv(email, tvCode) {
    let browser = null;
    try {
        console.log(`\n[BOT] ════════════════════════════════════`);
        console.log(`[BOT] Activando TV: ${email} → código: ${tvCode}`);

        // 1. Buscar contraseña
        const netflixPass = await findNetflixPassword(email);
        if (!netflixPass) {
            return {
                success: false,
                error: `No se encontró la contraseña de Netflix para ${email}. Verifica que esté en la configuración de pantallas de la venta.`
            };
        }
        console.log(`[BOT] 🔑 Contraseña lista (oculta). Iniciando Chrome en segundo plano...`);

        // 2. Lanzar Chrome local en segundo plano (fuera de la pantalla para no interrumpir al usuario)
        const chromePath = getChromePath();
        if (!chromePath) {
            return {
                success: false,
                error: 'Google Chrome no está instalado en esta PC. Instala Chrome e intenta de nuevo.'
            };
        }

        browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: false,  // false para que Netflix detecte navegación 100% humana y real
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--disable-backgrounding-occluded-windows',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--window-position=50,50', // Ventana visible en pantalla para supervisar el proceso
                '--window-size=1100,750'
            ]
        });

        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();

        // Simular navegador real
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });

        // Ocultar webdriver
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        // 3. Iniciar sesión en Netflix (SIEMPRE primero ingresar con la cuenta requerida)
        console.log(`[BOT] 🌐 Navegando a netflix.com/login para iniciar sesión (${email})...`);
        try {
            await page.goto('https://www.netflix.com/login', { waitUntil: 'domcontentloaded', timeout: 45000 });
        } catch (navErr) {
            console.warn(`[BOT] ⚠️ Advertencia en navegación: ${navErr.message}. Continuando...`);
        }
        await sleep(1500);

        let currentUrl = page.url();
        console.log(`[BOT] 🔗 URL detectada: ${currentUrl}`);

        // 4. Escribir email (soporte para múltiples selectores de Netflix)
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
                console.log(`[BOT] ⚠️ Selector estándar de email no apareció en ${page.url()}`);
            }
        }

        if (!emailInput) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.close();
            return {
                success: false,
                error: `Netflix no mostró el campo de correo en ${page.url()}.`,
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        await sleep(500);
        await emailInput.click({ clickCount: 3 });
        await emailInput.type(email, { delay: 90 });
        console.log(`[BOT] ✉️  Email escrito: ${email}`);

        // 5. Presionar Enter para avanzar
        console.log('[BOT] 🔄 Presionando Enter para continuar...');
        await sleep(800);
        await page.keyboard.press('Enter');
        console.log('[BOT] ⏳ Esperando pantalla de código o contraseña de Netflix...');
        await sleep(4000);

        // Detectar si Netflix pidió contraseña directamente o código OTP
        let passInput = await page.$('input[name="password"], input[type="password"]');
        let askedForPassword = false;
        if (passInput) {
            const box = await passInput.boundingBox();
            if (box && box.width > 0 && box.height > 0) {
                askedForPassword = true;
            }
        }

        if (askedForPassword && netflixPass) {
            console.log('[BOT] 🔒 Netflix solicitó contraseña. Escribiendo contraseña...');
            await passInput.click({ clickCount: 3 });
            await passInput.type(netflixPass.replace(/\s+/g, ''), { delay: 75 });
            await sleep(500);
            await page.keyboard.press('Enter');
            console.log('[BOT] ⏳ Esperando validación de contraseña...');
            await sleep(4000);
        }

        // Comprobar si Netflix requiere código OTP de correo (PIN / 2FA), ya sea antes o después de la contraseña
        const checkNeedsEmailOtp = async () => {
            return await page.evaluate(() => {
                const text = (document.body ? document.body.innerText : '') || '';
                const hasCodeText = /(?:enter the code|c[oó]digo que enviamos|enter a pin code|introduce un c[oó]digo|security code|c[oó]digo de seguridad|c[oó]digo de acceso|c[oó]digo de inicio)/i.test(text);
                const hasCodeInputs = document.querySelectorAll('input[autocomplete="one-time-code"], input[type="tel"], input[aria-label*="code" i], input[aria-label*="código" i]').length >= 4 ||
                    document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"])').length >= 4;
                return hasCodeText || hasCodeInputs;
            });
        };

        const needsEmailOtp = await checkNeedsEmailOtp();

        if (needsEmailOtp || !askedForPassword) {
            // 6. Leer código de inicio de sesión OTP (PIN) enviado al correo
            console.log('[BOT] 📨 Netflix solicitó código de acceso (PIN / 2FA) enviado al correo. Solicitando al backend...');
            let loginCode = null;
            const BACKEND_URL = 'https://streaming-backend-ce1u.onrender.com';

            for (let attempt = 1; attempt <= 12; attempt++) {
                try {
                    console.log(`[BOT] 🔍 Intento ${attempt}/12 de lectura del correo (${email})...`);
                    const codeResp = await axios.post(`${BACKEND_URL}/api/get-code`, {
                        email: email,
                        platform: 'logincode'
                    }, { timeout: 15000 });

                    if (codeResp.data && codeResp.data.code) {
                        loginCode = codeResp.data.code.toString().replace(/\D/g, '').substring(0, 4);
                        console.log(`[BOT] ✅ Código (PIN) recibido: ${loginCode}`);
                        break;
                    }
                } catch (e) {
                    console.log(`[BOT] ⚠️  Intento ${attempt} falló: ${e.message}`);
                }
                if (attempt < 12) {
                    await sleep(5000);
                }
            }

            if (!loginCode) {
                const ss = await page.screenshot({ encoding: 'base64' });
                await browser.close();
                return {
                    success: false,
                    error: 'Netflix solicitó código de verificación (PIN) enviado al correo, pero no se pudo leer del correo en 60 segundos. Verifica si llegó el código o intenta nuevamente.',
                    screenshot: `data:image/png;base64,${ss}`
                };
            }

            // 7. Escribir el código en los inputs
            console.log(`[BOT] ⌨️  Escribiendo código de acceso (PIN): ${loginCode}`);
            await sleep(1000);

            const codeInputs = await page.$$('input[autocomplete="one-time-code"], input[type="tel"], input[aria-label], input[type="text"], input:not([name]):not([type="hidden"])');
            if (codeInputs.length >= 4) {
                for (let i = 0; i < Math.min(4, loginCode.length); i++) {
                    await codeInputs[i].click();
                    await sleep(200);
                    await codeInputs[i].type(loginCode[i], { delay: 150 });
                }
            } else {
                await page.keyboard.type(loginCode, { delay: 200 });
            }

            await sleep(1000);
            await page.keyboard.press('Enter');
            console.log('[BOT] ⏳ Esperando validación del código...');
            await sleep(5000);
        }

        const afterLoginUrl = page.url();
        console.log(`[BOT] 🔗 URL tras login: ${afterLoginUrl}`);

        if (afterLoginUrl.includes('/login') && !afterLoginUrl.includes('/tv8')) {
            const errText = await page.evaluate(() => document.body.innerText.substring(0, 200));
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.close();
            return {
                success: false,
                error: `Netflix rechazó el acceso: "${errText}"`,
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        // 8. Navegar a netflix.com/tv8 con sesión activa
        console.log('[BOT] 📺 Navegando a netflix.com/tv8 con sesión activa...');
        try {
            await page.goto('https://www.netflix.com/tv8', { waitUntil: 'domcontentloaded', timeout: 40000 });
        } catch (navErr) {
            console.warn(`[BOT] ⚠️ Advertencia en navegación tv8: ${navErr.message}. Continuando...`);
        }
        await sleep(2000);

        // 10. Ingresar el código de activación de TV (8 dígitos)
        const codeDigits = tvCode.replace(/[^0-9]/g, '');
        console.log(`[BOT] 🔢 Ingresando código de activación en TV: ${codeDigits}`);

        const singleInput = await page.$('input[type="text"], input[type="tel"], input[type="number"]');
        if (singleInput) {
            await singleInput.click({ clickCount: 3 });
            await singleInput.type(codeDigits, { delay: 100 });
        } else {
            const inputs = await page.$$('input');
            for (let i = 0; i < inputs.length && i < codeDigits.length; i++) {
                await inputs[i].click();
                await inputs[i].type(codeDigits[i], { delay: 80 });
            }
        }

        // 11. Confirmar activación
        console.log('[BOT] ✅ Confirmando activación...');
        await sleep(800);
        const submitBtn = await page.$('button[type="submit"], button.nf-btn-primary, button[data-uia="action-button"]');
        if (submitBtn) {
            await submitBtn.click();
        } else {
            await page.keyboard.press('Enter');
        }

        // 12. Esperar resultado
        await sleep(5000);
        const finalUrl = page.url();
        const pageText = await page.evaluate(() => document.body.innerText);
        console.log(`[BOT] 🔗 URL final: ${finalUrl}`);

        // 13. Cierre y Limpieza de sesión
        console.log('[BOT] 🧹 Procediendo a limpiar sesión de Netflix...');
        try {
            // Limpieza a nivel de cookies del navegador
            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCookies');
            await client.send('Network.clearBrowserCache');
            console.log('[BOT] 🧼 Cookies y caché limpiados vía CDP.');
        } catch (e) { }

        try {
            await page.goto('https://www.netflix.com/SignOut', { waitUntil: 'networkidle2', timeout: 10000 });
            await sleep(1500);
            await page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('button, a'));
                for (let el of elements) {
                    const txt = (el.innerText || el.textContent || '').toLowerCase().trim();
                    if (txt === 'cerrar sesión' || txt === 'sign out' || txt.includes('cerrar sesion')) {
                        el.click();
                        break;
                    }
                }
            });
        } catch (e) { }

        await browser.close();
        browser = null;

        const isError = ['invalid', 'inválido', 'incorrect', 'incorrecto', 'expired', 'expirado', 'try again', 'vuelv'].some(
            kw => pageText.toLowerCase().includes(kw)
        );

        if (isError) {
            return { success: false, error: 'Código inválido o expirado. Obtén un nuevo código en tu TV.' };
        }

        if (finalUrl.includes('/login')) {
            console.log('[BOT] ❌ Error: Netflix redirigió a /login en vez de confirmar la TV.');
            return { success: false, error: 'Netflix no confirmó la vinculación de la TV (redirigió al inicio de sesión).' };
        }

        console.log('[BOT] 🎉 ¡Activación completada!');
        return { success: true, message: '¡TV activada exitosamente! Ya puedes disfrutar Netflix.' };

    } catch (err) {
        console.error('[BOT] ❌ Error:', err.message);

        let screenshot = null;
        if (browser) {
            try {
                const pages = await browser.pages();
                if (pages.length > 0) screenshot = await pages[0].screenshot({ encoding: 'base64' });
                await browser.close();
            } catch (e) { }
        }

        const payload = { success: false, error: 'Error del bot local: ' + err.message };
        if (screenshot) payload.screenshot = `data:image/png;base64,${screenshot}`;
        return payload;
    }
}

// ── FUNCIÓN: Resolver Código Temporal de Netflix (Acceso de Viaje) ─────────
async function doGetNetflixTempCode(email, travelLink) {
    let browser = null;
    try {
        console.log(`\n[BOT-NETFLIX-TEMP] ════════════════════════════════════`);
        console.log(`[BOT-NETFLIX-TEMP] 🎫 Solicitando código temporal para: ${email}`);
        console.log(`[BOT-NETFLIX-TEMP] 🔗 Enlace: ${travelLink}`);

        const chromePath = getChromePath();
        if (!chromePath) {
            return { success: false, error: 'Google Chrome no está instalado en esta PC.', link: travelLink };
        }

        browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--disable-backgrounding-occluded-windows',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--window-position=50,50',
                '--window-size=1100,750'
            ]
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        // 1. Navegar directamente al enlace de verificación de Netflix
        console.log(`[BOT-NETFLIX-TEMP] 🌐 Navegando a la página de verificación de Netflix...`);
        await page.goto(travelLink, { waitUntil: 'networkidle2', timeout: 35000 });
        await sleep(2500);

        let currentUrl = page.url();
        console.log(`[BOT-NETFLIX-TEMP] 📍 URL cargada: ${currentUrl}`);

        // 2. Si Netflix nos redirigió a Login, iniciar sesión primero
        if (currentUrl.includes('/login') || currentUrl.includes('netflix.com/es/login') || currentUrl.includes('netflix.com/Login')) {
            console.log(`[BOT-NETFLIX-TEMP] 🔒 Netflix solicitó iniciar sesión. Buscando contraseña para ${email}...`);
            const netflixPass = await findNetflixPassword(email);
            if (netflixPass) {
                const emailInput = await page.$('input[name="userLoginId"], input[data-uia="login-field"], input[type="email"], input[type="text"]');
                if (emailInput) {
                    await emailInput.click({ clickCount: 3 });
                    await emailInput.type(email, { delay: 60 });
                    await sleep(500);
                    await page.keyboard.press('Enter');
                    await sleep(3000);

                    const passInput = await page.$('input[name="password"], input[type="password"]');
                    if (passInput) {
                        await passInput.type(netflixPass, { delay: 60 });
                        await sleep(500);
                        await page.keyboard.press('Enter');
                        await sleep(4000);
                    }
                }
                console.log(`[BOT-NETFLIX-TEMP] 🔄 Volviendo al enlace de viaje con sesión iniciada...`);
                await page.goto(travelLink, { waitUntil: 'networkidle2', timeout: 35000 });
                await sleep(2500);
            } else {
                console.warn(`[BOT-NETFLIX-TEMP] ⚠️ No se encontró contraseña de Netflix para ${email} en Firebase.`);
            }
        }

        // Helper para extraer el código de 4 dígitos de la página actual
        const extractCodeFromPage = async () => {
            return await page.evaluate(() => {
                const body = (document.body ? document.body.innerText : '') || '';
                // 1. Buscar coincidencia cercana a la palabra "código" o "code"
                const nearMatch = body.match(/(?:c[oó]digo|code)[^\d]{1,30}(\b\d{4}\b)/i);
                if (nearMatch && nearMatch[1]) {
                    const c = nearMatch[1];
                    if (!['2023', '2024', '2025', '2026', '2027', '2028'].includes(c)) return c;
                }
                // 2. Buscar elementos destacados en la UI (encabezados, textos grandes, contenedores de código)
                const candidateElements = Array.from(document.querySelectorAll('[data-uia*="code"], [class*="code"], strong, b, h1, h2, h3, .heading'));
                for (const el of candidateElements) {
                    const txt = (el.innerText || el.textContent || '').trim();
                    const m = txt.match(/\b\d{4}\b/);
                    if (m && !['2023', '2024', '2025', '2026', '2027', '2028', '1080', '1920', '0000'].includes(m[0])) {
                        return m[0];
                    }
                }
                // 3. Coincidencia de 4 dígitos en el texto general descartando años y resoluciones
                const allMatches = body.match(/\b\d{4}\b/g);
                if (allMatches) {
                    const valid = allMatches.filter(m => !['2023', '2024', '2025', '2026', '2027', '2028', '1080', '1920', '0000'].includes(m));
                    if (valid.length > 0) return valid[0];
                }
                return null;
            });
        };

        // 3. Revisar si el código ya está visible en pantalla (ej: si ya se había generado)
        let foundCode = await extractCodeFromPage();
        if (foundCode) {
            console.log(`[BOT-NETFLIX-TEMP] 🎯 Código de 4 dígitos detectado de inmediato: ${foundCode}`);
            await sleep(1500);
            await browser.close();
            return { success: true, code: foundCode };
        }

        // 4. Buscar y hacer clic en el botón "Obtener código" / "Get code"
        console.log(`[BOT-NETFLIX-TEMP] 🖱️ Buscando botón 'Obtener código' en la página...`);
        const clicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a, [role="button"], input[type="submit"]'));
            for (const b of buttons) {
                const txt = (b.innerText || b.textContent || b.value || '').trim().toLowerCase();
                if (txt.includes('obtener c') || txt.includes('obtener codigo') || txt.includes('get code') || (txt.includes('código') && !txt.includes('volver'))) {
                    b.click();
                    return txt;
                }
            }
            // Selector alternativo botón principal rojo de Netflix
            const primaryBtn = document.querySelector('button[type="submit"], [data-uia*="travel"], [data-uia*="verify"], [data-uia*="action-button"], .btn-submit, .btn-primary');
            if (primaryBtn) {
                primaryBtn.click();
                return 'primary-submit-btn';
            }
            return null;
        });

        if (clicked) {
            console.log(`[BOT-NETFLIX-TEMP] ✅ Clic realizado en: "${clicked}". Esperando aparición del código...`);
            // Esperar activamente hasta 8 segundos para que Netflix genere y muestre el código
            for (let i = 0; i < 8; i++) {
                await sleep(1000);
                foundCode = await extractCodeFromPage();
                if (foundCode) {
                    console.log(`[BOT-NETFLIX-TEMP] 🎉 ¡Código de 4 dígitos extraído con éxito!: ${foundCode}`);
                    await sleep(1500);
                    await browser.close();
                    return { success: true, code: foundCode };
                }
            }
        } else {
            console.warn(`[BOT-NETFLIX-TEMP] ⚠️ Botón 'Obtener código' no encontrado explícitamente, esperando posible recarga...`);
            await sleep(3000);
        }

        // Última comprobación tras espera
        foundCode = await extractCodeFromPage();
        if (foundCode) {
            console.log(`[BOT-NETFLIX-TEMP] 🎉 ¡Código obtenido!: ${foundCode}`);
            await sleep(1500);
            await browser.close();
            return { success: true, code: foundCode };
        }

        console.warn(`[BOT-NETFLIX-TEMP] ⚠️ No se pudo extraer el número de 4 dígitos. Retornando enlace.`);
        await sleep(1500);
        await browser.close();
        return { success: false, error: 'No se pudo leer el código en la pantalla de Netflix.', link: travelLink };
    } catch (err) {
        console.error(`[BOT-NETFLIX-TEMP] ❌ Error en bot local:`, err.message);
        if (browser) {
            try { await browser.close(); } catch (_) { }
        }
        return { success: false, error: err.message, link: travelLink };
    }
}

// ── HELPER: Lector IMAP ultrarrápido local para códigos de correo ──────────
async function fetchLocalImapCode(email, platform, minTimestamp = 0) {
    try {
        const imaps = require(path.resolve(__dirname, './backend/node_modules/imap-simple'));
        const { simpleParser } = require(path.resolve(__dirname, './backend/node_modules/mailparser'));

        const dbResp = await axios.get('https://streamingdpc-7e7fa-default-rtdb.firebaseio.com/emailAccounts.json', { timeout: 4000 });
        const accountsData = dbResp.data || {};
        const target = email.toLowerCase().trim();
        const account = Object.values(accountsData).find(a => a && a.email && a.password && a.email.toLowerCase().trim() === target);
        if (!account) return null;

        const config = {
            imap: {
                user: account.email,
                password: account.password.replace(/\s+/g, ''),
                host: account.email.includes('gmail.com') ? 'imap.gmail.com' : 'imap.titan.email',
                port: 993,
                tls: true,
                authTimeout: 6000,
                tlsOptions: { rejectUnauthorized: false }
            }
        };

        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const searchCriteria = [['SINCE', yesterday]];
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], struct: true };

        const allMessages = await connection.search(searchCriteria, fetchOptions);
        const messages = allMessages.slice(-20);
        messages.sort((a, b) => new Date(b.attributes.date || 0) - new Date(a.attributes.date || 0));

        // Solo aceptar correos recibidos a partir de minTimestamp (con margen de 20s de tolerancia por desfase de reloj)
        const minAllowedTime = minTimestamp > 0 ? (minTimestamp - 20000) : (Date.now() - 10 * 60 * 1000);

        for (const message of messages) {
            const emailDate = message.attributes && message.attributes.date ? new Date(message.attributes.date).getTime() : 0;
            if (emailDate && emailDate < minAllowedTime) {
                // Email más antiguo que el inicio de la solicitud, descartar
                continue;
            }

            const allPart = message.parts.find(p => p.which === '') || message.parts.find(p => p.which === 'TEXT');
            if (!allPart) continue;

            const parsed = await simpleParser(allPart.body);
            const subject = (parsed.subject || '').toLowerCase();
            const textContent = ((parsed.text || '') + ' ' + (parsed.html || '')).toLowerCase();
            const fromText = (parsed.from && parsed.from.text ? parsed.from.text : '').toLowerCase();

            if (fromText.includes('netflix') || subject.includes('netflix')) {
                if (platform === 'netflix_mfa') {
                    // Buscar código de verificación de 6 dígitos ("Tu código de verificación")
                    const isMfaSubject = subject.includes('verificaci') || textContent.includes('verificaci');
                    if (isMfaSubject) {
                        const mfaMatch = textContent.match(/(?:este c[oó]digo:\s*|c[oó]digo de verificaci[oó]n:\s*)(\d{6})/i) || textContent.match(/\b\d{6}\b/g);
                        let valid = null;
                        if (Array.isArray(mfaMatch)) {
                            valid = mfaMatch.find(m => m !== '000000');
                        } else if (mfaMatch && mfaMatch[1]) {
                            valid = mfaMatch[1];
                        }
                        if (valid) {
                            connection.end();
                            return valid.replace(/\D/g, '');
                        }
                    }
                } else if (platform === 'logincode') {
                    // Buscar código de acceso de 4 dígitos ("Netflix: Tu código de inicio de sesión")
                    const isLoginSubject = subject.includes('inicio de sesi') || subject.includes('código de inicio') || subject.includes('codigo de inicio') || textContent.includes('iniciar sesión') || textContent.includes('iniciar sesion');
                    if (isLoginSubject) {
                        const matches = textContent.match(/\b\d{4}\b/g) || [];
                        const valid = matches.find(m => !['2024', '2025', '2026', '2027', '0000'].includes(m));
                        if (valid) {
                            connection.end();
                            return valid;
                        }
                    }
                }
            }
        }
        connection.end();
    } catch (e) {
        console.warn('[LOCAL-IMAP] Nota lectura correo:', e.message);
    }
    return null;
}

// ── FUNCIÓN: Ingreso de Cuentas Netflix (Login + MFA 6 Dígitos - Dejar Abierta) ──
async function doNetflixAccountLogin(email) {
    let browser = null;
    try {
        console.log(`\n[BOT-ADMIN-LOGIN] ════════════════════════════════════`);
        console.log(`[BOT-ADMIN-LOGIN] 🚀 Iniciando ingreso de cuenta Netflix para: ${email}`);
        const netflixPass = await findNetflixPassword(email);

        const chromePath = getChromePath();
        if (!chromePath) {
            return {
                success: false,
                error: 'Google Chrome no está instalado en esta PC.'
            };
        }

        // Lanzar navegador visible en el escritorio para que el usuario pueda usarlo
        browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: false,
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--disable-backgrounding-occluded-windows',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--window-position=50,50',
                '--window-size=1250,850'
            ]
        });

        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        // 1. Navegar a netflix.com/co/login
        console.log(`[BOT-ADMIN-LOGIN] 🌐 Navegando a https://www.netflix.com/co/login...`);
        try {
            await page.goto('https://www.netflix.com/co/login', { waitUntil: 'domcontentloaded', timeout: 45000 });
        } catch (navErr) {
            console.warn(`[BOT-ADMIN-LOGIN] ⚠️ Advertencia navegación: ${navErr.message}`);
        }
        await sleep(2500);

        let currentUrl = page.url();
        console.log(`[BOT-ADMIN-LOGIN] 🔗 URL actual: ${currentUrl}`);

        // Si estamos en pantalla de login, proceder con credenciales o código
        if (currentUrl.includes('/login') || currentUrl.includes('/co/login')) {
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
                } catch (e) { }
            }

            if (!emailInput) {
                return {
                    success: false,
                    error: `No se encontró el campo de correo en ${page.url()}.`
                };
            }

            // Establecer el correo de forma 100% nativa para evitar cualquier bug de teclado/layout (ej: '@' inyectando '2' en '.co2m')
            await sleep(500);
            await page.evaluate((el, targetEmail) => {
                el.focus();
                el.value = '';
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                if (nativeSetter) {
                    nativeSetter.call(el, targetEmail);
                } else {
                    el.value = targetEmail;
                }
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, emailInput, email);
            await sleep(300);

            // Verificación del valor tipeado en el DOM
            const typedVal = await page.evaluate(el => el.value, emailInput);
            console.log(`[BOT-ADMIN-LOGIN] ✉️ Email verificado en pantalla: "${typedVal}" (Objetivo: "${email}")`);
            if (typedVal !== email) {
                console.log(`[BOT-ADMIN-LOGIN] ⚠️ Corrigiendo email en input: "${typedVal}" -> "${email}"`);
                await page.evaluate((el, targetEmail) => {
                    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                    if (nativeSetter) nativeSetter.call(el, targetEmail);
                    else el.value = targetEmail;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }, emailInput, email);
                await sleep(200);
            }

            // Registrar marca de tiempo exacta de cuando se solicita el código de 4 dígitos
            const loginCodeRequestTime = Date.now();

            // Buscar botón Continue / Continuar o solicitar código de inicio de sesión
            let clickedSubmitOrCode = await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button, a, div[role="button"], input[type="submit"]'));
                // 1. Preferir botón específico de código si ya está visible
                const codeBtn = btns.find(b => {
                    const t = (b.innerText || b.value || '').toLowerCase();
                    return t.includes('código de inicio de sesión') || t.includes('codigo de inicio de sesion') || t.includes('iniciar sesión con un código') || t.includes('iniciar sesion con un codigo') || t.includes('usa un código') || t.includes('usa un codigo');
                });
                if (codeBtn) {
                    codeBtn.click();
                    return true;
                }
                // 2. Si no, hacer clic en Continue / Continuar / Iniciar sesión
                const continueBtn = btns.find(b => {
                    const t = (b.innerText || b.value || '').trim().toLowerCase();
                    return t === 'continue' || t === 'continuar' || t === 'iniciar sesión' || t === 'sign in';
                });
                if (continueBtn) {
                    continueBtn.click();
                    return true;
                }
                return false;
            });

            if (!clickedSubmitOrCode) {
                const submitBtn = await page.$('button[data-uia="login-submit-button"], button[type="submit"]');
                if (submitBtn) await submitBtn.click();
                else await page.keyboard.press('Enter');
            }

            await sleep(3500);

            // Revisar si en la siguiente pantalla aparece el botón para pedir código
            await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
                const btn = btns.find(b => {
                    const t = (b.innerText || '').toLowerCase();
                    return t.includes('código de inicio de sesión') || t.includes('codigo de inicio de sesion') || t.includes('iniciar sesión con un código') || t.includes('iniciar sesion con un codigo') || t.includes('usa un código') || t.includes('usa un codigo');
                });
                if (btn) btn.click();
            });

            console.log(`[BOT-ADMIN-LOGIN] ⏳ Esperando código de 4 dígitos o validación...`);
            await sleep(2500);

            // Buscar código de 4 dígitos en el correo (solo emails recibidos DESPUÉS de loginCodeRequestTime)
            console.log('[BOT-ADMIN-LOGIN] 📨 Buscando código de 4 dígitos en el correo...');
            let loginCode = null;
            const BACKEND_URL = 'https://streaming-backend-ce1u.onrender.com';

            for (let attempt = 1; attempt <= 15; attempt++) {
                console.log(`[BOT-ADMIN-LOGIN] 🔍 Intento ${attempt}/15 buscando código de 4 dígitos (después de ${new Date(loginCodeRequestTime).toLocaleTimeString()})...`);
                try {
                    loginCode = await fetchLocalImapCode(email, 'logincode', loginCodeRequestTime);
                } catch (e) { }

                if (!loginCode) {
                    try {
                        const codeResp = await axios.post(`${BACKEND_URL}/api/get-code`, {
                            email: email,
                            platform: 'logincode'
                        }, { timeout: 15000 });
                        if (codeResp.data && codeResp.data.code) {
                            loginCode = codeResp.data.code.toString().replace(/\D/g, '').substring(0, 4);
                        }
                    } catch (e) { }
                }

                if (loginCode && loginCode.length >= 4) {
                    console.log(`[BOT-ADMIN-LOGIN] ✅ Código de 4 dígitos recibido: ${loginCode}`);
                    break;
                }
                await sleep(4000);
            }

            if (!loginCode) {
                // Comprobar si Netflix pidió contraseña y tenemos el password disponible
                const passInput = await page.$('input[name="password"], input[type="password"]');
                if (passInput && netflixPass) {
                    console.log('[BOT-ADMIN-LOGIN] 🔑 Usando contraseña como alternativa a código...');
                    await passInput.click({ clickCount: 3 });
                    await passInput.type(netflixPass.replace(/\s+/g, ''), { delay: 75 });
                    await sleep(500);
                    await page.keyboard.press('Enter');
                    await sleep(4500);
                } else {
                    return {
                        success: false,
                        error: 'Netflix solicitó código de 4 dígitos, pero no llegó al correo en 60 segundos.'
                    };
                }
            } else {
                console.log(`[BOT-ADMIN-LOGIN] ⌨️ Escribiendo código de 4 dígitos: ${loginCode}`);
                await sleep(1000);
                const codeInputs = await page.$$('input[autocomplete="one-time-code"], input[type="tel"], input[aria-label*="código" i], input[aria-label*="code" i], input[type="text"]:not([name="userLoginId"])');
                if (codeInputs.length >= 4) {
                    for (let i = 0; i < Math.min(4, loginCode.length); i++) {
                        await codeInputs[i].click();
                        await sleep(120);
                        await codeInputs[i].type(loginCode[i], { delay: 100 });
                    }
                } else {
                    await page.keyboard.type(loginCode, { delay: 120 });
                }

                await sleep(800);
                await page.keyboard.press('Enter');
                console.log('[BOT-ADMIN-LOGIN] ⏳ Esperando validación del código de 4 dígitos...');
                await sleep(5000);
            }
        }

        // Si aparece pantalla de selección de perfiles, hacer clic en el primero
        try {
            await page.evaluate(() => {
                const profile = document.querySelector('.profile-link, .profile-icon, [data-uia="profile-link"], .profile');
                if (profile) profile.click();
            });
            await sleep(2000);
        } catch (e) { }

        // 2. Navegar a https://www.netflix.com/account/devices
        console.log('[BOT-ADMIN-LOGIN] 🛡️ Navegando a https://www.netflix.com/account/devices...');
        try {
            await page.goto('https://www.netflix.com/account/devices', { waitUntil: 'domcontentloaded', timeout: 45000 });
        } catch (navErr) {
            console.warn(`[BOT-ADMIN-LOGIN] ⚠️ Advertencia navegación devices: ${navErr.message}`);
        }
        await sleep(3500);

        // Si muestra la pantalla de error "Parece que algo salió mal", pulsar "Regresar a Cuenta"
        const clickedBackToAccount = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
            const backBtn = btns.find(b => (b.innerText || '').toLowerCase().includes('regresar a cuenta'));
            if (backBtn) {
                backBtn.click();
                return true;
            }
            return false;
        });
        if (clickedBackToAccount) {
            console.log('[BOT-ADMIN-LOGIN] 🔄 Clic en "Regresar a Cuenta"');
            await sleep(3000);
        }

        // Asegurar que estamos en la sección de dispositivos
        if (!page.url().includes('/account/devices')) {
            try {
                await page.goto('https://www.netflix.com/account/devices', { waitUntil: 'domcontentloaded', timeout: 45000 });
                await sleep(3000);
            } catch (e) { }
        }

        const currentDevicesUrl = page.url();
        console.log(`[BOT-ADMIN-LOGIN] 🔗 URL dispositivos: ${currentDevicesUrl}`);

        if (currentDevicesUrl.includes('/login')) {
            return {
                success: false,
                error: 'Netflix redirigió a /login. El inicio de sesión con el código de 4 dígitos no se completó.'
            };
        }

        // 3. Dar clic en "Acceso y dispositivos" para detonar la verificación de identidad (MFA)
        console.log('[BOT-ADMIN-LOGIN] 👆 Haciendo clic en "Acceso y dispositivos"...');
        const clickedAccessDevices = await page.evaluate(() => {
            const candidates = Array.from(document.querySelectorAll('a, button, div[role="button"], div, li'));
            const target = candidates.find(el => {
                const txt = (el.innerText || '').toLowerCase().trim();
                return txt.includes('acceso y dispositivos') || txt.includes('administrar dispositivos') || txt.includes('access and devices') || txt.includes('manage access');
            });
            if (target) {
                target.click();
                return true;
            }
            return false;
        });

        console.log(`[BOT-ADMIN-LOGIN] Clic en "Acceso y dispositivos": ${clickedAccessDevices ? 'EXITOSO' : 'Buscando enlace alternativo...'}`);
        if (!clickedAccessDevices) {
            const altLink = await page.$('a[href*="/manage-devices"], a[href*="/account/devices"], [data-uia*="devices"]');
            if (altLink) await altLink.click();
        }
        await sleep(3500);

        // 4. En la pantalla "Primero, tenemos que asegurarnos de que seas tú", dar click en "Enviar código por email"
        const mfaRequestTime = Date.now();
        let codeInputs = await page.$('input[autocomplete="one-time-code"], input[type="tel"], input[aria-label*="código" i], input[type="text"]');
        if (codeInputs.length < 6) {
            console.log('[BOT-ADMIN-LOGIN] 👆 Haciendo clic en "Enviar código por email"...');
            const clickedSendCode = await page.evaluate(() => {
                const candidates = Array.from(document.querySelectorAll('button, a, div[role="button"], li, div, [data-uia]'));
                const target = candidates.find(el => {
                    const txt = (el.innerText || '').toLowerCase();
                    return (txt.includes('enviar código por email') || txt.includes('enviar codigo por email') || (txt.includes('código por email') && txt.includes('@')) || txt.includes('enviar código') || txt.includes('send code'));
                });
                if (target) {
                    target.click();
                    return true;
                }
                return false;
            });

            console.log(`[BOT-ADMIN-LOGIN] Clic en enviar código MFA: ${clickedSendCode ? 'EXITOSO' : 'Buscando botón alternativo...'}`);
            if (!clickedSendCode) {
                const altBtn = await page.$('button[data-uia*="email"], button[data-uia*="send"], [data-uia*="challenge-action"]');
                if (altBtn) await altBtn.click();
            }
            await sleep(3500);
        }

        // Esperar que aparezcan los 6 campos para el código MFA ("Ingresa el código que te acabamos de enviar")
        try {
            await page.waitForFunction(() => {
                const inputs = document.querySelectorAll('input:not([type="hidden"])');
                return inputs.length >= 6 || document.body.innerText.includes('acabamos de enviar');
            }, { timeout: 10000 });
        } catch (e) { }

        // 4. Buscar en email "Tu código de verificación" (6 dígitos) posterior a mfaRequestTime
        console.log(`[BOT-ADMIN-LOGIN] 📨 Buscando código de verificación MFA de 6 dígitos en el correo (${email}) recibido después de ${new Date(mfaRequestTime).toLocaleTimeString()}...`);
        let mfaCode = null;

        for (let attempt = 1; attempt <= 15; attempt++) {
            console.log(`[BOT-ADMIN-LOGIN] 🔍 Intento ${attempt}/15 buscando código MFA de 6 dígitos...`);
            try {
                mfaCode = await fetchLocalImapCode(email, 'netflix_mfa', mfaRequestTime);
            } catch (e) { }

            if (!mfaCode) {
                try {
                    const resp = await axios.post(`${BACKEND_URL}/api/get-code`, {
                        email: email,
                        platform: 'netflix_mfa'
                    }, { timeout: 15000 });
                    if (resp.data && resp.data.code) {
                        mfaCode = resp.data.code.toString().replace(/\D/g, '').substring(0, 6);
                    }
                } catch (e) { }
            }

            if (mfaCode && mfaCode.length === 6) {
                console.log(`[BOT-ADMIN-LOGIN] ✅ ¡Código MFA de 6 dígitos encontrado!: ${mfaCode}`);
                break;
            }
            await sleep(4000);
        }

        if (!mfaCode) {
            return {
                success: false,
                error: 'No se pudo obtener el código de verificación de 6 dígitos del correo en 60 segundos. El navegador se mantiene abierto.'
            };
        }

        // 5. Ingresar el código de 6 dígitos
        console.log(`[BOT-ADMIN-LOGIN] ⌨️ Ingresando código MFA de 6 dígitos: ${mfaCode}`);
        let sixInputs = await page.$$('input[autocomplete="one-time-code"], input[type="tel"], input[aria-label*="código" i], input[type="text"]:not([type="hidden"]), input:not([type="hidden"]):not([type="checkbox"])');
        if (sixInputs.length >= 6) {
            for (let i = 0; i < 6; i++) {
                await sixInputs[i].click();
                await sleep(100);
                await sixInputs[i].type(mfaCode[i], { delay: 80 });
            }
        } else if (sixInputs.length === 1) {
            await sixInputs[0].click({ clickCount: 3 });
            await sixInputs[0].type(mfaCode, { delay: 80 });
        } else {
            await page.keyboard.type(mfaCode, { delay: 80 });
        }

        await sleep(1000);

        // 6. Dar Enviar
        console.log('[BOT-ADMIN-LOGIN] 🔘 Presionando botón Enviar...');
        const submitSuccess = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, [role="button"]'));
            const btn = btns.find(b => (b.innerText || '').trim().toLowerCase() === 'enviar');
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (!submitSuccess) {
            const submitBtn = await page.$('button[type="submit"], button.btn-primary, button[data-uia*="submit"], button[data-uia*="action"]');
            if (submitBtn) {
                await submitBtn.click();
            } else {
                await page.keyboard.press('Enter');
            }
        }
        await sleep(5000);

        console.log('[BOT-ADMIN-LOGIN] 🎉 ¡Éxito! Cuenta de Netflix ingresada y verificada.');
        console.log('[BOT-ADMIN-LOGIN] 🔓 MANTENIENDO NAVEGADOR ABIERTO para el administrador...');

        // ¡NO CERRAR EL NAVEGADOR! Se mantiene abierto para uso manual del administrador
        return {
            success: true,
            code: mfaCode,
            message: `¡Sesión iniciada y verificada! Código MFA de 6 dígitos (${mfaCode}) ingresado correctamente. El navegador Chrome ha quedado abierto en pantalla para tu uso manual.`
        };

    } catch (err) {
        console.error('[BOT-ADMIN-LOGIN] ❌ Error:', err);
        return {
            success: false,
            error: err.message || 'Error en el ingreso de cuenta Netflix.'
        };
    }
}

// ── FUNCIÓN: Activar HBO Max TV (auth.hbomax.com/link?flow=connectDeviceSignIn) ──
async function doActivateHboTv(email, tvCode) {
    let browser = null;
    let chromeProc = null;
    try {
        console.log(`\n[BOT-HBO] ════════════════════════════════════`);
        console.log(`[BOT-HBO] Activando HBO Max en TV: ${email} → código: ${tvCode}`);

        const chromePath = getChromePath();
        if (!chromePath) {
            return {
                success: false,
                error: 'Google Chrome no está instalado en esta PC. Instala Chrome e intenta de nuevo.'
            };
        }

        // Lanzar Chrome 100% real con perfil dedicado para evitar detección por Arkose / Feroot
        const cdpPort = 9338;
        const profileDir = path.join(process.env.USERPROFILE || 'C:\\Users\\Default', '.gemini', 'hbo_bot_profile');

        console.log(`[BOT-HBO] 🚀 Iniciando Chrome genuino (CDP port ${cdpPort})...`);
        chromeProc = spawn(chromePath, [
            `--remote-debugging-port=${cdpPort}`,
            `--user-data-dir=${profileDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--window-position=50,50',
            '--window-size=1280,800',
            'about:blank'
        ]);

        let endpoint = null;
        for (let i = 0; i < 20; i++) {
            await sleep(500);
            try {
                const resp = await axios.get(`http://127.0.0.1:${cdpPort}/json/version`);
                if (resp.data && resp.data.webSocketDebuggerUrl) {
                    endpoint = resp.data.webSocketDebuggerUrl;
                    break;
                }
            } catch (e) { }
        }

        if (!endpoint) {
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return { success: false, error: 'No se pudo iniciar Chrome para HBO Max.' };
        }

        browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
        const pages = await browser.pages();
        const page = pages[0] || await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // 1. Navegar a auth.hbomax.com/link?flow=connectDeviceSignIn
        console.log('[BOT-HBO] 🌐 Navegando a auth.hbomax.com/link?flow=connectDeviceSignIn...');
        await page.goto('https://auth.hbomax.com/link?flow=connectDeviceSignIn', { waitUntil: 'domcontentloaded', timeout: 35000 });
        await sleep(3500);

        // Aceptar banner de cookies si aparece
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const cBtn = btns.find(b => {
                const t = (b.innerText || '').toLowerCase();
                return t.includes('accept all') || t.includes('aceptar') || b.getAttribute('data-testid') === 'consent-modal-button-0';
            });
            if (cBtn) cBtn.click();
        });
        await sleep(1500);

        // 2. Ingresar código del televisor (6 caracteres)
        const cleanTvCode = tvCode.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');
        console.log(`[BOT-HBO] 🔢 Escribiendo código de TV: ${cleanTvCode}`);

        const focusedTvCode = await page.evaluate(() => {
            function findInput(root) {
                const f0 = root.querySelector('#activationCode-field-0, [data-testid*="single_input_0"], input[type="text"]');
                if (f0) return f0;
                const all = Array.from(root.querySelectorAll('*'));
                for (const el of all) {
                    if (el.shadowRoot) {
                        const res = findInput(el.shadowRoot);
                        if (res) return res;
                    }
                }
                return null;
            }
            const inp = findInput(document);
            if (inp) {
                inp.focus();
                return true;
            }
            return false;
        });

        await page.keyboard.type(cleanTvCode, { delay: 120 });
        await sleep(800);

        // Clic en Siguiente / Next
        console.log('[BOT-HBO] ➡️ Clic en botón Siguiente...');
        const clickedNext = await page.evaluate(() => {
            function findBtn(root) {
                const btn = root.querySelector('button[type="submit"], [data-testid*="submit_button"]');
                if (btn) return btn;
                const all = Array.from(root.querySelectorAll('*'));
                for (const el of all) {
                    if (el.shadowRoot) {
                        const res = findBtn(el.shadowRoot);
                        if (res) return res;
                    }
                }
                return null;
            }
            const b = findBtn(document);
            if (b) {
                b.click();
                return true;
            }
            return false;
        });
        if (!clickedNext) {
            await page.keyboard.press('Enter');
        }
        await sleep(4000);

        // Verificar si el código no coincide o expiró
        const tvCodeError = await page.evaluate(() => {
            const txt = (document.body.innerText || '').toLowerCase();
            if (txt.includes("doesn't match") || txt.includes('no coincide') || txt.includes('inválido') || txt.includes('incorrecto') || txt.includes('must be at least')) {
                return true;
            }
            return false;
        });
        if (tvCodeError) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: 'El código ingresado no coincide o expiró en tu TV. Genera un nuevo código en tu televisor e intenta nuevamente.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        // 3. Ingresar el correo electrónico
        console.log(`[BOT-HBO] ✉️ Ingresando correo electrónico: ${email}`);
        let emailReady = false;
        for (let wait = 0; wait < 12; wait++) {
            emailReady = await page.evaluate(() => {
                function searchEmail(root) {
                    const inp = root.querySelector('#sign-in-phoneEmail-input, [data-testid*="phoneEmailInput"], input[type="email"], input[name="phoneEmail"]');
                    if (inp) return inp;
                    const all = Array.from(root.querySelectorAll('*'));
                    for (const el of all) {
                        if (el.shadowRoot) {
                            const res = searchEmail(el.shadowRoot);
                            if (res) return res;
                        }
                    }
                    return null;
                }
                const inp = searchEmail(document);
                if (inp) {
                    inp.focus();
                    return true;
                }
                return false;
            });
            if (emailReady) break;
            await sleep(1500);
        }

        if (!emailReady) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: 'HBO Max no cargó el campo de correo electrónico.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        await page.keyboard.type(email, { delay: 60 });
        await sleep(600);

        // Clic en Continuar
        console.log('[BOT-HBO] 🔄 Clic en Continuar correo...');
        const clickedContinue = await page.evaluate(() => {
            function searchContinue(root) {
                const btn = root.querySelector('button[data-testid="gisdk.gi-sign-in.continue_button"], button[type="submit"]');
                if (btn) return btn;
                const all = Array.from(root.querySelectorAll('*'));
                for (const el of all) {
                    if (el.shadowRoot) {
                        const res = searchContinue(el.shadowRoot);
                        if (res) return res;
                    }
                }
                return null;
            }
            const b = searchContinue(document);
            if (b) {
                b.click();
                return true;
            }
            return false;
        });
        if (!clickedContinue) {
            await page.keyboard.press('Enter');
        }

        // 4. Clic en "Obtener código de un solo uso"
        console.log('[BOT-HBO] 🔘 Esperando y buscando opción "Obtener código de un solo uso"...');
        let clickedOtpBtn = false;
        for (let wait = 0; wait < 18; wait++) {
            await sleep(1000);
            clickedOtpBtn = await page.evaluate(() => {
                function searchOtp(root) {
                    const btns = Array.from(root.querySelectorAll('button, a, [role="button"]'));
                    for (const b of btns) {
                        const txt = (b.innerText || b.textContent || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        if (txt.includes('obtener codigo de un solo uso') || txt.includes('un solo uso') || txt.includes('one-time code') || txt.includes('one time code')) {
                            b.click();
                            return true;
                        }
                    }
                    const all = Array.from(root.querySelectorAll('*'));
                    for (const el of all) {
                        if (el.shadowRoot) {
                            const res = searchOtp(el.shadowRoot);
                            if (res) return res;
                        }
                    }
                    return false;
                }
                return searchOtp(document);
            });
            if (clickedOtpBtn) {
                console.log('[BOT-HBO] ✅ Clic en "Obtener código de un solo uso" ejecutado.');
                break;
            }
        }

        if (!clickedOtpBtn) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: 'No se encontró el botón "Obtener código de un solo uso" en HBO Max.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }
        await sleep(3500);

        // 5. Leer código OTP (6 dígitos) enviado al correo
        console.log('[BOT-HBO] 📨 Solicitando al backend el código de acceso (6 dígitos)...');
        let loginCode = null;
        const BACKEND_URL = 'https://streaming-backend-ce1u.onrender.com';

        for (let attempt = 1; attempt <= 10; attempt++) {
            try {
                console.log(`[BOT-HBO] 🔍 Intento ${attempt}/10 de lectura del correo (${email})...`);
                const codeResp = await axios.post(`${BACKEND_URL}/api/get-code`, {
                    email: email,
                    platform: 'hbomax_tv'
                }, { timeout: 15000 });

                if (codeResp.data && codeResp.data.code) {
                    const raw = codeResp.data.code.toString().replace(/\D/g, '');
                    if (raw.length >= 6) {
                        loginCode = raw.substring(0, 6);
                        console.log(`[BOT-HBO] ✅ Código OTP recibido: ${loginCode}`);
                        break;
                    }
                }
            } catch (e) {
                console.log(`[BOT-HBO] ⚠️ Intento ${attempt} falló: ${e.message}`);
            }
            if (attempt < 10) {
                await sleep(5000);
            }
        }

        if (!loginCode) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: 'No se pudo leer el código de acceso de HBO Max del correo. Inténtalo de nuevo en 1 minuto.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        // 6. Escribir el código OTP en las 6 casillas
        console.log(`[BOT-HBO] ⌨️ Ingresando código OTP en las casillas: ${loginCode}`);
        await page.evaluate(() => {
            function searchOtpField(root) {
                const f0 = root.querySelector('#oneTimeCode-field-0, #activationCode-field-0, [data-testid*="single_input_0"], [data-testid*="oneTimeCode"], input[type="text"], input[type="tel"]');
                if (f0) return f0;
                const all = Array.from(root.querySelectorAll('*'));
                for (const el of all) {
                    if (el.shadowRoot) {
                        const res = searchOtpField(el.shadowRoot);
                        if (res) return res;
                    }
                }
                return null;
            }
            const inp = searchOtpField(document);
            if (inp) inp.focus();
        });
        await page.keyboard.type(loginCode, { delay: 120 });
        await sleep(800);

        // Clic en Enviar
        console.log('[BOT-HBO] 🚀 Clic en Enviar código OTP...');
        await page.evaluate(() => {
            function searchSubmit(root) {
                const btns = Array.from(root.querySelectorAll('button, input[type="submit"]'));
                for (const b of btns) {
                    const txt = (b.innerText || b.value || '').toLowerCase().trim();
                    if (txt === 'enviar' || txt === 'submit' || txt.includes('enviar')) {
                        b.click();
                        return true;
                    }
                }
                const all = Array.from(root.querySelectorAll('*'));
                for (const el of all) {
                    if (el.shadowRoot) {
                        const res = searchSubmit(el.shadowRoot);
                        if (res) return res;
                    }
                }
                return false;
            }
            return searchSubmit(document);
        });
        await sleep(5000);

        // 7. Esperar pantalla de confirmación ("¡Ya está todo listo!")
        console.log('[BOT-HBO] ⏳ Esperando confirmación de activación...');
        let confirmed = false;
        for (let wait = 0; wait < 6; wait++) {
            const pageText = await page.evaluate(() => (document.body.innerText || '').toLowerCase());
            if (pageText.includes('ya esta todo listo') || pageText.includes('ya está todo listo') ||
                pageText.includes('televisor se actualizara') || pageText.includes('todo listo') ||
                pageText.includes('all set') || pageText.includes('ready')) {
                confirmed = true;
                break;
            }
            await sleep(2000);
        }
        console.log(`[BOT-HBO] Estado: ${confirmed ? '¡Confirmado por HBO Max!' : 'Finalizado'}`);

        // 8. Cerrar sesión y limpiar cookies (como solicitado: "y quedo listo ahora cerrar sesion")
        console.log('[BOT-HBO] 🧹 Cerrando y limpiando sesión de HBO Max...');
        try {
            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCookies');
            await client.send('Network.clearBrowserCache');
            console.log('[BOT-HBO] 🧼 Cookies y caché limpiados.');
        } catch (e) { }

        try {
            await page.goto('https://auth.hbomax.com/logout', { waitUntil: 'networkidle2', timeout: 8000 }).catch(() => { });
        } catch (e) { }

        await browser.disconnect();
        browser = null;
        if (chromeProc) {
            try { chromeProc.kill(); } catch (e) { }
            chromeProc = null;
        }

        console.log('[BOT-HBO] 🎉 ¡Activación de HBO Max TV completada con éxito!');
        return {
            success: true,
            message: '¡HBO Max activado con éxito en tu Smart TV! Tu televisor se actualizará automáticamente.'
        };

    } catch (err) {
        console.error('[BOT-HBO] ❌ Error:', err.message);

        let screenshot = null;
        if (browser) {
            try {
                const pages = await browser.pages();
                if (pages.length > 0) screenshot = await pages[0].screenshot({ encoding: 'base64' });
                await browser.disconnect();
            } catch (e) { }
        }
        if (chromeProc) {
            try { chromeProc.kill(); } catch (e) { }
        }

        const payload = { success: false, error: 'Error del bot de HBO Max: ' + err.message };
        if (screenshot) payload.screenshot = `data:image/png;base64,${screenshot}`;
        return payload;
    }
}

// ── FUNCIÓN: Activar Prime Video TV (primevideo.com/mytv) ───────────────────
async function doActivatePrimeTv(email, tvCode) {
    let browser = null;
    let chromeProc = null;
    try {
        console.log(`\n[BOT-PRIME] ════════════════════════════════════`);
        console.log(`[BOT-PRIME] Registrando TV en Prime Video: ${email} → código: ${tvCode}`);

        // 1. Buscar contraseña en Firebase
        const primePass = await findPrimePassword(email);
        if (!primePass) {
            return {
                success: false,
                error: `No se encontró la contraseña de Prime Video para ${email}. Verifica que esté configurada en la venta.`
            };
        }
        console.log(`[BOT-PRIME] 🔑 Contraseña lista (oculta). Iniciando Chrome en segundo plano...`);

        const chromePath = getChromePath();
        if (!chromePath) {
            return {
                success: false,
                error: 'Google Chrome no está instalado en esta PC. Instala Chrome e intenta de nuevo.'
            };
        }

        const cdpPort = 9340;
        const profileDir = path.join(process.env.USERPROFILE || 'C:\\Users\\Default', '.gemini', 'prime_bot_profile');

        console.log(`[BOT-PRIME] 🚀 Iniciando Chrome genuino (CDP port ${cdpPort})...`);
        chromeProc = spawn(chromePath, [
            `--remote-debugging-port=${cdpPort}`,
            `--user-data-dir=${profileDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--window-position=50,50',
            '--window-size=1280,800',
            'about:blank'
        ]);

        let endpoint = null;
        for (let i = 0; i < 20; i++) {
            await sleep(500);
            try {
                const resp = await axios.get(`http://127.0.0.1:${cdpPort}/json/version`);
                if (resp.data && resp.data.webSocketDebuggerUrl) {
                    endpoint = resp.data.webSocketDebuggerUrl;
                    break;
                }
            } catch (e) { }
        }

        if (!endpoint) {
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return { success: false, error: 'No se pudo iniciar Chrome para Prime Video.' };
        }

        browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
        const pages = await browser.pages();
        const page = pages[0] || await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // 2. Navegar a https://www.primevideo.com/mytv (esperar redirección completa a amazon.com/ap/signin)
        console.log('[BOT-PRIME] 🌐 Navegando a https://www.primevideo.com/mytv...');
        await page.goto('https://www.primevideo.com/mytv', { waitUntil: 'networkidle2', timeout: 35000 }).catch(() => {});
        await sleep(1500);

        // Aceptar cookies / consent modal si aparece
        try {
            await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button, input[type="submit"]'));
                const cBtn = btns.find(b => {
                    const t = (b.innerText || b.value || '').toLowerCase();
                    return t.includes('aceptar cookies') || t.includes('accept cookies') || t.includes('agree');
                });
                if (cBtn) cBtn.click();
            });
        } catch (e) { }

        // 3. Paso de Email (si no ha iniciado sesión: esperar #ap_email visible)
        let emailInput = await page.waitForSelector('#ap_email, #ap_email_login, input[type="email"]', { visible: true, timeout: 8000 }).catch(() => null);
        if (emailInput) {
            console.log(`[BOT-PRIME] ✉️ Ingresando correo electrónico: ${email}`);
            await page.evaluate(() => {
                const el = document.querySelector('#ap_email, #ap_email_login, input[type="email"]');
                if (el) { el.focus(); el.value = ''; }
            });
            await emailInput.type(email, { delay: 35 });
            await sleep(500);

            // Verificar si #ap_password ya está visible en la misma pantalla (login de 1 paso) o si debemos pulsar Continuar (login de 2 pasos)
            const passVisibleAlready = await page.evaluate(() => {
                const p = document.querySelector('#ap_password');
                return Boolean(p && p.offsetParent !== null);
            });

            if (!passVisibleAlready) {
                console.log('[BOT-PRIME] ➡️ Clic en Continuar...');
                const contBtn = await page.$('input#continue, button#continue, #continue');
                if (contBtn) {
                    await Promise.all([
                        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {}),
                        contBtn.click()
                    ]);
                } else {
                    await page.keyboard.press('Enter');
                }
                await sleep(2000);
            }
        }

        // 4. Paso de Contraseña (esperar específicamente #ap_password VISIBLE, ignorando #ap-credential-autofill-hint oculto)
        let passInput = await page.waitForSelector('#ap_password', { visible: true, timeout: 10000 }).catch(() => null);
        if (passInput) {
            console.log('[BOT-PRIME] 🔑 Ingresando contraseña...');
            await page.evaluate(() => {
                const el = document.querySelector('#ap_password');
                if (el) { el.focus(); el.value = ''; }
            });
            await passInput.type(primePass, { delay: 35 });
            await sleep(500);

            // Clic en Iniciar sesión
            console.log('[BOT-PRIME] 🚀 Clic en Iniciar sesión...');
            const signBtn = await page.$('#signInSubmit, input#signInSubmit, button#signInSubmit');
            if (signBtn) {
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {}),
                    signBtn.click()
                ]);
            } else {
                await page.keyboard.press('Enter');
            }
            await sleep(3500);
        }

        // 5. Verificar si hubo error de contraseña, CAPTCHA o verificación en dos pasos (OTP)
        const loginCheck = await page.evaluate(() => {
            const txt = (document.body.innerText || '').toLowerCase();
            const errBox = document.querySelector('#auth-error-message-box, #auth-warning-message-box, .a-alert-error');
            const errText = errBox ? (errBox.innerText || '').trim() : '';
            if (txt.includes('contraseña no es correcta') || txt.includes('password is incorrect') || txt.includes('no encontramos ninguna cuenta')) {
                return { type: 'auth_error', detail: errText || 'La contraseña o correo de Prime Video fue rechazado por Amazon.' };
            }
            if (txt.includes('verificación en dos pasos') || txt.includes('two-step verification') || txt.includes('introduce el código') || txt.includes('enter otp') || txt.includes('código de seguridad') || txt.includes('aprobar la notificación')) {
                return { type: '2fa', detail: 'Amazon solicitó verificación en dos pasos (OTP) o aprobación de seguridad.' };
            }
            if (document.querySelector('#auth-captcha-image') || txt.includes('introduce los caracteres que veas') || txt.includes('enter the characters you see') || txt.includes('resuelve este acertijo')) {
                return { type: 'captcha', detail: 'Amazon solicitó resolver un CAPTCHA de seguridad.' };
            }
            return null;
        });

        if (loginCheck) {
            console.warn(`[BOT-PRIME] ⚠️ Bloqueo en login (${loginCheck.type}): ${loginCheck.detail}`);
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: loginCheck.detail,
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        // 6. Esperar la pantalla de registro de dispositivo (/mytv o /ontv/code)
        console.log('[BOT-PRIME] 📺 Esperando formulario de registro de TV...');
        let codeInputReady = false;
        const codeSelector = '#av-cbl-code, input[name="code"], input[placeholder*="HQ2W4Z"], input[placeholder*="código"], input[placeholder*="code"], input[type="text"]:not(#ap_email):not(#ap_email_login):not([name="email"])';
        for (let wait = 0; wait < 15; wait++) {
            const curUrl = page.url();
            if (!curUrl.includes('/ap/signin')) {
                const inp = await page.$(codeSelector);
                if (inp) {
                    codeInputReady = true;
                    break;
                }
            }
            await sleep(1500);
        }

        if (!codeInputReady) {
            if (!page.url().includes('code') && !page.url().includes('/ap/signin')) {
                console.log('[BOT-PRIME] 🔄 Redirigiendo a https://www.primevideo.com/mytv...');
                await page.goto('https://www.primevideo.com/mytv', { waitUntil: 'domcontentloaded', timeout: 30000 });
                await sleep(3500);
            }
        }

        // 7. Escribir el código del televisor
        const cleanTvCode = tvCode.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');
        console.log(`[BOT-PRIME] 🔢 Ingresando código de registro: ${cleanTvCode}`);

        const inputFound = await page.evaluate((sel) => {
            if (window.location.href.includes('/ap/signin')) return false;
            const inp = document.querySelector(sel);
            if (inp) {
                inp.focus();
                inp.value = '';
                return true;
            }
            return false;
        }, codeSelector);

        if (!inputFound) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: 'Prime Video no mostró la casilla para ingresar el código de registro.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        await page.keyboard.type(cleanTvCode, { delay: 100 });
        await sleep(800);

        // 8. Clic en "Registrar dispositivo"
        console.log('[BOT-PRIME] 🔘 Clic en "Registrar dispositivo"...');
        const clickedRegister = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, input[type="submit"]'));
            for (const b of btns) {
                const txt = (b.innerText || b.value || '').toLowerCase().trim();
                if (txt.includes('registrar dispositivo') || txt.includes('register device') || txt.includes('registrar')) {
                    b.click();
                    return true;
                }
            }
            return false;
        });

        if (!clickedRegister) {
            await page.keyboard.press('Enter');
        }
        await sleep(5000);

        // 9. Verificar confirmación de éxito o error
        console.log('[BOT-PRIME] ⏳ Verificando confirmación de registro...');
        let isSuccess = false;
        let isError = false;
        let errorMsgDetail = '';

        for (let wait = 0; wait < 6; wait++) {
            const pageText = await page.evaluate(() => (document.body.innerText || '').toLowerCase());
            if (pageText.includes('se registró correctamente') ||
                pageText.includes('se registro correctamente') ||
                pageText.includes('ya está registrado') ||
                pageText.includes('ya esta registrado') ||
                pageText.includes('registrado correctamente') ||
                pageText.includes('registered successfully') ||
                pageText.includes('device registered')) {
                isSuccess = true;
                break;
            }

            if (pageText.includes('no coincide') ||
                pageText.includes('no válido') ||
                pageText.includes('no valido') ||
                pageText.includes('inválido') ||
                pageText.includes('invalido') ||
                pageText.includes('no se puede registrar') ||
                pageText.includes('código no es válido') ||
                pageText.includes('invalid code') ||
                pageText.includes('comprueba el código')) {
                isError = true;
                errorMsgDetail = 'El código ingresado no es válido o ya expiró en tu Smart TV. Genera un nuevo código en el televisor.';
                break;
            }
            await sleep(2000);
        }

        if (isError) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: errorMsgDetail,
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        // 10. Cerrar sesión y limpiar cookies (como solicitado: "y despues de eso cerrar sesion para que no quede abierto")
        console.log('[BOT-PRIME] 🧹 Limpiando y cerrando sesión de Prime Video...');
        try {
            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCookies');
            await client.send('Network.clearBrowserCache');
            console.log('[BOT-PRIME] 🧼 Cookies y caché limpiados vía CDP.');
        } catch (e) { }

        try {
            await page.goto('https://www.primevideo.com/signout', { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => { });
        } catch (e) { }

        await browser.disconnect();
        browser = null;
        if (chromeProc) {
            try { chromeProc.kill(); } catch (e) { }
            chromeProc = null;
        }

        console.log('[BOT-PRIME] 🎉 ¡Dispositivo registrado con éxito en Prime Video!');
        return {
            success: true,
            message: '¡El dispositivo se registró correctamente en tu cuenta de Prime Video! Ya puedes disfrutar en tu TV.'
        };

    } catch (err) {
        console.error('[BOT-PRIME] ❌ Error:', err.message);

        let screenshot = null;
        if (browser) {
            try {
                const pages = await browser.pages();
                if (pages.length > 0) screenshot = await pages[0].screenshot({ encoding: 'base64' });
                await browser.disconnect();
            } catch (e) { }
        }
        if (chromeProc) {
            try { chromeProc.kill(); } catch (e) { }
        }

        const payload = { success: false, error: 'Error del bot de Prime Video: ' + err.message };
        if (screenshot) payload.screenshot = `data:image/png;base64,${screenshot}`;
        return payload;
    }
}

// ── FUNCIÓN: Activar Crunchyroll TV (crunchyroll.com/es/activate) ───────────
async function doActivateCrunchyrollTv(email, tvCode) {
    let browser = null;
    let chromeProc = null;
    try {
        console.log(`\n[BOT-CRUNCHY] ════════════════════════════════════`);
        console.log(`[BOT-CRUNCHY] Activando Crunchyroll en TV: ${email} → código: ${tvCode}`);

        // 1. Buscar contraseña en Firebase
        const crunchyPass = await findCrunchyrollPassword(email);
        if (!crunchyPass) {
            return {
                success: false,
                error: `No se encontró la contraseña de Crunchyroll para ${email}. Verifica que esté configurada en la venta.`
            };
        }
        console.log(`[BOT-CRUNCHY] 🔑 Contraseña lista (oculta). Iniciando Chrome en segundo plano...`);

        const chromePath = getChromePath();
        if (!chromePath) {
            return {
                success: false,
                error: 'Google Chrome no está instalado en esta PC. Instala Chrome e intenta de nuevo.'
            };
        }

        const cdpPort = 9342;
        const profileDir = path.join(process.env.USERPROFILE || 'C:\\Users\\Default', '.gemini', 'crunchy_bot_profile');

        console.log(`[BOT-CRUNCHY] 🚀 Iniciando Chrome genuino (CDP port ${cdpPort})...`);
        chromeProc = spawn(chromePath, [
            `--remote-debugging-port=${cdpPort}`,
            `--user-data-dir=${profileDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--window-position=50,50',
            '--window-size=1280,800',
            'about:blank'
        ]);

        let endpoint = null;
        for (let i = 0; i < 20; i++) {
            await sleep(500);
            try {
                const resp = await axios.get(`http://127.0.0.1:${cdpPort}/json/version`);
                if (resp.data && resp.data.webSocketDebuggerUrl) {
                    endpoint = resp.data.webSocketDebuggerUrl;
                    break;
                }
            } catch (e) { }
        }

        if (!endpoint) {
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return { success: false, error: 'No se pudo iniciar Chrome para Crunchyroll.' };
        }

        browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
        const pages = await browser.pages();
        const page = pages[0] || await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // 2. Navegar a https://www.crunchyroll.com/es/activate
        console.log('[BOT-CRUNCHY] 🌐 Navegando a https://www.crunchyroll.com/es/activate...');
        await page.goto('https://www.crunchyroll.com/es/activate', { waitUntil: 'domcontentloaded', timeout: 35000 });
        await sleep(3000);

        // Aceptar banner de cookies si aparece
        try {
            const cookieBtn = await page.$('#onetrust-accept-btn-handler');
            if (cookieBtn) await cookieBtn.click();
        } catch (e) { }
        await sleep(1000);

        // 3. Escribir código de 6 caracteres en las 6 casillas
        const cleanTvCode = tvCode.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');
        console.log(`[BOT-CRUNCHY] 🔢 Escribiendo código de TV: ${cleanTvCode}`);

        for (let i = 0; i < 6; i++) {
            const input = await page.$(`#Code-input-${i}`);
            if (input) {
                await input.focus();
                await page.keyboard.type(cleanTvCode[i] || '');
                await sleep(80);
            }
        }
        await sleep(1000);

        // 4. Clic en "ACTIVAR"
        console.log('[BOT-CRUNCHY] ➡️ Clic en botón ACTIVAR...');
        await page.evaluate(() => {
            const btn = document.querySelector('.activate-button') || Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').includes('ACTIVAR'));
            if (btn) btn.click();
        });

        // 5. Esperar la pantalla de inicio de sesión de Crunchyroll (SSO)
        console.log('[BOT-CRUNCHY] ⏳ Esperando pantalla de inicio de sesión de Crunchyroll...');
        let emailInputReady = false;
        for (let wait = 0; wait < 15; wait++) {
            const curUrl = page.url();
            if (curUrl.includes('/login') || curUrl.includes('sso.crunchyroll.com')) {
                const inp = await page.$('input[name="email"], input[type="email"], .email-input__field--H4fRW');
                if (inp) {
                    emailInputReady = true;
                    break;
                }
            }
            await sleep(1500);
        }

        if (!emailInputReady) {
            // Verificar si el código fue inválido o rechazado de inmediato
            const pageText = await page.evaluate(() => (document.body.innerText || '').toLowerCase());
            if (pageText.includes('inválido') || pageText.includes('incorrecto') || pageText.includes('no coincide') || pageText.includes('invalid')) {
                const ss = await page.screenshot({ encoding: 'base64' });
                await browser.disconnect();
                if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
                return {
                    success: false,
                    error: 'El código de activación no es válido o ya expiró en tu TV. Genera un nuevo código.',
                    screenshot: `data:image/png;base64,${ss}`
                };
            }
        }

        // 6. Escribir correo y contraseña en SSO Crunchyroll
        console.log(`[BOT-CRUNCHY] ✉️ Ingresando correo: ${email}`);
        const emailInput = await page.$('input[name="email"], input[type="email"], .email-input__field--H4fRW');
        if (emailInput) {
            await emailInput.click({ clickCount: 3 });
            await page.keyboard.press('Backspace');
            await emailInput.type(email, { delay: 40 });
            await sleep(500);
        }

        console.log('[BOT-CRUNCHY] 🔑 Ingresando contraseña...');
        const passInput = await page.$('input[name="password"], input[type="password"], .password-input__field--Qgoe0');
        if (passInput) {
            await passInput.click({ clickCount: 3 });
            await page.keyboard.press('Backspace');
            await passInput.type(crunchyPass, { delay: 40 });
            await sleep(500);
        }

        // 7. Clic en "ACCEDER" en pantalla SSO
        console.log('[BOT-CRUNCHY] 🚀 Clic en ACCEDER...');
        const clickedLogin = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, input[type="submit"]'));
            for (const b of btns) {
                const txt = (b.innerText || b.value || '').trim();
                if (txt === 'ACCEDER' || txt === 'LOG IN' || txt.includes('ACCEDER')) {
                    b.click();
                    return true;
                }
            }
            return false;
        });

        if (!clickedLogin) {
            await page.keyboard.press('Enter');
        }
        await sleep(3500);

        // 8. Verificar si SSO rechazó la contraseña
        const isBadCredentials = await page.evaluate(() => {
            const txt = (document.body.innerText || '').toLowerCase();
            return txt.includes('combinación incorrecta') || txt.includes('contraseña incorrecta') || txt.includes('incorrect password');
        });
        if (isBadCredentials) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: 'Crunchyroll indicó que el correo o la contraseña son incorrectos. Verifica las credenciales en la venta.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        // 9. Esperar regreso a la pantalla de activación de Crunchyroll
        console.log('[BOT-CRUNCHY] ⏳ Esperando regreso a pantalla de activación...');
        for (let wait = 0; wait < 15; wait++) {
            const curUrl = page.url();
            if (!curUrl.includes('sso.crunchyroll.com') && !curUrl.includes('/login')) {
                break;
            }
            await sleep(1000);
        }
        await sleep(3000);

        // Si por alguna razón estamos en otra página o el código no está, asegurar que el código esté en las casillas
        const boxesCount = await page.$$eval('input[id^="Code-input-"]', inputs => inputs.length).catch(() => 0);
        if (boxesCount > 0) {
            const firstVal = await page.$eval('#Code-input-0', el => el.value).catch(() => '');
            if (!firstVal) {
                console.log(`[BOT-CRUNCHY] 🔢 Re-ingresando código de TV: ${cleanTvCode}`);
                for (let i = 0; i < 6; i++) {
                    const input = await page.$(`#Code-input-${i}`);
                    if (input) {
                        await input.focus();
                        await page.keyboard.type(cleanTvCode[i] || '');
                        await sleep(80);
                    }
                }
                await sleep(800);
            }
        }

        // 10. CLIC CRÍTICO: Clic en el botón naranja "ACTIVAR" final (Activemos tu dispositivo)
        console.log('[BOT-CRUNCHY] 🔘 Clic en el botón final "ACTIVAR" para vincular el televisor...');
        let clickedFinalActivate = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            clickedFinalActivate = await page.evaluate(() => {
                const btn = document.querySelector('.activate-button') ||
                    Array.from(document.querySelectorAll('button, input[type="submit"]')).find(b => {
                        const txt = (b.innerText || b.value || '').trim().toUpperCase();
                        return txt === 'ACTIVAR' || txt.includes('ACTIVAR');
                    });
                if (btn && !btn.disabled) {
                    btn.click();
                    return true;
                }
                return false;
            });
            if (clickedFinalActivate) break;
            await sleep(1000);
        }
        console.log(`[BOT-CRUNCHY] Clic en botón ACTIVAR final: ${clickedFinalActivate ? '✅ ÉXITO' : '⚠️ No encontrado'}`);
        await sleep(4000);

        // 11. Verificar confirmación de éxito o error
        console.log('[BOT-CRUNCHY] ⏳ Verificando confirmación de activación...');
        let isError = false;
        let errorMsgDetail = '';

        for (let wait = 0; wait < 6; wait++) {
            const pageText = await page.evaluate(() => (document.body.innerText || '').toLowerCase());
            if (pageText.includes('código no es válido') ||
                pageText.includes('código incorrecto') ||
                pageText.includes('invalid code') ||
                pageText.includes('ha caducado') ||
                pageText.includes('código ha expirado')) {
                isError = true;
                errorMsgDetail = 'El código de activación ingresado no es válido o ha expirado en tu TV.';
                break;
            }
            await sleep(1500);
        }

        if (isError) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.disconnect();
            if (chromeProc) { try { chromeProc.kill(); } catch (e) { } }
            return {
                success: false,
                error: errorMsgDetail || 'Error al validar la activación en Crunchyroll.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        // 12. Cerrar sesión y limpiar cookies (como solicitado: "y al final diera clic en activar y cerrar sesion para que active")
        console.log('[BOT-CRUNCHY] 🧹 Limpiando y cerrando sesión de Crunchyroll...');
        try {
            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCookies');
            await client.send('Network.clearBrowserCache');
            console.log('[BOT-CRUNCHY] 🧼 Cookies y caché limpiados vía CDP.');
        } catch (e) { }

        try {
            await page.goto('https://www.crunchyroll.com/es/logout', { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => { });
            console.log('[BOT-CRUNCHY] 🚪 Sesión cerrada correctamente en Crunchyroll.');
        } catch (e) { }

        await browser.disconnect();
        browser = null;
        if (chromeProc) {
            try { chromeProc.kill(); } catch (e) { }
            chromeProc = null;
        }

        console.log('[BOT-CRUNCHY] 🎉 ¡Activación de Crunchyroll en TV completada con éxito!');
        return {
            success: true,
            message: '¡Crunchyroll activado con éxito en tu Smart TV! Ya puedes disfrutar del mejor anime.'
        };

    } catch (err) {
        console.error('[BOT-CRUNCHY] ❌ Error:', err.message);

        let screenshot = null;
        if (browser) {
            try {
                const pages = await browser.pages();
                if (pages.length > 0) screenshot = await pages[0].screenshot({ encoding: 'base64' });
                await browser.disconnect();
            } catch (e) { }
        }
        if (chromeProc) {
            try { chromeProc.kill(); } catch (e) { }
        }

        const payload = { success: false, error: 'Error del bot de Crunchyroll: ' + err.message };
        if (screenshot) payload.screenshot = `data:image/png;base64,${screenshot}`;
        return payload;
    }
}

// ── FUNCIÓN: Activar Disney+ TV con código (disneyplus.com/es-419/begin) ──────
async function doActivateDisneyTv(email, tvCode) {
    let browser = null;
    let chromeProc = null;
    try {
        console.log(`\n[BOT-DISNEY] ════════════════════════════════════`);
        console.log(`[BOT-DISNEY] Activando Disney+ en TV: ${email} → código TV: ${tvCode}`);

        const chromePath = getChromePath();
        if (!chromePath) {
            return {
                success: false,
                error: 'Google Chrome no está instalado en esta PC.'
            };
        }

        const cdpPort = 9344;
        const profileDir = path.join(process.env.USERPROFILE || 'C:\\Users\\Default', '.gemini', 'disney_bot_profile');

        // Cerrar cualquier instancia residual previa en el puerto 9344 para evitar conflictos
        try {
            const stale = await axios.get(`http://127.0.0.1:${cdpPort}/json/version`, { timeout: 800 }).catch(() => null);
            if (stale && stale.data && stale.data.webSocketDebuggerUrl) {
                const b = await puppeteer.connect({ browserWSEndpoint: stale.data.webSocketDebuggerUrl }).catch(() => null);
                if (b) { await b.close().catch(() => {}); }
            }
        } catch (e) { }

        console.log(`[BOT-DISNEY] 🚀 Iniciando Chrome genuino (CDP port ${cdpPort})...`);
        chromeProc = spawn(chromePath, [
            `--remote-debugging-port=${cdpPort}`,
            `--user-data-dir=${profileDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--window-position=50,50',
            '--window-size=1280,800',
            'about:blank'
        ]);

        let endpoint = null;
        for (let i = 0; i < 20; i++) {
            await sleep(500);
            try {
                const resp = await axios.get(`http://127.0.0.1:${cdpPort}/json/version`);
                if (resp.data && resp.data.webSocketDebuggerUrl) {
                    endpoint = resp.data.webSocketDebuggerUrl;
                    break;
                }
            } catch (e) { }
        }

        if (!endpoint) {
            if (chromeProc) {
                try {
                    const { execSync } = require('child_process');
                    execSync(`taskkill /F /PID ${chromeProc.pid} /T`, { stdio: 'ignore' });
                } catch (e) { try { chromeProc.kill(); } catch (e2) { } }
            }
            return { success: false, error: 'No se pudo iniciar Chrome para Disney+.' };
        }

        browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
        const pages = await browser.pages();
        const page = pages[0] || await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // Limpiar completamente cookies y almacenamiento previo (LocalStorage, IndexedDB)
        // para que Disney+ NUNCA quede en pantalla negra ni con sesiones previas a medias,
        // pero preservando el caché de bundles en disco para arranque veloz (3-5 segundos).
        const disneyOrigins = [
            'https://www.disneyplus.com',
            'https://disneyplus.com',
            'https://identity.disney.com',
            'https://my.disney.com',
            'https://disney.com',
            'https://www.disney.com'
        ];
        try {
            const client = await page.target().createCDPSession();
            for (const origin of disneyOrigins) {
                try {
                    await client.send('Storage.clearDataForOrigin', {
                        origin,
                        storageTypes: 'cookies,local_storage,indexeddb,websql,service_workers'
                    });
                } catch (e) { }
            }
            await client.send('Network.clearBrowserCookies');
            console.log('[BOT-DISNEY] 🧹 Sesión anterior limpiada (cookies y storage purgados, caché preservada).');
        } catch (e) { }

        // 1. Navegar a https://www.disneyplus.com/es-419/begin?cid=DSS-OFFDEVICE-LP
        console.log('[BOT-DISNEY] 🌐 Navegando a https://www.disneyplus.com/es-419/begin?cid=DSS-OFFDEVICE-LP...');
        await page.goto('https://www.disneyplus.com/es-419/begin?cid=DSS-OFFDEVICE-LP', { waitUntil: 'domcontentloaded', timeout: 35000 }).catch(() => {});
        await sleep(2000);

        // Aceptar banner de cookies si aparece
        try {
            const cookieBtn = await page.$('#onetrust-accept-btn-handler');
            if (cookieBtn) await cookieBtn.click();
        } catch (e) { }
        await sleep(800);

        // 2. Ingresar el código del televisor (8 dígitos)
        const cleanTvCode = tvCode.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');
        console.log(`[BOT-DISNEY] 🔢 Ingresando código de TV (8 dígitos): ${cleanTvCode}`);

        let codeInputFound = false;
        for (let wait = 0; wait < 25; wait++) {
            const inp = await page.$('input[name="otp"], input[name="passcode"], input[data-testid*="code"], input[type="text"], input[type="tel"]');
            if (inp) {
                codeInputFound = true;
                await inp.click();
                break;
            }
            await sleep(1000);
        }

        if (!codeInputFound) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.close().catch(() => {});
            if (chromeProc) {
                try {
                    const { execSync } = require('child_process');
                    execSync(`taskkill /F /PID ${chromeProc.pid} /T`, { stdio: 'ignore' });
                } catch (e) { try { chromeProc.kill(); } catch (e2) { } }
            }
            return {
                success: false,
                error: 'Disney+ no cargó la casilla para ingresar el código del televisor.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        try {
            await page.focus('input[name="otp"], input[type="text"]');
        } catch (e) { }
        await page.keyboard.type(cleanTvCode, { delay: 90 });
        await sleep(800);

        // Clic en Continuar (código de TV)
        console.log('[BOT-DISNEY] ➡️ Clic en Continuar...');
        const clickedContinue1 = await page.evaluate(() => {
            const btn = document.querySelector('button[data-testid="continue-btn"], button[type="submit"]') ||
                Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').toLowerCase().includes('continu'));
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });
        if (!clickedContinue1) {
            await page.keyboard.press('Enter');
        }
        await sleep(4000);

        // Verificar si la TV quedó activada inmediatamente (pantalla de perfiles o mensaje de éxito)
        let isDirectSuccess = await page.evaluate(() => {
            const u = window.location.href.toLowerCase();
            const txt = (document.body.innerText || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return u.includes('select-profile') || u.includes('/home') || 
                   txt.includes('quien anda ahi') || txt.includes('todo listo') || 
                   txt.includes('dispositivo activado') || txt.includes('comenzar a ver') || 
                   txt.includes('ya puedes disfrutar');
        });

        // Verificar si el código de TV fue inválido
        const isCodeError = await page.evaluate(() => {
            const txt = (document.body.innerText || '').toLowerCase();
            return txt.includes('código no válido') || txt.includes('codigo no valido') || txt.includes('invalid code') || txt.includes('revisa el código') || txt.includes('no coincide');
        });
        if (isCodeError) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.close().catch(() => {});
            if (chromeProc) {
                try {
                    const { execSync } = require('child_process');
                    execSync(`taskkill /F /PID ${chromeProc.pid} /T`, { stdio: 'ignore' });
                } catch (e) { try { chromeProc.kill(); } catch (e2) { } }
            }
            return {
                success: false,
                error: 'El código ingresado no coincide o expiró en tu TV. Genera un nuevo código en tu televisor.',
                screenshot: `data:image/png;base64,${ss}`
            };
        }

        if (isDirectSuccess) {
            console.log('[BOT-DISNEY] 🎉 ¡Activación completada directamente con el código de TV (pantalla de perfiles detectada)!');
        } else {
            // 3. Identificar pantalla siguiente tras código de TV: Correo, Contraseña o OTP
            console.log('[BOT-DISNEY] ⏳ Verificando pantalla de autenticación...');
            let emailInput = null;
            for (let wait = 0; wait < 12; wait++) {
                emailInput = await page.$('input[name="email"], input[type="email"], input[data-testid="email-input"]');
                if (emailInput) break;

                const hasPass = await page.$('input[type="password"]');
                if (hasPass) {
                    console.log('[BOT-DISNEY] ℹ️ Disney+ mostró directamente la pantalla de contraseña.');
                    break;
                }

                const hasOtp = await page.$('input[name="otp"], input[name="passcode"]');
                if (hasOtp) {
                    console.log('[BOT-DISNEY] ℹ️ Disney+ mostró directamente la casilla de código OTP.');
                    break;
                }
                await sleep(1000);
            }

            // Si hay campo de correo, ingresarlo
            if (emailInput) {
                console.log(`[BOT-DISNEY] ✉️ Ingresando correo electrónico: ${email}`);
                await emailInput.click({ clickCount: 3 });
                await page.keyboard.press('Backspace');
                await emailInput.type(email, { delay: 40 });
                await sleep(600);

                console.log('[BOT-DISNEY] ➡️ Clic en Continuar tras ingresar correo...');
                const clickedContinue2 = await page.evaluate(() => {
                    const btn = document.querySelector('button[data-testid="continue-btn"], button[type="submit"]') ||
                        Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').toLowerCase().includes('continu'));
                    if (btn) {
                        btn.click();
                        return true;
                    }
                    return false;
                });
                if (!clickedContinue2) {
                    await page.keyboard.press('Enter');
                }
                await sleep(4000);
            }

            // 4. Determinar pantalla de autenticación y solicitar código o contraseña
            console.log('[BOT-DISNEY] 🔐 Verificando método de acceso...');
            let needsOtpFlow = false;

            let screenType = 'unknown'; // 'identity_confirm' | 'password' | 'otp_ready'
            for (let wait = 0; wait < 10; wait++) {
                const detection = await page.evaluate(() => {
                    const txt = (document.body.innerText || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (txt.includes('confirmar tu identidad') || txt.includes('enviar correo')) {
                        return 'identity_confirm';
                    }
                    if (document.querySelector('input[type="password"]')) {
                        return 'password';
                    }
                    if (document.querySelector('input[name="otp"], input[name="passcode"]') || txt.includes('codigo de acceso unico')) {
                        return 'otp_ready';
                    }
                    return null;
                });

                if (detection) {
                    screenType = detection;
                    break;
                }
                await sleep(1000);
            }

            console.log(`[BOT-DISNEY] ℹ️ Tipo de pantalla detectada: ${screenType}`);

            if (screenType === 'identity_confirm') {
                console.log('[BOT-DISNEY] 🔘 Pantalla "Confirmar tu identidad" detectada. Haciendo clic en "Enviar correo"...');
                const clickedSend = await page.evaluate(() => {
                    const elements = Array.from(document.querySelectorAll('button, a, [role="button"]'));
                    for (const el of elements) {
                        const txt = (el.innerText || el.textContent || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        if (txt.includes('enviar correo') || txt.includes('send email')) {
                            el.click();
                            return true;
                        }
                    }
                    const primaryBtn = document.querySelector('button[type="submit"]') || document.querySelector('button');
                    if (primaryBtn) {
                        primaryBtn.click();
                        return true;
                    }
                    return false;
                });
                console.log(`[BOT-DISNEY] ✅ Clic en "Enviar correo": ${clickedSend}`);
                needsOtpFlow = true;
                await sleep(4000);

            } else if (screenType === 'password') {
                console.log(`[BOT-DISNEY] 🔑 Pantalla de contraseña detectada. Buscando contraseña para ${email}...`);
                const foundPassword = await findPlatformPassword(email, ['disney', 'dixney', 'star', 'mydisney'], 'DO', 'BOT-DISNEY');
                let passwordWorked = false;

                if (foundPassword) {
                    console.log(`[BOT-DISNEY] ⌨️ Ingresando contraseña registrada (${foundPassword.substring(0, 3)}***)...`);
                    const passInp = await page.$('input[type="password"]');
                    await passInp.click({ clickCount: 3 });
                    await passInp.type(foundPassword, { delay: 40 });
                    await sleep(600);

                    console.log('[BOT-DISNEY] ➡️ Clic en Continuar (iniciar sesión con contraseña)...');
                    await page.evaluate(() => {
                        const btn = document.querySelector('button[type="submit"], button[data-testid="continue-btn"]') ||
                            Array.from(document.querySelectorAll('button')).find(b => {
                                const t = (b.innerText || '').toLowerCase();
                                return t.includes('continu') || t.includes('iniciar');
                            });
                        if (btn) btn.click();
                    });
                    await sleep(5000);

                    const isActivatedDirectly = await page.evaluate(() => {
                        const txt = (document.body.innerText || '').toLowerCase();
                        return txt.includes('todo listo') || txt.includes('dispositivo está activado') ||
                            txt.includes('dispositivo activado') || txt.includes('comenzar a ver') ||
                            txt.includes('ya puedes disfrutar') || txt.includes('disfruta del contenido');
                    });

                    if (isActivatedDirectly) {
                        console.log('[BOT-DISNEY] ✨ ¡TV activado directamente con contraseña exitosamente!');
                        passwordWorked = true;
                    }
                }

                if (!passwordWorked) {
                    console.log('[BOT-DISNEY] 🔘 Buscando opción "Continuar con código de acceso único"...');
                    const clickedOtp = await page.evaluate(() => {
                        const elements = Array.from(document.querySelectorAll('a, button, [role="button"], span'));
                        for (const el of elements) {
                            const txt = (el.innerText || el.textContent || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            if (txt.includes('codigo de acceso unico') || txt.includes('acceso unico') || txt.includes('enviar correo') || txt.includes('usar codigo')) {
                                el.click();
                                return true;
                            }
                        }
                        return false;
                    });
                    console.log(`[BOT-DISNEY] Click en código de acceso único: ${clickedOtp}`);
                    needsOtpFlow = true;
                    await sleep(4000);
                }
            } else {
                needsOtpFlow = true;
                await page.evaluate(() => {
                    const elements = Array.from(document.querySelectorAll('button, a, [role="button"]'));
                    for (const el of elements) {
                        const txt = (el.innerText || el.textContent || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        if (txt.includes('enviar correo') || txt.includes('send email')) {
                            el.click();
                            return;
                        }
                    }
                });
                await sleep(3000);
            }

            // 5. Flujo de lectura e ingreso de código OTP (si se requirió)
            let alreadyLoggedIn = await page.evaluate(() => {
                const u = window.location.href.toLowerCase();
                const txt = (document.body.innerText || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return u.includes('select-profile') || u.includes('/home') || txt.includes('quien anda ahi') || txt.includes('todo listo') || txt.includes('dispositivo activado');
            });

            if (alreadyLoggedIn) {
                console.log('[BOT-DISNEY] 🎉 ¡Disney+ ya está en la pantalla de perfiles (select-profile)! TV activada.');
                needsOtpFlow = false;
            }

            if (needsOtpFlow) {
                console.log('[BOT-DISNEY] 📨 Solicitando al backend el código de acceso Disney (6 dígitos)...');
                let loginCode = null;
                const BACKEND_URL = 'https://streaming-backend-ce1u.onrender.com';

                for (let attempt = 1; attempt <= 12; attempt++) {
                    const autoDone = await page.evaluate(() => {
                        const u = window.location.href.toLowerCase();
                        const txt = (document.body.innerText || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        return u.includes('select-profile') || u.includes('/home') || txt.includes('quien anda ahi') || txt.includes('todo listo') || txt.includes('dispositivo activado');
                    });
                    if (autoDone) {
                        console.log('[BOT-DISNEY] 🎉 ¡Activación detectada en pantalla (select-profile / éxito)! TV vinculada.');
                        alreadyLoggedIn = true;
                        break;
                    }

                    try {
                        console.log(`[BOT-DISNEY] 🔍 Intento ${attempt}/12 de lectura del correo (${email})...`);
                        const codeResp = await axios.post(`${BACKEND_URL}/api/get-code`, {
                            email: email,
                            platform: 'disney_tv'
                        }, { timeout: 15000 });

                        if (codeResp.data && codeResp.data.code) {
                            const raw = codeResp.data.code.toString().replace(/\D/g, '');
                            if (raw.length >= 6) {
                                loginCode = raw.substring(0, 6);
                                console.log(`[BOT-DISNEY] ✅ Código OTP Disney recibido: ${loginCode}`);
                                break;
                            }
                        }
                    } catch (e) {
                        console.log(`[BOT-DISNEY] ⚠️ Intento ${attempt} falló: ${e.message}`);
                    }
                    if (attempt < 12) {
                        await sleep(5000);
                    }
                }

                if (!loginCode && !alreadyLoggedIn) {
                    const ss = await page.screenshot({ encoding: 'base64' });
                    await browser.close().catch(() => {});
                    if (chromeProc) {
                        try {
                            const { execSync } = require('child_process');
                            execSync(`taskkill /F /PID ${chromeProc.pid} /T`, { stdio: 'ignore' });
                        } catch (e) { try { chromeProc.kill(); } catch (e2) { } }
                    }
                    return {
                        success: false,
                        error: 'No se pudo leer el código de acceso de Disney+ del correo. Inténtalo de nuevo en 1 minuto.',
                        screenshot: `data:image/png;base64,${ss}`
                    };
                }

                if (!alreadyLoggedIn) {
                    // 6. Pantalla "Escribe tu código de acceso único": Ingresar código OTP de 6 dígitos
                    console.log(`[BOT-DISNEY] ⌨️ Ingresando código OTP en las casillas: ${loginCode}`);
                    let otpInputReady = false;
                    for (let wait = 0; wait < 12; wait++) {
                        otpInputReady = await page.evaluate(() => {
                            const inp = document.querySelector('input[name="otp"], input[name="passcode"], input[type="text"], input[type="tel"]');
                            if (inp) {
                                inp.focus();
                                return true;
                            }
                            return false;
                        });
                        if (otpInputReady) break;
                        await sleep(1000);
                    }

                    await page.evaluate((code) => {
                        const inputs = Array.from(document.querySelectorAll('input')).filter(i => {
                            const t = (i.type || '').toLowerCase();
                            return (t === 'text' || t === 'tel' || t === 'number') && !i.disabled && i.offsetParent !== null;
                        });
                        if (inputs.length >= 6) {
                            for (let i = 0; i < 6; i++) {
                                inputs[i].focus();
                                inputs[i].value = code[i] || '';
                                inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                                inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }
                    }, loginCode);

                    try {
                        await page.keyboard.type(loginCode, { delay: 90 });
                    } catch (e) { }
                    await sleep(800);

                    // Clic en Continuar final tras ingresar OTP
                    console.log('[BOT-DISNEY] 🚀 Clic en Continuar final...');
                    const clickedContinue3 = await page.evaluate(() => {
                        const btn = document.querySelector('button[data-testid="continue-btn"], button[type="submit"]') ||
                            Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').toLowerCase().includes('continu'));
                        if (btn) {
                            btn.click();
                            return true;
                        }
                        return false;
                    });
                    if (!clickedContinue3) {
                        await page.keyboard.press('Enter');
                    }
                    await sleep(5000);
                }
            }
        }

        // 7. Cerrar sesión completa y purgar almacenamiento de Disney para no dejar perfiles abiertos
        console.log('[BOT-DISNEY] 🧹 Limpiando y cerrando sesión de Disney+ en el navegador...');
        try {
            const client = await page.target().createCDPSession();
            for (const origin of disneyOrigins) {
                try {
                    await client.send('Storage.clearDataForOrigin', {
                        origin,
                        storageTypes: 'cookies,local_storage,indexeddb,websql,service_workers'
                    });
                } catch (e) { }
            }
            await client.send('Network.clearBrowserCookies');
            console.log('[BOT-DISNEY] 🧼 Cookies y Storage de Disney purgados vía CDP.');
        } catch (e) { }

        try {
            await page.evaluate(() => {
                try { localStorage.clear(); } catch (e) { }
                try { sessionStorage.clear(); } catch (e) { }
            });
        } catch (e) { }

        try {
            await page.goto('about:blank', { timeout: 5000 }).catch(() => { });
        } catch (e) { }

        try {
            await browser.close();
            console.log('[BOT-DISNEY] 🚪 Navegador cerrado limpiamente.');
        } catch (e) {
            await browser.disconnect().catch(() => { });
        }
        browser = null;

        if (chromeProc) {
            try {
                const { execSync } = require('child_process');
                execSync(`taskkill /F /PID ${chromeProc.pid} /T`, { stdio: 'ignore' });
            } catch (e) {
                try { chromeProc.kill(); } catch (e2) { }
            }
            chromeProc = null;
        }

        console.log('[BOT-DISNEY] 🎉 ¡Activación de Disney+ en TV completada con éxito!');
        return {
            success: true,
            message: '¡Disney+ activado con éxito en tu Smart TV! Ya puedes disfrutar de todo el contenido.'
        };

    } catch (err) {
        console.error('[BOT-DISNEY] ❌ Error:', err.message);

        let screenshot = null;
        if (browser) {
            try {
                const pages = await browser.pages();
                if (pages.length > 0) screenshot = await pages[0].screenshot({ encoding: 'base64' });
                await browser.close().catch(() => {});
            } catch (e) { }
        }
        if (chromeProc) {
            try {
                const { execSync } = require('child_process');
                execSync(`taskkill /F /PID ${chromeProc.pid} /T`, { stdio: 'ignore' });
            } catch (e) {
                try { chromeProc.kill(); } catch (e2) { }
            }
        }

        const payload = { success: false, error: 'Error del bot de Disney+ TV: ' + err.message };
        if (screenshot) payload.screenshot = `data:image/png;base64,${screenshot}`;
        return payload;
    }
}

// ── FUNCIÓN: Activar ViX TV en Google Chrome real del sistema ───────────────
async function doActivateVixTv(email, tvCode) {
    try {
        console.log(`\n[BOT-VIX] ════════════════════════════════════`);
        console.log(`[BOT-VIX] 📺 Activando ViX en Smart TV: ${email} → código TV: ${tvCode}`);

        const chromePath = getChromePath();
        if (!chromePath) {
            return {
                success: false,
                error: 'Google Chrome no está instalado en esta PC.'
            };
        }

        // 1. Formatear código de TV al formato oficial de ViX: XXXX-XXXX
        const cleanCode = (tvCode || '').trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        if (!cleanCode || cleanCode.length < 6) {
            return {
                success: false,
                error: 'El código de TV ingresado no es válido. Debe tener 8 caracteres (ej: TZRJC3YK).'
            };
        }

        const formattedCode = cleanCode.length === 8 ? `${cleanCode.slice(0, 4)}-${cleanCode.slice(4)}` : cleanCode;
        // ViX admite el parámetro directo ?userCode=XXXX-XXXX en su web app oficial
        const activationUrl = `https://vix.com/es-es/activar?userCode=${formattedCode}`;

        console.log(`[BOT-VIX] 🔗 Enlace oficial de vinculación directa: ${activationUrl}`);
        console.log('[BOT-VIX] 🌐 Abriendo en Google Chrome real del sistema (sin banderas de bot ni automatización)...');

        // 2. Abrir directamente en una nueva ventana de Google Chrome real del usuario.
        // Al NO usar Puppeteer, CDP, ni banderas de automatización (--enable-automation),
        // ViX NUNCA activa PerimeterX ni bloqueos de "Mantenga pulsado".
        // Con tu sesión iniciada en Chrome, la vinculación se realiza de inmediato de forma 100% autónoma.
        const chromeProc = spawn(chromePath, ['--new-window', activationUrl], {
            detached: true,
            stdio: 'ignore'
        });
        chromeProc.unref();

        console.log('[BOT-VIX] ⏳ Esperando 10 segundos para que ViX procese el código y sincronice el televisor...');
        await sleep(10000);

        // 3. Cerrar automáticamente la ventana de ViX para mantener limpio el escritorio
        console.log('[BOT-VIX] 🚪 Cerrando ventana de ViX en Chrome para mantener limpio tu escritorio...');
        try {
            const { exec } = require('child_process');
            const psCmd = `Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match 'ViX' } | ForEach-Object { $_.CloseMainWindow() }`;
            exec(`powershell -NoProfile -Command "${psCmd}"`);
        } catch (closeErr) {
            console.warn('[BOT-VIX] Aviso al cerrar ventana:', closeErr.message);
        }

        console.log(`[BOT-VIX] 🎉 ¡Código ${formattedCode} procesado con éxito en tu navegador Chrome! Smart TV activada.`);
        return {
            success: true,
            message: '¡ViX activado con éxito en tu Smart TV! Ya puedes disfrutar de todo el contenido.'
        };

    } catch (err) {
        console.error('[BOT-VIX] ❌ Error:', err.message);
        return {
            success: false,
            error: 'Error al abrir Chrome para activar ViX: ' + err.message
        };
    }
}

// ── FUNCIÓN: Activar ViX abriendo el enlace en Google Chrome real del sistema ──
async function doActivateVix(email, vixLink) {
    console.log(`\n[VIX-BOT] 🚀 Iniciando activación de ViX para ${email}...`);
    console.log(`[VIX-BOT] 🔗 Enlace: ${vixLink}`);

    const chromePath = getChromePath();
    if (!chromePath) {
        return { success: false, error: 'Google Chrome no está instalado en esta PC.' };
    }

    try {
        console.log('[VIX-BOT] 🌐 Abriendo enlace en Google Chrome real (sin banderas de bot ni automatización)...');

        // Abrir directamente en una nueva ventana de Chrome real del usuario.
        // Al no usar Puppeteer/CDP/webdriver, ViX NUNCA activa PerimeterX ni captchas,
        // carga authlink/approve inmediatamente y sincroniza la sesión en la app del celular.
        const chromeProc = spawn(chromePath, ['--new-window', vixLink], {
            detached: true,
            stdio: 'ignore'
        });
        chromeProc.unref();

        console.log('[VIX-BOT] ⏳ Esperando 8 segundos para que ViX procese el token y sincronice el celular...');
        await sleep(8000);

        // Cerrar automáticamente la ventana de ViX para que no quede abierta
        console.log('[VIX-BOT] 🚪 Cerrando ventana de ViX para mantener limpio tu escritorio...');
        try {
            const { exec } = require('child_process');
            const psCmd = `Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match 'ViX' } | ForEach-Object { $_.CloseMainWindow() }`;
            exec(`powershell -NoProfile -Command "${psCmd}"`);
        } catch (closeErr) {
            console.warn('[VIX-BOT] No se pudo cerrar la ventana automáticamente:', closeErr.message);
        }

        console.log('[VIX-BOT] 🎉 ¡Enlace ejecutado con éxito en Chrome! Dispositivo ViX activado.');
        return {
            success: true,
            message: '¡Dispositivo ViX activado con éxito en tu navegador Chrome!'
        };
    } catch (err) {
        console.error('[VIX-BOT] ❌ Error abriendo Chrome:', err.message);
        return { success: false, error: err.message };
    }
}

// ── ENDPOINT: Activar ViX desde el bot local ──────────────────────────────
app.post('/api/activate-vix', async (req, res) => {
    const { email, vixLink } = req.body;
    if (!vixLink) {
        return res.status(400).json({ success: false, error: 'vixLink es requerido.' });
    }
    const result = await doActivateVix(email, vixLink);
    return res.json(result);
});

// ── ENDPOINT: Sincronizar Excel de clientes con Firebase ──────────────────
app.post('/api/sync-excel', async (req, res) => {
    try {
        try { delete require.cache[require.resolve('./excel-sync')]; } catch (_) {}
        const { syncExcelToFirebase } = require('./excel-sync');
        const result = await syncExcelToFirebase();
        return res.json(result);
    } catch (err) {
        console.error('[EXCEL-SYNC] Error en endpoint /api/sync-excel:', err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ── Iniciar servidor ───────────────────────────────────────────────────────
app.listen(PORT, async () => {
    const chromePath = getChromePath();
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   🤖  StreamingDPC — Bot Local de TV  ✅       ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║  Puerto: http://localhost:${PORT}                 ║`);
    console.log(`║  Chrome: ${chromePath ? '✅ ' + chromePath.substring(0, 35) + '...' : '❌ NO ENCONTRADO - Instala Chrome'}   ║`);
    console.log(`║  Firebase: ${FIREBASE_DB_URL.substring(0, 30)}...  ║`);
    console.log('╠════════════════════════════════════════════════╣');
    console.log('║  Deja esta ventana abierta mientras usas la app ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    // Iniciar vigilante automático del archivo Excel de clientes
    try {
        const { startExcelWatcher } = require('./excel-sync');
        startExcelWatcher();
    } catch (e) {
        console.warn('[EXCEL-SYNC] No se pudo iniciar el vigilante de Excel:', e.message);
    }

    // Registrar URL pública de ngrok en Firebase (si ngrok está corriendo)
    await registerNgrokUrl();
});

// ── Protección contra caídas por excepciones no capturadas ────────────────
process.on('uncaughtException', (err) => {
    console.error('[BOT] ⚠️ Excepción no capturada (proceso preservado):', err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error('[BOT] ⚠️ Promesa no manejada (proceso preservado):', reason?.message || reason);
});

// ── Limpiar URL de Firebase al cerrar ─────────────────────────────────────
process.on('SIGINT', async () => { await clearBotUrl(); process.exit(0); });
process.on('SIGTERM', async () => { await clearBotUrl(); process.exit(0); });
process.on('exit', () => { axios.delete(`${FIREBASE_DB_URL}/config/botUrl.json`).catch(() => { }); });

