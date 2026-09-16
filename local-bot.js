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

        // 5. Detectar si es flujo de 1 o 2 pasos
        let passVisible = false;
        const passEl = await page.$('input[name="password"]');
        if (passEl) {
            const box = await passEl.boundingBox();
            if (box) passVisible = true;
        }

        if (!passVisible) {
            console.log('[BOT] 🔄 Flujo 2 pasos. Buscando botón directo de contraseña...');

            // Intento 1: A veces el botón de "Usar contraseña" está directo en la primera pantalla
            let clickedPass = await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button, a, span, div[role="button"]'));
                const passBtn = btns.find(b => b.innerText && (
                    b.innerText.toLowerCase().includes('usar contraseña') ||
                    b.innerText.toLowerCase().includes('iniciar sesión con contraseña') ||
                    b.innerText.toLowerCase().includes('use password') ||
                    b.innerText.toLowerCase().includes('sign in with password')
                ));
                if (passBtn) { passBtn.click(); return true; }
                return false;
            });

            if (!clickedPass) {
                console.log('[BOT] Click en Continuar (Siguiente paso)...');
                await Promise.all([
                    sleep(1500), // pequeña pausa humana
                    page.keyboard.press('Enter')
                ]);
                console.log('[BOT] ⏳ Esperando 4 segundos a que Netflix procese/cargue...');
                await sleep(4000); // Dar suficiente tiempo a la animación / red de Netflix

                console.log('[BOT] 📧 Buscando opciones de ayuda o contraseña en esta nueva pantalla...');
                // Expandir "Obtener ayuda" si existe
                await page.evaluate(() => {
                    const helpBtns = Array.from(document.querySelectorAll('button, a, span'));
                    const helpBtn = helpBtns.find(b => b.innerText && (
                        b.innerText.toLowerCase().includes('obtener ayuda') ||
                        b.innerText.toLowerCase().includes('need help') ||
                        b.innerText.toLowerCase().includes('get help')
                    ));
                    if (helpBtn) helpBtn.click();
                });

                await sleep(1500); // Esperar a que el acordeón de ayuda se abra

                // Intentar hacer click en "Usar contraseña"
                await page.evaluate(() => {
                    const allLinks = Array.from(document.querySelectorAll('button, a, span, div[role="button"]'));
                    const passBtn = allLinks.find(b => b.innerText && (
                        b.innerText.toLowerCase().includes('contrase') ||
                        b.innerText.toLowerCase().includes('password')
                    ));
                    if (passBtn) passBtn.click();
                });

                await sleep(2000); // Esperar transición hacia la pantalla de contraseña
            }

            console.log('[BOT] ⏳ Esperando que aparezca el campo de contraseña...');
            // Aumentado el timeout porque a veces Netflix es lento
            await page.waitForSelector('input[name="password"]', { visible: true, timeout: 20000 });
        }

        // 6. Escribir contraseña
        console.log('[BOT] 🔒 Escribiendo contraseña...');
        await page.click('input[name="password"]');
        await page.type('input[name="password"]', netflixPass.replace(/\s+/g, ''), { delay: 75 });

        // 7. Submit
        await sleep(400);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 25000 }).catch(() => { }),
            page.keyboard.press('Enter')
        ]);
        await sleep(3000);

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
app.listen(PORT, '127.0.0.1', () => {
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
});
