const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(
    'const db = firebase.database();',
    'const db = firebase.database();\n\nwindow.sanitizePhone = function(val) {\n    if(!val) return "";\n    let c = val.toString().replace(/\\D/g, "");\n    if(c.length >= 12 && c.startsWith("57")) {\n        c = c.substring(2);\n    }\n    return c;\n};\n'
);
appJs = appJs.replace(
    /remindPhoneInput\.value\.replace\(\/\\D\/g, ''\)/g,
    'window.sanitizePhone(remindPhoneInput.value)'
);
appJs = appJs.replace(
    /document\.getElementById\('client-login-phone'\)\.value\.replace\(\/\\D\/g, ''\)/g,
    'window.sanitizePhone(document.getElementById(\'client-login-phone\').value)'
);
appJs = appJs.replace(
    /document\.getElementById\('client-phone'\)\.value\.trim\(\)/g,
    'window.sanitizePhone(document.getElementById(\'client-phone\').value.trim())'
);

// One more place: checkout logic uses cleanPhone = cPhone ? cPhone.replace(/\D/g, '') : '';
// that will just safely return cPhone untouched since it's already sanitized.

fs.writeFileSync('app.js', appJs);

let adminHtml = fs.readFileSync('admin.html', 'utf8');
// admin.html also initializes db
adminHtml = adminHtml.replace(
    "const db = firebase.database();",
    "const db = firebase.database();\n    window.sanitizePhone = function(val) {\n        if(!val) return '';\n        let c = val.toString().replace(/\\D/g, '');\n        if(c.length >= 12 && c.startsWith('57')) {\n            c = c.substring(2);\n        }\n        return c;\n    };\n"
);
adminHtml = adminHtml.replace(
    /document\.getElementById\('search-client-phone'\)\.value\.replace\(\/\\D\/g, ''\)/g,
    'window.sanitizePhone(document.getElementById(\'search-client-phone\').value)'
);
adminHtml = adminHtml.replace(
    /document\.getElementById\('manual-client-phone'\)\.value\.replace\(\/\\D\/g, ''\)/g,
    'window.sanitizePhone(document.getElementById(\'manual-client-phone\').value)'
);

fs.writeFileSync('admin.html', adminHtml);
console.log('Fixed phones in app.js and admin.html!');
