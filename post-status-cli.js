/**
 * ================================================================
 *  📲 Streaming DPC — Publicador Automático a Estados de WhatsApp
 * ================================================================
 */

const http = require('http');

const args = process.argv.slice(2);
let count = 10;
let singleFile = null;

if (args.includes('--single') || args.includes('-1')) {
    count = 1;
} else if (args[0] && !isNaN(Number(args[0]))) {
    count = Number(args[0]);
}

function checkBotStatus() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3088/status', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.online && json.ready);
                } catch (_) {
                    resolve(false);
                }
            });
        });
        req.on('error', () => resolve(false));
        req.setTimeout(2500, () => {
            req.destroy();
            resolve(false);
        });
    });
}

function sendPostStatus(payload) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(payload);
        const req = http.request('http://localhost:3088/api/post-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ raw: data });
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function run() {
    console.log('📡 Verificando conexión con el Robot de WhatsApp (CMR Whatsapp)...');
    const isOnline = await checkBotStatus();

    if (!isOnline) {
        console.error('\n❌ El Robot de WhatsApp NO está conectado.');
        console.error('👉 Abre tu robot ejecutando "Arrancar_Robot.bat" en la carpeta F:\\CMR Whatsapp');
        console.error('   Una vez que diga que está listo, vuelve a intentar este script.\n');
        process.exit(1);
    }

    console.log('✅ Robot de WhatsApp conectado y listo.');
    console.log(`📤 Solicitando subida de ${count} video(s) a tus Estados de WhatsApp...`);

    try {
        const response = await sendPostStatus({ count });
        if (response.success) {
            console.log(`\n🎉 ${response.message}`);
            console.log('👀 Puedes ver el progreso en tiempo real en la ventana de tu robot (CMR WhatsApp).');
            console.log('📱 ¡En pocos segundos tus contactos empezarán a ver los estrenos en tus Estados!\n');
        } else {
            console.error('\n⚠️ Respuesta del robot:', response.error || response);
        }
    } catch (err) {
        console.error('\n❌ Error comunicándose con el robot:', err.message);
    }
}

run();
