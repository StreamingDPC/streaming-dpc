/* ==========================================================================
   PUBLICIDAD FLOTANTE - BLACK FRIDAY & RULETA NAVIDEÑA
   Controlado desde Admin (storeConfig) - Aparece cada 15 min, cierra en 1 min
   ========================================================================== */
(function () {
    'use strict';

    const DEFAULTS = {
        enabled: false,
        badge: '🖤 BLACK FRIDAY • TIEMPO LIMITADO',
        discountTag: '3% AL 15% OFF',
        title: '¡Aprovecha Black Friday!',
        desc: 'Súper descuentos en los combos del 3% al 15% de descuento. ¡Elige tu combo favorito o prueba tu suerte!',
        image: '',
        startDate: '',
        endDate: '',
        intervalMinutes: 15,
        autoCloseSeconds: 60,
        soundEnabled: true,
        ruletaBtnText: '🎄🎰 ¡Gira la Ruleta Navideña! 🎁'
    };

    let currentCfg = { ...DEFAULTS };
    let isMuted = false;
    let isPreviewMode = false;
    let hasShownOnLoad = false;

    let repeatTimerId = null;
    let initialTimerId = null;
    let autoCloseTickId = null;
    let countdownTickId = null;
    let remainingCloseSec = 60;
    let audioUnlocked = false;
    let pendingOpenSound = false;

    // =========================================================================
    // AUDIO SYNTH (Web Audio API - sin dependencias externas)
    // =========================================================================
    function getAudioCtx() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!window._fpAudioCtx) {
            window._fpAudioCtx = new AudioCtx();
        }
        return window._fpAudioCtx;
    }

    function playPromoChime(type) {
        if (!currentCfg.soundEnabled || isMuted) return false;
        const ctx = getAudioCtx();
        if (!ctx) return false;

        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
            if (ctx.state === 'suspended') return false;
        }

        try {
            const now = ctx.currentTime;
            if (type === 'click') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(660, now);
                osc.frequency.exponentialRampToValueAtTime(990, now + 0.09);
                gain.gain.setValueAtTime(0.14, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
                return true;
            }

            // Fanfarria corta festiva / Black Friday (acorde ascendente brillante)
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
                const start = now + idx * 0.085;
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.001, start);
                gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.36);
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    function unlockAudioOnInteraction() {
        if (audioUnlocked) return;
        const ctx = getAudioCtx();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().then(() => {
                audioUnlocked = true;
                if (pendingOpenSound) {
                    pendingOpenSound = false;
                    playPromoChime('open');
                }
            }).catch(() => {});
        } else {
            audioUnlocked = true;
            if (pendingOpenSound) {
                pendingOpenSound = false;
                playPromoChime('open');
            }
        }
    }

    ['pointerdown', 'keydown'].forEach(evt => {
        document.addEventListener(evt, unlockAudioOnInteraction, { passive: true });
    });

    // =========================================================================
    // VALIDACIÓN DE FECHAS Y ESTADO
    // =========================================================================
    function isPromoCurrentlyValid(cfg) {
        if (!cfg || !cfg.enabled) return false;
        const now = Date.now();
        if (cfg.startDate) {
            const startMs = new Date(cfg.startDate).getTime();
            if (!isNaN(startMs) && now < startMs) return false;
        }
        if (cfg.endDate) {
            const endMs = new Date(cfg.endDate).getTime();
            if (!isNaN(endMs) && now > endMs) return false;
        }
        return true;
    }

    // =========================================================================
    // CREACIÓN DEL DOM
    // =========================================================================
    function ensureDOM() {
        if (document.getElementById('fp-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'fp-overlay';
        overlay.className = 'fp-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML = `
            <div class="fp-card-wrap">
                <div class="fp-card">
                    <div class="fp-sparks" aria-hidden="true">
                        <span class="fp-spark" style="left:12%; animation-delay:0s;"></span>
                        <span class="fp-spark" style="left:32%; animation-delay:1.1s;"></span>
                        <span class="fp-spark" style="left:58%; animation-delay:0.6s;"></span>
                        <span class="fp-spark" style="left:78%; animation-delay:1.8s;"></span>
                        <span class="fp-spark" style="left:90%; animation-delay:0.3s;"></span>
                    </div>

                    <div class="fp-top-controls">
                        <button type="button" id="fp-mute-btn" class="fp-icon-btn" title="Activar / Silenciar sonido">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                        <button type="button" id="fp-close-btn" class="fp-icon-btn" title="Cerrar promoción">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div id="fp-hero-img-wrap" class="fp-hero-img-wrap" style="display:none;">
                        <img id="fp-hero-img" class="fp-hero-img" src="" alt="Promoción Black Friday">
                        <div class="fp-hero-img-overlay"></div>
                    </div>

                    <div class="fp-body">
                        <div class="fp-badge-row">
                            <span id="fp-badge" class="fp-badge"></span>
                            <span id="fp-discount-pill" class="fp-discount-pill"></span>
                        </div>

                        <h2 id="fp-title" class="fp-title"></h2>
                        <p id="fp-desc" class="fp-desc"></p>

                        <div id="fp-countdown-box" class="fp-countdown-box" style="display:none;">
                            <span class="fp-countdown-label"><i class="fa-solid fa-hourglass-half"></i> Termina en:</span>
                            <div class="fp-countdown-units">
                                <div class="fp-cd-unit"><strong id="fp-cd-d">00</strong><span>Días</span></div>
                                <div class="fp-cd-unit"><strong id="fp-cd-h">00</strong><span>Hrs</span></div>
                                <div class="fp-cd-unit"><strong id="fp-cd-m">00</strong><span>Min</span></div>
                                <div class="fp-cd-unit"><strong id="fp-cd-s">00</strong><span>Seg</span></div>
                            </div>
                        </div>

                        <div class="fp-section-label">👇 Elige directo tu promoción 👇</div>

                        <div class="fp-combos-grid">
                            <button type="button" class="fp-combo-btn" data-fp-target="individual">
                                <span class="fp-btn-emoji">1️⃣</span>
                                <span>Combo 1</span>
                            </button>
                            <button type="button" class="fp-combo-btn" data-fp-target="combos2">
                                <span class="fp-btn-emoji">2️⃣</span>
                                <span>Combo 2</span>
                            </button>
                            <button type="button" class="fp-combo-btn" data-fp-target="combos3">
                                <span class="fp-btn-emoji">3️⃣</span>
                                <span>Combo 3</span>
                            </button>
                            <button type="button" class="fp-combo-btn" data-fp-target="combos4">
                                <span class="fp-btn-emoji">4️⃣</span>
                                <span>Combo 4</span>
                            </button>
                            <button type="button" class="fp-combo-btn" data-fp-target="combos5">
                                <span class="fp-btn-emoji">5️⃣</span>
                                <span>Combo 5</span>
                            </button>
                            <button type="button" class="fp-combo-btn fp-btn-finde" data-fp-target="promociones">
                                <span class="fp-btn-emoji">🔥</span>
                                <span>Fin de Mes</span>
                            </button>
                        </div>

                        <button type="button" id="fp-ruleta-btn" class="fp-ruleta-btn" data-fp-target="ruleta">
                            <span id="fp-ruleta-btn-text">🎄🎰 ¡Gira la Ruleta Navideña! 🎁</span>
                        </button>

                        <div class="fp-autoclose-wrap">
                            <div class="fp-autoclose-text">
                                <span id="fp-autoclose-label">Se cierra automáticamente en 60s</span>
                                <button type="button" id="fp-close-link" class="fp-close-link">Cerrar ahora</button>
                            </div>
                            <div class="fp-progress-track">
                                <div id="fp-progress-bar" class="fp-progress-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Mini pill para reabrir si el usuario la cerró
        const pill = document.createElement('button');
        pill.id = 'fp-mini-pill';
        pill.type = 'button';
        pill.className = 'fp-mini-pill';
        pill.innerHTML = `<span class="fp-mini-dot"></span> <span id="fp-mini-pill-text">🔥 Promo Black Friday</span>`;
        document.body.appendChild(pill);

        // Listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeFloatingPromo();
        });
        document.getElementById('fp-close-btn').addEventListener('click', closeFloatingPromo);
        document.getElementById('fp-close-link').addEventListener('click', closeFloatingPromo);

        document.getElementById('fp-mute-btn').addEventListener('click', () => {
            isMuted = !isMuted;
            updateMuteBtnUI();
            if (!isMuted) playPromoChime('click');
        });

        overlay.querySelectorAll('[data-fp-target]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-fp-target');
                handlePromoNavigation(target);
            });
        });

        pill.addEventListener('click', () => {
            playPromoChime('click');
            openFloatingPromo(false);
        });
    }

    function updateMuteBtnUI() {
        const btn = document.getElementById('fp-mute-btn');
        if (!btn) return;
        if (!currentCfg.soundEnabled) {
            btn.style.display = 'none';
            return;
        }
        btn.style.display = 'inline-flex';
        btn.innerHTML = isMuted
            ? '<i class="fa-solid fa-volume-xmark"></i>'
            : '<i class="fa-solid fa-volume-high"></i>';
    }

    // =========================================================================
    // NAVEGACIÓN DE BOTONES
    // =========================================================================
    function handlePromoNavigation(target) {
        playPromoChime('click');
        const wasPreview = isPreviewMode;
        closeFloatingPromo();

        if (wasPreview) {
            const labels = {
                individual: 'Combo 1 (Individual)',
                combos2: 'Combo 2',
                combos3: 'Combo 3',
                combos4: 'Combo 4',
                combos5: 'Combo 5',
                promociones: 'Promociones de Fin de Mes',
                ruleta: 'Ruleta Navideña'
            };
            alert(`Vista Previa: Al hacer clic aquí, el cliente o vendedor irá directo a "${labels[target] || target}".`);
            return;
        }

        if (target === 'ruleta') {
            if (typeof window.openRuletaModal === 'function') {
                window.openRuletaModal();
            } else {
                const modal = document.getElementById('ruleta-modal');
                if (modal) modal.style.display = 'flex';
            }
            return;
        }

        // Si el buscador inteligente está activo, limpiarlo para mostrar la categoría elegida
        if (typeof window.resetSmartSearch === 'function') {
            try { window.resetSmartSearch(); } catch (e) {}
        }

        const tabBtn = document.querySelector(`.tab-btn[data-tab="${target}"]`);
        if (tabBtn) {
            if (tabBtn.style.display === 'none') {
                tabBtn.style.display = '';
            }
            tabBtn.click();
        } else if (typeof window.renderProducts === 'function') {
            window.renderProducts(target);
        }

        const scrollTarget = document.querySelector('.tabs-container') || document.getElementById('products-grid');
        if (scrollTarget) {
            setTimeout(() => {
                scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 120);
        }
    }

    // =========================================================================
    // CONTADOR DE VIGENCIA Y AUTOCIERRE (1 MIN)
    // =========================================================================
    function updateEndCountdown() {
        const box = document.getElementById('fp-countdown-box');
        if (!box) return;
        if (!currentCfg.endDate) {
            box.style.display = 'none';
            return;
        }
        const endMs = new Date(currentCfg.endDate).getTime();
        if (isNaN(endMs)) {
            box.style.display = 'none';
            return;
        }
        const diff = endMs - Date.now();
        if (diff <= 0) {
            box.style.display = 'none';
            if (!isPreviewMode) closeFloatingPromo();
            return;
        }
        box.style.display = 'inline-flex';
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        const pad = (n) => String(n).padStart(2, '0');
        document.getElementById('fp-cd-d').textContent = pad(d);
        document.getElementById('fp-cd-h').textContent = pad(h);
        document.getElementById('fp-cd-m').textContent = pad(m);
        document.getElementById('fp-cd-s').textContent = pad(s);
    }

    function startAutoCloseTimer() {
        clearInterval(autoCloseTickId);
        const totalSec = Math.max(5, parseInt(currentCfg.autoCloseSeconds, 10) || 60);
        remainingCloseSec = totalSec;

        const labelEl = document.getElementById('fp-autoclose-label');
        const barEl = document.getElementById('fp-progress-bar');

        const renderTick = () => {
            if (labelEl) {
                labelEl.textContent = `Se cierra automáticamente en ${remainingCloseSec}s`;
            }
            if (barEl) {
                const pct = Math.max(0, (remainingCloseSec / totalSec) * 100);
                barEl.style.width = `${pct}%`;
            }
        };

        renderTick();
        autoCloseTickId = setInterval(() => {
            remainingCloseSec--;
            renderTick();
            if (remainingCloseSec <= 0) {
                closeFloatingPromo();
            }
        }, 1000);
    }

    // =========================================================================
    // ABRIR / CERRAR
    // =========================================================================
    function renderContent(cfg) {
        ensureDOM();

        const badgeEl = document.getElementById('fp-badge');
        const discEl = document.getElementById('fp-discount-pill');
        const titleEl = document.getElementById('fp-title');
        const descEl = document.getElementById('fp-desc');
        const imgWrap = document.getElementById('fp-hero-img-wrap');
        const imgEl = document.getElementById('fp-hero-img');
        const ruletaTxt = document.getElementById('fp-ruleta-btn-text');
        const pillText = document.getElementById('fp-mini-pill-text');

        if (badgeEl) {
            badgeEl.textContent = cfg.badge || DEFAULTS.badge;
            badgeEl.style.display = cfg.badge ? 'inline-flex' : 'none';
        }
        if (discEl) {
            discEl.textContent = cfg.discountTag || DEFAULTS.discountTag;
            discEl.style.display = cfg.discountTag ? 'inline-flex' : 'none';
        }
        if (titleEl) titleEl.textContent = cfg.title || DEFAULTS.title;
        if (descEl) descEl.textContent = cfg.desc || DEFAULTS.desc;
        if (ruletaTxt) ruletaTxt.textContent = cfg.ruletaBtnText || DEFAULTS.ruletaBtnText;
        if (pillText) pillText.textContent = `🔥 ${cfg.title || 'Promo Black Friday'}`;

        if (imgWrap && imgEl) {
            if (cfg.image && cfg.image.trim().length > 0) {
                imgEl.src = cfg.image.trim();
                imgWrap.style.display = 'block';
            } else {
                imgEl.src = '';
                imgWrap.style.display = 'none';
            }
        }

        updateMuteBtnUI();
    }

    function openFloatingPromo(preview) {
        isPreviewMode = !!preview;
        if (!isPreviewMode && !isPromoCurrentlyValid(currentCfg)) return;

        renderContent(currentCfg);

        const overlay = document.getElementById('fp-overlay');
        const pill = document.getElementById('fp-mini-pill');
        if (overlay) overlay.classList.add('fp-visible');
        if (pill) pill.classList.remove('fp-pill-visible');

        updateEndCountdown();
        clearInterval(countdownTickId);
        countdownTickId = setInterval(updateEndCountdown, 1000);

        startAutoCloseTimer();

        const played = playPromoChime('open');
        if (!played && currentCfg.soundEnabled && !isMuted) {
            pendingOpenSound = true;
        }
    }

    function closeFloatingPromo() {
        const overlay = document.getElementById('fp-overlay');
        const pill = document.getElementById('fp-mini-pill');
        if (overlay) overlay.classList.remove('fp-visible');

        clearInterval(autoCloseTickId);
        clearInterval(countdownTickId);
        pendingOpenSound = false;

        if (!isPreviewMode && isPromoCurrentlyValid(currentCfg) && pill) {
            pill.classList.add('fp-pill-visible');
        }
        isPreviewMode = false;
    }

    // =========================================================================
    // SINCRONIZACIÓN CON storeConfig (FIREBASE)
    // =========================================================================
    function syncFloatingPromoConfig(storeConfig) {
        if (!storeConfig || typeof storeConfig !== 'object') return;

        const isMaintenance = storeConfig.maintenanceEnabled === true;

        currentCfg = {
            enabled: !isMaintenance && (storeConfig.floatingPromoEnabled === true || storeConfig.floatingPromoEnabled === 'true'),
            badge: storeConfig.floatingPromoBadge !== undefined ? storeConfig.floatingPromoBadge : DEFAULTS.badge,
            discountTag: storeConfig.floatingPromoDiscountTag !== undefined ? storeConfig.floatingPromoDiscountTag : DEFAULTS.discountTag,
            title: storeConfig.floatingPromoTitle || DEFAULTS.title,
            desc: storeConfig.floatingPromoDesc || DEFAULTS.desc,
            image: storeConfig.floatingPromoImage || '',
            startDate: storeConfig.floatingPromoStart || '',
            endDate: storeConfig.floatingPromoEnd || '',
            intervalMinutes: parseInt(storeConfig.floatingPromoIntervalMin, 10) || DEFAULTS.intervalMinutes,
            autoCloseSeconds: parseInt(storeConfig.floatingPromoAutoCloseSec, 10) || DEFAULTS.autoCloseSeconds,
            soundEnabled: storeConfig.floatingPromoSound !== false && storeConfig.floatingPromoSound !== 'false',
            ruletaBtnText: storeConfig.floatingPromoRuletaText || DEFAULTS.ruletaBtnText
        };

        const valid = isPromoCurrentlyValid(currentCfg);

        if (!valid) {
            clearTimeout(initialTimerId);
            clearInterval(repeatTimerId);
            repeatTimerId = null;
            closeFloatingPromo();
            const pill = document.getElementById('fp-mini-pill');
            if (pill) pill.classList.remove('fp-pill-visible');
            return;
        }

        // Si la promo está activa y es válida:
        ensureDOM();
        const overlay = document.getElementById('fp-overlay');
        const isCurrentlyOpen = overlay && overlay.classList.contains('fp-visible');

        if (isCurrentlyOpen) {
            renderContent(currentCfg);
        } else {
            const pill = document.getElementById('fp-mini-pill');
            if (pill) pill.classList.add('fp-pill-visible');
        }

        // Mostrar al abrir la pantalla (una sola vez por carga inicial)
        if (!hasShownOnLoad) {
            hasShownOnLoad = true;
            clearTimeout(initialTimerId);
            initialTimerId = setTimeout(() => {
                if (isPromoCurrentlyValid(currentCfg)) {
                    openFloatingPromo(false);
                }
            }, 1200);
        }

        // Programar reaparición cada X minutos (default 15 min)
        clearInterval(repeatTimerId);
        const intervalMs = Math.max(1, currentCfg.intervalMinutes) * 60 * 1000;
        repeatTimerId = setInterval(() => {
            if (isPromoCurrentlyValid(currentCfg)) {
                const ov = document.getElementById('fp-overlay');
                if (!ov || !ov.classList.contains('fp-visible')) {
                    openFloatingPromo(false);
                }
            }
        }, intervalMs);
    }

    // Vista previa desde el Panel Admin
    function previewFloatingPromo(customCfg) {
        currentCfg = {
            ...DEFAULTS,
            ...(customCfg || {}),
            enabled: true
        };
        openFloatingPromo(true);
    }

    window.syncFloatingPromoConfig = syncFloatingPromoConfig;
    window.openFloatingPromo = openFloatingPromo;
    window.closeFloatingPromo = closeFloatingPromo;
    window.previewFloatingPromo = previewFloatingPromo;
    window.FLOATING_PROMO_DEFAULTS = DEFAULTS;
})();
