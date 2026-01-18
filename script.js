// મેનૂ આઇટમ્સ ડેટા
const menuItems = [
    {
        id: 1,
        name: "ચા",
        description: "ગરમ અને સ્વાદિષ્ટ ચા",
        price: 15,
        category: "drink",
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "કોફી",
        description: "તાજા બનાવેલી કોફી",
        price: 20,
        category: "drink",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "કડી",
        description: "સ્પાઇસી અને ટેસ્ટી કડી",
        price: 40,
        category: "snack",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w-600&q=80"
    },
    {
        id: 4,
        name: "પકોડા",
        description: "ક્રિસ્પી અને સ્વાદિષ્ટ પકોડા",
        price: 30,
        category: "snack",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "પૌંઆ",
        description: "નરમ અને સ્વાદિષ્ટ પૌંઆ",
        price: 50,
        category: "snack",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "દાલવાટિકા",
        description: "સ્પાઇસી દાલવાટિકા",
        price: 35,
        category: "snack",
        image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "ખમણ",
        description: "ટેસ્ટી ખમણ",
        price: 45,
        category: "snack",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
];

// કાર્ટ ડેટા
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM લોડ થયે
document.addEventListener('DOMContentLoaded', function() {
    displayMenuItems();
    setupEventListeners();
    updateCartCount();
});

// મેનૂ આઇટમ્સ ડિસ્પ્લે
function displayMenuItems(filter = 'all') {
    const menuGrid = document.querySelector('.menu-grid');
    menuGrid.innerHTML = '';

    const filteredItems = filter === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === filter);

    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.category = item.category;
        
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <span class="price">₹${item.price}</span>
                </div>
                <span class="category">${item.category === 'drink' ? 'પીણાં' : 'નાસ્તો'}</span>
                <p>${item.description}</p>
                <button class="add-to-cart" onclick="addToCart(${item.id})">
                    <i class="fas fa-cart-plus"></i> કાર્ટમાં ઍડ કરો
                </button>
            </div>
        `;
        
        menuGrid.appendChild(menuItem);
    });
}

// ઇવેન્ટ લિસ્નર્સ
function setupEventListeners() {
    // ફિલ્ટર બટન્સ
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayMenuItems(this.dataset.filter);
        });
    });

    // કાર્ટ બટન
    document.querySelector('.cart-btn').addEventListener('click', openCartModal);
    
    // મોડલ બંધ કરવા
    document.querySelector('.close-modal').addEventListener('click', closeCartModal);
    document.querySelector('.close-cart').addEventListener('click', closeCartModal);
    
    // WhatsApp ઓર્ડર
    document.getElementById('checkoutBtn').addEventListener('click', placeWhatsAppOrder);
    
    // મોબાઈલ મેનૂ
    document.querySelector('.menu-toggle').addEventListener('click', toggleMobileMenu);
    
    // સ્મૂથ સ્ક્રોલિંગ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// મોબાઈલ મેનૂ
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// કાર્ટમાં ઍડ
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if(existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${item.name} કાર્ટમાં ઍડ થયું!`);
}

// કાર્ટ અપડેટ
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

// કાર્ટ કાઉન્ટ
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// કાર્ટ મોડલ ખોલવું
function openCartModal() {
    updateCartModal();
    document.getElementById('cartModal').style.display = 'flex';
}

// કાર્ટ મોડલ બંધ
function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// કાર્ટ મોડલ અપડેટ
function updateCartModal() {
    const cartItems = document.querySelector('.cart-items');
    const totalPrice = document.getElementById('totalPrice');
    
    cartItems.innerHTML = '';
    
    if(cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--gray-color);">તમારું કાર્ટ ખાલી છે</p>';
        totalPrice.textContent = '₹0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">₹${item.price} × ${item.quantity} = ₹${itemTotal}</span>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <span class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </span>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    totalPrice.textContent = `₹${total}`;
}

// ક્વાન્ટિટી અપડેટ
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if(item) {
        item.quantity += change;
        if(item.quantity < 1) {
            removeFromCart(itemId);
        } else {
            updateCart();
        }
    }
}

// કાર્ટમાંથી રીમૂવ
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    showNotification('આઇટમ રીમૂવ થઈ ગઈ!');
}

// WhatsApp ઓર્ડર
function placeWhatsAppOrder() {
    if(cart.length === 0) {
        alert('કૃપા કરીને પહેલાં કાર્ટમાં કંઈક ઍડ કરો!');
        return;
    }
    
    let message = "નમસ્તે! ચામુંડા ચા નાસ્તા માંથી ઓર્ડર:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name}: ${item.quantity} × ₹${item.price} = ₹${itemTotal}\n`;
    });
    
    message += `\n• કુલ: ₹${total}\n\n`;
    message += `મારું નામ: [તમારું નામ]\n`;
    message += `સરનામું: [ડિલિવરી સરનામું]\n`;
    message += `ફોન: [તમારો નંબર]\n\n`;
    message += `કૃપા કરીને કન્ફર્મ કરો.`;
    
    const whatsappNumber = "919662787286";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    closeCartModal();
}

// નોટિફિકેશન
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS એનિમેશન
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
