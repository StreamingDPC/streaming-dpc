/**
 * =====================================================================
 *  🎬 Streaming DPC — Sincronizador de Video Diario para Banners
 * =====================================================================
 *  ▸ Lee tu carpeta local en D:\Varios\Netflix\Netflix y Prime\...
 *  ▸ Copia el video del día a la carpeta 'videos/' del proyecto
 *  ▸ Uso:
 *      node sync-video.js        (usa el día de hoy automáticamente)
 *      node sync-video.js 7      (usa el día 7 de noviembre)
 */

const fs = require('fs');
const path = require('path');

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const now = new Date();
const currentYear = 2026; // o now.getFullYear()
const currentMonthName = MESES[now.getMonth()];
const currentDay = process.argv[2] ? parseInt(process.argv[2], 10) : now.getDate();

const basePath = `D:\\Varios\\Netflix\\Netflix y Prime\\Enero 2024\\Proyectos\\Publicidad\\${currentYear}\\${currentMonthName}\\${currentDay}`;
const destDir = path.join(__dirname, 'videos');

console.log(`\n🔍 Buscando video para el día ${currentDay} de ${currentMonthName} de ${currentYear}...`);
console.log(`📁 Carpeta de origen: ${basePath}`);

if (!fs.existsSync(basePath)) {
    console.error(`❌ No se encontró la carpeta: ${basePath}`);
    process.exit(1);
}

const files = fs.readdirSync(basePath);
const videoFiles = files.filter(f => /\.(mp4|webm|mov|mkv)$/i.test(f));

if (videoFiles.length === 0) {
    console.error(`⚠️ No se encontraron videos (.mp4) dentro de la carpeta del día ${currentDay}.`);
    process.exit(1);
}

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

console.log(`\n✨ Se encontraron ${videoFiles.length} video(s):`);
videoFiles.forEach((file, idx) => {
    const src = path.join(basePath, file);
    const dest = path.join(destDir, file);
    const stat = fs.statSync(src);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
    
    console.log(`   [${idx + 1}] ${file} (${sizeMb} MB)`);
    fs.copyFileSync(src, dest);
    console.log(`   ✅ Copiado a: videos/${file}`);
});

console.log(`\n📌 Para usarlo en tu Banner:`);
console.log(`   En "Acción del Botón (Pestaña o Link)" coloca:`);
console.log(`   👉  videos/${videoFiles[0]}`);
console.log(`\n¡Listo para probar en el navegador!\n`);
