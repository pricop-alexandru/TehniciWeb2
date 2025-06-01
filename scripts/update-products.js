const pool = require('../config/database');

async function updateProducts() {
    try {
        console.log('Updating product data...');
        
        // Clear existing products
        await pool.query('DELETE FROM products');
        
        // Insert updated product data
        const insertQuery = `
            INSERT INTO products (name, description, image_path, category, style, price, stock, color, tags, is_featured) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        
        const products = [
            ['Fear of Women T-Shirt', 'Dark humor t-shirt with "I am afraid of women" text', '/resources/img/galerie/img1.jpg', 'TSHIRT', 'DARK', 29.99, 100, 'Black', 'dark humor,ironic,edgy,relatable', true],
            ['Girlfriend T-Shirt', 'Ironic t-shirt with "My girlfriend beats me" text', '/resources/img/galerie/img2.jpg', 'TSHIRT', 'DARK', 29.99, 75, 'Black', 'dark humor,ironic,relationships,edgy', true],
            ['Fentanyl T-Shirt', 'Stylized "Fentanyl" text with iconic logo design', '/resources/img/galerie/img3.jpg', 'TSHIRT', 'DARK', 29.99, 150, 'Black', 'dark humor,edgy,iconic,streetwear', false],
            ['Stupid T-Shirt', 'Self-deprecating humor t-shirt stating "Im stupid"', '/resources/img/galerie/img4.jpg', 'TSHIRT', 'DARK', 29.99, 200, 'Black', 'funny,self deprecating,relatable,meme', false],
            ['Circumcision T-Shirt', 'Dark humor t-shirt with "Victim of circumcision" text', '/resources/img/galerie/img5.jpg', 'TSHIRT', 'DARK', 29.99, 50, 'Black', 'dark humor,edgy,controversial,ironic', true],
            ['Beer T-Shirt', 'Humorous "One million beers calling" design', '/resources/img/galerie/img6.jpg', 'TSHIRT', 'DARK', 29.99, 80, 'Black', 'funny,drinking,party,relatable', false],
            ['Gaslighting T-Shirt', 'Ironic "Gaslighting is not real youre just crazy" text', '/resources/img/galerie/img7.jpg', 'TSHIRT', 'DARK', 29.99, 60, 'Black', 'dark humor,ironic,psychological,edgy', true],
            ['Nuclear Boyfriend T-Shirt', 'Quirky "Im in love with my boyfriend dont talk to me he has a nuclear bomb" text', '/resources/img/galerie/img8.jpg', 'TSHIRT', 'DARK', 29.99, 90, 'Black', 'funny,relationships,quirky,meme', false],
            ['Daily Affirmations T-Shirt', 'Modern affirmations like "im goated, we up, i dont miss my ex, it is what it is"', '/resources/img/galerie/img9.jpg', 'TSHIRT', 'DARK', 29.99, 120, 'Black', 'affirmations,modern,relatable,gen z', false],
            ['Illegal Activities T-Shirt', 'Floral design with "Everything I want to do is illegal" text', '/resources/img/galerie/img10.jpg', 'TSHIRT', 'DARK', 29.99, 40, 'Black', 'dark humor,edgy,floral,ironic', true]
        ];
        
        for (const product of products) {
            await pool.query(insertQuery, product);
        }
        
        console.log('Product data updated successfully!');
        
        // Test the connection by fetching products
        const result = await pool.query('SELECT COUNT(*) FROM products');
        console.log(`Total products in database: ${result.rows[0].count}`);
        
    } catch (err) {
        console.error('Error updating products:', err);
    } finally {
        await pool.end();
    }
}

updateProducts();
