const paymentInfo = `*Medios de pago:*
💳 Nequi o Daviplata: 3155182545
🔑 Llave Nequi @NEQUICEC36
🔑 Llave Daviplata @PLATA3155182545
🔑 Llave Nu @CMA736
🔑 Llave Be @BE346516`;

const whatsappNumber = "573155182545";

// Cargar de localStorage si existe, si no usar los por defecto
let products = JSON.parse(localStorage.getItem('products'));
if (!products || products.length === 0) {
    products = [
        // INDIVIDUALES
        { id: 1, name: "Netflix Premium 1️⃣ Pantalla", price: 16000, category: "individual", brand: "Netflix", image: "https://img.icons8.com/color/96/netflix.png" },
        { id: 2, name: "Netflix Privada 1️⃣ Pantalla", price: 17000, category: "individual", brand: "Netflix", image: "https://img.icons8.com/color/96/netflix.png" },
        { id: 3, name: "Prime Video Premium 1️⃣ Pantalla", price: 9000, category: "individual", brand: "Prime Video", image: "https://img.icons8.com/color/96/amazon-prime-video.png" },
        { id: 4, name: "Disney Original Premium 1️⃣ Pantalla", price: 13000, category: "individual", brand: "Disney+", image: "https://img.icons8.com/color/96/disney-plus.png" },
        { id: 5, name: "Hbo Max Premium 1️⃣ Pantalla", price: 13000, category: "individual", brand: "HBO Max", image: "https://img.icons8.com/color/96/hbo-max.png" },
        { id: 6, name: "Paramount Premium 1️⃣ Pantalla", price: 9000, category: "individual", brand: "Paramount", image: "https://img.icons8.com/color/96/paramount-plus.png" },
        { id: 7, name: "IPTV 1️⃣ Pantalla", price: 18000, category: "individual", brand: "IPTV", image: "https://img.icons8.com/color/96/iptv.png" },
        { id: 8, name: "Vix Premium 1️⃣ Pantalla", price: 9000, category: "individual", brand: "Vix", image: "https://img.icons8.com/color/96/video.png" },
        { id: 9, name: "Crunchyroll Premium 1️⃣ Pantalla", price: 12000, category: "individual", brand: "Crunchyroll", image: "https://img.icons8.com/color/96/crunchyroll.png" },
        { id: 10, name: "Apple Tv Premium 1️⃣ Pantalla", price: 18000, category: "individual", brand: "Apple TV", image: "https://img.icons8.com/color/96/apple-tv.png" },

        // COMBOS (Incluyo algunos representativos, el admin puede agregar más)
        { id: 11, name: "Netflix Premium + Disney Premium", price: 27000, category: "combos2", brand: "Combo", image: "logo_combo.jpg" },
        { id: 12, name: "Netflix Privada + Disney Premium", price: 28000, category: "combos2", brand: "Combo", image: "logo_combo.jpg" },
        { id: 39, name: "NF Prem + Disney + HBO Max", price: 39000, category: "combos3", brand: "Combo", image: "logo_combo.jpg" },
        { id: 49, name: "NF Prem + Disney + HBO + Prime", price: 47000, category: "combos4", brand: "Combo", image: "logo_combo.jpg" },
        { id: 54, name: "NF Prem + Dis + HBO + Par + Prime", price: 55000, category: "combos5", brand: "Combo", image: "logo_combo.jpg" }
    ];
    localStorage.setItem('products', JSON.stringify(products));
}

// Migración: Si el usuario ya tiene productos en localStorage, actualizar el logo de los combos
products = products.map(p => {
    if (p.brand === 'Combo' && (!p.image || p.image.includes('icons8'))) {
        return { ...p, image: 'logo_combo.jpg' };
    }
    return p;
});
localStorage.setItem('products', JSON.stringify(products));

let cart = [];

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

// Initialize
function init() {
    renderProducts('all');
    setupEventListeners();
}

function renderProducts(category) {
    productsGrid.innerHTML = '';
    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        // Usar imagen por defecto si no tiene
        const imgUrl = product.image || 'https://img.icons8.com/color/96/movie.png';
        card.innerHTML = `
            <div style="text-align:center; margin-bottom:1rem">
                <img src="${imgUrl}" alt="${product.brand}" style="width:64px; height:64px; object-fit:contain">
            </div>
            <span class="brand-badge">${product.brand}</span>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc">Pantalla original premium con garantía.</p>
            <div class="price-row">
                <span class="price">$${product.price.toLocaleString()}</span>
                <button class="btn-add" onclick="addToCart(${product.id})">Agregar</button>
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

function updateCartUI() {
    cartBadge.innerText = cart.length;

    let total = 0;
    let individualCount = cart.filter(p => p.category === 'individual').length;

    cart.forEach(item => {
        let itemPrice = item.price;
        // Aplicar descuento de $1,000 por pantalla si es individual Y hay más de una individual en el carrito
        if (item.category === 'individual' && individualCount >= 2) {
            itemPrice -= 1000;
        }
        total += itemPrice;
    });

    cartTotalLabel.innerText = `$${total.toLocaleString()}`;
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let individualCount = cart.filter(p => p.category === 'individual').length;

    cart.forEach((item, index) => {
        let finalPrice = item.price;
        let discountNote = "";

        if (item.category === 'individual' && individualCount >= 2) {
            finalPrice -= 1000;
            discountNote = `<span style="color:#4cd137; font-size:0.7rem">(-$1,000 Combo Propio)</span>`;
        }

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <p style="font-weight:600">${item.name} ${discountNote}</p>
                <p style="font-size:0.8rem; color:#a0a0a0">$${finalPrice.toLocaleString()}</p>
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
        cartModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('Tu carrito está vacío');

        let total = 0;
        let individualCount = cart.filter(p => p.category === 'individual').length;
        let message = `🚀 *Nuevo Pedido - Streaming DPC*\n\n`;
        message += `Hola, me gustaría adquirir las siguientes pantallas:\n\n`;

        cart.forEach((item, i) => {
            let finalPrice = item.price;
            if (item.category === 'individual' && individualCount >= 2) {
                finalPrice -= 1000;
            }
            total += finalPrice;
            message += `${i + 1}. *${item.name}* - $${finalPrice.toLocaleString()}\n`;
        });

        if (individualCount >= 2) {
            message += `\n✨ _Descuento de $${(individualCount * 1000).toLocaleString()} aplicado por combo personalizado._\n`;
        }

        message += `\n💰 *Total a pagar:* $${total.toLocaleString()}\n\n`;
        message += `${paymentInfo}\n\n`;
        message += `Quedo atento a la activación de mis pantallas.`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
    });
}

init();
