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
            label: "30% DCTO Netflix",
            tipo: "descuento_servicio",
            servicio: "Netflix Premium",
            precioNormal: 15000,
            descuentoPorcentaje: 30, // Paga 10.500
            color: "#e50914"
        },
        {
            id: 2,
            label: "Pantalla ViX Gratis",
            tipo: "pantalla_gratis",
            servicio: "ViX Premium",
            precioNormal: 8000,
            descuentoPorcentaje: 100, // Total: $0
            color: "#ff5400"
        },
        {
            id: 3,
            label: "20% DCTO Disney+",
            tipo: "descuento_servicio",
            servicio: "Disney+ Estándar",
            precioNormal: 14000,
            descuentoPorcentaje: 20, // Paga 11.200
            color: "#113ccf"
        },
        {
            id: 4,
            label: "Pantalla Crunchyroll Gratis",
            tipo: "pantalla_gratis",
            servicio: "Crunchyroll Fan",
            precioNormal: 9000,
            descuentoPorcentaje: 100, // Total: $0
            color: "#f77f00"
        },
        {
            id: 5,
            label: "Bono 15% General",
            tipo: "cupon_general",
            servicio: "Cualquier Pantalla",
            precioNormal: 0, // Se calcula según lo que escoja
            descuentoPorcentaje: 15,
            color: "#7209b7"
        },
        {
            id: 6,
            label: "Sigue Intentando 😢",
            tipo: "sin_premio",
            servicio: "Ninguno",
            precioNormal: 0,
            descuentoPorcentaje: 0,
            color: "#343a40"
        }
    ];

    const WHATSAPP_ADMIN = "573155182545";

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
        if (typeof clientPhoneLoggedIn !== 'undefined' && clientPhoneLoggedIn) {
            return String(clientPhoneLoggedIn).replace(/\D/g, '').replace(/^57/, '');
        }
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

            // Texto de la etiqueta
            ctx.save();
            ctx.rotate(anguloInicio + arco / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px Outfit, sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;

            // Recortar texto si es muy largo
            let txt = premio.label || '';
            if (txt.length > 22) txt = txt.substring(0, 20) + '...';
            ctx.fillText(txt, radius - 20, 5);
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
     * Calcula el premio ganador basándose en el ángulo actual
     */
    function calcularPremioGanador() {
        const config = window.getRuletaConfig();
        const configPremiosStreaming = config.premios;

        const normalizado = (1.5 * Math.PI - (anguloActual % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const arco = (2 * Math.PI) / configPremiosStreaming.length;
        const indice = Math.floor(normalizado / arco);

        premioTemporal = configPremiosStreaming[indice];

        const resBox = document.getElementById("resultado-premio");
        const iconoEl = document.getElementById("icono-resultado");
        const nombreEl = document.getElementById("nombre-premio-ganado");
        const detalleEl = document.getElementById("detalle-precio-box");
        const btnEnviar = document.getElementById("btn-enviar-admin");
        const btnReintentar = document.getElementById("btn-seguir-girando");

        if (!resBox || !iconoEl || !nombreEl || !detalleEl) return;

        // Si no ganó nada
        if (premioTemporal.tipo === "sin_premio") {
            iconoEl.textContent = "😢";
            nombreEl.textContent = "¡Sigue Intentando!";
            detalleEl.innerHTML = `
                <p style="margin: 0; color: #cbd5e1;">No obtuviste descuento en este giro.</p>
                <p style="margin: 6px 0 0 0; color: #38bdf8;">Puedes comprar tu pantalla habitual pagando por Nequi o Daviplata.</p>
            `;
            if (btnEnviar) {
                btnEnviar.textContent = "📲 Ver Medios de Pago y Pedir Pantalla";
                btnEnviar.style.background = "#0284c7";
            }
        }
        // Si ganó pantalla gratis
        else if (premioTemporal.tipo === "pantalla_gratis") {
            iconoEl.textContent = "🎉";
            nombreEl.textContent = "¡PANTALLA TOTALMENTE GRATIS!";
            detalleEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom:4px;"><span>Servicio:</span> <b>${premioTemporal.servicio}</b></div>
                <div style="display: flex; justify-content: space-between; color: #4ade80; font-size:1.05rem;"><span>Total a pagar:</span> <b>$0 COP</b></div>
            `;
            if (btnEnviar) {
                btnEnviar.textContent = "🎁 Reclamar mi Pantalla Gratis al Admin";
                btnEnviar.style.background = "#10b981";
            }
        }
        // Si ganó cupón general
        else if (premioTemporal.tipo === "cupon_general") {
            iconoEl.textContent = "🎟️";
            nombreEl.textContent = `¡Ganaste ${premioTemporal.label}!`;
            detalleEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom:4px;"><span>Beneficio:</span> <b>${premioTemporal.descuentoPorcentaje}% de Descuento</b></div>
                <div style="display: flex; justify-content: space-between; color: #fbbf24;"><span>Aplica en:</span> <b>Cualquier Pantalla que elijas</b></div>
            `;
            if (btnEnviar) {
                btnEnviar.textContent = "📲 Aceptar Cupón y Enviar al Admin";
                btnEnviar.style.background = "#8b5cf6";
            }
        }
        // Si ganó descuento calculado
        else {
            const rebaja = (premioTemporal.precioNormal * premioTemporal.descuentoPorcentaje) / 100;
            const finalPagar = premioTemporal.precioNormal - rebaja;

            iconoEl.textContent = "🔥";
            nombreEl.textContent = `¡Ganaste ${premioTemporal.label}!`;
            detalleEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom:3px;"><span>Servicio:</span> <b>${premioTemporal.servicio}</b></div>
                <div style="display: flex; justify-content: space-between; margin-bottom:3px;"><span>Precio normal:</span> <s>$${premioTemporal.precioNormal.toLocaleString("es-CO")}</s></div>
                <div style="display: flex; justify-content: space-between; color: #fbbf24; margin-bottom:3px;"><span>Descuento:</span> -${premioTemporal.descuentoPorcentaje}% (-$${rebaja.toLocaleString("es-CO")})</div>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.15); margin: 6px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 15px; color: #4ade80;"><span>Total a transferir:</span> <b>$${finalPagar.toLocaleString("es-CO")} COP</b></div>
            `;
            if (btnEnviar) {
                btnEnviar.textContent = "📲 Aceptar Descuento y Enviar Ticket";
                btnEnviar.style.background = "#22c55e";
            }
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
            alert("👑 ¡Ya estás en el Podio Navideño (Top 3)! Tus premios mayores ya están garantizados para el 25 de diciembre. La Ruleta es exclusiva para quienes no alcanzaron el Top 3.");
            return;
        }

        // 2. Verificar intentos del día
        const config = window.getRuletaConfig();
        const stats = getEstadisticasUsuario();

        if (stats.premioAceptado) {
            alert("🎉 ¡Ya reclamaste tu premio de hoy! Mañana podrás girar nuevamente la ruleta.");
            return;
        }

        if (stats.intentosHoy >= config.intentosMaximosPorDia) {
            alert(`Has alcanzado el límite de ${config.intentosMaximosPorDia} giros por hoy. ¡Vuelve mañana por más oportunidades!`);
            return;
        }

        // Ocultar caja de resultado previo
        const resBox = document.getElementById("resultado-premio");
        if (resBox) resBox.style.display = "none";

        // Registrar intento
        stats.intentosHoy += 1;
        guardarEnStorage(stats);
        actualizarUIIntentos();

        isGirando = true;
        const btnSpin = document.getElementById('ruleta-spin-btn');
        if (btnSpin) btnSpin.disabled = true;

        // Calcular ángulo objetivo: 5 a 8 vueltas completas + ángulo aleatorio
        const vueltasCompletas = (5 + Math.floor(Math.random() * 4)) * (2 * Math.PI);
        const anguloExtra = Math.random() * (2 * Math.PI);
        const anguloObjetivo = anguloActual + vueltasCompletas + anguloExtra;

        const duracionTotal = 4800; // 4.8 segundos
        const tiempoInicio = performance.now();
        const anguloInicial = anguloActual;

        let ultimoSectorSonido = -1;
        const numSlices = config.premios.length;
        const arco = (2 * Math.PI) / numSlices;

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
                calcularPremioGanador();
            }
        }

        requestAnimationFrame(animarGiro);
    };

    /**
     * Acción de Reclamar Premio por WhatsApp
     */
    window.reclamarPremioWhatsapp = function () {
        if (!premioTemporal) return;

        const stats = getEstadisticasUsuario();
        stats.premioAceptado = true;
        stats.ultimoPremio = premioTemporal;
        guardarEnStorage(stats);

        const config = window.getRuletaConfig();

        let nombre = 'Cliente';
        let telefono = getCurrentUserIdentifier();
        if (telefono === 'invitado') telefono = 'Sin registrar';

        if (typeof clientPhoneLoggedIn !== 'undefined' && clientPhoneLoggedIn) {
            const p = String(clientPhoneLoggedIn).replace(/\D/g, '').replace(/^57/, '');
            if (typeof allClientProfiles !== 'undefined' && allClientProfiles[p]) {
                nombre = allClientProfiles[p].name || 'Cliente';
            }
        } else {
            const storedName = localStorage.getItem('dpc_ruleta_guest_name');
            if (storedName) nombre = storedName;
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
    };

    /**
     * Generador de Tickets y Enlace de WhatsApp
     */
    function generarYEnviarTicket(premio, usuario, adminPhone = WHATSAPP_ADMIN) {
        const fecha = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
        const codigoTicket = "ST-" + Math.floor(100000 + Math.random() * 900000);
        let mensaje = "";

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
                `*N° Ticket:* #${codigoTicket}\n` +
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
                `*N° Ticket:* #${codigoTicket}\n` +
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
                `*N° Ticket:* #${codigoTicket}\n` +
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
    }

    /**
     * Abre el modal de la ruleta y prepara el canvas
     */
    window.openRuletaModal = async function () {
        const modal = document.getElementById('ruleta-modal');
        if (!modal) return;

        const config = window.getRuletaConfig();
        if (!config.enabled) {
            alert("La Ruleta de la Suerte no se encuentra habilitada en este momento. ¡Vuelve en las próximas promociones de fin de semana!");
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

    // Inicializar listener de redibujo al redimensionar
    window.addEventListener('resize', () => {
        const modal = document.getElementById('ruleta-modal');
        if (modal && modal.style.display === 'flex') {
            window.dibujarRuleta();
        }
    });

})();
