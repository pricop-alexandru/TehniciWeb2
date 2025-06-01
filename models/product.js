const pool = require('../config/database');

class Product {
    static async getAllProducts() {
        try {
            const result = await pool.query('SELECT * FROM products ORDER BY date_added DESC');
            return result.rows;
        } catch (err) {
            console.error('Error fetching all products:', err);
            throw err;
        }
    }

    static async getProductById(id) {
        try {
            const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
            return result.rows[0];
        } catch (err) {
            console.error('Error fetching product by id:', err);
            throw err;
        }
    }

    static async getFeaturedProducts() {
        try {
            const result = await pool.query('SELECT * FROM products WHERE is_featured = true');
            return result.rows;
        } catch (err) {
            console.error('Error fetching featured products:', err);
            throw err;
        }
    }

    static async getFilteredProducts({ category, style, minPrice, maxPrice, is_featured }) {
        try {
            let query = 'SELECT * FROM products WHERE 1=1';
            const params = [];
            let paramCount = 1;

            if (category) {
                query += ` AND category = $${paramCount}`;
                params.push(category);
                paramCount++;
            }

            if (style) {
                query += ` AND style = $${paramCount}`;
                params.push(style);
                paramCount++;
            }

            if (minPrice) {
                query += ` AND price >= $${paramCount}`;
                params.push(minPrice);
                paramCount++;
            }

            if (maxPrice) {
                query += ` AND price <= $${paramCount}`;
                params.push(maxPrice);
                paramCount++;
            }

            if (is_featured) {
                query += ` AND is_featured = true`;
            }

            query += ' ORDER BY date_added DESC';

            const result = await pool.query(query, params);
            return result.rows;
        } catch (err) {
            console.error('Error filtering products:', err);
            throw err;
        }
    }
}

module.exports = Product;
