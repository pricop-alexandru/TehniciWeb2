const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { afisareEroare } = require('../utils/error-handlers');

// Route for new arrivals (featured products)
router.get('/', async (req, res) => {
    try {
        const products = await Product.getFilteredProducts({
            is_featured: true
        });
        
        res.render('shop', {
            title: 'New Arrivals - OnlyMerch',
            products,
            filters: { is_featured: true }
        });
    } catch (err) {
        console.error('Error loading new arrivals page:', err);
        afisareEroare(res, 500, 'Server Error', 'Unable to load featured products');
    }
});

module.exports = router;
