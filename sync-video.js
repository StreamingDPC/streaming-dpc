/**
 * =====================================================================
 *  🎬 Streaming DPC — Sincronizador Automático de Banners Mensuales
 * =====================================================================
 *  ▸ Lee la carpeta de videos por mes (en D:\ o en videos/Noviembre)
 *  ▸ Ordena los estrenos de MAYOR a MENOR (del último día al primero)
 *  ▸ Crea automáticamente los banners con título limpio, fecha y enlace
 *  ▸ Genera 'banners-month.json' listo para importar al carrusel en 1 clic
 *
 *  USO:
 *    node sync-video.js              -> Sincroniza el video del día de hoy
 *    node sync-video.js --all        -> Sincroniza todos los días del mes ordenados de mayor a menor
 *    node sync-video.js --scan-local -> Escanea la carpeta 'videos/Noviembre' si la copiaste manualmente
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchFirebaseBanners() {
    return new Promise((resolve) => {
        https.get('https://streamingdpc-7e7fa-default-rtdb.firebaseio.com/storeConfig/mainBanners.json', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data || '[]'));
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', () => resolve([]));
    });
}

function formatTitle(filename) {
    return filename
        .replace(/\.mp4$/i, '')
        .replace(/[_\-]+/g, ' ')
        .trim()
        .split(' ')
        .map(w => {
            if (/^(t\d+|hd|4k|2d|3d)$/i.test(w)) return w.toUpperCase();
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        })
        .join(' ');
}

async function run() {
    const args = process.argv.slice(2);
    const isAll = args.includes('--all') || args.includes('-a');
    const isScanLocal = args.includes('--scan-local');

    const now = new Date();
    const currentYear = 2026;
    const currentMonthName = 'Noviembre';
    const todayDay = now.getDate(); // ej: 8

    const remoteBasePath = `D:\\Varios\\Netflix\\Netflix y Prime\\Enero 2024\\Proyectos\\Publicidad\\${currentYear}\\${currentMonthName}`;
    const localVideosDir = path.join(__dirname, 'videos');
    const localMonthDir = path.join(localVideosDir, currentMonthName);

    let sourceDir = remoteBasePath;
    if (isScanLocal || (!fs.existsSync(remoteBasePath) && fs.existsSync(localMonthDir))) {
        sourceDir = localMonthDir;
        console.log(`📁 Usando carpeta local: ${sourceDir}`);
    } else {
        console.log(`📁 Usando carpeta de origen: ${sourceDir}`);
    }

    if (!fs.existsSync(sourceDir)) {
        console.error(`❌ No se encontró la carpeta: ${sourceDir}`);
        process.exit(1);
    }

    // 1. Obtener todos los días disponibles
    const dayEntries = fs.readdirSync(sourceDir).filter(name => {
        const full = path.join(sourceDir, name);
        return fs.statSync(full).isDirectory() && !isNaN(Number(name));
    }).map(Number);

    // Ordenar de MAYOR a MENOR (del día más reciente al más antiguo)
    dayEntries.sort((a, b) => b - a);

    console.log(`\n📅 Días encontrados en ${currentMonthName} (ordenados de mayor a menor):`);
    console.log(dayEntries.join(', '));

    // Cargar banners existentes de Firebase para preservar banners promocionales (ej: Ruleta Navideña)
    console.log(`\n📡 Consultando banners actuales en Firebase...`);
    const existingBanners = await fetchFirebaseBanners();
    const newBanners = [];

    // Preservar banners especiales (ej: Ruleta Navideña) en el primer puesto
    const specialBanners = existingBanners.filter(b => b && b.badge && b.badge.toLowerCase().includes('ruleta'));
    if (specialBanners.length > 0) {
        specialBanners.forEach(b => {
            newBanners.push(b);
            console.log(`   ⭐ Banner especial fijado: [${b.badge}] ${b.title}`);
        });
    }

    // Si se pasa --all se procesan todos los días disponibles en la carpeta
    // Si se pasa un número específico (ej: 9), se procesa ese día
    // Si no se pasa nada, procesa hasta el día actual de hoy
    let daysToProcess;
    if (isAll) {
        daysToProcess = dayEntries;
    } else if (args[0] && !isNaN(Number(args[0]))) {
        daysToProcess = [Number(args[0])];
    } else {
        daysToProcess = dayEntries.filter(d => d <= todayDay);
    }

    console.log(`\n🎬 Procesando días: ${daysToProcess.join(', ')}...`);

    if (!fs.existsSync(localVideosDir)) {
        fs.mkdirSync(localVideosDir, { recursive: true });
    }

    // Si procesamos solo un día específico, cargamos los banners existentes de banners-month.json
    // para no borrar los días previos, sino agregar/actualizar el nuevo día ordenado
    let baseBanners = [];
    const bannersJsonPath = path.join(__dirname, 'banners-month.json');
    if (!isAll && fs.existsSync(bannersJsonPath) && daysToProcess.length === 1) {
        try {
            baseBanners = JSON.parse(fs.readFileSync(bannersJsonPath, 'utf8'));
        } catch (e) {
            baseBanners = [];
        }
    }

    const processedNewBanners = [];

    daysToProcess.forEach(d => {
        const dPath = path.join(sourceDir, String(d));
        if (!fs.existsSync(dPath)) return;

        const files = fs.readdirSync(dPath).filter(f => /\.(mp4|webm|mov)$/i.test(f));
        if (files.length === 0) return;

        // Procesar todos los videos que existan en la carpeta del día
        files.forEach(mainFile => {
            const srcFile = path.join(dPath, mainFile);
            const destFile = path.join(localVideosDir, mainFile);

            // Si la fuente es externa, copiar a la carpeta local 'videos/'
            if (sourceDir !== localVideosDir) {
                if (!fs.existsSync(destFile)) {
                    const stat = fs.statSync(srcFile);
                    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
                    console.log(`   📦 Copiando [Día ${d}] ${mainFile} (${sizeMb} MB)...`);
                    fs.copyFileSync(srcFile, destFile);
                } else {
                    console.log(`   ⚡ [Día ${d}] Ya existe en videos/: ${mainFile}`);
                }
            }

            const titleFormatted = formatTitle(mainFile);

            processedNewBanners.push({
                badge: `Estreno ${d} Nov`,
                title: titleFormatted,
                desc: `Estreno exclusivo del ${d} de ${currentMonthName} • Streaming DPC`,
                img: '',
                btnText: 'Ver Video',
                btnLink: `videos/${mainFile}`,
                day: d
            });
        });
    });

    let finalBanners = [];
    if (!isAll && baseBanners.length > 0) {
        // Filtrar si ya existía el día a procesar para reemplazarlo limpiamente
        const targetDay = daysToProcess[0];
        const keptBanners = baseBanners.filter(b => b.day !== targetDay);
        // Preservar especiales
        const specials = keptBanners.filter(b => !b.day);
        const dayBanners = keptBanners.filter(b => b.day);
        dayBanners.push(...processedNewBanners);
        dayBanners.sort((a, b) => (b.day || 0) - (a.day || 0));
        finalBanners = [...specials, ...dayBanners];
    } else {
        finalBanners = [...newBanners, ...processedNewBanners];
    }

    // Guardar banners-month.json
    fs.writeFileSync(bannersJsonPath, JSON.stringify(finalBanners, null, 2), 'utf8');

    console.log(`\n✅ ¡Generados exitosamente ${finalBanners.length} banners en 'banners-month.json'!`);
    console.log(`\n📋 Lista de Banners en Carrusel (Mayor a Menor):`);
    finalBanners.forEach((b, i) => {
        console.log(`   ${i + 1}. [${b.badge}] ${b.title} -> ${b.btnLink}`);
    });

    console.log(`\n💡 Ahora puedes abrir tu panel de Admin y en la pestaña Banners pulsar:`);
    console.log(`   👉 '⚡ Cargar Banners del Mes Automáticamente'\n`);
}

run();
