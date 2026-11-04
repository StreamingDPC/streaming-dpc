
// ============================================
// DPC BILLING ENGINE v1.0 (Cap Month)
// ============================================
window.DPCBillingEngine = {
    calcularProximoVencimiento: function (fechaCompraOriginal, fechaVencimientoActual, monthsToAdd = 1) {
        monthsToAdd = parseInt(monthsToAdd) || 1;
        if (!fechaCompraOriginal || isNaN(new Date(fechaCompraOriginal).getTime())) {
            fechaCompraOriginal = fechaVencimientoActual || Date.now();
        }
        if (!fechaVencimientoActual || isNaN(new Date(fechaVencimientoActual).getTime())) {
            fechaVencimientoActual = Date.now();
        }

        const fco = new Date(fechaCompraOriginal);
        const fva = new Date(fechaVencimientoActual);
        const diaOriginal = fco.getDate();

        let targetYear = fva.getFullYear();
        let targetMonth = fva.getMonth() + monthsToAdd; // Avanzamos los meses indicados

        while (targetMonth > 11) {
            targetMonth -= 12;
            targetYear++;
        }

        // Averiguar cuántos días tiene el mes destino
        const maxDaysNextMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

        // El día final a cobrar (Cap al final del mes si el original era 31 y el nuevo tiene 30)
        let finalDay = diaOriginal;
        if (diaOriginal > maxDaysNextMonth) {
            finalDay = maxDaysNextMonth;
        }

        // Fijar exactamente a las 23:59:59.999
        return new Date(targetYear, targetMonth, finalDay, 23, 59, 59, 999);
    }
};

// Inicializar Firebase (Compat Version)
const firebaseConfig = {
    apiKey: "AIzaSyBscP8FT1dcnHlSFMXc3DlfXSgRO9ET9s4",
    authDomain: "streamingdpc-7e7fa.firebaseapp.com",
    databaseURL: "https://streamingdpc-7e7fa-default-rtdb.firebaseio.com",
    projectId: "streamingdpc-7e7fa",
    storageBucket: "streamingdpc-7e7fa.firebasestorage.app",
    messagingSenderId: "831116907849",
    appId: "1:831116907849:web:ee8e744db342970fd0b698"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Live Sync Engine
const APP_VERSION = '3.8.15';
// NOTA: El Live Sync por versión fue desactivado para evitar bucles de redirección.
// Render sirve archivos estáticos con caché propia y no puede sincronizar en tiempo real con Firebase.


window.sanitizePhone = function (val) {
    if (!val) return "";
    let c = val.toString().replace(/\D/g, "");
    if (c.length >= 12 && c.startsWith("57")) {
        c = c.substring(2);
    }
    return c;
};


let storeConfig = {};
let products = [];
let cart = [];

const formatWaPhone = (phone) => {
    if (!phone) return '';
    let p = String(phone).replace(/\D/g, '');
    return (p.length === 10 && p.startsWith('3')) ? '57' + p : p;
};

const safeDecode = (str) => {
    if (!str) return '';
    try {
        return str.includes('%') ? decodeURIComponent(str) : str;
    } catch (e) { return str; }
};

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const tabBtns = document.querySelectorAll('.tab-btn');
const cartBadge = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const openCartBtn = document.getElementById('open-cart');
const closeModalBtn = document.querySelector('.close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalLabel = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

const openCodeBtn = document.getElementById('open-code-btn');
const codeModal = document.getElementById('code-modal');
const fetchCodeBtn = document.getElementById('fetch-code-btn');
const closeCodeBtn = document.querySelector('.code-close');
const codePlatformSelect = document.getElementById('code-platform');
const openVendedoresBtn = document.getElementById('open-vendedores-btn');

const sellerModal = document.getElementById('seller-modal');
const closeSellerBtn = document.querySelector('.seller-close');
const loginSellerBtn = document.getElementById('login-seller-btn');

const sellerDashboardModal = document.getElementById('seller-dashboard-modal');
const closeSellerDashBtn = document.querySelector('.dash-close');
const logoutSellerBtn = document.getElementById('logout-seller-btn');
const sellerSalesList = document.getElementById('seller-sales-list');
const sellerSearchSales = document.getElementById('seller-search-sales');

const reminderEditorModal = document.getElementById('reminder-editor-modal');
const closeReminderBtn = document.querySelector('.reminder-close');
const remindPhoneInput = document.getElementById('remind-phone');
const remindMsgInput = document.getElementById('remind-msg');
const remindSaleIdInput = document.getElementById('remind-sale-id');
const sendReminderWhatsappBtn = document.getElementById('send-reminder-whatsapp-btn');

const sellerClientSelector = document.getElementById('seller-client-selector');
const sellerClientsDropdown = document.getElementById('seller-clients-dropdown');

const openClientBtn = document.getElementById('open-client-btn');
const clientLoginModal = document.getElementById('client-login-modal');
const clientDashboardModal = document.getElementById('client-dashboard-modal');
const closeClientLoginBtn = document.querySelector('.client-login-close');
const closeClientDashBtn = document.querySelector('.client-dash-close');
const loginClientBtn = document.getElementById('login-client-btn');
const logoutClientBtn = document.getElementById('logout-client-btn');
const clientSalesList = document.getElementById('client-sales-list');

const clientLoginStep1 = document.getElementById('client-login-step1');
const clientLoginStep2 = document.getElementById('client-login-step2');
const btnClientNext = document.getElementById('btn-client-next');
const clientLoginPin = document.getElementById('client-login-pin');
const pinMessage = document.getElementById('pin-message');
const forgotPinBtn = document.getElementById('forgot-pin-btn');
const backToStep1Btn = document.getElementById('back-to-step1-btn');

let windowTempClientPhone = '';
let windowTempClientPin = null;

let isSellerMode = localStorage.getItem('isSellerMode') === 'true';
let currentSellerName = localStorage.getItem('sellerName') || '';
let clientPhoneLoggedIn = localStorage.getItem('clientPhone') || '';

// Public Seller Store Variables
const urlParams = new URLSearchParams(window.location.search);
const publicSellerRef = urlParams.get('ref');

if (publicSellerRef) {
    isSellerMode = false; // Fuerza vista cliente global sincronamente
}

let publicSellerStoreData = null;

// Seller Store DOM
const sellerStoreModal = document.getElementById('seller-store-modal');
const closeSellerStoreBtn = document.querySelector('.seller-store-close');
const openSellerStoreBtn = document.getElementById('open-seller-store-btn');
const storeLinkInput = document.getElementById('store-link-input');
const storeWhatsappInput = document.getElementById('store-whatsapp');
const storeFacebookInput = document.getElementById('store-facebook');
const storeInstagramInput = document.getElementById('store-instagram');
const storeTiktokInput = document.getElementById('store-tiktok');
const storeKwaiInput = document.getElementById('store-kwai');
const storeYoutubeInput = document.getElementById('store-youtube');
const storePaymentInfoInput = document.getElementById('store-payment-info');
const storePricesList = document.getElementById('store-prices-list');
const saveStoreBtn = document.getElementById('save-store-btn');

// Success Modal Elements
const successModal = document.getElementById('success-modal');
const successBonusContainer = document.getElementById('success-bonus-container');
const successBonusAmount = document.getElementById('success-bonus-amount');
const successBonusDetails = document.getElementById('success-bonus-details');
const successWhatsappBtn = document.getElementById('success-whatsapp-btn');

let pendingWhatsappMessage = "";
let pendingWhatsappNumber = "";


function init() {
    renderProducts('individual');
    setupEventListeners();
    setupConfigUI();
    // Si el cliente ya tiene sesión persistida, mostrar botón "Obtener Código"
    if (clientPhoneLoggedIn) {
        const codeNavBtn = document.getElementById('open-code-btn');
        if (codeNavBtn) codeNavBtn.style.display = 'inline-flex';
        if (window.startCodeAttemptsLiveSync) {
            window.startCodeAttemptsLiveSync(clientPhoneLoggedIn);
        }
    }
}

function applyTabsVisibility() {
    const disabledTabs = (storeConfig && Array.isArray(storeConfig.disabledTabs)) ? storeConfig.disabledTabs : [];
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const tabKey = btn.dataset.tab;
        if (!tabKey) return;
        
        if (disabledTabs.includes(tabKey)) {
            btn.style.setProperty('display', 'none', 'important');
        } else {
            if (tabKey === 'ventas_extras') {
                if (storeConfig.extrasEnabled !== false) {
                    btn.style.removeProperty('display');
                } else {
                    btn.style.setProperty('display', 'none', 'important');
                }
            } else if (tabKey === 'polla') {
                if (storeConfig.pollaEnabled !== false) {
                    btn.style.removeProperty('display');
                } else {
                    btn.style.setProperty('display', 'none', 'important');
                }
            } else {
                btn.style.removeProperty('display');
            }
        }
    });

    // Si la pestaña que estaba activa quedó oculta/apagada, activar la primera pestaña visible
    const currActive = document.querySelector('.tab-btn.active');
    if (currActive && (currActive.style.display === 'none' || disabledTabs.includes(currActive.dataset.tab))) {
        currActive.classList.remove('active');
        const firstVis = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.style.display !== 'none' && !disabledTabs.includes(b.dataset.tab));
        if (firstVis) {
            firstVis.classList.add('active');
            renderProducts(firstVis.dataset.tab);
        }
    }
}

function setupConfigUI() {
    // Maintenance Mode Check
    const maintenanceOverlay = document.getElementById('maintenance-overlay');
    const appContainer = document.querySelector('.app-container');
    if (storeConfig.maintenanceEnabled === true) {
        if (maintenanceOverlay) {
            maintenanceOverlay.style.display = 'flex';
            document.getElementById('maintenance-message').innerText = storeConfig.maintenanceMessage || 'Volveremos pronto.';
        }
        if (appContainer) appContainer.style.display = 'none';
        return; // Detener carga de UI
    } else {
        if (maintenanceOverlay) maintenanceOverlay.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
    }

    // Hide or process Code Modal options
    if (storeConfig.netflixEnabled === false) {
        let opt = codePlatformSelect.querySelector('option[value="netflix"]');
        if (opt) opt.remove();
    }
    if (storeConfig.disneyEnabled === false) {
        let opt = codePlatformSelect.querySelector('option[value="disney"]');
        if (opt) opt.remove();
    }

    if (storeConfig.netflixEnabled === false && storeConfig.disneyEnabled === false) {
        openCodeBtn.style.display = 'none';
    }

    // Dynamic Payment Methods
    const paymentMethodsContainer = document.getElementById('dynamic-payment-methods');
    const paymentMethodsSection = document.getElementById('payment-methods-section') || (paymentMethodsContainer ? paymentMethodsContainer.closest('.payment-methods') : null);
    if (paymentMethodsContainer) {
        let methodsHtml = '';
        const isMasterEnabled = storeConfig.paymentMethodsEnabled !== false;

        if (isMasterEnabled) {
            if (storeConfig.nequiEnabled !== false) {
                methodsHtml += `
                    <div class="method-card">
                        <img src="${storeConfig.nequiImg || 'assets/nequi_daviplata.png'}" alt="Nequi Daviplata" style="border-radius: 8px; max-height: 48px; object-fit: contain;">
                        <span>${storeConfig.nequiLabel || 'Nequi / Daviplata'}</span>
                    </div>`;
            }
            if (storeConfig.nuEnabled !== false) {
                methodsHtml += `
                    <div class="method-card">
                        <img src="${storeConfig.nuImg || 'assets/nu_bre.jpg'}" alt="Nu Bre b" style="border-radius: 8px; max-height: 48px; object-fit: contain;">
                        <span>${storeConfig.nuLabel || 'Nu / Bre b'}</span>
                    </div>`;
            }
        }

        paymentMethodsContainer.innerHTML = methodsHtml;
        if (paymentMethodsSection) {
            paymentMethodsSection.style.display = (isMasterEnabled && methodsHtml) ? 'block' : 'none';
        }
    }

    // Dynamic Tab Order
    if (storeConfig.tabOrder && Array.isArray(storeConfig.tabOrder)) {
        const tabsContainer = document.querySelector('.tabs');
        if (tabsContainer) {
            let order = [...storeConfig.tabOrder];
            if (!order.includes('premio_navideno')) {
                // Ensure Christmas tab stays highly visible near promotional tabs
                const promoIdx = order.indexOf('promociones');
                if (promoIdx !== -1) {
                    order.splice(promoIdx + 1, 0, 'premio_navideno');
                } else {
                    const findeIdx = order.indexOf('promociones_finde');
                    if (findeIdx !== -1) {
                        order.splice(findeIdx + 1, 0, 'premio_navideno');
                    } else {
                        order.splice(Math.min(2, order.length), 0, 'premio_navideno');
                    }
                }
            }
            const tabsArray = Array.from(tabsContainer.querySelectorAll('.tab-btn'));
                        tabsArray.sort((a, b) => {
                const idxA = order.indexOf(a.dataset.tab);
                const idxB = order.indexOf(b.dataset.tab);
                if (idxA === -1 && idxB === -1) return 0;
                if (idxA === -1) return 1;
                if (idxB === -1) return -1;
                return idxA - idxB;
            });
            tabsArray.forEach(tab => tabsContainer.appendChild(tab));
        }
    }

        // Dynamic Tab Visibility (Encendido / Apagado desde Panel Admin)
    applyTabsVisibility();

    // Bind Footer Links
    let waLinkHref = null;
    let fbLinkHref = null;
    let igLinkHref = null;
    let tkLinkHref = null;
    let kwLinkHref = null;
    let ytLinkHref = null;

    if (publicSellerRef) {
        if (publicSellerStoreData) {
            waLinkHref = publicSellerStoreData.whatsapp ? `https://wa.me/${formatWaPhone(publicSellerStoreData.whatsapp)}` : null;
            fbLinkHref = publicSellerStoreData.facebookUrl || null;
            igLinkHref = publicSellerStoreData.instagramUrl || null;
            tkLinkHref = publicSellerStoreData.tiktokUrl || null;
            kwLinkHref = publicSellerStoreData.kwaiUrl || null;
            ytLinkHref = publicSellerStoreData.youtubeUrl || null;
        }
    } else {
        waLinkHref = storeConfig.whatsappNumber ? `https://wa.me/${formatWaPhone(storeConfig.whatsappNumber)}` : null;
        fbLinkHref = storeConfig.facebookUrl || null;
        igLinkHref = storeConfig.instagramUrl || null;
        tkLinkHref = storeConfig.tiktokUrl || null;
        kwLinkHref = storeConfig.kwaiUrl || null;
        ytLinkHref = storeConfig.youtubeUrl || null;
    }

    const waLink = document.getElementById('footer-wa');
    if (waLink && waLinkHref) {
        waLink.href = waLinkHref;
        waLink.style.display = 'inline-block';
    } else if (waLink) waLink.style.display = 'none';

    const fbLink = document.getElementById('footer-fb');
    if (fbLink && fbLinkHref) {
        fbLink.href = fbLinkHref;
        fbLink.style.display = 'inline-block';
    } else if (fbLink) fbLink.style.display = 'none';

    const igLink = document.getElementById('footer-ig');
    if (igLink && igLinkHref) {
        igLink.href = igLinkHref;
        igLink.style.display = 'inline-block';
    } else if (igLink) igLink.style.display = 'none';

    const tkLink = document.getElementById('footer-tk');
    if (tkLink && tkLinkHref) {
        tkLink.href = tkLinkHref;
        tkLink.style.display = 'inline-block';
    } else if (tkLink) tkLink.style.display = 'none';

    const kwLink = document.getElementById('footer-kw');
    if (kwLink && kwLinkHref) {
        kwLink.href = kwLinkHref;
        kwLink.style.display = 'inline-block';
    } else if (kwLink) kwLink.style.display = 'none';

    const ytLink = document.getElementById('footer-yt');
    if (ytLink && ytLinkHref) {
        ytLink.href = ytLinkHref;
        ytLink.style.display = 'inline-block';
    } else if (ytLink) ytLink.style.display = 'none';

    // Toggle Reseller colors
    if (isSellerMode) {
        if (openVendedoresBtn) {
            openVendedoresBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span class="hide-mobile">👋 Hola, ${currentSellerName}</span>`;
            openVendedoresBtn.style.background = '#27ae60';
            openVendedoresBtn.style.color = 'white';
            openVendedoresBtn.style.borderColor = '#2ecc71';
            openVendedoresBtn.style.display = 'inline-flex';
        }

        // Hide "Mis Compras" button for sellers
        if (openClientBtn) openClientBtn.style.display = 'none';

        // Mostrar u ocultar botón "Obtener Código" en la barra superior para el vendedor según sus permisos del Centro Maestro
        const codeNavBtn = document.getElementById('open-code-btn');
        if (codeNavBtn) {
            const sellerCanCode = window.canSellerUseCodeActivation ? window.canSellerUseCodeActivation(currentSellerName) : true;
            if (sellerCanCode && !(storeConfig.netflixEnabled === false && storeConfig.disneyEnabled === false)) {
                codeNavBtn.style.display = 'inline-flex';
            } else {
                codeNavBtn.style.display = 'none';
            }
        }
    } else {
        if (openVendedoresBtn && !publicSellerRef) {
            openVendedoresBtn.innerHTML = `<i class="fa-solid fa-user-tie"></i> <span class="hide-mobile">Vendedores</span>`;
            openVendedoresBtn.style.background = 'rgba(138,43,226,0.15)';
            openVendedoresBtn.style.color = '#c48dfc';
            openVendedoresBtn.style.borderColor = 'rgba(138,43,226,0.3)';
            openVendedoresBtn.style.display = 'inline-flex';
        }
    }

    if (publicSellerRef) {
        if (openVendedoresBtn) openVendedoresBtn.style.display = 'none';
        // 'Mis Compras' ahora se mantiene visible en la tienda del vendedor
        if (openClientBtn) openClientBtn.style.display = 'inline-flex';
    }

    // Floating Banners Handling
    const bannerDiv = document.getElementById('floating-banner');
    const bannerText = document.getElementById('banner-text');
    if (bannerDiv && bannerText) {
        if (isSellerMode && storeConfig.sellerBannerEnabled && storeConfig.sellerBannerText) {
            bannerDiv.style.display = 'block';
            bannerText.innerText = storeConfig.sellerBannerText;
            bannerDiv.style.background = 'linear-gradient(90deg, #c48dfc, #8a2be2)';
            bannerDiv.style.boxShadow = '0 4px 15px rgba(138,43,226, 0.4)';
        } else if (!isSellerMode && storeConfig.clientBannerEnabled && storeConfig.clientBannerText) {
            // General Clients view (Including seller's clients)
            bannerDiv.style.display = 'block';
            bannerText.innerText = storeConfig.clientBannerText;
        } else {
            bannerDiv.style.display = 'none';
        }
    }

    // Featured Hero Banner
    const featuredContainer = document.getElementById('featured-hero-container');
    if (featuredContainer) {
        let banners = storeConfig.mainBanners || [];

        if (storeConfig.mainBannerEnabled && banners.length > 0) {
            let slidesHtml = '';
            banners.forEach((b, idx) => {
                const badge = b.badge || 'GRAN ESTRENO';
                const title = b.title || 'Película Destacada';
                const desc = b.desc || 'Disponible ahora en nuestra plataforma.';
                const img = b.img || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                const btnText = b.btnText || 'Ver Estrenos';
                let btnLink = b.btnLink || 'estrenos';

                let btnHtml = '';
                if (btnLink.startsWith('http')) {
                    btnHtml = `<button onclick="openVideoModal('${btnLink}')" class="featured-btn"><i class="fa-solid fa-play"></i> ${btnText}</button>`;
                } else {
                    btnHtml = `<button onclick="document.querySelector('.tab-btn[data-tab=\\'${btnLink}\\']')?.click();" class="featured-btn"><i class="fa-solid fa-play"></i> ${btnText}</button>`;
                }

                slidesHtml += `
                    <div class="featured-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${img}');">
                        <div class="featured-content">
                            <span class="featured-badge">${badge}</span>
                            <h2 class="featured-title">${title}</h2>
                            <p class="featured-desc">${desc}</p>
                            ${btnHtml}
                        </div>
                    </div>
                `;
            });

            const controlsHtml = banners.length > 1 ? `
                <button class="slider-btn prev" onclick="moveBannerSlider(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                <button class="slider-btn next" onclick="moveBannerSlider(1)"><i class="fa-solid fa-chevron-right"></i></button>
            ` : '';

            featuredContainer.innerHTML = `
                <div class="featured-slider">
                    ${slidesHtml}
                    ${controlsHtml}
                </div>
            `;
            featuredContainer.style.display = 'block';
            const heroTitleCont = document.querySelector('.hero');
            if (heroTitleCont) heroTitleCont.style.display = 'none';

            // Auto start timer
            if (banners.length > 1) {
                if (window.bannerIntervalId) clearInterval(window.bannerIntervalId);
                window.bannerIntervalId = setInterval(() => { moveBannerSlider(1); }, 10000);
            }
        } else {
            featuredContainer.style.display = 'none';
            const heroTitleCont = document.querySelector('.hero');
            if (heroTitleCont) heroTitleCont.style.display = 'block';
        }
    }

    // Ventas Extras Tab Visibility
    const tabVentasExtras = document.getElementById('tab-ventas-extras');
    if (tabVentasExtras) {
        let showVentasExtras = false;
        let targetSeller = null;
        if (publicSellerRef) targetSeller = publicSellerRef;
        else if (isSellerMode) targetSeller = currentSellerName;

        if (targetSeller) {
            const sellers = storeConfig.sellers || [];
            const profile = sellers.find(s => s.name === targetSeller);
            if (profile && profile.extraSalesEnabled === true) {
                showVentasExtras = true;
            }
        } else {
            // Global admin can always see
            showVentasExtras = true;
        }
        tabVentasExtras.style.display = showVentasExtras ? 'inline-block' : 'none';
    }
}

window.moveBannerSlider = function (dir) {
    const slides = document.querySelectorAll('.featured-slide');
    if (slides.length <= 1) return;
    let currentIdx = -1;
    slides.forEach((sl, idx) => {
        if (sl.classList.contains('active')) currentIdx = idx;
        sl.classList.remove('active');
    });
    if (currentIdx === -1) currentIdx = 0;

    let nextIdx = currentIdx + dir;
    if (nextIdx >= slides.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = slides.length - 1;

    slides[nextIdx].classList.add('active');

    if (window.bannerIntervalId) {
        clearInterval(window.bannerIntervalId);
        window.bannerIntervalId = setInterval(() => { moveBannerSlider(1); }, 10000);
    }
}

window.openVideoModal = function (url) {
    const modal = document.getElementById('video-modal');
    if (!modal) return window.open(url, '_blank');
    const iframe = document.getElementById('video-iframe');
    let iframeSrc = url;
    if (url.includes('youtube.com/watch?v=')) {
        iframeSrc = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
        iframeSrc = url.replace('youtu.be/', 'youtube.com/embed/');
    }
    iframe.src = iframeSrc;
    modal.style.display = 'block';
}

window.openImageViewer = function (imgSrc) {
    const modal = document.getElementById('image-viewer-modal');
    const imgEl = document.getElementById('image-viewer-img');
    if (modal && imgEl) {
        imgEl.src = imgSrc;
        modal.style.display = 'flex';
    }
}

function getPrice(product) {
    if (isSellerMode && product.sellerPrice) {
        return product.sellerPrice || 0;
    }
    return product.price || 0;
}

function renderProducts(category) {
    const pollaGrid = document.getElementById('polla-grid');
    const navGrid = document.getElementById('premio-navideno-grid');

    if (category === 'polla') {
        productsGrid.style.display = 'none';
        if (navGrid) navGrid.style.display = 'none';
        if (pollaGrid) pollaGrid.style.display = 'block';
        return;
    } else if (category === 'premio_navideno') {
        productsGrid.style.display = 'none';
        if (pollaGrid) pollaGrid.style.display = 'none';
        if (navGrid) {
            navGrid.style.display = 'block';
            window.renderPremioNavideno();
        }
        return;
    } else {
        productsGrid.style.display = 'grid';
        if (pollaGrid) pollaGrid.style.display = 'none';
        if (navGrid) navGrid.style.display = 'none';
    }

    productsGrid.innerHTML = '';

    // CASO ESPECIAL TAB ESTRENOS
    if (category === 'estrenos') {
        const estrenos = storeConfig.estrenos || [];
        if (estrenos.length === 0) {
            productsGrid.innerHTML = `<p style="color:var(--text-secondary); grid-column:1/-1; text-align:center;">Próximamente agregaremos los nuevos estrenos.</p>`;
            return;
        }

        const estByMonth = {};
        estrenos.forEach(item => {
            const m = item.month || 'Otros';
            if (!estByMonth[m]) estByMonth[m] = [];
            estByMonth[m].push(item);
        });

        const monthOrder = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "Otros"];

        monthOrder.forEach(mName => {
            if (estByMonth[mName] && estByMonth[mName].length > 0) {
                const mTitle = document.createElement('h2');
                mTitle.style.gridColumn = '1 / -1';
                mTitle.style.margin = '1.5rem 0 0.5rem 0';
                mTitle.style.borderBottom = '1px solid var(--glass-border)';
                mTitle.style.paddingBottom = '0.5rem';
                mTitle.style.color = 'var(--text-primary)';
                mTitle.style.fontSize = '1.3rem';
                mTitle.innerHTML = `<i class="fa-regular fa-calendar" style="color:var(--accent-primary);"></i> Estrenos de ${mName}`;
                productsGrid.appendChild(mTitle);

                estByMonth[mName].forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'product-card';

                    let videoId = null;
                    if (item.url.includes('youtube.com/watch?v=')) {
                        videoId = item.url.split('v=')[1]?.split('&')[0];
                    } else if (item.url.includes('youtu.be/')) {
                        videoId = item.url.split('youtu.be/')[1]?.split('?')[0];
                    }
                    const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://img.icons8.com/color/96/movie.png';

                    card.innerHTML = `
                        <div style="position:relative; border-radius:12px; overflow:hidden; margin-bottom:1rem; cursor:pointer;" onclick="openVideoModal('${item.url}')">
                            <img src="${thumbUrl}" alt="Trailer" style="width:100%; height:200px; object-fit:cover; display:block;">
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:var(--accent-primary); width:50px; height:50px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                                <i class="fa-solid fa-play" style="color:black; font-size:1.5rem; margin-left:5px;"></i>
                            </div>
                        </div>
                        <h3 class="product-title" style="margin-top:auto;">${item.title}</h3>
                        <p class="product-desc" style="margin-bottom:0;">🍿 Tráiler Oficial</p>
                    `;
                    productsGrid.appendChild(card);
                });
            }
        });
        return;
    }

    let targetSeller = null;
    if (publicSellerRef) targetSeller = publicSellerRef;
    else if (isSellerMode) targetSeller = currentSellerName;
    let scopeOwner = targetSeller ? targetSeller : 'admin';

    const filtered = category === 'all'
        ? products.filter(p => {
            if (p.active === false) return false;
            if (p.category === 'ventas_extras') return false; // Exclude from 'Todos'
            return true;
        })
        : products.filter(p => {
            if (p.category !== category || p.active === false) return false;
            return true;
        });

    filtered.forEach(product => {
        product._usingReserve = null;
        const card = document.createElement('div');
        card.className = 'product-card';
        // Usar imagen por defecto si no tiene
        const imgUrl = product.image || 'https://img.icons8.com/color/96/movie.png';
        const displayPrice = getPrice(product);

        let sellerBadge = isSellerMode ? `<span style="background:#27ae60; color:white; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:0.5rem">Precio Vendedor</span>` : '';
        let inStock = product.inStock !== false;

        let bypassReserveUser = null;
        if (isSellerMode && currentSellerName) {
            bypassReserveUser = currentSellerName;
        } else if (!isSellerMode && window.clientPhoneLoggedIn) {
            bypassReserveUser = window.clientPhoneLoggedIn;
        }

        // Allow bypassing 'Agotado' status if specifically authorized 
        if (!inStock && bypassReserveUser) {
            let userRules = null;
            if (product.reserveRules && product.reserveRules[bypassReserveUser]) {
                userRules = product.reserveRules[bypassReserveUser];
            } else if (product.allowExhaustedSeller) {
                const allowedList = product.allowExhaustedSeller.split(',').map(x => x.trim());
                if (allowedList.includes(bypassReserveUser)) {
                    userRules = { stock: null, date: '' };
                }
            }

            if (userRules) {
                if (userRules.date) {
                    const expiryTime = new Date(userRules.date + "T23:59:59").getTime();
                    if (Date.now() > expiryTime) {
                        userRules = null;
                    }
                }
                if (userRules && userRules.stock !== null && userRules.stock !== undefined) {
                    if (userRules.stock <= 0) {
                        userRules = null;
                    }
                }
            }

            if (userRules) {
                inStock = true;
                product._usingReserve = bypassReserveUser;
            }
        }

        let buttonHtml = inStock
            ? `<button class="btn-add" onclick="addToCart(${product.id})">Agregar</button>`
            : `<button class="btn-add" style="background:#ff4d4d; color:white; border-color:#ff4d4d; cursor:not-allowed;" disabled>Agotado</button>`;

        let imgHtml = '';
        if (product.category === 'promociones' || product.category === 'promociones_finde' || product.category === 'ventas_extras') {
            imgHtml = `
            <div style="text-align:center; margin-bottom:1rem; cursor:zoom-in; position:relative; display:inline-block;" onclick="openImageViewer('${imgUrl}')">
                <img src="${imgUrl}" alt="${product.brand}" style="width:100%; max-width:140px; height:85px; object-fit:contain; border-radius:8px;">
                <div style="position:absolute; top:4px; right:4px; background:rgba(0,0,0,0.6); padding:4px; border-radius:4px; border:1px solid rgba(255,255,255,0.2);">
                    <i class="fa-solid fa-magnifying-glass" style="color:white; font-size:0.8rem;"></i>
                </div>
            </div>`;
        } else {
            imgHtml = `
            <div style="text-align:center; margin-bottom:1rem">
                <img src="${imgUrl}" alt="${product.brand}" style="width:100%; max-width:140px; height:85px; object-fit:contain">
            </div>`;
        }

        card.innerHTML = `
            ${imgHtml}
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.8rem;">
                ${product.brand ? `<span class="brand-badge" style="margin-bottom: 0;">${product.brand}</span>` : ''}
                ${product.months && product.months > 1 ? `<span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(0, 210, 211, 0.15); color: #00d2d3; border: 1px solid #00d2d3; border-radius: 20px; padding: 3px 10px; font-size: 0.72rem; font-weight: bold;"><i class="fa-solid fa-calendar-days"></i> ${product.months} Meses</span>` : ''}
            </div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc" style="margin-bottom: 0.5rem">${product.desc || 'Pantalla original premium con garantía.'}</p>
            ${isSellerMode ? `<div style="color: #00d2d3; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;"><i class="fa-solid fa-tag"></i> Sugerido al Cliente: $${product.price.toLocaleString()}</div>` : ''}
            ${sellerBadge}
            ${product.stock > 0 ? `<div style="color:#f39c12; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.5rem;"><i class="fa-solid fa-layer-group"></i> Disponibles: ${product.stock}</div>` : ''}
            <div class="price-row" style="margin-top:1rem">
                <span class="price">$${displayPrice.toLocaleString()}</span>
                ${buttonHtml}
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) cart.push({ ...product });
    updateCartUI();

    // Simple toast or feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = '✅ Añadido';
    btn.style.background = '#4cd137';
    btn.style.color = 'white';
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = 'white';
        btn.style.color = '#0a0a0c';
    }, 1000);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    renderCartItems();
}

function processCartDiscounts() {
    let individualCount = cart.filter(p => p.category === 'individual').length;
    let isClientPromoActive = !isSellerMode && storeConfig.clientBannerEnabled && storeConfig.clientPromoLimit > 0 && storeConfig.clientPromoDiscount > 0;
    let isSellerPromoActive = isSellerMode && storeConfig.sellerBannerEnabled && storeConfig.sellerPromoLimit > 0 && storeConfig.sellerPromoDiscount > 0;

    let promoLimit = isClientPromoActive ? storeConfig.clientPromoLimit : (isSellerPromoActive ? storeConfig.sellerPromoLimit : 0);
    let promoDiscount = isClientPromoActive ? storeConfig.clientPromoDiscount : (isSellerPromoActive ? storeConfig.sellerPromoDiscount : 0);

    let promoCount = 0;
    let promoDiscountTotal = 0;
    let genericDiscountTotal = 0;
    let total = 0;
    let processedCart = [];

    cart.forEach(item => {
        let basePrice = getPrice(item);
        let finalPrice = basePrice;
        let discountNote = "";
        let isIndividual = item.category === 'individual';

        if (isIndividual) {
            let isPromoBannerActiveEnabled = (isClientPromoActive || isSellerPromoActive);
            let isGenericDiscountApplicable = individualCount >= 2;
            let appliedPromo = false;

            if (isPromoBannerActiveEnabled) {
                // Solo aplicar si alcanza o supera el límite de pantallas solicitado para la promo
                if (individualCount >= promoLimit && promoCount < promoLimit) {
                    finalPrice -= promoDiscount;
                    promoCount++;
                    discountNote = `<span style="color:${isSellerMode ? '#c48dfc' : '#ff416c'}; font-size:0.7rem">(-$${promoDiscount.toLocaleString()} PROMO)</span>`;
                    promoDiscountTotal += promoDiscount;
                    appliedPromo = true;
                }
            }

            // Si la promocion no aplica para este item (porq no alcanza limite, o ya se pasó límite),
            // debe aplicar el descuento normalito como respaldo.
            if (!appliedPromo && isGenericDiscountApplicable) {
                if (!isSellerMode && storeConfig.discountEnabled && storeConfig.discountAmount > 0) {
                    finalPrice -= storeConfig.discountAmount;
                    discountNote = `<span style="color:#4cd137; font-size:0.7rem">(-$${storeConfig.discountAmount.toLocaleString()} Combo Propio)</span>`;
                    genericDiscountTotal += storeConfig.discountAmount;
                } else if (isSellerMode && storeConfig.sellerDiscountEnabled && storeConfig.sellerDiscountAmount > 0) {
                    finalPrice -= storeConfig.sellerDiscountAmount;
                    discountNote = `<span style="color:#2ab7ca; font-size:0.7rem">(-$${storeConfig.sellerDiscountAmount.toLocaleString()} Dcto Mayorista)</span>`;
                    genericDiscountTotal += storeConfig.sellerDiscountAmount;
                }
            }
        }

        total += finalPrice;
        processedCart.push({
            ...item,
            finalPrice,
            discountNote
        });
    });

    return { processedCart, total, promoDiscountTotal, genericDiscountTotal, actualPromoCount: promoCount };
}

function updateCartUI() {
    cartBadge.innerText = cart.length;
    let stats = processCartDiscounts();
    cartTotalLabel.innerText = `$${stats.total.toLocaleString()}`;

    const customContainer = document.getElementById('seller-custom-client-price-container');
    if (customContainer) {
        if (isSellerMode && cart.length > 0) {
            customContainer.style.display = 'block';
        } else {
            customContainer.style.display = 'none';
        }
    }
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let stats = processCartDiscounts();

    stats.processedCart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div style="flex: 1;">
                <p style="font-weight:600; margin-bottom: 0.2rem;">${item.name} ${item.discountNote}</p>
                <input type="text" class="input-modern cart-custom-name" data-index="${index}" placeholder="Nombre o Alias (Ej: Para María)" value="${item.customName || ''}" style="padding: 0.3rem; font-size: 0.8rem; width: 100%; border: 1px solid var(--glass-border); border-radius: 4px; background: rgba(0,0,0,0.2);">
                <p style="font-size:0.8rem; color:#a0a0a0; margin-top: 0.3rem;">$${item.finalPrice.toLocaleString()}</p>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4d00; cursor:pointer; padding: 0.5rem;">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(div);
    });

    // Add event listeners for custom names
    document.querySelectorAll('.cart-custom-name').forEach(input => {
        input.addEventListener('change', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            if (cart[idx]) cart[idx].customName = e.target.value.trim();
        });
    });
}

function setupEventListeners() {
    if (sellerSearchSales) {
        sellerSearchSales.addEventListener('input', renderSellerDashboard);
    }
    // Tabs Menu Toggle
    const tabsMenuBtn = document.getElementById('tabs-menu-btn');
    const categoryTabs = document.getElementById('category-tabs');

    if (tabsMenuBtn && categoryTabs) {
        tabsMenuBtn.addEventListener('click', () => {
            categoryTabs.classList.toggle('show-menu');
        });
    }

    // Refresh Page Btn
    const refreshBtn = document.getElementById('refresh-page-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const sep = window.location.href.includes('?') ? '&' : '?';
            window.location.href = window.location.href.split('#')[0] + sep + 't=' + Date.now();
        });
    }

    // Tabs
    const allTabButtons = document.querySelectorAll('.tab-btn');
    allTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.tab);
            if (categoryTabs) categoryTabs.classList.remove('show-menu');
        });
    });

    // Modal
    openCartBtn.addEventListener('click', () => {
        renderCartItems();
        if (isSellerMode) {
            document.getElementById('recurrent-client-container').style.display = 'none';
            document.getElementById('recurrent-client').checked = false;
            document.getElementById('new-client-form').style.display = 'block';

            // Populate Dropdown
            if (sellerClientSelector && sellerClientsDropdown) {
                sellerClientSelector.style.display = 'block';

                // Add search input if not exists at the TOP
                let searchInput = document.getElementById('seller-client-search');
                if (!searchInput) {
                    searchInput = document.createElement('input');
                    searchInput.id = 'seller-client-search';
                    searchInput.type = 'text';
                    searchInput.className = 'input-modern';
                    searchInput.placeholder = '🔍 Buscar cliente guardado...';
                    searchInput.style.marginBottom = '0.5rem';
                    searchInput.style.padding = '0.5rem';
                    searchInput.style.fontSize = '0.95rem';
                    searchInput.style.border = '1px solid var(--accent-primary)';
                    sellerClientSelector.prepend(searchInput);

                    searchInput.addEventListener('input', (e) => {
                        const query = e.target.value.toLowerCase();
                        let found = false;
                        Array.from(sellerClientsDropdown.options).forEach((opt, idx) => {
                            if (idx === 0) return; // ignore first
                            if (opt.value === "") return;
                            const text = opt.text.toLowerCase();
                            const isMatch = text.includes(query);
                            opt.hidden = !isMatch;
                            if (isMatch) found = true;
                        });
                    });
                } else {
                    searchInput.value = '';
                }

                db.ref(`sellerSales/${currentSellerName}`).once('value').then(snap => {
                    const sales = snap.val();
                    sellerClientsDropdown.innerHTML = '<option value="">-- Nuevo Cliente / Escribir Manual --</option>';
                    if (sales) {
                        // Get unique clients
                        const uniqueClients = {};
                        Object.keys(sales).forEach(key => {
                            const cName = sales[key].clientName;
                            const cPhone = sales[key].clientPhone || '';
                            const clientId = (cName + cPhone).toLowerCase().replace(/\s/g, '');

                            // Detalle 2: No mostrar CRM en la lista de clientes del vendedor
                            const isCRM = cName && cName.toLowerCase().trim() === 'crm';

                            if (cName && !isCRM && !uniqueClients[clientId]) {
                                uniqueClients[clientId] = {
                                    name: cName,
                                    phone: cPhone,
                                    city: sales[key].clientCity || ''
                                };
                            }
                        });

                        Object.values(uniqueClients).sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
                            const opt = document.createElement('option');
                            opt.value = encodeURIComponent(JSON.stringify({ name: c.name, phone: c.phone, city: c.city }));
                            opt.text = `${c.name} (${c.phone})`;
                            sellerClientsDropdown.appendChild(opt);
                        });
                    }
                });
            }
        }
        cartModal.style.display = 'block';
    });

    if (sellerClientsDropdown) {
        sellerClientsDropdown.addEventListener('change', (e) => {
            if (!e.target.value) {
                // Clear fields if returning to empty
                document.getElementById('client-name').value = '';
                document.getElementById('client-phone').value = '';
                document.getElementById('client-city').value = '';
                return;
            }
            const data = JSON.parse(decodeURIComponent(e.target.value));
            document.getElementById('client-name').value = data.name;
            document.getElementById('client-phone').value = data.phone;
            document.getElementById('client-city').value = data.city;
        });
    }

    closeModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    openCodeBtn.addEventListener('click', () => {
        document.getElementById('code-loading').style.display = 'none';
        document.getElementById('code-result').style.display = 'none';
        document.getElementById('code-error').style.display = 'none';
        codeModal.style.display = 'block';
    });

    closeCodeBtn.addEventListener('click', () => {
        if (window.closeCodeModal) window.closeCodeModal();
        else codeModal.style.display = 'none';
    });

    openVendedoresBtn.addEventListener('click', () => {
        if (isSellerMode) {
            renderSellerDashboard();
            sellerDashboardModal.style.display = 'block';
            return;
        }

        document.getElementById('seller-username').value = '';
        document.getElementById('seller-password').value = '';
        sellerModal.style.display = 'block';
        setTimeout(() => document.getElementById('seller-username')?.focus(), 100);
    });

    if (openClientBtn) {
        openClientBtn.addEventListener('click', () => {
            if (clientPhoneLoggedIn) {
                renderClientDashboard();
                clientDashboardModal.style.display = 'block';
            } else {
                clientLoginStep1.style.display = 'block';
                clientLoginStep2.style.display = 'none';
                document.getElementById('client-login-phone').value = '';
                clientLoginPin.value = '';
                clientLoginModal.style.display = 'block';
                setTimeout(() => document.getElementById('client-login-phone')?.focus(), 100);
            }
        });
    }

    closeSellerBtn.addEventListener('click', () => {
        sellerModal.style.display = 'none';
    });

    if (closeSellerDashBtn) {
        closeSellerDashBtn.addEventListener('click', () => {
            sellerDashboardModal.style.display = 'none';
            // Desregistrar listener en tiempo real al cerrar el panel
            if (_sellerDashboardRef && _sellerDashboardListener) {
                _sellerDashboardRef.off('value', _sellerDashboardListener);
                _sellerDashboardListener = null;
            }
        });
    }

    if (closeReminderBtn) {
        closeReminderBtn.addEventListener('click', () => {
            reminderEditorModal.style.display = 'none';
        });
    }

    if (logoutSellerBtn) {
        logoutSellerBtn.addEventListener('click', () => {
            if (confirm(`¿Deseas cerrar la sesión del vendedor "${currentSellerName}" y volver a los precios de cliente regular?`)) {
                // Desregistrar listener al salir
                if (_sellerDashboardRef && _sellerDashboardListener) {
                    _sellerDashboardRef.off('value', _sellerDashboardListener);
                    _sellerDashboardListener = null;
                }
                localStorage.removeItem('isSellerMode');
                localStorage.removeItem('sellerName');
                window.location.reload();
            }
        });
    }

    if (sendReminderWhatsappBtn) {
        sendReminderWhatsappBtn.addEventListener('click', () => {
            const saleId = remindSaleIdInput.value;
            const newPhone = window.sanitizePhone(remindPhoneInput.value);
            const rawMsg = remindMsgInput.value;

            if (saleId && newPhone && isSellerMode) {
                // Update specific phone field in Firebase for this sale if changed
                db.ref(`sellerSales/${currentSellerName}/${saleId}/clientPhone`).set(newPhone);
            }

            const phoneSegment = newPhone.length > 8 ? newPhone : '';
            const encoded = encodeURIComponent(rawMsg);

            if (phoneSegment) {
                window.openWhatsapp(formatWaPhone(phoneSegment), decodeURIComponent(encoded));
            } else {
                window.openWhatsapp(null, decodeURIComponent(encoded));
            }

            reminderEditorModal.style.display = 'none';
        });
    }

    if (closeClientLoginBtn) {
        closeClientLoginBtn.addEventListener('click', () => clientLoginModal.style.display = 'none');
    }
    if (closeClientDashBtn) {
        closeClientDashBtn.addEventListener('click', () => clientDashboardModal.style.display = 'none');
    }

    const videoModalClose = document.getElementById('video-modal-close');
    if (videoModalClose) {
        videoModalClose.addEventListener('click', () => {
            document.getElementById('video-modal').style.display = 'none';
            const iframe = document.getElementById('video-iframe');
            if (iframe) iframe.src = '';
        });
    }

    if (btnClientNext) {
        btnClientNext.addEventListener('click', async () => {
            const phone = window.sanitizePhone(document.getElementById('client-login-phone').value);
            if (!phone || phone.length < 5) return alert('Ingresa un número válido de celular sin espacios.');
            if (storeConfig.blockedClients && storeConfig.blockedClients.includes(phone)) {
                return alert('⚠️ Este número de celular ha sido bloqueado por el administrador. Contacta con soporte.');
            }

            // Revisa perfil de PIN
            try {
                const snap = await db.ref(`clientProfiles/${phone}/pin`).once('value');
                const existingPin = snap.val();
                windowTempClientPhone = phone;

                if (existingPin) {
                    windowTempClientPin = existingPin.toString();
                    pinMessage.innerHTML = 'Ingresa tu PIN de seguridad (4 dígitos).';
                    forgotPinBtn.style.display = 'block';
                } else {
                    windowTempClientPin = null;
                    pinMessage.innerHTML = 'Crea un PIN de 4 números para proteger tus compras a partir de ahora.';
                    forgotPinBtn.style.display = 'none';
                }

                clientLoginStep1.style.display = 'none';
                clientLoginStep2.style.display = 'block';
                setTimeout(() => clientLoginPin?.focus(), 100);
            } catch (err) {
                alert('Error al validar tu número');
                console.error(err);
            }
        });

        const clientPhoneInput = document.getElementById('client-login-phone');
        if (clientPhoneInput) {
            clientPhoneInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    btnClientNext.click();
                }
            });
        }
    }

    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => {
            clientLoginStep2.style.display = 'none';
            clientLoginStep1.style.display = 'block';
            clientLoginPin.value = '';
        });
    }

    if (forgotPinBtn) {
        forgotPinBtn.addEventListener('click', () => {
            const adminWa = storeConfig.whatsappNumber || '573155182545';
            const text = encodeURIComponent(`Hola, olvidé el PIN de mi cuenta en Streaming DPC. Mi número registrado es ${windowTempClientPhone}. Solicito un reseteo por favor.`);
            window.open(`https://wa.me/${formatWaPhone(adminWa)}?text=${text}`, '_blank');
        });
    }

    if (successWhatsappBtn) {
        successWhatsappBtn.addEventListener('click', () => {
            const encoded = encodeURIComponent(pendingWhatsappMessage);
            window.openWhatsapp(pendingWhatsappNumber, decodeURIComponent(encoded));

            // Cerrar modal y refrescar para limpiar estado
            successModal.style.display = 'none';
            setTimeout(() => window.location.reload(), 1000);
        });
    }

    if (loginClientBtn) {
        loginClientBtn.addEventListener('click', () => {
            const typedPin = clientLoginPin.value.trim();
            if (!typedPin || typedPin.length !== 4) return alert('El PIN debe tener 4 dígitos.');

            if (windowTempClientPin) {
                // Login against existing PIN
                if (typedPin !== windowTempClientPin) {
                    return alert('❌ PIN Incorrecto. Intenta de nuevo.');
                }
            } else {
                // Register new PIN
                db.ref(`clientProfiles/${windowTempClientPhone}/pin`).set(typedPin);
            }

            // Success Access
            localStorage.setItem('clientPhone', windowTempClientPhone);
            clientPhoneLoggedIn = windowTempClientPhone;
            if (window.startCodeAttemptsLiveSync) {
                window.startCodeAttemptsLiveSync(clientPhoneLoggedIn);
            }
            // Mostrar botón "Obtener Código" al iniciar sesión
            const codeNavBtn = document.getElementById('open-code-btn');
            if (codeNavBtn) codeNavBtn.style.display = 'inline-flex';
            clientLoginModal.style.display = 'none';
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Sesión iniciada con éxito!',
                    text: 'Bienvenido. Puedes ver tu historial de pantallas cuando desees desde el botón "Mis Compras".',
                    timer: 1800,
                    showConfirmButton: false,
                    background: '#1a1a1a',
                    color: '#fff'
                });
            }
        });

        if (clientLoginPin) {
            clientLoginPin.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    loginClientBtn.click();
                }
            });
        }
    }

    const changeClientPinBtn = document.getElementById('change-client-pin-btn');
    if (changeClientPinBtn) {
        changeClientPinBtn.addEventListener('click', () => {
            const currentPin = prompt('Por seguridad, ingresa tu PIN ACTUAL (4 dígitos):');
            if (currentPin === null) return;

            if (currentPin !== windowTempClientPin) {
                return alert('❌ El PIN actual ingresado no coincide.');
            }

            const newPin = prompt('Ingresa tu NUEVO PIN (4 dígitos numéricos):');
            if (newPin === null) return;

            if (!/^\d{4}$/.test(newPin.trim())) {
                return alert('❌ El nuevo PIN debe contener exactamente 4 números. Inténtalo de nuevo.');
            }

            db.ref(`clientProfiles/${clientPhoneLoggedIn}/pin`).set(newPin.trim()).then(() => {
                windowTempClientPin = newPin.trim();
                alert('¡Éxito! Tu PIN ha sido actualizado correctamente. A partir de ahora deberás usar tu nuevo PIN para ingresar.');
            }).catch(err => {
                alert('Error al actualizar el PIN: ' + err.message);
            });
        });
    }

    if (logoutClientBtn) {
        logoutClientBtn.addEventListener('click', () => {
            if (window.stopCodeAttemptsLiveSync) {
                window.stopCodeAttemptsLiveSync();
            }
            window.clientUsedAttempts = {};
            if (window.updateCodeCountersUI) window.updateCodeCountersUI();
            localStorage.removeItem('clientPhone');
            clientPhoneLoggedIn = '';
            // Ocultar "Obtener Código" y restaurar "Vendedores" al cerrar sesión
            const codeNavBtn = document.getElementById('open-code-btn');
            if (codeNavBtn) codeNavBtn.style.display = 'none';
            const vendBtn = document.getElementById('open-vendedores-btn');
            if (vendBtn) vendBtn.style.display = 'inline-flex';
            clientDashboardModal.style.display = 'none';
            alert('Sesión cerrada. Vuelve pronto.');
        });
    }

    const imageViewerClose = document.getElementById('image-viewer-close');
    const imageViewerModal = document.getElementById('image-viewer-modal');
    if (imageViewerClose && imageViewerModal) {
        imageViewerClose.addEventListener('click', () => {
            imageViewerModal.style.display = 'none';
        });
        imageViewerModal.addEventListener('click', (e) => {
            if (e.target === imageViewerModal) {
                imageViewerModal.style.display = 'none';
            }
        });
    }

    loginSellerBtn.addEventListener('click', () => {
        const uName = document.getElementById('seller-username').value.trim();
        const uPass = document.getElementById('seller-password').value.trim();

        if (!uName || !uPass) return alert('Por favor, ingresa un nombre y contraseña.');

        const sellers = storeConfig.sellers || [];

        const found = sellers.find(s => s.name.toLowerCase() === uName.toLowerCase() && s.password === uPass);

        if (found) {
            localStorage.setItem('isSellerMode', 'true');
            localStorage.setItem('sellerName', found.name);
            alert(`¡Bienvenido ${found.name}! Ahora cuentas con acceso a los precios mayoristas.`);
            window.location.reload();
        } else {
            alert('❌ Nombre o contraseña incorrectos.');
        }
    });

    const sellerUsernameInput = document.getElementById('seller-username');
    const sellerPasswordInput = document.getElementById('seller-password');

    if (sellerUsernameInput) {
        sellerUsernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!sellerPasswordInput?.value.trim()) {
                    sellerPasswordInput?.focus();
                } else {
                    loginSellerBtn?.click();
                }
            }
        });
    }

    if (sellerPasswordInput) {
        sellerPasswordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginSellerBtn?.click();
            }
        });
    }

    const recurrentClientCheck = document.getElementById('recurrent-client');
    const newClientForm = document.getElementById('new-client-form');
    recurrentClientCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            newClientForm.style.display = 'none';
        } else {
            newClientForm.style.display = 'block';
        }
    });

    // Device constraint check (maximum 2)
    const deviceChecks = document.querySelectorAll('#client-devices input[type="checkbox"]');
    deviceChecks.forEach(chk => {
        chk.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('#client-devices input[type="checkbox"]:checked').length;
            if (checkedCount > 2) {
                chk.checked = false;
                alert('Solo puedes seleccionar un máximo de 2 opciones de dispositivos.');
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
        if (e.target === codeModal) {
            if (window.closeCodeModal) window.closeCodeModal();
            else codeModal.style.display = 'none';
        }
        if (e.target === sellerModal) sellerModal.style.display = 'none';
        if (sellerDashboardModal && e.target === sellerDashboardModal) {
            sellerDashboardModal.style.display = 'none';
            // Desregistrar listener en tiempo real al cerrar el panel
            if (_sellerDashboardRef && _sellerDashboardListener) {
                _sellerDashboardRef.off('value', _sellerDashboardListener);
                _sellerDashboardListener = null;
            }
        }
        if (reminderEditorModal && e.target === reminderEditorModal) reminderEditorModal.style.display = 'none';
        if (sellerStoreModal && e.target === sellerStoreModal) sellerStoreModal.style.display = 'none';
        if (clientLoginModal && e.target === clientLoginModal) clientLoginModal.style.display = 'none';
        if (clientDashboardModal && e.target === clientDashboardModal) clientDashboardModal.style.display = 'none';
    });

    if (closeSellerStoreBtn) closeSellerStoreBtn.addEventListener('click', () => sellerStoreModal.style.display = 'none');

    if (openSellerStoreBtn) {
        openSellerStoreBtn.addEventListener('click', async () => {
            if (!sellerStoreModal) return;
            // Generate link
            const baseUrl = window.location.origin + window.location.pathname;
            storeLinkInput.value = `${baseUrl}?ref=${encodeURIComponent(currentSellerName)}`;

            // Try to load existing data
            const snap = await db.ref(`sellerStores/${currentSellerName}`).once('value');
            const data = snap.val() || {};

            storeWhatsappInput.value = data.whatsapp || '';
            if (storeFacebookInput) storeFacebookInput.value = data.facebookUrl || '';
            if (storeInstagramInput) storeInstagramInput.value = data.instagramUrl || '';
            if (storeTiktokInput) storeTiktokInput.value = data.tiktokUrl || '';
            if (storeKwaiInput) storeKwaiInput.value = data.kwaiUrl || '';
            if (storeYoutubeInput) storeYoutubeInput.value = data.youtubeUrl || '';
            if (storePaymentInfoInput) storePaymentInfoInput.value = data.paymentInfo || '';
            const existingPrices = data.prices || {};

            // Render products inputs
            storePricesList.innerHTML = '';
            products.filter(p => {
                if (p.active === false) return false;
                if (p.category === 'ventas_extras' && p.owner !== currentSellerName) return false;
                return true;
            }).forEach(p => {
                const myCost = p.sellerPrice || p.price;
                const publicPrice = existingPrices[p.id] || p.price;

                const div = document.createElement('div');
                div.innerHTML = `
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; border: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <div style="flex:1; min-width:150px;">
                            <strong style="color:white; display:block;">${p.name}</strong>
                            <span style="font-size:0.8rem; color:#a0a0a0;">Costo: $${myCost.toLocaleString()}</span>
                        </div>
                        <div style="width:120px;">
                            <label style="font-size:0.75rem; color:#4cd137;">Precio de Venta ($):</label>
                            <input type="number" class="store-custom-price input-modern" data-id="${p.id}" value="${publicPrice}" style="padding: 5px;">
                        </div>
                    </div>
                `;
                storePricesList.appendChild(div);
            });

            sellerStoreModal.style.display = 'block';
        });
    }

    if (storeLinkInput) storeLinkInput.addEventListener('click', () => {
        storeLinkInput.select();
        document.execCommand('copy');
        alert("Enlace copiado al portapapeles. ¡Envíalo a tus clientes!");
    });

    if (saveStoreBtn) {
        saveStoreBtn.addEventListener('click', () => {
            const wpp = window.sanitizePhone(storeWhatsappInput.value);
            if (!wpp) return alert('Debes agregar tu número de WhatsApp para poder recibir los pedidos de tus clientes.');
            const fbUrl = storeFacebookInput ? storeFacebookInput.value.trim() : '';
            const igUrl = storeInstagramInput ? storeInstagramInput.value.trim() : '';
            const tkUrl = storeTiktokInput ? storeTiktokInput.value.trim() : '';
            const kwUrl = storeKwaiInput ? storeKwaiInput.value.trim() : '';
            const ytUrl = storeYoutubeInput ? storeYoutubeInput.value.trim() : '';

            let customPrices = {};
            document.querySelectorAll('.store-custom-price').forEach(input => {
                const pid = input.getAttribute('data-id');
                const pval = input.value;
                if (pval) customPrices[pid] = parseInt(pval);
            });

            let storeDbObj = {
                whatsapp: wpp,
                facebookUrl: fbUrl,
                instagramUrl: igUrl,
                tiktokUrl: tkUrl,
                kwaiUrl: kwUrl,
                youtubeUrl: ytUrl,
                prices: customPrices
            };

            if (storePaymentInfoInput && storePaymentInfoInput.value.trim() !== '') {
                storeDbObj.paymentInfo = storePaymentInfoInput.value.trim();
            }

            db.ref(`sellerStores/${currentSellerName}`).set(storeDbObj).then(() => {
                alert('Tienda virtual guardada con éxito. Ya puedes compartir tu enlace.');
                sellerStoreModal.style.display = 'none';
            }).catch(e => {
                alert('Error al guardar: ' + e.message);
            });
        });
    }

    // ==========================================
    // SISTEMA SEGURO DE CÓDIGOS DE ACCESO (LIVE SYNC)
    // ==========================================

    let _codeAttemptsRefPrimary = null;
    let _codeAttemptsListenerPrimary = null;
    let _codeAttemptsRefClean = null;
    let _codeAttemptsListenerClean = null;

    window.isUserAdmin = function () {
        const isLocalAdmin = localStorage.getItem('adminLoggedIn') === 'true';
        const isSellerAdmin = typeof isSellerMode !== 'undefined' && isSellerMode &&
            ['admin', 'administrador', 'administrador (global)', 'tienda principal', 'página web oficial'].includes(String(currentSellerName || '').toLowerCase().trim());
        return Boolean(isLocalAdmin || isSellerAdmin);
    };

    window.getCodeAttemptPathSuffix = function (phone, clientName = '') {
        const rawPhone = String(phone || '').trim();
        const cleanPhone = window.sanitizePhone ? window.sanitizePhone(rawPhone) : rawPhone.replace(/\D/g, '').replace(/^57/, '');
        const cName = clientName || window.codeModalTargetClientName || '';
        const nameSlug = cName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const isSharedSellerPhone = window.isSellerActivatingClient && nameSlug &&
            window._sellerActiveClientsCache && window._sellerActiveClientsCache.filter(c => c.phone === cleanPhone).length > 1;
        return (isSharedSellerPhone && nameSlug) ? `clientAttempts/${nameSlug}` : 'codeAttemptUsed';
    };

    window.startCodeAttemptsLiveSync = function (phone, clientName = '') {
        if (!phone || typeof db === 'undefined') return;
        window.stopCodeAttemptsLiveSync();

        const rawPhone = String(phone).trim();
        const cleanPhone = window.sanitizePhone ? window.sanitizePhone(rawPhone) : rawPhone.replace(/\D/g, '').replace(/^57/, '');
        const altPhone = (!rawPhone.startsWith('57')) ? `57${cleanPhone}` : cleanPhone;
        const pathSuffix = window.getCodeAttemptPathSuffix(phone, clientName);

        let primaryData = null;
        let altData = null;

        function applySync() {
            let combined = {};
            if (primaryData === true) combined = { netflix: true, disney: true, hbomax: true, prime: true };
            else if (primaryData && typeof primaryData === 'object') Object.assign(combined, primaryData);

            if (altData === true) Object.assign(combined, { netflix: true, disney: true, hbomax: true, prime: true });
            else if (altData && typeof altData === 'object') Object.assign(combined, altData);

            // 🏰 Vincular Disney TV: Iniciar sesión por email y por código comparten el mismo único intento de Smart TV
            if (combined.disney_tv === true || (typeof combined.disney_tv === 'number' && combined.disney_tv >= 1) ||
                combined.disney_code_tv === true || (typeof combined.disney_code_tv === 'number' && combined.disney_code_tv >= 1)) {
                combined.disney_tv = true;
                combined.disney_code_tv = true;
            }

            window.clientUsedAttempts = combined;
            if (window.updateCodeCountersUI) {
                window.updateCodeCountersUI();
            }
        }

        // 1. Escuchar nodo primario con .on('value') para tiempo real
        _codeAttemptsRefPrimary = db.ref(`clientProfiles/${rawPhone}/${pathSuffix}`);
        _codeAttemptsListenerPrimary = _codeAttemptsRefPrimary.on('value', async snap => {
            primaryData = snap.val();
            if ((primaryData === null || primaryData === undefined) && pathSuffix !== 'codeAttemptUsed') {
                try {
                    const caSnap = await db.ref(`clientProfiles/${rawPhone}/clientAttempts`).once('value');
                    if (!caSnap.exists()) {
                        const fb = await db.ref(`clientProfiles/${rawPhone}/codeAttemptUsed`).once('value');
                        if (fb.val() !== null && fb.val() !== undefined) primaryData = fb.val();
                    }
                } catch (e) { }
            }
            applySync();
        });

        // 2. Si hay variante alterna (con o sin prefijo 57), escuchar también
        if (altPhone && altPhone !== rawPhone) {
            _codeAttemptsRefClean = db.ref(`clientProfiles/${altPhone}/${pathSuffix}`);
            _codeAttemptsListenerClean = _codeAttemptsRefClean.on('value', async snap => {
                altData = snap.val();
                if ((altData === null || altData === undefined) && pathSuffix !== 'codeAttemptUsed') {
                    try {
                        const caSnap = await db.ref(`clientProfiles/${altPhone}/clientAttempts`).once('value');
                        if (!caSnap.exists()) {
                            const fb = await db.ref(`clientProfiles/${altPhone}/codeAttemptUsed`).once('value');
                            if (fb.val() !== null && fb.val() !== undefined) altData = fb.val();
                        }
                    } catch (e) { }
                }
                applySync();
            });
        }
    };

    window.stopCodeAttemptsLiveSync = function () {
        if (_codeAttemptsRefPrimary && _codeAttemptsListenerPrimary) {
            _codeAttemptsRefPrimary.off('value', _codeAttemptsListenerPrimary);
            _codeAttemptsRefPrimary = null;
            _codeAttemptsListenerPrimary = null;
        }
        if (_codeAttemptsRefClean && _codeAttemptsListenerClean) {
            _codeAttemptsRefClean.off('value', _codeAttemptsListenerClean);
            _codeAttemptsRefClean = null;
            _codeAttemptsListenerClean = null;
        }
    };

    window.updateCodeCountersUI = function () {
        if (!window.clientUsedAttempts) window.clientUsedAttempts = {};

        // 🏰 Vincular Disney TV en UI: Si cualquiera fue usado, ambos se reflejan como usados
        if (window.clientUsedAttempts.disney_tv === true || (typeof window.clientUsedAttempts.disney_tv === 'number' && window.clientUsedAttempts.disney_tv >= 1) ||
            window.clientUsedAttempts.disney_code_tv === true || (typeof window.clientUsedAttempts.disney_code_tv === 'number' && window.clientUsedAttempts.disney_code_tv >= 1)) {
            window.clientUsedAttempts.disney_tv = true;
            window.clientUsedAttempts.disney_code_tv = true;
        }

        const isAdmin = window.isUserAdmin && window.isUserAdmin();

        const PLATFORM_THEMES = {
            netflix: { border: '#E50914', bg: 'rgba(229, 9, 20, 0.22)', activeBg: 'rgba(229, 9, 20, 0.45)', shadow: 'rgba(229, 9, 20, 0.35)' },
            disney: { border: '#005AD6', bg: 'rgba(0, 90, 214, 0.22)', activeBg: 'rgba(0, 90, 214, 0.45)', shadow: 'rgba(0, 90, 214, 0.35)' },
            hbomax: { border: '#8A2BE2', bg: 'rgba(138, 43, 226, 0.22)', activeBg: 'rgba(138, 43, 226, 0.45)', shadow: 'rgba(138, 43, 226, 0.35)' },
            prime: { border: '#00A8E1', bg: 'rgba(0, 168, 225, 0.22)', activeBg: 'rgba(0, 168, 225, 0.45)', shadow: 'rgba(0, 168, 225, 0.35)' },
            vix: { border: '#FF5B00', bg: 'rgba(255, 91, 0, 0.22)', activeBg: 'rgba(255, 91, 0, 0.45)', shadow: 'rgba(255, 91, 0, 0.35)' },
            crunchyroll: { border: '#F47521', bg: 'rgba(244, 117, 33, 0.22)', activeBg: 'rgba(244, 117, 33, 0.45)', shadow: 'rgba(244, 117, 33, 0.35)' },
            netflix_update: { border: '#f39c12', bg: 'rgba(243, 156, 18, 0.22)', activeBg: 'rgba(243, 156, 18, 0.45)', shadow: 'rgba(243, 156, 18, 0.35)' },
            netflix_temp: { border: '#00d2d3', bg: 'rgba(0, 210, 211, 0.22)', activeBg: 'rgba(0, 210, 211, 0.45)', shadow: 'rgba(0, 210, 211, 0.35)' },
            disney_update: { border: '#113CCF', bg: 'rgba(17, 60, 207, 0.22)', activeBg: 'rgba(17, 60, 207, 0.45)', shadow: 'rgba(17, 60, 207, 0.35)' },
            hbomax_update: { border: '#6c5ce7', bg: 'rgba(108, 92, 231, 0.22)', activeBg: 'rgba(108, 92, 231, 0.45)', shadow: 'rgba(108, 92, 231, 0.35)' },
            netflix_tv: { border: '#E50914', bg: 'rgba(229, 9, 20, 0.22)', activeBg: 'rgba(229, 9, 20, 0.45)', shadow: 'rgba(229, 9, 20, 0.35)' },
            disney_tv: { border: '#005AD6', bg: 'rgba(0, 90, 214, 0.22)', activeBg: 'rgba(0, 90, 214, 0.45)', shadow: 'rgba(0, 90, 214, 0.35)' },
            disney_code_tv: { border: '#005AD6', bg: 'rgba(0, 90, 214, 0.22)', activeBg: 'rgba(0, 90, 214, 0.45)', shadow: 'rgba(0, 90, 214, 0.35)' },
            hbomax_tv: { border: '#8A2BE2', bg: 'rgba(138, 43, 226, 0.22)', activeBg: 'rgba(138, 43, 226, 0.45)', shadow: 'rgba(138, 43, 226, 0.35)' },
            prime_tv: { border: '#00A8E1', bg: 'rgba(0, 168, 225, 0.22)', activeBg: 'rgba(0, 168, 225, 0.45)', shadow: 'rgba(0, 168, 225, 0.35)' },
            crunchyroll_tv: { border: '#F47521', bg: 'rgba(244, 117, 33, 0.22)', activeBg: 'rgba(244, 117, 33, 0.45)', shadow: 'rgba(244, 117, 33, 0.35)' },
            vix_tv: { border: '#FF5B00', bg: 'rgba(255, 91, 0, 0.22)', activeBg: 'rgba(255, 91, 0, 0.45)', shadow: 'rgba(255, 91, 0, 0.35)' }
        };
        window.PLATFORM_THEMES = PLATFORM_THEMES;

        function updateTabBtn(plat, icon, name, maxUses) {
            const btn = document.querySelector(`.platform-tab-btn[data-platform="${plat}"]`);
            if (!btn) return;

            const card = btn.closest('.platform-action-card');
            const theme = PLATFORM_THEMES[plat] || { border: '#E50914', bg: 'rgba(229, 9, 20, 0.22)', activeBg: 'rgba(229, 9, 20, 0.45)', shadow: 'rgba(229, 9, 20, 0.35)' };

            let used = window.clientUsedAttempts[plat];
            let numUsed = 0;
            if (used === true) numUsed = 1;
            else if (typeof used === 'number') numUsed = used;

            let rem = maxUses - numUsed;
            if (rem < 0) rem = 0;

            const hasPurchased = card ? (card.dataset.hasPurchased !== 'false') : true;

            // Si el cliente no es admin y ya agotó intentos o no compró la plataforma: ocultar tarjeta
            if (!isAdmin && (rem <= 0 || !hasPurchased)) {
                if (card) {
                    card.style.display = 'none';
                    // Si tenía un panel de TV abierto, cerrarlo
                    const innerPanel = card.querySelector('[id$="-panel"]');
                    if (innerPanel) innerPanel.style.display = 'none';
                } else {
                    btn.style.display = 'none';
                }
                return;
            }

            // Si tiene intentos disponibles (o es admin) y la plataforma está habilitada: mostrar
            if (card && hasPurchased) card.style.display = 'flex';
            else if (btn && hasPurchased) btn.style.display = 'flex';

            const isActive = btn.classList.contains('active-platform');
            btn.style.border = `2px solid ${theme.border}`;
            btn.style.color = '#ffffff';
            btn.style.fontWeight = '700';
            btn.style.opacity = '1';
            btn.disabled = false;
            btn.style.cursor = 'pointer';

            if (isActive) {
                btn.style.background = theme.activeBg;
                btn.style.boxShadow = `0 0 16px ${theme.shadow}, inset 0 0 10px rgba(255,255,255,0.15)`;
                btn.style.filter = 'brightness(1.15)';
            } else {
                btn.style.background = theme.bg;
                btn.style.boxShadow = `0 4px 12px ${theme.shadow}`;
                btn.style.filter = 'none';
            }

            if (isAdmin) {
                btn.innerHTML = `<span style="font-size:1.1rem;">${icon}</span> ${name} (${rem > 0 ? rem : '0'} disp. | <span style="color:#2ecc71; font-weight:bold;">Admin ∞</span>)`;
            } else {
                btn.innerHTML = `<span style="font-size:1.1rem;">${icon}</span> ${name} (${rem} ${rem === 1 ? 'vez' : 'veces'})`;
            }
        }

        // 1. Botones de CEL/PC
        updateTabBtn('netflix', '🎬', 'Netflix', 1);
        updateTabBtn('disney', '🏰', 'Disney', 1);
        updateTabBtn('hbomax', '📺', 'HBO Max', 1);
        updateTabBtn('prime', '📦', 'Prime Video', 1);
        updateTabBtn('vix', '🔥', 'ViX', 1);

        // 2. Botones de Hogar / Actualizaciones
        updateTabBtn('netflix_update', '🏠', 'Actualiza tu Hogar con Netflix', 2);
        updateTabBtn('netflix_temp', '✈️', 'Acceso temporal con Netflix (CEL O PC)', 1);
        updateTabBtn('disney_update', '🏰', 'Actualiza hogar con Disney', 2);
        updateTabBtn('hbomax_update', '🟣', 'Fuera de casa HBO Max', 2);

        // 3. Botones de Smart TV
        updateTabBtn('netflix_tv', '📺', 'Iniciar sesión Netflix en TV', 1);
        updateTabBtn('disney_tv', '🏰', 'Iniciar sesión Disney en TV con email', 1);
        updateTabBtn('disney_code_tv', '🏰', 'Iniciar sesión Disney en TV con código', 1);
        updateTabBtn('hbomax_tv', '📺', 'Iniciar sesión HBO Max en TV', 1);
        updateTabBtn('prime_tv', '📺', 'Iniciar sesión Prime Video en TV', 1);
        updateTabBtn('crunchyroll_tv', '📺', 'Iniciar sesión Crunchyroll en TV', 1);
        updateTabBtn('vix_tv', '📺', 'Iniciar sesión ViX en TV', 1);

        // Actualizar botones de activación dentro de los paneles TV
        function updateTvActivateBtn(btnId, plat, defaultText, exhaustedText) {
            const actBtn = document.getElementById(btnId);
            if (!actBtn) return;
            let used = window.clientUsedAttempts[plat];
            let numUsed = (used === true) ? 1 : ((typeof used === 'number') ? used : 0);
            let rem = 1 - numUsed;
            if (rem < 0) rem = 0;

            if (isAdmin) {
                actBtn.disabled = false;
                actBtn.innerHTML = `<i class="fa-solid fa-tv"></i> ${defaultText} (Admin ∞)`;
                actBtn.style.opacity = '1';
                actBtn.style.cursor = 'pointer';
            } else if (rem <= 0) {
                actBtn.disabled = true;
                actBtn.innerHTML = `<i class="fa-solid fa-lock"></i> ${exhaustedText}`;
                actBtn.style.opacity = '0.5';
                actBtn.style.cursor = 'not-allowed';
            } else {
                actBtn.disabled = false;
                actBtn.innerHTML = `<i class="fa-solid fa-tv"></i> ${defaultText}`;
                actBtn.style.opacity = '1';
                actBtn.style.cursor = 'pointer';
            }
        }

        updateTvActivateBtn('activate-tv-btn', 'netflix_tv', 'Activar Netflix en TV', 'Intento de Netflix TV agotado (1/1)');
        updateTvActivateBtn('activate-disney-code-tv-btn', 'disney_code_tv', 'Activar Disney en TV', 'Intento de Disney TV agotado (1/1)');
        updateTvActivateBtn('activate-hbo-tv-btn', 'hbomax_tv', 'Activar HBO Max en TV', 'Intento de HBO Max TV agotado (1/1)');
        updateTvActivateBtn('activate-prime-tv-btn', 'prime_tv', 'Activar Prime Video en TV', 'Intento de Prime Video TV agotado (1/1)');
        updateTvActivateBtn('activate-crunchyroll-tv-btn', 'crunchyroll_tv', 'Activar Crunchyroll en TV', 'Intento de Crunchyroll TV agotado (1/1)');
        updateTvActivateBtn('activate-vix-tv-btn', 'vix_tv', 'Activar ViX en TV', 'Intento de ViX TV agotado (1/1)');

        // Actualizar botones de acción directa bajo cada servicio
        const directButtons = document.querySelectorAll('.direct-fetch-code-btn');
        directButtons.forEach(dBtn => {
            const plat = dBtn.dataset.platform;
            let used = window.clientUsedAttempts[plat];
            let numUsed = 0;
            if (used === true) numUsed = 1;
            else if (typeof used === 'number') numUsed = used;

            let maxUses = 1;
            let platName = 'Código';
            let platIcon = 'fa-satellite-dish';

            if (plat === 'netflix') {
                platName = 'Código Netflix';
                platIcon = 'fa-satellite-dish';
            } else if (plat === 'disney') {
                platName = 'Código Disney';
                platIcon = 'fa-satellite-dish';
            } else if (plat === 'hbomax') {
                platName = 'Código HBO Max';
                platIcon = 'fa-satellite-dish';
            } else if (plat === 'prime') {
                platName = 'Código Prime Video';
                platIcon = 'fa-satellite-dish';
            } else if (plat === 'vix') {
                platName = 'Celular ViX';
                platIcon = 'fa-mobile-screen-button';
            } else if (plat === 'netflix_update') {
                maxUses = 2;
                platName = 'Código Actualizar Hogar Netflix';
                platIcon = 'fa-house-chimney';
            } else if (plat === 'disney_update') {
                maxUses = 2;
                platName = 'Código Hogar Disney';
                platIcon = 'fa-house-chimney-window';
            } else if (plat === 'hbomax_update') {
                maxUses = 2;
                platName = 'Código Fuera de Casa HBO Max';
                platIcon = 'fa-house-user';
            } else if (plat === 'disney_tv') {
                maxUses = 1;
                platName = 'Iniciar sesión Disney en TV con email';
                platIcon = 'fa-envelope';
            } else if (plat === 'netflix_temp') {
                platName = 'Código Acceso Temporal Netflix';
                platIcon = 'fa-plane-departure';
            }

            let rem = maxUses - numUsed;
            if (rem < 0) rem = 0;

            if (isAdmin) {
                dBtn.disabled = false;
                dBtn.style.opacity = '1';
                dBtn.style.cursor = 'pointer';
                if (plat === 'vix') {
                    dBtn.innerHTML = `<i class="fa-solid fa-mobile-screen-button"></i> Activar Celular ViX <small style="color:#2ecc71; font-weight:bold;">(Admin ∞)</small>`;
                } else if (plat === 'disney_update') {
                    dBtn.innerHTML = `<i class="fa-solid fa-house-chimney-window"></i> Obtener Código Hogar Disney (${rem > 0 ? rem : '0'} disp. | <small style="color:#2ecc71; font-weight:bold;">Admin ∞</small>)`;
                } else if (plat === 'hbomax_update') {
                    dBtn.innerHTML = `<i class="fa-solid fa-house-user"></i> Obtener Código Fuera de Casa HBO Max (${rem > 0 ? rem : '0'} disp. | <small style="color:#2ecc71; font-weight:bold;">Admin ∞</small>)`;
                } else if (plat === 'disney_tv') {
                    dBtn.innerHTML = `<i class="fa-solid fa-envelope"></i> Iniciar sesión Disney TV (${rem > 0 ? rem : '0'} disp. | <small style="color:#2ecc71; font-weight:bold;">Admin ∞</small>)`;
                } else {
                    dBtn.innerHTML = `<i class="fa-solid ${platIcon}"></i> Obtener ${platName} (${rem > 0 ? rem : '0'} disp. | <small style="color:#2ecc71; font-weight:bold;">Admin ∞</small>)`;
                }
            } else if (rem <= 0) {
                dBtn.disabled = true;
                dBtn.innerHTML = `<i class="fa-solid fa-lock"></i> ${(plat === 'netflix_update' || plat === 'disney_update' || plat === 'hbomax_update') ? 'Actualizaciones agotadas (2/2)' : 'Intento agotado (1/1)'}`;
                dBtn.style.opacity = '0.5';
                dBtn.style.cursor = 'not-allowed';
                dBtn.style.boxShadow = 'none';
            } else {
                dBtn.disabled = false;
                if (plat === 'vix') {
                    dBtn.innerHTML = `<i class="fa-solid fa-mobile-screen-button"></i> Activar Celular ViX`;
                } else if (plat === 'disney_update') {
                    dBtn.innerHTML = `<i class="fa-solid fa-house-chimney-window"></i> Obtener Código Hogar Disney`;
                } else if (plat === 'hbomax_update') {
                    dBtn.innerHTML = `<i class="fa-solid fa-house-user"></i> Obtener Código Fuera de Casa HBO Max`;
                } else if (plat === 'disney_tv') {
                    dBtn.innerHTML = `<i class="fa-solid fa-envelope"></i> Iniciar sesión Disney en TV con email`;
                } else {
                    dBtn.innerHTML = `<i class="fa-solid ${platIcon}"></i> Obtener ${platName}`;
                }
                dBtn.style.opacity = '1';
                dBtn.style.cursor = 'pointer';
            }
        });

        // 4. Ocultar secciones si no tienen tarjetas visibles
        const updateSectionVisibility = (secId) => {
            const secEl = document.getElementById(secId);
            if (!secEl) return 0;
            let visibleCount = 0;
            secEl.querySelectorAll('.platform-action-card').forEach(c => {
                if (c.style.display !== 'none') visibleCount++;
            });
            secEl.style.display = visibleCount > 0 ? 'block' : 'none';
            return visibleCount;
        };

        const vCel = updateSectionVisibility('section-cel-pc');
        const vHogar = updateSectionVisibility('section-hogar');
        const vTv = updateSectionVisibility('section-tv');
        const totalVisible = vCel + vHogar + vTv;

        const emptyNotice = document.getElementById('no-attempts-remaining-notice');
        const emailContainer = document.getElementById('code-email-container');
        const fetchBtn = document.getElementById('fetch-code-btn');

        if (!isAdmin && totalVisible === 0) {
            if (emptyNotice) emptyNotice.style.display = 'block';
            if (emailContainer) emailContainer.style.display = 'none';
            if (fetchBtn) fetchBtn.style.display = 'none';
        } else {
            if (emptyNotice) emptyNotice.style.display = 'none';
            if (emailContainer) emailContainer.style.display = 'block';
        }

        // 5. Si la pestaña actualmente activa quedó oculta, auto-seleccionar la primera visible
        const activeBtn = document.querySelector('.platform-tab-btn.active-platform');
        const activeCard = activeBtn ? activeBtn.closest('.platform-action-card') : null;
        if (!activeBtn || (activeCard && activeCard.style.display === 'none')) {
            const visibleCards = document.querySelectorAll('.platform-action-card');
            for (let c of visibleCards) {
                if (c.style.display !== 'none') {
                    const b = c.querySelector('.platform-tab-btn');
                    if (b) {
                        b.click();
                        break;
                    }
                }
            }
        }

        // Reactividad en vivo: bloquear o desbloquear botón de búsqueda inferior si está visible
        const codePlatformInput = document.getElementById('code-platform');
        if (codePlatformInput && fetchBtn) {
            const chosen = codePlatformInput.value;
            if (['netflix', 'disney', 'hbomax', 'prime', 'vix', 'netflix_update', 'disney_update', 'hbomax_update', 'netflix_temp'].includes(chosen)) {
                fetchBtn.style.display = 'none';
            } else if (totalVisible > 0) {
                fetchBtn.style.display = 'block';
                let isExhausted = false;
                if (window.clientUsedAttempts[chosen] === true || (typeof window.clientUsedAttempts[chosen] === 'number' && window.clientUsedAttempts[chosen] >= 1)) {
                    isExhausted = true;
                }

                if (isExhausted && !isAdmin) {
                    fetchBtn.disabled = true;
                    fetchBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Intento de esta plataforma agotado';
                    fetchBtn.style.opacity = '0.5';
                    fetchBtn.style.cursor = 'not-allowed';
                } else {
                    fetchBtn.disabled = false;
                    fetchBtn.innerHTML = `<i class="fa-solid fa-satellite-dish"></i> Buscar mi Código${isAdmin ? ' (Admin ∞)' : ''}`;
                    fetchBtn.style.opacity = '1';
                    fetchBtn.style.cursor = 'pointer';
                }
            }
        }
    };

    // =====================================================
    // 🎛️ CONTROL COMPARTIDO CLIENTE + VENDEDOR Y PERMISOS DE CÓDIGOS
    // =====================================================
    window.codeModalTargetPhone = '';
    window.codeModalTargetClientName = '';
    window.codeModalTargetClientKey = '';
    window.codeModalTargetSellerName = '';
    window.isSellerActivatingClient = false;

    window.closeCodeModal = function () {
        if (codeModal) codeModal.style.display = 'none';
        if (window.isSellerActivatingClient) {
            window.isSellerActivatingClient = false;
            window.codeModalTargetPhone = '';
            window.codeModalTargetClientName = '';
            window.codeModalTargetClientKey = '';
            window.codeModalTargetSellerName = '';
            if (clientPhoneLoggedIn && window.startCodeAttemptsLiveSync) {
                window.startCodeAttemptsLiveSync(clientPhoneLoggedIn);
            } else if (window.stopCodeAttemptsLiveSync) {
                window.stopCodeAttemptsLiveSync();
            }
            if (typeof renderSellerDashboard === 'function' && isSellerMode) {
                renderSellerDashboard();
            }
        } else {
            window.codeModalTargetPhone = '';
            window.codeModalTargetClientName = '';
            window.codeModalTargetClientKey = '';
            window.codeModalTargetSellerName = '';
        }
    };

    window.getEffectiveCodeTargetPhone = function () {
        if (window.isSellerActivatingClient && window.codeModalTargetPhone) {
            return String(window.codeModalTargetPhone).trim();
        }
        return String(clientPhoneLoggedIn || '').trim();
    };

    window.isSellerAllowedForCodes = function (sellerName) {
        if (!sellerName) return true;
        const cfg = (storeConfig && storeConfig.codeActivationConfig) ? storeConfig.codeActivationConfig : {};
        if (cfg.allowedSellers && typeof cfg.allowedSellers === 'object') {
            const sTrim = String(sellerName).trim();
            if (cfg.allowedSellers[sTrim] === false) return false;
            // Búsqueda insensible a mayúsculas por seguridad
            const matchKey = Object.keys(cfg.allowedSellers).find(k => k.toLowerCase().trim() === sTrim.toLowerCase());
            if (matchKey && cfg.allowedSellers[matchKey] === false) return false;
        }
        return true;
    };

    window.canSellerUseCodeActivation = function (sellerName) {
        const cfg = (storeConfig && storeConfig.codeActivationConfig) ? storeConfig.codeActivationConfig : {};
        if (cfg.sellersEnabled === false) return false;
        return window.isSellerAllowedForCodes(sellerName || currentSellerName);
    };

    window._sellerActiveClientsCache = [];

    window.loadSellerClientsForCodeModal = async function (sellerName, preselectedKey = '') {
        const sName = sellerName || currentSellerName;
        const selectEl = document.getElementById('code-seller-client-select');
        const searchEl = document.getElementById('code-seller-client-search');
        if (searchEl) searchEl.value = '';
        if (!selectEl || !sName) return [];

        selectEl.innerHTML = '<option value="">⏳ Cargando tus clientes activos...</option>';
        try {
            const snap = await db.ref(`sellerSales/${sName}`).once('value');
            const salesObj = snap.val() || {};
            const now = Date.now();
            const mapByClient = {};

            Object.entries(salesObj).forEach(([saleKey, sale]) => {
                if (!sale) return;
                if (sale.expirationDate && sale.expirationDate < now) return; // Solo clientes activos
                const rawP = String(sale.clientPhone || '').trim();
                const cleanP = window.sanitizePhone ? window.sanitizePhone(rawP) : rawP.replace(/\D/g, '').replace(/^57/, '');
                const cName = safeDecode(sale.clientName || 'Cliente').trim();
                if (cName.toLowerCase() === 'crm') return;

                // Clave única combinando Nombre del Cliente y Celular (o 'sin_numero')
                const phoneKey = cleanP || 'sin_numero';
                const clientKey = `${cName.toLowerCase()}___${phoneKey}`;

                const itemsStr = Array.isArray(sale.items) ? sale.items.map(i => i.name).join(', ') : '';
                if (!mapByClient[clientKey]) {
                    mapByClient[clientKey] = {
                        key: clientKey,
                        phone: cleanP,
                        name: cName,
                        platforms: itemsStr ? [itemsStr] : []
                    };
                } else if (itemsStr && !mapByClient[clientKey].platforms.includes(itemsStr)) {
                    mapByClient[clientKey].platforms.push(itemsStr);
                }
            });

            const list = Object.values(mapByClient).sort((a, b) => a.name.localeCompare(b.name));
            window._sellerActiveClientsCache = list;
            window.renderSellerCodeModalClientOptions(list, preselectedKey);
            return list;
        } catch (e) {
            selectEl.innerHTML = '<option value="">-- Error cargando clientes --</option>';
            return [];
        }
    };

    window.renderSellerCodeModalClientOptions = function (list, selectedKey = '') {
        const selectEl = document.getElementById('code-seller-client-select');
        if (!selectEl) return;
        const targetClean = String(selectedKey || '').trim().toLowerCase();

        if (!list || list.length === 0) {
            selectEl.innerHTML = '<option value="">-- No se encontraron clientes activos --</option>';
            return;
        }

        let html = '<option value="">-- Selecciona el cliente para activar / sacar código --</option>';
        list.forEach(c => {
            const isSel = (targetClean && (c.key.toLowerCase() === targetClean || c.phone === targetClean || c.name.toLowerCase() === targetClean)) ? 'selected' : '';
            const platSummary = c.platforms.length > 0 ? ` — [${c.platforms.join(' + ')}]` : '';
            const phoneLabel = (c.phone && c.phone !== 'sin_numero') ? ` (📱 ${c.phone})` : '';
            const safeVal = encodeURIComponent(JSON.stringify({ phone: c.phone, name: c.name, key: c.key }));
            html += `<option value="${safeVal}" ${isSel}>👤 ${c.name}${phoneLabel}${platSummary}</option>`;
        });
        selectEl.innerHTML = html;
    };

    window.filterSellerCodeModalClients = function (query) {
        const q = String(query || '').toLowerCase().trim();
        const all = window._sellerActiveClientsCache || [];
        const filtered = !q ? all : all.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.platforms.join(' ').toLowerCase().includes(q));
        window.renderSellerCodeModalClientOptions(filtered, window.codeModalTargetClientKey || window.codeModalTargetPhone);
        // Si solo queda 1 coincidencia o el usuario filtra, seleccionar automáticamente el primero
        if (filtered.length === 1) {
            const first = filtered[0];
            window.codeModalTargetPhone = first.phone;
            window.codeModalTargetClientName = first.name;
            window.codeModalTargetClientKey = first.key;
            window.renderSellerCodeModalClientOptions(filtered, first.key);
            window.initCodeModal(true);
        }
    };

    window.onSellerCodeModalClientChange = function (encodedVal) {
        if (!encodedVal) {
            if (window._sellerActiveClientsCache && window._sellerActiveClientsCache.length > 0) {
                const curKey = window.codeModalTargetClientKey || window._sellerActiveClientsCache[0].key;
                window.renderSellerCodeModalClientOptions(window._sellerActiveClientsCache, curKey);
            }
            return;
        }
        try {
            const obj = JSON.parse(decodeURIComponent(encodedVal));
            if (obj) {
                window.isSellerActivatingClient = true;
                window.codeModalTargetPhone = obj.phone || '';
                window.codeModalTargetClientName = safeDecode(obj.name || 'Cliente');
                window.codeModalTargetClientKey = obj.key || `${(obj.name || '').toLowerCase()}___${obj.phone || ''}`;
                window.codeModalTargetSellerName = currentSellerName;
                window.initCodeModal(true);
            }
        } catch (e) { }
    };

    window.openSellerClientCodeModal = async function (clientPhone, clientName, sellerName) {
        const sName = sellerName || currentSellerName;
        if (!window.canSellerUseCodeActivation(sName)) {
            alert('⚠️ La opción de activación de códigos para vendedores se encuentra desactivada por el Administrador.');
            return;
        }
        const cleanP = window.sanitizePhone ? window.sanitizePhone(clientPhone) : String(clientPhone || '').replace(/\D/g, '').replace(/^57/, '');
        window.isSellerActivatingClient = true;
        window.codeModalTargetPhone = cleanP;
        window.codeModalTargetClientName = safeDecode(clientName || 'Cliente');
        window.codeModalTargetClientKey = `${window.codeModalTargetClientName.toLowerCase()}___${cleanP || 'sin_numero'}`;
        window.codeModalTargetSellerName = sName;

        const cModal = document.getElementById('code-modal');
        if (cModal) {
            cModal.style.display = 'block';
            cModal.style.zIndex = '10050';
        }
        await window.loadSellerClientsForCodeModal(sName, window.codeModalTargetClientKey);
        window.initCodeModal(true);
    };

    // Función para inicializar el modal de código con las restricciones correctas
    window.initCodeModal = async function (skipDropdownReload = false) {
        const noSession = document.getElementById('code-no-session');
        const alreadyUsed = document.getElementById('code-already-used');
        const activePanel = document.getElementById('code-active-panel');
        const permBlocked = document.getElementById('code-permission-blocked');
        const sellerBanner = document.getElementById('code-seller-client-banner');
        const sellerInfoEl = document.getElementById('code-seller-client-info');

        if (!noSession || !alreadyUsed || !activePanel) return;

        // Ocultar todos los paneles
        noSession.style.display = 'none';
        alreadyUsed.style.display = 'none';
        activePanel.style.display = 'none';
        if (permBlocked) permBlocked.style.display = 'none';

        // Si está en Modo Vendedor y abrió el modal desde el botón superior "Obtener Código"
        if (isSellerMode && currentSellerName && !clientPhoneLoggedIn) {
            window.isSellerActivatingClient = true;
            window.codeModalTargetSellerName = currentSellerName;
            if (!skipDropdownReload) {
                const clients = await window.loadSellerClientsForCodeModal(currentSellerName, window.codeModalTargetClientKey || window.codeModalTargetPhone);
                if (clients && clients.length > 0) {
                    let matched = null;
                    if (window.codeModalTargetClientKey) {
                        matched = clients.find(c => c.key === window.codeModalTargetClientKey || c.phone === window.codeModalTargetClientKey);
                    }
                    if (!matched && window.codeModalTargetPhone) {
                        matched = clients.find(c => c.phone === window.codeModalTargetPhone);
                    }
                    if (!matched) {
                        matched = clients[0];
                    }
                    window.codeModalTargetPhone = matched.phone;
                    window.codeModalTargetClientName = matched.name;
                    window.codeModalTargetClientKey = matched.key;
                    window.renderSellerCodeModalClientOptions(clients, matched.key);
                }
            }
        }

        // Respaldo de seguridad en Modo Vendedor: si falta teléfono o nombre, sincronizar desde cache de clientes
        if (window.isSellerActivatingClient && (!window.codeModalTargetPhone || !window.codeModalTargetClientName)) {
            if (window._sellerActiveClientsCache && window._sellerActiveClientsCache.length > 0) {
                let matched = null;
                if (window.codeModalTargetClientKey) {
                    matched = window._sellerActiveClientsCache.find(c => c.key === window.codeModalTargetClientKey || c.phone === window.codeModalTargetClientKey);
                }
                if (!matched) {
                    matched = window._sellerActiveClientsCache[0];
                }
                if (matched) {
                    window.codeModalTargetPhone = matched.phone;
                    window.codeModalTargetClientName = matched.name;
                    window.codeModalTargetClientKey = matched.key;
                }
            }
        }

        const targetPhone = window.getEffectiveCodeTargetPhone();

        // Mostrar u ocultar banner de Modo Vendedor
        if (window.isSellerActivatingClient) {
            if (sellerBanner) sellerBanner.style.display = 'block';
            if (sellerInfoEl) {
                if (targetPhone && targetPhone !== 'sin_numero') {
                    sellerInfoEl.innerHTML = `Cliente activo: <span style="color:#4cd137;">${window.codeModalTargetClientName || 'Cliente'} (📱 ${targetPhone})</span>`;
                } else {
                    sellerInfoEl.innerHTML = `Cliente activo: <span style="color:#4cd137;">${window.codeModalTargetClientName || 'Cliente'}</span>`;
                }
            }
        } else {
            if (sellerBanner) sellerBanner.style.display = 'none';
        }

        // 1. VERIFICAR SESIÓN (Cliente logueado o Vendedor activando a su cliente)
        if (!targetPhone && !window.codeModalTargetClientName) {
            if (window.isSellerActivatingClient) {
                // El vendedor está logueado pero aún no tiene clientes activos
                if (sellerBanner) sellerBanner.style.display = 'block';
                if (sellerInfoEl) sellerInfoEl.innerHTML = '<span style="color:#e74c3c;">⚠️ No tienes clientes activos registrados aún.</span>';
                return;
            }
            noSession.style.display = 'block';
            return;
        }

        // Iniciar Live Sync permanente sobre el teléfono objetivo (compartido entre cliente y vendedor)
        if (window.startCodeAttemptsLiveSync) {
            window.startCodeAttemptsLiveSync(targetPhone, window.codeModalTargetClientName);
        }

        // 2. RECUPERAR INTENTOS USADOS EN FIREBASE (COMPARTIDO CLIENTE + VENDEDOR POR PLATAFORMA)
        const rawP = String(targetPhone).trim();
        const cleanPhone = window.sanitizePhone ? window.sanitizePhone(rawP) : rawP.replace(/\D/g, '').replace(/^57/, '');
        const cleanP = cleanPhone;
        const altP = (!rawP.startsWith('57')) ? `57${cleanP}` : cleanP;

        const pathSuffix = window.getCodeAttemptPathSuffix ? window.getCodeAttemptPathSuffix(targetPhone, window.codeModalTargetClientName) : 'codeAttemptUsed';

        let combinedUsed = {};
        const pList = Array.from(new Set([rawP, cleanP, altP])).filter(Boolean);
        for (const pk of pList) {
            const snap = await db.ref(`clientProfiles/${pk}/${pathSuffix}`).once('value');
            let v = snap.val();
            if ((v === null || v === undefined) && pathSuffix !== 'codeAttemptUsed') {
                try {
                    const caSnap = await db.ref(`clientProfiles/${pk}/clientAttempts`).once('value');
                    if (!caSnap.exists()) {
                        const fallbackSnap = await db.ref(`clientProfiles/${pk}/codeAttemptUsed`).once('value');
                        if (fallbackSnap.val() !== null && fallbackSnap.val() !== undefined) v = fallbackSnap.val();
                    }
                } catch (e) { }
            }
            if (v === true) Object.assign(combinedUsed, { netflix: true, disney: true, hbomax: true, prime: true });
            else if (v && typeof v === 'object') Object.assign(combinedUsed, v);
        }

        window.clientUsedAttempts = combinedUsed;
        if (window.updateCodeCountersUI) window.updateCodeCountersUI();

        // 3. CARGAR CORREOS DESDE SUS COMPRAS EN FIREBASE (clientSales + sellerSales si aplica)
        const emailSelect = document.getElementById('code-email');
        if (emailSelect) {
            emailSelect.innerHTML = '<option value="">-- Cargando tus cuentas... --</option>';
            try {
                let salesSnap = await db.ref(`clientSales/${targetPhone}`).once('value');
                let sales = salesSnap.val();
                if (!sales && cleanPhone && cleanPhone !== targetPhone) {
                    const fallbackSales = await db.ref(`clientSales/${cleanPhone}`).once('value');
                    sales = fallbackSales.val();
                }
                if (!sales && cleanPhone && !cleanPhone.startsWith('57')) {
                    const coSales = await db.ref(`clientSales/57${cleanPhone}`).once('value');
                    if (coSales.val()) sales = coSales.val();
                }
                sales = sales ? Object.assign({}, sales) : {};

                // También buscar en sellerSales para garantizar que las ventas de vendedores tengan todos sus correos y detectar si es cliente de vendedor
                try {
                    const sellerToCheck = window.codeModalTargetSellerName || currentSellerName;
                    if (sellerToCheck) {
                        const sSnap = await db.ref(`sellerSales/${sellerToCheck}`).once('value');
                        const sSalesObj = sSnap.val() || {};
                        Object.entries(sSalesObj).forEach(([sKey, sVal]) => {
                            if (!sVal) return;
                            const sPhoneClean = window.sanitizePhone ? window.sanitizePhone(sVal.clientPhone) : String(sVal.clientPhone || '').replace(/\D/g, '').replace(/^57/, '');
                            const sClientName = safeDecode(sVal.clientName || '').toLowerCase().trim();
                            const targetName = (window.codeModalTargetClientName || '').toLowerCase().trim();

                            let isMatch = false;
                            if (cleanPhone && sPhoneClean && sPhoneClean === cleanPhone) {
                                isMatch = true;
                            } else if (targetName && sClientName && sClientName === targetName) {
                                isMatch = true;
                            }
                            if (isMatch) {
                                sales[`seller_${sKey}`] = sVal;
                            }
                        });
                    } else if (cleanPhone) {
                        // Búsqueda para cliente autónomo en sellerSales (todos los vendedores)
                        const allSellersSnap = await db.ref('sellerSales').once('value');
                        const allSellersData = allSellersSnap.val() || {};
                        Object.entries(allSellersData).forEach(([sName, sSalesObj]) => {
                            if (!sSalesObj || sName === 'Página Web Oficial' || sName === 'Admin') return;
                            Object.entries(sSalesObj).forEach(([sKey, sVal]) => {
                                if (!sVal) return;
                                const sPhoneClean = window.sanitizePhone ? window.sanitizePhone(sVal.clientPhone) : String(sVal.clientPhone || '').replace(/\D/g, '').replace(/^57/, '');
                                if (sPhoneClean === cleanPhone) {
                                    sales[`seller_${sKey}`] = { ...sVal, sellerName: sVal.sellerName || sName };
                                    window.codeModalTargetSellerName = sVal.sellerName || sName;
                                    window.isSellerClientInCodeModal = true;
                                }
                            });
                        });
                    }
                } catch (e) { }

                // 2.5 VALIDAR PERMISOS DEL CENTRO MAESTRO (GLOBAL, VENDEDORES Y CLIENTES DE VENDEDORES)
                const cfg = (storeConfig && storeConfig.codeActivationConfig) ? storeConfig.codeActivationConfig : {};
                if (window.isSellerActivatingClient) {
                    // Es un Vendedor activando la cuenta de su cliente
                    const sName = window.codeModalTargetSellerName || currentSellerName;
                    if (cfg.sellersEnabled === false || !window.isSellerAllowedForCodes(sName)) {
                        if (permBlocked) {
                            permBlocked.style.display = 'block';
                            const tEl = document.getElementById('code-permission-blocked-title');
                            const dEl = document.getElementById('code-permission-blocked-desc');
                            if (tEl) tEl.innerText = 'Opción Desactivada para Vendedores';
                            if (dEl) dEl.innerText = 'El Administrador ha desactivado temporalmente la extracción de códigos desde el panel de vendedor.';
                        }
                        return;
                    }
                } else {
                    // Es un Cliente intentando sacar código por su cuenta
                    let clientSellerNames = [];
                    Object.values(sales).forEach(s => {
                        if (s && s.expirationDate && s.expirationDate < Date.now()) return;
                        const sn = (s && s.sellerName) ? String(s.sellerName).trim() : '';
                        if (sn && sn !== 'Página Web Oficial' && sn !== 'Admin' && sn !== 'Tienda Principal') {
                            clientSellerNames.push(sn);
                        }
                    });
                    if (publicSellerRef) {
                        clientSellerNames.push(publicSellerRef);
                    }

                    if (clientSellerNames.length > 0) {
                        // Es cliente de un Vendedor
                        const anySellerAllowed = clientSellerNames.some(sn => window.isSellerAllowedForCodes(sn));
                        if (cfg.sellerClientsEnabled === false || !anySellerAllowed) {
                            if (permBlocked) {
                                permBlocked.style.display = 'block';
                                const tEl = document.getElementById('code-permission-blocked-title');
                                const dEl = document.getElementById('code-permission-blocked-desc');
                                if (tEl) tEl.innerText = 'Solicita la Activación a tu Vendedor';
                                if (dEl) dEl.innerText = 'La activación de pantallas y códigos para tu cuenta es gestionada directamente por tu vendedor. Por favor escríbele por WhatsApp para que active tu pantalla.';
                            }
                            return;
                        }
                    } else {
                        // Es cliente Global / Directo
                        if (cfg.globalClientsEnabled === false) {
                            if (permBlocked) {
                                permBlocked.style.display = 'block';
                                const tEl = document.getElementById('code-permission-blocked-title');
                                const dEl = document.getElementById('code-permission-blocked-desc');
                                if (tEl) tEl.innerText = 'Sistema de Códigos en Mantenimiento';
                                if (dEl) dEl.innerText = 'En este momento la autogestión de códigos para clientes directos está desactivada. Por favor comunícate con soporte.';
                            }
                            return;
                        }
                    }
                }
                // Mapear plataformas activas y sus correos
                window.clientActivePlatforms = {
                    netflix: new Set(),
                    disney: new Set(),
                    hbomax: new Set(),
                    prime: new Set(),
                    vix: new Set(),
                    crunchyroll: new Set(),
                    netflix_update: new Set(),
                    netflix_temp: new Set(),
                    disney_update: new Set(),
                    hbomax_update: new Set(),
                    disney_tv: new Set(),
                    disney_code_tv: new Set(),
                    hbomax_tv: new Set(),
                    prime_tv: new Set(),
                    crunchyroll_tv: new Set(),
                    vix_tv: new Set(),
                    global: new Set()
                };

                window.allClientActiveEmails = new Set();
                const userPurchasedPlatforms = new Set();

                Object.values(sales).forEach(sale => {
                    // Validar si la venta está activa
                    const isExpired = sale.expirationDate && sale.expirationDate < Date.now();
                    if (isExpired) return;

                    // Si el vendedor está activando a un cliente específico, filtrar solo las compras de ese cliente
                    if (window.isSellerActivatingClient && window.codeModalTargetClientName) {
                        const targetNameL = window.codeModalTargetClientName.toLowerCase().trim();
                        const saleNameL = safeDecode(sale.clientName || '').toLowerCase().trim();
                        if (saleNameL && saleNameL !== targetNameL) {
                            return; // Pertenece a otro cliente del mismo vendedor
                        }
                    }

                    // Detectar plataforma desde propiedades raíz de la venta
                    const saleRaw = `${sale.productName || ''} ${sale.name || ''} ${sale.category || ''} ${sale.platform || ''}`.toLowerCase();
                    if (saleRaw.includes('netflix')) userPurchasedPlatforms.add('netflix');
                    if (saleRaw.includes('disney')) userPurchasedPlatforms.add('disney');
                    if (saleRaw.includes('hbo') || saleRaw.includes('max')) userPurchasedPlatforms.add('hbomax');
                    if (saleRaw.includes('prime') || saleRaw.includes('amazon')) userPurchasedPlatforms.add('prime');
                    if (saleRaw.includes('vix')) userPurchasedPlatforms.add('vix');
                    if (saleRaw.includes('crunch') || saleRaw.includes('roll')) userPurchasedPlatforms.add('crunchyroll');

                    if (sale.email) {
                        const em = sale.email.toLowerCase().trim();
                        window.clientActivePlatforms.global.add(em);
                        window.allClientActiveEmails.add(em);
                    }

                    if (sale.items && Array.isArray(sale.items)) {
                        sale.items.forEach(item => {
                            let itemPlatform = null;
                            const itemName = (item.name || '').toLowerCase();
                            const itemCat = (item.category || '').toLowerCase();
                            const itemFull = itemName + ' ' + itemCat;
                            if (itemFull.includes('netflix')) itemPlatform = 'netflix';
                            else if (itemFull.includes('disney')) itemPlatform = 'disney';
                            else if (itemFull.includes('hbo') || itemFull.includes('max')) itemPlatform = 'hbomax';
                            else if (itemFull.includes('prime') || itemFull.includes('amazon')) itemPlatform = 'prime';
                            else if (itemFull.includes('vix')) itemPlatform = 'vix';
                            else if (itemFull.includes('crunch') || itemFull.includes('roll')) itemPlatform = 'crunchyroll';

                            if (itemPlatform) {
                                userPurchasedPlatforms.add(itemPlatform);
                            }

                            if (item.email) {
                                const itemEmailL = item.email.toLowerCase().trim();
                                window.allClientActiveEmails.add(itemEmailL);
                                if (itemPlatform) {
                                    window.clientActivePlatforms[itemPlatform].add(itemEmailL);
                                    if (itemPlatform === 'netflix') {
                                        window.clientActivePlatforms['netflix_update'].add(itemEmailL);
                                        window.clientActivePlatforms['netflix_temp'].add(itemEmailL);
                                    }
                                    if (itemPlatform === 'disney') {
                                        window.clientActivePlatforms['disney_update'].add(itemEmailL);
                                        window.clientActivePlatforms['disney_tv'].add(itemEmailL);
                                        window.clientActivePlatforms['disney_code_tv'].add(itemEmailL);
                                    }
                                    if (itemPlatform === 'hbomax') {
                                        window.clientActivePlatforms['hbomax_update'].add(itemEmailL);
                                        window.clientActivePlatforms['hbomax_tv'].add(itemEmailL);
                                    }
                                    if (itemPlatform === 'prime') {
                                        window.clientActivePlatforms['prime_tv'].add(itemEmailL);
                                    }
                                    if (itemPlatform === 'crunchyroll') {
                                        window.clientActivePlatforms['crunchyroll_tv'].add(itemEmailL);
                                    }
                                    if (itemPlatform === 'vix') {
                                        window.clientActivePlatforms['vix_tv'].add(itemEmailL);
                                    }
                                } else {
                                    window.clientActivePlatforms.global.add(itemEmailL);
                                }
                            }

                            if (item.specificEmails && Array.isArray(item.specificEmails)) {
                                item.specificEmails.forEach(se => {
                                    if (se.email) {
                                        const emailL = se.email.toLowerCase().trim();
                                        window.allClientActiveEmails.add(emailL);

                                        // 1º Identificar plataforma propia del correo (crítico para COMBOS)
                                        let effPlat = null;
                                        const sePlat = (se.platform || '').toLowerCase();
                                        if (sePlat.includes('netflix')) effPlat = 'netflix';
                                        else if (sePlat.includes('disney')) effPlat = 'disney';
                                        else if (sePlat.includes('hbo') || sePlat.includes('max')) effPlat = 'hbomax';
                                        else if (sePlat.includes('prime') || sePlat.includes('amazon')) effPlat = 'prime';
                                        else if (sePlat.includes('vix')) effPlat = 'vix';
                                        else if (sePlat.includes('crunch') || sePlat.includes('roll')) effPlat = 'crunchyroll';

                                        // 2º Si el objeto no traía platform explícita, heredar de la plataforma del item
                                        if (!effPlat) effPlat = itemPlatform;

                                        if (effPlat) {
                                            userPurchasedPlatforms.add(effPlat);
                                            window.clientActivePlatforms[effPlat].add(emailL);
                                            if (effPlat === 'netflix') {
                                                window.clientActivePlatforms['netflix_update'].add(emailL);
                                                window.clientActivePlatforms['netflix_temp'].add(emailL);
                                            }
                                            if (effPlat === 'disney') {
                                                window.clientActivePlatforms['disney_update'].add(emailL);
                                                window.clientActivePlatforms['disney_tv'].add(emailL);
                                                window.clientActivePlatforms['disney_code_tv'].add(emailL);
                                            }
                                            if (effPlat === 'hbomax') {
                                                window.clientActivePlatforms['hbomax_update'].add(emailL);
                                                window.clientActivePlatforms['hbomax_tv'].add(emailL);
                                            }
                                            if (effPlat === 'prime') {
                                                window.clientActivePlatforms['prime_tv'].add(emailL);
                                            }
                                            if (effPlat === 'crunchyroll') {
                                                window.clientActivePlatforms['crunchyroll_tv'].add(emailL);
                                            }
                                            if (effPlat === 'vix') {
                                                window.clientActivePlatforms['vix_tv'].add(emailL);
                                            }
                                        } else {
                                            window.clientActivePlatforms.global.add(emailL);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                // Registrar plataformas que tengan correos asignados directamente
                ['netflix', 'disney', 'hbomax', 'prime', 'vix', 'crunchyroll'].forEach(p => {
                    if (window.clientActivePlatforms[p] && window.clientActivePlatforms[p].size > 0) {
                        userPurchasedPlatforms.add(p);
                    }
                });

                // Mapeo de subplataformas a plataformas base compradas
                const PLATFORM_TO_BASE = {
                    'netflix': 'netflix',
                    'netflix_update': 'netflix',
                    'netflix_temp': 'netflix',
                    'netflix_tv': 'netflix',
                    'disney': 'disney',
                    'disney_update': 'disney',
                    'disney_tv': 'disney',
                    'disney_code_tv': 'disney',
                    'hbomax': 'hbomax',
                    'hbomax_update': 'hbomax',
                    'hbomax_tv': 'hbomax',
                    'prime': 'prime',
                    'prime_tv': 'prime',
                    'vix': 'vix',
                    'vix_tv': 'vix',
                    'crunchyroll': 'crunchyroll',
                    'crunchyroll_tv': 'crunchyroll'
                };

                // Filtrar botones según las pantallas/servicios activos del cliente
                const hasPurchasedAny = userPurchasedPlatforms.size > 0;
                const platformTabBtns = document.querySelectorAll('.platform-tab-btn');
                platformTabBtns.forEach(btn => {
                    const plat = btn.dataset.platform;
                    const basePlat = PLATFORM_TO_BASE[plat] || plat;
                    const card = btn.closest('.platform-action-card');

                    // Mostrar si el cliente compró la plataforma base, o fallback si tiene cuentas activas sin plataforma clasificada
                    let isVisible = false;
                    if (hasPurchasedAny) {
                        isVisible = userPurchasedPlatforms.has(basePlat);
                    } else if (window.clientActivePlatforms.global.size > 0 || window.allClientActiveEmails.size > 0) {
                        isVisible = true;
                    }

                    if (card) {
                        card.dataset.hasPurchased = isVisible ? 'true' : 'false';
                    }
                    if (isVisible) {
                        if (card) card.style.display = 'flex';
                        else btn.style.display = 'flex';
                    } else {
                        if (card) card.style.display = 'none';
                        else btn.style.display = 'none';
                    }
                });

                // Inmediatamente aplicar el estado de intentos y estilos encendidos
                if (window.updateCodeCountersUI) {
                    window.updateCodeCountersUI();
                }

                // Si ninguna plataforma quedó visible
                const anyVisibleCard = document.querySelector('.platform-action-card:not([style*="display: none"])');
                if (!anyVisibleCard) {
                    emailSelect.innerHTML = '<option value="">-- No tienes pantallas activas o intentos disponibles --</option>';
                }

                // Poblar específicamente el selector de correos para Activar TV (Solo Netflix y global)
                const tvEmailSelect = document.getElementById('tv-email-select');
                if (tvEmailSelect && window.clientActivePlatforms) {
                    const netflixEmails = window.clientActivePlatforms.netflix || new Set();
                    const globEmails = window.clientActivePlatforms.global || new Set();
                    const combined = new Set([...netflixEmails, ...globEmails]);

                    tvEmailSelect.innerHTML = '';
                    if (combined.size > 0) {
                        combined.forEach(em => {
                            const opt = document.createElement('option');
                            opt.value = opt.textContent = em;
                            tvEmailSelect.appendChild(opt);
                        });
                    } else {
                        tvEmailSelect.innerHTML = '<option value="">-- Sin cuentas Netflix --</option>';
                    }
                }

                // Poblar específicamente el selector de correos para Activar HBO Max TV (Solo HBO Max y global)
                const hboTvEmailSelect = document.getElementById('hbo-tv-email-select');
                if (hboTvEmailSelect && window.clientActivePlatforms) {
                    const hboEmails = window.clientActivePlatforms.hbomax || new Set();
                    const globEmails = window.clientActivePlatforms.global || new Set();
                    const combined = new Set([...hboEmails, ...globEmails]);

                    hboTvEmailSelect.innerHTML = '';
                    if (combined.size > 0) {
                        combined.forEach(em => {
                            const opt = document.createElement('option');
                            opt.value = opt.textContent = em;
                            hboTvEmailSelect.appendChild(opt);
                        });
                    } else {
                        hboTvEmailSelect.innerHTML = '<option value="">-- Sin cuentas HBO Max --</option>';
                    }
                }

                // Poblar específicamente el selector de correos para Activar Prime Video TV (Solo Prime y global)
                const primeTvEmailSelect = document.getElementById('prime-tv-email-select');
                if (primeTvEmailSelect && window.clientActivePlatforms) {
                    const primeEmails = window.clientActivePlatforms.prime || new Set();
                    const globEmails = window.clientActivePlatforms.global || new Set();
                    const combined = new Set([...primeEmails, ...globEmails]);

                    primeTvEmailSelect.innerHTML = '';
                    if (combined.size > 0) {
                        combined.forEach(em => {
                            const opt = document.createElement('option');
                            opt.value = opt.textContent = em;
                            primeTvEmailSelect.appendChild(opt);
                        });
                    } else {
                        primeTvEmailSelect.innerHTML = '<option value="">-- Sin cuentas Prime Video --</option>';
                    }
                }

                // Poblar específicamente el selector de correos para Activar Crunchyroll TV (Solo Crunchyroll y global)
                const crunchyTvEmailSelect = document.getElementById('crunchyroll-tv-email-select');
                if (crunchyTvEmailSelect && window.clientActivePlatforms) {
                    const crunchyEmails = window.clientActivePlatforms.crunchyroll || new Set();
                    const globEmails = window.clientActivePlatforms.global || new Set();
                    const combined = new Set([...crunchyEmails, ...globEmails]);

                    crunchyTvEmailSelect.innerHTML = '';
                    if (combined.size > 0) {
                        combined.forEach(em => {
                            const opt = document.createElement('option');
                            opt.value = opt.textContent = em;
                            crunchyTvEmailSelect.appendChild(opt);
                        });
                    } else {
                        crunchyTvEmailSelect.innerHTML = '<option value="">-- Sin cuentas Crunchyroll --</option>';
                    }
                }

                // Poblar específicamente el selector de correos para Activar Disney TV con código (Solo Disney y global)
                const disneyCodeTvEmailSelect = document.getElementById('disney-code-tv-email-select');
                if (disneyCodeTvEmailSelect && window.clientActivePlatforms) {
                    const disneyEmails = window.clientActivePlatforms.disney || new Set();
                    const globEmails = window.clientActivePlatforms.global || new Set();
                    const combined = new Set([...disneyEmails, ...globEmails]);

                    disneyCodeTvEmailSelect.innerHTML = '';
                    if (combined.size > 0) {
                        combined.forEach(em => {
                            const opt = document.createElement('option');
                            opt.value = opt.textContent = em;
                            disneyCodeTvEmailSelect.appendChild(opt);
                        });
                    } else {
                        disneyCodeTvEmailSelect.innerHTML = '<option value="">-- Sin cuentas Disney --</option>';
                    }
                }

                // Poblar específicamente el selector de correos para Activar ViX TV (Solo ViX y global)
                const vixTvEmailSelect = document.getElementById('vix-tv-email-select');
                if (vixTvEmailSelect && window.clientActivePlatforms) {
                    const vixEmails = window.clientActivePlatforms.vix || new Set();
                    const globEmails = window.clientActivePlatforms.global || new Set();
                    const combined = new Set([...vixEmails, ...globEmails]);

                    vixTvEmailSelect.innerHTML = '';
                    if (combined.size > 0) {
                        combined.forEach(em => {
                            const opt = document.createElement('option');
                            opt.value = opt.textContent = em;
                            vixTvEmailSelect.appendChild(opt);
                        });
                    } else {
                        vixTvEmailSelect.innerHTML = '<option value="">-- Sin cuentas ViX --</option>';
                    }
                }
            } catch (e) {
                emailSelect.innerHTML = '<option value="">-- Error al cargar cuentas --</option>';
            }
        }

        // 4. MOSTRAR PANEL ACTIVO Y REFRESCAR CONTADORES Y BOTONES
        activePanel.style.display = 'block';
        if (window.updateCodeCountersUI) window.updateCodeCountersUI();
    };

    // Cuando el modal de código abre, inicializarlo
    if (codeModal) {
        const originalOpenCode = document.getElementById('open-code-btn');
        if (originalOpenCode) {
            originalOpenCode.addEventListener('click', () => {
                if (isSellerMode && currentSellerName) {
                    window.isSellerActivatingClient = true;
                    window.codeModalTargetSellerName = currentSellerName;
                    window.codeModalTargetPhone = '';
                    window.codeModalTargetClientName = '';
                    window.codeModalTargetClientKey = '';
                } else {
                    window.isSellerActivatingClient = false;
                    window.codeModalTargetPhone = '';
                    window.codeModalTargetClientName = '';
                    window.codeModalTargetClientKey = '';
                    window.codeModalTargetSellerName = '';
                }
                codeModal.style.display = 'block';
                window.initCodeModal(false);
            });
        }
        // También inicializar si ya fue abierto directamente
        const codeCloseBtn = document.querySelector('.code-close');
        if (codeCloseBtn) {
            codeCloseBtn.addEventListener('click', () => {
                if (window.closeCodeModal) {
                    window.closeCodeModal();
                } else {
                    codeModal.style.display = 'none';
                }
            });
        }
    }

    // =============================================
    // SUBTABS DE PLATAFORMA — Colores por servicio
    // =============================================
    const platformTabBtns = document.querySelectorAll('.platform-tab-btn');
    const codePlatformInput = document.getElementById('code-platform');
    platformTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const chosen = btn.dataset.platform;
            // Actualizar el campo oculto
            if (codePlatformInput) codePlatformInput.value = chosen;

            // Mantener todos los tabs encendidos con sus colores de marca
            const themes = window.PLATFORM_THEMES || {};
            platformTabBtns.forEach(b => {
                const bPlat = b.dataset.platform;
                const theme = themes[bPlat] || { border: '#E50914', bg: 'rgba(229,9,20,0.22)', activeBg: 'rgba(229,9,20,0.45)', shadow: 'rgba(229,9,20,0.35)' };
                if (b === btn) {
                    b.classList.add('active-platform');
                    b.style.border = `2px solid ${theme.border}`;
                    b.style.background = theme.activeBg;
                    b.style.color = '#ffffff';
                    b.style.boxShadow = `0 0 16px ${theme.shadow}, inset 0 0 10px rgba(255,255,255,0.15)`;
                    b.style.filter = 'brightness(1.15)';
                } else {
                    b.classList.remove('active-platform');
                    b.style.border = `2px solid ${theme.border}`;
                    b.style.background = theme.bg;
                    b.style.color = '#ffffff';
                    b.style.boxShadow = `0 4px 12px ${theme.shadow}`;
                    b.style.filter = 'none';
                }
            });

            // Actualizar el selector de correos según las plataformas validadas (window.clientActivePlatforms)
            const emailSelect = document.getElementById('code-email');
            if (emailSelect && window.clientActivePlatforms) {
                const specEmails = window.clientActivePlatforms[chosen] || new Set();
                const globalEmails = window.clientActivePlatforms.global || new Set();
                let combined = new Set([...specEmails, ...globalEmails]);

                // Fallback: si para la plataforma no hay correos marcados específicamente,
                // permitir cualquier correo activo de las compras del cliente:
                if (combined.size === 0 && window.allClientActiveEmails && window.allClientActiveEmails.size > 0) {
                    combined = new Set(window.allClientActiveEmails);
                }

                emailSelect.innerHTML = '';
                if (combined.size > 0) {
                    combined.forEach(em => {
                        const opt = document.createElement('option');
                        opt.value = em;
                        opt.textContent = em;
                        emailSelect.appendChild(opt);
                    });
                } else {
                    emailSelect.innerHTML = '<option value="">-- Sin correos para esta plataforma --</option>';
                }
            }

            // Validar si el intento YA fue consumido para esta plataforma en específico
            const fetchBtn = document.getElementById('fetch-code-btn');
            if (fetchBtn) {
                if (['netflix', 'disney', 'hbomax', 'prime', 'vix', 'crunchyroll', 'netflix_update', 'netflix_temp', 'disney_update', 'hbomax_update', 'disney_tv', 'disney_code_tv', 'hbomax_tv', 'prime_tv', 'crunchyroll_tv', 'vix_tv'].includes(chosen)) {
                    fetchBtn.style.display = 'none';
                } else {
                    fetchBtn.style.display = 'block';
                }
                let isExhausted = false;
                if (window.clientUsedAttempts) {
                    if (chosen === 'netflix_update') {
                        const updatesUsed = parseInt(window.clientUsedAttempts[chosen]) || 0;
                        if (updatesUsed >= 2) isExhausted = true;
                    } else if (window.clientUsedAttempts[chosen] === true) {
                        isExhausted = true;
                    }
                }

                if (isExhausted) {
                    fetchBtn.disabled = true;
                    fetchBtn.innerHTML = chosen === 'netflix_update' ? '<i class="fa-solid fa-lock"></i> Límite de Actualizaciones superado (2/2)' : '<i class="fa-solid fa-lock"></i> Intento de esta plataforma agotado';
                    fetchBtn.style.opacity = '0.5';
                    fetchBtn.style.cursor = 'not-allowed';
                    if (chosen === 'netflix_update') {
                        setTimeout(() => {
                            if (typeof Swal !== 'undefined') {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Límite de Actualización Alcanzado',
                                    html: '<span style="color:#aaa;">Ya has utilizado tus 2 intentos de actualización de hogar (solo se permite 1 cliente por hogar).</span><br><br><strong style="color:white;">Por favor, solicita a tu vendedor un CAMBIO DE CUENTA para evitar que pierdas el acceso.</strong>',
                                    confirmButtonColor: '#E50914',
                                    confirmButtonText: 'Entendido',
                                    background: '#1a1a1a',
                                    color: '#fff',
                                    customClass: { popup: 'swal-modern-dark' }
                                });
                            } else {
                                alert('Atención: Ya has utilizado tus 2 intentos de actualización de hogar (solo se permite 1 cliente por hogar). Por favor, solicita a tu vendedor un CAMBIO DE CUENTA para evitar que pierdas el acceso.');
                            }
                        }, 200);
                    }
                } else {
                    fetchBtn.disabled = false;
                    fetchBtn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> Buscar mi Código';
                    fetchBtn.style.opacity = '1';
                    fetchBtn.style.cursor = 'pointer';
                }
            }
        });
    });

    // Lógica Centralizada de Solicitud de Código (Tanto para botón general como botones directos)
    async function executeFetchCode(platform, triggerBtn) {
        const emailSelect = document.getElementById('code-email');
        const email = emailSelect ? emailSelect.value.trim() : '';

        if (!email) {
            alert('Por favor selecciona el correo de tu cuenta arriba.');
            return;
        }

        const targetPhone = window.getEffectiveCodeTargetPhone();
        if (!targetPhone) {
            alert('Debes iniciar sesión para solicitar un código.');
            return;
        }

        // Validar si el intento YA fue consumido (compartido entre cliente y vendedor)
        const isAdmin = window.isUserAdmin && window.isUserAdmin();
        let isExhausted = false;
        if (window.clientUsedAttempts && !isAdmin) {
            if (platform === 'netflix_update' || platform === 'disney_update' || platform === 'hbomax_update') {
                const updatesUsed = parseInt(window.clientUsedAttempts[platform]) || 0;
                if (updatesUsed >= 2) isExhausted = true;
            } else if (platform === 'disney_tv' || platform === 'disney_code_tv') {
                const tvEmail = window.clientUsedAttempts['disney_tv'];
                const tvCode = window.clientUsedAttempts['disney_code_tv'];
                if (tvEmail === true || (typeof tvEmail === 'number' && tvEmail >= 1) ||
                    tvCode === true || (typeof tvCode === 'number' && tvCode >= 1)) {
                    isExhausted = true;
                }
            } else if (window.clientUsedAttempts[platform] === true || (typeof window.clientUsedAttempts[platform] === 'number' && window.clientUsedAttempts[platform] >= 1)) {
                isExhausted = true;
            }
        }

        if (isExhausted) {
            if (platform === 'netflix_update' || platform === 'disney_update' || platform === 'hbomax_update') {
                const brand = platform === 'netflix_update' ? 'Netflix' : (platform === 'disney_update' ? 'Disney' : 'HBO Max');
                const brandColor = platform === 'netflix_update' ? '#E50914' : (platform === 'disney_update' ? '#113CCF' : '#6c5ce7');
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Límite de Actualización Alcanzado',
                        html: `<span style="color:#aaa;">Ya se han utilizado los 2 intentos de actualización / fuera de casa en ${brand} (contador compartido cliente/vendedor).</span><br><br><strong style="color:white;">Por favor, solicita un CAMBIO DE CUENTA para evitar que pierdas el acceso.</strong>`,
                        confirmButtonColor: brandColor,
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                } else {
                    alert(`Atención: Ya se han utilizado los 2 intentos en ${brand}.`);
                }
            } else if (platform === 'disney_tv' || platform === 'disney_code_tv') {
                alert('⚠️ Ya se utilizó el intento disponible (1 vez) para activar Disney en TV.');
            } else {
                alert('⚠️ Ya se utilizó el intento disponible para esta plataforma (contador compartido cliente/vendedor).');
            }
            return;
        }

        // 1. Mostrar estado de carga y ocultar error/resultado
        const loadingEl = document.getElementById('code-loading');
        const resultEl = document.getElementById('code-result');
        const errorEl = document.getElementById('code-error');
        if (loadingEl) loadingEl.style.display = 'block';
        if (resultEl) resultEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';

        let originalBtnHtml = '';
        if (triggerBtn) {
            originalBtnHtml = triggerBtn.innerHTML;
            triggerBtn.disabled = true;
            triggerBtn.innerHTML = platform === 'vix'
                ? '<i class="fa-solid fa-spinner fa-spin"></i> Activando tu celular...'
                : '<i class="fa-solid fa-spinner fa-spin"></i> Solicitando código...';
        }

        try {
            const serverUrl = "https://streaming-backend-ce1u.onrender.com/api/get-code";
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, platform })
            });
            const data = await response.json();

            if (data.success && data.code) {
                // ✅ ÉXITO: Registrar en Firebase y marcar intento usado tanto para el cliente como para el vendedor (mismo nodo clientProfiles)
                const cleanPhone = window.sanitizePhone ? window.sanitizePhone(targetPhone) : targetPhone;
                if (!window.clientUsedAttempts) window.clientUsedAttempts = {};

                const pathSuffix = window.getCodeAttemptPathSuffix ? window.getCodeAttemptPathSuffix(targetPhone, window.codeModalTargetClientName) : 'codeAttemptUsed';

                if (platform === 'netflix_update' || platform === 'disney_update' || platform === 'hbomax_update') {
                    const currentAttempts = parseInt(window.clientUsedAttempts[platform]) || 0;
                    const nextCount = currentAttempts + 1;
                    await db.ref(`clientProfiles/${targetPhone}/${pathSuffix}/${platform}`).set(nextCount);
                    if (cleanPhone && cleanPhone !== targetPhone) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/${platform}`).set(nextCount);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/${platform}`).set(nextCount);
                    }
                    window.clientUsedAttempts[platform] = nextCount;
                } else if (platform === 'disney_tv' || platform === 'disney_code_tv') {
                    // 🏰 Disney TV vinculados: descontar y bloquear ambos (email y código)
                    await db.ref(`clientProfiles/${targetPhone}/${pathSuffix}/disney_tv`).set(true);
                    await db.ref(`clientProfiles/${targetPhone}/${pathSuffix}/disney_code_tv`).set(true);
                    if (cleanPhone && cleanPhone !== targetPhone) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/disney_tv`).set(true);
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/disney_code_tv`).set(true);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/disney_tv`).set(true);
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/disney_code_tv`).set(true);
                    }
                    window.clientUsedAttempts['disney_tv'] = true;
                    window.clientUsedAttempts['disney_code_tv'] = true;
                } else {
                    await db.ref(`clientProfiles/${targetPhone}/${pathSuffix}/${platform}`).set(true);
                    if (cleanPhone && cleanPhone !== targetPhone) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/${platform}`).set(true);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/${platform}`).set(true);
                    }
                    window.clientUsedAttempts[platform] = true;
                }

                if (window.updateCodeCountersUI) window.updateCodeCountersUI();

                await db.ref(`clientProfiles/${targetPhone}/codeHistory`).push({
                    code: data.code,
                    email: email,
                    platform: platform,
                    requestedBy: window.isSellerActivatingClient ? `Vendedor: ${window.codeModalTargetSellerName || currentSellerName}` : 'Cliente',
                    timestamp: Date.now()
                });

                if (loadingEl) loadingEl.style.display = 'none';
                const codeResultOverlay = document.getElementById('code-result');
                if (codeResultOverlay) codeResultOverlay.style.display = 'flex';

                const codeVal = data.code.toString().trim();
                const titleEl = document.getElementById('code-result-title');
                const magicCodeEl = document.getElementById('the-magic-code');
                const linkContainer = document.getElementById('the-magic-link-container');
                const linkBtn = document.getElementById('the-magic-link-btn');

                if (platform === 'vix' || (data && data.activated) || codeVal === 'ACTIVADO') {
                    if (magicCodeEl) magicCodeEl.style.display = 'none';
                    const copyBtn = document.getElementById('copy-magic-code-btn');
                    if (copyBtn) copyBtn.style.display = 'none';
                    const codeBox = document.getElementById('magic-code-box');
                    if (codeBox) codeBox.style.display = 'none';
                    if (linkContainer) linkContainer.style.display = 'none';

                    if (titleEl) titleEl.innerText = '¡Dispositivo ViX Activado!';

                    const existingCard = document.getElementById('vix-success-card');
                    if (!existingCard) {
                        const vCard = document.createElement('div');
                        vCard.id = 'vix-success-card';
                        vCard.style.cssText = 'background:rgba(46,204,113,0.12); border:1.5px solid #2ecc71; border-radius:14px; padding:1.2rem; margin:1rem 0; text-align:center;';
                        vCard.innerHTML = `
                            <div style="font-size:3rem; margin-bottom:0.5rem; filter:drop-shadow(0 0 10px rgba(46,204,113,0.5));">🎉</div>
                            <h4 style="color:#2ecc71; font-size:1.15rem; margin-bottom:0.4rem; font-weight:700;">¡Tu sesión ha sido iniciada con éxito!</h4>
                            <p style="color:#eee; font-size:0.9rem; line-height:1.4; margin:0 0 1rem 0;">
                                El bot ejecutó la validación del enlace en segundo plano.<br>
                                <strong style="color:#fff;">Ya puedes abrir la aplicación de ViX en tu celular o TV</strong>, tu cuenta ha iniciado sesión automáticamente.
                            </p>
                            <button type="button" onclick="closeCodeResultModal()" style="background:#2ecc71; border:none; color:#111; font-weight:bold; padding:10px 22px; border-radius:8px; cursor:pointer; font-size:0.95rem; box-shadow:0 4px 12px rgba(46,204,113,0.3);">
                                <i class="fa-solid fa-check"></i> Entendido
                            </button>
                        `;
                        const noteContainer = document.getElementById('floating-code-notes') || document.getElementById('code-result');
                        if (noteContainer) noteContainer.appendChild(vCard);
                    }
                } else if (codeVal.startsWith('http://') || codeVal.startsWith('https://')) {
                    // Seguridad: Si por alguna razón llegó un enlace de cambio de contraseña, nunca mostrarlo
                    if (codeVal.toLowerCase().includes('password') || codeVal.toLowerCase().includes('reset') || codeVal.includes('URL_ACCOUNT_PASSWORD')) {
                        if (loadingEl) loadingEl.style.display = 'none';
                        if (codeResultOverlay) codeResultOverlay.style.display = 'none';
                        if (errorEl) {
                            errorEl.style.display = 'block';
                            errorEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#e74c3c;"></i> Se detectó un correo de restablecimiento de contraseña en lugar del código temporal. Solicita el código de nuevo desde tu televisor o celular y vuelve a pulsar el botón.';
                        }
                        return;
                    }

                    if (magicCodeEl) magicCodeEl.style.display = 'none';
                    const copyBtn = document.getElementById('copy-magic-code-btn');
                    if (copyBtn) copyBtn.style.display = 'none';
                    const codeBox = document.getElementById('magic-code-box');
                    if (codeBox) codeBox.style.display = 'none';

                    if (linkContainer) linkContainer.style.display = 'block';
                    if (linkBtn) {
                        linkBtn.href = codeVal;
                        linkBtn.target = '_blank';
                    }
                    if (platform === 'netflix_temp') {
                        if (titleEl) titleEl.innerText = 'Tu enlace de código temporal:';
                        if (linkBtn) linkBtn.innerHTML = '<i class="fa-solid fa-mobile-screen-button"></i> Clic aquí → Ver mi Código en Netflix';
                        const existingNote = document.getElementById('temp-access-note');
                        if (!existingNote) {
                            const note = document.createElement('p');
                            note.id = 'temp-access-note';
                            note.style.cssText = 'font-size:0.78rem; color:#aaa; margin-top:0.8rem; background:rgba(229,9,20,0.08); border:1px solid rgba(229,9,20,0.3); border-radius:8px; padding:8px 12px; text-align:left;';
                            note.innerHTML = '<i class="fa-solid fa-circle-info" style="color:#E50914;"></i> <strong style="color:white;">¿Cómo funciona?</strong> Al dar clic se abrirá la página de Netflix. Allí verás un código de 4 dígitos en pantalla. Úsalo para acceder desde tu dispositivo. El enlace vence en <strong style="color:#f39c12;">15 minutos</strong>.';
                            const noteContainer = document.getElementById('floating-code-notes') || document.getElementById('code-result');
                            if (noteContainer) noteContainer.appendChild(note);
                        }
                    } else {
                        if (titleEl) titleEl.innerText = 'Confirmación requerida:';
                        if (linkBtn) {
                            linkBtn.innerHTML = '<i class="fa-solid fa-house-circle-check"></i> Clic aquí para Aceptar Actualización';
                            linkBtn.style.background = 'linear-gradient(135deg, #E50914, #B81D24)';
                            linkBtn.style.boxShadow = '0 6px 20px rgba(229,9,20,0.45)';
                        }
                    }
                } else {
                    if (titleEl) {
                        if (platform === 'netflix_temp') {
                            titleEl.innerText = 'Tu código de Acceso Temporal Netflix:';
                        } else if (platform === 'disney_update') {
                            titleEl.innerText = data.detectedType === 'hogar'
                                ? 'Tu código de Actualizar Hogar Disney:'
                                : (data.detectedType === 'fuera_de_casa'
                                    ? 'Tu código de Fuera de Casa Disney:'
                                    : 'Tu código de Disney es:');
                        } else if (platform === 'disney_tv') {
                            titleEl.innerText = 'Tu código de Inicio de Sesión Disney en TV:';
                        } else if (platform === 'hbomax_update') {
                            titleEl.innerText = 'Tu código Fuera de Casa HBO Max:';
                        } else {
                            titleEl.innerText = 'Tu código de acceso es:';
                        }
                    }
                    if (linkContainer) linkContainer.style.display = 'none';
                    const codeBox = document.getElementById('magic-code-box');
                    if (codeBox) codeBox.style.display = 'block';
                    const copyBtn = document.getElementById('copy-magic-code-btn');
                    if (copyBtn) copyBtn.style.display = 'inline-flex';
                    if (magicCodeEl) {
                        magicCodeEl.style.display = 'block';
                        magicCodeEl.innerText = codeVal;
                    }
                }
            } else {
                if (loadingEl) loadingEl.style.display = 'none';
                if (errorEl) errorEl.style.display = 'block';
                let msg = data.error || "Código no encontrado. Intenta solicitarlo nuevamente.";
                document.getElementById('error-msg').innerHTML = msg;
            }
        } catch (err) {
            if (loadingEl) loadingEl.style.display = 'none';
            if (errorEl) errorEl.style.display = 'block';
            document.getElementById('error-msg').innerText = "Error de conexión con el servidor. Intenta de nuevo.";
        } finally {
            if (triggerBtn) {
                setTimeout(() => {
                    if (window.updateCodeCountersUI) window.updateCodeCountersUI();
                    else if (originalBtnHtml) triggerBtn.innerHTML = originalBtnHtml;
                }, 800);
            }
        }
    }

    // Eventos para los botones directos bajo Netflix, Actualiza Hogar y Acceso Temporal
    document.querySelectorAll('.direct-fetch-code-btn').forEach(dBtn => {
        dBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const plat = dBtn.dataset.platform;
            const codePlatformInput = document.getElementById('code-platform');
            if (codePlatformInput) codePlatformInput.value = plat;

            // También activar visualmente el tab asociado
            const tabBtn = document.querySelector(`.platform-tab-btn[data-platform="${plat}"]`);
            if (tabBtn) tabBtn.click();

            executeFetchCode(plat, dBtn);
        });
    });

    // Code Fetch Logic para botón tradicional (si aplica a otras plataformas)
    if (fetchCodeBtn) {
        fetchCodeBtn.addEventListener('click', () => {
            const platform = document.getElementById('code-platform').value;
            executeFetchCode(platform, fetchCodeBtn);
        });
    }

    // Modal Flotante de Código: Cerrar y Copiar
    window.closeCodeResultModal = function () {
        const el = document.getElementById('code-result');
        if (el) el.style.display = 'none';
        const vCard = document.getElementById('vix-success-card');
        if (vCard) vCard.remove();
        const tNote = document.getElementById('temp-access-note');
        if (tNote) tNote.remove();
    };

    window.copyFloatingCode = function () {
        const codeEl = document.getElementById('the-magic-code');
        const text = codeEl ? codeEl.innerText.trim() : '';
        if (!text || text === '----') return;
        const btn = document.getElementById('copy-magic-code-btn');
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (btn) {
                    const oldHtml = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check" style="color:#2ecc71;"></i> ¡Copiado!';
                    btn.style.borderColor = '#2ecc71';
                    btn.style.color = '#2ecc71';
                    setTimeout(() => {
                        btn.innerHTML = oldHtml;
                        btn.style.borderColor = 'rgba(255,255,255,0.2)';
                        btn.style.color = '#fff';
                    }, 2000);
                }
            }).catch(() => {
                alert('Código: ' + text);
            });
        } else {
            alert('Código: ' + text);
        }
    };

    // ============================================
    // ACTIVAR TV (netflix.com/tv8)
    // ============================================
    const showTvBtn = document.getElementById('show-tv-login-btn');
    const tvPanel = document.getElementById('tv-login-panel');
    const activateTvBtn = document.getElementById('activate-tv-btn');

    if (showTvBtn && tvPanel) {
        showTvBtn.addEventListener('click', () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['netflix_tv'] === true || (typeof window.clientUsedAttempts['netflix_tv'] === 'number' && window.clientUsedAttempts['netflix_tv'] >= 1));
            if (isTvUsed) {
                alert('⚠️ Ya usaste tu intento (1 vez) para activar Smart TV.');
                return;
            }

            const isOpen = tvPanel.style.display !== 'none';
            tvPanel.style.display = isOpen ? 'none' : 'block';
            showTvBtn.style.borderColor = '#E50914';
            showTvBtn.style.color = '#ffffff';
            showTvBtn.style.background = isOpen ? 'rgba(229,9,20,0.22)' : 'rgba(229,9,20,0.45)';
            showTvBtn.style.boxShadow = '0 4px 12px rgba(229,9,20,0.35)';
            if (!isOpen) {
                document.getElementById('tv-activation-loading').style.display = 'none';
                document.getElementById('tv-activation-result').style.display = 'none';
                document.getElementById('tv-activation-error').style.display = 'none';
            }
        });
    }

    if (activateTvBtn) {
        activateTvBtn.addEventListener('click', async () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['netflix_tv'] === true || (typeof window.clientUsedAttempts['netflix_tv'] === 'number' && window.clientUsedAttempts['netflix_tv'] >= 1));
            if (isTvUsed) {
                return alert('⚠️ Ya has utilizado tu intento (1 vez) para activar Smart TV.');
            }

            const tvCode = document.getElementById('tv-code-input').value.trim();
            const emailSelect = document.getElementById('tv-email-select');
            const email = emailSelect ? emailSelect.value.trim() : '';

            if (!tvCode) return alert('\u26a0\ufe0f Ingresa el código que aparece en tu TV.');
            if (!window.getEffectiveCodeTargetPhone()) return alert('Debes iniciar sesión primero.');
            if (!email) return alert('Selecciona el correo de tu cuenta Netflix.');

            // Bloquear botón temporalmente
            const originalBtnText = activateTvBtn.innerHTML;
            activateTvBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Activando TV...';
            activateTvBtn.disabled = true;
            document.getElementById('tv-activation-loading').style.display = 'block';
            document.getElementById('tv-activation-result').style.display = 'none';
            document.getElementById('tv-activation-error').style.display = 'none';

            // Iniciar interfaz de cuenta regresiva y fases de proceso
            let totalSeconds = 35;
            let secondsRemaining = totalSeconds;
            const timerEl = document.getElementById('tv-countdown-timer');
            const progressEl = document.getElementById('tv-progress-bar');
            const phaseEl = document.getElementById('tv-status-phase');
            const queueNoticeEl = document.getElementById('tv-queue-notice');

            if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
            if (progressEl) progressEl.style.width = '5%';
            if (queueNoticeEl) queueNoticeEl.style.display = 'none';
            if (phaseEl) phaseEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando al sistema...';

            let countdownInterval = setInterval(() => {
                if (secondsRemaining > 1) {
                    secondsRemaining--;
                    if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
                    const percent = Math.min(95, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100));
                    if (progressEl) progressEl.style.width = `${percent}%`;

                    if (phaseEl) {
                        if (percent < 25) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-network-wired"></i> Conectando con Netflix...';
                        } else if (percent < 55) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-key"></i> Validando código de acceso...';
                        } else if (percent < 80) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-tv"></i> Vinculando Smart TV...';
                        } else {
                            phaseEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Finalizando activación...';
                        }
                    }
                }
            }, 1000);

            try {
                // ── Seleccionar backend: ngrok (Firebase) → Bot Local → Render ──
                const RENDER_URL = 'https://streaming-backend-ce1u.onrender.com';
                let botUrl = RENDER_URL;
                let usingLocal = false;

                // 1) Leer URL pública de Firebase (puesta por el bot local vía ngrok)
                let ngrokUrl = null;
                try {
                    const snap = await db.ref('config/botUrl').once('value');
                    ngrokUrl = snap.val();
                } catch (e) { /* Firebase no accesible */ }

                if (ngrokUrl) {
                    botUrl = ngrokUrl;
                    usingLocal = true;
                    console.log('[TV] Uso de ngrok:', ngrokUrl);
                } else {
                    // Fallback a localhost
                    try {
                        const localCheck = await Promise.race([
                            fetch('http://localhost:3099/status'),
                            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
                        ]);
                        if (localCheck.ok) {
                            botUrl = 'http://localhost:3099';
                            usingLocal = true;
                        }
                    } catch (e) {
                        console.log('[TV] Bot local no disponible, usando Render...');
                    }
                }

                // Si hay bot local, consultar estado de la cola
                if (usingLocal) {
                    try {
                        const qResp = await fetch(`${botUrl}/api/queue-status`, {
                            headers: { 'ngrok-skip-browser-warning': 'true' }
                        });
                        const qData = await qResp.json();
                        if (qData && qData.success && (qData.isBusy || qData.queueLength > 0)) {
                            const extraTime = Math.max(30, (qData.queueLength + (qData.isBusy ? 1 : 0)) * 30);
                            totalSeconds = extraTime;
                            secondsRemaining = extraTime;
                            if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
                            if (queueNoticeEl) {
                                queueNoticeEl.style.display = 'block';
                                queueNoticeEl.innerHTML = `<i class="fa-solid fa-clock"></i> Hay otro cliente en proceso. Turno #${qData.queueLength + 1}. Tu TV se activará automáticamente a continuación.`;
                            }
                        }
                    } catch (e) { /* Silencioso */ }
                }

                // Llamar al robot
                const response = await fetch(`${botUrl}/api/activate-tv`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ email, tvCode, phone: window.getEffectiveCodeTargetPhone() })
                });
                const data = await response.json();

                clearInterval(countdownInterval);
                if (progressEl) progressEl.style.width = '100%';
                document.getElementById('tv-activation-loading').style.display = 'none';

                if (data.success) {
                    // Registrar en Firebase y consumir intento
                    const targetP = window.getEffectiveCodeTargetPhone();
                    const cleanPhone = window.sanitizePhone ? window.sanitizePhone(targetP) : targetP;
                    const pathSuffix = window.getCodeAttemptPathSuffix ? window.getCodeAttemptPathSuffix(targetP, window.codeModalTargetClientName) : 'codeAttemptUsed';
                    await db.ref(`clientProfiles/${targetP}/tvActivations`).push({ tvCode, email, timestamp: Date.now() });
                    await db.ref(`clientProfiles/${targetP}/${pathSuffix}/netflix_tv`).set(true);
                    if (cleanPhone && cleanPhone !== targetP) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/netflix_tv`).set(true);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/netflix_tv`).set(true);
                    }

                    if (window.clientUsedAttempts) {
                        window.clientUsedAttempts['netflix_tv'] = true;
                        if (window.updateCodeCountersUI) window.updateCodeCountersUI();
                    }

                    // Mostrar éxito real con color verde
                    const resultDiv = document.getElementById('tv-activation-result');
                    resultDiv.style.display = 'block';
                    resultDiv.style.background = 'rgba(46,204,113,0.1)';
                    resultDiv.style.borderColor = '#2ecc71';
                    const icon = document.getElementById('tv-activation-icon');
                    if (icon) { icon.className = 'fa-solid fa-circle-check'; icon.style.color = '#2ecc71'; }
                    const msg = document.getElementById('tv-activation-msg');
                    if (msg) { msg.style.color = '#2ecc71'; msg.innerText = '¡TV Activada Exitosamente!'; }
                    const desc = document.getElementById('tv-activation-desc');
                    if (desc) { desc.innerHTML = '¡Tu Smart TV ya quedó vinculada y lista para reproducir!'; }
                    const codeShow = document.getElementById('tv-activation-code-show');
                    if (codeShow) codeShow.style.display = 'none';
                    const linkBtn = document.querySelector('#tv-activation-result a');
                    if (linkBtn) linkBtn.style.display = 'none';
                } else {
                    document.getElementById('tv-activation-error').style.display = 'block';
                    let errorHtml = data.error || 'Código inválido. Verifica el código en tu TV.';
                    if (data.screenshot) {
                        errorHtml += `<br><br><span style="font-size:0.75rem; color:#aaa;">Captura de lo que ve el bot:</span><br><img src="${data.screenshot}" style="max-width:100%; border-radius:8px; margin-top:8px; border:1px solid rgba(255,255,255,0.2);">`;
                    }
                    document.getElementById('tv-error-msg').innerHTML = errorHtml;
                }

            } catch (err) {
                clearInterval(countdownInterval);
                document.getElementById('tv-activation-loading').style.display = 'none';
                document.getElementById('tv-activation-error').style.display = 'block';
                document.getElementById('tv-error-msg').innerText = 'Error de conexión. Intenta de nuevo en un momento.';
            } finally {
                setTimeout(() => {
                    const isAdmin = window.isUserAdmin && window.isUserAdmin();
                    const isTvUsedNow = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['netflix_tv'] === true || window.clientUsedAttempts['netflix_tv'] >= 1);
                    if (isTvUsedNow) {
                        activateTvBtn.disabled = true;
                        activateTvBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Intento de Smart TV agotado (1/1)';
                        activateTvBtn.style.opacity = '0.5';
                        activateTvBtn.style.cursor = 'not-allowed';
                    } else {
                        activateTvBtn.innerHTML = isAdmin ? (originalBtnText || 'Activar TV (Admin \u221e)') : originalBtnText;
                        activateTvBtn.disabled = false;
                        activateTvBtn.style.opacity = '1';
                        activateTvBtn.style.cursor = 'pointer';
                    }
                }, 1500);
            }
        });
    }

    // ============================================
    // ACTIVAR HBO MAX EN TV (auth.hbomax.com/link)
    // ============================================
    const showHboTvBtn = document.getElementById('show-hbo-tv-login-btn');
    const hboTvPanel = document.getElementById('hbo-tv-login-panel');
    const activateHboTvBtn = document.getElementById('activate-hbo-tv-btn');

    if (showHboTvBtn && hboTvPanel) {
        showHboTvBtn.addEventListener('click', () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['hbomax_tv'] === true || (typeof window.clientUsedAttempts['hbomax_tv'] === 'number' && window.clientUsedAttempts['hbomax_tv'] >= 1));
            if (isTvUsed) {
                alert('⚠️ Ya usaste tu intento (1 vez) para activar HBO Max en TV.');
                return;
            }

            const isOpen = hboTvPanel.style.display !== 'none';
            hboTvPanel.style.display = isOpen ? 'none' : 'block';
            showHboTvBtn.style.borderColor = '#8A2BE2';
            showHboTvBtn.style.color = '#ffffff';
            showHboTvBtn.style.background = isOpen ? 'rgba(138,43,226,0.22)' : 'rgba(138,43,226,0.45)';
            showHboTvBtn.style.boxShadow = '0 4px 12px rgba(138,43,226,0.35)';
            if (!isOpen) {
                document.getElementById('hbo-tv-activation-loading').style.display = 'none';
                document.getElementById('hbo-tv-activation-result').style.display = 'none';
                document.getElementById('hbo-tv-activation-error').style.display = 'none';
            }
        });
    }

    if (activateHboTvBtn) {
        activateHboTvBtn.addEventListener('click', async () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['hbomax_tv'] === true || (typeof window.clientUsedAttempts['hbomax_tv'] === 'number' && window.clientUsedAttempts['hbomax_tv'] >= 1));
            if (isTvUsed) {
                return alert('⚠️ Ya has utilizado tu intento (1 vez) para activar HBO Max en TV.');
            }

            const tvCode = (document.getElementById('hbo-tv-code-input').value || '').trim().toUpperCase();
            const emailSelect = document.getElementById('hbo-tv-email-select');
            const email = emailSelect ? emailSelect.value.trim() : '';

            if (!tvCode || tvCode.length < 6) return alert('⚠️ Ingresa el código de 6 dígitos que aparece en tu TV.');
            if (!window.getEffectiveCodeTargetPhone()) return alert('Debes iniciar sesión primero.');
            if (!email) return alert('Selecciona el correo de tu cuenta HBO Max.');

            // Bloquear botón temporalmente
            const originalBtnText = activateHboTvBtn.innerHTML;
            activateHboTvBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Activando HBO Max...';
            activateHboTvBtn.disabled = true;
            document.getElementById('hbo-tv-activation-loading').style.display = 'block';
            document.getElementById('hbo-tv-activation-result').style.display = 'none';
            document.getElementById('hbo-tv-activation-error').style.display = 'none';

            // Iniciar interfaz de cuenta regresiva y fases de proceso
            let totalSeconds = 45;
            let secondsRemaining = totalSeconds;
            const timerEl = document.getElementById('hbo-tv-countdown-timer');
            const progressEl = document.getElementById('hbo-tv-progress-bar');
            const phaseEl = document.getElementById('hbo-tv-status-phase');
            const queueNoticeEl = document.getElementById('hbo-tv-queue-notice');

            if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
            if (progressEl) progressEl.style.width = '5%';
            if (queueNoticeEl) queueNoticeEl.style.display = 'none';
            if (phaseEl) phaseEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando al sistema...';

            let countdownInterval = setInterval(() => {
                if (secondsRemaining > 1) {
                    secondsRemaining--;
                    if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
                    const percent = Math.min(95, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100));
                    if (progressEl) progressEl.style.width = `${percent}%`;

                    if (phaseEl) {
                        if (percent < 20) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-network-wired"></i> Conectando con HBO Max...';
                        } else if (percent < 40) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-tv"></i> Ingresando código de tu televisor...';
                        } else if (percent < 65) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-envelope"></i> Solicitando código a tu correo...';
                        } else if (percent < 85) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-key"></i> Validando código de acceso...';
                        } else {
                            phaseEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Finalizando vinculación...';
                        }
                    }
                }
            }, 1000);

            try {
                // Seleccionar botUrl (ngrok -> local -> render)
                const RENDER_URL = 'https://streaming-backend-ce1u.onrender.com';
                let botUrl = RENDER_URL;
                let usingLocal = false;

                let ngrokUrl = null;
                try {
                    const snap = await db.ref('config/botUrl').once('value');
                    ngrokUrl = snap.val();
                } catch (e) { }

                if (ngrokUrl) {
                    botUrl = ngrokUrl;
                    usingLocal = true;
                } else {
                    try {
                        const localCheck = await Promise.race([
                            fetch('http://localhost:3099/status'),
                            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
                        ]);
                        if (localCheck.ok) {
                            botUrl = 'http://localhost:3099';
                            usingLocal = true;
                        }
                    } catch (e) { }
                }

                // Llamar al endpoint del bot
                const response = await fetch(`${botUrl}/api/activate-hbomax-tv`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ email, tvCode, phone: window.getEffectiveCodeTargetPhone() })
                });
                const data = await response.json();

                clearInterval(countdownInterval);
                if (progressEl) progressEl.style.width = '100%';
                document.getElementById('hbo-tv-activation-loading').style.display = 'none';

                if (data.success) {
                    // Registrar en Firebase y consumir intento
                    const targetP = window.getEffectiveCodeTargetPhone();
                    const cleanPhone = window.sanitizePhone ? window.sanitizePhone(targetP) : targetP;
                    const pathSuffix = window.getCodeAttemptPathSuffix ? window.getCodeAttemptPathSuffix(targetP, window.codeModalTargetClientName) : 'codeAttemptUsed';
                    await db.ref(`clientProfiles/${targetP}/tvActivations`).push({ tvCode, email, platform: 'hbomax_tv', timestamp: Date.now() });
                    await db.ref(`clientProfiles/${targetP}/${pathSuffix}/hbomax_tv`).set(true);
                    if (cleanPhone && cleanPhone !== targetP) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/hbomax_tv`).set(true);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/hbomax_tv`).set(true);
                    }

                    if (window.clientUsedAttempts) {
                        window.clientUsedAttempts['hbomax_tv'] = true;
                        if (window.updateCodeCountersUI) window.updateCodeCountersUI();
                    }

                    // Mostrar éxito en color verde
                    const resultDiv = document.getElementById('hbo-tv-activation-result');
                    resultDiv.style.display = 'block';
                    resultDiv.style.background = 'rgba(46,204,113,0.1)';
                    resultDiv.style.borderColor = '#2ecc71';
                    const icon = document.getElementById('hbo-tv-activation-icon');
                    if (icon) { icon.className = 'fa-solid fa-circle-check'; icon.style.color = '#2ecc71'; }
                    const msg = document.getElementById('hbo-tv-activation-msg');
                    if (msg) { msg.style.color = '#2ecc71'; msg.innerText = '¡TV Activada Exitosamente!'; }
                    const desc = document.getElementById('hbo-tv-activation-desc');
                    if (desc) { desc.innerHTML = '¡Iniciaste sesión y tu televisor se actualizará automáticamente!'; }
                } else {
                    document.getElementById('hbo-tv-activation-error').style.display = 'block';
                    let errorHtml = data.error || 'Código inválido o expirado. Verifica el código en tu TV.';
                    if (data.screenshot) {
                        errorHtml += `<br><br><span style="font-size:0.75rem; color:#aaa;">Captura de lo que ve el bot:</span><br><img src="${data.screenshot}" style="max-width:100%; border-radius:8px; margin-top:8px; border:1px solid rgba(255,255,255,0.2);">`;
                    }
                    document.getElementById('hbo-tv-error-msg').innerHTML = errorHtml;
                }

            } catch (err) {
                clearInterval(countdownInterval);
                document.getElementById('hbo-tv-activation-loading').style.display = 'none';
                document.getElementById('hbo-tv-activation-error').style.display = 'block';
                document.getElementById('hbo-tv-error-msg').innerText = 'Error de conexión. Intenta de nuevo en un momento.';
            } finally {
                setTimeout(() => {
                    const isAdmin = window.isUserAdmin && window.isUserAdmin();
                    const isTvUsedNow = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['hbomax_tv'] === true || window.clientUsedAttempts['hbomax_tv'] >= 1);
                    if (isTvUsedNow) {
                        activateHboTvBtn.disabled = true;
                        activateHboTvBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Intento de HBO Max TV agotado (1/1)';
                        activateHboTvBtn.style.opacity = '0.5';
                        activateHboTvBtn.style.cursor = 'not-allowed';
                    } else {
                        activateHboTvBtn.innerHTML = isAdmin ? (originalBtnText || 'Activar TV (Admin \u221e)') : originalBtnText;
                        activateHboTvBtn.disabled = false;
                        activateHboTvBtn.style.opacity = '1';
                        activateHboTvBtn.style.cursor = 'pointer';
                    }
                }, 1500);
            }
        });
    }

    // ACTIVACIÓN SMART TV — PRIME VIDEO
    const showPrimeTvBtn = document.getElementById('show-prime-tv-login-btn');
    const primeTvPanel = document.getElementById('prime-tv-login-panel');
    const activatePrimeTvBtn = document.getElementById('activate-prime-tv-btn');

    if (showPrimeTvBtn && primeTvPanel) {
        showPrimeTvBtn.addEventListener('click', () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['prime_tv'] === true || (typeof window.clientUsedAttempts['prime_tv'] === 'number' && window.clientUsedAttempts['prime_tv'] >= 1));
            if (isTvUsed) {
                alert('⚠️ Ya usaste tu intento (1 vez) para activar Prime Video en TV.');
                return;
            }

            const isOpen = primeTvPanel.style.display !== 'none';
            primeTvPanel.style.display = isOpen ? 'none' : 'block';
            showPrimeTvBtn.style.borderColor = '#00A8E1';
            showPrimeTvBtn.style.color = '#ffffff';
            showPrimeTvBtn.style.background = isOpen ? 'rgba(0,168,225,0.22)' : 'rgba(0,168,225,0.45)';
            showPrimeTvBtn.style.boxShadow = '0 4px 12px rgba(0,168,225,0.35)';
            if (!isOpen) {
                document.getElementById('prime-tv-activation-loading').style.display = 'none';
                document.getElementById('prime-tv-activation-result').style.display = 'none';
                document.getElementById('prime-tv-activation-error').style.display = 'none';
            }
        });
    }

    if (activatePrimeTvBtn) {
        activatePrimeTvBtn.addEventListener('click', async () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['prime_tv'] === true || (typeof window.clientUsedAttempts['prime_tv'] === 'number' && window.clientUsedAttempts['prime_tv'] >= 1));
            if (isTvUsed) {
                return alert('⚠️ Ya has utilizado tu intento (1 vez) para activar Prime Video en TV.');
            }

            const tvCode = (document.getElementById('prime-tv-code-input').value || '').trim().toUpperCase();
            const emailSelect = document.getElementById('prime-tv-email-select');
            const email = emailSelect ? emailSelect.value.trim() : '';

            if (!tvCode || tvCode.length < 5) return alert('⚠️ Ingresa el código que aparece en tu TV (ej: HQ2W4Z).');
            if (!window.getEffectiveCodeTargetPhone()) return alert('Debes iniciar sesión primero.');
            if (!email) return alert('Selecciona el correo de tu cuenta Prime Video.');

            // Bloquear botón temporalmente
            const originalBtnText = activatePrimeTvBtn.innerHTML;
            activatePrimeTvBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando TV...';
            activatePrimeTvBtn.disabled = true;
            document.getElementById('prime-tv-activation-loading').style.display = 'block';
            document.getElementById('prime-tv-activation-result').style.display = 'none';
            document.getElementById('prime-tv-activation-error').style.display = 'none';

            // Iniciar interfaz de cuenta regresiva y fases de proceso
            let totalSeconds = 45;
            let secondsRemaining = totalSeconds;
            const timerEl = document.getElementById('prime-tv-countdown-timer');
            const progressEl = document.getElementById('prime-tv-progress-bar');
            const phaseEl = document.getElementById('prime-tv-status-phase');
            const queueNoticeEl = document.getElementById('prime-tv-queue-notice');

            if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
            if (progressEl) progressEl.style.width = '5%';
            if (queueNoticeEl) queueNoticeEl.style.display = 'none';
            if (phaseEl) phaseEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando al sistema...';

            let countdownInterval = setInterval(() => {
                if (secondsRemaining > 1) {
                    secondsRemaining--;
                    if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
                    const percent = Math.min(95, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100));
                    if (progressEl) progressEl.style.width = `${percent}%`;

                    if (phaseEl) {
                        if (percent < 25) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-network-wired"></i> Conectando con Prime Video...';
                        } else if (percent < 50) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-key"></i> Iniciando sesión en cuenta...';
                        } else if (percent < 75) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-tv"></i> Ingresando código de tu televisor...';
                        } else {
                            phaseEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Finalizando registro...';
                        }
                    }
                }
            }, 1000);

            try {
                // Seleccionar botUrl (ngrok -> local -> render)
                const RENDER_URL = 'https://streaming-backend-ce1u.onrender.com';
                let botUrl = RENDER_URL;
                let usingLocal = false;

                let ngrokUrl = null;
                try {
                    const snap = await db.ref('config/botUrl').once('value');
                    ngrokUrl = snap.val();
                } catch (e) { }

                if (ngrokUrl) {
                    botUrl = ngrokUrl;
                    usingLocal = true;
                } else {
                    try {
                        const localCheck = await Promise.race([
                            fetch('http://localhost:3099/status'),
                            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
                        ]);
                        if (localCheck.ok) {
                            botUrl = 'http://localhost:3099';
                            usingLocal = true;
                        }
                    } catch (e) { }
                }

                // Llamar al endpoint del bot
                const response = await fetch(`${botUrl}/api/activate-prime-tv`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ email, tvCode, phone: window.getEffectiveCodeTargetPhone() })
                });
                const data = await response.json();

                clearInterval(countdownInterval);
                if (progressEl) progressEl.style.width = '100%';
                document.getElementById('prime-tv-activation-loading').style.display = 'none';

                if (data.success) {
                    // Registrar en Firebase y consumir intento
                    const targetP = window.getEffectiveCodeTargetPhone();
                    const cleanPhone = window.sanitizePhone ? window.sanitizePhone(targetP) : targetP;
                    const pathSuffix = window.getCodeAttemptPathSuffix ? window.getCodeAttemptPathSuffix(targetP, window.codeModalTargetClientName) : 'codeAttemptUsed';
                    await db.ref(`clientProfiles/${targetP}/tvActivations`).push({ tvCode, email, platform: 'prime_tv', timestamp: Date.now() });
                    await db.ref(`clientProfiles/${targetP}/${pathSuffix}/prime_tv`).set(true);
                    if (cleanPhone && cleanPhone !== targetP) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/prime_tv`).set(true);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/prime_tv`).set(true);
                    }

                    if (window.clientUsedAttempts) {
                        window.clientUsedAttempts['prime_tv'] = true;
                        if (window.updateCodeCountersUI) window.updateCodeCountersUI();
                    }

                    // Mostrar éxito en color verde
                    const resultDiv = document.getElementById('prime-tv-activation-result');
                    resultDiv.style.display = 'block';
                    resultDiv.style.background = 'rgba(46,204,113,0.1)';
                    resultDiv.style.borderColor = '#2ecc71';
                    const icon = document.getElementById('prime-tv-activation-icon');
                    if (icon) { icon.className = 'fa-solid fa-circle-check'; icon.style.color = '#2ecc71'; }
                    const msg = document.getElementById('prime-tv-activation-msg');
                    if (msg) { msg.style.color = '#2ecc71'; msg.innerText = '¡TV Registrada Exitosamente!'; }
                    const desc = document.getElementById('prime-tv-activation-desc');
                    if (desc) { desc.innerHTML = '¡El dispositivo se registró correctamente en tu cuenta de Prime Video! Ya puedes disfrutar en tu TV.'; }
                } else {
                    document.getElementById('prime-tv-activation-error').style.display = 'block';
                    let errorHtml = data.error || 'Código inválido o expirado. Verifica el código en tu TV.';
                    if (data.screenshot) {
                        errorHtml += `<br><br><span style="font-size:0.75rem; color:#aaa;">Captura de lo que ve el bot:</span><br><img src="${data.screenshot}" style="max-width:100%; border-radius:8px; margin-top:8px; border:1px solid rgba(255,255,255,0.2);">`;
                    }
                    document.getElementById('prime-tv-error-msg').innerHTML = errorHtml;
                }

            } catch (err) {
                clearInterval(countdownInterval);
                document.getElementById('prime-tv-activation-loading').style.display = 'none';
                document.getElementById('prime-tv-activation-error').style.display = 'block';
                document.getElementById('prime-tv-error-msg').innerText = 'Error de conexión. Intenta de nuevo en un momento.';
            } finally {
                setTimeout(() => {
                    const isAdmin = window.isUserAdmin && window.isUserAdmin();
                    const isTvUsedNow = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['prime_tv'] === true || window.clientUsedAttempts['prime_tv'] >= 1);
                    if (isTvUsedNow) {
                        activatePrimeTvBtn.disabled = true;
                        activatePrimeTvBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Intento de Prime Video TV agotado (1/1)';
                        activatePrimeTvBtn.style.opacity = '0.5';
                        activatePrimeTvBtn.style.cursor = 'not-allowed';
                    } else {
                        activatePrimeTvBtn.innerHTML = isAdmin ? (originalBtnText || 'Activar TV (Admin \u221e)') : originalBtnText;
                        activatePrimeTvBtn.disabled = false;
                        activatePrimeTvBtn.style.opacity = '1';
                        activatePrimeTvBtn.style.cursor = 'pointer';
                    }
                }, 1500);
            }
        });
    }

    // ACTIVACIÓN SMART TV — CRUNCHYROLL
    const showCrunchyTvBtn = document.getElementById('show-crunchyroll-tv-login-btn');
    const crunchyTvPanel = document.getElementById('crunchyroll-tv-login-panel');
    const activateCrunchyTvBtn = document.getElementById('activate-crunchyroll-tv-btn');

    if (showCrunchyTvBtn && crunchyTvPanel) {
        showCrunchyTvBtn.addEventListener('click', () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['crunchyroll_tv'] === true || (typeof window.clientUsedAttempts['crunchyroll_tv'] === 'number' && window.clientUsedAttempts['crunchyroll_tv'] >= 1));
            if (isTvUsed) {
                alert('⚠️ Ya usaste tu intento (1 vez) para activar Crunchyroll en TV.');
                return;
            }

            const isOpen = crunchyTvPanel.style.display !== 'none';
            crunchyTvPanel.style.display = isOpen ? 'none' : 'block';
            showCrunchyTvBtn.style.borderColor = '#F47521';
            showCrunchyTvBtn.style.color = '#ffffff';
            showCrunchyTvBtn.style.background = isOpen ? 'rgba(244,117,33,0.22)' : 'rgba(244,117,33,0.45)';
            showCrunchyTvBtn.style.boxShadow = '0 4px 12px rgba(244,117,33,0.35)';
            if (!isOpen) {
                document.getElementById('crunchyroll-tv-activation-loading').style.display = 'none';
                document.getElementById('crunchyroll-tv-activation-result').style.display = 'none';
                document.getElementById('crunchyroll-tv-activation-error').style.display = 'none';
            }
        });
    }

    if (activateCrunchyTvBtn) {
        activateCrunchyTvBtn.addEventListener('click', async () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['crunchyroll_tv'] === true || (typeof window.clientUsedAttempts['crunchyroll_tv'] === 'number' && window.clientUsedAttempts['crunchyroll_tv'] >= 1));
            if (isTvUsed) {
                return alert('⚠️ Ya has utilizado tu intento (1 vez) para activar Crunchyroll en TV.');
            }

            const tvCode = (document.getElementById('crunchyroll-tv-code-input').value || '').trim().toUpperCase();
            const emailSelect = document.getElementById('crunchyroll-tv-email-select');
            const email = emailSelect ? emailSelect.value.trim() : '';

            if (!tvCode || tvCode.length !== 6) return alert('⚠️ Ingresa el código de 6 caracteres que aparece en tu TV (ej: ABCDEF).');
            if (!window.getEffectiveCodeTargetPhone()) return alert('Debes iniciar sesión primero.');
            if (!email) return alert('Selecciona el correo de tu cuenta Crunchyroll.');

            // Bloquear botón temporalmente
            const originalBtnText = activateCrunchyTvBtn.innerHTML;
            activateCrunchyTvBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Activando TV...';
            activateCrunchyTvBtn.disabled = true;
            document.getElementById('crunchyroll-tv-activation-loading').style.display = 'block';
            document.getElementById('crunchyroll-tv-activation-result').style.display = 'none';
            document.getElementById('crunchyroll-tv-activation-error').style.display = 'none';

            // Iniciar interfaz de cuenta regresiva y fases de proceso
            let totalSeconds = 45;
            let secondsRemaining = totalSeconds;
            const timerEl = document.getElementById('crunchyroll-tv-countdown-timer');
            const progressEl = document.getElementById('crunchyroll-tv-progress-bar');
            const phaseEl = document.getElementById('crunchyroll-tv-status-phase');
            const queueNoticeEl = document.getElementById('crunchyroll-tv-queue-notice');

            if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
            if (progressEl) progressEl.style.width = '5%';
            if (queueNoticeEl) queueNoticeEl.style.display = 'none';
            if (phaseEl) phaseEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando al sistema...';

            let countdownInterval = setInterval(() => {
                if (secondsRemaining > 1) {
                    secondsRemaining--;
                    if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
                    const percent = Math.min(95, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100));
                    if (progressEl) progressEl.style.width = `${percent}%`;

                    if (phaseEl) {
                        if (percent < 25) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-network-wired"></i> Conectando con Crunchyroll...';
                        } else if (percent < 50) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-key"></i> Ingresando código de tu Smart TV...';
                        } else if (percent < 75) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-tv"></i> Autenticando tu cuenta Crunchyroll...';
                        } else {
                            phaseEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Finalizando vinculación...';
                        }
                    }
                }
            }, 1000);

            try {
                // Seleccionar botUrl (ngrok -> local -> render)
                const RENDER_URL = 'https://streaming-backend-ce1u.onrender.com';
                let botUrl = RENDER_URL;
                let usingLocal = false;

                let ngrokUrl = null;
                try {
                    const snap = await db.ref('config/botUrl').once('value');
                    ngrokUrl = snap.val();
                } catch (e) { }

                if (ngrokUrl) {
                    botUrl = ngrokUrl;
                    usingLocal = true;
                } else {
                    try {
                        const localCheck = await Promise.race([
                            fetch('http://localhost:3099/status'),
                            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
                        ]);
                        if (localCheck.ok) {
                            botUrl = 'http://localhost:3099';
                            usingLocal = true;
                        }
                    } catch (e) { }
                }

                // Llamar al endpoint del bot
                const response = await fetch(`${botUrl}/api/activate-crunchyroll-tv`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ email, tvCode, phone: window.getEffectiveCodeTargetPhone() })
                });
                const data = await response.json();

                clearInterval(countdownInterval);
                if (progressEl) progressEl.style.width = '100%';
                document.getElementById('crunchyroll-tv-activation-loading').style.display = 'none';

                if (data.success) {
                    // Registrar en Firebase y consumir intento
                    const targetP = window.getEffectiveCodeTargetPhone();
                    const cleanPhone = window.sanitizePhone ? window.sanitizePhone(targetP) : targetP;
                    const pathSuffix = window.getCodeAttemptPathSuffix ? window.getCodeAttemptPathSuffix(targetP, window.codeModalTargetClientName) : 'codeAttemptUsed';
                    await db.ref(`clientProfiles/${targetP}/tvActivations`).push({ tvCode, email, platform: 'crunchyroll_tv', timestamp: Date.now() });
                    await db.ref(`clientProfiles/${targetP}/${pathSuffix}/crunchyroll_tv`).set(true);
                    if (cleanPhone && cleanPhone !== targetP) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/crunchyroll_tv`).set(true);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/crunchyroll_tv`).set(true);
                    }

                    if (window.clientUsedAttempts) {
                        window.clientUsedAttempts['crunchyroll_tv'] = true;
                        if (window.updateCodeCountersUI) window.updateCodeCountersUI();
                    }

                    // Mostrar éxito en color verde
                    const resultDiv = document.getElementById('crunchyroll-tv-activation-result');
                    resultDiv.style.display = 'block';
                    resultDiv.style.background = 'rgba(46,204,113,0.1)';
                    resultDiv.style.borderColor = '#2ecc71';
                    const icon = document.getElementById('crunchyroll-tv-activation-icon');
                    if (icon) { icon.className = 'fa-solid fa-circle-check'; icon.style.color = '#2ecc71'; }
                    const msg = document.getElementById('crunchyroll-tv-activation-msg');
                    if (msg) { msg.style.color = '#2ecc71'; msg.innerText = '¡TV Activada Exitosamente!'; }
                    const desc = document.getElementById('crunchyroll-tv-activation-desc');
                    if (desc) { desc.innerHTML = '¡Dispositivo Crunchyroll activado con éxito en tu Smart TV! Ya puedes disfrutar del mejor anime.'; }
                } else {
                    document.getElementById('crunchyroll-tv-activation-error').style.display = 'block';
                    let errorHtml = data.error || 'Código inválido o expirado. Verifica el código en tu TV.';
                    if (data.screenshot) {
                        errorHtml += `<br><br><span style="font-size:0.75rem; color:#aaa;">Captura de lo que ve el bot:</span><br><img src="${data.screenshot}" style="max-width:100%; border-radius:8px; margin-top:8px; border:1px solid rgba(255,255,255,0.2);">`;
                    }
                    document.getElementById('crunchyroll-tv-error-msg').innerHTML = errorHtml;
                }

            } catch (err) {
                clearInterval(countdownInterval);
                document.getElementById('crunchyroll-tv-activation-loading').style.display = 'none';
                document.getElementById('crunchyroll-tv-activation-error').style.display = 'block';
                document.getElementById('crunchyroll-tv-error-msg').innerText = 'Error de conexión. Intenta de nuevo en un momento.';
            } finally {
                setTimeout(() => {
                    const isAdmin = window.isUserAdmin && window.isUserAdmin();
                    const isTvUsedNow = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['crunchyroll_tv'] === true || window.clientUsedAttempts['crunchyroll_tv'] >= 1);
                    if (isTvUsedNow) {
                        activateCrunchyTvBtn.disabled = true;
                        activateCrunchyTvBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Intento de Crunchyroll TV agotado (1/1)';
                        activateCrunchyTvBtn.style.opacity = '0.5';
                        activateCrunchyTvBtn.style.cursor = 'not-allowed';
                    } else {
                        activateCrunchyTvBtn.innerHTML = isAdmin ? (originalBtnText || 'Activar TV (Admin \u221e)') : originalBtnText;
                        activateCrunchyTvBtn.disabled = false;
                        activateCrunchyTvBtn.style.opacity = '1';
                        activateCrunchyTvBtn.style.cursor = 'pointer';
                    }
                }, 1500);
            }
        });
    }

    // ACTIVACIÓN SMART TV — DISNEY+ CON CÓDIGO
    const showDisneyCodeTvBtn = document.getElementById('show-disney-code-tv-login-btn');
    const disneyCodeTvPanel = document.getElementById('disney-code-tv-login-panel');
    const activateDisneyCodeTvBtn = document.getElementById('activate-disney-code-tv-btn');

    if (showDisneyCodeTvBtn && disneyCodeTvPanel) {
        showDisneyCodeTvBtn.addEventListener('click', () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (
                window.clientUsedAttempts['disney_code_tv'] === true || (typeof window.clientUsedAttempts['disney_code_tv'] === 'number' && window.clientUsedAttempts['disney_code_tv'] >= 1) ||
                window.clientUsedAttempts['disney_tv'] === true || (typeof window.clientUsedAttempts['disney_tv'] === 'number' && window.clientUsedAttempts['disney_tv'] >= 1)
            );
            if (isTvUsed) {
                alert('⚠️ Ya usaste tu intento (1 vez) para activar Disney en TV.');
                return;
            }

            const isOpen = disneyCodeTvPanel.style.display !== 'none';
            disneyCodeTvPanel.style.display = isOpen ? 'none' : 'block';
            showDisneyCodeTvBtn.style.borderColor = '#005AD6';
            showDisneyCodeTvBtn.style.color = '#ffffff';
            showDisneyCodeTvBtn.style.background = isOpen ? 'rgba(0,90,214,0.22)' : 'rgba(0,90,214,0.45)';
            showDisneyCodeTvBtn.style.boxShadow = '0 4px 12px rgba(0,90,214,0.35)';
            if (!isOpen) {
                document.getElementById('disney-code-tv-activation-loading').style.display = 'none';
                document.getElementById('disney-code-tv-activation-result').style.display = 'none';
                document.getElementById('disney-code-tv-activation-error').style.display = 'none';
            }
        });
    }

    if (activateDisneyCodeTvBtn) {
        activateDisneyCodeTvBtn.addEventListener('click', async () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (
                window.clientUsedAttempts['disney_code_tv'] === true || (typeof window.clientUsedAttempts['disney_code_tv'] === 'number' && window.clientUsedAttempts['disney_code_tv'] >= 1) ||
                window.clientUsedAttempts['disney_tv'] === true || (typeof window.clientUsedAttempts['disney_tv'] === 'number' && window.clientUsedAttempts['disney_tv'] >= 1)
            );
            if (isTvUsed) {
                return alert('⚠️ Ya has utilizado tu intento (1 vez) para activar Disney en TV.');
            }

            const tvCode = (document.getElementById('disney-code-tv-code-input').value || '').trim().toUpperCase();
            const emailSelect = document.getElementById('disney-code-tv-email-select');
            const email = emailSelect ? emailSelect.value.trim() : '';

            if (!tvCode || tvCode.length < 8) return alert('⚠️ Ingresa el código de 8 dígitos que aparece en tu TV (ej: 12345678).');
            if (!window.getEffectiveCodeTargetPhone()) return alert('Debes iniciar sesión primero.');
            if (!email) return alert('Selecciona el correo de tu cuenta Disney.');

            // Bloquear botón temporalmente
            const originalBtnText = activateDisneyCodeTvBtn.innerHTML;
            activateDisneyCodeTvBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Activando TV...';
            activateDisneyCodeTvBtn.disabled = true;
            document.getElementById('disney-code-tv-activation-loading').style.display = 'block';
            document.getElementById('disney-code-tv-activation-result').style.display = 'none';
            document.getElementById('disney-code-tv-activation-error').style.display = 'none';

            // Iniciar interfaz de cuenta regresiva y fases de proceso
            let totalSeconds = 45;
            let secondsRemaining = totalSeconds;
            const timerEl = document.getElementById('disney-code-tv-countdown-timer');
            const progressEl = document.getElementById('disney-code-tv-progress-bar');
            const phaseEl = document.getElementById('disney-code-tv-status-phase');
            const queueNoticeEl = document.getElementById('disney-code-tv-queue-notice');

            if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
            if (progressEl) progressEl.style.width = '5%';
            if (queueNoticeEl) queueNoticeEl.style.display = 'none';
            if (phaseEl) phaseEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando al sistema...';

            let countdownInterval = setInterval(() => {
                if (secondsRemaining > 1) {
                    secondsRemaining--;
                    if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
                    const percent = Math.min(95, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100));
                    if (progressEl) progressEl.style.width = `${percent}%`;

                    if (phaseEl) {
                        if (percent < 25) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-network-wired"></i> Conectando con Disney...';
                        } else if (percent < 50) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-key"></i> Ingresando código de tu televisor...';
                        } else if (percent < 75) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-envelope"></i> Validando código de acceso...';
                        } else {
                            phaseEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Finalizando vinculación...';
                        }
                    }
                }
            }, 1000);

            try {
                // Seleccionar botUrl (ngrok -> local -> render)
                const RENDER_URL = 'https://streaming-backend-ce1u.onrender.com';
                let botUrl = RENDER_URL;
                let usingLocal = false;

                let ngrokUrl = null;
                try {
                    const snap = await db.ref('config/botUrl').once('value');
                    ngrokUrl = snap.val();
                } catch (e) { }

                if (ngrokUrl) {
                    botUrl = ngrokUrl;
                    usingLocal = true;
                } else {
                    try {
                        const localCheck = await Promise.race([
                            fetch('http://localhost:3099/status'),
                            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
                        ]);
                        if (localCheck.ok) {
                            botUrl = 'http://localhost:3099';
                            usingLocal = true;
                        }
                    } catch (e) { }
                }

                // Llamar al endpoint del bot
                const response = await fetch(`${botUrl}/api/activate-disney-tv`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ email, tvCode, phone: window.getEffectiveCodeTargetPhone() })
                });
                const data = await response.json();

                clearInterval(countdownInterval);
                if (progressEl) progressEl.style.width = '100%';
                document.getElementById('disney-code-tv-activation-loading').style.display = 'none';

                if (data.success) {
                    // Registrar en Firebase y consumir intento para AMBOS métodos de Disney TV (email y código)
                    const targetP = window.getEffectiveCodeTargetPhone();
                    const cleanPhone = window.sanitizePhone ? window.sanitizePhone(targetP) : targetP;
                    const pathSuffix = window.getCodeAttemptPathSuffix ? window.getCodeAttemptPathSuffix(targetP, window.codeModalTargetClientName) : 'codeAttemptUsed';
                    await db.ref(`clientProfiles/${targetP}/tvActivations`).push({ tvCode, email, platform: 'disney_code_tv', timestamp: Date.now() });
                    await db.ref(`clientProfiles/${targetP}/${pathSuffix}/disney_code_tv`).set(true);
                    await db.ref(`clientProfiles/${targetP}/${pathSuffix}/disney_tv`).set(true);
                    if (cleanPhone && cleanPhone !== targetP) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/disney_code_tv`).set(true);
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/disney_tv`).set(true);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/disney_code_tv`).set(true);
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/disney_tv`).set(true);
                    }

                    if (window.clientUsedAttempts) {
                        window.clientUsedAttempts['disney_code_tv'] = true;
                        window.clientUsedAttempts['disney_tv'] = true;
                        if (window.updateCodeCountersUI) window.updateCodeCountersUI();
                    }

                    // Mostrar éxito en color verde
                    const resultDiv = document.getElementById('disney-code-tv-activation-result');
                    resultDiv.style.display = 'block';
                    resultDiv.style.background = 'rgba(46,204,113,0.1)';
                    resultDiv.style.borderColor = '#2ecc71';
                    const icon = document.getElementById('disney-code-tv-activation-icon');
                    if (icon) { icon.className = 'fa-solid fa-circle-check'; icon.style.color = '#2ecc71'; }
                    const msg = document.getElementById('disney-code-tv-activation-msg');
                    if (msg) { msg.style.color = '#2ecc71'; msg.innerText = '¡TV Activada Exitosamente!'; }
                    const desc = document.getElementById('disney-code-tv-activation-desc');
                    if (desc) { desc.innerHTML = '¡Dispositivo Disney activado con éxito en tu Smart TV! Ya puedes disfrutar de todo el contenido.'; }
                } else {
                    document.getElementById('disney-code-tv-activation-error').style.display = 'block';
                    let errorHtml = data.error || 'Código inválido o expirado. Verifica el código en tu TV.';
                    if (data.screenshot) {
                        errorHtml += `<br><br><span style="font-size:0.75rem; color:#aaa;">Captura de lo que ve el bot:</span><br><img src="${data.screenshot}" style="max-width:100%; border-radius:8px; margin-top:8px; border:1px solid rgba(255,255,255,0.2);">`;
                    }
                    document.getElementById('disney-code-tv-error-msg').innerHTML = errorHtml;
                }

            } catch (err) {
                clearInterval(countdownInterval);
                document.getElementById('disney-code-tv-activation-loading').style.display = 'none';
                document.getElementById('disney-code-tv-activation-error').style.display = 'block';
                document.getElementById('disney-code-tv-error-msg').innerText = 'Error de conexión. Intenta de nuevo en un momento.';
            } finally {
                setTimeout(() => {
                    const isAdmin = window.isUserAdmin && window.isUserAdmin();
                    const isTvUsedNow = !isAdmin && window.clientUsedAttempts && (
                        window.clientUsedAttempts['disney_code_tv'] === true || window.clientUsedAttempts['disney_code_tv'] >= 1 ||
                        window.clientUsedAttempts['disney_tv'] === true || window.clientUsedAttempts['disney_tv'] >= 1
                    );
                    if (isTvUsedNow) {
                        activateDisneyCodeTvBtn.disabled = true;
                        activateDisneyCodeTvBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Intento de Disney TV agotado (1/1)';
                        activateDisneyCodeTvBtn.style.opacity = '0.5';
                        activateDisneyCodeTvBtn.style.cursor = 'not-allowed';
                    } else {
                        activateDisneyCodeTvBtn.innerHTML = isAdmin ? (originalBtnText || 'Activar TV (Admin \u221e)') : originalBtnText;
                        activateDisneyCodeTvBtn.disabled = false;
                        activateDisneyCodeTvBtn.style.opacity = '1';
                        activateDisneyCodeTvBtn.style.cursor = 'pointer';
                    }
                }, 1500);
            }
        });
    }

    // ACTIVACIÓN SMART TV — VIX
    const showVixTvBtn = document.getElementById('show-vix-tv-login-btn');
    const vixTvPanel = document.getElementById('vix-tv-login-panel');
    const activateVixTvBtn = document.getElementById('activate-vix-tv-btn');

    if (showVixTvBtn && vixTvPanel) {
        showVixTvBtn.addEventListener('click', () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['vix_tv'] === true || (typeof window.clientUsedAttempts['vix_tv'] === 'number' && window.clientUsedAttempts['vix_tv'] >= 1));
            if (isTvUsed) {
                alert('⚠️ Ya usaste tu intento (1 vez) para activar ViX en TV.');
                return;
            }

            const isOpen = vixTvPanel.style.display !== 'none';
            vixTvPanel.style.display = isOpen ? 'none' : 'block';
            showVixTvBtn.style.borderColor = '#FF5B00';
            showVixTvBtn.style.color = '#ffffff';
            showVixTvBtn.style.background = isOpen ? 'rgba(255,91,0,0.22)' : 'rgba(255,91,0,0.45)';
            showVixTvBtn.style.boxShadow = '0 4px 12px rgba(255,91,0,0.35)';
            if (!isOpen) {
                document.getElementById('vix-tv-activation-loading').style.display = 'none';
                document.getElementById('vix-tv-activation-result').style.display = 'none';
                document.getElementById('vix-tv-activation-error').style.display = 'none';
            }
        });
    }

    if (activateVixTvBtn) {
        activateVixTvBtn.addEventListener('click', async () => {
            const isAdmin = window.isUserAdmin && window.isUserAdmin();
            const isTvUsed = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['vix_tv'] === true || (typeof window.clientUsedAttempts['vix_tv'] === 'number' && window.clientUsedAttempts['vix_tv'] >= 1));
            if (isTvUsed) {
                return alert('⚠️ Ya has utilizado tu intento (1 vez) para activar ViX en TV.');
            }

            const tvCode = (document.getElementById('vix-tv-code-input').value || '').trim().toUpperCase();
            const emailSelect = document.getElementById('vix-tv-email-select');
            const email = emailSelect ? emailSelect.value.trim() : '';

            if (!tvCode || tvCode.length < 8) return alert('⚠️ Ingresa el código de 8 caracteres que aparece en tu TV (ej: ABCD1234).');
            if (!window.getEffectiveCodeTargetPhone()) return alert('Debes iniciar sesión primero.');
            if (!email) return alert('Selecciona el correo de tu cuenta ViX.');

            // Bloquear botón temporalmente
            const originalBtnText = activateVixTvBtn.innerHTML;
            activateVixTvBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Activando TV...';
            activateVixTvBtn.disabled = true;
            document.getElementById('vix-tv-activation-loading').style.display = 'block';
            document.getElementById('vix-tv-activation-result').style.display = 'none';
            document.getElementById('vix-tv-activation-error').style.display = 'none';

            // Iniciar interfaz de cuenta regresiva y fases de proceso
            let totalSeconds = 45;
            let secondsRemaining = totalSeconds;
            const timerEl = document.getElementById('vix-tv-countdown-timer');
            const progressEl = document.getElementById('vix-tv-progress-bar');
            const phaseEl = document.getElementById('vix-tv-status-phase');
            const queueNoticeEl = document.getElementById('vix-tv-queue-notice');

            if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
            if (progressEl) progressEl.style.width = '5%';
            if (queueNoticeEl) queueNoticeEl.style.display = 'none';
            if (phaseEl) phaseEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando al sistema...';

            let countdownInterval = setInterval(() => {
                if (secondsRemaining > 1) {
                    secondsRemaining--;
                    if (timerEl) timerEl.innerText = `${secondsRemaining}s`;
                    const percent = Math.min(95, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100));
                    if (progressEl) progressEl.style.width = `${percent}%`;

                    if (phaseEl) {
                        if (percent < 25) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-network-wired"></i> Conectando con ViX...';
                        } else if (percent < 50) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-key"></i> Ingresando código de tu televisor...';
                        } else if (percent < 75) {
                            phaseEl.innerHTML = '<i class="fa-solid fa-lock"></i> Iniciando sesión con contraseña...';
                        } else {
                            phaseEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Finalizando vinculación...';
                        }
                    }
                }
            }, 1000);

            try {
                // Seleccionar botUrl (ngrok -> local -> render)
                const RENDER_URL = 'https://streaming-backend-ce1u.onrender.com';
                let botUrl = RENDER_URL;
                let usingLocal = false;

                let ngrokUrl = null;
                try {
                    const snap = await db.ref('config/botUrl').once('value');
                    ngrokUrl = snap.val();
                } catch (e) { }

                if (ngrokUrl) {
                    botUrl = ngrokUrl;
                    usingLocal = true;
                } else {
                    try {
                        const localCheck = await Promise.race([
                            fetch('http://localhost:3099/status'),
                            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
                        ]);
                        if (localCheck.ok) {
                            botUrl = 'http://localhost:3099';
                            usingLocal = true;
                        }
                    } catch (e) { }
                }

                // Llamar al endpoint del bot
                const response = await fetch(`${botUrl}/api/activate-vix-tv`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ email, tvCode, phone: window.getEffectiveCodeTargetPhone() })
                });
                const data = await response.json();

                clearInterval(countdownInterval);
                if (progressEl) progressEl.style.width = '100%';
                document.getElementById('vix-tv-activation-loading').style.display = 'none';

                if (data.success) {
                    // Registrar en Firebase y consumir intento
                    const targetP = window.getEffectiveCodeTargetPhone();
                    const cleanPhone = window.sanitizePhone ? window.sanitizePhone(targetP) : targetP;
                    const pathSuffix = window.getCodeAttemptPathSuffix ? window.getCodeAttemptPathSuffix(targetP, window.codeModalTargetClientName) : 'codeAttemptUsed';
                    await db.ref(`clientProfiles/${targetP}/tvActivations`).push({ tvCode, email, platform: 'vix_tv', timestamp: Date.now() });
                    await db.ref(`clientProfiles/${targetP}/${pathSuffix}/vix_tv`).set(true);
                    if (cleanPhone && cleanPhone !== targetP) {
                        await db.ref(`clientProfiles/${cleanPhone}/${pathSuffix}/vix_tv`).set(true);
                    }
                    if (cleanPhone && !cleanPhone.startsWith('57')) {
                        await db.ref(`clientProfiles/57${cleanPhone}/${pathSuffix}/vix_tv`).set(true);
                    }

                    if (window.clientUsedAttempts) {
                        window.clientUsedAttempts['vix_tv'] = true;
                        if (window.updateCodeCountersUI) window.updateCodeCountersUI();
                    }

                    // Mostrar éxito en color verde
                    const resultDiv = document.getElementById('vix-tv-activation-result');
                    resultDiv.style.display = 'block';
                    resultDiv.style.background = 'rgba(46,204,113,0.1)';
                    resultDiv.style.borderColor = '#2ecc71';
                    const icon = document.getElementById('vix-tv-activation-icon');
                    if (icon) { icon.className = 'fa-solid fa-circle-check'; icon.style.color = '#2ecc71'; }
                    const msg = document.getElementById('vix-tv-activation-msg');
                    if (msg) { msg.style.color = '#2ecc71'; msg.innerText = '¡TV Activada Exitosamente!'; }
                    const desc = document.getElementById('vix-tv-activation-desc');
                    if (desc) { desc.innerHTML = '¡Dispositivo ViX activado con éxito en tu Smart TV! Ya puedes disfrutar de todo el contenido.'; }
                } else {
                    document.getElementById('vix-tv-activation-error').style.display = 'block';
                    let errorHtml = data.error || 'Código inválido o expirado. Verifica el código en tu TV.';
                    if (data.screenshot) {
                        errorHtml += `<br><br><span style="font-size:0.75rem; color:#aaa;">Captura de lo que ve el bot:</span><br><img src="${data.screenshot}" style="max-width:100%; border-radius:8px; margin-top:8px; border:1px solid rgba(255,255,255,0.2);">`;
                    }
                    document.getElementById('vix-tv-error-msg').innerHTML = errorHtml;
                }

            } catch (err) {
                clearInterval(countdownInterval);
                document.getElementById('vix-tv-activation-loading').style.display = 'none';
                document.getElementById('vix-tv-activation-error').style.display = 'block';
                document.getElementById('vix-tv-error-msg').innerText = 'Error de conexión. Intenta de nuevo en un momento.';
            } finally {
                setTimeout(() => {
                    const isAdmin = window.isUserAdmin && window.isUserAdmin();
                    const isTvUsedNow = !isAdmin && window.clientUsedAttempts && (window.clientUsedAttempts['vix_tv'] === true || window.clientUsedAttempts['vix_tv'] >= 1);
                    if (isTvUsedNow) {
                        activateVixTvBtn.disabled = true;
                        activateVixTvBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Intento de ViX TV agotado (1/1)';
                        activateVixTvBtn.style.opacity = '0.5';
                        activateVixTvBtn.style.cursor = 'not-allowed';
                    } else {
                        activateVixTvBtn.innerHTML = isAdmin ? (originalBtnText || 'Activar TV (Admin \u221e)') : originalBtnText;
                        activateVixTvBtn.disabled = false;
                        activateVixTvBtn.style.opacity = '1';
                        activateVixTvBtn.style.cursor = 'pointer';
                    }
                }, 1500);
            }
        });
    }

    // ── Soporte para Enter en todos los campos de activación de TV ──
    [
        { inputId: 'tv-code-input', btnId: 'activate-tv-btn' },
        { inputId: 'disney-code-tv-code-input', btnId: 'activate-disney-code-tv-btn' },
        { inputId: 'hbo-tv-code-input', btnId: 'activate-hbo-tv-btn' },
        { inputId: 'prime-tv-code-input', btnId: 'activate-prime-tv-btn' },
        { inputId: 'crunchyroll-tv-code-input', btnId: 'activate-crunchyroll-tv-btn' },
        { inputId: 'vix-tv-code-input', btnId: 'activate-vix-tv-btn' }
    ].forEach(({ inputId, btnId }) => {
        const inp = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if (inp && btn) {
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    btn.click();
                }
            });
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', async () => {
        const policyCheck = document.getElementById('accept-billing-policy');
        if (policyCheck && !policyCheck.checked) {
            alert('Debe aceptar la Política de Fechas de Corte Fijas para continuar con su pedido.');
            return;
        }

        if (cart.length === 0) return alert('Tu carrito está vacío');

        let isRecurrent = document.getElementById('recurrent-client').checked;
        let isRenewal = document.getElementById('is-renewal').checked;
        let cName = "";
        let cCity = "";
        let cPhone = "";
        let cDevices = [];

        cName = document.getElementById('client-name').value.trim();
        cCity = document.getElementById('client-city').value.trim();
        cPhone = window.sanitizePhone(document.getElementById('client-phone').value.trim());
        const checkedDev = document.querySelectorAll('#client-devices input[type="checkbox"]:checked');
        checkedDev.forEach(c => cDevices.push(c.value));

        // Si NO es cliente recurrente, el nombre es obligatorio
        if (!isRecurrent && !cName) {
            return alert('Por favor, indica el nombre del cliente.');
        }

        // El celular es SIEMPRE obligatorio (nuevo o recurrente)
        const cleanPhone = cPhone ? cPhone.replace(/\D/g, '') : '';
        if (!cleanPhone || cleanPhone.length < 5) {
            return alert('📱 El número de celular es obligatorio para registrar la venta.\n\nIngresa el celular del cliente en el campo correspondiente.');
        }
        if (cleanPhone && storeConfig.blockedClients && storeConfig.blockedClients.includes(cleanPhone)) {
            return alert('⚠️ Este número de celular ha sido bloqueado por el administrador. Contacta con soporte.');
        }

        let stats = processCartDiscounts();
        let total = stats.total;

        const customPriceInput = document.getElementById('seller-custom-client-price');
        let customClientPrice = null;
        if (isSellerMode && customPriceInput && customPriceInput.value) {
            customClientPrice = parseInt(customPriceInput.value);
            if (isNaN(customClientPrice)) customClientPrice = 0;
            total = customClientPrice;
        }

        let extrasOriginalOwner = null;
        const extrasCartItem = stats.processedCart.find(i => {
            const pDb = products.find(p => p.id === i.id);
            return pDb && pDb.category === 'ventas_extras' && pDb.owner && pDb.owner !== 'admin' && pDb.owner !== 'Administrador (Global)';
        });
        if (extrasCartItem) {
            const pDb = products.find(p => p.id === extrasCartItem.id);
            extrasOriginalOwner = pDb.owner;
        }

        let individualCount = cart.filter(p => p.category === 'individual').length;
        let message = `🚀 *Nuevo Pedido - Streaming DPC*\n\n`;
        let incentiveEarned = 0;
        let incentiveDetails = [];

        if (isRenewal) {
            message += `🔄 *ESTE PEDIDO ES UNA RENOVACIÓN*\n\n`;
        }

        if (!isRecurrent) {
            message += `*DATOS DEL CLIENTE*\n`;
            message += `👤 Nombre: ${cName}\n`;
            if (cPhone) message += `📱 Celular: ${cPhone}\n`;
            if (cCity) message += `🏙️ Ciudad: ${cCity}\n`;
            if (cDevices.length > 0) message += `💻 Dispositivos: ${cDevices.join(', ')}\n`;
            message += `--------------------\n`;
        } else {
            message += `✅ *Soy Cliente Registrado (Omitió datos)*\n`;
            message += `--------------------\n`;
        }

        if (isSellerMode) {
            message += `🔥 *Orden levantada por Vendedor:* ${currentSellerName}\n`;
        }

        message += `\nHola, me gustaría adquirir las siguientes pantallas:\n\n`;

        stats.processedCart.forEach((item, i) => {
            let fp = isNaN(item.finalPrice) ? 0 : item.finalPrice;
            let displayItemName = item.customName ? `${item.name} (${item.customName})` : item.name;
            message += `${i + 1}. *${displayItemName || 'Pantalla'}* - $${fp.toLocaleString()}\n`;
        });

        if (stats.promoDiscountTotal > 0) {
            message += `\n✨ _Descuento Especial Promocional de -$${stats.promoDiscountTotal.toLocaleString()} aplicado._\n`;
        }

        if (stats.genericDiscountTotal > 0) {
            if (!isSellerMode) {
                message += `\n✨ _Descuento de -$${stats.genericDiscountTotal.toLocaleString()} aplicado por combo personalizado._\n`;
            } else {
                message += `\n✨ _Descuento Mayorista de -$${stats.genericDiscountTotal.toLocaleString()} aplicado._\n`;
            }
        }

        if (customClientPrice) {
            message += `\n💰 *Total cobrado al cliente:* $${customClientPrice.toLocaleString()}\n`;
            let fTotal = isNaN(stats.total) ? 0 : stats.total;
            message += `💼 *Valor Mayorista (Para el Admin):* $${fTotal.toLocaleString()}\n\n`;
        } else {
            let fTotal = isNaN(total) ? 0 : total;
            message += `\n💰 *Total a pagar:* $${fTotal.toLocaleString()}\n\n`;
        }
        if (storeConfig.incentiveEnabled) {
            console.log("[INCENTIVE] Logic starting... Enabled:", storeConfig.incentiveEnabled);
            stats.processedCart.forEach(item => {
                const prodCat = (item.category || '').toLowerCase().trim();
                const cleanCat = prodCat.replace(/[\s\-_]/g, '');
                const prodMarca = ((item.brand || '') + ' ' + (item.name || '')).toLowerCase().replace(/[\s\-_]/g, '');

                console.log("[INCENTIVE] Analyzing Item:", { name: item.name, brand: item.brand, prodCat, cleanCat, prodMarca });

                if (cleanCat.includes('individual') || cleanCat.includes('ventasextras')) {
                    let b = 0; let bName = '';
                    if (prodMarca.includes('privada')) { b = parseInt(storeConfig.incentiveNetflixPrivada) || 0; bName = 'Netflix Privada'; }
                    else if (prodMarca.includes('netflix')) { b = parseInt(storeConfig.incentiveNetflix) || 0; bName = 'Netflix'; }
                    else if (prodMarca.includes('disney')) { b = parseInt(storeConfig.incentiveDisney) || 0; bName = 'Disney'; }
                    else if (prodMarca.includes('max') || prodMarca.includes('hbo')) { b = parseInt(storeConfig.incentiveMax) || 0; bName = 'HBO Max'; }
                    else if (prodMarca.includes('prime')) { b = parseInt(storeConfig.incentivePrime) || 0; bName = 'Prime Video'; }
                    else if (prodMarca.includes('paramount')) { b = parseInt(storeConfig.incentiveParamount) || 0; bName = 'Paramount'; }
                    else if (prodMarca.includes('vix')) { b = parseInt(storeConfig.incentiveVix) || 0; bName = 'Vix'; }
                    else if (prodMarca.includes('iptv')) { b = parseInt(storeConfig.incentiveIptv) || 0; bName = 'IPTV'; }
                    else if (prodMarca.includes('crunchyroll')) { b = parseInt(storeConfig.incentiveCrunchyroll) || 0; bName = 'Crunchyroll'; }
                    else if (prodMarca.includes('apple')) { b = parseInt(storeConfig.incentiveApple) || 0; bName = 'Apple TV'; }

                    if (b > 0) {
                        incentiveEarned += b;
                        incentiveDetails.push(`${bName} (+$${b})`);
                        console.log(`[INCENTIVE] MATCH! Brand Bonus: ${b} (${bName})`);
                    }
                }
                else if (cleanCat.includes('combo')) {
                    let b = 0; let bName = '';
                    const combinedMatch = (cleanCat + prodMarca);
                    if (combinedMatch.includes('combo2') || combinedMatch.includes('combos2')) { b = parseInt(storeConfig.incentiveCombo2) || 0; bName = 'Combo 2 P.'; }
                    else if (combinedMatch.includes('combo3') || combinedMatch.includes('combos3')) { b = parseInt(storeConfig.incentiveCombo3) || 0; bName = 'Combo 3 P.'; }
                    else if (combinedMatch.includes('combo4') || combinedMatch.includes('combos4')) { b = parseInt(storeConfig.incentiveCombo4) || 0; bName = 'Combo 4 P.'; }
                    else if (combinedMatch.includes('combo5') || combinedMatch.includes('combos5')) { b = parseInt(storeConfig.incentiveCombo5) || 0; bName = 'Combo 5+ P.'; }
                    else {
                        if (prodMarca.includes('2pantalla')) { b = parseInt(storeConfig.incentiveCombo2) || 0; bName = 'Combo 2 P.'; }
                        else if (prodMarca.includes('3pantalla')) { b = parseInt(storeConfig.incentiveCombo3) || 0; bName = 'Combo 3 P.'; }
                        else if (prodMarca.includes('4pantalla')) { b = parseInt(storeConfig.incentiveCombo4) || 0; bName = 'Combo 4 P.'; }
                        else if (prodMarca.includes('5pantalla')) { b = parseInt(storeConfig.incentiveCombo5) || 0; bName = 'Combo 5+ P.'; }
                    }

                    if (b > 0) {
                        incentiveEarned += b;
                        incentiveDetails.push(`${bName} (+$${b})`);
                        console.log(`[INCENTIVE] MATCH! Combo Bonus: ${b} (${bName})`);
                    }
                }
                else if (cleanCat.includes('promocion') || cleanCat.includes('promo')) {
                    let b = 0; let bName = '';
                    if (cleanCat.includes('finde')) { b = parseInt(storeConfig.incentiveFinde) || 0; bName = 'Promo Finde'; }
                    else { b = parseInt(storeConfig.incentiveMes) || 0; bName = 'Promo Mes'; }

                    if (b > 0) {
                        incentiveEarned += b;
                        incentiveDetails.push(`${bName} (+$${b})`);
                        console.log(`[INCENTIVE] MATCH! Promo Bonus: ${b} (${bName})`);
                    }
                }
            });
            console.log("[INCENTIVE] Total:", incentiveEarned, "Details:", incentiveDetails);
        }
        console.log("Total incentive earned:", incentiveEarned, "Details:", incentiveDetails);

        let successIncentive = 0;
        let successDetailsStr = "";

        if (isSellerMode && incentiveEarned > 0) {
            successIncentive = incentiveEarned;
            successDetailsStr = incentiveDetails.join(', ');
        }


        // 🔄 LÓGICA DE RENOVACIÓN DE FECHAS (Cap Month anclado a la fecha registrada)
        let saleDate = Date.now();
        let saleAnchor = Date.now();

        // 🎯 Detectar la duración en meses del producto comprado (1, 2, 3, 6, etc.)
        let productMonths = 1;
        if (stats.processedCart && stats.processedCart.length > 0) {
            const monthsFound = stats.processedCart.map(item => {
                if (item.months && !isNaN(item.months) && parseInt(item.months) > 0) {
                    return parseInt(item.months);
                }
                const match = (item.name || '').match(/(\d+)\s*meses?/i);
                if (match) return parseInt(match[1]);
                return 1;
            });
            productMonths = Math.max(1, ...monthsFound);
        }

        let saleExp = window.DPCBillingEngine.calcularProximoVencimiento(saleAnchor, saleDate, productMonths).getTime();

        const isRenewalChecked = document.getElementById('is-renewal') && document.getElementById('is-renewal').checked;
        const cleanPhoneTracking = cPhone ? cPhone.replace(/\D/g, '') : '';

        // Si fue disparado desde renewFromDash o se marcó como renovación manual:
        let prevExp = window.renewalSaleExp ? parseInt(window.renewalSaleExp) : null;
        let prevOrig = window.renewalSaleOrig ? parseInt(window.renewalSaleOrig) : null;
        let prevStart = window.renewalSaleStart ? parseInt(window.renewalSaleStart) : null;

        // Fallback: Si no vinieron en memoria pero es renovación y tenemos celular, buscar la venta previa
        if (!prevExp && (window.renewalSaleId || isRenewalChecked) && cleanPhoneTracking && cleanPhoneTracking.length > 5) {
            try {
                const snap = await db.ref(`clientSales/${cleanPhoneTracking}`).once('value');
                const cSales = snap.val();
                if (cSales) {
                    const activeSales = Object.values(cSales).filter(s => s && s.expirationDate);
                    activeSales.sort((a, b) => b.expirationDate - a.expirationDate);
                    if (activeSales.length > 0) {
                        const s = activeSales[0];
                        prevExp = parseInt(s.expirationDate);
                        prevOrig = parseInt(s.fechaCompraOriginal);
                        prevStart = parseInt(s.date);
                    }
                }
            } catch (e) {
                console.warn('[RENEWAL] Error buscando venta previa:', e);
            }
        }

        if (prevExp && !isNaN(prevExp)) {
            // 🎯 El día de corte para la renovación es el día de la fecha fin registrada (prevExp)
            saleAnchor = prevExp;
            // Si la fecha registrada de vencimiento es hoy o futura (o está dentro de las últimas 24 horas de gracia):
            // La renovación inicia exactamente en la fecha de vencimiento que ya tenía registrada (ej: 16 de octubre)
            // y se vence X meses después anclada a ese mismo día registrado (ej: 16 de noviembre o 16 de enero)
            if (prevExp >= (Date.now() - 24 * 60 * 60 * 1000)) {
                saleDate = prevExp;
                saleExp = window.DPCBillingEngine.calcularProximoVencimiento(prevExp, prevExp, productMonths).getTime();
            } else {
                // Si ya estaba vencida hace más tiempo, arranca desde hoy pero anclado al día de corte registrado
                saleDate = Date.now();
                saleExp = window.DPCBillingEngine.calcularProximoVencimiento(prevExp, Date.now(), productMonths).getTime();
            }
        }

        const saleData = {
            clientName: cName || '',
            clientCity: cCity || '',
            clientPhone: cPhone || '',
            date: saleDate,
            expirationDate: saleExp,
            fechaCompraOriginal: saleAnchor, // Cap Month
            months: productMonths,
            items: stats.processedCart.map(item => ({
                id: item.id || Date.now(),
                name: item.customName ? `${item.name} (${item.customName})` : (item.name || 'Pantalla'),
                customName: item.customName || null,
                category: item.category || 'individual',
                months: item.months || productMonths,
                finalPrice: isNaN(item.finalPrice) ? 0 : item.finalPrice
            })),
            total: isNaN(total) ? 0 : total,
            sellerName: (isSellerMode ? currentSellerName : 'Página Web Oficial') || 'Página Web Oficial',
            incentiveEarned: isNaN(incentiveEarned) ? 0 : incentiveEarned,
            incentiveDetails: incentiveDetails || [],
            isPaid: false
        };

        // Public Seller Checkout Forwarding
        let finalSellerDestination = isSellerMode ? currentSellerName : 'Página Web Oficial';
        if (publicSellerRef) finalSellerDestination = publicSellerRef;

        if (extrasOriginalOwner) {
            finalSellerDestination = extrasOriginalOwner;
        }

        // Si la compra la realizó un cliente desde la tienda virtual de un vendedor
        if (publicSellerRef || extrasOriginalOwner) {
            saleData.fromStore = true;
            saleData.isStorePurchase = true;
            saleData.sellerStoreRef = publicSellerRef || extrasOriginalOwner;
            saleData.sellerName = publicSellerRef || extrasOriginalOwner;
        }

        const isSellerSaleOrder = isSellerMode || publicSellerRef || extrasOriginalOwner;

        if (window.renewalSaleId) {
            // UPDATE EL MISMO REGISTRO, NO GENERAR UNO NUEVO
            if (isSellerSaleOrder || window.renewalSource === 'seller') {
                // EXCLUSIVO VENDEDOR: Actualizar únicamente en sellerSales del vendedor
                await db.ref(`sellerSales/${finalSellerDestination}/${window.renewalSaleId}`).set(saleData);
            } else {
                // DIRECTO / GLOBAL: Actualizar en clientSales y reflejar en Página Web Oficial
                if (cleanPhoneTracking && cleanPhoneTracking.length > 5) {
                    await db.ref(`clientSales/${cleanPhoneTracking}/${window.renewalSaleId}`).set(saleData);
                }
                for (let sName of ['Página Web Oficial', currentSellerName].filter(Boolean)) {
                    try {
                        const sSnap = await db.ref(`sellerSales/${sName}`).once('value');
                        const sSales = sSnap.val();
                        if (sSales) {
                            for (const [k, v] of Object.entries(sSales)) {
                                if (v && (v.date === prevStart || v.expirationDate === prevExp)) {
                                    await db.ref(`sellerSales/${sName}/${k}`).set(saleData);
                                    break;
                                }
                            }
                        }
                    } catch (e) { }
                }
            }

            if (cleanPhoneTracking && cleanPhoneTracking.length > 5) {
                const baseClean = cleanPhoneTracking.replace(/^57/, '');
                db.ref(`clientProfiles/${cleanPhoneTracking}/codeAttemptUsed`).remove();
                db.ref(`clientProfiles/${baseClean}/codeAttemptUsed`).remove();
                db.ref(`clientProfiles/57${baseClean}/codeAttemptUsed`).remove();
            }

            window.renewalSaleId = null;
            window.renewalSource = null;
            window.renewalSaleExp = null;
            window.renewalSaleOrig = null;
            window.renewalSaleStart = null;
        } else {
            // NUEVA VENTA
            if (isSellerSaleOrder) {
                // EXCLUSIVO VENDEDOR: Guardar únicamente en la cartera del vendedor correspondiente
                db.ref(`sellerSales/${finalSellerDestination}`).push(saleData);
            } else {
                // DIRECTO / GLOBAL: Guardar en clientSales y en sellerSales/Página Web Oficial
                db.ref(`sellerSales/Página Web Oficial`).push(saleData);
                if (cleanPhoneTracking && cleanPhoneTracking.length > 5) {
                    db.ref(`clientSales/${cleanPhoneTracking}`).push(saleData);
                }
            }

            // Registrar datos del perfil en clientProfiles (nombre, reset intentos) para que el cliente pueda acceder a la web, sin duplicar la venta en clientSales
            if (cleanPhoneTracking && cleanPhoneTracking.length > 5) {
                const baseClean = cleanPhoneTracking.replace(/^57/, '');
                db.ref(`clientProfiles/${cleanPhoneTracking}`).update({
                    name: cName || 'Cliente',
                    codeAttemptUsed: null
                });
                if (baseClean !== cleanPhoneTracking) {
                    db.ref(`clientProfiles/${baseClean}/codeAttemptUsed`).remove();
                }
                db.ref(`clientProfiles/57${baseClean}/codeAttemptUsed`).remove();
            }
        }
        // Fin de guardado en DB (Detalle 1: Corregido para que guarde siempre)

        let updatedProducts = false;
        stats.processedCart.forEach(item => {
            const productDbNode = products.find(p => p.id === item.id);
            if (productDbNode) {
                if (item._usingReserve && productDbNode.reserveRules && productDbNode.reserveRules[item._usingReserve]) {
                    let currentRStock = productDbNode.reserveRules[item._usingReserve].stock;
                    if (currentRStock !== null && currentRStock !== undefined && currentRStock > 0) {
                        productDbNode.reserveRules[item._usingReserve].stock = currentRStock - 1;
                        updatedProducts = true;
                    }
                } else if (productDbNode.stock > 0) {
                    productDbNode.stock -= 1;
                    if (productDbNode.stock <= 0) {
                        productDbNode.stock = 0;
                        productDbNode.inStock = false;
                    }
                    updatedProducts = true;
                }
            }
        });
        if (updatedProducts) {
            db.ref('products').set(products);
        }

        const finalizeCheckout = (sellerStoreData) => {
            let checkoutWhatsappNumber = storeConfig.whatsappNumber;
            let currentPaymentInfo = storeConfig.paymentInfo;

            if (sellerStoreData) {
                if (sellerStoreData.whatsapp) checkoutWhatsappNumber = sellerStoreData.whatsapp;
                currentPaymentInfo = sellerStoreData.paymentInfo || '💳 *Por favor contáctame para indicarte mis métodos de pago...*';
            }

            message += `${currentPaymentInfo}\n\n`;
            message += `Quedo atento a la activación de mis pantallas.`;

            // Configurar Modal de Éxito
            pendingWhatsappMessage = message;
            pendingWhatsappNumber = formatWaPhone(checkoutWhatsappNumber);

            if (isSellerMode) {
                successBonusContainer.style.display = 'block';
                if (incentiveEarned > 0) {
                    successBonusAmount.parentElement.style.color = '#f39c12';
                    successBonusAmount.innerText = incentiveEarned.toLocaleString();
                    successBonusDetails.innerText = incentiveDetails.join(', ');
                } else {
                    successBonusAmount.parentElement.style.color = '#ff4d4d';
                    successBonusAmount.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> 0 (No Acumuló Bono)';
                    successBonusDetails.innerText = "⚠️ Atención: Esta venta NO acumuló bono (verifica categorías o marcas en los productos).";
                }
            } else {
                successBonusContainer.style.display = 'none';
            }

            // Mostrar el modal y ocultar el del carrito
            if (cartModal) cartModal.style.display = 'none';
            successModal.style.display = 'block';

            // Vaciar el carrito y actualizar UI
            cart = [];
            updateCartUI();
        };

        if (publicSellerRef || (extrasOriginalOwner && !isSellerMode && !publicSellerRef)) {
            const destToFetch = publicSellerRef || extrasOriginalOwner;
            db.ref(`sellerStores/${destToFetch}`).once('value').then(snap => {
                finalizeCheckout(snap.val());
            }).catch(() => finalizeCheckout(null));
        } else {
            finalizeCheckout(null);
        }
    });
}

// Almacena el listener activo para poder desregistrarlo cuando sea necesario
let _sellerDashboardListener = null;
let _sellerDashboardRef = null;

function renderSellerDashboard() {
    if (!sellerSalesList) return;
    sellerSalesList.innerHTML = '<p style="text-align:center; color:#ccc;">Cargando tus ventas...</p>';

    // Desregistrar listener previo si existe (evitar duplicados)
    if (_sellerDashboardRef && _sellerDashboardListener) {
        _sellerDashboardRef.off('value', _sellerDashboardListener);
    }

    _sellerDashboardRef = db.ref(`sellerSales/${currentSellerName}`);

    // Usar .on('value') para escuchar cambios en tiempo real
    _sellerDashboardListener = _sellerDashboardRef.on('value', snap => {
        const sales = snap.val();
        sellerSalesList.innerHTML = '';
        let salesArray = [];
        if (sales) {
            salesArray = Object.keys(sales).map(k => ({ id: k, ...sales[k] })).sort((a, b) => b.date - a.date);
        }

        let totalAccumulated = 0;
        salesArray.forEach(sale => {
            if (sale.incentiveEarned && sale.isPaid !== false) totalAccumulated += sale.incentiveEarned;
        });

        // Aplicar bonos ya canjeados por el admin
        const sellers = storeConfig.sellers || [];
        const sellerProfile = sellers.find(s => s.name === currentSellerName);
        const redeemed = sellerProfile && sellerProfile.bonusesRedeemed ? parseInt(sellerProfile.bonusesRedeemed) : 0;
        let netAccumulated = totalAccumulated - redeemed;
        if (netAccumulated < 0) netAccumulated = 0;

        const board = document.getElementById('seller-incentives-board');
        const boardMsg = document.getElementById('seller-incentive-msg');
        const boardAmount = document.getElementById('seller-incentive-amount');
        let boardDetails = document.getElementById('seller-incentive-details-list');

        if (!boardDetails && board) {
            boardDetails = document.createElement('div');
            boardDetails.id = 'seller-incentive-details-list';
            board.appendChild(boardDetails);
        }

        if (board) {
            board.style.display = 'block';
            boardAmount.innerHTML = netAccumulated.toLocaleString();

            if (storeConfig.incentiveEnabled) {
                boardMsg.innerHTML = storeConfig.incentiveMessage || 'Sigue vendiendo para acumular increíbles bonos y recompensas.';
                if (boardDetails) {
                    boardDetails.style.display = 'block';
                    let activeTableHtml = `
                        <div style="font-size: 0.8rem; text-align: left; background: rgba(0,0,0,0.15); border-radius: 8px; padding: 10px; margin-top: 15px; color: #ccc;">
                            <strong style="color:white;"><i class="fa-solid fa-list-check" style="color:#f39c12"></i> Tabla de Ganancias Activas:</strong><br><br>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Netflix: <b>$${parseInt(storeConfig.incentiveNetflix) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Disney: <b>$${parseInt(storeConfig.incentiveDisney) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> HBO Max: <b>$${parseInt(storeConfig.incentiveMax) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Prime: <b>$${parseInt(storeConfig.incentivePrime) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Paramount: <b>$${parseInt(storeConfig.incentiveParamount) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Vix: <b>$${parseInt(storeConfig.incentiveVix) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> IPTV: <b>$${parseInt(storeConfig.incentiveIptv) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Crunchyroll: <b>$${parseInt(storeConfig.incentiveCrunchyroll) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Apple TV: <b>$${parseInt(storeConfig.incentiveApple) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Combo 2 P.: <b>$${parseInt(storeConfig.incentiveCombo2) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Combo 3 P.: <b>$${parseInt(storeConfig.incentiveCombo3) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Combo 4 P.: <b>$${parseInt(storeConfig.incentiveCombo4) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Combo 5+ P.: <b>$${parseInt(storeConfig.incentiveCombo5) || 0}</b></div>
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Promo Finde: <b>$${parseInt(storeConfig.incentiveFinde) || 0}</b></div>
                                <div style="grid-column: 1 / -1;"><i class="fa-solid fa-check" style="color:#4cd137"></i> Promo del Mes: <b>$${parseInt(storeConfig.incentiveMes) || 0}</b></div>
                            </div>
                        </div>
                    `;
                    boardDetails.innerHTML = activeTableHtml;
                }
            } else {
                boardMsg.innerHTML = 'Las recompensas activas están temporalmente pausadas, pero aquí está tu acumulado.';
                if (boardDetails) boardDetails.style.display = 'none';
            }
        }

        if (!sales) {
            sellerSalesList.innerHTML = '<p style="text-align:center; color:#ccc; margin-top:2rem;">Aún no tienes ventas registradas.</p>';
            return;
        }

        let displayedSalesArray = salesArray;
        if (sellerSearchSales && sellerSearchSales.value.trim() !== '') {
            const query = sellerSearchSales.value.trim().toLowerCase();
            displayedSalesArray = salesArray.filter(sale => {
                const cInfo = ((sale.clientName || '') + ' ' + (sale.clientPhone || '')).toLowerCase();
                return cInfo.includes(query);
            });
        }

        const activeSales = [];
        const expiredSales = [];

        displayedSalesArray.forEach(sale => {
            const now = Date.now();
            const expEndOfDay = sale.expirationDate;
            const isExpired = now > expEndOfDay;
            if (isExpired) expiredSales.push(sale);
            else activeSales.push(sale);
        });

        // Render Active Section
        if (activeSales.length > 0) {
            const header = document.createElement('h3');
            header.innerHTML = '<i class="fa-solid fa-cart-shopping" style="color:#4cd137"></i> Mis Ventas Activas';
            header.style.cssText = 'color: white; margin: 1.5rem 0 1rem 0; font-size: 1.1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;';
            sellerSalesList.appendChild(header);

            activeSales.forEach(sale => renderSellerSaleCard(sale, false, sellerSalesList));
        }

        // Se eliminó por completo la renderización de ventas vencidas para los vendedores a petición.
    });
}

function renderSellerSaleCard(sale, isExpired, container) {
    const now = Date.now();
    const expEndOfDay = sale.expirationDate;
    const daysLeft = Math.ceil((expEndOfDay - now) / (1000 * 60 * 60 * 24));

    let statusColor = '#4cd137';
    if (!isExpired && daysLeft <= 3) statusColor = '#f39c12';
    if (isExpired) statusColor = '#ff4d4d';

    const div = document.createElement('div');
    div.style.background = isExpired ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255,255,255,0.05)';
    div.style.border = `1px solid ${isExpired ? 'rgba(255, 77, 77, 0.2)' : statusColor}`;
    div.style.padding = '1rem';
    div.style.borderRadius = '12px';
    div.style.marginBottom = '0.8rem';
    div.style.opacity = isExpired ? '0.7' : '1';

    const safeClientName = (sale.clientName || 'Cliente').replace(/'/g, "");
    const itemsStr = sale.items ? sale.items.map(i => i.name).join(', ') : 'Pantallas';

    let buttonsHtml = '';
    const canRenew = !isExpired && daysLeft <= 3; // Solo mostrar Renovar los últimos 3 días
    const isSameLocalDay = (ts1, ts2) => {
        if (!ts1 || !ts2) return false;
        const d1 = new Date(Number(ts1));
        const d2 = new Date(Number(ts2));
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };
    const nowDateObj = new Date(now);
    const expDateObj = sale.expirationDate ? new Date(Number(sale.expirationDate)) : null;
    const isCutoffDayToday = Boolean(expDateObj && nowDateObj.getDate() === expDateObj.getDate());
    const isFirstDayOfNewSale = isSameLocalDay(sale.fechaCompraOriginal || sale.date, now) && !sale.adminRenewedAt;
    // La pestaña "Renovada" solo aparece el día de corte/vencimiento y únicamente si el Admin ya la renovó
    const canShowRenovada = !isExpired && (
        isSameLocalDay(sale.adminRenewedAt, now) ||
        (isCutoffDayToday && daysLeft >= 25 && !isFirstDayOfNewSale)
    );
    const sellerCodeAllowed = window.canSellerUseCodeActivation ? window.canSellerUseCodeActivation(currentSellerName) : true;
    const cleanCardPhone = window.sanitizePhone ? window.sanitizePhone(sale.clientPhone) : String(sale.clientPhone || '').replace(/\D/g, '').replace(/^57/, '');
    const statusBadgeId = `seller-card-code-status-${sale.id || cleanCardPhone}`;

    // Validar si la cuenta ya tiene credenciales entregadas/activas
    const hasActiveCredentials = Boolean(
        (sale.email && sale.email.trim() !== '') ||
        (sale.password && sale.password.trim() !== '') ||
        (sale.items && sale.items.some(i => i.specificEmails && i.specificEmails.length > 0 && i.specificEmails[0].email))
    );

    // El Ticket Admin solo se habilita para compras realizadas por el cliente desde la tienda virtual del vendedor
    const isStorePurchase = Boolean(
        sale.fromStore === true ||
        sale.isStorePurchase === true ||
        Boolean(sale.sellerStoreRef) ||
        (!hasActiveCredentials && sale.isPaid === false)
    );

    const showTicketAdmin = !isExpired && isStorePurchase && (sale.fromStore === true || sale.isStorePurchase === true || !hasActiveCredentials);

    if (!isExpired) {
        buttonsHtml = `
            <div style="display:flex; gap: 0.5rem; flex-wrap:wrap;">
                ${sellerCodeAllowed ? `
                <button onclick="openSellerClientCodeModal('${sale.clientPhone || ''}', '${encodeURIComponent(sale.clientName || 'Cliente')}', '${currentSellerName}')" 
                    style="flex: 1 1 100%; padding:0.65rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #f39c12; background: linear-gradient(135deg, rgba(243, 156, 18, 0.25), rgba(230, 126, 34, 0.15)); color:#f39c12; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 2px 10px rgba(243,156,18,0.15);">
                    <i class="fa-solid fa-unlock-keyhole"></i> 🔑 Activar Pantalla / Códigos Cliente
                </button>` : ''}
                ${showTicketAdmin ? `
                <button onclick="sendTicketToAdminFromDash('${encodeURIComponent(sale.clientName)}', '${sale.clientPhone || ''}', '${encodeURIComponent(JSON.stringify(sale.items || []))}')" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:none; background: linear-gradient(135deg, #3498db, #2980b9); color:white;" title="Enviar el comprobante de pago al Admin con Precio Vendedor">
                    <i class="fa-solid fa-file-invoice-dollar"></i> Ticket Admin
                </button>` : ''}
                ${canRenew ? `
                <button onclick="renewFromDash('${safeDecode(sale.clientName)}', '${sale.clientPhone}', '${sale.clientCity}', '${encodeURIComponent(JSON.stringify(sale.items || []))}', '${sale.id}', 'seller', ${sale.expirationDate || 0}, ${sale.fechaCompraOriginal || 0}, ${sale.date || 0})" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:none; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:black;">
                    <i class="fa-solid fa-redo"></i> Renovar
                </button>` : ''}
                <button onclick="sendReminderFromDash('${sale.id}', '${safeClientName}', '${sale.clientPhone || ''}', '${encodeURIComponent(itemsStr)}')" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #4cd137; background: rgba(76, 209, 55, 0.1); color:#4cd137;">
                    <i class="fa-brands fa-whatsapp"></i> Recordar
                </button>
                ${canShowRenovada ? `
                <button onclick="sendRenovadaFromDash('${encodeURIComponent(sale.clientName)}', '${sale.clientPhone || ''}', '${encodeURIComponent(itemsStr)}', ${(sale.items && sale.items.length > 1) ? true : false}, ${sale.expirationDate || 0}, '${sale.id}')" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #f39c12; background: rgba(243, 156, 18, 0.1); color:#f39c12;">
                    <i class="fa-brands fa-whatsapp"></i> Renovada
                </button>` : ''}
                <button onclick="editClientFromDash('${sale.id}', '${safeDecode(sale.clientName)}', '${sale.clientPhone || ''}', '${sale.clientCity || ''}')" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #c48dfc; background: rgba(196, 141, 252, 0.1); color:#c48dfc;">
                    <i class="fa-solid fa-pen"></i> Editar
                </button>
            </div>
        `;
    }

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; flex-wrap:wrap; gap:0.5rem; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <strong style="color:white; font-size:1.1rem;">${safeDecode(sale.clientName)}</strong>
                ${(isStorePurchase && !hasActiveCredentials) ? `<span style="background: rgba(52, 152, 219, 0.2); color:#74b9ff; border: 1px solid rgba(52, 152, 219, 0.4); padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight:bold;"><i class="fa-solid fa-shop"></i> Tienda Virtual</span>` : ''}
            </div>
            <span style="background:${statusColor}; color:${isExpired ? 'white' : (daysLeft <= 3 ? 'black' : 'white')}; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight:bold;">
                ${isExpired ? '🔴 Vencida' : (daysLeft <= 3 ? `⚠️ Vence en ${daysLeft} día${daysLeft === 1 ? '' : 's'} — Renovar` : `Vence en ${daysLeft} días`)}
            </span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#a0a0a0; font-size:0.8rem; margin-bottom:0.8rem; background:rgba(0,0,0,0.2); padding: 5px; border-radius:6px;">
            <span><i class="fa-regular fa-calendar-check" style="color:#4cd137;"></i> Inicio: ${new Date(sale.date).toLocaleDateString()}</span>
            <span><i class="fa-regular fa-calendar-xmark" style="color:#ff4d4d;"></i> Fin: ${new Date(sale.expirationDate).toLocaleDateString()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#ccc; font-size:0.85rem; margin-bottom:0.5rem;">
            <span><i class="fa-solid fa-mobile-screen"></i> ${sale.clientPhone || 'No registrado'}</span>
            <span>📍 ${sale.clientCity || 'Ciudad N/A'}</span>
        </div>
        ${sale.incentiveEarned ? `<div style="background: rgba(243,156,18,0.2); border: 1px dashed #f39c12; color: #f39c12; font-size: 0.8rem; padding: 5px 10px; border-radius: 6px; margin-bottom: 0.8rem;"><b>Bono Ganado:</b> +$${sale.incentiveEarned.toLocaleString()}</div>` : ''}
        <p style="font-size:0.85rem; color:var(--text-primary); margin-bottom:0.5rem;">📺 ${itemsStr}</p>
        ${(!isExpired && sellerCodeAllowed && cleanCardPhone) ? `<div id="${statusBadgeId}" style="font-size:0.76rem; color:#aaa; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.08); border-radius:6px; padding:5px 8px; margin-bottom:0.8rem;"><i class="fa-solid fa-link" style="color:#f39c12;"></i> Contador Códigos (Vendedor/Cliente): <span style="color:#888;">Consultando...</span></div>` : ''}
        ${buttonsHtml}
    `;
    container.appendChild(div);

    // Consultar contador compartido en tiempo real para mostrarle al vendedor qué intentos ya fueron usados (por él o por el cliente)
    if (!isExpired && sellerCodeAllowed && cleanCardPhone && typeof db !== 'undefined') {
        Promise.all([
            db.ref(`clientProfiles/${cleanCardPhone}/codeAttemptUsed`).once('value'),
            db.ref(`clientProfiles/57${cleanCardPhone}/codeAttemptUsed`).once('value')
        ]).then(([snap1, snap2]) => {
            const badgeEl = document.getElementById(statusBadgeId);
            if (!badgeEl) return;
            const u1 = snap1.val();
            const u2 = snap2.val();
            let usedObj = {};
            if (u1 === true || u2 === true) {
                usedObj = { netflix: true, disney: true, hbomax: true, prime: true };
            } else {
                if (u1 && typeof u1 === 'object') Object.assign(usedObj, u1);
                if (u2 && typeof u2 === 'object') Object.assign(usedObj, u2);
            }
            const usedKeys = Object.keys(usedObj).filter(k => usedObj[k] === true || (typeof usedObj[k] === 'number' && usedObj[k] > 0));
            if (usedKeys.length === 0) {
                badgeEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#2ecc71;"></i> Contador Códigos (Cliente + Vendedor): <strong style="color:#2ecc71;">Disponible (0 usados)</strong>`;
            } else {
                const labels = usedKeys.map(k => {
                    const val = usedObj[k];
                    if (k === 'netflix_update' || k === 'disney_update' || k === 'hbomax_update') {
                        return `${k.replace('_update', ' hogar')} (${val}/2)`;
                    }
                    return `${k.replace('_tv', ' TV')} (Agotado)`;
                }).join(', ');
                badgeEl.innerHTML = `<i class="fa-solid fa-clock-rotate-left" style="color:#f39c12;"></i> Contador Compartido: <strong style="color:#f39c12;">Usados: ${labels}</strong>`;
            }
        }).catch(() => {});
    }
}

window.renewFromDash = function (cName, cPhone, cCity, itemsJsonEncoded, saleId = null, source = 'client', prevExpDate = null, prevOrigDate = null, prevStartDate = null) {
    window.renewalSaleId = saleId;
    window.renewalSource = source;
    window.renewalSaleExp = prevExpDate ? parseInt(prevExpDate) : null;
    window.renewalSaleOrig = prevOrigDate ? parseInt(prevOrigDate) : null;
    window.renewalSaleStart = prevStartDate ? parseInt(prevStartDate) : null;
    try {
        const itemsToRenew = JSON.parse(decodeURIComponent(itemsJsonEncoded));

        cart = [];
        itemsToRenew.forEach(i => {
            let found = products.find(p => p.id === i.id) || products.find(p => i.name && i.name.includes(p.name));
            if (found) {
                cart.push({ ...found, customName: i.customName || null });
            }
        });

        if (cart.length === 0) {
            alert("No se pudieron encontrar las pantallas en el catálogo actual para renovar.");
            return;
        }

        updateCartUI();

        // Open Cart, pre-fill
        document.getElementById('is-renewal').checked = true;
        document.getElementById('client-name').value = cName !== 'undefined' ? safeDecode(cName) : '';
        document.getElementById('client-phone').value = cPhone !== 'undefined' ? cPhone : '';
        document.getElementById('client-city').value = cCity !== 'undefined' ? cCity : '';

        if (sellerDashboardModal) sellerDashboardModal.style.display = 'none';
        if (clientDashboardModal) clientDashboardModal.style.display = 'none';

        renderCartItems();
        if (isSellerMode) {
            document.getElementById('recurrent-client-container').style.display = 'none';
            document.getElementById('new-client-form').style.display = 'block';
            document.getElementById('recurrent-client').checked = false;
        }
        cartModal.style.display = 'block';

    } catch (e) {
        alert('Error al armar el carrito de renovación.');
        console.error(e);
    }
}

window.sendTicketToAdminFromDash = function (cNameEnc, cPhone, itemsJsonEncoded) {
    const saleItems = JSON.parse(decodeURIComponent(itemsJsonEncoded));
    const cName = safeDecode(cNameEnc);

    let message = `🚀 *Nuevo Pedido - Streaming DPC*\n\n`;
    message += `🔥 *Orden procesada por Vendedor:* ${currentSellerName}\n\n`;
    message += `*DATOS DEL CLIENTE (Adquirido en Página)*\n`;
    message += `👤 Nombre: ${cName}\n`;
    if (cPhone) message += `📱 Celular: ${cPhone}\n`;
    message += `--------------------\n\n`;
    message += `Hola, me gustaría procesar el pago de estas pantallas para mi cliente:\n\n`;

    let totalMayorista = 0;

    saleItems.forEach((item, i) => {
        const pDb = products.find(p => p.id === item.id) || products.find(p => item.name && item.name.includes(p.name));
        let pWholesale = pDb && pDb.sellerPrice ? pDb.sellerPrice : (item.finalPrice || 0);

        if (pDb && typeof pDb.sellerPrice === 'number' && pDb.sellerPrice > 0) {
            pWholesale = pDb.sellerPrice;
        } else if (pDb && typeof pDb.price === 'number' && pDb.price > 0 && pWholesale === 0) {
            pWholesale = pDb.price;
        }

        totalMayorista += pWholesale;

        let displayItemName = item.customName ? `${item.name} (${item.customName})` : item.name;
        message += `${i + 1}. *${displayItemName}* - $${pWholesale.toLocaleString()} (P. Vendedor)\n`;
    });

    message += `\n💼 *Valor Mayorista (Para el Admin):* $${totalMayorista.toLocaleString()}\n\n`;

    let currentPaymentInfo = storeConfig.paymentInfo || '💳 *Por favor contáctame para indicarte mis métodos de pago...*';
    message += `${currentPaymentInfo}\n\n`;
    message += `Quedo atento a la activación de mis pantallas con respectivo comprobante.`;

    const adminPhone = formatWaPhone(storeConfig.whatsappNumber || '573155182545');
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${adminPhone}?text=${encodedMsg}`, '_blank');
}

window.sendReminderFromDash = async function (saleId, cName, cPhone, itemsEncoded) {
    if (!reminderEditorModal) return;

    const items = decodeURIComponent(itemsEncoded);
    let template = storeConfig.reminderTemplate || "Hola {cliente} 😊 Buen dia\nTU {pantallas} finaliza \n👉 *HOY* 👈\n👉 😱... \n⚠️ Si deseas continuar, realiza el pago y me envías la foto del comprobante🧾 (sin comprobante no cuenta como pago válido) ⚠️\n\n*Medios de Pago:*\n*Nequi o Daviplata 3155182545*\n\n*Llave Nequi @NEQUICEC36* \n*Llave Daviplata @PLATA3155182545* \n*Llave Nu @CMA736*\n*Llave Be @BE346516*";

    // Replace variables
    let msg = template.replace(/{cliente}/g, cName).replace(/{pantallas}/g, items);

    let clientPin = "No asignado";
    if (cPhone) {
        let cleanPhone = cPhone.replace(/\D/g, '');
        try {
            const snap = await db.ref(`clientProfiles/${cleanPhone}/pin`).once('value');
            if (snap.exists() && snap.val()) {
                clientPin = snap.val();
            }
        } catch (e) { }
    }
    msg += `\n\nCelular: ${cPhone || 'N/A'} y Pin: ${clientPin}`;

    remindSaleIdInput.value = saleId;
    remindPhoneInput.value = cPhone || '';
    remindMsgInput.value = msg;

    reminderEditorModal.style.display = 'block';
}

window.sendRenovadaFromDash = function (clientNameEnc, clientPhone, itemsEncoded, isMultiple, expirationDateTS, saleId = null) {
    if (!clientPhone) return alert('Este cliente no tiene número registrado.');
    const clientName = decodeURIComponent(clientNameEnc);
    const itemsStr = decodeURIComponent(itemsEncoded);

    // Solo informativo: NO modifica ni recalcula la fecha de vencimiento en Firebase ni le suma otro mes,
    // ya que la renovación y nueva fecha de vencimiento la define únicamente el Admin.
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    const _buildAndSend = (monthText) => {
        let msg = '';
        if (isMultiple) {
            const tmpl = storeConfig.renovadaPluralTemplate || "♦️♦️♦️ ** Tus Pantallas de *{pantallas}* han sido Renovadas* con los mismos datos que tenga buen día que la disfrute ♦️♦️♦️ *vence {mes}*";
            msg = tmpl.replace(/{cliente}/g, clientName).replace(/{pantallas}/g, itemsStr).replace(/{mes}/g, monthText);
        } else {
            const tmpl = storeConfig.renovadaSingularTemplate || "♦️♦️♦️ ** Tu Pantalla de *{pantallas}* ha sido Renovada* con los mismos datos que tenga buen día que la disfrute ♦️♦️♦️ *vence {mes}*";
            msg = tmpl.replace(/{cliente}/g, clientName).replace(/{pantallas}/g, itemsStr).replace(/{mes}/g, monthText);
        }
        const encodedMsg = encodeURIComponent(msg);
        let waPhone = clientPhone.toString().replace(/\D/g, '');
        if (waPhone.length === 10 && waPhone.startsWith('3')) waPhone = '57' + waPhone;
        window.open(`https://wa.me/${waPhone}?text=${encodedMsg}`, '_blank');
    };

    if (expirationDateTS && expirationDateTS !== 0) {
        const d = new Date(parseInt(expirationDateTS));
        _buildAndSend(`${d.getDate()} ${months[d.getMonth()]}`);
    } else {
        _buildAndSend('el próximo mes');
    }
}

function sendCRMMessageFromSale(saleId, clientName, clientPhone, itemsEncoded) {
    if (!clientPhone) { alert('Cliente sin número de teléfono.'); return; }
    const itemsStr = decodeURIComponent(itemsEncoded);
    let msg = storeConfig.msgTemplate1 || '';
    msg = msg.replace(/{nombre}/g, clientName)
        .replace(/{pantalla}/g, itemsStr)
        .replace(/{inicio}/g, new Date().toLocaleDateString())
        .replace(/{fin}/g, (() => {
            // ✅ CAP MONTH FIX: fecha fin real (mismo día del mes siguiente) no +30 días fijos
            const d = window.DPCBillingEngine
                ? window.DPCBillingEngine.calcularProximoVencimiento(Date.now(), Date.now())
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            return d.toLocaleDateString('es-CO');
        })());
    const sendOnly = storeConfig.sendOnlyStep1 === true || storeConfig.sendOnlyStep1 === 'true';
    if (!sendOnly) {
        const tmpl2 = storeConfig.msgTemplate2 || '';
        msg += '\n' + tmpl2.replace(/{nombre}/g, clientName).replace(/{pantalla}/g, itemsStr);
        if (Array.isArray(storeConfig.msgGallery)) {
            storeConfig.msgGallery.forEach(item => {
                msg += '\n' + (item.text || '') + '\n' + (item.url || '');
            });
        }
    }
    const waPhone = clientPhone.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/${waPhone}?text=${encodedMsg}`, '_blank');
}


window.editClientFromDash = function (saleId, cName, cPhone, cCity) {
    const newName = prompt('Editar Nombre del Cliente:', cName);
    if (newName === null) return;
    const newPhone = prompt('Editar Celular del Cliente:', cPhone);
    if (newPhone === null) return;
    const newCity = prompt('Editar Ciudad del Cliente:', cCity);
    if (newCity === null) return;

    // Update in Firebase sellerSales (Specific Sale)
    let updates = {};
    updates[`sellerSales/${currentSellerName}/${saleId}/clientName`] = newName;
    updates[`sellerSales/${currentSellerName}/${saleId}/clientPhone`] = newPhone;
    updates[`sellerSales/${currentSellerName}/${saleId}/clientCity`] = newCity;

    let cleanPhoneOld = cPhone ? cPhone.replace(/\D/g, '') : '';
    let cleanPhoneNew = newPhone ? newPhone.replace(/\D/g, '') : '';

    db.ref('/').update(updates).then(async () => {
        // Sync specific record in clientSales if phone matches
        if (cleanPhoneOld && cleanPhoneOld === cleanPhoneNew) {
            try {
                const snap = await db.ref(`clientSales/${cleanPhoneOld}`).once('value');
                const cSales = snap.val();
                if (cSales) {
                    let cUpd = {};
                    // Find the EXACT matching sale by date to avoid messing up others sharing the same phone
                    Object.keys(cSales).forEach(k => {
                        // Compare dates (assuming it was retrieved recently)
                        if (cSales[k].clientName === cName) {
                            cUpd[`clientSales/${cleanPhoneOld}/${k}/clientName`] = newName;
                            cUpd[`clientSales/${cleanPhoneOld}/${k}/clientCity`] = newCity;
                            // We don't update clientProfiles/name here because that's shared!
                        }
                    });
                    if (Object.keys(cUpd).length > 0) await db.ref('/').update(cUpd);
                }
                alert('Cliente editado correctamente.');
                window.location.reload();
            } catch (e) {
                console.error(e);
                alert('Editado en dashboard, pero hubo un error sincronizando historial.');
                window.location.reload();
            }
        } else {
            alert('Cliente editado correctamente.');
            window.location.reload();
        }
    });
};

function renderClientDashboard() {
    if (!clientSalesList || !clientPhoneLoggedIn) return;
    clientSalesList.innerHTML = '<p style="text-align:center; color:#ccc;">Buscando tus compras...</p>';

    db.ref(`clientSales/${clientPhoneLoggedIn}`).once('value').then(snap => {
        const sales = snap.val();
        clientSalesList.innerHTML = '';
        if (!sales) {
            clientSalesList.innerHTML = '<p style="text-align:center; color:#ccc; margin-top:2rem;">No tienes compras registradas aún.</p>';
            return;
        }

        const salesArray = Object.keys(sales).map(k => ({ id: k, ...sales[k] })).sort((a, b) => b.date - a.date);

        const activeSales = [];
        const expiredSales = [];

        salesArray.forEach(sale => {
            const now = Date.now();
            const expEndOfDay = sale.expirationDate;
            const isExpired = now > expEndOfDay;
            if (isExpired) expiredSales.push(sale);
            else activeSales.push(sale);
        });

        // Render Active Section
        if (activeSales.length > 0) {
            const header = document.createElement('h3');
            header.innerHTML = '<i class="fa-solid fa-circle-play" style="color:#4cd137"></i> Mis Pantallas Activas';
            header.style.cssText = 'color: white; margin: 1.5rem 0 1rem 0; font-size: 1.1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;';
            clientSalesList.appendChild(header);

            activeSales.forEach(sale => renderSaleItem(sale, false, clientSalesList));
        }

        // Render Expired Section
        if (expiredSales.length > 0) {
            const folderWrapper = document.createElement('details');
            folderWrapper.style.cssText = 'margin-top: 1.5rem; background: rgba(255, 77, 77, 0.05); border: 1px solid rgba(255, 77, 77, 0.1); border-radius: 12px; padding: 0.5rem;';

            const summary = document.createElement('summary');
            summary.style.cssText = 'color: #ff4d4d; font-weight: bold; cursor: pointer; padding: 0.5rem; outline: none; list-style: none; display: flex; align-items: center; justify-content: space-between;';
            summary.innerHTML = `
                <span><i class="fa-solid fa-folder-open" style="margin-right: 8px;"></i> PANTALLAS VENCIDAS (HISTORIAL)</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem;"></i>
            `;
            folderWrapper.appendChild(summary);

            const folderContent = document.createElement('div');
            folderContent.style.marginTop = '1rem';
            expiredSales.forEach(sale => renderSaleItem(sale, true, folderContent));
            folderWrapper.appendChild(folderContent);

            clientSalesList.appendChild(folderWrapper);
        }
    });
}

function renderSaleItem(sale, isExpired, container) {
    const now = Date.now();
    const expEndOfDay = sale.expirationDate;
    const daysLeft = Math.ceil((expEndOfDay - now) / (1000 * 60 * 60 * 24));

    let statusColor = '#4cd137'; // Active
    if (!isExpired && daysLeft <= 3) statusColor = '#f39c12'; // Ending soon
    if (isExpired) statusColor = '#ff4d4d'; // Expired

    const div = document.createElement('div');
    div.style.background = isExpired ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255,255,255,0.05)';
    div.style.border = `1px solid ${isExpired ? 'rgba(255, 77, 77, 0.2)' : statusColor}`;
    div.style.padding = '1rem';
    div.style.borderRadius = '12px';
    div.style.marginBottom = '0.8rem';
    div.style.opacity = isExpired ? '0.7' : '1';

    const itemsStr = sale.items ? sale.items.map(i => i.name).join(', ') : 'Pantallas';

    const sellerNetworksHtmlId = 'seller-networks-' + Math.random().toString(36).substr(2, 9);
    let sellerAttribution = '';

    if (sale.sellerName && sale.sellerName !== 'Página Web Oficial') {
        sellerAttribution = `
            <div style="margin-bottom: 0.8rem; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px; border: 1px solid var(--glass-border);">
                <span style="font-size:0.8rem; color:#a0a0a0; display:block; margin-bottom:0.3rem;">Atendido por: <b style="color:var(--accent-primary);">${sale.sellerName}</b></span>
                <div id="${sellerNetworksHtmlId}" style="display:flex; gap: 12px; font-size: 1.4rem; flex-wrap:wrap; margin-top:0.5rem;">
                    <span style="font-size:0.75rem; color:#ccc;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando redes...</span>
                </div>
            </div>
        `;
    }

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; flex-wrap:wrap; gap:0.5rem;">
            <strong style="color:white; font-size:1.1rem;">${safeDecode(sale.clientName)}</strong>
            <span style="background:${statusColor}; color:${isExpired ? 'white' : (daysLeft <= 3 ? 'black' : 'white')}; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight:bold;">
                ${isExpired ? '🔴 Vencida' : (daysLeft <= 3 ? `⚠️ Vence en ${daysLeft} día${daysLeft === 1 ? '' : 's'} — Renovar` : `Vence en ${daysLeft} días`)}
            </span>
        </div>
        ${sellerAttribution}
        <div style="display:flex; justify-content:space-between; color:#a0a0a0; font-size:0.8rem; margin-bottom:0.8rem; background:rgba(0,0,0,0.2); padding: 5px; border-radius:6px;">
            <span><i class="fa-regular fa-calendar-check" style="color:#4cd137;"></i> ${new Date(sale.date).toLocaleDateString()}</span>
            <span><i class="fa-regular fa-calendar-xmark" style="color:#ff4d4d;"></i> ${new Date(sale.expirationDate).toLocaleDateString()}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-primary); margin-bottom:${isExpired ? '0' : '0.8rem'};">📺 ${itemsStr}</p>
        ${!isExpired ? (() => {
            const credBlocks = [];
            (sale.items || []).forEach(it => {
                const specs = Array.isArray(it.specificEmails)
                    ? it.specificEmails
                    : (it.specificEmails && typeof it.specificEmails === 'object' ? Object.values(it.specificEmails) : []);
                specs.forEach(sc => {
                    if (sc && (sc.email || sc.profile || sc.pin)) {
                        credBlocks.push(`
                            <div style="background:rgba(0,0,0,0.35); border:1px solid rgba(46, 204, 113, 0.3); border-radius:8px; padding:8px 10px; font-size:0.8rem; line-height:1.45;">
                                <div style="color:#2ecc71; font-weight:bold; margin-bottom:3px;"><i class="fa-solid fa-tv"></i> ${sc.platform || it.name || 'Pantalla'}</div>
                                ${sc.email ? `<div style="color:#ddd;">📧 <b>Correo:</b> <span style="color:#00d2d3; user-select:all;">${sc.email}</span></div>` : ''}
                                ${(sc.profile || sc.pin) ? `<div style="color:#ddd;">👤 <b>Perfil:</b> ${sc.profile || 'Asignado'} ${sc.pin ? `| 🔢 <b>PIN:</b> <span style="color:#f1c40f; font-weight:bold;">${sc.pin}</span>` : ''}</div>` : ''}
                            </div>
                        `);
                    }
                });
            });
            return credBlocks.length > 0 ? `<div style="display:flex; flex-direction:column; gap:6px; margin-bottom:0.8rem;">${credBlocks.join('')}</div>` : '';
        })() : ''}
        ${!isExpired ? `
        <div style="display:flex; flex-direction:column; gap: 0.5rem;">
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                ${(sale.items || []).map(item => {
        const platformNameRaw = item.name.split(' ')[0].toLowerCase().replace(/\W/g, '');
        const crmPlatforms = storeConfig ? (storeConfig.crmPlatforms || {}) : {};
        const matchingConfig = Object.values(crmPlatforms).find(conf =>
            (conf.name && platformNameRaw.includes(conf.name.toLowerCase().replace(/\W/g, ''))) ||
            (conf.description && platformNameRaw.includes(conf.description.toLowerCase().replace(/\W/g, '')))
        );

        if (matchingConfig && matchingConfig.manualUrl) {
            return `
                        <button onclick="window.open('${matchingConfig.manualUrl}', '_blank')" 
                            style="flex:1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #2ab7ca; background: rgba(42, 183, 202, 0.1); color:#2ab7ca; font-size:0.8rem;">
                            <i class="fa-solid fa-eye"></i> Guía ${item.name.split(' ')[0]}
                        </button>
                        `;
        }
        return '';
    }).join('')}
            </div>
            ${daysLeft <= 3 ? `
            <button onclick="renewFromDash('${encodeURIComponent(sale.clientName)}', '${sale.clientPhone || clientPhoneLoggedIn}', '${sale.clientCity || ''}', '${encodeURIComponent(JSON.stringify(sale.items || []))}', '${sale.id}', 'client', ${sale.expirationDate || 0}, ${sale.fechaCompraOriginal || 0}, ${sale.date || 0})" 
                style="width: 100%; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:none; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:black;">
                <i class="fa-solid fa-redo"></i> ⚠️ Renovar mis pantallas
            </button>` : ''}
        </div>
        ` : ''}
    `;
    container.appendChild(div);

    if (sale.sellerName && sale.sellerName !== 'Página Web Oficial') {
        db.ref(`sellerStores/${sale.sellerName}`).once('value').then(storeSnap => {
            const sData = storeSnap.val();
            const netDiv = document.getElementById(sellerNetworksHtmlId);
            if (netDiv) {
                if (sData) {
                    let netsHtml = '';
                    if (sData.whatsapp) netsHtml += `<a href="https://wa.me/${formatWaPhone(sData.whatsapp)}" target="_blank" style="color:#25D366; transition:transform 0.2s;"><i class="fa-brands fa-whatsapp"></i></a>`;
                    if (sData.facebookUrl) netsHtml += `<a href="${sData.facebookUrl}" target="_blank" style="color:#1877F2; transition:transform 0.2s;"><i class="fa-brands fa-facebook"></i></a>`;
                    if (sData.instagramUrl) netsHtml += `<a href="${sData.instagramUrl}" target="_blank" style="color:#E1306C; transition:transform 0.2s;"><i class="fa-brands fa-instagram"></i></a>`;
                    if (sData.tiktokUrl) netsHtml += `<a href="${sData.tiktokUrl}" target="_blank" style="color:#ffffff; transition:transform 0.2s;"><i class="fa-brands fa-tiktok"></i></a>`;
                    if (sData.kwaiUrl) netsHtml += `<a href="${sData.kwaiUrl}" target="_blank" style="color:#FF5E00; transition:transform 0.2s;"><i class="fa-solid fa-video"></i></a>`;
                    if (sData.youtubeUrl) netsHtml += `<a href="${sData.youtubeUrl}" target="_blank" style="color:#FF0000; transition:transform 0.2s;"><i class="fa-brands fa-youtube"></i></a>`;

                    netDiv.innerHTML = netsHtml || `<span style="font-size:0.75rem; color:#a0a0a0;">Sin redes configuradas</span>`;
                } else {
                    netDiv.innerHTML = `<span style="font-size:0.75rem; color:#a0a0a0;">Sin redes configuradas</span>`;
                }
            }
        }).catch(() => {
            const netDiv = document.getElementById(sellerNetworksHtmlId);
            if (netDiv) netDiv.innerHTML = `<span style="font-size:0.75rem; color:#a0a0a0;">Sin redes configuradas</span>`;
        });
    }
}
// --- CRM / RESPUESTAS FUNCTIONS ---
let _crmTargetClient = { name: '', phone: '', start: '', end: '', pin: '', fullItems: [], sellerName: '' };

window.openCRMPlatformSelector = function (nameEnc, phone, start, end, pin, itemsEnc, email = '', pass = '', profile = '', fullItemsJson = '[]', sellerNameEnc = '') {
    _crmTargetClient = {
        name: decodeURIComponent(nameEnc),
        phone: phone,
        start: start,
        end: end,
        pin: pin,
        itemsRaw: decodeURIComponent(itemsEnc || ''),
        email: email,
        pass: pass,
        profile: profile,
        fullItems: JSON.parse(decodeURIComponent(fullItemsJson)),
        sellerName: decodeURIComponent(sellerNameEnc || '')
    };
    const modal = document.getElementById('crm-selector-modal');
    const searchInput = document.getElementById('crm-platform-search');
    if (searchInput) searchInput.value = '';

    if (!modal) return;
    renderCRMPlatformsList('');
    modal.style.display = 'flex';
}

window.filterCRMPlatforms = function (val) {
    renderCRMPlatformsList(val.toLowerCase());
}

window.renderCRMPlatformsList = function (filter) {
    const list = document.getElementById('crm-platforms-selection-list');
    if (!list) return;

    list.innerHTML = '';
    const dict = storeConfig.crmGalleryDict || {};
    const platforms = storeConfig.crmPlatforms || {};
    let allKeys = Object.keys(platforms);
    if (allKeys.length === 0) allKeys = Object.keys(dict);

    const purchasedItemsStr = (_crmTargetClient.itemsRaw || '').toLowerCase();
    const keys = allKeys.filter(k => k.toLowerCase().includes(filter));

    const recommended = [];
    const others = [];

    keys.forEach(k => {
        if (purchasedItemsStr.includes(k.toLowerCase())) recommended.push(k);
        else others.push(k);
    });

    if (recommended.length > 0 && !filter) {
        const title = document.createElement('p');
        title.style = 'grid-column: 1 / -1; color: var(--accent-primary); font-weight: bold; margin: 5px 0; font-size: 0.8rem;';
        title.innerHTML = '✨ RECOMENDADOS:';
        list.appendChild(title);
        recommended.forEach(k => list.appendChild(createPlatformButton(k, true)));

        const titleRest = document.createElement('p');
        titleRest.style = 'grid-column: 1 / -1; color: #777; font-weight: bold; margin: 10px 0 5px 0; font-size: 0.8rem;';
        titleRest.innerHTML = 'OTRAS PLATAFORMAS:';
        list.appendChild(titleRest);
    }

    others.forEach(k => list.appendChild(createPlatformButton(k, false)));
}

function createPlatformButton(k, isRecommended) {
    const btn = document.createElement('button');
    btn.className = 'tab-btn'; // use existing styles
    btn.style = `margin:0; background:${isRecommended ? 'rgba(155, 89, 182, 0.2)' : 'var(--glass)'}; border: 1px solid ${isRecommended ? '#9b59b6' : 'var(--glass-border)'}; font-size:0.85rem; padding:12px 5px; text-align:center; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px;`;

    let displayName = k;
    let displayVariant = '';
    if (k.includes(' | ')) {
        const parts = k.split(' | ');
        displayName = parts[0];
        displayVariant = parts[1];
    }

    btn.innerHTML = `
        <i class="fa-solid fa-tv" style="color:${isRecommended ? '#9b59b6' : 'var(--accent-primary)'}; font-size:1.1rem;"></i> 
        <span style="word-break: break-word; font-weight:bold;">${displayName}</span>
        ${displayVariant ? `<span style="font-size:0.65rem; color:#2ab7ca;">${displayVariant}</span>` : ''}
    `;

    btn.onclick = () => {
        sendCRMStep1Message(k);
        btn.style.opacity = '0.5';
        btn.disabled = true;
    };
    return btn;
}

window.closeCRMSelector = function () {
    const m = document.getElementById('crm-selector-modal');
    if (m) m.style.display = 'none';
}

function replaceCRMVars(text, data) {
    if (!text) return "";
    return text
        .replace(/{cliente}/ig, data.name || '')
        .replace(/{nombre}/ig, data.name || '')
        .replace(/{pantalla}/ig, data.platformName || '')
        .replace(/{inicio}/ig, data.start || '')
        .replace(/{Fin}/ig, data.end || '')
        .replace(/{pin}/ig, data.pin || 'N/A')
        .replace(/{correo}/ig, data.email || 'N/A')
        .replace(/{clave}/ig, data.pass || 'N/A')
        .replace(/{perfil}/ig, data.profile || 'N/A');
}

window.sendCRMStep1Message = function (platformName) {
    const { name, phone, start, end, pin, sellerName } = _crmTargetClient;
    const dict = storeConfig.crmGalleryDict || {};
    const items = dict[platformName] || [];

    let targetEmail = _crmTargetClient.email && _crmTargetClient.email.trim() ? _crmTargetClient.email : 'N/A';

    const fullItems = _crmTargetClient.fullItems || [];
    if (fullItems.length > 0) {
        fullItems.forEach(it => {
            if (it.specificEmails && Array.isArray(it.specificEmails)) {
                const match = it.specificEmails.find(se =>
                    se.platform && (se.platform.toLowerCase() === platformName.toLowerCase() || platformName.toLowerCase().includes(se.platform.toLowerCase()))
                );
                if (match && match.email && match.email.trim()) targetEmail = match.email;
            }
        });
    }

    const dataVars = { name, platformName, start, end, pin, email: targetEmail, pass: _crmTargetClient.pass, profile: _crmTargetClient.profile };
    let template = storeConfig.msgTemplate1 || "¡Hola {cliente}! Aquí tienes los datos de tu pantalla de {pantalla}:";
    let mainText = replaceCRMVars(template, dataVars);

    let extraText = "";
    if (items.length > 0) {
        extraText += "\n\n🚀 *DETALLES Y GUÍA:*";
        items.forEach((item, index) => {
            let itemText = replaceCRMVars(item.text, dataVars);
            if (itemText) extraText += `\n\n📌 *Paso ${index + 1}:* ${itemText}`;
            if (item.photo && !storeConfig.useLocalRobotCRM) {
                const urls = item.photo.split(/[,,;]/).map(u => u.trim()).filter(u => u);
                urls.forEach(url => extraText += `\n🔗 Foto guía: ${url}`);
            }
        });
    }

    const fullMsg = mainText + extraText;
    let waPhone = phone.toString().replace(/\D/g, '');
    if (waPhone.length === 10 && waPhone.startsWith('3')) waPhone = '57' + waPhone;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(fullMsg)}`, '_blank');
}


window.openWhatsapp = function (phone, text) {
    let encodedText = encodeURIComponent(text);
    let url = (phone && phone !== 'null' && phone !== 'undefined') ? 'https://wa.me/' + phone + '?text=' + encodedText : 'https://wa.me/?text=' + encodedText;
    window.open(url, '_blank');
};

// ============================================================
// Firebase Initialization - OPTIMIZADO: Carga solo datos necesarios
// NO se descarga toda la DB de una vez (evitar lentitud crítica)
// ============================================================

// Mostrar pantalla de carga inmediatamente temporal
const hideLoader = () => {
    const loader = document.getElementById('app-loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 400);
    }
};

const runInit = () => {
    if (!window.appInitialized) {
        window.appInitialized = true;
        hideLoader();
        init();
    } else {
        setupConfigUI();
        const activeTabBtn = document.querySelector('.tab-btn.active');
        if (activeTabBtn) renderProducts(activeTabBtn.dataset.tab);
        updateCartUI();
        renderCartItems();
    }
};

// PASO 1: Cargar storeConfig y products en PARALELO (no toda la DB)
const loadInitialData = () => {
    const configPromise = db.ref('storeConfig').once('value');
    const productsPromise = db.ref('products').once('value');

    Promise.all([configPromise, productsPromise]).then(([configSnap, prodsSnap]) => {
        storeConfig = configSnap.val() || {};
        const pObj = prodsSnap.val() || [];
        products = Array.isArray(pObj) ? pObj : Object.values(pObj);

                applyTabsVisibility();
        const openPollaBtn = document.getElementById('open-polla-btn');
        if (openPollaBtn) openPollaBtn.style.display = (storeConfig.pollaEnabled === false || (storeConfig.disabledTabs && storeConfig.disabledTabs.includes('polla'))) ? 'none' : '';

        if (publicSellerRef) {
            db.ref(`sellerStores/${publicSellerRef}`).once('value').then(sp => {
                const resellerData = sp.val();
                if (resellerData) {
                    publicSellerStoreData = resellerData;
                    isSellerMode = false;
                }
                runInit();
            }).catch(() => runInit());
        } else {
            runInit();
        }
    }).catch(err => {
        console.error('Error cargando datos iniciales:', err);
        hideLoader();
    });
};

loadInitialData();

// PASO 2: En vivo — solo escuchar cambios de storeConfig y products (NO toda la DB)
db.ref('storeConfig').on('value', (snap) => {
    storeConfig = snap.val() || {};
    applyTabsVisibility();
    if (!window.appInitialized) return;
    setupConfigUI();
    const activeTabBtn = document.querySelector('.tab-btn.active');
    if (activeTabBtn) renderProducts(activeTabBtn.dataset.tab);
    updateCartUI();
});

db.ref('products').on('value', (snap) => {
    if (!window.appInitialized) return;
    const pObj = snap.val() || [];
    products = Array.isArray(pObj) ? pObj : Object.values(pObj);
    const activeTabBtn = document.querySelector('.tab-btn.active');
    if (activeTabBtn) renderProducts(activeTabBtn.dataset.tab);
});


// =====================================================
// PREMIO NAVIDEÑO - STREAMING DPC
// =====================================================
const NAV_PROMO_CONFIG = {
    // Rango de redención: 25 Dic 2026 08:00 AM a 31 Dic 2026 11:59:59 PM (UTC-5)
    startDate: new Date("2026-12-25T08:00:00-05:00").getTime(),
    endDate: new Date("2026-12-31T23:59:59-05:00").getTime(),
    premios: {
        admin_client: {
            1: "Netflix + Crunchyroll + ViX",
            2: "Crunchyroll + ViX",
            3: "ViX"
        },
        reseller: {
            1: "Netflix + Crunchyroll + ViX",
            2: "Crunchyroll + ViX",
            3: "ViX"
        },
        reseller_client: {
            1: "Crunchyroll + ViX",
            2: "Crunchyroll",
            3: "ViX"
        }
    }
};

let _cachedNavRankings = null;
let _cachedNavTimestamp = 0;
let _navTimerInterval = null;

function pickCleanestClientName(existingName, newName) {
    if (!existingName) return newName || 'Cliente';
    if (!newName) return existingName;
    const n1 = existingName.trim();
    const n2 = newName.trim();
    if (n1.toLowerCase() === 'cliente' || n1.toLowerCase() === 'sin nombre') return n2;
    if (n2.toLowerCase() === 'cliente' || n2.toLowerCase() === 'sin nombre') return n1;
    const hasLeadingNum1 = /^\d+[\s\-_.]/.test(n1);
    const hasLeadingNum2 = /^\d+[\s\-_.]/.test(n2);
    if (hasLeadingNum1 && !hasLeadingNum2) return n2;
    if (!hasLeadingNum1 && hasLeadingNum2) return n1;
    const hasTrailingNum1 = /[\s\-_.]\d+$/.test(n1);
    const hasTrailingNum2 = /[\s\-_.]\d+$/.test(n2);
    if (hasTrailingNum1 && !hasTrailingNum2) return n2;
    if (!hasTrailingNum1 && hasTrailingNum2) return n1;
    return n2.length > n1.length ? n2 : n1;
}

async function loadNavRankings() {
    if (_cachedNavRankings && (Date.now() - _cachedNavTimestamp < 90000)) {
        return _cachedNavRankings;
    }

    let cSnap = null;
    let sSnap = null;
    try { cSnap = await db.ref('clientSales').once('value'); } catch (e) { console.warn('clientSales read warn', e); }
    try { sSnap = await db.ref('sellerSales').once('value'); } catch (e) { console.warn('sellerSales read warn', e); }

    const clientSales = (cSnap && cSnap.val()) || {};
    const sellerSales = (sSnap && sSnap.val()) || {};

    const adminClients = {};
    const sellers = {};
    const sellerClients = {};
    const currentYear = new Date().getFullYear();
    const processedSignatures = new Set();

    function processSale(s, defaultSeller) {
        if (!s || s.isPaid === false) return;
        const cleanPhone = String(s.clientPhone || '').replace(/\D/g, '').replace(/^57/, '');
        const sId = s.id || s._saleId || '';
        const sProfile = (s.items && s.items[0] && (s.items[0].profile || s.items[0].email)) || s.email || '';
        const sig = sId ? (sId + '_' + cleanPhone) : ((s.fechaCompraOriginal || s.date || 0) + '_' + cleanPhone + '_' + sProfile);
        if (sig && !sig.startsWith('0_') && processedSignatures.has(sig)) return;
        if (sig && !sig.startsWith('0_')) processedSignatures.add(sig);

        const startMs = Number(s.fechaCompraOriginal || s.date || 0);
        const expMs = Number(s.expirationDate || 0);
        const startYear = startMs ? new Date(startMs).getFullYear() : 0;
        const expYear = expMs ? new Date(expMs).getFullYear() : 0;
        if (startYear !== currentYear && expYear !== currentYear) return;

        const sName = (s.sellerName || s.seller || defaultSeller || '').trim();
        const isAdmin = !sName || sName === 'Página Web Oficial' || sName.toLowerCase().includes('admin') || sName.toLowerCase().includes('oficial');

        let cName = (s.clientName || '').trim();
        if (!cName || cName.toLowerCase() === 'cliente') {
            cName = cleanPhone ? `Cliente (${cleanPhone.slice(-4)})` : 'Cliente';
        }

        let rawItems = Array.isArray(s.items) ? s.items : Object.values(s.items || {});
        const seenItemSigs = new Set();
        const items = [];
        rawItems.forEach(it => {
            if (!it) return;
            const itPlat = (it.name || '').trim().toLowerCase();
            const itEmail = (it.email || it.correo || (it.specificEmails && it.specificEmails[0] && it.specificEmails[0].email) || '').trim().toLowerCase();
            const itProf = (it.profile || (it.specificEmails && it.specificEmails[0] && it.specificEmails[0].profile) || '').trim().toLowerCase();
            const itSig = `${itPlat}_${itEmail}_${itProf}`;
            if (seenItemSigs.has(itSig) && itSig !== '__') return;
            seenItemSigs.add(itSig);
            items.push(it);
        });
        // Calcular meses de la suscripción (por meses configurados o por diferencia de fechas acumuladas)
        let monthsCount = 1;
        if (s.months && !isNaN(Number(s.months)) && Number(s.months) >= 1) {
            monthsCount = Math.min(12, Math.round(Number(s.months)));
        } else {
            const startMs = Number(s.fechaCompraOriginal || s.date || 0);
            const expMs = Number(s.expirationDate || 0);
            if (startMs > 0 && expMs > startMs) {
                const diffDays = Math.round((expMs - startMs) / 86400000);
                if (diffDays >= 45) {
                    monthsCount = Math.min(12, Math.max(1, Math.round(diffDays / 30)));
                }
            }
        }
        const screens = Math.max(1, items.length) * monthsCount;

        if (isAdmin) {
            const key = (cleanPhone && cleanPhone.length >= 7) ? cleanPhone : (cName.toLowerCase() || 'cliente');
            if (!adminClients[key]) {
                adminClients[key] = { id: key, name: cName, phone: cleanPhone, screens: 0, purchases: 0 };
            } else {
                adminClients[key].name = pickCleanestClientName(adminClients[key].name, cName);
            }
            adminClients[key].screens += screens;
            adminClients[key].purchases += 1;
        } else {
            // Seller
            if (!sellers[sName]) {
                sellers[sName] = { id: sName, name: sName, phone: s.sellerPhone || '', screens: 0, sales: 0 };
            }
            sellers[sName].screens += screens;
            sellers[sName].sales += 1;

            // Seller client (Agrupados por teléfono excepto Any, Angie, Katherin)
            const isSharedPhoneSeller = ['any', 'angie', 'katherin', 'katherine', 'katerin'].some(ex => sName.toLowerCase().trim().startsWith(ex));
            const scIdent = (!isSharedPhoneSeller && cleanPhone && cleanPhone.length >= 7) ? cleanPhone : (cName.toLowerCase() || cleanPhone || 'cliente');
            const cKey = `${sName}___${scIdent}`;
            if (!sellerClients[cKey]) {
                sellerClients[cKey] = { id: cKey, name: cName, seller: sName, phone: cleanPhone, screens: 0, purchases: 0 };
            } else {
                sellerClients[cKey].name = pickCleanestClientName(sellerClients[cKey].name, cName);
            }
            sellerClients[cKey].screens += screens;
            sellerClients[cKey].purchases += 1;
            if (!sellerClients[cKey].phone && cleanPhone) {
                sellerClients[cKey].phone = cleanPhone;
            }
        }
    }

    Object.keys(clientSales).forEach(phone => {
        const sales = clientSales[phone] || {};
        Object.keys(sales).forEach(id => processSale(sales[id], ''));
    });

    Object.keys(sellerSales).forEach(sName => {
        if (sName === 'Página Web Oficial' || sName.toLowerCase().includes('oficial') || sName.toLowerCase() === 'admin') return;
        const sales = sellerSales[sName] || {};
        Object.keys(sales).forEach(id => processSale(sales[id], sName));
    });

    _cachedNavRankings = {
        admin_client: Object.values(adminClients).sort((a, b) => b.screens - a.screens),
        reseller: Object.values(sellers).sort((a, b) => b.screens - a.screens),
        reseller_client: Object.values(sellerClients).sort((a, b) => b.screens - a.screens)
    };
    _cachedNavTimestamp = Date.now();
    return _cachedNavRankings;
}

function detectNavUserRole(rankings) {
    // 1. Vendedor logueado
    if (isSellerMode && currentSellerName) {
        return {
            role: 'reseller',
            id: currentSellerName,
            name: currentSellerName
        };
    }
    // 2. Cliente logueado por teléfono
    if (clientPhoneLoggedIn) {
        const cleanP = String(clientPhoneLoggedIn).replace(/\D/g, '').replace(/^57/, '');
        const resMatch = (rankings.reseller_client || []).find(c => c.phone === cleanP);
        if (resMatch) {
            return {
                role: 'reseller_client',
                id: resMatch.id,
                name: resMatch.name,
                phone: cleanP
            };
        }
        const admMatch = (rankings.admin_client || []).find(c => c.phone === cleanP);
        return {
            role: 'admin_client',
            id: cleanP,
            name: (admMatch && admMatch.name) || 'Cliente',
            phone: cleanP
        };
    }
    return {
        role: 'guest',
        id: null,
        name: null
    };
}

function formatNavPrizeBadges(prizeText) {
    if (!prizeText) return '';
    return prizeText.split(' + ').map(p => {
        const pClean = p.trim();
        const pLower = pClean.toLowerCase();
        if (pLower.includes('netflix')) {
            return `<span class="promo-badge-netflix"><i class="fa-solid fa-play"></i> ${pClean}</span>`;
        } else if (pLower.includes('crunchy')) {
            return `<span class="promo-badge-crunchy"><i class="fa-solid fa-bolt"></i> ${pClean}</span>`;
        } else if (pLower.includes('vix')) {
            return `<span class="promo-badge-vix"><i class="fa-solid fa-tv"></i> ${pClean}</span>`;
        }
        return `<span style="background:rgba(255,255,255,0.1); color:#fff; padding:3px 8px; border-radius:8px; font-size:0.72rem; font-weight:700;">${pClean}</span>`;
    }).join(' ');
}

function buildNavWhatsAppLink(userName, position, screens, prize, categoryTitle) {
    const adminPhone = (storeConfig.whatsappNumber || '573155182545').replace(/\D/g, '');
    const text = encodeURIComponent(
        `🎄 ¡Hola Streaming DPC! Quiero redimir mis premios navideños 🎁\n\n` +
        `👤 Nombre: ${userName}\n` +
        `🏆 Puesto: #${position} Lugar\n` +
        `🏅 Categoría: ${categoryTitle}\n` +
        `📺 Pantallas acumuladas en 2026: ${screens} pantallas\n` +
        `🎁 Premio ganado: ${prize}\n\n` +
        `¡Muchas gracias por premiar mi fidelidad! 🎉`
    );
    return `https://wa.me/${adminPhone}?text=${text}`;
}

function isCurrentUserAdminForNavTest() {
    try {
        const isLocalAdmin = localStorage.getItem('adminLoggedIn') === 'true';
        const isSellerAdmin = typeof isSellerMode !== 'undefined' && isSellerMode &&
            ['admin', 'administrador', 'administrador (global)', 'tienda principal', 'página web oficial'].includes(String(currentSellerName || '').toLowerCase().trim());
        const urlParams = new URLSearchParams(window.location.search);
        const hasAdminParam = urlParams.get('admin') === 'true' || 
                              urlParams.get('test_admin') === 'true' || 
                              urlParams.get('test_navidad') === 'true' || 
                              urlParams.get('test_promo') === 'true';
        return Boolean(isLocalAdmin || isSellerAdmin || hasAdminParam);
    } catch(e) {
        return false;
    }
}

let navTestConfig = {
    active: false,
    preset: 'reseller_1',
    role: 'reseller',
    position: 1,
    name: 'Vendedor Estrella (Prueba)',
    screens: 220
};

try {
    const saved = localStorage.getItem('nav_test_config');
    if (saved) navTestConfig = Object.assign(navTestConfig, JSON.parse(saved));
} catch(e) {}

// SEGURIDAD: Si no es Administrador, nunca activar modo pruebas de redención
if (!isCurrentUserAdminForNavTest()) {
    navTestConfig.active = false;
}

const NAV_TEST_PRESETS = {
    reseller_1: { role: 'reseller', position: 1, name: 'Vendedor Estrella (Prueba)', screens: 220, catTitle: 'Vendedores' },
    reseller_2: { role: 'reseller', position: 2, name: 'Vendedor Plata (Prueba)', screens: 185, catTitle: 'Vendedores' },
    reseller_3: { role: 'reseller', position: 3, name: 'Vendedor Bronce (Prueba)', screens: 140, catTitle: 'Vendedores' },
    admin_client_1: { role: 'admin_client', position: 1, name: 'Cliente Directo Oro (Prueba)', screens: 48, catTitle: 'Clientes Directos (Admin)' },
    admin_client_2: { role: 'admin_client', position: 2, name: 'Cliente Directo Plata (Prueba)', screens: 34, catTitle: 'Clientes Directos (Admin)' },
    admin_client_3: { role: 'admin_client', position: 3, name: 'Cliente Directo Bronce (Prueba)', screens: 29, catTitle: 'Clientes Directos (Admin)' },
    reseller_client_1: { role: 'reseller_client', position: 1, name: 'Cliente Red Oro (Prueba)', screens: 28, catTitle: 'Clientes de Vendedores' },
    reseller_client_2: { role: 'reseller_client', position: 2, name: 'Cliente Red Plata (Prueba)', screens: 22, catTitle: 'Clientes de Vendedores' },
    reseller_client_3: { role: 'reseller_client', position: 3, name: 'Cliente Red Bronce (Prueba)', screens: 16, catTitle: 'Clientes de Vendedores' }
};

window.toggleNavTestMode = function(isActive) {
    if (!isCurrentUserAdminForNavTest()) {
        alert("🔒 Esta opción es exclusiva para el Administrador.");
        navTestConfig.active = false;
        return;
    }
    navTestConfig.active = isActive;
    localStorage.setItem('nav_test_config', JSON.stringify(navTestConfig));
    if (window.renderPremioNavideno) window.renderPremioNavideno();
};

window.changeNavTestAccount = function(presetKey) {
    const customDiv = document.getElementById('nav-test-custom-inputs');
    if (presetKey === 'custom') {
        if (customDiv) customDiv.style.display = 'flex';
        return;
    }
    if (customDiv) customDiv.style.display = 'none';

    const p = NAV_TEST_PRESETS[presetKey];
    if (p) {
        navTestConfig.preset = presetKey;
        navTestConfig.role = p.role;
        navTestConfig.position = p.position;
        navTestConfig.name = p.name;
        navTestConfig.screens = p.screens;
        localStorage.setItem('nav_test_config', JSON.stringify(navTestConfig));
        if (window.renderPremioNavideno) window.renderPremioNavideno();
    }
};

window.applyCustomNavTest = function() {
    const input = document.getElementById('nav-test-custom-name');
    const posSelect = document.getElementById('nav-test-custom-pos');
    const roleSelect = document.getElementById('nav-test-custom-role');
    const name = input ? input.value.trim() : '';
    if (!name) return alert('Por favor ingresa un nombre para la cuenta de prueba.');
    
    navTestConfig.preset = 'custom';
    navTestConfig.name = name;
    navTestConfig.position = posSelect ? parseInt(posSelect.value) : 1;
    navTestConfig.role = roleSelect ? roleSelect.value : 'admin_client';
    navTestConfig.screens = 55;
    localStorage.setItem('nav_test_config', JSON.stringify(navTestConfig));
    if (window.renderPremioNavideno) window.renderPremioNavideno();
};

function updateNavCountdown() {
    const el = document.getElementById('nav-countdown-timer-val');
    if (!el) return;

    const now = Date.now();
    const isNavAdmin = isCurrentUserAdminForNavTest();
    const isTestMode = isNavAdmin && ((typeof navTestConfig !== 'undefined' && navTestConfig.active) || window.location.href.includes('test_navidad=true') || window.location.href.includes('test_promo=true'));
    const start = NAV_PROMO_CONFIG.startDate;
    const end = NAV_PROMO_CONFIG.endDate;

    if (now < start && !isTestMode) {
        const diff = start - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        el.innerHTML = `<span style="color:#fbbf24;">⏳ Se activa en:</span> <strong>${days}d ${hours}h ${mins}m ${secs}s</strong> (25 Dic, 08:00 AM)`;
    } else if ((now >= start && now <= end) || isTestMode) {
        const diff = end - now;
        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const mins = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        const secs = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));
        el.innerHTML = `<span style="color:#4ade80;">🎁 ¡REDENCIÓN ACTIVA!</span> Tiempo restante: <strong>${days}d ${hours}h ${mins}m ${secs}s</strong>`;
    } else {
        el.innerHTML = `<span style="color:#94a3b8;">🚫 Campaña Navideña 2026 Finalizada</span>`;
    }
}

window.renderPremioNavideno = async function () {
    const container = document.getElementById('premio-navideno-grid');
    if (!container) return;

    container.innerHTML = `
        <div class="promo-nav-container">
            <div style="text-align:center; padding: 40px 10px; color:#cbd5e1;">
                <i class="fa-solid fa-gift fa-spin" style="font-size:2.5rem; color:#ef4444; margin-bottom:12px;"></i>
                <h3 style="color:#fbbf24; margin:0 0 6px 0;">Cargando Podio Navideño 2026...</h3>
                <small style="color:#94a3b8;">Calculando las mayores compras acumuladas del año...</small>
            </div>
        </div>
    `;

    const rankings = await loadNavRankings();
    const currentUser = detectNavUserRole(rankings);

    const now = Date.now();
    const isNavAdmin = isCurrentUserAdminForNavTest();
    if (!isNavAdmin) {
        navTestConfig.active = false;
    }
    const isTestMode = isNavAdmin && ((typeof navTestConfig !== 'undefined' && navTestConfig.active) || window.location.href.includes('test_navidad=true') || window.location.href.includes('test_promo=true'));
    const isWindowOpen = (now >= NAV_PROMO_CONFIG.startDate && now <= NAV_PROMO_CONFIG.endDate) || isTestMode;
    const isBeforeStart = now < NAV_PROMO_CONFIG.startDate && !isTestMode;

    // Categorías a mostrar según el Rol
    let categoriesToDisplay = [];
    if (currentUser.role === 'admin_client') {
        categoriesToDisplay = [{ key: 'admin_client', title: 'Top Clientes Directos (Admin)', icon: 'fa-user-tag' }];
    } else if (currentUser.role === 'reseller') {
        categoriesToDisplay = [
            { key: 'reseller', title: 'Top Vendedores', icon: 'fa-briefcase' },
            { key: 'reseller_client', title: 'Top Clientes de Vendedores', icon: 'fa-users' }
        ];
    } else if (currentUser.role === 'reseller_client') {
        categoriesToDisplay = [{ key: 'reseller_client', title: 'Top Clientes de Vendedores', icon: 'fa-users' }];
    } else {
        // Invitado: vista general de los 3 rankings para motivar el registro
        categoriesToDisplay = [
            { key: 'admin_client', title: 'Clientes Directos (Admin)', icon: 'fa-user-tag' },
            { key: 'reseller', title: 'Vendedores', icon: 'fa-briefcase' },
            { key: 'reseller_client', title: 'Clientes de Vendedores', icon: 'fa-users' }
        ];
    }

    const ruletaConfig = (typeof window.getRuletaConfig === 'function') 
        ? window.getRuletaConfig() 
        : { enabled: true, bannerText: "¿No estás en el podio? ¡Aprovecha y gira la ruleta aquí!", bannerSubtext: "Participa por pantallas de regalo y descuentos exclusivos para clientes fuera del Top 3.", buttonText: "🎰 ¡Girar Ruleta de la Suerte!" };

    let html = `
        <div class="promo-nav-container">
            <div class="promo-nav-header">
                <div class="promo-nav-badge">🎄 Campaña Fin de Año 2026</div>
                <h2 class="promo-nav-title">🏆 Premios Navideños Streaming DPC</h2>
                <p class="promo-nav-desc">
                    Premios otorgados a quienes realizaron <strong>mayores compras en el año</strong>.
                    Podrás redimir tu premio a partir del <strong>25 de diciembre (08:00 AM)</strong> 
                    hasta el <strong>31 de diciembre (11:59 PM)</strong>. 
                    <br><em style="color:#fbbf24;">¡Solo serán premiados los 3 primeros lugares!</em>
                </p>

                <div class="promo-nav-timer-box">
                    <span id="nav-countdown-timer-val" class="promo-nav-timer-val">
                        ⏳ Calculando cuenta regresiva...
                    </span>
                </div>

                <!-- Botón de acceso directo para ir a la Ruleta abajo -->
                ${(ruletaConfig.enabled !== false) ? `
                <div style="margin-top: 2px; margin-bottom: 8px; display: flex; justify-content: center;">
                    <button type="button" onclick="irARuletaPromo()" class="promo-nav-jump-ruleta-btn"
                        style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%); color: #fff; font-size: 0.95rem; font-weight: 800; padding: 10px 26px; border-radius: 50px; border: 2px solid rgba(254, 240, 138, 0.6); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 18px rgba(234, 88, 12, 0.45), 0 0 10px rgba(251, 191, 36, 0.3); transition: all 0.25s ease;">
                        <i class="fa-solid fa-dharmachakra fa-spin" style="--fa-animation-duration: 5s; font-size: 1.1rem; color: #fef08a;"></i>
                        <span>🎰 Ruleta</span>
                        <i class="fa-solid fa-arrow-down" style="font-size: 0.85rem; color: #fef08a;"></i>
                    </button>
                </div>
                ` : ''}
            </div>

${isNavAdmin ? `
            <!-- Barra de Pruebas de Redención (SOLO VISIBLE PARA ADMINISTRADOR) -->
            <div class="promo-nav-test-bar" style="border: 1px dashed rgba(168,85,247,0.7); background: rgba(168,85,247,0.08);">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-flask" style="color:#a855f7; font-size:1.15rem;"></i>
                        <strong style="color:#e2e8f0; font-size:0.9rem;">Pruebas de Redención <span style="font-size:0.75rem; color:#a855f7; border:1px solid #a855f7; padding:1px 6px; border-radius:4px;">Solo Admin</span>:</strong>
                        <label style="display:inline-flex; align-items:center; gap:6px; cursor:pointer; color:#fbbf24; font-size:0.85rem; font-weight:700; background:rgba(251,191,36,0.15); padding:4px 10px; border-radius:6px; border:1px solid rgba(251,191,36,0.3);">
                            <input type="checkbox" id="nav-test-toggle" ${navTestConfig.active ? 'checked' : ''} onchange="toggleNavTestMode(this.checked)">
                            ⚡ Activar Redimir
                        </label>
                    </div>
                    <div id="nav-test-account-controls" style="display:${navTestConfig.active ? 'flex' : 'none'}; align-items:center; gap:8px; flex-wrap:wrap;">
                        <span style="font-size:0.8rem; color:#cbd5e1;"><i class="fa-solid fa-user-gear"></i> Cuenta de Pruebas:</span>
                        <select id="nav-test-account-select" onchange="changeNavTestAccount(this.value)" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:6px; padding:5px 8px; font-size:0.8rem;">
                            <option value="reseller_1" ${navTestConfig.preset === 'reseller_1' ? 'selected' : ''}>👑 Vendedor #1 (Netflix + Crunchyroll + ViX)</option>
                            <option value="reseller_2" ${navTestConfig.preset === 'reseller_2' ? 'selected' : ''}>🥈 Vendedor #2 (Crunchyroll + ViX)</option>
                            <option value="reseller_3" ${navTestConfig.preset === 'reseller_3' ? 'selected' : ''}>🥉 Vendedor #3 (ViX)</option>
                            <option value="admin_client_1" ${navTestConfig.preset === 'admin_client_1' ? 'selected' : ''}>👑 Cliente Admin #1 (Netflix + Crunchyroll + ViX)</option>
                            <option value="admin_client_2" ${navTestConfig.preset === 'admin_client_2' ? 'selected' : ''}>🥈 Cliente Admin #2 (Crunchyroll + ViX)</option>
                            <option value="admin_client_3" ${navTestConfig.preset === 'admin_client_3' ? 'selected' : ''}>🥉 Cliente Admin #3 (ViX)</option>
                            <option value="reseller_client_1" ${navTestConfig.preset === 'reseller_client_1' ? 'selected' : ''}>👑 Cliente Vendedor #1 (Crunchyroll + ViX)</option>
                            <option value="reseller_client_2" ${navTestConfig.preset === 'reseller_client_2' ? 'selected' : ''}>🥈 Cliente Vendedor #2 (Crunchyroll)</option>
                            <option value="reseller_client_3" ${navTestConfig.preset === 'reseller_client_3' ? 'selected' : ''}>🥉 Cliente Vendedor #3 (ViX)</option>
                            <option value="custom" ${navTestConfig.preset === 'custom' ? 'selected' : ''}>✏️ Personalizada (Escribir datos)...</option>
                        </select>
                        <div id="nav-test-custom-inputs" style="display:${navTestConfig.preset === 'custom' ? 'flex' : 'none'}; align-items:center; gap:6px; flex-wrap:wrap;">
                            <input type="text" id="nav-test-custom-name" placeholder="Nombre..." value="${navTestConfig.name || ''}" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:6px; padding:4px 8px; font-size:0.8rem; width:120px;">
                            <select id="nav-test-custom-role" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:6px; padding:4px 6px; font-size:0.8rem;">
                                <option value="admin_client" ${navTestConfig.role === 'admin_client' ? 'selected' : ''}>Cliente Admin</option>
                                <option value="reseller" ${navTestConfig.role === 'reseller' ? 'selected' : ''}>Vendedor</option>
                                <option value="reseller_client" ${navTestConfig.role === 'reseller_client' ? 'selected' : ''}>Cliente Vendedor</option>
                            </select>
                            <select id="nav-test-custom-pos" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:6px; padding:4px 6px; font-size:0.8rem;">
                                <option value="1" ${navTestConfig.position === 1 ? 'selected' : ''}>#1 Puesto</option>
                                <option value="2" ${navTestConfig.position === 2 ? 'selected' : ''}>#2 Puesto</option>
                                <option value="3" ${navTestConfig.position === 3 ? 'selected' : ''}>#3 Puesto</option>
                            </select>
                            <button onclick="applyCustomNavTest()" style="background:#22c55e; color:#fff; border:none; border-radius:6px; padding:4px 10px; font-size:0.8rem; cursor:pointer; font-weight:700;">Aplicar</button>
                        </div>
                    </div>
                </div>
            </div>` : ''}
    `;

    // Si Modo Pruebas está activo Y es Admin: mostrar tarjeta de redención de prueba directa
    if (isNavAdmin && navTestConfig.active) {
        const testRole = navTestConfig.role || 'reseller';
        const testPos = navTestConfig.position || 1;
        const testName = navTestConfig.name || 'Usuario de Pruebas';
        const testScreens = navTestConfig.screens || 50;
        const testPrizesList = NAV_PROMO_CONFIG.premios[testRole] || NAV_PROMO_CONFIG.premios['reseller'];
        const testPrize = testPrizesList[testPos] || 'Premio de Prueba';
        const testMedal = testPos === 1 ? '🥇' : (testPos === 2 ? '🥈' : '🥉');
        const catTitle = testRole === 'reseller' ? 'Vendedores' : (testRole === 'admin_client' ? 'Clientes Directos (Admin)' : 'Clientes de Vendedores');
        const testWaLink = buildNavWhatsAppLink(testName, testPos, testScreens, testPrize, catTitle);

        html += `
            <div class="promo-nav-test-card">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; text-transform:uppercase; font-weight:800; color:#4ade80; margin-bottom:4px;">
                            <i class="fa-solid fa-circle-check"></i> CUENTA DE PRUEBA LISTA PARA REDIMIR (${catTitle})
                        </div>
                        <h3 style="margin:0; font-size:1.25rem; color:#fff;">
                            ${testMedal} #${testPos} Lugar: <span style="color:#fbbf24;">${testName}</span>
                        </h3>
                        <div style="color:#cbd5e1; font-size:0.85rem; margin-top:4px;">
                            📺 <strong>${testScreens}</strong> pantallas de prueba | Premio: <span style="color:#4ade80; font-weight:700;">${testPrize}</span>
                        </div>
                        <div style="margin-top:6px;">
                            ${formatNavPrizeBadges(testPrize)}
                        </div>
                    </div>
                    <div>
                        <a href="${testWaLink}" target="_blank" class="promo-nav-btn active" style="font-size:0.95rem; padding:12px 20px; display:inline-flex; align-items:center; gap:8px;">
                            <i class="fa-brands fa-whatsapp" style="font-size:1.3rem;"></i> 🎁 Reclamar Mis Premios Navideños
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Si no ha iniciado sesión, mostrar banner informativo
    if (currentUser.role === 'guest' && !navTestConfig.active) {
        html += `
            <div class="promo-nav-login-prompt">
                <h4 style="margin:0 0 6px 0; color:#fbbf24; font-size:1.1rem;">
                    <i class="fa-solid fa-lock"></i> ¿Quieres saber tu posición o redimir tu premio?
                </h4>
                <p style="margin:0 0 14px 0; color:#cbd5e1; font-size:0.85rem;">
                    Inicia sesión con tu número de celular o como vendedor para verificar tu posición exacta en el ranking y reclamar tu premio si quedas en el podio.
                </p>
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <button onclick="document.getElementById('open-client-btn')?.click();" class="promo-nav-btn active" style="width:auto; padding:8px 18px;">
                        <i class="fa-solid fa-address-card"></i> Iniciar Sesión Cliente (Mis Compras)
                    </button>
                    <button onclick="document.getElementById('open-vendedores-btn')?.click();" class="promo-nav-btn" style="width:auto; padding:8px 18px; background:rgba(138,43,226,0.3); border:1px solid #c48dfc; color:#fff;">
                        <i class="fa-solid fa-user-tie"></i> Iniciar Sesión Vendedor
                    </button>
                </div>
            </div>
        `;
    }

    // Renderizar categorías
    categoriesToDisplay.forEach(cat => {
        const data = (rankings[cat.key] || []).slice(0, 3);
        const prizeList = NAV_PROMO_CONFIG.premios[cat.key] || {};

        html += `
            <div style="margin-top:28px;">
                <div style="display:flex; align-items:center; gap:8px; border-bottom:1px solid rgba(251,191,36,0.3); padding-bottom:8px; margin-bottom:16px;">
                    <i class="fa-solid ${cat.icon}" style="color:#fbbf24; font-size:1.2rem;"></i>
                    <h3 style="margin:0; font-size:1.25rem; color:#fff;">${cat.title}</h3>
                </div>

                <!-- Tarjetas del Podio Top 3 -->
                <div class="promo-nav-podium-grid">
        `;

        // Llenar al menos 3 puestos si no hay suficientes
        for (let pos = 1; pos <= 3; pos++) {
            const item = data[pos - 1] || { name: 'Por definir...', screens: 0, phone: '' };
            const prize = prizeList[pos] || 'Premio Sorpresa';
            const medal = pos === 1 ? '🥇' : (pos === 2 ? '🥈' : '🥉');
            const posClass = `rank-${pos}`;

            // Verificar si el usuario actual es ganador de este puesto
            let isWinner = false;
            if (currentUser.role === 'admin_client' && cat.key === 'admin_client') {
                isWinner = (item.phone && currentUser.phone && item.phone === currentUser.phone) || (item.name.toLowerCase() === (currentUser.name || '').toLowerCase());
            } else if (currentUser.role === 'reseller' && cat.key === 'reseller') {
                isWinner = (item.name.toLowerCase() === (currentUser.name || '').toLowerCase());
            } else if (currentUser.role === 'reseller_client' && cat.key === 'reseller_client') {
                isWinner = (item.phone && currentUser.phone && item.phone === currentUser.phone) || (item.name.toLowerCase() === (currentUser.name || '').toLowerCase());
            }

            if (isTestMode) isWinner = true;

            let actionBtn = '';
            if (isWindowOpen && isWinner) {
                const link = buildNavWhatsAppLink(item.name, pos, item.screens, prize, cat.title);
                actionBtn = `<a href="${link}" target="_blank" class="promo-nav-btn active">🎁 ¡Reclamar Premio!</a>`;
            } else if (isBeforeStart && isWinner) {
                actionBtn = `<button class="promo-nav-btn locked" title="Se activa el 25 Dic a las 8:00 AM">🔒 Disponible 25 Dic (08:00 AM)</button>`;
            } else if (!isWindowOpen && isWinner) {
                actionBtn = `<button class="promo-nav-btn locked">🚫 Finalizada</button>`;
            } else {
                actionBtn = `<button class="promo-nav-btn other" disabled>Solo Ganador</button>`;
            }

            html += `
                <div class="promo-nav-card ${posClass}">
                    <div class="promo-nav-card-medal">${medal}</div>
                    <div class="promo-nav-card-pos">#${pos} Lugar</div>
                    <div class="promo-nav-card-name">${item.name}</div>
                    <div class="promo-nav-card-screens">
                        <strong>${item.screens}</strong> pantallas acumuladas en 2026
                    </div>
                    <div class="promo-nav-prizes-box">
                        ${formatNavPrizeBadges(prize)}
                    </div>
                    ${actionBtn}
                </div>
            `;
        }

        html += `
                </div>
        `;

        // Puestos adicionales:
        // Si es Vendedores ('reseller') -> TODOS los demás vendedores en competencia
        // Si es Clientes ('admin_client' o 'reseller_client') -> 7 clientes más (hasta el puesto 10)
        const fullCatList = rankings[cat.key] || [];
        let runnersUp = [];
        if (cat.key === 'reseller') {
            runnersUp = fullCatList.slice(3); // Todos los demás
        } else {
            runnersUp = fullCatList.slice(3, 10); // 7 clientes más (puestos 4 al 10)
        }

        if (runnersUp.length > 0) {
            const thirdScreens = data[2] ? (data[2].screens || 0) : 0;
            const titleText = cat.key === 'reseller' 
                ? '🔥 Todos los Vendedores en Competencia' 
                : '🚀 Clientes Cerca del Podio Navideño';
            const subtitleText = cat.key === 'reseller'
                ? `Mostrando todos los <strong>${runnersUp.length}</strong> vendedores que buscan alcanzar el Top 3`
                : `Mostrando los siguientes <strong>${runnersUp.length}</strong> clientes con mayores compras`;

            html += `
                <div class="promo-nav-runners-box">
                    <div class="promo-nav-runners-header">
                        <h4>
                            <i class="fa-solid fa-trophy" style="color:#fbbf24;"></i> ${titleText}
                        </h4>
                        <small style="color:#94a3b8;">${subtitleText}</small>
                    </div>
                    <div class="promo-nav-runners-table-wrap">
                        <table class="promo-nav-runners-table">
                            <thead>
                                <tr>
                                    <th style="width:70px; text-align:center;">Puesto</th>
                                    <th>Nombre</th>
                                    ${cat.key === 'reseller_client' ? '<th>Vendedor</th>' : ''}
                                    <th style="text-align:center;">Pantallas 2026</th>
                                    <th>Distancia al Podio</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            runnersUp.forEach((item, rIdx) => {
                const pos = rIdx + 4;
                let isMe = false;
                if (currentUser.role === 'reseller' && cat.key === 'reseller') {
                    isMe = (item.name.toLowerCase() === (currentUser.name || '').toLowerCase());
                } else if ((currentUser.role === 'admin_client' || currentUser.role === 'reseller_client') && item.phone && currentUser.phone) {
                    isMe = (item.phone === currentUser.phone);
                }

                let diffText = '';
                if (thirdScreens > 0) {
                    const needed = Math.max(1, thirdScreens - (item.screens || 0) + 1);
                    diffText = `<span class="promo-nav-dist-pill"><i class="fa-solid fa-arrow-trend-up"></i> A <strong>${needed}</strong> pant. del 3er puesto</span>`;
                } else {
                    diffText = `<span class="promo-nav-dist-pill" style="border-color:#22c55e; color:#4ade80;">¡Suma ventas para liderar!</span>`;
                }

                html += `
                    <tr class="${isMe ? 'my-row' : ''}">
                        <td style="text-align:center;">
                            <span class="promo-nav-pos-badge">#${pos}</span>
                        </td>
                        <td>
                            <strong style="color:${isMe ? '#fbbf24' : '#fff'};">${item.name}</strong>
                            ${isMe ? '<span style="background:#fbbf24; color:#0f172a; font-size:0.68rem; font-weight:800; padding:2px 6px; border-radius:4px; margin-left:6px;">TÚ</span>' : ''}
                        </td>
                        ${cat.key === 'reseller_client' ? `<td style="color:#38bdf8; font-size:0.82rem;">${item.seller || 'Red'}</td>` : ''}
                        <td style="text-align:center; font-weight:700; color:#38bdf8;">
                            📺 ${item.screens}
                        </td>
                        <td>${diffText}</td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        html += `
            </div>
        `;
    });


    // =========================================================================
    // BANNER PROMOCIONAL DE LA RULETA DE LA SUERTE
    // =========================================================================

    if (ruletaConfig.enabled !== false) {
        html += `
            <div id="ruleta-promo-banner-section" class="ruleta-promo-banner">
                <div class="ruleta-banner-badge">
                    <i class="fa-solid fa-gift"></i> Beneficio Exclusivo Clientes Fuera del Top 3
                </div>
                <h3 class="ruleta-banner-title">
                    🎰 ${ruletaConfig.bannerText || '¿No estás en el podio? ¡Aprovecha y gira la ruleta aquí!'}
                </h3>
                <p class="ruleta-banner-desc">
                    ${ruletaConfig.bannerSubtext || 'Participa por pantallas de regalo y descuentos exclusivos para clientes fuera del Top 3. ¡Tienes hasta 3 intentos por día!'}
                </p>
                <div>
                    <button class="ruleta-banner-btn" onclick="openRuletaModal()">
                        <i class="fa-solid fa-dharmachakra fa-spin" style="--fa-animation-duration: 6s;"></i>
                        <span>${ruletaConfig.buttonText || '🎰 ¡Girar Ruleta de la Suerte!'}</span>
                    </button>
                </div>
                <div style="margin-top: 10px; font-size: 0.78rem; color: #94a3b8;">
                    <i class="fa-solid fa-circle-info" style="color: #fbbf24;"></i> Los 3 primeros lugares del podio tienen sus grandes premios mayores garantizados.
                </div>
            </div>
        `;
    }

    html += `</div>`;
    container.innerHTML = html;

    // Iniciar cuenta regresiva en vivo
    if (_navTimerInterval) clearInterval(_navTimerInterval);
    updateNavCountdown();
    _navTimerInterval = setInterval(updateNavCountdown, 1000);
};


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
