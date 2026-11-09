/**
 * ================================================================
 *  📲 Streaming DPC — Publicador Automático a Estados de WhatsApp
 * ================================================================
 */

const http = require('http');

const args = process.argv.slice(2);
let count = 'all';
let targetDay = null;
let fromDay = null;
let toDay = null;

if (args.includes('--all') || args.includes('all')) {
    count = 'all';
} else if (args.includes('--single') || args.includes('-1')) {
    count = 1;
}

// Soporte para flag --range (ej: --range 2-12)
const rangeIdx = args.findIndex(a => a === '--range' || a === '-r');
if (rangeIdx !== -1 && args[rangeIdx + 1]) {
    const raw = args[rangeIdx + 1];
    const parts = raw.match(/\d+/g);
    if (parts && parts.length >= 2) {
        fromDay = Number(parts[0]);
        toDay = Number(parts[1]);
        count = 'all';
    }
}

// Detectar argumento suelto con rango ej: "2-12" o "del 2 al 12"
const rawRangeArg = args.find((a, idx) => {
    if (idx > 0 && (args[idx - 1] === '--range' || args[idx - 1] === '-r')) return false;
    return /\d+\s*[-a]\s*\d+/i.test(a.trim());
});
if (rawRangeArg && fromDay === null) {
    const parts = rawRangeArg.match(/\d+/g);
    if (parts && parts.length >= 2) {
        fromDay = Number(parts[0]);
        toDay = Number(parts[1]);
        count = 'all';
    }
}

const dayIdx = args.findIndex(a => a === '--day' || a === '-d');
if (dayIdx !== -1 && args[dayIdx + 1]) {
    const rawVal = args[dayIdx + 1];
    if (rawVal.includes('-')) {
        const parts = rawVal.match(/\d+/g);
        if (parts && parts.length >= 2) {
            fromDay = Number(parts[0]);
            toDay = Number(parts[1]);
            count = 'all';
        }
    } else {
        targetDay = Number(rawVal);
        count = 'all';
    }
}

const numArg = args.find((a, idx) => {
    if (idx > 0 && (args[idx - 1] === '--day' || args[idx - 1] === '-d' || args[idx - 1] === '--range' || args[idx - 1] === '-r')) return false;
    return !isNaN(Number(a)) && a.trim() !== '';
});
if (numArg && targetDay === null && fromDay === null && !args.includes('--all') && !args.includes('all')) {
    count = Number(numArg);
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
    let descTarget = 'TODOS los videos disponibles';
    if (fromDay !== null && toDay !== null) {
        descTarget = `los videos del día ${Math.min(fromDay, toDay)} al día ${Math.max(fromDay, toDay)}`;
    } else if (targetDay !== null) {
        descTarget = `los videos del día ${targetDay}`;
    } else if (count !== 'all') {
        descTarget = `${count} video(s)`;
    }

    console.log(`📤 Solicitando subida de ${descTarget} a tus Estados de WhatsApp...`);

    try {
        const payload = { count, day: targetDay, fromDay, toDay };
        if (fromDay !== null && toDay !== null) {
            payload.range = `${Math.min(fromDay, toDay)}-${Math.max(fromDay, toDay)}`;
        }
        const response = await sendPostStatus(payload);
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
