const fs = require('fs');

function fixFile(file) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/window\.openWhatsapp = function\(phone, text\) \{[^}]+\}/g, `window.openWhatsapp = function(phone, text) {
            let encodedText = encodeURIComponent(text);
            let url = (phone && phone !== 'null' && phone !== 'undefined') ? 'https://wa.me/' + phone + '?text=' + encodedText : 'https://wa.me/?text=' + encodedText;
            window.open(url, '_blank');
        }`);
    // Also, remember that decodeURIComponent(encodeURIComponent) issue? We are doing encodeURIComponent(text) in openWhatsapp.
    // So we need to make sure we supply decoded text to openWhatsapp! But wait! What if it's already NOT encoded in some places?
    fs.writeFileSync(file, code);
}

fixFile('admin.html');
fixFile('app.js');
console.log('Fixed WhatsApp function');
