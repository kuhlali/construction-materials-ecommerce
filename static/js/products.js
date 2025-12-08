// Products Page Functionality
class ProductsPage {
    constructor() {
        this.products = document.querySelectorAll('.product-card');
        this.productsPerLoad = 8;
        this.currentProducts = this.productsPerLoad;
        this.filteredProducts = Array.from(this.products);
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateProductCount();
        this.handleURLParams();
        this.showInitialProducts();
    }
    
    // Show initial products (with load more functionality)
    showInitialProducts() {
        this.products.forEach((product, index) => {
            if (index < this.currentProducts) {
                product.style.display = 'block';
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                product.style.display = 'none';
            }
        });
        
        this.updateLoadMoreButton();
    }
    
    // Load more products
    loadMoreProducts() {
        this.currentProducts += this.productsPerLoad;
        this.showFilteredProducts();
        this.updateLoadMoreButton();
    }
    
    // Update load more button visibility
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const remainingProducts = this.filteredProducts.length - this.currentProducts;
        
        if (loadMoreBtn) {
            if (remainingProducts > 0) {
                loadMoreBtn.style.display = 'flex';
                loadMoreBtn.innerHTML = `<i class="fas fa-arrow-down"></i> Load More (${remainingProducts} remaining)`;
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }
    
    // Filter products based on search and category
    filterProducts() {
        const searchTerm = document.getElementById('productSearch').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const sortBy = document.getElementById('sortFilter').value;
        
        this.filteredProducts = Array.from(this.products).filter(product => {
            const matchesSearch = product.querySelector('.product-title').textContent.toLowerCase().includes(searchTerm) ||
                                  product.querySelector('.product-desc').textContent.toLowerCase().includes(searchTerm);
            
            const matchesCategory = category === 'all' || product.dataset.category === category;
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort products
        this.sortProducts(sortBy);
        
        // Show filtered products
        this.showFilteredProducts();
        this.updateProductCount();
    }
    
    // Sort products
    sortProducts(sortBy) {
        this.filteredProducts.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const nameA = a.querySelector('.product-title').textContent;
            const nameB = b.querySelector('.product-title').textContent;
            
            switch(sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name':
                    return nameA.localeCompare(nameB);
                default:
                    return 0;
            }
        });
    }
    
    // Show filtered products
    showFilteredProducts() {
        // Hide all products first
        this.products.forEach(product => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        });
        
        // Show filtered products
        setTimeout(() => {
            this.filteredProducts.forEach((product, index) => {
                if (index < this.currentProducts) {
                    product.style.display = 'block';
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, index * 50);
                }
            });
            
            this.updateLoadMoreButton();
        }, 300);
    }
    
    // Update product count display
    updateProductCount() {
        const productCount = document.getElementById('productCount');
        if (productCount) {
            productCount.textContent = this.filteredProducts.length;
        }
    }
    
    // Handle URL parameters for category filtering
    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = category;
                this.filterProducts();
            }
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.currentProducts = this.productsPerLoad;
                this.filterProducts();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.currentProducts = this.productsPerLoad;
                this.filterProducts();
            });
        }
        
        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }
    }
}

// Initialize products page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.all-products-section')) {
        window.productsPage = new ProductsPage();
    }
});