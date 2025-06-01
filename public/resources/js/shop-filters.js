// Shop Filters
document.addEventListener('DOMContentLoaded', function() {
    // Price Range
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = this.value;
        });
    }
    
    // Notes Validation
    const notesTextarea = document.getElementById('notes');
    if (notesTextarea) {
        notesTextarea.addEventListener('input', function() {
            const isValid = this.value.length >= 5;
            this.classList.toggle('is-invalid', !isValid);
            this.classList.toggle('is-valid', isValid);
        });
    }
    
    // Filter Products
    const filterBtn = document.getElementById('filterProducts');
    if (filterBtn) {
        filterBtn.addEventListener('click', filterProducts);
    }
    
    // Sort Products
    const sortAscBtn = document.getElementById('sortAscending');
    const sortDescBtn = document.getElementById('sortDescending');
    const sortSelect = document.getElementById('sortBy');
    
    if (sortAscBtn) {
        sortAscBtn.addEventListener('click', () => sortProducts('asc'));
    }
    if (sortDescBtn) {
        sortDescBtn.addEventListener('click', () => sortProducts('desc'));
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            if (this.value !== 'none') {
                const [field, direction] = this.value.split('_');
                sortProductsByField(field, direction);
            }
        });
    }
    
    // Calculate Average Price
    const calcBtn = document.getElementById('calculateAverage');
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateAveragePrice);
    }
    
    // Reset Filters
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (!confirm('Are you sure you want to reset all filters?')) {
                return;
            }
            resetFilters();
        });
    }
    
    // Create price calculation display
    const priceDisplay = document.createElement('div');
    priceDisplay.className = 'price-calculation';
    priceDisplay.innerHTML = `
        <h4>Average Price</h4>
        <div class="price-value"></div>
    `;
    document.body.appendChild(priceDisplay);
});

function filterProducts() {
    const productsContainer = document.getElementById('productsContainer');
    const products = document.querySelectorAll('.product-card');
    const name = document.getElementById('productName').value.toLowerCase();
    const price = parseFloat(document.getElementById('priceRange').value);
    const style = document.getElementById('styleSelect').value;
    const category = document.querySelector('input[name="category"]:checked').value;
    const featuredOnly = document.getElementById('featuredItems').checked;
    const inStockOnly = document.getElementById('inStock').checked;
    
    products.forEach(product => {
        const productData = product.dataset;
        let show = true;
        
        // Name filter
        if (name && !productData.name.includes(name)) {
            show = false;
        }
        
        // Price filter
        if (price && parseFloat(productData.price) > price) {
            show = false;
        }
        
        // Style filter
        if (style && productData.style !== style) {
            show = false;
        }
        
        // Category filter
        if (category && productData.category !== category) {
            show = false;
        }
        
        // Featured items filter
        if (featuredOnly && productData.featured !== 'true') {
            show = false;
        }
        
        // In stock filter
        if (inStockOnly && parseInt(productData.stock) <= 0) {
            show = false;
        }
        
        // Tags filter
        ['darkHumor', 'ironic', 'edgy', 'relatable'].forEach(tag => {
            const checkbox = document.getElementById(tag);
            if (checkbox && checkbox.checked) {
                const isAre = document.getElementById(tag + 'Are').checked;
                const hasTag = productData.tags.includes(tag);
                if (isAre && !hasTag || !isAre && hasTag) {
                    show = false;
                }
            }
        });
        
        product.style.display = show ? '' : 'none';
    });
}

function sortProducts(direction) {
    const productsContainer = document.getElementById('productsContainer');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        return direction === 'asc' ? priceA - priceB : priceB - priceA;
    });
    
    products.forEach(product => productsContainer.appendChild(product));
}

function sortProductsByField(field, direction) {
    const productsContainer = document.getElementById('productsContainer');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        if (field === 'price') {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            return direction === 'asc' ? priceA - priceB : priceB - priceA;
        } else if (field === 'name') {
            const nameA = a.dataset.name.toLowerCase();
            const nameB = b.dataset.name.toLowerCase();
            return direction === 'asc' ? 
                nameA.localeCompare(nameB) : 
                nameB.localeCompare(nameA);
        }
        return 0;
    });
    
    products.forEach(product => productsContainer.appendChild(product));
}

function calculateAveragePrice() {
    const visibleProducts = Array.from(document.querySelectorAll('.product-card')).filter(p => p.style.display !== 'none');
    const total = visibleProducts.reduce((sum, product) => sum + parseFloat(product.dataset.price), 0);
    const average = total / visibleProducts.length || 0;
    
    const priceDisplay = document.querySelector('.price-calculation');
    priceDisplay.querySelector('.price-value').textContent = `$${average.toFixed(2)}`;
    priceDisplay.classList.add('show');
}

function resetFilters() {
    // Reset form inputs
    document.getElementById('productName').value = '';
    document.getElementById('priceRange').value = '49.99';
    document.getElementById('priceValue').textContent = '49.99';
    document.getElementById('styleSelect').value = '';
    document.getElementById('allCategories').checked = true;
    document.getElementById('notes').value = '';
    document.getElementById('sortBy').value = 'none';
    document.getElementById('featuredItems').checked = false;
    document.getElementById('inStock').checked = false;
    
    // Reset tag checkboxes and radio buttons
    ['darkHumor', 'ironic', 'edgy', 'relatable'].forEach(tag => {
        const checkbox = document.getElementById(tag);
        if (checkbox) {
            checkbox.checked = false;
            document.getElementById(tag + 'Are').checked = true;
        }
    });
    
    // Show all products
    document.querySelectorAll('.product-card').forEach(product => {
        product.style.display = '';
    });
    
    // Reset textarea validation state
    const notesTextarea = document.getElementById('notes');
    if (notesTextarea) {
        notesTextarea.classList.remove('is-invalid', 'is-valid');
    }
    
    // Hide price calculation if visible
    const priceDisplay = document.querySelector('.price-calculation');
    if (priceDisplay) {
        priceDisplay.classList.remove('show');
    }
}
