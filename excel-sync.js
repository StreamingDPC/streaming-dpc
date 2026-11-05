/**
 * ============================================================================
 * 📊 Sincronizador Automático de Excel -> Firebase (Streaming DPC)
 * Archivo origen: "D:\Varios\Netflix\Netflix clientes.xlsx"
 * ============================================================================
 * - Lee las 11 pestañas: NO, DO, MO, PO, PA, C, V, I, Apple, Sp, Youtube
 * - Toma únicamente la contraseña ubicada al lado del email de la cuenta
 *   (ignora estrictamente Dl70112849dl@ / dl70112849).
 * - Actualiza clientProfiles, clientSales y sellerSales en Firebase.
 * - Modo vigilancia en vivo (--watch): detecta cada vez que guardas el Excel
 *   (Ctrl + G) y actualiza la base de datos de la página automáticamente.
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('./backend/node_modules/xlsx');
const axios = require('./backend/node_modules/axios');

const EXCEL_FILE_PATH = process.env.EXCEL_CLIENTS_PATH || 'D:\\Varios\\Netflix\\Netflix clientes.xlsx';
const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL || 'https://streamingdpc-7e7fa-default-rtdb.firebaseio.com';

const SHEET_MAP = [
    { key: 'NO', platform: 'Netflix', matchKeys: ['netflix'] },
    { key: 'DO', platform: 'Disney', matchKeys: ['disney', 'dixney'] },
    { key: 'MO', platform: 'Max (HBO)', matchKeys: ['max', 'hbo'] },
    { key: 'PO', platform: 'Prime Video', matchKeys: ['prime', 'amazon'] },
    { key: 'PA', platform: 'Paramount', matchKeys: ['paramount'] },
    { key: 'C', platform: 'Crunchyroll', matchKeys: ['crunchy'] },
    { key: 'V', platform: 'Vix', matchKeys: ['vix'] },
    { key: 'I', platform: 'IPTV', matchKeys: ['iptv', 'magis', 'flujo', 'tele'] },
    { key: 'Apple', platform: 'Apple TV', matchKeys: ['apple'] },
    { key: 'Sp', platform: 'Spotify', matchKeys: ['spotify'] },
    { key: 'Youtube', platform: 'YouTube Premium', matchKeys: ['youtube'] }
];

const PLATFORM_PRICE_CATALOG = {
    'Netflix Privada': { id: 1772292868921, clientPrice: 18000, sellerPrice: 15000 },
    'Netflix':         { id: 1772292903394, clientPrice: 17000, sellerPrice: 14000 },
    'Disney Privada':  { id: 1776951379850, clientPrice: 37000, sellerPrice: 34000 },
    'Dixney Privada':  { id: 1776951379850, clientPrice: 37000, sellerPrice: 34000 },
    'Disney':          { id: 1772292389962, clientPrice: 13000, sellerPrice: 10000 },
    'Max (HBO)':       { id: 1772292225208, clientPrice: 13000, sellerPrice: 10000 },
    'Hbo Max':         { id: 1772292225208, clientPrice: 13000, sellerPrice: 10000 },
    'Prime Video':     { id: 1772292697799, clientPrice: 9000,  sellerPrice: 6000 },
    'Paramount':       { id: 1772292119510, clientPrice: 15000, sellerPrice: 12000 },
    'Crunchyroll':     { id: 1772290973062, clientPrice: 12000, sellerPrice: 9000 },
    'Vix':             { id: 1772291405684, clientPrice: 9000,  sellerPrice: 6000 },
    'IPTV':            { id: 1772292007621, clientPrice: 18000, sellerPrice: 15000 },
    'Apple TV':        { id: 1772290096450, clientPrice: 18000, sellerPrice: 15000 },
    'Spotify':         { id: 1789841775000, clientPrice: 15000, sellerPrice: 12000 },
    'YouTube Premium': { id: 1790000941995, clientPrice: 17000, sellerPrice: 14000 },
    'YouTube':         { id: 1790000941995, clientPrice: 17000, sellerPrice: 14000 }
};

function getPlatformPriceInfo(platName, isSeller) {
    const clean = cleanPlatformName(platName);
    const entry = PLATFORM_PRICE_CATALOG[clean];
    if (entry) {
        return {
            id: entry.id,
            price: isSeller ? entry.sellerPrice : entry.clientPrice
        };
    }
    return { id: 'item_' + Date.now(), price: 0 };
}

const KNOWN_SELLERS_MAP = {
    'maac': 'Página Web Oficial',
    'ines': 'Aleni',
    'aleni': 'Aleni',
    'pedro': 'Pedro',
    'stefani': 'Stefani',
    'angie': 'Angie',
    'alex': 'Alex',
    'any': 'Any',
    'katherin': 'Katherin',
    'darwin': 'Darwin',
    'laura': 'Laura',
    'hector': 'Hector',
    'jessica': 'Jessica',
    'diana': 'Diana',
    'duay': 'Duay',
    'yenfri': 'Yenfri',
    'nelson': 'Nelson',
    'angel': 'Angel',
    'pablo': 'Pablo',
    'jorge': 'Jorge',
    'adriana': 'Adriana'
};

function sanitizePhone(val) {
    if (!val) return '';
    let c = val.toString().replace(/\D/g, '');
    if (c.length >= 12 && c.startsWith('57')) {
        c = c.substring(2);
    }
    return c;
}

function isForbiddenPassword(str) {
    if (!str) return true;
    const low = String(str).trim().toLowerCase();
    return low.startsWith('dl70112849') || low === 'libre' || low === 'noren' || low === 'original';
}

function normalizeSellerName(rawSeller) {
    if (!rawSeller) return 'Página Web Oficial';
    const clean = String(rawSeller).trim();
    const low = clean.toLowerCase();
    if (KNOWN_SELLERS_MAP[low]) return KNOWN_SELLERS_MAP[low];
    return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function normalizeClientNameKey(n) {
    if (!n) return '';
    return String(n).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/^[0-9]+[\s\.\-_]*/, '') // quita prefijo numérico de pantalla '1 ', '2 '
        .replace(/[\s\.\-_]*[0-9]+$/, '') // quita sufijo numérico ' 2', ' 3'
        .replace(/[^a-z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function clientNamesMatch(n1, n2) {
    const k1 = normalizeClientNameKey(n1);
    const k2 = normalizeClientNameKey(n2);
    if (!k1 || !k2) return true;
    if (k1 === k2) return true;
    const words1 = k1.split(' ').filter(Boolean);
    const words2 = k2.split(' ').filter(Boolean);
    if (words1.length > 0 && words2.length > 0 && words1[0] === words2[0] && (k1.includes(k2) || k2.includes(k1))) {
        return true;
    }
    return false;
}

const MONTH_MAP = {
    'jan': 0, 'ene': 0,
    'feb': 1,
    'mar': 2,
    'apr': 3, 'abr': 3,
    'may': 4,
    'jun': 5,
    'jul': 6,
    'aug': 7, 'ago': 7,
    'sep': 8, 'sept': 8,
    'oct': 9,
    'nov': 10,
    'dec': 11, 'dic': 11
};

function parseExcelDateStr(dateStr, isEnd = false, startRefMs = null) {
    if (!dateStr) return null;
    const s = String(dateStr).trim().toLowerCase().replace(/\./g, '');
    const now = new Date();

    // Formato con texto de mes: "18-jul", "18/oct", "18 oct", "18-octubre", "2-Jan-2027", "2-Jan-27", "2-Jan"
    let m = s.match(/^(\d{1,2})[-/\s]+([a-z]{3,4})(?:[-/\s]+(\d{2,4}))?/i);
    if (m) {
        const day = parseInt(m[1], 10);
        const monKey = m[2].slice(0, 3).toLowerCase();
        const month = MONTH_MAP[monKey];
        if (month !== undefined && day >= 1 && day <= 31) {
            let year = m[3] ? parseInt(m[3], 10) : now.getFullYear();
            if (year < 100) year += 2000;

            if (!m[3] && isEnd) {
                if (startRefMs) {
                    const sDate = new Date(startRefMs);
                    const sMonth = sDate.getMonth();
                    const sYear = sDate.getFullYear();
                    if (month < sMonth || (month === sMonth && day < sDate.getDate())) {
                        year = sYear + 1;
                    } else {
                        year = sYear;
                    }
                } else {
                    const candidateMs = new Date(year, month, day, 23, 59, 59, 999).getTime();
                    if (candidateMs < now.getTime() - 45 * 86400000) {
                        year = now.getFullYear() + 1;
                    }
                }
            }

            if (isEnd) {
                return new Date(year, month, day, 23, 59, 59, 999).getTime();
            }
            return new Date(year, month, day, 12, 0, 0, 0).getTime();
        }
    }

    // Formato numérico: "18/10/2026", "18-10-2026", "18/10/26", "18/10", "18-10", "2/01/2027", "2/01"
    m = s.match(/^(\d{1,2})[-/](\d{1,2})(?:[-/](\d{2,4}))?/);
    if (m) {
        const day = parseInt(m[1], 10);
        const month = parseInt(m[2], 10) - 1;
        let year = m[3] ? parseInt(m[3], 10) : now.getFullYear();
        if (year < 100) year += 2000;
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
            if (!m[3] && isEnd) {
                if (startRefMs) {
                    const sDate = new Date(startRefMs);
                    const sMonth = sDate.getMonth();
                    const sYear = sDate.getFullYear();
                    if (month < sMonth || (month === sMonth && day < sDate.getDate())) {
                        year = sYear + 1;
                    } else {
                        year = sYear;
                    }
                } else {
                    const candidateMs = new Date(year, month, day, 23, 59, 59, 999).getTime();
                    if (candidateMs < now.getTime() - 45 * 86400000) {
                        year = now.getFullYear() + 1;
                    }
                }
            }

            if (isEnd) {
                return new Date(year, month, day, 23, 59, 59, 999).getTime();
            }
            return new Date(year, month, day, 12, 0, 0, 0).getTime();
        }
    }

    return null;
}

function sameDate(t1, t2) {
    if (!t1 || !t2) return false;
    const d1 = new Date(Number(t1) || t1);
    const d2 = new Date(Number(t2) || t2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
}

const KNOWN_PLATFORM_PATTERNS = [
    { key: 'Netflix Privada', regex: /\b(netflix\s*privad[ao]?|nopv|npv)\b/i },
    { key: 'Netflix', regex: /\b(netflix)\b/i },
    { key: 'Disney Privada', regex: /\b((?:disney|dixney)\s*privad[ao]?|dopv|dpv)\b/i },
    { key: 'Disney', regex: /\b(disney\+?|disneyplus|dixney)\b/i },
    { key: 'Max (HBO)', regex: /\b(hbo\s*max|hbomax|max\b)/i },
    { key: 'Prime Video', regex: /\b(prime\s*video|primevideo|prime|amazon)\b/i },
    { key: 'Paramount', regex: /\b(paramount\+?|paramountplus)\b/i },
    { key: 'Vix', regex: /\b(vix\+?|vixplus)\b/i },
    { key: 'Crunchyroll', regex: /\b(crunchyroll|crunchy)\b/i },
    { key: 'IPTV', regex: /\b(iptv|magis|flujo|tele)\b/i },
    { key: 'Apple TV', regex: /\b(apple\s*tv\+?|appletvplus|apple)\b/i },
    { key: 'Spotify', regex: /\b(spotify)\b/i },
    { key: 'YouTube', regex: /\b(youtube|yt)\b/i }
];

function extractPlatformsFromName(name) {
    if (!name) return [];
    let matches = [];
    for (const p of KNOWN_PLATFORM_PATTERNS) {
        const match = name.match(p.regex);
        if (match) {
            matches.push({ platform: p.key, index: match.index, end: match.index + match[0].length });
        }
    }
    // Filtrar coincidencias que se superpongan (ej: 'Netflix' dentro de 'Netflix Privada')
    // Priorizando la coincidencia más larga/específica
    matches.sort((a, b) => (b.end - b.index) - (a.end - a.index));
    const nonOverlapping = [];
    for (const m of matches) {
        const overlaps = nonOverlapping.some(existing => (m.index < existing.end && m.end > existing.index));
        if (!overlaps) {
            nonOverlapping.push(m);
        }
    }
    nonOverlapping.sort((a, b) => a.index - b.index);
    return nonOverlapping.map(m => m.platform);
}

function cleanPlatformName(str) {
    if (!str) return '';
    return str
        .replace(/Dixney\s*Privad[ao]?/gi, 'Disney Privada')
        .replace(/Disney\s*Privad[ao]?/gi, 'Disney Privada')
        .replace(/Dixney/gi, 'Disney')
        .replace(/Disney\+/gi, 'Disney')
        .replace(/Paramount\+/gi, 'Paramount')
        .replace(/Apple TV\+/gi, 'Apple TV')
        .replace(/AppleTv\+/gi, 'Apple TV')
        .replace(/Vix\+/gi, 'Vix')
        .replace(/Discovery\+/gi, 'Discovery')
        .replace(/Amc\+/gi, 'Amc')
        .replace(/Canva\+/gi, 'Canva')
        .replace(/DisneyPlus/gi, 'Disney')
        .replace(/ParamountPlus/gi, 'Paramount')
        .replace(/AppleTvPlus/gi, 'Apple TV')
        .replace(/VixPlus/gi, 'Vix')
        .replace(/DiscoveryPlus/gi, 'Discovery')
        .replace(/AmcPlus/gi, 'Amc')
        .replace(/CanvaPlus/gi, 'Canva')
        .replace(/\+/g, '')
        .trim();
}

function cleanComboNameForSplitting(str) {
    if (!str) return '';
    return str
        .replace(/disney\s*\+/gi, 'Disney')
        .replace(/paramount\s*\+/gi, 'Paramount')
        .replace(/apple\s*tv\s*\+/gi, 'Apple TV')
        .replace(/vix\s*\+/gi, 'Vix')
        .replace(/discovery\s*\+/gi, 'Discovery')
        .replace(/amc\s*\+/gi, 'Amc')
        .replace(/canva\s*\+/gi, 'Canva');
}

function restoreBrandPluses(str) {
    return cleanPlatformName(str);
}

function formatComboNameFromSlots(specificEmails) {
    if (!specificEmails || specificEmails.length === 0) return 'Combo Streaming';
    const counts = {};
    const order = [];
    specificEmails.forEach(sp => {
        const plat = cleanPlatformName(sp.platform || 'Streaming');
        if (!counts[plat]) {
            counts[plat] = 0;
            order.push(plat);
        }
        counts[plat]++;
    });
    return order.map(plat => {
        const c = counts[plat];
        return c > 1 ? `${c} ${plat}` : plat;
    }).join(' ');
}

const COMBO_PRICE_CATALOG = [
    // Combos de 6 plataformas
    { keys: ['disney', 'max', 'netflix', 'paramount', 'prime', 'vix'], client: 70000, seller: 58000 },
    { keys: ['crunchy', 'disney', 'max', 'netflix', 'paramount', 'prime'], client: 73000, seller: 61000 },
    { keys: ['crunchy', 'disney', 'max', 'netflix', 'paramount', 'vix'], client: 73000, seller: 61000 },
    // Combos de 5 plataformas
    { keys: ['crunchy', 'disney', 'max', 'paramount', 'prime'], client: 57000, seller: 50000 },
    { keys: ['disney', 'max', 'netflix', 'prime', 'vix'], client: 56000, seller: 46000 },
    { keys: ['disney', 'netflix', 'paramount', 'prime', 'vix'], client: 58000, seller: 48000 },
    { keys: ['disney', 'max', 'netflix', 'paramount', 'prime'], client: 62000, seller: 52000 },
    { keys: ['crunchy', 'disney', 'max', 'netflix', 'paramount'], client: 65000, seller: 55000 },
    { keys: ['disney', 'iptv', 'netflix', 'prime', 'vix'], client: 60000, seller: 50000 },
    // Combos de 4 plataformas
    { keys: ['disney', 'max', 'prime', 'vix'], client: 40000, seller: 32000 },
    { keys: ['max', 'paramount', 'prime', 'vix'], client: 42000, seller: 34000 },
    { keys: ['crunchy', 'disney', 'max', 'netflix'], client: 51000, seller: 43000 },
    { keys: ['crunchy', 'disney', 'netflix', 'paramount'], client: 53000, seller: 45000 },
    { keys: ['disney', 'netflix', 'paramount', 'prime'], client: 50000, seller: 42000 },
    { keys: ['max', 'netflix', 'prime', 'vix'], client: 44000, seller: 36000 },
    { keys: ['disney', 'max', 'netflix', 'paramount'], client: 54000, seller: 46000 },
    { keys: ['disney', 'max', 'netflix', 'prime'], client: 48000, seller: 40000 },
    { keys: ['disney', 'max', 'paramount', 'prime'], client: 46000, seller: 38000 },
    // Combos de 3 plataformas
    { keys: ['disney', 'max', 'paramount'], client: 38000, seller: 32000 },
    { keys: ['disney', 'max', 'prime'], client: 32000, seller: 26000 },
    { keys: ['disney', 'max', 'vix'], client: 32000, seller: 26000 },
    { keys: ['crunchy', 'max', 'prime'], client: 31000, seller: 25000 },
    { keys: ['max', 'paramount', 'prime'], client: 34000, seller: 28000 },
    { keys: ['crunchy', 'max', 'vix'], client: 31000, seller: 25000 },
    { keys: ['max', 'paramount', 'vix'], client: 34000, seller: 28000 },
    { keys: ['crunchy', 'disney', 'netflix'], client: 39000, seller: 33000 },
    { keys: ['crunchy', 'max', 'netflix'], client: 39000, seller: 33000 },
    { keys: ['max', 'netflix', 'paramount'], client: 42000, seller: 36000 },
    { keys: ['max', 'netflix', 'prime'], client: 36000, seller: 30000 },
    { keys: ['netflix', 'paramount', 'prime'], client: 38000, seller: 32000 }, // Netflix + Paramount + Prime Video (Oficial $32.000 vendedor)
    { keys: ['crunchy', 'netflix', 'vix'], client: 35000, seller: 29000 },
    { keys: ['netflix', 'prime', 'vix'], client: 32000, seller: 26000 },
    { keys: ['disney', 'netflix', 'prime'], client: 36000, seller: 30000 },
    { keys: ['disney', 'max', 'netflix'], client: 40000, seller: 34000 },
    { keys: ['disney', 'netflix', 'paramount'], client: 42000, seller: 36000 },
    { keys: ['disney', 'paramount', 'prime'], client: 34000, seller: 28000 },
    { keys: ['apple', 'netflix', 'vix'], client: 41000, seller: 35000 },
    { keys: ['apple', 'netflix', 'spotify'], client: 47000, seller: 42000 },
    // Combos de 2 plataformas
    { keys: ['apple', 'paramount'], client: 31000, seller: 27000 },
    { keys: ['crunchy', 'disney'], client: 23000, seller: 19000 },
    { keys: ['disney', 'max'], client: 24000, seller: 20000 },
    { keys: ['disney', 'paramount'], client: 26000, seller: 22000 },
    { keys: ['disney', 'prime'], client: 20000, seller: 16000 },
    { keys: ['disney', 'vix'], client: 20000, seller: 16000 },
    { keys: ['max', 'paramount'], client: 26000, seller: 22000 },
    { keys: ['max', 'prime'], client: 20000, seller: 16000 },
    { keys: ['max', 'vix'], client: 20000, seller: 16000 },
    { keys: ['crunchy', 'netflix'], client: 27000, seller: 23000 },
    { keys: ['disney', 'netflix'], client: 28000, seller: 24000 },
    { keys: ['max', 'netflix'], client: 28000, seller: 24000 },
    { keys: ['netflix', 'paramount'], client: 30000, seller: 25000 },
    { keys: ['netflix', 'prime'], client: 24000, seller: 20000 },
    { keys: ['netflix', 'vix'], client: 24000, seller: 20000 },
    { keys: ['crunchy', 'prime'], client: 19000, seller: 15000 },
    { keys: ['paramount', 'prime'], client: 22000, seller: 18000 },
    { keys: ['prime', 'vix'], client: 16000, seller: 12000 }
];

function buildDynamicComboCatalog(products) {
    if (!Array.isArray(products) || products.length === 0) return [];
    function getKeys(name) {
        const n = String(name || '').toLowerCase();
        const keys = [];
        if (n.includes('netflix')) keys.push('netflix');
        if (n.includes('disney') || n.includes('dixney')) keys.push('disney');
        if (n.includes('max') || n.includes('hbo')) keys.push('max');
        if (n.includes('prime') || n.includes('amazon')) keys.push('prime');
        if (n.includes('paramount')) keys.push('paramount');
        if (n.includes('crunchy')) keys.push('crunchy');
        if (n.includes('vix')) keys.push('vix');
        if (n.includes('iptv') || n.includes('magis') || n.includes('flujo')) keys.push('iptv');
        if (n.includes('apple')) keys.push('apple');
        if (n.includes('spotify') || n.includes('sp')) keys.push('spotify');
        if (n.includes('youtube')) keys.push('youtube');
        return keys.sort();
    }
    const combos1m = products.filter(p => {
        if (!p || !p.name || p.active === false) return false;
        if (p.months && Number(p.months) > 1) return false;
        if (/\b[23]\s*mes/i.test(p.name)) return false;
        const keys = getKeys(p.name);
        return keys.length >= 2;
    });
    const comboMap = new Map();
    combos1m.forEach(p => {
        const keys = getKeys(p.name);
        const sig = keys.join(':::');
        const isPrivate = /privad/i.test(p.name);
        const clientPrice = Number(p.price || 0);
        const sellerPrice = Number(p.sellerPrice !== undefined && p.sellerPrice > 0 ? p.sellerPrice : p.price);
        if (!comboMap.has(sig) || (!isPrivate && comboMap.get(sig).isPrivate)) {
            comboMap.set(sig, { keys, client: clientPrice, seller: sellerPrice, name: p.name, isPrivate });
        }
    });
    const arr = Array.from(comboMap.values());
    arr.sort((a, b) => b.keys.length - a.keys.length);
    return arr;
}

function getPlatformKey(pName) {
    const s = String(pName || '').toLowerCase();
    if (s.includes('netflix') || s.includes('netflx')) return 'netflix';
    if (s.includes('disney') || s.includes('dixney')) return 'disney';
    if (s.includes('max') || s.includes('hbo')) return 'max';
    if (s.includes('prime') || s.includes('amazon')) return 'prime';
    if (s.includes('paramount')) return 'paramount';
    if (s.includes('vix') || s.includes('vux')) return 'vix';
    if (s.includes('crunchy')) return 'crunchy';
    if (s.includes('iptv') || s.includes('magis') || s.includes('flujo')) return 'iptv';
    if (s.includes('apple')) return 'apple';
    if (s.includes('spotify') || s.includes('sp')) return 'spotify';
    if (s.includes('youtube')) return 'youtube';
    return 'other';
}

function calculateScreensPrice(screens, isSeller, dynamicCatalog = null) {
    if (!screens || screens.length === 0) return 0;
    if (screens.length === 1) {
        const p = screens[0].platform || screens[0].name || screens[0];
        return getPlatformPriceInfo(p, isSeller).price;
    }

    const counts = {};
    const platformList = [];
    screens.forEach(sc => {
        const rawPlat = sc.platform || sc.name || sc;
        const k = getPlatformKey(rawPlat);
        counts[k] = (counts[k] || 0) + 1;
        platformList.push({ key: k, raw: rawPlat });
    });

    const activeCombos = (Array.isArray(dynamicCatalog) && dynamicCatalog.length > 0)
        ? dynamicCatalog
        : COMBO_PRICE_CATALOG;

    let bestCombo = null;
    for (const combo of activeCombos) {
        if (combo.keys.every(k => (counts[k] || 0) >= 1)) {
            bestCombo = combo;
            break;
        }
    }

    let total = 0;
    if (bestCombo) {
        total += isSeller ? bestCombo.seller : bestCombo.client;
        const remainingCounts = { ...counts };
        bestCombo.keys.forEach(k => {
            remainingCounts[k]--;
        });
        for (const [k, count] of Object.entries(remainingCounts)) {
            if (count > 0) {
                const sampleRaw = platformList.find(p => p.key === k)?.raw || k;
                const pInfo = getPlatformPriceInfo(sampleRaw, isSeller);
                total += count * (pInfo.price || (isSeller ? 10000 : 13000));
            }
        }
    } else {
        platformList.forEach(p => {
            const pInfo = getPlatformPriceInfo(p.raw, isSeller);
            total += (pInfo.price || 0);
        });
    }

    return total;
}

function getScreenCount(category, name) {
    const cat = (category || '').toLowerCase().trim();
    const n = (name || '').toLowerCase().trim();
    const prefixNumMatch = n.match(/^(\d+)\s+/);
    const leadingCount = prefixNumMatch ? parseInt(prefixNumMatch[1], 10) : 0;
    const detected = extractPlatformsFromName(name);
    if (detected.length > 1) {
        if (leadingCount > 1) return detected.length + (leadingCount - 1);
        return detected.length;
    }

    if (cat.includes('combo2') || cat.includes('combos2') || (cat.includes('combo') && cat.includes('2')) || n.includes('duo') || n.includes('combo 2')) return 2;
    if (cat.includes('combo3') || cat.includes('combos3') || (cat.includes('combo') && cat.includes('3')) || n.includes('trio') || n.includes('triple') || n.includes('combo 3')) return 3;
    if (cat.includes('combo4') || cat.includes('combos4') || (cat.includes('combo') && cat.includes('4')) || n.includes('combo 4')) return 4;
    if (cat.includes('combo5') || cat.includes('combos5') || (cat.includes('combo') && cat.includes('5')) || n.includes('combo 5')) return 5;
    if (cat.includes('promo') || cat.includes('combo')) {
        if (n.includes('5')) return 5;
        if (n.includes('4')) return 4;
        if (n.includes('3')) return 3;
        if (n.includes('2')) return 2;
    }
    const clean = cleanComboNameForSplitting(name);
    const plusMatches = clean.match(/[\+\-\|]|\s+y\s+/gi);
    if (plusMatches && plusMatches.length >= 1) return plusMatches.length + 1;
    return 1;
}

function guessPlatforms(productName, count) {
    if (!productName) return Array(count).fill('Streaming');
    const detected = extractPlatformsFromName(productName);
    if (detected.length > 0) {
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(detected[i] || (detected.length === 1 ? detected[0] : 'Streaming'));
        }
        return result;
    }
    const clean = cleanComboNameForSplitting(productName);
    const parts = clean.split(/\s*[\+\-\|]\s*|\s+y\s+/i)
        .map(s => s.replace(/\(.*?\)/g, '').trim())
        .filter(Boolean)
        .map(cleanPlatformName);
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(parts[i] || parts[0] || cleanPlatformName(clean));
    }
    return result;
}

function platformMatches(slotPlat, excelSheetObj) {
    const pLow = String(slotPlat || '').toLowerCase();
    return excelSheetObj.matchKeys.some(k => pLow.includes(k));
}

function codeMatchesPlatform(code, platName) {
    if (!code || !platName) return false;
    const c = String(code).toUpperCase().trim();
    const p = String(platName).toLowerCase().trim();

    if (p.includes('netflix')) {
        return /\b(no|nopv|npv|netflix)\b/i.test(c) || c.includes('NO') || c.includes('NETFLIX');
    }
    if (p.includes('disney') || p.includes('dixney')) {
        return /\b(do|dopv|dpv|disney)\b/i.test(c) || c.includes('DO') || c.includes('DISNEY');
    }
    if (p.includes('max') || p.includes('hbo')) {
        return /\b(mo|max|hbo)\b/i.test(c) || c.includes('MO') || c.includes('MAX');
    }
    if (p.includes('prime') || p.includes('amazon')) {
        return /\b(po|prime)\b/i.test(c) || c.includes('PO') || c.includes('PRIME');
    }
    if (p.includes('paramount')) {
        return /\b(pa|paramount)\b/i.test(c) || c.includes('PA');
    }
    if (p.includes('crunchy')) {
        return /\b(c|crunchy)\b/i.test(c) || c.includes('C');
    }
    if (p.includes('vix')) {
        return /\b(v|vix)\b/i.test(c) || c.includes('V');
    }
    if (p.includes('iptv') || p.includes('magis') || p.includes('flujo') || p.includes('tele')) {
        return /\b(i|iptv)\b/i.test(c) || c.includes('I');
    }
    if (p.includes('apple')) {
        return c.includes('APPLE');
    }
    if (p.includes('spotify')) {
        return c.includes('SP');
    }
    if (p.includes('youtube')) {
        return c.includes('YOUTUBE') || c.includes('YT');
    }
    return false;
}

/**
 * Lee el archivo Excel desde buffer en memoria (sin bloquear el archivo en Windows)
 * y extrae todas las pantallas activas de las 11 pestañas.
 */
function parseWorkbookFromBuffer(buffer) {
    const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const records = [];

    for (const sheetMeta of SHEET_MAP) {
        const { key, platform } = sheetMeta;
        const actualName = wb.SheetNames.find(s => s.toLowerCase().trim() === key.toLowerCase());
        if (!actualName) continue;

        const rows = XLSX.utils.sheet_to_json(wb.Sheets[actualName], { header: 1, raw: false, defval: '' });

        let currentAccountEmail = '';
        let currentAccountPass = '';
        let headerCols = null;

        for (let i = 0; i < rows.length; i++) {
            const r = rows[i].map(c => String(c || '').trim());
            if (r.every(c => !c)) continue;

            const lowerRow = r.map(c => c.toLowerCase());
            const clienteIdx = lowerRow.indexOf('cliente');
            const celIdx = lowerRow.indexOf('cel');

            // Detectar fila de encabezados de tabla ("usuario | Ciudad | cliente | cel ...")
            if (clienteIdx !== -1 && celIdx !== -1) {
                headerCols = {
                    usuarioIdx: lowerRow.findIndex(c => c === 'usuario' || c === 'vendedor'),
                    ciudadIdx: lowerRow.indexOf('ciudad'),
                    clienteIdx,
                    celIdx,
                    pantallasIdx: lowerRow.findIndex(c => c === 'pantallas' || c === 'dispositivo' || c === 'plataforma'),
                    pinIdx: lowerRow.findIndex(c => c === 'pin' || c === 'perfil'),
                    fechaIdx: lowerRow.indexOf('fecha'),
                    finIdx: lowerRow.indexOf('fin')
                };

                // Leer correo y contraseña de la fila superior del bloque (i - 1)
                if (i > 0) {
                    const prev = rows[i - 1].map(c => String(c || '').trim());
                    let emailCol = prev.findIndex(c => c.includes('@') && !isForbiddenPassword(c));
                    if (emailCol === -1 && key === 'I') {
                        // En IPTV: usuario en prev[2] y clave al lado en prev[3]
                        if (prev[2]) {
                            currentAccountEmail = prev[2];
                            currentAccountPass = !isForbiddenPassword(prev[3]) ? (prev[3] || '') : '';
                        }
                    } else if (emailCol !== -1) {
                        currentAccountEmail = prev[emailCol];
                        currentAccountPass = '';
                        // Tomar ÚNICAMENTE la contraseña que está justo al lado de la celda del email
                        for (let k = emailCol + 1; k < prev.length; k++) {
                            if (prev[k] !== '') {
                                if (!isForbiddenPassword(prev[k])) {
                                    currentAccountPass = prev[k];
                                }
                                break;
                            }
                        }
                    }
                }
                continue;
            }

            if (!headerCols) continue;

            const clientName = r[headerCols.clienteIdx] || '';
            const rawPhone = r[headerCols.celIdx] || '';
            const cleanPhone = sanitizePhone(rawPhone);
            if (!clientName || clientName.toLowerCase() === 'libre' || cleanPhone.length < 7) continue;

            const rawSeller = headerCols.usuarioIdx !== -1 ? r[headerCols.usuarioIdx] : '';
            const seller = normalizeSellerName(rawSeller);
            const city = headerCols.ciudadIdx !== -1 ? r[headerCols.ciudadIdx] : '';
            const pantallasCode = headerCols.pantallasIdx !== -1 ? r[headerCols.pantallasIdx] : '';
            const rawPinCol = headerCols.pinIdx !== -1 ? r[headerCols.pinIdx] : '';
            const fecha = headerCols.fechaIdx !== -1 ? r[headerCols.fechaIdx] : '';
            const fin = headerCols.finIdx !== -1 ? r[headerCols.finIdx] : '';

            // El Nombre de Perfil en la plataforma es el valor de la columna 'cliente' del Excel
            const profileName = clientName.trim();

            let email = currentAccountEmail;
            let password = currentAccountPass;
            let profilePin = rawPinCol;

            // Caso especial en pestaña NO (Netflix Miembro Extra / Nopv):
            // la columna 'pin' contiene el email propio del miembro extra y la columna 11 su contraseña
            if (rawPinCol.includes('@')) {
                email = rawPinCol;
                profilePin = '';
                password = '';
                const startSearchCol = headerCols.finIdx !== -1 ? headerCols.finIdx + 1 : 10;
                for (let k = startSearchCol; k < r.length; k++) {
                    if (r[k] && !isForbiddenPassword(r[k])) {
                        password = r[k];
                        break;
                    }
                }
            }

            // Determinar si es Netflix Privada (líneas 5 y 6 / Nopv) o Disney Privada (línea 7 / Dopv)
            let recordPlatform = cleanPlatformName(platform);
            const slotNumber = parseInt(r[0], 10);
            if (sheetMeta.key === 'NO') {
                if (slotNumber === 5 || slotNumber === 6 || /nopv|npv|privad/i.test(pantallasCode) || rawPinCol.includes('@')) {
                    recordPlatform = 'Netflix Privada';
                }
            } else if (sheetMeta.key === 'DO') {
                if (slotNumber === 7 || /dopv|dpv|privad/i.test(pantallasCode) || rawPinCol.includes('@')) {
                    recordPlatform = 'Disney Privada';
                }
            }

            records.push({
                sheet: actualName,
                sheetMeta,
                platform: recordPlatform,
                seller,
                city,
                clientName,
                phone: cleanPhone,
                pantallasCode,
                email,
                password,
                profile: profileName,
                profilePin,
                fecha,
                fin,
                startMs: parseExcelDateStr(fecha, false),
                expMs: parseExcelDateStr(fin, true, parseExcelDateStr(fecha, false))
            });
        }
    }

    return records;
}

/**
 * Sincroniza los registros extraídos del Excel con Firebase (clientProfiles, clientSales, sellerSales)
 */
async function syncExcelToFirebase(customBuffer = null) {
    let buffer = customBuffer;
    if (!buffer) {
        if (!fs.existsSync(EXCEL_FILE_PATH)) {
            throw new Error(`No se encontró el archivo Excel en: ${EXCEL_FILE_PATH}`);
        }
        buffer = fs.readFileSync(EXCEL_FILE_PATH);
    }

    const excelRecords = parseWorkbookFromBuffer(buffer);
    if (excelRecords.length === 0) {
        return { success: false, message: 'No se encontraron registros activos en el Excel.' };
    }

    // Descargar estado actual de Firebase (incluyendo catálogo oficial de productos)
    const [csResp, cpResp, ssResp, prodResp] = await Promise.all([
        axios.get(`${FIREBASE_DB_URL}/clientSales.json`),
        axios.get(`${FIREBASE_DB_URL}/clientProfiles.json`),
        axios.get(`${FIREBASE_DB_URL}/sellerSales.json`),
        axios.get(`${FIREBASE_DB_URL}/products.json`).catch(() => ({ data: null }))
    ]);

    const clientSales = csResp.data || {};
    const clientProfiles = cpResp.data || {};
    const sellerSales = ssResp.data || {};
    const rawProducts = prodResp?.data ? (Array.isArray(prodResp.data) ? prodResp.data : Object.values(prodResp.data)) : [];
    const dynamicCombos = buildDynamicComboCatalog(rawProducts);

    // Agrupar pantallas del Excel por (teléfono + cliente normalizado + fecha de inicio + fecha de fin)
    // para que cuando sea el mismo cliente pero fechas diferentes las pantallas queden divididas individualmente y no en combo.
    const clientGroups = {};
    for (const rec of excelRecords) {
        const normName = normalizeClientNameKey(rec.clientName);
        const startKey = rec.startMs ? new Date(rec.startMs).toISOString().split('T')[0] : (rec.fecha || 'nostart');
        const expKey = rec.expMs ? new Date(rec.expMs).toISOString().split('T')[0] : (rec.fin || 'nodate');
        const groupKey = rec.phone + '__' + (normName || 'cliente') + '__' + startKey + '__' + expKey;
        if (!clientGroups[groupKey]) clientGroups[groupKey] = [];
        clientGroups[groupKey].push(rec);
    }

    let updatedClientsCount = 0;
    let updatedScreensCount = 0;
    let createdSalesCount = 0;
    const matchedSaleKeysInThisRun = new Set();

    for (const groupKey of Object.keys(clientGroups)) {
        const phoneRecs = clientGroups[groupKey];
        const firstRec = phoneRecs[0];
        const phone = firstRec.phone;
        const groupClientName = (firstRec.clientName || '').trim();
        const startKey = firstRec.startMs ? new Date(firstRec.startMs).toISOString().split('T')[0] : (firstRec.fecha || 'nostart');
        const expKey = firstRec.expMs ? new Date(firstRec.expMs).toISOString().split('T')[0] : (firstRec.fin || 'nodate');
        const slugName = (normalizeClientNameKey(groupClientName).replace(/\s+/g, '_') || 'cliente') + '_' + (startKey.replace(/[^a-zA-Z0-9]/g, '')) + '_' + (expKey.replace(/[^a-zA-Z0-9]/g, ''));

        // 1. Asegurar clientProfiles/{phone} (Nombre y PIN de Cuenta de 4 dígitos)
        if (!clientProfiles[phone]) clientProfiles[phone] = {};
        if (!clientProfiles[phone].name || clientProfiles[phone].name === 'Cliente' || clientProfiles[phone].name === 'Sin Nombre') {
            clientProfiles[phone].name = firstRec.clientName;
        }
        if (!clientProfiles[phone].pin) {
            const fourDigitPin = phoneRecs.map(r => r.profilePin).find(p => /^\d{4}$/.test(p)) || phone.slice(-4);
            clientProfiles[phone].pin = fourDigitPin;
            clientProfiles[phone].ticketPin = fourDigitPin;
        }

        // 2. Determinar si esta cartera de ventas pertenece a un vendedor o es venta directa
        const sName = (firstRec.seller || '').trim();
        const isSellerSale = Boolean(sName && sName !== 'Página Web Oficial' && sName !== 'Admin' && sName !== 'Directo');

        // Buscar ventas existentes del cliente en su contenedor respectivo:
        // Si es vendedor -> sellerSales[sName]
        // Si es directo -> clientSales[phone]
        let targetStore = null;

        if (isSellerSale) {
            if (!sellerSales[sName]) sellerSales[sName] = {};
            targetStore = sellerSales[sName];
            // Eliminar cualquier duplicado accidental de este cliente específico en clientSales
            if (clientSales[phone]) {
                for (const k of Object.keys(clientSales[phone])) {
                    if (clientNamesMatch(clientSales[phone][k]?.clientName, groupClientName)) {
                        delete clientSales[phone][k];
                    }
                }
                if (Object.keys(clientSales[phone]).length === 0) {
                    delete clientSales[phone];
                }
            }
        } else {
            if (!clientSales[phone]) clientSales[phone] = {};
            targetStore = clientSales[phone];
            // Limpiar de sellerSales si existiera duplicado accidental de este cliente específico
            for (const s of Object.keys(sellerSales)) {
                if (sellerSales[s]) {
                    for (const k of Object.keys(sellerSales[s])) {
                        if (sanitizePhone(sellerSales[s][k]?.clientPhone) === phone && clientNamesMatch(sellerSales[s][k]?.clientName, groupClientName)) {
                            delete sellerSales[s][k];
                        }
                    }
                }
            }
        }

        // Obtener todas las ventas existentes para ESTE cliente específico en el almacén destino
        const existingSaleKeys = Object.keys(targetStore).filter(k => {
            const s = targetStore[k];
            if (!s) return false;
            if (sanitizePhone(s.clientPhone) !== phone) return false;
            return clientNamesMatch(s.clientName, groupClientName);
        });

        // Fechas provenientes del Excel para este cliente (todas las fechas de inicio y fin deben coincidir con el Excel)
        const maxStartMs = Math.max(0, ...phoneRecs.map(r => Number(r.startMs) || 0));
        const excelStartMs = maxStartMs > 0 ? maxStartMs : (firstRec.startMs || Date.now());
        const maxExpMs = Math.max(0, ...phoneRecs.map(r => Number(r.expMs) || 0));
        const excelExpMs = maxExpMs > 0 ? maxExpMs : (firstRec.expMs || (excelStartMs + 30 * 86400000));
        const nowMs = Date.now();

        // Ordenar siempre de la venta más reciente a la más antigua (por fechaCompraOriginal y clave push de Firebase)
        const sortByRecent = (keys) => [...keys].sort((a, b) => {
            if (!a.startsWith('excel_') && !b.startsWith('excel_')) {
                return b.localeCompare(a);
            }
            const sa = targetStore[a] || {};
            const sb = targetStore[b] || {};
            const da = Number(sa.fechaCompraOriginal || sa.date || 0);
            const db = Number(sb.fechaCompraOriginal || sb.date || 0);
            return db - da;
        });

        // Dar prioridad SIEMPRE a ventas reales manuales (no 'excel_') sobre placeholders técnicos
        const manualSaleKeys = sortByRecent(existingSaleKeys.filter(k => !k.startsWith('excel_')));
        const sortedAllKeys = sortByRecent(existingSaleKeys);
        const searchPools = manualSaleKeys.length > 0 ? [manualSaleKeys, sortedAllKeys] : [sortedAllKeys];

        let matchingSaleKey = null;
        const excelEmails = phoneRecs.map(r => (r.email || '').trim().toLowerCase()).filter(Boolean);
        const allOtherExcelEmails = new Set(
            excelRecords
                .filter(r => !phoneRecs.includes(r))
                .map(r => (r.email || '').trim().toLowerCase())
                .filter(Boolean)
        );
        const allActiveExcelEmailsForClient = new Set(
            excelRecords
                .filter(r => sanitizePhone(r.phone) === phone && clientNamesMatch(r.clientName, groupClientName))
                .map(r => (r.email || '').trim().toLowerCase())
                .filter(Boolean)
        );
        const otherExcelRecsForClient = excelRecords.filter(r => 
            sanitizePhone(r.phone) === phone && 
            clientNamesMatch(r.clientName, groupClientName) && 
            !phoneRecs.includes(r)
        );

        const getSaleEmails = (s) => {
            if (!s) return [];
            const sItems = Array.isArray(s.items) ? s.items : Object.values(s.items || {});
            return [
                s.email,
                ...sItems.flatMap(it => {
                    const specs = Array.isArray(it?.specificEmails) ? it.specificEmails : Object.values(it?.specificEmails || {});
                    return [it?.email, ...specs.map(sp => sp?.email)];
                })
            ].filter(Boolean).map(e => String(e).trim().toLowerCase());
        };

        const saleHasMatchingPlatform = (s) => {
            if (!s) return false;
            const sItems = Array.isArray(s.items) ? s.items : Object.values(s.items || {});
            return phoneRecs.some(rec => {
                return sItems.some(it => {
                    const itPlat = it?.name || '';
                    const specs = Array.isArray(it?.specificEmails) ? it.specificEmails : Object.values(it?.specificEmails || {});
                    return platformMatches(itPlat, rec.sheetMeta) || specs.some(sp => platformMatches(sp?.platform, rec.sheetMeta));
                });
            });
        };

        for (const pool of searchPools) {
            const candidateKeys = pool.filter(k => {
                if (matchedSaleKeysInThisRun.has(k)) return false;
                const s = targetStore[k];
                if (!s) return false;
                const sMainEmail = (s.email || '').trim().toLowerCase();
                if (sMainEmail && allOtherExcelEmails.has(sMainEmail) && !excelEmails.includes(sMainEmail)) {
                    return false;
                }
                return true;
            });

            // 1. Coincidencia por correo principal de la venta
            matchingSaleKey = candidateKeys.find(k => {
                const s = targetStore[k];
                const sMainEmail = (s.email || '').trim().toLowerCase();
                return sMainEmail && excelEmails.includes(sMainEmail);
            });
            if (matchingSaleKey) break;

            // 2. Coincidencia por correo en items Y plataforma
            matchingSaleKey = candidateKeys.find(k => {
                const s = targetStore[k];
                const sEmails = getSaleEmails(s);
                const hasEmail = excelEmails.some(ee => sEmails.includes(ee));
                return hasEmail && saleHasMatchingPlatform(s);
            });
            if (matchingSaleKey) break;

            // 2.1 Coincidencia por fecha de inicio Y fin Y conteo exacto de pantallas en Excel
            matchingSaleKey = candidateKeys.find(k => {
                const s = targetStore[k];
                const sDate = s.date || s.fechaCompraOriginal;
                const sExp = s.expirationDate;
                if (sameDate(sDate, excelStartMs) && sameDate(sExp, excelExpMs) && saleHasMatchingPlatform(s)) {
                    const sItems = Array.isArray(s.items) ? s.items : Object.values(s.items || {});
                    const totalScreens = sItems.reduce((acc, it) => acc + ((it.specificEmails && it.specificEmails.length) || 1), 0);
                    return totalScreens === phoneRecs.length;
                }
                return false;
            });
            if (matchingSaleKey) break;

            // 3. Coincidencia por fecha de inicio Y plataforma
            matchingSaleKey = candidateKeys.find(k => {
                const s = targetStore[k];
                const sDate = s.date || s.fechaCompraOriginal;
                return sameDate(sDate, excelStartMs) && saleHasMatchingPlatform(s);
            });
            if (matchingSaleKey) break;

            // 4. Coincidencia por fecha de fin Y plataforma
            matchingSaleKey = candidateKeys.find(k => {
                const s = targetStore[k];
                return sameDate(s.expirationDate, excelExpMs) && saleHasMatchingPlatform(s);
            });
            if (matchingSaleKey) break;

            // 5. Coincidencia por plataforma
            matchingSaleKey = candidateKeys.find(k => {
                const s = targetStore[k];
                return saleHasMatchingPlatform(s);
            });
            if (matchingSaleKey) break;

            // 6. Coincidencia por fecha de inicio
            matchingSaleKey = candidateKeys.find(k => {
                const s = targetStore[k];
                const sDate = s.date || s.fechaCompraOriginal;
                return sameDate(sDate, excelStartMs);
            });
            if (matchingSaleKey) break;

            // 7. Coincidencia por fecha de fin
            matchingSaleKey = candidateKeys.find(k => {
                const s = targetStore[k];
                return sameDate(s.expirationDate, excelExpMs);
            });
            if (matchingSaleKey) break;
        }

        const baseCleanEx = phone.replace(/^57/, '');
        const resetProfileAttempts = () => {
            [phone, baseCleanEx, '57' + baseCleanEx].forEach(pKey => {
                if (clientProfiles[pKey]) {
                    delete clientProfiles[pKey].codeAttemptUsed;
                    if (clientProfiles[pKey].clientAttempts) {
                        delete clientProfiles[pKey].clientAttempts[slugName];
                    }
                }
            });
        };

        if (matchingSaleKey) {
            // ============================================================
            // CASO 1: VENTA COINCIDENTE ENCONTRADA -> ACTUALIZAR Y PRESERVAR
            // ============================================================
            matchedSaleKeysInThisRun.add(matchingSaleKey);
            const sale = targetStore[matchingSaleKey];
            const prevExpMs = Number(sale.expirationDate) || 0;
            if (prevExpMs > 0 && excelExpMs > prevExpMs + 5 * 86400000) {
                sale.adminRenewedAt = nowMs;
                resetProfileAttempts();
            } else if (sameDate(excelStartMs, nowMs)) {
                resetProfileAttempts();
            }
            sale.expirationDate = excelExpMs;
            sale.date = excelStartMs;
            sale.fechaCompraOriginal = excelStartMs;
            if (firstRec.clientName) sale.clientName = firstRec.clientName;
            if (firstRec.city) sale.clientCity = firstRec.city;
            if (sName) sale.sellerName = sName;
            sale.isPaid = true;

            // Actualizar o poblar pantallas / items en la venta existente
            let itemsArr = [];
            if (!sale.items || (Array.isArray(sale.items) && sale.items.length === 0) || (typeof sale.items === 'object' && Object.keys(sale.items).length === 0)) {
                itemsArr = [];
            } else {
                itemsArr = Array.isArray(sale.items) ? sale.items : Object.values(sale.items);
            }

            // Retirar pantallas que pertenezcan a otros registros del Excel (de otros clientes o de compras con fechas diferentes del mismo cliente)
            itemsArr = itemsArr.filter(it => {
                if (!it) return false;
                const itPlat = it.name || (it.specificEmails && it.specificEmails[0] && it.specificEmails[0].platform) || '';
                const specs = Array.isArray(it.specificEmails) ? it.specificEmails : Object.values(it.specificEmails || {});
                const allEmails = [it.email, ...specs.map(sp => sp?.email)].filter(Boolean).map(e => String(e).trim().toLowerCase());

                // 1. Si algún correo del item pertenece explícitamente a otro registro del Excel y no a este grupo
                const belongsToOtherEmail = allEmails.some(e => allOtherExcelEmails.has(e));
                const belongsToThisEmail = phoneRecs.some(r => allEmails.includes((r.email || '').trim().toLowerCase()));
                if (belongsToOtherEmail && !belongsToThisEmail) {
                    return false;
                }

                // 2. Si la plataforma pertenece a otra compra activa con fecha diferente de este mismo cliente y no a este grupo
                const belongsToOtherPurchase = otherExcelRecsForClient.some(otherRec => 
                    platformMatches(itPlat, otherRec.sheetMeta) || specs.some(sp => platformMatches(sp?.platform, otherRec.sheetMeta))
                );
                const belongsToThisPurchase = phoneRecs.some(rec => 
                    platformMatches(itPlat, rec.sheetMeta) || 
                    specs.some(sp => platformMatches(sp?.platform, rec.sheetMeta)) ||
                    codeMatchesPlatform(rec.pantallasCode, itPlat) ||
                    specs.some(sp => codeMatchesPlatform(rec.pantallasCode, sp?.platform))
                );
                if (belongsToOtherPurchase && !belongsToThisPurchase) {
                    return false;
                }

                // 3. Si el item NO coincide con ninguna de las plataformas u hojas de esta compra en el Excel
                if (!belongsToThisPurchase) {
                    return false;
                }

                return true;
            });

            // Normalizar nombres antiguos (ej. Dixney Privada -> Disney Privada) y limpiar pantallas vacías
            itemsArr.forEach(it => {
                if (it && it.name) {
                    it.name = cleanPlatformName(it.name);
                }
                if (it && Array.isArray(it.specificEmails)) {
                    const scCount = getScreenCount(it.category, it.name);
                    if (scCount === 1 && it.specificEmails.length > 1) {
                        const valid = it.specificEmails.filter(sp => sp && (sp.email || sp.pass || sp.profile));
                        it.specificEmails = valid.length > 0 ? [valid[0]] : [it.specificEmails[0]];
                    }
                    it.specificEmails.forEach(sp => {
                        if (sp && sp.platform) sp.platform = cleanPlatformName(sp.platform);
                    });
                }
            });

            // Seguimiento de slots asignados en esta pasada para no sobreescribir pantallas repetidas (ej. 2 Netflix)
            const assignedSlotKeys = new Set();

            for (const rec of phoneRecs) {
                let assigned = false;
                const pInfo = getPlatformPriceInfo(rec.platform, isSellerSale);

                // 1. Buscar en items existentes: si el item es combo o individual que coincida con rec.sheetMeta
                for (let itIdx = 0; itIdx < itemsArr.length; itIdx++) {
                    const it = itemsArr[itIdx];
                    const isCombo = it.category === 'promociones' || (it.category && it.category.includes('combo')) || (it.name && extractPlatformsFromName(it.name).length > 1) || (it.specificEmails && it.specificEmails.length > 1);
                    const screenCount = (it.specificEmails && it.specificEmails.length > 0) ? it.specificEmails.length : getScreenCount(it.category, it.name);
                    const guesses = guessPlatforms(it.name, screenCount);

                    if (!Array.isArray(it.specificEmails)) {
                        it.specificEmails = it.specificEmails && typeof it.specificEmails === 'object'
                            ? Object.values(it.specificEmails)
                            : [];
                    }

                    // Asegurar que specificEmails tenga suficientes pantallas si es un combo
                    while (it.specificEmails.length < screenCount) {
                        const sIdx = it.specificEmails.length;
                        it.specificEmails.push({
                            platform: cleanPlatformName(guesses[sIdx] || it.name),
                            email: '',
                            pass: '',
                            profile: '',
                            pin: ''
                        });
                    }

                    // Buscar pantalla NO asignada que coincida con rec.sheetMeta
                    // Prioridad 1: Coincidencia exacta de correo o de perfil en esta plataforma
                    let targetSlotIdx = -1;
                    for (let sIdx = 0; sIdx < it.specificEmails.length; sIdx++) {
                        const slotKey = `${itIdx}_${sIdx}`;
                        if (assignedSlotKeys.has(slotKey)) continue;

                        const sp = it.specificEmails[sIdx];
                        const spPlat = sp.platform || guesses[sIdx] || it.name;
                        if (platformMatches(spPlat, rec.sheetMeta)) {
                            const emailMatches = rec.email && sp.email && sp.email.trim().toLowerCase() === rec.email.trim().toLowerCase();
                            const profMatches = rec.profile && sp.profile && sp.profile.trim().toLowerCase() === rec.profile.trim().toLowerCase();
                            if (emailMatches || profMatches) {
                                targetSlotIdx = sIdx;
                                break;
                            }
                        }
                    }

                    // Prioridad 2: Primer slot libre que coincida por plataforma
                    if (targetSlotIdx === -1) {
                        for (let sIdx = 0; sIdx < it.specificEmails.length; sIdx++) {
                            const slotKey = `${itIdx}_${sIdx}`;
                            if (assignedSlotKeys.has(slotKey)) continue;

                            const sp = it.specificEmails[sIdx];
                            const spPlat = sp.platform || guesses[sIdx] || it.name;
                            if (platformMatches(spPlat, rec.sheetMeta)) {
                                targetSlotIdx = sIdx;
                                break;
                            }
                        }
                    }

                    if (targetSlotIdx !== -1) {
                        const slotKey = `${itIdx}_${targetSlotIdx}`;
                        const sp = it.specificEmails[targetSlotIdx];
                        const spPlat = sp.platform || guesses[targetSlotIdx] || it.name;
                        if (rec.sheetMeta.key === 'NO' && (rec.platform === 'Netflix Privada' || /privad/i.test(spPlat) || /nopv|npv/i.test(rec.pantallasCode))) {
                            sp.platform = 'Netflix Privada';
                            if (screenCount === 1) {
                                it.name = 'Netflix Privada';
                                it.id = pInfo.id;
                                it.finalPrice = pInfo.price;
                            }
                        } else if (rec.sheetMeta.key === 'DO' && (rec.platform === 'Disney Privada' || /privad/i.test(spPlat) || /dopv|dpv/i.test(rec.pantallasCode))) {
                            sp.platform = 'Disney Privada';
                            if (screenCount === 1) {
                                it.name = 'Disney Privada';
                                it.id = pInfo.id;
                                it.finalPrice = pInfo.price;
                            }
                        } else {
                            sp.platform = cleanPlatformName(rec.platform);
                            if (screenCount === 1) {
                                it.name = cleanPlatformName(rec.platform);
                                if (!it.finalPrice || it.finalPrice === 0) {
                                    it.finalPrice = pInfo.price;
                                }
                            }
                        }
                        sp.email = rec.email || sp.email || '';
                        sp.pass = rec.password || sp.pass || '';
                        sp.profile = rec.profile || sp.profile || '';
                        sp.pin = rec.profilePin || sp.pin || '';
                        assignedSlotKeys.add(slotKey);
                        assigned = true;
                    }

                    // Si es un combo y todos los slots existentes para esta plataforma ya fueron asignados,
                    // pero el cliente compró una pantalla adicional de la misma plataforma (ej: 2do Netflix),
                    // agregar la pantalla adicional directamente al combo!
                    if (!assigned && isCombo) {
                        const newSlot = {
                            platform: cleanPlatformName(rec.platform),
                            email: rec.email || '',
                            pass: rec.password || '',
                            profile: rec.profile || '',
                            pin: rec.profilePin || ''
                        };
                        it.specificEmails.push(newSlot);
                        assignedSlotKeys.add(`${itIdx}_${it.specificEmails.length - 1}`);
                        assigned = true;
                    }

                    if (assigned) break;
                }

                // 2. Si no encajó en ninguna pantalla existente, verificar que no exista ya ese item idéntico
                if (!assigned) {
                    const alreadyExists = itemsArr.some(it => {
                        const itPlat = cleanPlatformName(it.name || (it.specificEmails && it.specificEmails[0] && it.specificEmails[0].platform) || '');
                        const itEmail = (it.email || (it.specificEmails && it.specificEmails[0] && it.specificEmails[0].email) || '').trim().toLowerCase();
                        const itProf = (it.profile || (it.specificEmails && it.specificEmails[0] && it.specificEmails[0].profile) || '').trim().toLowerCase();
                        return platformMatches(itPlat, rec.sheetMeta) &&
                               (itEmail === (rec.email || '').trim().toLowerCase()) &&
                               (itProf === (rec.profile || '').trim().toLowerCase());
                    });

                    if (!alreadyExists) {
                        const newItem = {
                            id: pInfo.id || ('item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
                            name: cleanPlatformName(rec.platform),
                            category: 'individual',
                            finalPrice: pInfo.price,
                            specificEmails: [{
                                platform: cleanPlatformName(rec.platform),
                                email: rec.email || '',
                                pass: rec.password || '',
                                profile: rec.profile || '',
                                pin: rec.profilePin || ''
                            }]
                        };
                        itemsArr.push(newItem);
                        assignedSlotKeys.add(`${itemsArr.length - 1}_0`);
                    }
                }
                updatedScreensCount++;
            }

            // ── LIMPIEZA ESTRICTA: Retirar slots de combo o items individuales no asignados en este grupo de Excel ──
            const cleanedItems = [];
            for (let itIdx = 0; itIdx < itemsArr.length; itIdx++) {
                const it = itemsArr[itIdx];
                if (!it) continue;

                if (Array.isArray(it.specificEmails) && it.specificEmails.length > 0) {
                    // Filtrar únicamente los slots que fueron efectivamente asignados a un registro de este grupo de Excel
                    it.specificEmails = it.specificEmails.filter((sp, sIdx) => {
                        const slotKey = `${itIdx}_${sIdx}`;
                        return assignedSlotKeys.has(slotKey);
                    });

                    // Si al item no le quedó ningún slot asignado, se descarta por completo
                    if (it.specificEmails.length === 0) {
                        continue;
                    }

                    // Si era un combo pero ahora solo le queda 1 pantalla, convertir a individual
                    if (it.specificEmails.length === 1 && (it.category === 'promociones' || (it.category && it.category.includes('combo')))) {
                        it.category = 'individual';
                        it.name = cleanPlatformName(it.specificEmails[0].platform);
                        const pInfo = getPlatformPriceInfo(it.name, isSellerSale);
                        it.id = pInfo.id;
                        it.finalPrice = pInfo.price;
                    }
                } else {
                    continue;
                }
                cleanedItems.push(it);
            }
            itemsArr = cleanedItems;

            // Deduplicar items que tengan exactamente el mismo correo de cuenta en la misma familia de plataforma
            // (incluyendo pantallas ya contenidas dentro de un combo)
            const dedupedItems = [];
            const seenAccountKeys = new Set();
            const getFamKey = (platStr) => {
                if (/netflix/i.test(platStr)) return 'netflix';
                if (/disney|dixney/i.test(platStr)) return 'disney';
                if (/max|hbo/i.test(platStr)) return 'max';
                if (/prime|amazon/i.test(platStr)) return 'prime';
                if (/paramount/i.test(platStr)) return 'paramount';
                if (/crunchy/i.test(platStr)) return 'crunchy';
                if (/vix/i.test(platStr)) return 'vix';
                return (platStr || '').toLowerCase().trim();
            };

            // Actualizar nombre y precio de combos según sus pantallas asignadas
            const platformOrder = { 'Netflix': 1, 'Netflix Privada': 1, 'Disney': 2, 'Disney Privada': 2, 'Max (HBO)': 3, 'Prime Video': 4, 'Paramount': 5, 'Crunchyroll': 6, 'Vix': 7, 'IPTV': 8 };
            itemsArr.forEach(it => {
                if (it && Array.isArray(it.specificEmails) && it.specificEmails.length > 1) {
                    it.specificEmails.sort((a, b) => {
                        const oA = platformOrder[a.platform] || 99;
                        const oB = platformOrder[b.platform] || 99;
                        if (oA !== oB) return oA - oB;
                        const aLead = /^\d+/.test(a.profile || '');
                        const bLead = /^\d+/.test(b.profile || '');
                        if (!aLead && bLead) return -1;
                        if (aLead && !bLead) return 1;
                        return (a.profile || '').localeCompare(b.profile || '');
                    });
                    it.name = formatComboNameFromSlots(it.specificEmails);
                    it.finalPrice = calculateScreensPrice(it.specificEmails, isSellerSale, dynamicCombos);
                }
            });

            for (const it of itemsArr) {
                if (!it) continue;
                const scCount = (it.specificEmails && it.specificEmails.length > 0) ? it.specificEmails.length : getScreenCount(it.category, it.name);
                const specs = Array.isArray(it.specificEmails) ? it.specificEmails : Object.values(it.specificEmails || {});
                if (scCount > 1) {
                    specs.forEach(sp => {
                        const em = (sp?.email || '').trim().toLowerCase();
                        if (em) seenAccountKeys.add(`${getFamKey(sp?.platform || it.name)}_${em}`);
                    });
                    dedupedItems.push(it);
                } else {
                    const sp = specs[0] || {};
                    const emailKey = (sp.email || it.email || '').trim().toLowerCase();
                    const sig = `${getFamKey(sp.platform || it.name)}_${emailKey}`;
                    if (emailKey && seenAccountKeys.has(sig)) continue;
                    if (emailKey) seenAccountKeys.add(sig);
                    dedupedItems.push(it);
                }
            }
            sale.items = dedupedItems;

            // Asegurar que el total de la venta esté correctamente registrado según precios de cliente/vendedor
            const sumFinalPrices = dedupedItems.reduce((acc, it) => acc + (Number(it.finalPrice) || 0), 0);
            if (sumFinalPrices > 0) {
                sale.total = sumFinalPrices;
            }

            // Credenciales principales de la venta
            if (firstRec.email) sale.email = firstRec.email;
            if (firstRec.password) sale.password = firstRec.password;
            if (firstRec.profile) sale.profile = firstRec.profile;

            // "para que solo exista un registro y ese registro debe ser verificado del excel para que no alla mas duplicados"
            // Cualquier otra venta para este cliente:
            // Si es un duplicado técnico de excel_ previo -> borrar
            // Si es otra venta real anterior -> pasarla al historial expirándola (expirationDate en el pasado)
            for (const otherKey of existingSaleKeys) {
                if (otherKey === matchingSaleKey) continue;
                if (matchedSaleKeysInThisRun.has(otherKey)) continue;
                const otherSale = targetStore[otherKey];
                if (!otherSale) continue;

                // Eliminar venta duplicada del mismo cliente con el mismo rango de fechas
                const oStart = otherSale.date || otherSale.fechaCompraOriginal;
                const oExp = otherSale.expirationDate;
                if (sameDate(oStart, excelStartMs) && sameDate(oExp, excelExpMs)) {
                    console.log(`[EXCEL-SYNC] 🗑️ Eliminando venta duplicada para ${groupClientName} (${otherKey})`);
                    delete targetStore[otherKey];
                    continue;
                }

                const otherEmails = getSaleEmails(otherSale);
                if (otherEmails.some(e => allActiveExcelEmailsForClient.has(e))) {
                    continue; // Pertenece a otro grupo activo del Excel para este cliente. No tocar ni expirar!
                }
                if (otherKey.startsWith('excel_')) {
                    delete targetStore[otherKey];
                } else if ((Number(otherSale.expirationDate) || 0) >= nowMs) {
                    otherSale.expirationDate = Math.min(Number(otherSale.date || 0) + 30 * 86400000, nowMs - 1000);
                }
            }

        } else {
            // ============================================================
            // CASO 2: NO EXISTE VENTA PREVIA -> CREAR REGISTRO CON PRECIO OFICIAL
            // ============================================================
            resetProfileAttempts();
            for (const oldKey of existingSaleKeys) {
                if (matchedSaleKeysInThisRun.has(oldKey)) continue;
                const oldSale = targetStore[oldKey];
                if (!oldSale) continue;
                const oldEmails = getSaleEmails(oldSale);
                if (oldEmails.some(e => allActiveExcelEmailsForClient.has(e))) {
                    continue; // Pertenece a otro grupo activo del Excel para este cliente. No tocar ni expirar!
                }
                if (oldKey.startsWith('excel_')) {
                    delete targetStore[oldKey];
                } else if ((Number(oldSale.expirationDate) || 0) >= nowMs) {
                    oldSale.expirationDate = Math.min(Number(oldSale.date || 0) + 30 * 86400000, nowMs - 1000);
                }
            }

            // Crear el registro verificado del Excel con clave estable y única para este cliente
            const verifiedSaleKey = 'excel_' + phone + '_' + slugName;
            matchedSaleKeysInThisRun.add(verifiedSaleKey);
            let newItems = [];
            if (phoneRecs.length > 1) {
                const comboName = formatComboNameFromSlots(phoneRecs);
                const comboTotal = calculateScreensPrice(phoneRecs, isSellerSale, dynamicCombos);
                newItems = [{
                    id: 'excel_combo_' + Date.now(),
                    name: comboName,
                    category: 'promociones',
                    finalPrice: comboTotal,
                    specificEmails: phoneRecs.map(rec => ({
                        platform: cleanPlatformName(rec.platform),
                        email: rec.email || '',
                        pass: rec.password || '',
                        profile: rec.profile || '',
                        pin: rec.profilePin || ''
                    }))
                }];
            } else {
                newItems = phoneRecs.map((rec, idx) => {
                    const pInfo = getPlatformPriceInfo(rec.platform, isSellerSale);
                    return {
                        id: pInfo.id || ('excel_item_' + idx),
                        name: cleanPlatformName(rec.platform),
                        category: 'individual',
                        finalPrice: pInfo.price,
                        specificEmails: [{
                            platform: cleanPlatformName(rec.platform),
                            email: rec.email || '',
                            pass: rec.password || '',
                            profile: rec.profile || '',
                            pin: rec.profilePin || ''
                        }]
                    };
                });
            }
            const calculatedTotal = newItems.reduce((acc, it) => acc + (Number(it.finalPrice) || 0), 0);

            targetStore[verifiedSaleKey] = {
                clientName: firstRec.clientName,
                clientPhone: phone,
                clientCity: firstRec.city || '',
                date: excelStartMs,
                expirationDate: excelExpMs,
                isPaid: true,
                sellerName: sName || 'Página Web Oficial',
                total: calculatedTotal,
                email: firstRec.email || '',
                password: firstRec.password || '',
                profile: firstRec.profile || '',
                items: newItems
            };

            createdSalesCount++;
            updatedScreensCount += phoneRecs.length;
        }

        updatedClientsCount++;
    }

    // Guardar en Firebase
    const syncTimestamp = Date.now();
    await Promise.all([
        axios.put(`${FIREBASE_DB_URL}/clientProfiles.json`, clientProfiles),
        axios.put(`${FIREBASE_DB_URL}/clientSales.json`, clientSales),
        axios.put(`${FIREBASE_DB_URL}/sellerSales.json`, sellerSales),
        axios.patch(`${FIREBASE_DB_URL}/storeConfig.json`, {
            lastExcelSync: syncTimestamp,
            lastExcelSyncScreens: updatedScreensCount,
            lastExcelSyncClients: updatedClientsCount
        }).catch(() => {})
    ]);

    return {
        success: true,
        totalExcelScreens: excelRecords.length,
        updatedClientsCount,
        updatedScreensCount,
        createdSalesCount,
        syncTimestamp
    };
}

/**
 * Inicia el observador en tiempo real sobre "D:\Varios\Netflix\Netflix clientes.xlsx"
 * Cada vez que el usuario guarde cambios en Excel (Ctrl + G), sincroniza con Firebase.
 */
function startExcelWatcher() {
    console.log(`[EXCEL-SYNC] 👀 Vigilando cambios en vivo en: "${EXCEL_FILE_PATH}"`);
    let debounceTimer = null;
    let lastMtimeMs = 0;

    try {
        if (fs.existsSync(EXCEL_FILE_PATH)) {
            lastMtimeMs = fs.statSync(EXCEL_FILE_PATH).mtimeMs;
        }
    } catch (e) { /* ignore */ }

    const triggerSync = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            try {
                if (!fs.existsSync(EXCEL_FILE_PATH)) return;
                const stat = fs.statSync(EXCEL_FILE_PATH);
                if (stat.mtimeMs === lastMtimeMs) return;
                lastMtimeMs = stat.mtimeMs;

                console.log(`[EXCEL-SYNC] 🔄 Cambio detectado en "${path.basename(EXCEL_FILE_PATH)}" (${new Date().toLocaleTimeString()}). Sincronizando con Firebase...`);
                try { delete require.cache[require.resolve('./excel-sync')]; } catch (_) {}
                const { syncExcelToFirebase: freshSyncFn } = require('./excel-sync');
                const res = await freshSyncFn();
                console.log(`[EXCEL-SYNC] ✅ Base de datos actualizada: ${res.updatedScreensCount} pantallas en ${res.updatedClientsCount} clientes (${res.createdSalesCount} clientes nuevos añadidos).`);
            } catch (err) {
                console.error(`[EXCEL-SYNC] ⚠️ Error al sincronizar Excel:`, err.message);
            }
        }, 1800);
    };

    // Vigilar el directorio para soportar el guardado atómico de Microsoft Excel (que crea un archivo temporal y renombra)
    const dir = path.dirname(EXCEL_FILE_PATH);
    const base = path.basename(EXCEL_FILE_PATH).toLowerCase();

    if (fs.existsSync(dir)) {
        fs.watch(dir, (eventType, filename) => {
            if (!filename) return;
            const fLow = filename.toLowerCase();
            if (fLow.startsWith('~$')) return; // Ignorar archivo temporal de bloqueo de Excel
            if (fLow === base) {
                triggerSync();
            }
        });
    }

    // Respaldo por polling ligero cada 4 segundos por si Windows omite algún evento de renombrado de Excel
    setInterval(() => {
        try {
            if (!fs.existsSync(EXCEL_FILE_PATH)) return;
            const stat = fs.statSync(EXCEL_FILE_PATH);
            if (stat.mtimeMs !== lastMtimeMs) {
                triggerSync();
            }
        } catch (e) { /* ignore */ }
    }, 4000);
}

if (require.main === module) {
    (async () => {
        try {
            console.log(`[EXCEL-SYNC] 🚀 Ejecutando sincronización inicial desde: "${EXCEL_FILE_PATH}"...`);
            const result = await syncExcelToFirebase();
            console.log(`[EXCEL-SYNC] ✅ Sincronización completada con éxito:`, result);
            if (process.argv.includes('--watch')) {
                startExcelWatcher();
            }
        } catch (err) {
            console.error(`[EXCEL-SYNC] ❌ Error:`, err.message);
            process.exit(1);
        }
    })();
}

module.exports = {
    EXCEL_FILE_PATH,
    PLATFORM_PRICE_CATALOG,
    COMBO_PRICE_CATALOG,
    calculateScreensPrice,
    formatComboNameFromSlots,
    getPlatformPriceInfo,
    parseWorkbookFromBuffer,
    syncExcelToFirebase,
    startExcelWatcher,
    getScreenCount,
    guessPlatforms,
    cleanPlatformName,
    extractPlatformsFromName,
    platformMatches
};
