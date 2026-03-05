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

// Notificación de Actualización
if (!sessionStorage.getItem('bonoUpdateShown')) {
    alert('Sistema de Bonos Individualizado Actualizado ✔️. Versión: 3.5.0\nSi ves este mensaje, asegúrate de revisar la "Configuración" en el panel Admin y colocar los montos de cada plataforma antes de probar ventas.');
    sessionStorage.setItem('bonoUpdateShown', 'true');
}

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

    // Bind Footer Links
    let waLinkHref = storeConfig.whatsappNumber ? `https://wa.me/${storeConfig.whatsappNumber}` : null;
    let fbLinkHref = storeConfig.facebookUrl || null;
    let igLinkHref = storeConfig.instagramUrl || null;
    let tkLinkHref = storeConfig.tiktokUrl || null;
    let kwLinkHref = storeConfig.kwaiUrl || null;
    let ytLinkHref = storeConfig.youtubeUrl || null;

    if (publicSellerStoreData) {
        waLinkHref = publicSellerStoreData.whatsapp ? `https://wa.me/${publicSellerStoreData.whatsapp}` : null;
        fbLinkHref = publicSellerStoreData.facebookUrl || null;
        igLinkHref = publicSellerStoreData.instagramUrl || null;
        tkLinkHref = publicSellerStoreData.tiktokUrl || null;
        kwLinkHref = publicSellerStoreData.kwaiUrl || null;
        ytLinkHref = publicSellerStoreData.youtubeUrl || null;
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
        } else if (!isSellerMode && !publicSellerRef && storeConfig.clientBannerEnabled && storeConfig.clientBannerText) {
            // General Clients view
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
            if (heroTitleCont) heroTitleCont.style.display = 'none';

            // Auto start timer
            if (banners.length > 1) {
                if (window.bannerIntervalId) clearInterval(window.bannerIntervalId);
                window.bannerIntervalId = setInterval(() => { moveBannerSlider(1); }, 10000);
            }
        } else {
            featuredContainer.style.display = 'none';
            if (heroTitleCont) heroTitleCont.style.display = 'block';
        }
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

function getPrice(product) {
    if (publicSellerStoreData && publicSellerStoreData.prices && publicSellerStoreData.prices[product.id]) {
        return parseInt(publicSellerStoreData.prices[product.id]);
    }
    if (isSellerMode && product.sellerPrice) {
        return product.sellerPrice;
    }
    return product.price;
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

        estrenos.forEach(item => {
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
        return;
    }

    const filtered = category === 'all'
        ? products.filter(p => p.active !== false)
        : products.filter(p => p.category === category && p.active !== false);

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        // Usar imagen por defecto si no tiene
        const imgUrl = product.image || 'https://img.icons8.com/color/96/movie.png';
        const displayPrice = getPrice(product);

        let sellerBadge = isSellerMode ? `<span style="background:#27ae60; color:white; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:0.5rem">Precio Vendedor</span>` : '';
        const inStock = product.inStock !== false;

        let buttonHtml = inStock
            ? `<button class="btn-add" onclick="addToCart(${product.id})">Agregar</button>`
            : `<button class="btn-add" style="background:#ff4d4d; color:white; border-color:#ff4d4d; cursor:not-allowed;" disabled>Agotado</button>`;

        card.innerHTML = `
            <div style="text-align:center; margin-bottom:1rem">
                <img src="${imgUrl}" alt="${product.brand}" style="width:100%; max-width:140px; height:85px; object-fit:contain">
            </div>
            <span class="brand-badge">${product.brand}</span>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc" style="margin-bottom: 0.5rem">Pantalla original premium con garantía.</p>
            ${sellerBadge}
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
    cart.push(product);
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
    let isClientPromoActive = !isSellerMode && !publicSellerRef && storeConfig.clientBannerEnabled && storeConfig.clientPromoLimit > 0 && storeConfig.clientPromoDiscount > 0;
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
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let stats = processCartDiscounts();

    stats.processedCart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <p style="font-weight:600">${item.name} ${item.discountNote}</p>
                <p style="font-size:0.8rem; color:#a0a0a0">$${item.finalPrice.toLocaleString()}</p>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4d00; cursor:pointer">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(div);
    });
}

function setupEventListeners() {
    // Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.tab);
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
                db.ref(`sellerSales/${currentSellerName}`).once('value').then(snap => {
                    const sales = snap.val();
                    sellerClientsDropdown.innerHTML = '<option value="">-- Nuevo Cliente / Escribir Manual --</option>';
                    if (sales) {
                        // Get unique clients
                        const uniqueClients = {};
                        Object.keys(sales).forEach(key => {
                            const cName = sales[key].clientName;
                            if (cName && !uniqueClients[cName]) {
                                uniqueClients[cName] = sales[key];
                            }
                        });

                        Object.values(uniqueClients).forEach(c => {
                            const opt = document.createElement('option');
                            // Store json in value to parse on select
                            opt.value = encodeURIComponent(JSON.stringify({ name: c.clientName, phone: c.clientPhone || '', city: c.clientCity || '' }));
                            opt.text = c.clientName;
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
                window.open(`https://wa.me/${phoneSegment}?text=${encoded}`, '_blank');
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
            window.open(`https://wa.me/${adminWa}?text=${text}`, '_blank');
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

    if (logoutClientBtn) {
        logoutClientBtn.addEventListener('click', () => {
            localStorage.removeItem('clientPhone');
            clientPhoneLoggedIn = '';
            clientDashboardModal.style.display = 'none';
            alert('Sesión cerrada. Vuelve pronto.');
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
            products.filter(p => p.active !== false).forEach(p => {
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

        if (!isRecurrent) {
            cName = document.getElementById('client-name').value.trim();
            cCity = document.getElementById('client-city').value.trim();
            cPhone = document.getElementById('client-phone').value.trim();
            const checkedDev = document.querySelectorAll('#client-devices input[type="checkbox"]:checked');
            checkedDev.forEach(c => cDevices.push(c.value));

            if (!cName) {
                return alert('Por favor, indica el nombre del cliente.');
            }

            const cleanPhone = cPhone ? cPhone.replace(/\D/g, '') : '';
            if (cleanPhone && storeConfig.blockedClients && storeConfig.blockedClients.includes(cleanPhone)) {
                return alert('⚠️ Este número de celular ha sido bloqueado por el administrador. Contacta con soporte.');
            }
        }

        let stats = processCartDiscounts();
        let total = stats.total;
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
            message += `${i + 1}. *${item.name}* - $${item.finalPrice.toLocaleString()}\n`;
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

        message += `\n💰 *Total a pagar:* $${total.toLocaleString()}\n\n`;

        // Guardar venta en base de datos
        if (!isRecurrent) {
            let incentiveEarned = 0;
            let incentiveDetails = [];

            // DEBUG SYSTEM: Collect calculation steps
            let debugLog = `DEBUG INFO:\nincentiveEnabled=${storeConfig.incentiveEnabled}\n`;

            if (storeConfig.incentiveEnabled) {
                stats.processedCart.forEach(item => {
                    if (item.category === 'individual') {
                        let b = 0; let name = '';
                        const brandStr = (item.brand || item.name).toLowerCase();
                        debugLog += `- Item: ${item.name} | Cat: ${item.category} | BrandStr: ${brandStr}\n`;

                        if (brandStr.includes('netflix')) { b = parseInt(storeConfig.incentiveNetflix) || 0; name = 'Netflix'; debugLog += `  -> Match Netflix! Valor config: ${storeConfig.incentiveNetflix}\n`; }
                        else if (brandStr.includes('disney')) { b = parseInt(storeConfig.incentiveDisney) || 0; name = 'Disney+'; debugLog += `  -> Match Disney! Valor config: ${storeConfig.incentiveDisney}\n`; }
                        else if (brandStr.includes('max')) { b = parseInt(storeConfig.incentiveMax) || 0; name = 'HBO Max'; }
                        else if (brandStr.includes('prime')) { b = parseInt(storeConfig.incentivePrime) || 0; name = 'Prime Video'; }
                        else if (brandStr.includes('paramount')) { b = parseInt(storeConfig.incentiveParamount) || 0; name = 'Paramount+'; }
                        else if (brandStr.includes('vix')) { b = parseInt(storeConfig.incentiveVix) || 0; name = 'Vix'; }
                        else if (brandStr.includes('iptv')) { b = parseInt(storeConfig.incentiveIptv) || 0; name = 'IPTV'; }
                        else if (brandStr.includes('crunchyroll')) { b = parseInt(storeConfig.incentiveCrunchyroll) || 0; name = 'Crunchyroll'; }
                        else if (brandStr.includes('apple')) { b = parseInt(storeConfig.incentiveApple) || 0; name = 'Apple TV'; }

                        if (b > 0) {
                            incentiveEarned += b;
                            incentiveDetails.push(`${name} (+$${b})`);
                        } else {
                            debugLog += `  -> NO se sumó bono porque b=${b}\n`;
                        }
                    }
                    else if (item.category === 'combos2') { const b = parseInt(storeConfig.incentiveCombo2) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Combo 2 P. (+$${b})`); }
                    else if (item.category === 'combos3') { const b = parseInt(storeConfig.incentiveCombo3) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Combo 3 P. (+$${b})`); }
                    else if (item.category === 'combos4') { const b = parseInt(storeConfig.incentiveCombo4) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Combo 4 P. (+$${b})`); }
                    else if (item.category === 'combos5') { const b = parseInt(storeConfig.incentiveCombo5) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Combo 5+ P. (+$${b})`); }
                    else if (item.category === 'promociones_finde') { const b = parseInt(storeConfig.incentiveFinde) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Promo Finde (+$${b})`); }
                    else if (item.category === 'promociones') { const b = parseInt(storeConfig.incentiveMes) || 0; incentiveEarned += b; if (b > 0) incentiveDetails.push(`Promo Mes (+$${b})`); }
                });
            }

            debugLog += `>>> TOTAL INCENTIVE CALCULADO: ${incentiveEarned}\n`;
            if (isSellerMode) {
                alert(debugLog);
            }

            const saleData = {
                clientName: cName,
                clientCity: cCity,
                clientPhone: cPhone,
                date: Date.now(),
                expirationDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // +30 days
                items: stats.processedCart.map(item => ({ id: item.id, name: item.name, category: item.category, finalPrice: item.finalPrice })),
                total: total,
                sellerName: isSellerMode ? currentSellerName : 'Página Web Oficial',
                incentiveEarned: incentiveEarned,
                incentiveDetails: incentiveDetails
            };

            // Public Seller Checkout Forwarding
            let finalSellerDestination = isSellerMode ? currentSellerName : 'Página Web Oficial';
            if (publicSellerRef) finalSellerDestination = publicSellerRef;

            if (isSellerMode || publicSellerRef) {
                db.ref(`sellerSales/${finalSellerDestination}`).push(saleData);
            }

            // Always save to client historical indexed by their clean phone
            const cleanPhoneTracking = cPhone ? cPhone.replace(/\D/g, '') : '';
            if (cleanPhoneTracking && cleanPhoneTracking.length > 5) {
                db.ref(`clientSales/${cleanPhoneTracking}`).push(saleData);
            }
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
            window.open(`https://wa.me/${checkoutWhatsappNumber}?text=${encoded}`, '_blank');

            // Vaciar el carrito y cerrar
            cart = [];
            updateCartUI();
            if (cartModal) cartModal.style.display = 'none';
        };

        if (publicSellerRef) {
            db.ref(`sellerStores/${publicSellerRef}`).once('value').then(snap => {
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
            if (sale.incentiveEarned) totalAccumulated += sale.incentiveEarned;
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

        salesArray.forEach(sale => {
            const now = Date.now();
            const daysLeft = Math.ceil((sale.expirationDate - now) / (1000 * 60 * 60 * 24));

            let statusColor = '#4cd137'; // Active
            if (daysLeft <= 3 && daysLeft >= 0) statusColor = '#f39c12'; // Ending soon
            if (daysLeft < 0) statusColor = '#ff4d4d'; // Expired

            const div = document.createElement('div');
            div.style.background = 'rgba(255,255,255,0.05)';
            div.style.border = `1px solid ${statusColor}`;
            div.style.padding = '1rem';
            div.style.borderRadius = '8px';

            const itemsStr = sale.items ? sale.items.map(i => i.name).join(', ') : 'Pantallas';

            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; flex-wrap:wrap; gap:0.5rem;">
                    <strong style="color:white; font-size:1.1rem;">${sale.clientName}</strong>
                    <span style="background:${statusColor}; color:white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight:bold;">
                        ${daysLeft >= 0 ? `Vence en ${daysLeft} días` : 'Vencida'}
                    </span>
                </div>
                <!-- Fechas de Inicio y Fin -->
                <div style="display:flex; justify-content:space-between; color:#a0a0a0; font-size:0.8rem; margin-bottom:0.8rem; background:rgba(0,0,0,0.2); padding: 5px; border-radius:6px;">
                    <span><i class="fa-regular fa-calendar-check" style="color:#4cd137;"></i> Inicio: ${new Date(sale.date).toLocaleDateString()}</span>
                    <span><i class="fa-regular fa-calendar-xmark" style="color:#ff4d4d;"></i> Fin: ${new Date(sale.expirationDate).toLocaleDateString()}</span>
                </div>
                <div style="display:flex; justify-content:space-between; color:#ccc; font-size:0.85rem; margin-bottom:0.5rem;">
                    <span><i class="fa-solid fa-mobile-screen"></i> ${sale.clientPhone || 'No registrado'}</span>
                    <span>📍 ${sale.clientCity || 'Ciudad N/A'}</span>
                </div>
                <!-- Mostrar bono en tarjeta si lo hay -->
                ${sale.incentiveEarned ? `<div style="background: rgba(243,156,18,0.2); border: 1px dashed #f39c12; color: #f39c12; font-size: 0.8rem; padding: 5px 10px; border-radius: 6px; margin-bottom: 0.8rem;"><b>Bono Ganado:</b> +$${sale.incentiveEarned.toLocaleString()} <span style="font-size:0.75rem;">(${sale.incentiveDetails ? sale.incentiveDetails.join(', ') : ''})</span></div>` : ''}
                <p style="font-size:0.85rem; color:var(--text-primary); margin-bottom:1rem;">📺 ${itemsStr}</p>
                <div style="display:flex; gap: 0.5rem; flex-wrap:wrap;">
                    <button onclick="renewFromDash('${sale.clientName}', '${sale.clientPhone}', '${sale.clientCity}', '${encodeURIComponent(JSON.stringify(sale.items || []))}')" 
                        style="flex: 1; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:none; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:black;">
                        <i class="fa-solid fa-redo"></i> Renovar
                    </button>
                    <button onclick="sendReminderFromDash('${sale.id}', '${sale.clientName}', '${sale.clientPhone || ''}', '${encodeURIComponent(itemsStr)}')" 
                        style="flex: 1; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid #4cd137; background: rgba(76, 209, 55, 0.1); color:#4cd137;">
                        <i class="fa-brands fa-whatsapp"></i> Recordar
                    </button>
                </div>
            `;
            sellerSalesList.appendChild(div);
        });
    });
}

window.renewFromDash = function (cName, cPhone, cCity, itemsJsonEncoded) {
    try {
        const itemsToRenew = JSON.parse(decodeURIComponent(itemsJsonEncoded));

        cart = [];
        itemsToRenew.forEach(i => {
            const found = products.find(p => p.name === i.name || p.id === i.id);
            if (found) cart.push(found);
        });

        if (cart.length === 0) {
            alert("No se pudieron encontrar las pantallas en el catálogo actual para renovar.");
            return;
        }

        updateCartUI();

        // Open Cart, pre-fill
        document.getElementById('is-renewal').checked = true;
        document.getElementById('client-name').value = cName !== 'undefined' ? cName : '';
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

window.sendReminderFromDash = function (saleId, cName, cPhone, itemsEncoded) {
    if (!reminderEditorModal) return;

    const items = decodeURIComponent(itemsEncoded);
    let template = storeConfig.reminderTemplate || "Hola {cliente} 😊 Buen dia\nTU {pantallas} finaliza \n👉 *HOY* 👈\n👉 😱... \n⚠️ Si deseas continuar, realiza el pago y me envías la foto del comprobante🧾 (sin comprobante no cuenta como pago válido) ⚠️\n\n*Medios de Pago:*\n*Nequi o Daviplata 3155182545*\n\n*Llave Nequi @NEQUICEC36* \n*Llave Daviplata @PLATA3155182545* \n*Llave Nu @CMA736*\n*Llave Be @BE346516*";

    // Replace variables
    let msg = template.replace(/{cliente}/g, cName).replace(/{pantallas}/g, items);

    remindSaleIdInput.value = saleId;
    remindPhoneInput.value = cPhone || '';
    remindMsgInput.value = msg;

    reminderEditorModal.style.display = 'block';
}

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

        salesArray.forEach(sale => {
            const now = Date.now();
            const daysLeft = Math.ceil((sale.expirationDate - now) / (1000 * 60 * 60 * 24));

            let statusColor = '#4cd137'; // Active
            if (daysLeft <= 3 && daysLeft >= 0) statusColor = '#f39c12'; // Ending soon
            if (daysLeft < 0) statusColor = '#ff4d4d'; // Expired

            const div = document.createElement('div');
            div.style.background = 'rgba(255,255,255,0.05)';
            div.style.border = `1px solid ${statusColor}`;
            div.style.padding = '1rem';
            div.style.borderRadius = '8px';

            const itemsStr = sale.items ? sale.items.map(i => i.name).join(', ') : 'Pantallas';
            const sellerAttribution = sale.sellerName && sale.sellerName !== 'Página Web Oficial' ? `<span style="font-size:0.75rem; color:#a0a0a0; display:block; margin-bottom:0.5rem;">Atendido por: ${sale.sellerName}</span>` : '';

            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; flex-wrap:wrap; gap:0.5rem;">
                    <strong style="color:white; font-size:1.1rem;">${sale.clientName}</strong>
                    <span style="background:${statusColor}; color:white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight:bold;">
                        ${daysLeft >= 0 ? `Vence en ${daysLeft} días` : 'Vencida'}
                    </span>
                </div>
                ${sellerAttribution}
                <div style="display:flex; justify-content:space-between; color:#a0a0a0; font-size:0.8rem; margin-bottom:0.8rem; background:rgba(0,0,0,0.2); padding: 5px; border-radius:6px;">
                    <span><i class="fa-regular fa-calendar-check" style="color:#4cd137;"></i> ${new Date(sale.date).toLocaleDateString()}</span>
                    <span><i class="fa-regular fa-calendar-xmark" style="color:#ff4d4d;"></i> ${new Date(sale.expirationDate).toLocaleDateString()}</span>
                </div>
                <p style="font-size:0.85rem; color:var(--text-primary); margin-bottom:1rem;">📺 ${itemsStr}</p>
                <div style="display:flex; gap: 0.5rem; flex-wrap:wrap;">
                    <button onclick="renewFromDash('${sale.clientName}', '${sale.clientPhone || clientPhoneLoggedIn}', '${sale.clientCity || ''}', '${encodeURIComponent(JSON.stringify(sale.items || []))}')" 
                        style="width: 100%; padding:0.6rem; border-radius:8px; cursor:pointer; font-weight:bold; border:none; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:black;">
                        <i class="fa-solid fa-redo"></i> Renovar mis pantallas
                    </button>
                </div>
            `;
            clientSalesList.appendChild(div);
        });
    });
}

// Firebase Initialization and Loading Logic
db.ref('/').once('value').then(snap => {
    let data = snap.val();
    if (!data) {
        console.log("Database vacia, migrando de localstorage...");
        // Migrar LocalStorage a Firebase la primera vez
        let oldConfig = JSON.parse(localStorage.getItem('storeConfig'));
        let oldProducts = JSON.parse(localStorage.getItem('products'));

        if (!oldConfig) {
            oldConfig = {
                whatsappNumber: "573155182545",
                paymentInfo: "*Medios de pago:*\n💳 Nequi o Daviplata: 3155182545\n🔑 Llave Nequi @NEQUICEC36\n🔑 Llave Daviplata @PLATA3155182545\n🔑 Llave Nu @CMA736\n🔑 Llave Be @BE346516",
                discountEnabled: true,
                discountAmount: 1000,
                netflixEnabled: true,
                disneyEnabled: true,
                sellers: [],
                estrenos: []
            };
        }
        if (!oldProducts || oldProducts.length === 0) {
            oldProducts = [
                { id: 1, name: "Netflix Premium 1️⃣ Pantalla", price: 16000, category: "individual", brand: "Netflix", image: "assets/netflix.png" },
                { id: 11, name: "Netflix Premium + Disney Premium", price: 27000, category: "combos2", brand: "Combo", image: "assets/logo_combo.jpg" }
            ];
        }

        data = { storeConfig: oldConfig, products: oldProducts };
        db.ref('/').set(data);
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
