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

// ── Al arrancar: registrar URL pública de ngrok en Firebase ────────────────
async function registerNgrokUrl() {
    try {
        // El API local de ngrok siempre corre en el puerto 4040
        const resp = await axios.get('http://localhost:4040/api/tunnels', { timeout: 3000 });
        const tunnels = resp.data && resp.data.tunnels;
        if (tunnels && tunnels.length > 0) {
            // Buscar el tunel HTTPS
            const https = tunnels.find(t => t.proto === 'https') || tunnels[0];
            const publicUrl = https.public_url;
            await axios.put(`${FIREBASE_DB_URL}/config/botUrl.json`, JSON.stringify(publicUrl));
            console.log(`[BOT] 🌐 URL pública ngrok registrada en Firebase: ${publicUrl}`);
            console.log(`[BOT] ✅ Clientes remotos podrán activar TV desde cualquier lugar.`);
            return publicUrl;
        }
    } catch (e) {
        console.log('[BOT] ℹ️  ngrok no detectado. Solo clientes en la misma red podrán activar TV.');
        console.log('[BOT]    Para clientes externos, ejecuta: ngrok http 3099');
    }
    return null;
}

// ── Al cerrar el bot: limpiar la URL de Firebase ───────────────────────────
async function clearBotUrl() {
    try {
        await axios.delete(`${FIREBASE_DB_URL}/config/botUrl.json`);
        console.log('[BOT] 🧹 URL pública eliminada de Firebase.');
    } catch (e) { /* silencioso */ }
}

// ── Función reutilizable: buscar contraseña de Netflix en Firebase ─────────
async function findNetflixPassword(targetEmail) {
    const email = targetEmail.toLowerCase().trim();

    // 1. Buscar en clientSales
    try {
        const resp = await axios.get(`${FIREBASE_DB_URL}/clientSales.json`);
        const data = resp.data;
        if (data) {
            for (const phone of Object.keys(data)) {
                const salesArr = Array.isArray(data[phone]) ? data[phone] : Object.values(data[phone]);
                for (const sale of salesArr) {
                    if (!sale?.items) continue;
                    const items = Array.isArray(sale.items) ? sale.items : Object.values(sale.items);
                    for (const item of items) {
                        if (!item?.specificEmails) continue;
                        const screens = Array.isArray(item.specificEmails) ? item.specificEmails : Object.values(item.specificEmails);
                        for (const s of screens) {
                            if (s?.email?.toLowerCase().trim() === email &&
                                s?.platform?.toLowerCase().includes('netflix') && s?.pass) {
                                console.log(`[BOT] ✅ Pass encontrado en clientSales (${phone})`);
                                return s.pass.trim();
                            }
                        }
                    }
                }
            }
        }
    } catch (e) { console.warn('[BOT] clientSales error:', e.message); }

    // 2. Buscar en sellerSales
    try {
        const resp = await axios.get(`${FIREBASE_DB_URL}/sellerSales.json`);
        const data = resp.data;
        if (data) {
            for (const seller of Object.keys(data)) {
                const salesArr = Array.isArray(data[seller]) ? data[seller] : Object.values(data[seller]);
                for (const sale of salesArr) {
                    if (!sale?.items) continue;
                    const items = Array.isArray(sale.items) ? sale.items : Object.values(sale.items);
                    for (const item of items) {
                        if (!item?.specificEmails) continue;
                        const screens = Array.isArray(item.specificEmails) ? item.specificEmails : Object.values(item.specificEmails);
                        for (const s of screens) {
                            if (s?.email?.toLowerCase().trim() === email &&
                                s?.platform?.toLowerCase().includes('netflix') && s?.pass) {
                                console.log(`[BOT] ✅ Pass encontrado en sellerSales (${seller})`);
                                return s.pass.trim();
                            }
                        }
                    }
                }
            }
        }
    } catch (e) { console.warn('[BOT] sellerSales error:', e.message); }

    return null;
}

// ── Función helper para esperar ────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── ENDPOINT PRINCIPAL: Activar TV ────────────────────────────────────────
app.post('/api/activate-tv', async (req, res) => {
    const { email, tvCode } = req.body;

    if (!email || !tvCode) {
        return res.status(400).json({ success: false, error: 'Email y código de TV son requeridos.' });
    }

    let browser = null;
    try {
        console.log(`\n[BOT] ════════════════════════════════════`);
        console.log(`[BOT] Activando TV: ${email} → código: ${tvCode}`);

        // 1. Buscar contraseña
        const netflixPass = await findNetflixPassword(email);
        if (!netflixPass) {
            return res.status(404).json({
                success: false,
                error: `No se encontró la contraseña de Netflix para ${email}. Verifica que esté en la configuración de pantallas de la venta.`
            });
        }
        console.log(`[BOT] 🔑 Contraseña lista (oculta). Iniciando Chrome...`);

        // 2. Lanzar Chrome local
        const chromePath = getChromePath();
        if (!chromePath) {
            return res.status(500).json({
                success: false,
                error: 'Google Chrome no está instalado en esta PC. Instala Chrome e intenta de nuevo.'
            });
        }

        browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: false,  // VISIBLE — Netflix no puede detectarlo como bot
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--start-maximized',
                '--window-size=1280,800'
            ]
        });

        const page = await browser.newPage();

        // Simular navegador real
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });

        // Ocultar webdriver
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        // 3. Ir a Netflix TV activation directamente
        console.log('[BOT] 🌐 Navegando a netflix.com/login...');
        await page.goto('https://www.netflix.com/login', { waitUntil: 'networkidle2', timeout: 30000 });

        // 4. Escribir email (esperar al campo)
        await page.waitForSelector('input[name="userLoginId"]', { visible: true, timeout: 12000 });
        await sleep(800);
        await page.click('input[name="userLoginId"]');
        await page.type('input[name="userLoginId"]', email, { delay: 95 });
        console.log('[BOT] ✉️  Email escrito');

        // 5. Presionar Enter para avanzar al paso siguiente
        console.log('[BOT] 🔄 Presionando Enter para continuar...');
        await sleep(800);
        await page.keyboard.press('Enter');
        console.log('[BOT] ⏳ Esperando 5 segundos a que Netflix cargue la pantalla de código...');
        await sleep(5000);

        // 6. Netflix muestra pantalla de código (OTP de 4 dígitos enviado al correo)
        //    Llamamos al backend para que lo lea desde Gmail vía IMAP
        console.log('[BOT] 📨 Solicitando al backend que lea el código de inicio de sesión del correo...');
        let loginCode = null;
        const BACKEND_URL = 'https://streaming-backend-ce1u.onrender.com';

        // Reintentar hasta 6 veces (30 segundos máx) para darle tiempo al correo de llegar
        for (let attempt = 1; attempt <= 6; attempt++) {
            try {
                console.log(`[BOT] � Intento ${attempt}/6 de lectura del correo...`);
                const codeResp = await axios.post(`${BACKEND_URL}/api/get-code`, {
                    email: email,
                    platform: 'logincode'
                }, { timeout: 15000 });

                if (codeResp.data && codeResp.data.code) {
                    loginCode = codeResp.data.code.toString().replace(/\D/g, '').substring(0, 4);
                    console.log(`[BOT] ✅ Código de inicio de sesión recibido: ${loginCode}`);
                    break;
                }
            } catch (e) {
                console.log(`[BOT] ⚠️  Intento ${attempt} falló: ${e.message}`);
            }
            if (attempt < 6) {
                console.log('[BOT] ⏳ Esperando 5 segundos antes del próximo intento...');
                await sleep(5000);
            }
        }

        if (!loginCode) {
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.close();
            return res.status(408).json({
                success: false,
                error: 'No se pudo leer el código de inicio de sesión del correo. Inténtalo de nuevo en 1 minuto.',
                screenshot: `data:image/png;base64,${ss}`
            });
        }

        // 7. Escribir el código en los cajoncitos de Netflix
        console.log(`[BOT] ⌨️  Escribiendo código de acceso: ${loginCode}`);
        // Esperar a que aparezcan los inputs de código (pueden ser 4 cajones separados o un input único)
        await sleep(1000);

        // Intentar con inputs individuales primero (4 cajas separadas)
        const codeInputs = await page.$$('input[type="text"], input[type="tel"], input[aria-label], input[autocomplete="one-time-code"], input:not([name])');
        if (codeInputs.length >= 4) {
            console.log(`[BOT] � Encontrados ${codeInputs.length} cajoncitos de código.`);
            for (let i = 0; i < Math.min(4, loginCode.length); i++) {
                await codeInputs[i].click();
                await sleep(200);
                await codeInputs[i].type(loginCode[i], { delay: 150 });
            }
        } else {
            // Escribir el código completo directamente con teclado
            console.log('[BOT] ⌨️  Escribiendo código completo con teclado...');
            await page.keyboard.type(loginCode, { delay: 200 });
        }

        console.log('[BOT] ⏳ Esperando que Netflix valide el código y redirija...');
        await sleep(4000);


        const afterLoginUrl = page.url();
        console.log(`[BOT] 🔗 URL tras login: ${afterLoginUrl}`);

        // 8. Verificar login exitoso
        if (afterLoginUrl.includes('/login')) {
            const errText = await page.evaluate(() => document.body.innerText.substring(0, 200));
            const ss = await page.screenshot({ encoding: 'base64' });
            await browser.close();
            return res.status(401).json({
                success: false,
                error: `Credenciales incorrectas. Netflix dice: "${errText}"`,
                screenshot: `data:image/png;base64,${ss}`
            });
        }

        // 9. Ir a la página de activación de TV
        console.log('[BOT] 📺 Navegando a netflix.com/tv8...');
        await page.goto('https://www.netflix.com/tv8', { waitUntil: 'networkidle2', timeout: 20000 });
        await sleep(2000);

        // 10. Ingresar el código de activación
        // Netflix /tv8 usa un campo único de texto para los 8 dígitos
        const codeDigits = tvCode.replace(/[^0-9]/g, '');
        console.log(`[BOT] 🔢 Ingresando código: ${codeDigits}`);

        const singleInput = await page.$('input[type="text"], input[type="tel"], input[type="number"]');
        if (singleInput) {
            await singleInput.click({ clickCount: 3 });
            await singleInput.type(codeDigits, { delay: 100 });
        } else {
            // Múltiples inputs (1 por dígito)
            const inputs = await page.$$('input');
            for (let i = 0; i < inputs.length && i < codeDigits.length; i++) {
                await inputs[i].click();
                await inputs[i].type(codeDigits[i], { delay: 80 });
            }
        }

        // 11. Confirmar
        console.log('[BOT] ✅ Confirmando código...');
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

        await browser.close();
        browser = null;

        const isError = ['invalid', 'inválido', 'incorrect', 'incorrecto', 'expired', 'expirado', 'try again', 'vuelv'].some(
            kw => pageText.toLowerCase().includes(kw)
        );

        if (isError) {
            return res.json({ success: false, error: 'Código inválido o expirado. Obtén un nuevo código en tu TV.' });
        }

        console.log('[BOT] 🎉 ¡Activación completada!');
        return res.json({ success: true, message: '¡TV activada exitosamente! Ya puedes disfrutar Netflix.' });

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
        return res.status(500).json(payload);
    }
});

// ── Iniciar servidor ───────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', async () => {
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

    // Registrar URL pública de ngrok en Firebase (si ngrok está corriendo)
    await registerNgrokUrl();
});

// ── Limpiar URL de Firebase al cerrar ─────────────────────────────────────
process.on('SIGINT', async () => { await clearBotUrl(); process.exit(0); });
process.on('SIGTERM', async () => { await clearBotUrl(); process.exit(0); });
process.on('exit', () => { axios.delete(`${FIREBASE_DB_URL}/config/botUrl.json`).catch(() => { }); });

