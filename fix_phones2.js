const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(
    /storeWhatsappInput\.value\.replace\(\/\\D\/g, ''\)/g,
    'window.sanitizePhone(storeWhatsappInput.value)'
);
fs.writeFileSync('app.js', appJs);

console.log('Fixed seller store phone!');
