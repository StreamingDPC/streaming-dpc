const fs = require('fs');

let code = fs.readFileSync('admin.html', 'utf8');

if (!code.includes('window.openWhatsapp')) {
    code = code.replace('</head>', `    <script>
        window.openWhatsapp = function(phone, text) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
            let url = baseUrl + '?text=' + encodeURIComponent(text);
            if (phone) url += '&phone=' + phone;
            window.open(url, '_blank');
        }
    </script>
</head>`);
}

// Ensure encodeURIComponent gets the right variables but we pass text to openWhatsapp without string literal wrappers
code = code.replace(/window\.open\(\s*`https:\/\/wa\.me\/\$\{([^\}]+)\}\?text=\$\{encodeURIComponent\(([^\)]+)\)\}`\s*,\s*'_blank'\s*\);/g, 'window.openWhatsapp($1, $2);');

code = code.replace(/window\.open\(\s*`https:\/\/wa\.me\/\?text=\$\{encodeURIComponent\(([^\)]+)\)\}`\s*,\s*'_blank'\s*\);/g, 'window.openWhatsapp(null, $1);');


fs.writeFileSync('admin.html', code);

// For app.js
let app = fs.readFileSync('app.js', 'utf8');
if (!app.includes('window.openWhatsapp')) {
    app = app + `\n\nwindow.openWhatsapp = function(phone, text) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    let url = baseUrl + '?text=' + encodeURIComponent(text);
    if (phone) url += '&phone=' + phone;
    window.open(url, '_blank');
};\n`;
}

// app.js has window.open(`https://wa.me/${formatWaPhone(phoneSegment)}?text=${encoded}`, '_blank'); where encoded is encodeURIComponent(rawMsg);
// It also has window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
// Since it's already encoded, we need to pass decodeURIComponent(encoded) OR we can just change the encodeURIComponent logic, but it's simpler to do:
app = app.replace(/window\.open\(\s*`https:\/\/wa\.me\/\$\{([^\}]+)\}\?text=\$\{encoded\}`\s*,\s*'_blank'\s*\);/g, 'window.openWhatsapp($1, decodeURIComponent(encoded));');
app = app.replace(/window\.open\(\s*`https:\/\/api\.whatsapp\.com\/send\?text=\$\{encoded\}`\s*,\s*'_blank'\s*\);/g, 'window.openWhatsapp(null, decodeURIComponent(encoded));');

fs.writeFileSync('app.js', app);

console.log('Replaced successfully');
