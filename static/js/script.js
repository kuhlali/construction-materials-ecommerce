// Cart System
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('devkisteel_cart')) || [];
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.renderCartItems();
        this.setupEventListeners();
    }
    
    // Add item to cart
    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
        this.showNotification(`${product.name} added to cart!`, 'success');
    }
    
    // Remove item from cart
    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
        this.showNotification('Item removed from cart', 'info');
    }
    
    // Update item quantity
    updateQuantity(id, quantity) {
        if (quantity < 1) {
            this.removeItem(id);
            return;
        }
        
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartCount();
            this.renderCartItems();
        }
    }
    
    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
        this.showNotification('Cart cleared', 'info');
    }
    
    // Calculate total price
    calculateTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    // Format price with commas
    formatPrice(price) {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(price).replace('KES', 'KES ');
    }
    
    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('devkisteel_cart', JSON.stringify(this.cart));
    }
    
    // Update cart count badge
    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
    
    // Render cart items
    renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.total-price');
        
        if (!cartItemsContainer || !cartTotal) return;
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn btn-primary">Shop Now</a>
                </div>
            `;
            cartTotal.textContent = 'KES 0';
            return;
        }
        
        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)} each</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn-small minus">-</button>
                        <input type="number" class="quantity-input-small" value="${item.quantity}" min="1" max="99">
                        <button class="quantity-btn-small plus">+</button>
                    </div>
                </div>
                <button class="cart-item-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Update total
        cartTotal.textContent = this.formatPrice(this.calculateTotal());
        
        // Add event listeners to cart items
        this.setupCartItemListeners();
    }
    
    // Generate WhatsApp order message
    generateOrderMessage() {
        let message = "Hello Devkisteel Maishamabati! I'd like to order the following products:%0A%0A";
        
        this.cart.forEach((item, index) => {
            const total = item.price * item.quantity;
            message += `${index + 1}. ${item.name}%0A`;
            message += `   Quantity: ${item.quantity}%0A`;
            message += `   Price: ${this.formatPrice(total)}%0A%0A`;
        });
        
        message += `Total Amount: ${this.formatPrice(this.calculateTotal())}%0A%0A`;
        message += "Please contact me to confirm the order and arrange delivery.";
        
        return message;
    }
    
    // Buy Now functionality
    buyNow(product) {
        // Add the item to the cart first to ensure it's saved
        this.addItem(product);

        // Generate a message for just this one product
        let message = `Hello Devkisteel Maishamabati! I'd like to purchase the following item:%0A%0A`;
        message += `Product: ${product.name}%0A`;
        message += `Quantity: ${product.quantity}%0A`;
        message += `Price: ${this.formatPrice(product.price * product.quantity)}%0A%0A`;
        message += "Please contact me to confirm the order and arrange delivery.";

        const phoneNumber = '254754516464';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const product = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    price: parseInt(e.target.dataset.price),
                    quantity: 1
                };
                
                // Check if there's a quantity input nearby
                const quantityInput = e.target.closest('.product-actions')?.querySelector('.quantity-input');
                if (quantityInput) {
                    product.quantity = parseInt(quantityInput.value) || 1;
                }
                
                this.addItem(product);
            });
        });
        
        // Buy Now buttons
        document.querySelectorAll('.buy-now').forEach(button => {
            button.addEventListener('click', (e) => {
                const product = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    price: parseInt(e.target.dataset.price),
                    quantity: 1
                };

                // Check if there's a quantity input nearby
                const quantityInput = e.target.closest('.product-actions')?.querySelector('.quantity-input');
                if (quantityInput) {
                    product.quantity = parseInt(quantityInput.value) || 1;
                }

                this.buyNow(product);
            });
        });
        
        // Cart toggle
        const cartBtn = document.querySelector('.cart-btn');
        const cartClose = document.querySelector('.cart-close');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.toggleCart();
            });
        }
        
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                this.toggleCart();
            });
        }
        
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.toggleCart();
            });
        }
        
        // Clear cart
        const cartClear = document.querySelector('.cart-clear');
        if (cartClear) {
            cartClear.addEventListener('click', () => {
                if (this.cart.length > 0) {
                    if (confirm('Are you sure you want to clear your cart?')) {
                        this.clearCart();
                    }
                }
            });
        }
        
        // Checkout via WhatsApp
        const cartCheckout = document.querySelector('.cart-checkout');
        if (cartCheckout) {
            cartCheckout.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showNotification('Your cart is empty', 'error');
                    return;
                }
                
                const phoneNumber = '254754516464';
                const message = this.generateOrderMessage();
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                
                window.open(whatsappUrl, '_blank');
            });
        }
        
        // Quantity buttons in products
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.parentElement.querySelector('.quantity-input');
                let value = parseInt(input.value) || 1;
                
                if (e.target.classList.contains('plus')) {
                    value = Math.min(value + 1, 100);
                } else if (e.target.classList.contains('minus')) {
                    value = Math.max(value - 1, 1);
                }
                
                input.value = value;
            });
        });
    }
    
    // Setup cart item listeners
    setupCartItemListeners() {
        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                this.removeItem(itemId);
            });
        });
        
        // Quantity controls in cart
        document.querySelectorAll('.quantity-btn-small').forEach(button => {
            button.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                const input = cartItem.querySelector('.quantity-input-small');
                let quantity = parseInt(input.value) || 1;
                
                if (e.target.classList.contains('plus')) {
                    quantity = Math.min(quantity + 1, 99);
                } else if (e.target.classList.contains('minus')) {
                    quantity = Math.max(quantity - 1, 1);
                }
                
                input.value = quantity;
                this.updateQuantity(itemId, quantity);
            });
        });
        
        // Quantity input changes
        document.querySelectorAll('.quantity-input-small').forEach(input => {
            input.addEventListener('change', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                let quantity = parseInt(e.target.value) || 1;
                quantity = Math.max(1, Math.min(quantity, 99));
                e.target.value = quantity;
                this.updateQuantity(itemId, quantity);
            });
        });
    }
    
    // Toggle cart visibility
    toggleCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        
        // Prevent body scroll when cart is open
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }
    
    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    max-width: 400px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid #4CAF50;
                }
                
                .notification-error {
                    border-left-color: #f44336;
                }
                
                .notification-success {
                    border-left-color: #4CAF50;
                }
                
                .notification p {
                    margin: 0;
                    color: #333;
                    font-weight: 500;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(notification);
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Mobile Navigation Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

// Form Submission
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = quoteForm.querySelector('input[type="text"]').value;
        const phone = quoteForm.querySelector('input[type="tel"]').value;
        const product = quoteForm.querySelector('select').value;
        const message = quoteForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !phone || !product) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Show success message
        alert(`Thank you ${name}! Your quote request has been sent. We'll contact you within 24 hours.`);
        
        // Reset form
        quoteForm.reset();
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize shopping cart
    window.cart = new ShoppingCart();
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const homePage = 'index.html';
    document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        link.classList.remove('active');
        if (linkPage === currentPage || (currentPage === '' && linkPage === homePage)) {
            link.classList.add('active');
        }
    });
});

// Add hover effect to product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});