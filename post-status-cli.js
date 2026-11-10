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

// 1. Detectar flag --range o -r (ej: --range "2-12", --range "del 2 al 12")
const rangeIdx = args.findIndex(a => a === '--range' || a === '-r');
if (rangeIdx !== -1) {
    const nextArg = args[rangeIdx + 1] || '';
    const parts = (nextArg + ' ' + (args[rangeIdx + 2] || '')).match(/\d+/g);
    if (parts && parts.length >= 2) {
        fromDay = Number(parts[0]);
        toDay = Number(parts[1]);
        count = 'all';
    } else {
        console.error('\n❌ Error: Debes especificar un rango válido con dos números (ej: --range "3-13" o "del 3 al 13").');
        console.error('   No se publicará ningún estado para evitar publicar videos no deseados.\n');
        process.exit(1);
    }
}

// 2. Detectar argumento suelto con rango ej: "2-12", "del 2 al 12", "2 al 12", "2 a 12", "2 hasta 12"
if (fromDay === null && rangeIdx === -1) {
    const combinedArgs = args.join(' ');
    const rangeMatch = combinedArgs.match(/(?:del?\s+)?(\d+)\s*(?:-|a|al|hasta)\s*(\d+)/i);
    if (rangeMatch && !combinedArgs.includes('--day') && !combinedArgs.includes('-d')) {
        fromDay = Number(rangeMatch[1]);
        toDay = Number(rangeMatch[2]);
        count = 'all';
    }
}

// 3. Detectar flag --day o -d
const dayIdx = args.findIndex(a => a === '--day' || a === '-d');
if (dayIdx !== -1 && fromDay === null) {
    const rawVal = args[dayIdx + 1] || '';
    const parts = rawVal.match(/\d+/g);
    if (parts && parts.length >= 2) {
        fromDay = Number(parts[0]);
        toDay = Number(parts[1]);
        count = 'all';
    } else if (parts && parts.length === 1) {
        targetDay = Number(parts[0]);
        count = 'all';
    } else {
        console.error('\n❌ Error: Debes especificar el número de día (ej: --day 13).');
        console.error('   No se publicará ningún estado para evitar publicar videos no deseados.\n');
        process.exit(1);
    }
}

// 4. Cantidad numérica pura si no es rango ni día
if (targetDay === null && fromDay === null) {
    const singleNum = args.find(a => !isNaN(Number(a)) && a.trim() !== '');
    if (singleNum && !args.includes('--all') && !args.includes('all')) {
        count = Number(singleNum);
    }
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
