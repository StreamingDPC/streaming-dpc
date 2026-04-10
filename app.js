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

function init() {
    renderProducts('individual');
    setupEventListeners();
    setupConfigUI();
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
    if (paymentMethodsContainer) {
        let methodsHtml = '';
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
        paymentMethodsContainer.innerHTML = methodsHtml;
        const section = paymentMethodsContainer.closest('.payment-methods');
        if (section) section.style.display = methodsHtml ? 'block' : 'none';
    }

    // Dynamic Tab Order
    if (storeConfig.tabOrder && Array.isArray(storeConfig.tabOrder)) {
        const tabsContainer = document.querySelector('.tabs');
        if (tabsContainer) {
            const tabsArray = Array.from(tabsContainer.querySelectorAll('.tab-btn'));
            tabsArray.sort((a, b) => {
                const idxA = storeConfig.tabOrder.indexOf(a.dataset.tab);
                const idxB = storeConfig.tabOrder.indexOf(b.dataset.tab);
                if (idxA === -1 && idxB === -1) return 0;
                if (idxA === -1) return 1;
                if (idxB === -1) return -1;
                return idxA - idxB;
            });
            tabsArray.forEach(tab => tabsContainer.appendChild(tab));
        }
    }

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
        openVendedoresBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span class="hide-mobile">👋 Hola, ${currentSellerName}</span>`;
        openVendedoresBtn.style.background = '#27ae60';
        openVendedoresBtn.style.color = 'white';
        openVendedoresBtn.style.borderColor = '#2ecc71';

        // Hide "Mis Compras" button for sellers
        if (openClientBtn) openClientBtn.style.display = 'none';
    }

    if (publicSellerRef) {
        openVendedoresBtn.style.display = 'none';
        if (openClientBtn) openClientBtn.style.display = 'none';
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
            <span class="brand-badge">${product.brand}</span>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc" style="margin-bottom: 0.5rem">${product.desc || 'Pantalla original premium con garantía.'}</p>
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

    // Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
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

                        Object.values(uniqueClients).sort((a,b) => a.name.localeCompare(b.name)).forEach(c => {
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
        codeModal.style.display = 'none';
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
            }
        });
    }

    closeSellerBtn.addEventListener('click', () => {
        sellerModal.style.display = 'none';
    });

    if (closeSellerDashBtn) {
        closeSellerDashBtn.addEventListener('click', () => {
            sellerDashboardModal.style.display = 'none';
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
                localStorage.removeItem('isSellerMode');
                localStorage.removeItem('sellerName');
                window.location.reload();
            }
        });
    }

    if (sendReminderWhatsappBtn) {
        sendReminderWhatsappBtn.addEventListener('click', () => {
            const saleId = remindSaleIdInput.value;
            const newPhone = remindPhoneInput.value.replace(/\D/g, '');
            const rawMsg = remindMsgInput.value;

            if (saleId && newPhone && isSellerMode) {
                // Update specific phone field in Firebase for this sale if changed
                db.ref(`sellerSales/${currentSellerName}/${saleId}/clientPhone`).set(newPhone);
            }

            const phoneSegment = newPhone.length > 8 ? newPhone : '';
            const encoded = encodeURIComponent(rawMsg);

            if (phoneSegment) {
                window.open(`https://wa.me/${formatWaPhone(phoneSegment)}?text=${encoded}`, '_blank');
            } else {
                window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
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
            const phone = document.getElementById('client-login-phone').value.replace(/\D/g, '');
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
            } catch (err) {
                alert('Error al validar tu número');
                console.error(err);
            }
        });
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
            clientLoginModal.style.display = 'none';
            renderClientDashboard();
            clientDashboardModal.style.display = 'block';
        });
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
            localStorage.removeItem('clientPhone');
            clientPhoneLoggedIn = '';
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
        if (e.target === codeModal) codeModal.style.display = 'none';
        if (e.target === sellerModal) sellerModal.style.display = 'none';
        if (sellerDashboardModal && e.target === sellerDashboardModal) sellerDashboardModal.style.display = 'none';
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
            const wpp = storeWhatsappInput.value.replace(/\D/g, '');
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

    // Code Fetch Logic (To be connected to Backend later)
    fetchCodeBtn.addEventListener('click', async () => {
        const email = document.getElementById('code-email').value.trim();
        const platform = document.getElementById('code-platform').value;

        if (!email) return alert('Por favor ingresa el correo de tu cuenta.');

        // 1. Mostrar estado de carga y ocultar error/resultado
        document.getElementById('code-loading').style.display = 'block';
        document.getElementById('code-result').style.display = 'none';
        document.getElementById('code-error').style.display = 'none';
        fetchCodeBtn.style.display = 'none';

        try {
            // El backend está corriendo en la nube (Render)
            const serverUrl = "https://streaming-backend-ce1u.onrender.com/api/get-code";

            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, platform })
            });

            const data = await response.json();

            if (data.success && data.code) {
                document.getElementById('code-loading').style.display = 'none';
                document.getElementById('code-result').style.display = 'block';
                document.getElementById('the-magic-code').innerText = data.code;
            } else {
                // Caso Error / No encontrado
                document.getElementById('code-loading').style.display = 'none';
                document.getElementById('code-error').style.display = 'block';
                document.getElementById('error-msg').innerText = data.error || "Código no encontrado para este correo.";
            }
        } catch (err) {
            document.getElementById('code-loading').style.display = 'none';
            document.getElementById('code-error').style.display = 'block';
            document.getElementById('error-msg').innerText = "Oops, hubo un error de conexión con el servidor de correos.";
        } finally {
            fetchCodeBtn.style.display = 'block';
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('Tu carrito está vacío');

        let isRecurrent = document.getElementById('recurrent-client').checked;
        let isRenewal = document.getElementById('is-renewal').checked;
        let cName = "";
        let cCity = "";
        let cPhone = "";
        let cDevices = [];

        cName = document.getElementById('client-name').value.trim();
        cCity = document.getElementById('client-city').value.trim();
        cPhone = document.getElementById('client-phone').value.trim();
        const checkedDev = document.querySelectorAll('#client-devices input[type="checkbox"]:checked');
        checkedDev.forEach(c => cDevices.push(c.value));

        if (!cName) {
            return alert('Por favor, indica el nombre del cliente.');
        }

        const cleanPhone = cPhone ? cPhone.replace(/\D/g, '') : '';
        if (!cleanPhone || cleanPhone.length < 5) {
            return alert('Por favor, indica un número de celular válido para registrar la compra.');
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

        // Guardar venta en base de datos (Detalle 1: Ahora registra siempre aunque sea cliente recurrente)
            let incentiveEarned = 0;
            let incentiveDetails = [];

            console.log("Checking incentives... Enabled:", storeConfig.incentiveEnabled);
            if (storeConfig.incentiveEnabled) {
                stats.processedCart.forEach(item => {
                    const cat = (item.category || '').toLowerCase();
                    console.log("Analyzing item for incentive:", item.name, "Category:", cat);
                    if (cat.includes('individual') || cat.includes('ventas_extras')) {
                        let b = 0; let name = '';
                        // Usar tanto el brand como el name, por si el admin llenó mal el brand al añadir el producto.
                        const matchStr = ((item.brand || '') + ' ' + (item.name || '')).toLowerCase();
                        console.log("Match string:", matchStr);

                        if (matchStr.includes('privada')) { b = parseInt(storeConfig.incentiveNetflixPrivada) || 0; name = 'Netflix Privada'; }
                        else if (matchStr.includes('netflix')) { b = parseInt(storeConfig.incentiveNetflix) || 0; name = 'Netflix'; }
                        else if (matchStr.includes('disney')) { b = parseInt(storeConfig.incentiveDisney) || 0; name = 'Disney+'; }
                        else if (matchStr.includes('max') || matchStr.includes('hbo')) { b = parseInt(storeConfig.incentiveMax) || 0; name = 'HBO Max'; }
                        else if (matchStr.includes('prime')) { b = parseInt(storeConfig.incentivePrime) || 0; name = 'Prime Video'; }
                        else if (matchStr.includes('paramount')) { b = parseInt(storeConfig.incentiveParamount) || 0; name = 'Paramount+'; }
                        else if (matchStr.includes('vix')) { b = parseInt(storeConfig.incentiveVix) || 0; name = 'Vix'; }
                        else if (matchStr.includes('iptv')) { b = parseInt(storeConfig.incentiveIptv) || 0; name = 'IPTV'; }
                        else if (matchStr.includes('crunchyroll')) { b = parseInt(storeConfig.incentiveCrunchyroll) || 0; name = 'Crunchyroll'; }
                        else if (matchStr.includes('apple')) { b = parseInt(storeConfig.incentiveApple) || 0; name = 'Apple TV'; }

                        console.log("Found bonus:", b, "for name:", name);
                        if (b > 0) {
                            incentiveEarned += b;
                            incentiveDetails.push(`${name} (+$${b})`);
                        }
                    }
                    else if (cat.includes('combo2')) { const b = parseInt(storeConfig.incentiveCombo2) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Combo 2 P. (+$${b})`); console.log("Combo 2 bonus:", b); }
                    else if (cat.includes('combo3')) { const b = parseInt(storeConfig.incentiveCombo3) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Combo 3 P. (+$${b})`); console.log("Combo 3 bonus:", b); }
                    else if (cat.includes('combo4')) { const b = parseInt(storeConfig.incentiveCombo4) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Combo 4 P. (+$${b})`); console.log("Combo 4 bonus:", b); }
                    else if (cat.includes('combo5')) { const b = parseInt(storeConfig.incentiveCombo5) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Combo 5+ P. (+$${b})`); console.log("Combo 5 bonus:", b); }
                    else if (cat.includes('promocion') || cat.includes('promo')) { 
                        if (cat.includes('finde')) { const b = parseInt(storeConfig.incentiveFinde) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Promo Finde (+$${b})`); console.log("Promo Finde bonus:", b); }
                        else { const b = parseInt(storeConfig.incentiveMes) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Promo Mes (+$${b})`); console.log("Promo Mes bonus:", b); }
                    }
                });
            }
            console.log("Total incentive earned:", incentiveEarned, "Details:", incentiveDetails);
            
            if (isSellerMode && incentiveEarned > 0) {
                alert(`💰 Bono ganado en esta venta: $${incentiveEarned}\n(${incentiveDetails.join(', ')})`);
            } else if (isSellerMode) {
                alert(`⚠️ Atención: Esta venta NO acumuló bono (verifica categorías o marcas en los productos).`);
            }

            const saleData = {
                clientName: cName || '',
                clientCity: cCity || '',
                clientPhone: cPhone || '',
                date: Date.now(),
                expirationDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // +30 days
                items: stats.processedCart.map(item => ({ 
                    id: item.id || Date.now(), 
                    name: item.customName ? `${item.name} (${item.customName})` : (item.name || 'Pantalla'), 
                    customName: item.customName || null,
                    category: item.category || 'individual', 
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

            // Always save to client historical indexed by their clean phone
            const cleanPhoneTracking = cPhone ? cPhone.replace(/\D/g, '') : '';
            
            if (window.renewalSaleId) {
                // UPDATE EL MISMO REGISTRO, NO GENERAR UNO NUEVO
                if (window.renewalSource === 'seller') {
                    if (isSellerMode || publicSellerRef || extrasOriginalOwner) {
                        db.ref(`sellerSales/${finalSellerDestination}/${window.renewalSaleId}`).set(saleData);
                    }
                    if (cleanPhoneTracking && cleanPhoneTracking.length > 5) {
                        db.ref(`clientSales/${cleanPhoneTracking}`).push(saleData);
                    }
                } else if (window.renewalSource === 'client') {
                    if (cleanPhoneTracking && cleanPhoneTracking.length > 5) {
                        db.ref(`clientSales/${cleanPhoneTracking}/${window.renewalSaleId}`).set(saleData);
                    }
                    // Si el cliente renueva, para que el admin lo vea en su lista, usualmente lo notifica por whatsapp. 
                    // No crearemos un registro nuevo global para evitar el duplicado pedido expresamente.
                }

                window.renewalSaleId = null;
                window.renewalSource = null;
            } else {
                // NUEVA VENTA
                // For admin or direct purchases when no seller is attached, track under 'Página Web Oficial'
                if (!isSellerMode && !publicSellerRef && !extrasOriginalOwner) {
                    db.ref(`sellerSales/Página Web Oficial`).push(saleData);
                } else if (isSellerMode || publicSellerRef || extrasOriginalOwner) {
                    db.ref(`sellerSales/${finalSellerDestination}`).push(saleData);
                }

                if (cleanPhoneTracking && cleanPhoneTracking.length > 5) {
                    db.ref(`clientSales/${cleanPhoneTracking}`).push(saleData);
                    db.ref(`clientProfiles/${cleanPhoneTracking}`).update({
                        name: cName || 'Cliente'
                    });
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

            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/${formatWaPhone(checkoutWhatsappNumber)}?text=${encoded}`, '_blank');

            // Vaciar el carrito y cerrar
            cart = [];
            updateCartUI();
            if (cartModal) cartModal.style.display = 'none';
            
            setTimeout(() => window.location.reload(), 2000);
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

function renderSellerDashboard() {
    if (!sellerSalesList) return;
    sellerSalesList.innerHTML = '<p style="text-align:center; color:#ccc;">Cargando tus ventas...</p>';

    db.ref(`sellerSales/${currentSellerName}`).once('value').then(snap => {
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
                                <div><i class="fa-solid fa-check" style="color:#4cd137"></i> Disney+: <b>$${parseInt(storeConfig.incentiveDisney) || 0}</b></div>
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
            const expEndOfDay = new Date(sale.expirationDate).setHours(23, 59, 59, 999) + 86400000;
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

        // Render Expired Section (Folder)
        if (expiredSales.length > 0) {
            const folderWrapper = document.createElement('details');
            folderWrapper.style.cssText = 'margin-top: 1.5rem; background: rgba(255, 77, 77, 0.05); border: 1px solid rgba(255, 77, 77, 0.1); border-radius: 12px; padding: 0.5rem;';
            
            const summary = document.createElement('summary');
            summary.style.cssText = 'color: #ff4d4d; font-weight: bold; cursor: pointer; padding: 0.5rem; outline: none; list-style: none; display: flex; align-items: center; justify-content: space-between;';
            summary.innerHTML = `
                <span><i class="fa-solid fa-folder-open" style="margin-right: 8px;"></i> VENTAS VENCIDAS (HISTORIAL)</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem;"></i>
            `;
            folderWrapper.appendChild(summary);

            const folderContent = document.createElement('div');
            folderContent.style.marginTop = '1rem';
            expiredSales.forEach(sale => renderSellerSaleCard(sale, true, folderContent));
            folderWrapper.appendChild(folderContent);

            sellerSalesList.appendChild(folderWrapper);
        }
    });
}

function renderSellerSaleCard(sale, isExpired, container) {
    const now = Date.now();
    const expEndOfDay = new Date(sale.expirationDate).setHours(23, 59, 59, 999) + 86400000;
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
    if (!isExpired) {
        buttonsHtml = `
            <div style="display:flex; gap: 0.5rem; flex-wrap:wrap;">
                <button onclick="renewFromDash('${safeDecode(sale.clientName)}', '${sale.clientPhone}', '${sale.clientCity}', '${encodeURIComponent(JSON.stringify(sale.items || []))}', '${sale.id}', 'seller')" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:none; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:black;">
                    <i class="fa-solid fa-redo"></i> Renovar
                </button>
                <button onclick="sendReminderFromDash('${sale.id}', '${safeClientName}', '${sale.clientPhone || ''}', '${encodeURIComponent(itemsStr)}')" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #4cd137; background: rgba(76, 209, 55, 0.1); color:#4cd137;">
                    <i class="fa-brands fa-whatsapp"></i> Recordar
                </button>
                <button onclick="sendRenovadaFromDash('${encodeURIComponent(sale.clientName)}', '${sale.clientPhone || ''}', '${encodeURIComponent(itemsStr)}', ${(sale.items && sale.items.length > 1) ? true : false}, ${sale.expirationDate || 0}, '${sale.id}')" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #f39c12; background: rgba(243, 156, 18, 0.1); color:#f39c12;">
                    <i class="fa-brands fa-whatsapp"></i> Renovada
                </button>
                <button onclick="editClientFromDash('${sale.id}', '${safeDecode(sale.clientName)}', '${sale.clientPhone || ''}', '${sale.clientCity || ''}')" 
                    style="flex: 1; min-width:120px; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #c48dfc; background: rgba(196, 141, 252, 0.1); color:#c48dfc;">
                    <i class="fa-solid fa-pen"></i> Editar
                </button>
            </div>
        `;
    }

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; flex-wrap:wrap; gap:0.5rem;">
            <strong style="color:white; font-size:1.1rem;">${safeDecode(sale.clientName)}</strong>
            <span style="background:${statusColor}; color:white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight:bold;">
                ${!isExpired ? `Vence en ${daysLeft} días` : 'Vencida'}
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
        <p style="font-size:0.85rem; color:var(--text-primary); margin-bottom:${isExpired ? '0' : '1rem'};">📺 ${itemsStr}</p>
        ${buttonsHtml}
    `;
    container.appendChild(div);
}

window.renewFromDash = function (cName, cPhone, cCity, itemsJsonEncoded, saleId = null, source = 'client') {
    window.renewalSaleId = saleId;
    window.renewalSource = source;
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
        } catch(e) {}
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

    // La lógica de renovación automática ha sido ELIMINADA del panel del vendedor
    // para evitar que el vendedor sume días innecesariamente. 
    // Ahora solo el ADMIN puede realizar renovaciones automáticas desde su panel.

    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    let monthText = 'el próximo mes';
    if (expirationDateTS && expirationDateTS !== 0) {
        const d = new Date(parseInt(expirationDateTS));
        monthText = `${d.getDate()} ${months[d.getMonth()]}`;
    }

    let msg = '';
    if (isMultiple) {
        const template = storeConfig.renovadaPluralTemplate || "♦️♦️♦️ ** Tus Pantallas de *{pantallas}* han sido Renovadas* con los mismos datos que tenga buen día que la disfrute ♦️♦️♦️ *vence {mes}*";
        msg = template.replace(/{cliente}/g, clientName).replace(/{pantallas}/g, itemsStr).replace(/{mes}/g, monthText);
    } else {
        const template = storeConfig.renovadaSingularTemplate || "♦️♦️♦️ ** Tu Pantalla de *{pantallas}* ha sido Renovada* con los mismos datos que tenga buen día que la disfrute ♦️♦️♦️ *vence {mes}*";
        msg = template.replace(/{cliente}/g, clientName).replace(/{pantallas}/g, itemsStr).replace(/{mes}/g, monthText);
    }

    const encodedMsg = encodeURIComponent(msg);
    let waPhone = clientPhone.toString().replace(/\D/g, '');
    if (waPhone.length === 10 && waPhone.startsWith('3')) waPhone = '57' + waPhone;
    window.open(`https://wa.me/${waPhone}?text=${encodedMsg}`, '_blank');
}

function sendCRMMessageFromSale(saleId, clientName, clientPhone, itemsEncoded) {
    if (!clientPhone) { alert('Cliente sin número de teléfono.'); return; }
    const itemsStr = decodeURIComponent(itemsEncoded);
    let msg = storeConfig.msgTemplate1 || '';
    msg = msg.replace(/{nombre}/g, clientName)
             .replace(/{pantalla}/g, itemsStr)
             .replace(/{inicio}/g, new Date().toLocaleDateString())
             .replace(/{fin}/g, new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString());
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
    if(newName === null) return;
    const newPhone = prompt('Editar Celular del Cliente:', cPhone);
    if(newPhone === null) return;
    const newCity = prompt('Editar Ciudad del Cliente:', cCity);
    if(newCity === null) return;
    
    // Update in Firebase sellerSales y clientSales
    let updates = {};
    updates[`sellerSales/${currentSellerName}/${saleId}/clientName`] = newName;
    updates[`sellerSales/${currentSellerName}/${saleId}/clientPhone`] = newPhone;
    updates[`sellerSales/${currentSellerName}/${saleId}/clientCity`] = newCity;

    let cleanPhoneOld = cPhone ? cPhone.replace(/\D/g, '') : '';
    let cleanPhoneNew = newPhone ? newPhone.replace(/\D/g, '') : '';

    db.ref('/').update(updates).then(() => {
        alert('Cliente editado correctamente.');
        renderSellerDashboard();
        
        // Sincronizar en clientSales si era posible (opcional)
        if (cleanPhoneOld && cleanPhoneOld === cleanPhoneNew) {
            db.ref(`clientSales/${cleanPhoneOld}`).once('value').then(snap => {
                const cSales = snap.val();
                if (cSales) {
                    let cUpd = {};
                    Object.keys(cSales).forEach(k => {
                        if (cSales[k].clientName === cName) {
                            cUpd[`clientSales/${cleanPhoneOld}/${k}/clientName`] = newName;
                            cUpd[`clientProfiles/${cleanPhoneOld}/name`] = newName;
                        }
                    });
                    db.ref('/').update(cUpd).then(() => window.location.reload());
                } else {
                    window.location.reload();
                }
            });
        } else {
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
            const expEndOfDay = new Date(sale.expirationDate).setHours(23, 59, 59, 999) + 86400000;
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
    const expEndOfDay = new Date(sale.expirationDate).setHours(23, 59, 59, 999) + 86400000;
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
            <span style="background:${statusColor}; color:white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight:bold;">
                ${!isExpired ? `Vence en ${daysLeft} días` : 'Vencida'}
            </span>
        </div>
        ${sellerAttribution}
        <div style="display:flex; justify-content:space-between; color:#a0a0a0; font-size:0.8rem; margin-bottom:0.8rem; background:rgba(0,0,0,0.2); padding: 5px; border-radius:6px;">
            <span><i class="fa-regular fa-calendar-check" style="color:#4cd137;"></i> ${new Date(sale.date).toLocaleDateString()}</span>
            <span><i class="fa-regular fa-calendar-xmark" style="color:#ff4d4d;"></i> ${new Date(sale.expirationDate).toLocaleDateString()}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-primary); margin-bottom:${isExpired ? '0' : '1rem'};">📺 ${itemsStr}</p>
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
            <button onclick="renewFromDash('${encodeURIComponent(sale.clientName)}', '${sale.clientPhone || clientPhoneLoggedIn}', '${sale.clientCity || ''}', '${encodeURIComponent(JSON.stringify(sale.items || []))}', '${sale.id}', 'client')" 
                style="width: 100%; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:none; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:black;">
                <i class="fa-solid fa-redo"></i> Renovar mis pantallas
            </button>
        </div>
        ` : ''}
    `;
    container.appendChild(div);

    if (sale.sellerName && sale.sellerName !== 'Página Web Oficial') {
        db.ref(`sellerStores/${sale.sellerName}`).once('value').then(storeSnap => {
            const sData = storeSnap.val();
            const netDiv = document.getElementById(sellerNetworksHtmlId);
            if(netDiv) {
                if(sData) {
                    let netsHtml = '';
                    if(sData.whatsapp) netsHtml += `<a href="https://wa.me/${formatWaPhone(sData.whatsapp)}" target="_blank" style="color:#25D366; transition:transform 0.2s;"><i class="fa-brands fa-whatsapp"></i></a>`;
                    if(sData.facebookUrl) netsHtml += `<a href="${sData.facebookUrl}" target="_blank" style="color:#1877F2; transition:transform 0.2s;"><i class="fa-brands fa-facebook"></i></a>`;
                    if(sData.instagramUrl) netsHtml += `<a href="${sData.instagramUrl}" target="_blank" style="color:#E1306C; transition:transform 0.2s;"><i class="fa-brands fa-instagram"></i></a>`;
                    if(sData.tiktokUrl) netsHtml += `<a href="${sData.tiktokUrl}" target="_blank" style="color:#ffffff; transition:transform 0.2s;"><i class="fa-brands fa-tiktok"></i></a>`;
                    if(sData.kwaiUrl) netsHtml += `<a href="${sData.kwaiUrl}" target="_blank" style="color:#FF5E00; transition:transform 0.2s;"><i class="fa-solid fa-video"></i></a>`;
                    if(sData.youtubeUrl) netsHtml += `<a href="${sData.youtubeUrl}" target="_blank" style="color:#FF0000; transition:transform 0.2s;"><i class="fa-brands fa-youtube"></i></a>`;
                    
                    netDiv.innerHTML = netsHtml || `<span style="font-size:0.75rem; color:#a0a0a0;">Sin redes configuradas</span>`;
                } else {
                    netDiv.innerHTML = `<span style="font-size:0.75rem; color:#a0a0a0;">Sin redes configuradas</span>`;
                }
            }
        }).catch(() => {
            const netDiv = document.getElementById(sellerNetworksHtmlId);
            if(netDiv) netDiv.innerHTML = `<span style="font-size:0.75rem; color:#a0a0a0;">Sin redes configuradas</span>`;
        });
    }
}

// Firebase Initialization and Loading Logic
db.ref('/').once('value').then(snap => {
    let data = snap.val();
    // Lógica de migración eliminada por seguridad para evitar sobrescrituras accidentales.
    if (!data) {
        console.warn("La base de datos parece estar vacía o no se pudo cargar correctamente.");
    }

    // Configurar observador en vivo (Live sync)
    db.ref('/').on('value', (snapshot) => {
        let val = snapshot.val();
        if (val) {
            storeConfig = val.storeConfig || {};
            products = val.products || [];

            const runInit = () => {
                if (!window.appInitialized) {
                    window.appInitialized = true;
                    init(); // Iniciar UI y Listeners por primera y unica vez
                } else {
                    // Actualizar UI en vivo si hubo algun cambio desde el admin backend
                    setupConfigUI();
                    const activeTabBtn = document.querySelector('.tab-btn.active');
                    if (activeTabBtn) renderProducts(activeTabBtn.dataset.tab);
                    updateCartUI();
                    renderCartItems();
                }
            };

            if (publicSellerRef && !window.appInitialized) {
                db.ref(`sellerStores/${publicSellerRef}`).once('value').then(sp => {
                    const resellerData = sp.val();
                    if (resellerData) {
                        publicSellerStoreData = resellerData;
                        isSellerMode = false; // Fuerza vista cliente global
                    }
                    runInit();
                }).catch(() => runInit());
            } else {
                runInit();
            }
        }
    });
});
