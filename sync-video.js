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

function parseDaysList(input) {
    const days = new Set();
    const parts = String(input).split(/[\s,]+/);
    parts.forEach(p => {
        if (p.includes('-')) {
            const [start, end] = p.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                const min = Math.min(start, end);
                const max = Math.max(start, end);
                for (let i = min; i <= max; i++) days.add(i);
            }
        } else {
            const num = Number(p);
            if (!isNaN(num)) days.add(num);
        }
    });
    return Array.from(days);
}

async function run() {
    const args = process.argv.slice(2);
    const localVideosDir = path.join(__dirname, 'videos');
    const bannersJsonPath = path.join(__dirname, 'banners-month.json');

    const MONTH_NAMES = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const MONTH_ABBRS = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const now = new Date();
    const currentYear = now.getFullYear();
    const defaultMonthName = MONTH_NAMES[now.getMonth()];

    // Soporte para elegir mes manual: --month Diciembre o -m Diciembre
    let currentMonthName = defaultMonthName;
    const monthArgIdx = args.findIndex(a => a === '--month' || a === '-m');
    if (monthArgIdx !== -1 && args[monthArgIdx + 1]) {
        const rawM = args[monthArgIdx + 1].trim();
        currentMonthName = rawM.charAt(0).toUpperCase() + rawM.slice(1).toLowerCase();
    }

    const monthIndex = MONTH_NAMES.findIndex(m => m.toLowerCase() === currentMonthName.toLowerCase());
    const monthAbbr = monthIndex !== -1 ? MONTH_ABBRS[monthIndex] : currentMonthName.slice(0, 3);
    const todayDay = now.getDate();
    const localMonthDir = path.join(localVideosDir, currentMonthName);

    // 1. Opcion para listar dias activos
    if (args.includes('--list-days')) {
        console.log(`   📂 Carpeta activa: videos\\${currentMonthName}`);
        if (!fs.existsSync(bannersJsonPath)) {
            console.log('   (No hay banners registrados aún)');
            return;
        }
        try {
            const currentBanners = JSON.parse(fs.readFileSync(bannersJsonPath, 'utf8') || '[]');
            const byMonth = {};
            currentBanners.forEach(b => {
                if (!b || !b.day) return;
                const mKey = b.month || defaultMonthName;
                if (!byMonth[mKey]) byMonth[mKey] = new Set();
                byMonth[mKey].add(Number(b.day));
            });
            const monthsFound = Object.keys(byMonth);
            if (monthsFound.length === 0) {
                console.log('   Días activos: Ninguno');
            } else {
                monthsFound.forEach(mKey => {
                    const ds = Array.from(byMonth[mKey]).sort((a, b) => b - a);
                    console.log(`   • ${mKey} (videos\\${mKey}): días ${ds.join(', ')}`);
                });
            }
        } catch (e) {
            console.log('   Error leyendo banners-month.json');
        }
        return;
    }

    // 2. Opcion para eliminar dias especificos
    const deleteIdx = args.findIndex(a => a === '--delete' || a === '-d');
    if (deleteIdx !== -1 && args[deleteIdx + 1]) {
        const daysToDelete = parseDaysList(args[deleteIdx + 1]);
        if (daysToDelete.length === 0) {
            console.log('❌ No se especificaron días válidos para eliminar.');
            process.exit(1);
        }

        console.log(`\n📂 Carpeta activa: videos\\${currentMonthName}`);
        console.log(`🗑️ Solicitud de eliminación para los días [${daysToDelete.join(', ')}] en ${currentMonthName}...`);

        let currentBanners = [];
        if (fs.existsSync(bannersJsonPath)) {
            try {
                currentBanners = JSON.parse(fs.readFileSync(bannersJsonPath, 'utf8') || '[]');
            } catch (e) {
                currentBanners = [];
            }
        }

        let deletedFiles = 0;
        let totalMbFreed = 0;
        const remainingBanners = [];

        // 1. Eliminar carpetas completas del día en videos/<Mes>/<d>/ (y también legacy videos/<d>/ si coincide)
        daysToDelete.forEach(d => {
            const dirsToCheck = [
                { dir: path.join(localMonthDir, String(d)), label: `${currentMonthName}/${d}` },
                { dir: path.join(localVideosDir, String(d)), label: `${d}` }
            ];
            dirsToCheck.forEach(({ dir, label }) => {
                if (fs.existsSync(dir)) {
                    try {
                        const files = fs.readdirSync(dir);
                        files.forEach(f => {
                            const fp = path.join(dir, f);
                            try {
                                const stat = fs.statSync(fp);
                                const mb = stat.size / (1024 * 1024);
                                totalMbFreed += mb;
                                fs.unlinkSync(fp);
                                console.log(`   🗑️ Video eliminado: videos/${label}/${f} (${mb.toFixed(2)} MB liberados)`);
                                deletedFiles++;
                            } catch (err) {
                                console.warn(`   ⚠️ No se pudo eliminar ${label}/${f}: ${err.message}`);
                            }
                        });
                        fs.rmdirSync(dir);
                    } catch (err) {
                        console.warn(`   ⚠️ Error eliminando carpeta ${label}: ${err.message}`);
                    }
                }
            });
        });

        // 2. Eliminar cualquier archivo suelto legacy y actualizar banners restantes
        currentBanners.forEach(b => {
            const sameMonth = !b.month || b.month.toLowerCase() === currentMonthName.toLowerCase();
            if (b.day && sameMonth && daysToDelete.includes(Number(b.day))) {
                if (b.btnLink && b.btnLink.startsWith('videos/')) {
                    const rel = b.btnLink.replace(/^videos\//, '');
                    const filePath = path.join(localVideosDir, rel);
                    if (fs.existsSync(filePath)) {
                        try {
                            const stat = fs.statSync(filePath);
                            const mb = stat.size / (1024 * 1024);
                            totalMbFreed += mb;
                            fs.unlinkSync(filePath);
                            console.log(`   🗑️ Video eliminado: ${rel} (${mb.toFixed(2)} MB liberados)`);
                            deletedFiles++;
                        } catch (err) {
                            console.warn(`   ⚠️ No se pudo eliminar ${rel}: ${err.message}`);
                        }
                    }
                }
            } else {
                remainingBanners.push(b);
            }
        });

        fs.writeFileSync(bannersJsonPath, JSON.stringify(remainingBanners, null, 2), 'utf8');

        console.log(`\n✅ Limpieza completada con éxito en videos\\${currentMonthName}:`);
        console.log(`   • Videos eliminados: ${deletedFiles}`);
        console.log(`   • Espacio total liberado: ${totalMbFreed.toFixed(2)} MB`);
        console.log(`   • Banners restantes en carrusel: ${remainingBanners.length}`);
        console.log(`\n📋 Banners que quedaron activos:`);
        remainingBanners.forEach((b, i) => {
            console.log(`   ${i + 1}. [${b.badge}] ${b.title}`);
        });
        return;
    }

    const isAll = args.includes('--all') || args.includes('-a');
    const isScanLocal = args.includes('--scan-local');

    const remoteBasePath = `D:\\Varios\\Netflix\\Netflix y Prime\\Enero 2024\\Proyectos\\Publicidad\\${currentYear}\\${currentMonthName}`;

    // Crear carpeta del mes en videos/<Mes>/ automáticamente
    if (!fs.existsSync(localMonthDir)) {
        fs.mkdirSync(localMonthDir, { recursive: true });
        console.log(`📁 Carpeta del mes creada: ${localMonthDir}`);
    }

    console.log(`\n================================================================`);
    console.log(`  📂 ESTAS EN LA CARPETA DEL MES: ${currentMonthName.toUpperCase()} (${currentYear})`);
    console.log(`  📁 Destino local:  ${localMonthDir}`);
    console.log(`================================================================`);

    let sourceDir = remoteBasePath;
    if (isScanLocal || (!fs.existsSync(remoteBasePath) && fs.existsSync(localMonthDir))) {
        sourceDir = localMonthDir;
        console.log(`📁 Origen (local): ${sourceDir}`);
    } else {
        console.log(`📁 Origen (D:\\):   ${sourceDir}`);
    }

    if (!fs.existsSync(sourceDir)) {
        console.error(`❌ No se encontró la carpeta: ${sourceDir}`);
        console.error(`💡 Asegúrate de que exista la carpeta del mes '${currentMonthName}' en tu disco D:\\`);
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

    // Detectar si se paso un dia, lista de dias o rango (ej: 12, "1,2", "1-12")
    const dayArg = args.find((a, idx) => {
        if (a.startsWith('-')) return false;
        if (idx > 0 && (args[idx - 1] === '--month' || args[idx - 1] === '-m' || args[idx - 1] === '--delete' || args[idx - 1] === '-d')) return false;
        return /^[\d\s,\-]+$/.test(a.trim());
    });

    let daysToProcess;
    if (isAll) {
        daysToProcess = dayEntries;
    } else if (dayArg) {
        const parsed = parseDaysList(dayArg);
        daysToProcess = dayEntries.filter(d => parsed.includes(d));
        if (daysToProcess.length === 0) {
            console.error(`❌ No se encontraron carpetas para los días especificados (${dayArg}) en ${currentMonthName}.`);
            process.exit(1);
        }
    } else {
        daysToProcess = dayEntries.filter(d => d <= todayDay);
    }

    console.log(`\n🎬 Procesando días: ${daysToProcess.join(', ')}...`);

    if (!fs.existsSync(localVideosDir)) {
        fs.mkdirSync(localVideosDir, { recursive: true });
    }

    // Si NO es --all y procesamos días específicos, cargamos los banners existentes de banners-month.json
    // para no borrar los días previos, sino actualizar/agregar los nuevos ordenados
    let baseBanners = [];
    if (!isAll && fs.existsSync(bannersJsonPath)) {
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

        // Crear carpeta individual por mes y día en videos/<Mes>/<d>/
        const localDayDir = path.join(localMonthDir, String(d));
        if (!fs.existsSync(localDayDir)) {
            fs.mkdirSync(localDayDir, { recursive: true });
        }

        // Ordenar alfabéticamente los videos dentro de cada día
        files.sort((a, b) => a.localeCompare(b));

        // Procesar todos los videos que existan en la carpeta del día
        files.forEach(mainFile => {
            const srcFile = path.join(dPath, mainFile);
            const destFile = path.join(localDayDir, mainFile);
            const legacyLooseFile = path.join(localVideosDir, mainFile);

            // Si la fuente es externa, copiar a videos/<Mes>/<d>/
            if (path.resolve(sourceDir) !== path.resolve(localMonthDir)) {
                if (!fs.existsSync(destFile)) {
                    const stat = fs.statSync(srcFile);
                    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
                    console.log(`   📦 Copiando [${currentMonthName} · Día ${d}] ${mainFile} (${sizeMb} MB) -> videos/${currentMonthName}/${d}/`);
                    fs.copyFileSync(srcFile, destFile);
                } else {
                    console.log(`   ⚡ [${currentMonthName} · Día ${d}] Ya existe en videos/${currentMonthName}/${d}/: ${mainFile}`);
                }

                // Limpiar archivo suelto legacy si existía en la raíz de videos/
                if (fs.existsSync(legacyLooseFile)) {
                    try { fs.unlinkSync(legacyLooseFile); } catch (_) {}
                }
            }

            const titleFormatted = formatTitle(mainFile);

            processedNewBanners.push({
                badge: `Estreno ${d} ${monthAbbr}`,
                title: titleFormatted,
                desc: `Estreno exclusivo del ${d} de ${currentMonthName} • Streaming DPC`,
                img: '',
                btnText: 'Ver Video',
                btnLink: `videos/${currentMonthName}/${d}/${mainFile}`,
                day: d,
                month: currentMonthName,
                monthAbbr: monthAbbr
            });
        });
    });

    let finalBanners = [];
    if (!isAll && baseBanners.length > 0) {
        // Filtrar solo los días procesados de ESTE mes para reemplazarlos sin borrar otros meses
        const daysSet = new Set(daysToProcess);
        const keptBanners = baseBanners.filter(b => {
            const bMonth = (b.month || '').toLowerCase();
            const isSameMonth = !bMonth || bMonth === currentMonthName.toLowerCase();
            return !(isSameMonth && daysSet.has(Number(b.day)));
        });
        // Preservar especiales
        const specials = keptBanners.filter(b => !b.day || (b.badge && b.badge.toLowerCase().includes('ruleta')));
        const dayBanners = keptBanners.filter(b => b.day && (!b.badge || !b.badge.toLowerCase().includes('ruleta')));
        dayBanners.push(...processedNewBanners);
        const mOrder = (m) => {
            const idx = MONTH_NAMES.findIndex(n => n.toLowerCase() === String(m || '').toLowerCase());
            return idx >= 0 ? idx : -1;
        };
        dayBanners.sort((a, b) => (mOrder(b.month) - mOrder(a.month)) || ((Number(b.day) || 0) - (Number(a.day) || 0)));
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
