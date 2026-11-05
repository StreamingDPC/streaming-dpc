/**
 * ==========================================================================
 * RULETA DE LA SUERTE - STREAMING DPC
 * Motor interactivo de ruleta de premios y descuentos exclusivos
 * ==========================================================================
 */

(function () {
    'use strict';

    // 1. Configuración por defecto de premios (editable desde Firebase storeConfig.ruletaConfig)
    const DEFAULT_PREMIOS = [
        {
            id: 1,
            label: "10% DCTO Netflix",
            tipo: "descuento_servicio",
            servicio: "Netflix Premium",
            precioNormal: 15000,
            descuentoPorcentaje: 10, // Paga 10.500
            probabilidad: 10,       // 10% de probabilidad
            stockMaximo: 5,         // Máximo 5 ganadores
            color: "#e50914"
        },
        {
            id: 2,
            label: "Pantalla ViX Gratis",
            tipo: "pantalla_gratis",
            servicio: "ViX Premium",
            precioNormal: 8000,
            descuentoPorcentaje: 100, // Total: $0
            probabilidad: 1,          // 1% de probabilidad
            stockMaximo: 1,          // Solo 1 único ganador
            color: "#ff5400"
        },
        {
            id: 3,
            label: "20% DCTO Disney+",
            tipo: "descuento_servicio",
            servicio: "Disney+ Estándar",
            precioNormal: 14000,
            descuentoPorcentaje: 20, // Paga 11.200
            probabilidad: 15,        // 15% de probabilidad
            stockMaximo: 5,          // Máximo 5 ganadores
            color: "#113ccf"
        },
        {
            id: 4,
            label: "Pantalla Crunchyroll Gratis",
            tipo: "pantalla_gratis",
            servicio: "Crunchyroll Fan",
            precioNormal: 9000,
            descuentoPorcentaje: 100, // Total: $0
            probabilidad: 1,          // 1% de probabilidad
            stockMaximo: 1,          // Solo 1 único ganador
            color: "#f77f00"
        },
        {
            id: 5,
            label: "Bono 15% General",
            tipo: "cupon_general",
            servicio: "Cualquier Pantalla",
            precioNormal: 0, // Se calcula según lo que escoja
            descuentoPorcentaje: 15,
            probabilidad: 25,        // 25% de probabilidad
            stockMaximo: 10,         // Máximo 10 ganadores
            color: "#7209b7"
        },
        {
            id: 6,
            label: "Sigue Intentando 😢",
            tipo: "sin_premio",
            servicio: "Ninguno",
            precioNormal: 0,
            descuentoPorcentaje: 0,
            probabilidad: 48,        // 48% de probabilidad (mayoría)
            stockMaximo: 0,          // 0 = Ilimitado / Sin límite
            color: "#343a40"
        }
    ];

    const WHATSAPP_ADMIN = "573155182545";

    /**
     * Genera una firma criptográfica corta (checksum) para validar la autenticidad del ticket
     * Protege contra alteraciones manuales en el texto de WhatsApp
     */
    window.generarFirmaSeguridad = function (ticketId, descuento, telefono) {
        const semilla = `${ticketId}-${descuento}-${telefono}-DPC2026`;
        let hash = 0;
        for (let i = 0; i < semilla.length; i++) {
            hash = (hash << 5) - hash + semilla.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(36).toUpperCase().padStart(4, '0').substring(0, 5);
    };


    // Variables internas del motor de la ruleta
    let anguloActual = 0;
    let isGirando = false;
    let premioTemporal = null;
    let audioCtx = null;

    /**
     * Obtiene la configuración consolidada de la ruleta desde storeConfig
     */
    window.getRuletaConfig = function () {
        const sc = (typeof storeConfig !== 'undefined') ? storeConfig : {};
        const rConf = sc.ruletaConfig || {};

        return {
            enabled: rConf.enabled !== false,
            bannerText: rConf.bannerText || "¿No estás en el podio? ¡Aprovecha y gira la ruleta aquí!",
            bannerSubtext: rConf.bannerSubtext || "Participa por pantallas de regalo y descuentos exclusivos para clientes fuera del Top 3.",
            buttonText: rConf.buttonText || "🎰 ¡Girar Ruleta de la Suerte!",
            intentosMaximosPorDia: parseInt(rConf.intentosMaximosPorDia) || 3,
            resetButtonEnabled: rConf.resetButtonEnabled === true,
            resetButtonTarget: rConf.resetButtonTarget || '',
            premios: (Array.isArray(rConf.premios) && rConf.premios.length >= 2) ? rConf.premios : DEFAULT_PREMIOS,
            whatsappAdmin: rConf.whatsappAdmin || WHATSAPP_ADMIN
        };
    };

    /**
     * Devuelve la clave del día para almacenar intentos (YYYY-MM-DD)
     */
    function getTodayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    /**
     * Obtiene el identificador del usuario (teléfono verificado o guest)
     */
    function getCurrentUserIdentifier() {
        // 1. Teléfono de cliente autenticado
        if (typeof clientPhoneLoggedIn !== 'undefined' && clientPhoneLoggedIn) {
            return String(clientPhoneLoggedIn).replace(/\D/g, '').replace(/^57/, '');
        }
        const stPhone = localStorage.getItem('clientPhone');
        if (stPhone) return String(stPhone).replace(/\D/g, '').replace(/^57/, '');

        // 2. Si está en Modo Vendedor
        const isSeller = (typeof isSellerMode !== 'undefined' && isSellerMode) || localStorage.getItem('isSellerMode') === 'true';
        const sellerName = (typeof currentSellerName !== 'undefined' && currentSellerName) || localStorage.getItem('sellerName') || '';
        if (isSeller && sellerName) {
            const sc = (typeof storeConfig !== 'undefined') ? storeConfig : {};
            const sellersRaw = sc.sellers || [];
            const sellers = Array.isArray(sellersRaw) ? sellersRaw : Object.values(sellersRaw || {});
            const sObj = sellers.find(s => (s.name || '').toLowerCase().trim() === sellerName.toLowerCase().trim());
            if (sObj && sObj.whatsapp) {
                return String(sObj.whatsapp).replace(/\D/g, '').replace(/^57/, '');
            }
            return 'vendedor_' + sellerName.toLowerCase().trim().replace(/\s+/g, '_');
        }

        // 3. Teléfono de invitado si ya lo ingresó
        const guestPhone = localStorage.getItem('dpc_ruleta_guest_phone');
        if (guestPhone) return String(guestPhone).replace(/\D/g, '').replace(/^57/, '');

        return 'invitado';
    }

    /**
     * Obtiene el objeto de estadísticas de usuario del día
     */
    function getEstadisticasUsuario() {
        const id = getCurrentUserIdentifier();
        const today = getTodayKey();
        const key = `dpc_ruleta_stats_${id}_${today}`;
        const raw = localStorage.getItem(key);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (e) { }
        }
        return {
            id: id,
            fecha: today,
            intentosHoy: 0,
            premioAceptado: false,
            ultimoPremio: null
        };
    }

    /**
     * Guarda las estadísticas del usuario en localStorage
     */
    function guardarEnStorage(stats) {
        const id = getCurrentUserIdentifier();
        const today = getTodayKey();
        const key = `dpc_ruleta_stats_${id}_${today}`;
        localStorage.setItem(key, JSON.stringify(stats));
    }

    /**
     * Verifica si el usuario actual se encuentra en los primeros 3 puestos del ranking navideño
     */
    window.isUserInTop3Navidad = async function () {
        try {
            let rankings = null;
            if (typeof loadNavRankings === 'function') {
                rankings = await loadNavRankings();
            } else if (typeof window.currentStatsRankingData !== 'undefined' && window.currentStatsRankingData.adminClients) {
                rankings = {
                    admin_client: window.currentStatsRankingData.adminClients || [],
                    reseller: window.currentStatsRankingData.sellers || [],
                    reseller_client: window.currentStatsRankingData.sellerClients || []
                };
            }

            if (!rankings) return false;

            const phone = getCurrentUserIdentifier();
            let name = '';
            if (typeof allClientProfiles !== 'undefined' && allClientProfiles[phone]) {
                name = (allClientProfiles[phone].name || '').toLowerCase().trim();
            }

            // 1. Revisar Top 3 Clientes Admin
            const topAdmin = (rankings.admin_client || []).slice(0, 3);
            for (const c of topAdmin) {
                const cP = String(c.phone || '').replace(/\D/g, '').replace(/^57/, '');
                if (phone && phone !== 'invitado' && cP === phone) return true;
                if (name && c.name && c.name.toLowerCase().trim() === name) return true;
            }

            // 2. Revisar Top 3 Clientes de Vendedores
            const topResClient = (rankings.reseller_client || []).slice(0, 3);
            for (const rc of topResClient) {
                const rcP = String(rc.phone || '').replace(/\D/g, '').replace(/^57/, '');
                if (phone && phone !== 'invitado' && rcP === phone) return true;
                if (name && rc.name && rc.name.toLowerCase().trim() === name) return true;
            }

            // 3. Revisar Top 3 Vendedores
            if (typeof isSellerMode !== 'undefined' && isSellerMode && typeof currentSellerName !== 'undefined') {
                const topRes = (rankings.reseller || []).slice(0, 3);
                for (const r of topRes) {
                    if (r.name && r.name.toLowerCase().trim() === currentSellerName.toLowerCase().trim()) return true;
                }
            }

            return false;
        } catch (e) {
            console.error("Error verificando Top 3 en Ruleta:", e);
            return false;
        }
    };

    /**
     * Efecto de sonido 'tick' sintetizado con Web Audio API
     */
    function playTickSound() {
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) audioCtx = new AudioContext();
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (audioCtx) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.04);
            }
        } catch (e) { }
    }


    /**
     * Parsea un premio para formatearlo en 2 líneas:
     * - Línea Superior: Nombre del servicio / producto / texto principal
     * - Línea Inferior: Descuento / beneficio (ej: 30% DCTO, ¡GRATIS!, etc.)
     */
    /**
     * Parsea y optimiza los textos de cada premio en 2 líneas perfectamente balanceadas
     * - Línea Superior: Servicio / Producto (ej: Netflix, Paramount, ViX, Crunchyroll)
     * - Línea Inferior: Descuento / Premio (ej: 11% DCTO, ¡GRATIS!, etc.)
     */
    function parsePrizeLines(premio, numSlices = 8) {
        if (!premio) return { lineaSuperior: '', lineaDescuento: '' };
        if (premio.textoSuperior && premio.descuentoAbajo) {
            return { lineaSuperior: premio.textoSuperior, lineaDescuento: premio.descuentoAbajo };
        }

        const lbl = (premio.label || '').trim();
        let servLimpio = (premio.servicio || '')
            .replace(/premium|estándar|estandar|fan|cuenta completa/gi, '')
            .trim();

        // Limpieza y abreviación inteligente para sectores densos (ruleta con muchos premios)
        if (/cualquier/i.test(servLimpio) || /cualquier/i.test(lbl)) {
            servLimpio = (numSlices >= 9) ? 'Cualquiera' : 'Cualquier Pantalla';
        } else if (/bono/i.test(servLimpio) || /bono/i.test(lbl)) {
            servLimpio = (numSlices >= 9) ? 'Bono' : 'Bono General';
        }

        let lineaSuperior = '';
        let lineaDescuento = '';

        if (premio.tipo === 'pantalla_gratis') {
            // En ruletas de 9+ sectores, usar el nombre directo del servicio sin "Pantalla" para que no se desborde
            if (numSlices >= 9) {
                lineaSuperior = servLimpio || 'Pantalla';
            } else {
                lineaSuperior = servLimpio ? `Pantalla ${servLimpio}` : 'Pantalla';
            }
            lineaDescuento = '¡GRATIS!';
        } else if (premio.tipo === 'descuento_servicio') {
            lineaSuperior = servLimpio || 'Pantalla';
            lineaDescuento = (premio.descuentoPorcentaje ? `${premio.descuentoPorcentaje}% DCTO` : 'DESCUENTO');
        } else if (premio.tipo === 'cupon_general') {
            lineaSuperior = servLimpio || ((numSlices >= 9) ? 'Bono' : 'Bono General');
            lineaDescuento = (premio.descuentoPorcentaje ? `${premio.descuentoPorcentaje}% DCTO` : '10% DCTO');
        } else if (premio.tipo === 'sin_premio') {
            lineaSuperior = 'Sigue';
            lineaDescuento = 'Intentando';
        } else {
            if (lbl.includes('DCTO')) {
                const parts = lbl.split(/DCTO/i);
                lineaDescuento = (parts[0] + 'DCTO').trim();
                lineaSuperior = parts[1].trim();
            } else if (lbl.toLowerCase().includes('gratis')) {
                lineaSuperior = lbl.replace(/gratis/gi, '').replace(/pantalla/gi, '').trim() || 'Pantalla';
                lineaDescuento = '¡GRATIS!';
            } else {
                const words = lbl.split(' ');
                if (words.length >= 2) {
                    lineaSuperior = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                    lineaDescuento = words.slice(Math.ceil(words.length / 2)).join(' ');
                } else {
                    lineaSuperior = lbl;
                    lineaDescuento = '';
                }
            }
        }

        // Truncar con elipsis si excede el largo seguro según la densidad de premios
        const maxLen = (numSlices >= 10) ? 12 : 15;
        if (lineaSuperior.length > maxLen) lineaSuperior = lineaSuperior.substring(0, maxLen - 1) + '…';
        if (lineaDescuento.length > maxLen) lineaDescuento = lineaDescuento.substring(0, maxLen - 1) + '…';

        return { lineaSuperior, lineaDescuento };
    }

    /**
     * Dibuja la ruleta en el Canvas
     */
    window.dibujarRuleta = function () {
        const canvas = document.getElementById('ruleta-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const config = window.getRuletaConfig();
        const premios = config.premios;
        const numSlices = premios.length;
        const arco = (2 * Math.PI) / numSlices;

        const width = canvas.width;
        const height = canvas.height;
        const center = width / 2;
        const radius = center - 16; // Margen para luces exteriores

        ctx.clearRect(0, 0, width, height);

        // Guardar estado y rotar según anguloActual
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(anguloActual);

        // Dibujar sectores
        for (let i = 0; i < numSlices; i++) {
            const anguloInicio = i * arco;
            const anguloFin = anguloInicio + arco;
            const premio = premios[i];

            // Relleno del sector
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, anguloInicio, anguloFin);
            ctx.closePath();
            ctx.fillStyle = premio.color || '#333';
            ctx.fill();

            // Borde entre sectores
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.stroke();

            // Texto de la etiqueta (2 renglones: Superior = Nombre/Servicio, Abajo = Descuento)
            ctx.save();
            ctx.rotate(anguloInicio + arco / 2);

            // Posición centrada a lo largo del sector (ligeramente más hacia el exterior donde el sector es más amplio)
            const rTexto = radius * (numSlices >= 10 ? 0.74 : 0.70);
            ctx.translate(rTexto, 0);
            ctx.rotate(Math.PI / 2); // Orientar a lo ancho del sector
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const { lineaSuperior, lineaDescuento } = parsePrizeLines(premio, numSlices);

            // Ancho máximo garantizado dentro del sector (deja margen de seguridad de 12% para evitar cualquier solapamiento)
            const anchoMaxSector = (2 * rTexto * Math.sin(arco / 2)) * 0.88;

            // Sombra para contraste y legibilidad impecable sobre cualquier color de fondo
            ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            // Si el sector se encuentra en la mitad inferior de la ruleta, rotar 180° para que las letras nunca queden de cabeza
            const anguloGlobal = (anguloActual + anguloInicio + arco / 2) % (2 * Math.PI);
            const anguloNorm = (anguloGlobal + 2 * Math.PI) % (2 * Math.PI);
            const isInvertido = (anguloNorm > 0.05 && anguloNorm < Math.PI - 0.05);

            if (isInvertido) {
                ctx.rotate(Math.PI);
            }

            // Calibrar tamaños de fuente y separación vertical dinámicamente según la cantidad de premios
            let fontSuperior = 'bold 12px Outfit, sans-serif';
            let fontDescuento = 'bold 11px Outfit, sans-serif';
            let yDist = 7.5;

            if (numSlices >= 12) {
                fontSuperior = (lineaSuperior.length > 9) ? 'bold 8.5px Outfit, sans-serif' : 'bold 9.5px Outfit, sans-serif';
                fontDescuento = 'bold 8.5px Outfit, sans-serif';
                yDist = 6;
            } else if (numSlices >= 9) {
                fontSuperior = (lineaSuperior.length > 9) ? 'bold 9px Outfit, sans-serif' : 'bold 10px Outfit, sans-serif';
                fontDescuento = 'bold 9px Outfit, sans-serif';
                yDist = 6.5;
            } else if (numSlices >= 7) {
                fontSuperior = (lineaSuperior.length > 10) ? 'bold 10.5px Outfit, sans-serif' : 'bold 11.5px Outfit, sans-serif';
                fontDescuento = 'bold 10.5px Outfit, sans-serif';
                yDist = 7;
            }

            // Para que la línea del servicio siempre esté arriba y el descuento abajo visualmente
            const ySuperior = isInvertido ? yDist : -yDist;
            const yDescuento = isInvertido ? -yDist : yDist;

            // Renglón 1: Texto en la parte superior (con ancho máximo para evitar desbordes)
            ctx.fillStyle = '#ffffff';
            ctx.font = fontSuperior;
            ctx.fillText(lineaSuperior, 0, ySuperior, anchoMaxSector);

            // Renglón 2: Descuento abajo del texto (con ancho máximo para evitar desbordes)
            if (lineaDescuento) {
                ctx.fillStyle = (premio.tipo === 'pantalla_gratis') ? '#4ade80' : '#fef08a';
                ctx.font = fontDescuento;
                ctx.fillText(lineaDescuento, 0, yDescuento, anchoMaxSector);
            }

            ctx.restore();
        }

        // Borde circular exterior dorado
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#fbbf24';
        ctx.stroke();

        // Luces LED alrededor del borde
        const numLuces = 24;
        const arcoLuz = (2 * Math.PI) / numLuces;
        for (let j = 0; j < numLuces; j++) {
            const luzAng = j * arcoLuz;
            const lx = Math.cos(luzAng) * (radius + 8);
            const ly = Math.sin(luzAng) * (radius + 8);
            ctx.beginPath();
            ctx.arc(lx, ly, 3.5, 0, 2 * Math.PI);
            ctx.fillStyle = (j % 2 === 0) ? '#fef08a' : '#ef4444';
            ctx.shadowColor = (j % 2 === 0) ? '#fef08a' : '#ef4444';
            ctx.shadowBlur = 6;
            ctx.fill();
        }

        ctx.restore();
    };


    /**
     * Algoritmo de Selección Ponderada por Probabilidades y Límite de Stock (Firebase)
     * Excluye premios agotados y selecciona el ganador basándose en el porcentaje de probabilidad configurado.
     */
    async function seleccionarPremioPonderado(premios) {
        let entregados = {};
        if (typeof db !== 'undefined') {
            try {
                const snap = await db.ref('storeConfig/ruletaStats/entregados').once('value');
                entregados = snap.val() || {};
            } catch (e) {
                console.warn("No se pudo leer ruletaStats/entregados:", e);
            }
        }

        const candidatos = [];
        for (let i = 0; i < premios.length; i++) {
            const p = premios[i];
            const pId = String(p.id != null ? p.id : i + 1);
            const gastados = parseInt(entregados[pId]) || 0;
            const maxStock = parseInt(p.stockMaximo) || 0; // 0 = ilimitado

            let peso = parseFloat(p.probabilidad);
            if (isNaN(peso) || peso < 0) peso = 10;

            // Si el premio tiene límite y ya se alcanzó o superó, está AGOTADO (peso = 0)
            if (maxStock > 0 && gastados >= maxStock) {
                peso = 0;
            }

            candidatos.push({
                index: i,
                premio: p,
                peso: peso,
                gastados: gastados,
                maxStock: maxStock,
                agotado: (maxStock > 0 && gastados >= maxStock)
            });
        }

        const pesoTotal = candidatos.reduce((acc, c) => acc + c.peso, 0);

        // Si todos los premios disponibles estuvieran agotados, caer en 'sin_premio'
        if (pesoTotal <= 0) {
            const sinPremioIdx = premios.findIndex(p => p.tipo === 'sin_premio');
            return sinPremioIdx !== -1 ? sinPremioIdx : 0;
        }

        let rand = Math.random() * pesoTotal;
        for (const c of candidatos) {
            if (c.peso <= 0) continue;
            if (rand < c.peso) {
                return c.index;
            }
            rand -= c.peso;
        }

        return candidatos[candidatos.length - 1].index;
    }

    /**
     * Calcula el premio ganador basándose en el índice obtenido o en el ángulo actual
     */
    function calcularPremioGanador(indicePredeterminado) {
        const config = window.getRuletaConfig();
        const configPremiosStreaming = config.premios;

        let indice;
        if (indicePredeterminado != null && configPremiosStreaming[indicePredeterminado]) {
            indice = indicePredeterminado;
        } else {
            const normalizado = (1.5 * Math.PI - (anguloActual % (2 * Math.PI)) + 4 * Math.PI) % (2 * Math.PI);
            const arco = (2 * Math.PI) / configPremiosStreaming.length;
            indice = Math.floor(normalizado / arco);
        }

        premioTemporal = configPremiosStreaming[indice];

        const resBox = document.getElementById("resultado-premio");
        const iconoEl = document.getElementById("icono-resultado");
        const nombreEl = document.getElementById("nombre-premio-ganado");
        const detalleEl = document.getElementById("detalle-precio-box");
        const btnEnviar = document.getElementById("btn-enviar-admin");
        const btnReintentar = document.getElementById("btn-seguir-girando");

        if (!resBox || !iconoEl || !nombreEl || !detalleEl) return;

        // Si no ganó nada (Sigue intentando): NO activar ni mostrar botón de pedir pantalla
        if (premioTemporal.tipo === "sin_premio") {
            iconoEl.textContent = "😢";
            nombreEl.textContent = "¡Sigue Intentando!";

            // Ocultar botón de enviar WhatsApp cuando no hay premio
            if (btnEnviar) {
                btnEnviar.style.display = "none";
            }

            const statsTemp = getEstadisticasUsuario();
            const intentosRestantesTemp = Math.max(0, config.intentosMaximosPorDia - statsTemp.intentosHoy);

            if (intentosRestantesTemp > 0) {
                detalleEl.innerHTML = `
                    <p style="margin: 0; color: #cbd5e1;">No obtuviste descuento en este giro.</p>
                    <p style="margin: 6px 0 0 0; color: #fbbf24; font-weight:700;">¡Aún te quedan ${intentosRestantesTemp} intento(s) hoy! Vuelve a probar tu suerte.</p>
                `;
            } else {
                detalleEl.innerHTML = `
                    <p style="margin: 0; color: #cbd5e1;">No obtuviste descuento en este giro.</p>
                    <p style="margin: 6px 0 0 0; color: #ef4444; font-weight:700;">Has completado tus ${config.intentosMaximosPorDia} giros de hoy. ¡Vuelve mañana por más oportunidades!</p>
                `;
            }
        }
        // Si ganó pantalla gratis: Activar botón para reclamar al WhatsApp del admin
        else if (premioTemporal.tipo === "pantalla_gratis") {
            if (btnEnviar) {
                btnEnviar.style.display = "block";
                btnEnviar.textContent = "🎁 Reclamar mi Pantalla Gratis al Admin";
                btnEnviar.style.background = "#10b981";
            }
            iconoEl.textContent = "🎉";
            nombreEl.textContent = "¡PANTALLA TOTALMENTE GRATIS!";
            detalleEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom:4px;"><span>Servicio:</span> <b>${premioTemporal.servicio}</b></div>
                <div style="display: flex; justify-content: space-between; color: #4ade80; font-size:1.05rem;"><span>Total a pagar:</span> <b>$0 COP</b></div>
            `;
        }
        // Si ganó cupón general: Activar botón
        else if (premioTemporal.tipo === "cupon_general") {
            if (btnEnviar) {
                btnEnviar.style.display = "block";
                btnEnviar.textContent = "📲 Aceptar Cupón y Enviar al Admin";
                btnEnviar.style.background = "#8b5cf6";
            }
            iconoEl.textContent = "🎟️";
            nombreEl.textContent = `¡Ganaste ${premioTemporal.label}!`;
            detalleEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom:4px;"><span>Beneficio:</span> <b>${premioTemporal.descuentoPorcentaje}% de Descuento</b></div>
                <div style="display: flex; justify-content: space-between; color: #fbbf24;"><span>Aplica en:</span> <b>Cualquier Pantalla que elijas</b></div>
            `;
        }
        // Si ganó descuento calculado: Activar botón
        else {
            if (btnEnviar) {
                btnEnviar.style.display = "block";
                btnEnviar.textContent = "📲 Aceptar Descuento y Enviar Ticket";
                btnEnviar.style.background = "#22c55e";
            }
            const rebaja = (premioTemporal.precioNormal * premioTemporal.descuentoPorcentaje) / 100;
            const finalPagar = premioTemporal.precioNormal - rebaja;

            iconoEl.textContent = "🔥";
            nombreEl.textContent = `¡Ganaste ${premioTemporal.label}!`;
            detalleEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom:3px;"><span>Servicio:</span> <b>${premioTemporal.servicio}</b></div>
                <div style="display: flex; justify-content: space-between; margin-bottom:3px;"><span>Precio normal:</span> <s>${premioTemporal.precioNormal.toLocaleString("es-CO")}</s></div>
                <div style="display: flex; justify-content: space-between; color: #fbbf24; margin-bottom:3px;"><span>Descuento:</span> -${premioTemporal.descuentoPorcentaje}% (-${rebaja.toLocaleString("es-CO")})</div>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.15); margin: 6px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 15px; color: #4ade80;"><span>Total a transferir:</span> <b>${finalPagar.toLocaleString("es-CO")} COP</b></div>
            `;
        }

        // Comprobar intentos restantes
        const stats = getEstadisticasUsuario();
        const intentosRestantes = Math.max(0, config.intentosMaximosPorDia - stats.intentosHoy);
        const intentosBtnEl = document.getElementById("intentos-left-btn");
        if (intentosBtnEl) intentosBtnEl.textContent = intentosRestantes;

        if (btnReintentar) {
            btnReintentar.style.display = (intentosRestantes > 0 && !stats.premioAceptado) ? "block" : "none";
        }

        resBox.style.display = "block";
    }

    /**
     * Dispara la animación de giro físico de la ruleta
     */
    window.girarRuleta = async function () {
        if (isGirando) return;

        // 1. Verificar si está en el Top 3
        const inTop3 = await window.isUserInTop3Navidad();
        if (inTop3) {
            window.mostrarAlertaRuleta({
                icono: "👑",
                titulo: "¡Ya estás en el Podio Navideño!",
                mensaje: "¡Felicidades! Tus premios mayores ya están garantizados en los 3 primeros lugares para el 25 de diciembre.<br><br>Esta ruleta es un beneficio exclusivo para los clientes fuera del Top 3.",
                botonTexto: "¡Excelente, gracias!"
            });
            return;
        }

        // 2. Identificar teléfono del usuario y verificar antifraude en Firebase
        const config = window.getRuletaConfig();
        let phone = getCurrentUserIdentifier();

        if (phone === 'invitado') {
            const enteredName = prompt("👤 Para girar la ruleta, por favor ingresa tu Nombre Completo:");
            if (enteredName && enteredName.trim()) {
                localStorage.setItem('dpc_ruleta_guest_name', enteredName.trim());
            }
            const entered = prompt("📱 Ahora ingresa tu número de WhatsApp (10 dígitos):");
            if (!entered) return;
            const clean = entered.replace(/\D/g, '').replace(/^57/, '');
            if (clean.length < 10) {
                window.mostrarAlertaRuleta({
                    icono: "📱",
                    titulo: "Número Inválido",
                    mensaje: "Por favor ingresa un número de WhatsApp válido de al menos 10 dígitos para registrar tus giros.",
                    botonTexto: "Corregir número"
                });
                return;
            }
            phone = clean;
            localStorage.setItem('dpc_ruleta_guest_phone', clean);
            // Re-vincular listener de auto-reset y sincronizar giros con el teléfono identificado
            setupRuletaAutoResetListener();
            await sincronizarIntentosConNube();
        }

        // Consultar intentos antifraude registrados en la nube (evita trucos de modo incógnito o borrar cookies)
        const hoy = getTodayKey();
        if (typeof db !== 'undefined' && phone && phone !== 'invitado') {
            try {
                const snap = await db.ref(`clientProfiles/_ruleta_logs/${hoy}/${phone}`).once('value');
                const logData = snap.val();
                if (logData) {
                    if (logData.aceptoPremio) {
                        window.mostrarAlertaRuleta({
                            icono: "🎉",
                            titulo: "¡Premio de Hoy Ya Reservado!",
                            mensaje: "Ya reclamaste tu premio de hoy con tu número de WhatsApp.<br><br>🎁 Mañana podrás volver a participar por nuevos premios.",
                            botonTexto: "¡Entendido!"
                        });
                        return;
                    }
                    if (logData.giros >= config.intentosMaximosPorDia) {
                        window.mostrarAlertaRuleta({
                            icono: "⏳",
                            titulo: "Límite Diario Alcanzado",
                            mensaje: `Has alcanzado el límite de <strong>${config.intentosMaximosPorDia} giros diarios</strong> registrados para tu número de WhatsApp.<br><br>✨ ¡Vuelve mañana por más oportunidades!`,
                            botonTexto: "¡Entendido!"
                        });
                        return;
                    }
                }
            } catch (e) {
                console.warn("Error al consultar ruleta_logs en Firebase:", e);
            }
        }

        const stats = getEstadisticasUsuario();
        if (stats.premioAceptado) {
            window.mostrarAlertaRuleta({
                icono: "🎉",
                titulo: "¡Premio de Hoy Ya Reclamado!",
                mensaje: "Ya reclamaste tu premio de hoy.<br><br>🎁 Mañana podrás girar nuevamente la ruleta de la suerte.",
                botonTexto: "¡Entendido!"
            });
            return;
        }
        if (stats.intentosHoy >= config.intentosMaximosPorDia) {
            window.mostrarAlertaRuleta({
                icono: "⏳",
                titulo: "¡Giros Diarios Completados!",
                mensaje: `Has alcanzado el límite de <strong>${config.intentosMaximosPorDia} giros por hoy</strong>.<br><br>🎁 ¡Vuelve mañana para disfrutar de 3 nuevas oportunidades de ganar pantallas y descuentos exclusivos!`,
                botonTexto: "¡Entendido, volveré mañana!"
            });
            return;
        }

        // Ocultar caja de resultado previo
        const resBox = document.getElementById("resultado-premio");
        if (resBox) resBox.style.display = "none";

        // Registrar intento localmente y en Firebase Realtime Database
        stats.intentosHoy += 1;
        guardarEnStorage(stats);
        actualizarUIIntentos();

        if (typeof db !== 'undefined' && phone && phone !== 'invitado') {
            const clienteNombre = (typeof allClientProfiles !== 'undefined' && allClientProfiles[phone] && allClientProfiles[phone].name)
                ? allClientProfiles[phone].name
                : (localStorage.getItem('dpc_ruleta_guest_name') || 'Cliente');

            db.ref(`clientProfiles/_ruleta_logs/${hoy}/${phone}`).transaction(curr => {
                const c = curr || {};
                return {
                    ...c,
                    phone: phone,
                    nombre: c.nombre || clienteNombre,
                    giros: (parseInt(c.giros) || 0) + 1,
                    ultimaActividad: Date.now()
                };
            }).catch(console.error);
        }

        isGirando = true;
        const btnSpin = document.getElementById('ruleta-spin-btn');
        if (btnSpin) btnSpin.disabled = true;

        // Seleccionar premio ganador según probabilidades y stock disponible en Firebase
        const indiceGanador = await seleccionarPremioPonderado(config.premios);

        const numSlices = config.premios.length;
        const arco = (2 * Math.PI) / numSlices;

        // Calcular ángulo exacto para que el sector ganador se detenga bajo el puntero dorado (a 270° o 1.5 * PI)
        const anguloMedio = (indiceGanador + 0.5) * arco;
        const jitter = (Math.random() - 0.5) * (arco * 0.4); // Variación sutil dentro del sector
        const targetNorm = (anguloMedio + jitter + 2 * Math.PI) % (2 * Math.PI);
        const targetAngleModulo = (1.5 * Math.PI - targetNorm + 4 * Math.PI) % (2 * Math.PI);

        // De 5 a 8 vueltas completas
        const vueltasCompletas = (5 + Math.floor(Math.random() * 4)) * (2 * Math.PI);
        const currentMod = (anguloActual % (2 * Math.PI));
        let diff = targetAngleModulo - currentMod;
        if (diff < 0) diff += 2 * Math.PI;

        const anguloObjetivo = anguloActual + vueltasCompletas + diff;

        const duracionTotal = 4800; // 4.8 segundos
        const tiempoInicio = performance.now();
        const anguloInicial = anguloActual;

        let ultimoSectorSonido = -1;

        function animarGiro(tiempoActual) {
            const transcurrido = tiempoActual - tiempoInicio;
            const progreso = Math.min(transcurrido / duracionTotal, 1);

            // Función de desaceleración suave (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progreso, 3);
            anguloActual = anguloInicial + (anguloObjetivo - anguloInicial) * easeOut;

            // Reproducir tick sonoro cada vez que pasa un sector
            const sectorActual = Math.floor((anguloActual % (2 * Math.PI)) / arco);
            if (sectorActual !== ultimoSectorSonido) {
                playTickSound();
                ultimoSectorSonido = sectorActual;
            }

            window.dibujarRuleta();

            if (progreso < 1) {
                requestAnimationFrame(animarGiro);
            } else {
                isGirando = false;
                if (btnSpin) btnSpin.disabled = false;

                // Mostrar tarjeta de resultado con el premio ganador obtenido
                calcularPremioGanador(indiceGanador);

                // Incrementar contador de stock entregado en Firebase si es premio con stock
                const pGanador = config.premios[indiceGanador];
                if (pGanador && pGanador.tipo !== 'sin_premio' && typeof db !== 'undefined') {
                    const pId = String(pGanador.id != null ? pGanador.id : indiceGanador + 1);
                    db.ref(`storeConfig/ruletaStats/entregados/${pId}`).transaction(curr => {
                        return (parseInt(curr) || 0) + 1;
                    }).catch(console.error);
                }

                // Registrar giro en historial de Firebase
                if (typeof db !== 'undefined') {
                    registrarGiroRuletaHistory(pGanador, indiceGanador, phone);
                }
            }
        }

        requestAnimationFrame(animarGiro);
    };

    /**
     * Obtiene el nombre real del cliente buscando en perfiles, ventas de Firebase o rankings
     */
    
    let ultimoGiroRuletaKey = null;

    /**
     * Registra cada giro individual de la ruleta en Firebase para trazabilidad e impacto estadístico
     */
    async function registrarGiroRuletaHistory(pGanador, indiceGanador, phoneOverride) {
        if (typeof db === 'undefined') return;
        try {
            const phone = phoneOverride || getCurrentUserIdentifier();
            const isSeller = (typeof isSellerMode !== 'undefined' && isSellerMode) || localStorage.getItem('isSellerMode') === 'true';
            const sellerName = (typeof currentSellerName !== 'undefined' && currentSellerName) || localStorage.getItem('sellerName') || '';

            let nombre = '';
            let rol = 'Invitado';
            let vendedorAsignado = '';

            if (isSeller && sellerName) {
                rol = 'Vendedor';
                nombre = sellerName;
            } else if (phone && phone !== 'invitado') {
                nombre = await obtenerNombreCliente(phone);
                // Determinar si es cliente de vendedor o directo
                if (typeof allClientSalesMap !== 'undefined' && allClientSalesMap[phone]) {
                    const sKeys = Object.keys(allClientSalesMap[phone]);
                    if (sKeys.length > 0) {
                        const lastSale = allClientSalesMap[phone][sKeys[sKeys.length - 1]];
                        if (lastSale && lastSale.sellerName && lastSale.sellerName !== 'Página Web Oficial' && lastSale.sellerName !== 'Admin') {
                            rol = 'Cliente de Vendedor';
                            vendedorAsignado = lastSale.sellerName;
                        } else {
                            rol = 'Cliente Directo';
                        }
                    }
                } else if (typeof globalSellerSalesDataStore !== 'undefined') {
                    for (const s of Object.keys(globalSellerSalesDataStore)) {
                        const sales = globalSellerSalesDataStore[s] || {};
                        for (const sid of Object.keys(sales)) {
                            const sale = sales[sid];
                            if (sale && String(sale.clientPhone || '').replace(/\D/g, '').endsWith(phone)) {
                                rol = 'Cliente de Vendedor';
                                vendedorAsignado = s;
                                if (!nombre && sale.clientName) nombre = sale.clientName;
                                break;
                            }
                        }
                        if (vendedorAsignado) break;
                    }
                }
                if (rol === 'Invitado') {
                    rol = 'Cliente Directo';
                }
            }

            if (!nombre || nombre.toLowerCase() === 'cliente') {
                nombre = localStorage.getItem('dpc_ruleta_guest_name') || (isSeller ? sellerName : (phone !== 'invitado' ? ('Cliente ' + phone.slice(-4)) : 'Invitado'));
            }

            const hoy = getTodayKey();
            const spinKey = db.ref('clientProfiles/_ruleta_giros_history').push().key;
            ultimoGiroRuletaKey = spinKey;

            const spinRecord = {
                id: spinKey,
                timestamp: Date.now(),
                fecha: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
                fechaKey: hoy,
                phone: phone || 'invitado',
                nombre: nombre,
                rol: rol, // 'Vendedor' | 'Cliente de Vendedor' | 'Cliente Directo' | 'Invitado'
                vendedorAsignado: vendedorAsignado || '',
                premioId: pGanador.id != null ? pGanador.id : (indiceGanador + 1),
                premioLabel: pGanador.label || pGanador.servicio || 'Premio',
                servicio: pGanador.servicio || '',
                tipo: pGanador.tipo || 'descuento',
                descuentoPorcentaje: pGanador.descuentoPorcentaje || 0,
                precioNormal: pGanador.precioNormal || 0,
                precioFinal: (pGanador.tipo === 'pantalla_gratis') ? 0 : Math.max(0, (pGanador.precioNormal || 0) - Math.round(((pGanador.precioNormal || 0) * (pGanador.descuentoPorcentaje || 0)) / 100)),
                color: pGanador.color || '#ffb703',
                estado: pGanador.tipo === 'sin_premio' ? 'sin_premio' : 'no_reclamado',
                aceptoPremio: false,
                ticketId: null,
                codigoTicket: null
            };

            await db.ref('clientProfiles/_ruleta_giros_history/' + spinKey).set(spinRecord);
        } catch (e) {
            console.warn('[RULETA] Error registrando giro en Firebase:', e);
        }
    }

    async function obtenerNombreCliente(phone) {
        const cleanPhone = String(phone || '').replace(/\D/g, '').replace(/^57/, '');

        // 1. Verificar si hay un nombre guardado en localStorage
        const storedName = localStorage.getItem('dpc_ruleta_guest_name');
        if (storedName && storedName.trim() && storedName.trim().toLowerCase() !== 'cliente') {
            return storedName.trim();
        }

        if (!cleanPhone || cleanPhone === 'invitado') return '';

        // 2. Buscar en allClientProfiles si está en memoria
        if (typeof allClientProfiles !== 'undefined' && allClientProfiles[cleanPhone] && allClientProfiles[cleanPhone].name) {
            const n = allClientProfiles[cleanPhone].name.trim();
            if (n && n.toLowerCase() !== 'cliente') return n;
        }

        // 3. Buscar en los rankings navideños calculados
        if (typeof loadNavRankings === 'function') {
            try {
                const rankings = await loadNavRankings();
                const allRankClients = [
                    ...(rankings.admin_client || []),
                    ...(rankings.reseller_client || [])
                ];
                const found = allRankClients.find(c => c.phone === cleanPhone || c.phone === '57' + cleanPhone);
                if (found && found.name && found.name.toLowerCase() !== 'cliente') {
                    return found.name.trim();
                }
            } catch (e) { }
        }

        // 4. Buscar en Firebase en clientSales
        if (typeof db !== 'undefined') {
            try {
                const sSnap = await db.ref(`clientSales/${cleanPhone}`).once('value');
                const sales = sSnap.val();
                if (sales) {
                    for (const k of Object.keys(sales)) {
                        const s = sales[k];
                        if (s && s.clientName && s.clientName.trim() && s.clientName.trim().toLowerCase() !== 'cliente') {
                            return s.clientName.trim();
                        }
                    }
                }
                const sSnap57 = await db.ref(`clientSales/57${cleanPhone}`).once('value');
                const sales57 = sSnap57.val();
                if (sales57) {
                    for (const k of Object.keys(sales57)) {
                        const s = sales57[k];
                        if (s && s.clientName && s.clientName.trim() && s.clientName.trim().toLowerCase() !== 'cliente') {
                            return s.clientName.trim();
                        }
                    }
                }
            } catch (e) { }
        }

        return '';
    }

    /**
     * Acción de Reclamar Premio por WhatsApp
     */
    window.reclamarPremioWhatsapp = async function () {
        if (!premioTemporal) return;

        const stats = getEstadisticasUsuario();
        stats.premioAceptado = true;
        stats.ultimoPremio = premioTemporal;
        guardarEnStorage(stats);

        const config = window.getRuletaConfig();

        let telefono = getCurrentUserIdentifier();
        if (telefono === 'invitado') {
            const enteredPhone = prompt("📱 Ingresa tu número de WhatsApp para entregarte tu premio:");
            if (enteredPhone) {
                telefono = enteredPhone.replace(/\D/g, '').replace(/^57/, '');
                localStorage.setItem('dpc_ruleta_guest_phone', telefono);
            }
        }

        // Obtener el nombre real del cliente
        let nombre = await obtenerNombreCliente(telefono);

        // Si aún no tenemos el nombre o dice 'Cliente', solicitarlo al usuario
        if (!nombre || nombre.toLowerCase() === 'cliente') {
            const inputNombre = prompt("👤 ¡Felicidades por tu premio! Ingresa tu Nombre y Apellido para tu Ticket:");
            if (inputNombre && inputNombre.trim()) {
                nombre = inputNombre.trim();
                localStorage.setItem('dpc_ruleta_guest_name', nombre);
            } else {
                nombre = 'Cliente Ganador';
            }
        }

        const usuarioSesion = { nombre, telefono };
        generarYEnviarTicket(premioTemporal, usuarioSesion, config.whatsappAdmin);
        window.cerrarModalRuleta();
    };

    /**
     * Acción de reintentar giro si aún quedan intentos
     */
    window.reintentarGiro = function () {
        const resBox = document.getElementById("resultado-premio");
        if (resBox) resBox.style.display = "none";
        if (ultimoGiroRuletaKey && typeof db !== 'undefined') {
            db.ref(`clientProfiles/_ruleta_giros_history/${ultimoGiroRuletaKey}`).once('value').then(snap => {
                const val = snap.val();
                if (val && val.estado === 'no_reclamado') {
                    db.ref(`clientProfiles/_ruleta_giros_history/${ultimoGiroRuletaKey}/estado`).set('descartado_reintento').catch(() => {});
                }
            }).catch(() => {});
        }
    };

    /**
     * Generador de Tickets y Enlace de WhatsApp
     */
    function generarYEnviarTicket(premio, usuario, adminPhone = WHATSAPP_ADMIN) {
        const fecha = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
        const ticketIdNum = "ST-" + Math.floor(100000 + Math.random() * 900000);
        const telCliente = String(usuario.telefono || 'Sin registrar').replace(/\D/g, '').replace(/^57/, '');
        const firma = window.generarFirmaSeguridad(ticketIdNum, premio.descuentoPorcentaje || 0, telCliente);
        const codigoTicket = `${ticketIdNum}-${firma}`;
        let mensaje = "";

        // Registrar ticket auténtico en Firebase Realtime Database para validación inmediata
        if (typeof db !== 'undefined') {
            const ticketPayload = {
                ticketId: ticketIdNum,
                codigoCompleto: codigoTicket,
                firma: firma,
                premio: premio,
                usuario: usuario,
                fecha: fecha,
                timestamp: Date.now()
            };
            db.ref(`clientProfiles/_ruleta_tickets/${ticketIdNum}`).set(ticketPayload).catch(console.error);
            db.ref(`ruleta_tickets/${ticketIdNum}`).set(ticketPayload).catch(() => {});

            if (ultimoGiroRuletaKey) {
                db.ref(`clientProfiles/_ruleta_giros_history/${ultimoGiroRuletaKey}`).update({
                    estado: 'reclamado',
                    aceptoPremio: true,
                    ticketId: ticketIdNum,
                    codigoTicket: codigoTicket,
                    reclamadoAt: Date.now(),
                    reclamadoFecha: fecha,
                    nombre: usuario.nombre || 'Cliente',
                    phone: telCliente
                }).catch(console.error);
            }

            // Bloquear giros adicionales en la nube para este teléfono
            if (telCliente && telCliente.length >= 10) {
                const hoy = getTodayKey();
                db.ref(`clientProfiles/_ruleta_logs/${hoy}/${telCliente}`).update({
                    nombre: usuario.nombre || 'Cliente',
                    phone: telCliente,
                    aceptoPremio: true,
                    ultimoTicket: ticketIdNum,
                    codigoCompleto: codigoTicket,
                    ultimoPremio: premio.label || premio.servicio,
                    ultimaActividad: Date.now()
                }).catch(console.error);
            }
        }

        // CASO 1: NO GANÓ NADA (Sigue intentando)
        if (premio.tipo === "sin_premio") {
            mensaje =
                `🎰 *STREAMING DPC - RESULTADO RULETA* 🎰\n` +
                `---------------------------------------\n` +
                `Hola Admin, giré la ruleta navideña pero no tuve suerte:\n` +
                `😢 *Resultado:* Sigue intentando.\n\n` +
                `Quiero adquirir una pantalla normal.\n` +
                `👤 *Cliente:* ${usuario.nombre || "Cliente"}\n` +
                `📱 *Teléfono:* ${usuario.telefono || "Sin registrar"}\n` +
                `⏰ *Fecha:* ${fecha}\n` +
                `---------------------------------------\n` +
                `💳 *MEDIOS DE PAGO DISPONIBLES:*\n` +
                `• Nequi o Daviplata: *3155182545*\n` +
                `• Llave Nequi: *@NEQUICEC36*\n` +
                `• Llave Daviplata: *@PLATA3155182545*\n` +
                `• Llave Nu: *@CMA736*\n` +
                `• Llave Be: *@BE346516*\n` +
                `---------------------------------------\n` +
                `Adjunto mi comprobante para que me entregues la pantalla.`;
        }
        // CASO 2: GANÓ PANTALLA GRATIS
        else if (premio.tipo === "pantalla_gratis") {
            mensaje =
                `🎟️ *TICKET DE PREMIO - STREAMING DPC* 🎟️\n` +
                `*N° Ticket:* #${ticketIdNum}\n*🔒 Código de Validación:* #${codigoTicket}\n` +
                `---------------------------------------\n` +
                `🎉 *¡GANÉ UNA PANTALLA DE REGALO!*\n` +
                `📺 *Servicio:* ${premio.servicio}\n` +
                `💰 *Valor normal:* $${(premio.precioNormal || 0).toLocaleString("es-CO")} COP\n` +
                `🎁 *Descuento aplicado:* 100% (GRATIS)\n` +
                `💵 *TOTAL A PAGAR:* $0 COP\n` +
                `---------------------------------------\n` +
                `👤 *Ganador:* ${usuario.nombre || "Cliente"}\n` +
                `📱 *Teléfono:* ${usuario.telefono || "Sin registrar"}\n` +
                `⏰ *Fecha:* ${fecha}\n` +
                `---------------------------------------\n` +
                `Solicito la entrega y clave de mi perfil asignado. ¡Muchas gracias!`;
        }
        // CASO 3: GANÓ DESCUENTO DIRECTO EN PANTALLA
        else if (premio.tipo === "descuento_servicio") {
            const valorDescuento = ((premio.precioNormal || 0) * (premio.descuentoPorcentaje || 0)) / 100;
            const totalPagar = (premio.precioNormal || 0) - valorDescuento;

            mensaje =
                `🎟️ *TICKET DE DESCUENTO - STREAMING DPC* 🎟️\n` +
                `*N° Ticket:* #${ticketIdNum}\n*🔒 Código de Validación:* #${codigoTicket}\n` +
                `---------------------------------------\n` +
                `🎯 *Premio obtenido:* ${premio.label}\n` +
                `📺 *Servicio:* ${premio.servicio}\n` +
                `💵 *Precio Habitual:* $${(premio.precioNormal || 0).toLocaleString("es-CO")} COP\n` +
                `🏷️ *Descuento:* -${premio.descuentoPorcentaje}% (-$${valorDescuento.toLocaleString("es-CO")} COP)\n` +
                `🔥 *TOTAL A TRANSFERIR:* $${totalPagar.toLocaleString("es-CO")} COP\n` +
                `---------------------------------------\n` +
                `👤 *Cliente:* ${usuario.nombre || "Cliente"}\n` +
                `📱 *Teléfono:* ${usuario.telefono || "Sin registrar"}\n` +
                `⏰ *Fecha:* ${fecha}\n` +
                `---------------------------------------\n` +
                `💳 *DATOS PARA TRANSFERIR:*\n` +
                `• Nequi o Daviplata: *3155182545*\n` +
                `• Llave Nequi: *@NEQUICEC36*\n` +
                `• Llave Daviplata: *@PLATA3155182545*\n` +
                `• Llave Nu: *@CMA736*\n` +
                `• Llave Be: *@BE346516*\n` +
                `---------------------------------------\n` +
                `Ya realizo el pago y te envío el comprobante por aquí para la entrega.`;
        }
        // CASO 4: CUPÓN GENERAL
        else if (premio.tipo === "cupon_general") {
            mensaje =
                `🎟️ *TICKET CUPÓN GENERAL - STREAMING DPC* 🎟️\n` +
                `*N° Ticket:* #${ticketIdNum}\n*🔒 Código de Validación:* #${codigoTicket}\n` +
                `---------------------------------------\n` +
                `🎯 *Premio:* ${premio.label}\n` +
                `🏷️ *Beneficio:* ${premio.descuentoPorcentaje}% de descuento en la pantalla que elija.\n` +
                `👤 *Cliente:* ${usuario.nombre || "Cliente"}\n` +
                `📱 *Teléfono:* ${usuario.telefono || "Sin registrar"}\n` +
                `⏰ *Fecha:* ${fecha}\n` +
                `---------------------------------------\n` +
                `💳 *MEDIOS DE PAGO:*\n` +
                `• Nequi / Daviplata: *3155182545*\n` +
                `• Llave Nequi: *@NEQUICEC36*\n` +
                `• Llave Daviplata: *@PLATA3155182545*\n` +
                `• Llave Nu: *@CMA736*\n` +
                `• Llave Be: *@BE346516*\n` +
                `---------------------------------------\n` +
                `Admin, confírmame el valor final de la pantalla que deseo para transferirte.`;
        }

        const cleanWa = String(adminPhone).replace(/\D/g, '');
        const targetWa = (cleanWa.length === 10 && cleanWa.startsWith('3')) ? ('57' + cleanWa) : cleanWa;
        const urlWhatsapp = `https://api.whatsapp.com/send?phone=${targetWa}&text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsapp, "_blank");
    }

    /**
     * Actualiza la UI de intentos e identificación en el modal
     */

    /**
     * Controla la visibilidad del botón "Resetear Giros" según la configuración del Administrador
     */
    function actualizarVisibilidadBotonReset() {
        const btnReset = document.getElementById('ruleta-btn-reset-admin');
        if (!btnReset) return;

        const config = window.getRuletaConfig();
        const isEnabled = config.resetButtonEnabled === true;
        const target = (config.resetButtonTarget || '').trim().toLowerCase();

        if (!isEnabled) {
            btnReset.style.display = 'none';
            return;
        }

        const isAdmin = (typeof window.isUserAdmin === 'function' && window.isUserAdmin()) || localStorage.getItem('adminLoggedIn') === 'true';
        const isSeller = (typeof isSellerMode !== 'undefined' && isSellerMode) || localStorage.getItem('isSellerMode') === 'true';
        const currentSeller = ((typeof currentSellerName !== 'undefined' && currentSellerName) || localStorage.getItem('sellerName') || '').toLowerCase().trim();
        const currentPhone = getCurrentUserIdentifier().toLowerCase();

        let show = false;
        if (!target || target === 'todos' || target === 'all') {
            show = true;
        } else if (target === 'admin') {
            show = isAdmin;
        } else {
            if (isSeller && currentSeller && (currentSeller.includes(target) || target.includes(currentSeller))) {
                show = true;
            } else if (currentPhone && currentPhone !== 'invitado' && (currentPhone.includes(target) || target.includes(currentPhone))) {
                show = true;
            } else if (isAdmin) {
                show = true;
            }
        }

        btnReset.style.display = show ? 'inline-flex' : 'none';
    }

    function actualizarUIIntentos() {
        const config = window.getRuletaConfig();
        const stats = getEstadisticasUsuario();
        const restantes = Math.max(0, config.intentosMaximosPorDia - stats.intentosHoy);

        const badgeEl = document.getElementById('ruleta-intentos-badge');
        if (badgeEl) {
            let dots = '';
            for (let i = 0; i < config.intentosMaximosPorDia; i++) {
                dots += (i < restantes) ? '🟢 ' : '⚪ ';
            }
            badgeEl.innerHTML = `${dots} <strong>${restantes}/${config.intentosMaximosPorDia}</strong> disponibles hoy`;
        }

        const btnSpin = document.getElementById('ruleta-spin-btn');
        if (btnSpin) {
            if (stats.premioAceptado || restantes <= 0) {
                btnSpin.disabled = true;
            } else if (!isGirando) {
                btnSpin.disabled = false;
            }
        }
        actualizarVisibilidadBotonReset();
    }

    /**
     * Abre el modal de la ruleta y prepara el canvas
     */
    window.openRuletaModal = async function () {
        const modal = document.getElementById('ruleta-modal');
        if (!modal) return;

        const config = window.getRuletaConfig();
        if (!config.enabled) {
            window.mostrarAlertaRuleta({
                icono: "🎰",
                titulo: "Promoción en Pausa",
                mensaje: "La Ruleta de la Suerte no se encuentra habilitada en este momento.<br><br>¡Te esperamos en las próximas promociones de fin de semana!",
                botonTexto: "¡Entendido!"
            });
            return;
        }

        modal.style.display = 'flex';

        // Comprobar si el usuario está en el Top 3
        const inTop3 = await window.isUserInTop3Navidad();
        const top3Box = document.getElementById('ruleta-top3-box');
        const wheelWrap = document.getElementById('ruleta-wheel-wrap');
        const resBox = document.getElementById('resultado-premio');
        if (resBox) resBox.style.display = 'none';

        if (inTop3) {
            if (top3Box) top3Box.style.display = 'flex';
            if (wheelWrap) wheelWrap.style.opacity = '0.4';
            const btnSpin = document.getElementById('ruleta-spin-btn');
            if (btnSpin) btnSpin.disabled = true;
        } else {
            if (top3Box) top3Box.style.display = 'none';
            if (wheelWrap) wheelWrap.style.opacity = '1';
        }

        setupRuletaAutoResetListener();
        await sincronizarIntentosConNube();
        actualizarVisibilidadBotonReset();
        actualizarUIIntentos();
        window.dibujarRuleta();
    };

    /**
     * Cierra el modal de la ruleta
     */
    window.cerrarModalRuleta = function () {
        const modal = document.getElementById('ruleta-modal');
        if (modal) modal.style.display = 'none';
        const resBox = document.getElementById('resultado-premio');
        if (resBox) resBox.style.display = 'none';
    };


    /**
     * Muestra una alerta estilizada y profesional para la Ruleta de la Suerte
     */
    window.mostrarAlertaRuleta = function ({
        titulo = "Ruleta de la Suerte",
        mensaje = "",
        icono = "🎰",
        botonTexto = "¡Entendido!"
    }) {
        let modal = document.getElementById('ruleta-custom-alert-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'ruleta-custom-alert-modal';
            modal.className = 'ruleta-alert-overlay';
            modal.innerHTML = `
                <div class="ruleta-alert-card">
                    <span class="ruleta-alert-close" onclick="cerrarAlertaRuleta()">&times;</span>
                    <div id="ruleta-alert-icon" class="ruleta-alert-icon">🎰</div>
                    <h3 id="ruleta-alert-title" class="ruleta-alert-title">Ruleta de la Suerte</h3>
                    <p id="ruleta-alert-desc" class="ruleta-alert-desc"></p>
                    <button type="button" id="ruleta-alert-btn" class="ruleta-alert-confirm-btn" onclick="cerrarAlertaRuleta()">
                        ¡Entendido!
                    </button>
                </div>
            `;
            document.body.appendChild(modal);

            // Cerrar al hacer clic fuera de la tarjeta
            modal.addEventListener('click', (e) => {
                if (e.target === modal) window.cerrarAlertaRuleta();
            });
        }

        const iconEl = document.getElementById('ruleta-alert-icon');
        const titleEl = document.getElementById('ruleta-alert-title');
        const descEl = document.getElementById('ruleta-alert-desc');
        const btnEl = document.getElementById('ruleta-alert-btn');

        if (iconEl) iconEl.textContent = icono;
        if (titleEl) titleEl.textContent = titulo;
        if (descEl) descEl.innerHTML = mensaje;
        if (btnEl) btnEl.textContent = botonTexto;

        modal.style.display = 'flex';
    };

    window.cerrarAlertaRuleta = function () {
        const modal = document.getElementById('ruleta-custom-alert-modal');
        if (modal) modal.style.display = 'none';
    };

    /**
     * Limpia todas las estadísticas de ruleta en localStorage y actualiza la UI
     */
    function limpiarStatsLocalesRuleta() {
        try {
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('dpc_ruleta_stats_')) {
                    localStorage.removeItem(k);
                }
            });
        } catch (e) {}

        const resBox = document.getElementById("resultado-premio");
        if (resBox) resBox.style.display = "none";
        const btnSpin = document.getElementById('ruleta-spin-btn');
        if (btnSpin) btnSpin.disabled = false;

        actualizarUIIntentos();
    }

    /**
     * Sincroniza en tiempo real los giros locales con Firebase
     */
    async function sincronizarIntentosConNube() {
        if (typeof db === 'undefined') return;
        const hoy = getTodayKey();
        const myId = getCurrentUserIdentifier();
        const guestPhone = (localStorage.getItem('dpc_ruleta_guest_phone') || '').replace(/\D/g, '').replace(/^57/, '');
        const clientPhone = (localStorage.getItem('clientPhone') || '').replace(/\D/g, '').replace(/^57/, '');
        const targetPhone = (myId && myId !== 'invitado') ? myId : (guestPhone || clientPhone);

        // 1. Verificar reset global de la tienda
        try {
            const snapG = await db.ref('storeConfig/ruletaStats/lastGlobalReset').once('value');
            const gTs = snapG.val();
            const localTs = parseInt(localStorage.getItem('dpc_ruleta_last_reset_ts') || '0');
            if (gTs && gTs > localTs) {
                localStorage.setItem('dpc_ruleta_last_reset_ts', String(gTs));
                limpiarStatsLocalesRuleta();
                return;
            }
        } catch (e) {}

        if (!targetPhone || targetPhone === 'invitado') return;

        // 2. Verificar reset individual en Firebase
        try {
            const rSnap = await db.ref(`clientProfiles/_ruleta_resets/${targetPhone}`).once('value');
            const rTs = rSnap.val();
            const localUserTs = parseInt(localStorage.getItem(`dpc_ruleta_user_reset_ts_${targetPhone}`) || localStorage.getItem('dpc_ruleta_user_reset_ts') || '0');
            if (rTs && rTs > localUserTs) {
                localStorage.setItem(`dpc_ruleta_user_reset_ts_${targetPhone}`, String(rTs));
                localStorage.setItem('dpc_ruleta_user_reset_ts', String(rTs));
                limpiarStatsLocalesRuleta();
                return;
            }
        } catch (e) {}

        // 3. Verificar logs de giros del día en Firebase
        try {
            const logSnap = await db.ref(`clientProfiles/_ruleta_logs/${hoy}/${targetPhone}`).once('value');
            const logData = logSnap.val();
            const stats = getEstadisticasUsuario();

            if (!logData) {
                // Si en Firebase no hay log pero localmente marcaba giros o premios, fue reseteado por el admin
                if (stats.intentosHoy > 0 || stats.premioAceptado) {
                    console.log("⚡ Giros reseteados en la nube para:", targetPhone);
                    limpiarStatsLocalesRuleta();
                }
            } else {
                let updated = false;
                if (typeof logData.giros === 'number' && stats.intentosHoy !== logData.giros) {
                    stats.intentosHoy = logData.giros;
                    updated = true;
                }
                if (logData.aceptoPremio && !stats.premioAceptado) {
                    stats.premioAceptado = true;
                    updated = true;
                }
                if (updated) {
                    guardarEnStorage(stats);
                    actualizarUIIntentos();
                }
            }
        } catch (e) {}
    }

    /**
     * Listener en tiempo real desde Firebase para auto-resetear la ruleta cuando el admin lo solicite
     */
    let _activeRuletaListeners = [];
    function setupRuletaAutoResetListener() {
        if (typeof db === 'undefined') return;

        // Desvincular listeners anteriores para evitar fugas de memoria o duplicados
        try {
            _activeRuletaListeners.forEach(ref => {
                if (ref && typeof ref.off === 'function') ref.off();
            });
            _activeRuletaListeners = [];
        } catch (e) {}

        // A. Escuchar reset global (tienda completa)
        try {
            const refGlobal = db.ref('storeConfig/ruletaStats/lastGlobalReset');
            refGlobal.on('value', snap => {
                const val = snap.val();
                if (!val) return;
                const localTs = parseInt(localStorage.getItem('dpc_ruleta_last_reset_ts') || '0');
                if (val > localTs) {
                    localStorage.setItem('dpc_ruleta_last_reset_ts', String(val));
                    limpiarStatsLocalesRuleta();
                    console.log("⚡ Auto-reset global de Ruleta ejecutado desde Firebase!");
                }
            });
            _activeRuletaListeners.push(refGlobal);
        } catch (e) {}

        // B. Escuchar reset individual por teléfono, nombre o invitado
        const myId = getCurrentUserIdentifier();
        const guestPhone = (localStorage.getItem('dpc_ruleta_guest_phone') || '').replace(/\D/g, '').replace(/^57/, '');
        const clientPhone = (localStorage.getItem('clientPhone') || '').replace(/\D/g, '').replace(/^57/, '');
        const idsToListen = new Set([myId, guestPhone, clientPhone, 'invitado'].filter(Boolean));

        idsToListen.forEach(idTarget => {
            try {
                const refUser = db.ref(`clientProfiles/_ruleta_resets/${idTarget}`);
                refUser.on('value', snap => {
                    const val = snap.val();
                    if (!val) return;
                    const localUserTs = parseInt(localStorage.getItem(`dpc_ruleta_user_reset_ts_${idTarget}`) || localStorage.getItem('dpc_ruleta_user_reset_ts') || '0');
                    if (val > localUserTs) {
                        localStorage.setItem(`dpc_ruleta_user_reset_ts_${idTarget}`, String(val));
                        localStorage.setItem('dpc_ruleta_user_reset_ts', String(val));
                        limpiarStatsLocalesRuleta();
                        console.log("⚡ Auto-reset individual de Ruleta ejecutado desde Firebase para:", idTarget);
                    }
                });
                _activeRuletaListeners.push(refUser);
            } catch (e) {}
        });

        // C. Escuchar en tiempo real cambios o eliminación de _ruleta_logs de hoy
        const hoy = getTodayKey();
        const targetPhone = (myId && myId !== 'invitado') ? myId : (guestPhone || clientPhone);
        if (targetPhone && targetPhone !== 'invitado') {
            try {
                const refLog = db.ref(`clientProfiles/_ruleta_logs/${hoy}/${targetPhone}`);
                refLog.on('value', snap => {
                    const val = snap.val();
                    const stats = getEstadisticasUsuario();
                    if (!val) {
                        // El nodo fue eliminado en Firebase por el Administrador -> Resetear giros locales inmediatamente
                        if (stats.intentosHoy > 0 || stats.premioAceptado) {
                            console.log("⚡ Auto-reset por eliminación de _ruleta_logs detectado para:", targetPhone);
                            limpiarStatsLocalesRuleta();
                        }
                    } else {
                        // Sincronizar giros en tiempo real
                        let changed = false;
                        if (typeof val.giros === 'number' && stats.intentosHoy !== val.giros) {
                            stats.intentosHoy = val.giros;
                            changed = true;
                        }
                        if (val.aceptoPremio && !stats.premioAceptado) {
                            stats.premioAceptado = true;
                            changed = true;
                        }
                        if (changed) {
                            guardarEnStorage(stats);
                            actualizarUIIntentos();
                        }
                    }
                });
                _activeRuletaListeners.push(refLog);
            } catch (e) {}
        }
    }

    window.resetearIntentosActuales = async function (phoneTarget) {
        const hoy = getTodayKey();
        const targetPhone = phoneTarget ? String(phoneTarget).replace(/\D/g, '').replace(/^57/, '') : getCurrentUserIdentifier();

        // 1. Limpiar en localStorage
        const id = getCurrentUserIdentifier();
        if (!phoneTarget || phoneTarget === id || phoneTarget === targetPhone) {
            localStorage.removeItem(`dpc_ruleta_stats_${id}_${hoy}`);
            localStorage.removeItem(`dpc_ruleta_stats_invitado_${hoy}`);
            localStorage.removeItem('dpc_ruleta_guest_phone');
            localStorage.removeItem('dpc_ruleta_guest_name');
        }
        if (targetPhone && targetPhone !== 'invitado') {
            localStorage.removeItem(`dpc_ruleta_stats_${targetPhone}_${hoy}`);
        }

        // 2. Limpiar en Firebase Realtime Database
        if (typeof db !== 'undefined' && targetPhone && targetPhone !== 'invitado') {
            try {
                await db.ref(`clientProfiles/_ruleta_logs/${hoy}/${targetPhone}`).remove();
            } catch (e) {
                console.warn("Error borrando ruleta_logs en Firebase:", e);
            }
        }

        // 3. Restaurar UI
        const resBox = document.getElementById("resultado-premio");
        if (resBox) resBox.style.display = "none";
        const btnSpin = document.getElementById('ruleta-spin-btn');
        if (btnSpin) btnSpin.disabled = false;

        actualizarUIIntentos();
        return true;
    };

    /**
     * Resetea los intentos de un cliente buscándolo por celular o por nombre
     */
    window.resetearIntentosPorCliente = async function (busqueda) {
        if (!busqueda) return { success: false, message: "Debes ingresar un número de celular o nombre." };
        let cleanPhone = String(busqueda).replace(/\D/g, '').replace(/^57/, '');

        // 1. Si no es celular largo, buscar si es un vendedor registrado (ej: Jessica)
        const normSearch = busqueda.toLowerCase().trim();
        let sellerWa = '';
        let isSellerFound = false;

        const sc = (typeof storeConfig !== 'undefined') ? storeConfig : {};
        let sellersRaw = sc.sellers || [];
        if (!sellersRaw.length && typeof db !== 'undefined') {
            try {
                const snap = await db.ref('storeConfig/sellers').once('value');
                sellersRaw = snap.val() || [];
            } catch(e) {}
        }
        const sellersList = Array.isArray(sellersRaw) ? sellersRaw : Object.values(sellersRaw || {});
        const foundSeller = sellersList.find(s => (s.name || '').toLowerCase().trim() === normSearch);
        if (foundSeller) {
            isSellerFound = true;
            if (foundSeller.whatsapp) {
                sellerWa = String(foundSeller.whatsapp).replace(/\D/g, '').replace(/^57/, '');
                cleanPhone = sellerWa;
            }
        }

        // 2. Si no es vendedor, buscar en perfiles de clientes
        if (!cleanPhone || cleanPhone.length < 7) {
            if (typeof allClientProfiles !== 'undefined') {
                for (const p of Object.keys(allClientProfiles)) {
                    const c = allClientProfiles[p];
                    if (c && c.name && c.name.toLowerCase().includes(normSearch)) {
                        cleanPhone = String(p).replace(/\D/g, '').replace(/^57/, '');
                        break;
                    }
                }
            }
            if ((!cleanPhone || cleanPhone.length < 7) && typeof db !== 'undefined') {
                try {
                    const snap = await db.ref('clientSales').once('value');
                    const val = snap.val() || {};
                    for (const p of Object.keys(val)) {
                        const sales = val[p] || {};
                        for (const sId of Object.keys(sales)) {
                            const s = sales[sId];
                            if (s && s.clientName && s.clientName.toLowerCase().includes(normSearch)) {
                                cleanPhone = String(p).replace(/\D/g, '').replace(/^57/, '');
                                break;
                            }
                        }
                        if (cleanPhone && cleanPhone.length >= 7) break;
                    }
                } catch (e) {}
            }
        }

        const hoy = getTodayKey();
        const sSlug = 'vendedor_' + normSearch.replace(/\s+/g, '_');

        if (typeof db !== 'undefined') {
            const nowTs = Date.now();
            if (cleanPhone && cleanPhone.length >= 7) {
                await db.ref(`clientProfiles/_ruleta_logs/${hoy}/${cleanPhone}`).remove();
                await db.ref(`clientProfiles/_ruleta_resets/${cleanPhone}`).set(nowTs);
            }
            if (isSellerFound || !cleanPhone) {
                await db.ref(`clientProfiles/_ruleta_logs/${hoy}/${sSlug}`).remove();
                await db.ref(`clientProfiles/_ruleta_resets/${sSlug}`).set(nowTs);
                await db.ref(`clientProfiles/_ruleta_resets/${busqueda.trim()}`).set(nowTs);
            }
        }

        // Si coincide con la sesión actual, resetear también local
        const curId = getCurrentUserIdentifier();
        if (curId === cleanPhone || curId === sSlug || curId === busqueda.trim()) {
            limpiarStatsLocalesRuleta();
        }

        return { success: true, identificador: cleanPhone || busqueda.trim() };
    };

    const _ignoreOldResetPorCliente = async function (busqueda) {
        if (!busqueda) return { success: false, message: "Debes ingresar un número de celular o nombre." };
        let cleanPhone = String(busqueda).replace(/\D/g, '').replace(/^57/, '');

        // Si ingresó texto con letras o es un nombre
        if (!cleanPhone || cleanPhone.length < 7) {
            const normSearch = busqueda.toLowerCase().trim();
            if (typeof allClientProfiles !== 'undefined') {
                for (const p of Object.keys(allClientProfiles)) {
                    const c = allClientProfiles[p];
                    if (c && c.name && c.name.toLowerCase().includes(normSearch)) {
                        cleanPhone = String(p).replace(/\D/g, '').replace(/^57/, '');
                        break;
                    }
                }
            }
            if ((!cleanPhone || cleanPhone.length < 7) && typeof db !== 'undefined') {
                try {
                    const snap = await db.ref('clientSales').once('value');
                    const val = snap.val() || {};
                    for (const p of Object.keys(val)) {
                        const sales = val[p] || {};
                        for (const sId of Object.keys(sales)) {
                            const s = sales[sId];
                            if (s && s.clientName && s.clientName.toLowerCase().includes(normSearch)) {
                                cleanPhone = String(p).replace(/\D/g, '').replace(/^57/, '');
                                break;
                            }
                        }
                        if (cleanPhone && cleanPhone.length >= 7) break;
                    }
                } catch (e) {}
            }
        }

        if (!cleanPhone || cleanPhone.length < 7) {
            return { success: false, message: `No se encontró ningún cliente registrado con el criterio: "${busqueda}".` };
        }

        const hoy = getTodayKey();
        if (typeof db !== 'undefined') {
            await db.ref(`clientProfiles/_ruleta_logs/${hoy}/${cleanPhone}`).remove();
        }

        // Si coincide con la sesión actual, resetear también local
        const curId = getCurrentUserIdentifier();
        if (curId === cleanPhone) {
            localStorage.removeItem(`dpc_ruleta_stats_${cleanPhone}_${hoy}`);
            localStorage.removeItem(`dpc_ruleta_stats_invitado_${hoy}`);
            const resBox = document.getElementById("resultado-premio");
            if (resBox) resBox.style.display = "none";
            const btnSpin = document.getElementById('ruleta-spin-btn');
            if (btnSpin) btnSpin.disabled = false;
            actualizarUIIntentos();
        }

        return { success: true, identificador: cleanPhone };
    };

    /**
     * Resetea todos los intentos diarios registrados hoy (General)
     */
    window.resetearTodosLosIntentosGenerales = async function () {
        const hoy = getTodayKey();
        if (typeof db !== 'undefined') {
            try {
                await db.ref(`clientProfiles/_ruleta_logs/${hoy}`).remove();
            } catch (e) {
                console.error("Error al resetear ruleta_logs generales en Firebase:", e);
                throw e;
            }
        }

        // Limpiar todas las claves locales de ruleta
        try {
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('dpc_ruleta_stats_') || k.startsWith('dpc_ruleta_guest_')) {
                    localStorage.removeItem(k);
                }
            });
        } catch (e) {}

        const resBox = document.getElementById("resultado-premio");
        if (resBox) resBox.style.display = "none";
        const btnSpin = document.getElementById('ruleta-spin-btn');
        if (btnSpin) btnSpin.disabled = false;

        actualizarUIIntentos();
        return true;
    };

    /**
     * Menú interactivo rápido para resetear intentos (Admin / Pruebas)
     */
    window.menuResetearIntentosRuleta = async function () {
        const opcion = prompt(
            "🎰 HERRAMIENTAS DE PRUEBA - RESET DE GIROS DE RULETA\n\n" +
            "Selecciona una opción escribiendo el número:\n\n" +
            "1️⃣ = Resetear MIS intentos ahora (este navegador / vendedor actual)\n" +
            "2️⃣ = Resetear intentos de un VENDEDOR específico (Ej: Jessica, Pedro...)\n" +
            "3️⃣ = Resetear intentos por CELULAR o NOMBRE de cliente\n" +
            "4️⃣ = Resetear TODOS los intentos de hoy (General / Todos los clientes)\n" +
            "0️⃣ = Cancelar\n",
            "1"
        );

        if (!opcion || opcion.trim() === "0") return;

        if (opcion.trim() === "1") {
            limpiarStatsLocalesRuleta();
            await window.resetearIntentosActuales();
            alert("✅ ¡Tus giros han sido restablecidos! Tienes 3/3 giros disponibles y la ruleta está lista.");
        } else if (opcion.trim() === "2") {
            const vNombre = prompt("👔 Ingresa el Nombre o WhatsApp del Vendedor a resetear:");
            if (!vNombre || !vNombre.trim()) return;
            const res = await window.resetearIntentosPorCliente(vNombre.trim());
            if (res && res.success) {
                alert(`✅ ¡Giros restablecidos con éxito para el vendedor: ${vNombre.trim()}!`);
            } else {
                alert("⚠️ " + (res && res.message ? res.message : "No se pudo resetear el vendedor."));
            }
        } else if (opcion.trim() === "3") {
            const busqueda = prompt("📱 Ingresa el celular (ej: 3155182545) o nombre del cliente a resetear:");
            if (!busqueda || !busqueda.trim()) return;
            const res = await window.resetearIntentosPorCliente(busqueda.trim());
            if (res && res.success) {
                alert(`✅ ¡Giros restablecidos con éxito para el cliente: ${res.identificador}!`);
            } else {
                alert("⚠️ " + (res && res.message ? res.message : "No se pudo resetear el cliente."));
            }
        } else if (opcion.trim() === "4") {
            if (confirm("⚠️ ¿Estás completamente seguro de reiniciar TODOS los giros de hoy para TODOS los clientes y vendedores?")) {
                await window.resetearTodosLosIntentosGenerales();
                alert("✅ ¡Se han restablecido todos los giros diarios de hoy en la tienda!");
            }
        } else {
            alert("Opción no válida.");
        }
    };

    // Inicializar listener de redibujo al redimensionar
    window.addEventListener('resize', () => {
        const modal = document.getElementById('ruleta-modal');
        if (modal && modal.style.display === 'flex') {
            window.dibujarRuleta();
        }
    });

})();



/**
 * Desplaza suavemente la pantalla hacia el banner de la Ruleta y le aplica un destello visual
 */
window.irARuletaPromo = function () {
    const banner = document.getElementById('ruleta-promo-banner-section');
    if (banner) {
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        banner.style.transition = 'box-shadow 0.4s ease, transform 0.4s ease';
        banner.style.boxShadow = '0 0 45px rgba(245, 158, 11, 0.95), inset 0 0 30px rgba(251, 191, 36, 0.35)';
        banner.style.transform = 'scale(1.025)';
        setTimeout(() => {
            banner.style.boxShadow = '';
            banner.style.transform = '';
        }, 1600);
    } else {
        if (typeof openRuletaModal === 'function') openRuletaModal();
    }
};
