const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function setupDatabase() {
    try {
        console.log('Setting up database...');
        
        // Read the SQL file
        const sqlFile = fs.readFileSync(path.join(__dirname, '../config/init.sql'), 'utf8');
        
        // Execute the SQL commands
        await pool.query(sqlFile);
        
        console.log('Database setup completed successfully!');
        console.log('Tables created and sample data inserted.');
        
        // Test the connection by fetching products
        const result = await pool.query('SELECT COUNT(*) FROM products');
        console.log(`Total products in database: ${result.rows[0].count}`);
        
    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await pool.end();
    }
}

setupDatabase();
