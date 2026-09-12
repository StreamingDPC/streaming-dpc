const fs = require('fs');

const INJECT_ENGINE = `
// ============================================
// DPC BILLING ENGINE v1.0 (Cap Month)
// ============================================
window.DPCBillingEngine = {
    calcularProximoVencimiento: function(fechaCompraOriginal, fechaVencimientoActual) {
        if (!fechaCompraOriginal || isNaN(new Date(fechaCompraOriginal).getTime())) {
            fechaCompraOriginal = fechaVencimientoActual || Date.now();
        }
        if (!fechaVencimientoActual || isNaN(new Date(fechaVencimientoActual).getTime())) {
            fechaVencimientoActual = Date.now();
        }
        
        const fco = new Date(fechaCompraOriginal);
        const fva = new Date(fechaVencimientoActual);
        const diaOriginal = fco.getDate();
        
        let prox = new Date(fva);
        // Avanzamos un mes real
        prox.setMonth(prox.getMonth() + 1);
        
        // Obtenemos cual es el ultimo dia de ese nuevo mes
        const ultimoDiaMesProx = new Date(prox.getFullYear(), prox.getMonth() + 1, 0).getDate();
        
        // Si el dia original existe en el nuevo mes, lo asignamos. Si no, lo topamos al ultimo dia.
        if (diaOriginal <= ultimoDiaMesProx) {
            prox.setDate(diaOriginal);
        } else {
            prox.setDate(ultimoDiaMesProx);
        }
        
        return prox;
    }
};
`;

try {
    let admin = fs.readFileSync('F:/Antigravity/Antigravity/streaming-dpc/admin.html', 'utf8');
    
    // Inject engine in admin.html usually early on
    if (!admin.includes('window.DPCBillingEngine')) {
        admin = admin.replace('function showNotification(', INJECT_ENGINE + '\nfunction showNotification(');
    }
    
    // Line 3927: const newExp = currentExp + (30 * 24 * 60 * 60 * 1000);
    // Replace logic inside renewing client
    admin = admin.replace(/const newExp = currentExp \+ \(30 \* 24 \* 60 \* 60 \* 1000\);/g, 
        `const newExp = window.DPCBillingEngine ? window.DPCBillingEngine.calcularProximoVencimiento(c.fechaCompraOriginal || currentExp, currentExp).getTime() : currentExp + (30 * 24 * 60 * 60 * 1000); // Cap Month`);
        
    // Also save fechaCompraOriginal if not exists!
    // Near: delete db.clients[clientPhone]; // no we are just saving 
    admin = admin.replace(/c\.expirationDate = newExp;/g, `c.expirationDate = newExp;\n                        if (!c.fechaCompraOriginal) c.fechaCompraOriginal = currentExp;`);
    
    // 5615: Date.now() + (30 * 24 * 60 * 60 * 1000)
    admin = admin.replace(/\? Date\.now\(\) \+ \(30 \* 24 \* 60 \* 60 \* 1000\)/g, 
        `? window.DPCBillingEngine.calcularProximoVencimiento(Date.now(), Date.now()).getTime()`);

    // 5776: expirationDate : (Date.now() + (30 * 24 * 60 * 60 * 1000))
    admin = admin.replace(/\(Date\.now\(\) \+ \(30 \* 24 \* 60 \* 60 \* 1000\)\)/g, 
        `window.DPCBillingEngine.calcularProximoVencimiento(Date.now(), Date.now()).getTime()`);
        
    // In assigning manual, need to save fco if not exists:
    // newClient.fechaCompraOriginal = newClient.expirationDate; (Wait, fco should be start date, usually Date.now())
    admin = admin.replace(/expirationDate: endDateStr[^,]+,/g, (m) => m + `\n                    fechaCompraOriginal: Date.now(),`);

    fs.writeFileSync('F:/Antigravity/Antigravity/streaming-dpc/admin.html', admin, 'utf8');
    console.log("Admin.html updated");
} catch(e) { console.error(e); }

try {
    let app = fs.readFileSync('F:/Antigravity/Antigravity/streaming-dpc/app.js', 'utf8');
    
    if (!app.includes('window.DPCBillingEngine')) {
        app = INJECT_ENGINE + '\n' + app;
    }
    
    // 1525: expirationDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // +30 days
    app = app.replace(/expirationDate: Date\.now\(\) \+ \(30 \* 24 \* 60 \* 60 \* 1000\), \/\/ \+30 days/g, 
        `expirationDate: window.DPCBillingEngine.calcularProximoVencimiento(Date.now(), Date.now()).getTime(),\n                fechaCompraOriginal: Date.now(), // Cap Month`);
        
    // 1958: const d = new Date(parseInt(expirationDateTS) + (30 * 24 * 60 * 60 * 1000));
    app = app.replace(/const d = new Date\(parseInt\(expirationDateTS\) \+ \(30 \* 24 \* 60 \* 60 \* 1000\)\);/g, 
        `const d = window.DPCBillingEngine.calcularProximoVencimiento(parseInt(expirationDateTS), parseInt(expirationDateTS));`);

    fs.writeFileSync('F:/Antigravity/Antigravity/streaming-dpc/app.js', app, 'utf8');
    console.log("App.js updated");
} catch(e) { console.error(e); }

