-- Drop existing table and types if they exist
DROP TABLE IF EXISTS products CASCADE;
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS product_style CASCADE;

-- Create product category enum
CREATE TYPE product_category AS ENUM ('TSHIRT', 'HOODIE');

-- Create product style enum
CREATE TYPE product_style AS ENUM ('DARK', 'WHITE');

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_path VARCHAR(200),
    category product_category,
    style product_style,
    price NUMERIC(10,2),
    stock INTEGER,
    date_added DATE DEFAULT CURRENT_DATE,
    color VARCHAR(50),
    tags TEXT, -- Comma separated values for multiple tags
    is_featured BOOLEAN DEFAULT false
);

-- Reset the sequence to start from 1
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- Insert sample data using the gallery images
INSERT INTO products (name, description, image_path, category, style, price, stock, color, tags, is_featured) VALUES
('Fear of Women T-Shirt', 'Dark humor t-shirt with "I am afraid of women" text', '/resources/img/galerie/img1.jpg', 'TSHIRT', 'DARK', 24.99, 100, 'Black', 'dark humor,ironic,edgy,relatable', true),
('Girlfriend T-Shirt', 'Ironic t-shirt with "My girlfriend beats me" text', '/resources/img/galerie/img2.jpg', 'TSHIRT', 'DARK', 29.99, 75, 'Black', 'dark humor,ironic,relationships,edgy', true),
('Fentanyl T-Shirt', 'Stylized "Fentanyl" text with iconic logo design', '/resources/img/galerie/img3.jpg', 'TSHIRT', 'DARK', 34.99, 150, 'Black', 'dark humor,edgy,iconic,streetwear', false),
('Stupid T-Shirt', 'Self-deprecating humor t-shirt stating "Im stupid"', '/resources/img/galerie/img4.jpg', 'TSHIRT', 'DARK', 19.99, 200, 'Black', 'funny,self deprecating,relatable,meme', false),
('Circumcision T-Shirt', 'Dark humor t-shirt with "Victim of circumcision" text', '/resources/img/galerie/img5.jpg', 'TSHIRT', 'DARK', 39.99, 50, 'Black', 'dark humor,edgy,controversial,ironic', true),
('Beer T-Shirt', 'Humorous "One million beers calling" design', '/resources/img/galerie/img6.jpg', 'TSHIRT', 'DARK', 27.99, 80, 'Black', 'funny,drinking,party,relatable', false),
('Gaslighting T-Shirt', 'Ironic "Gaslighting is not real youre just crazy" text', '/resources/img/galerie/img7.jpg', 'TSHIRT', 'DARK', 32.99, 60, 'Black', 'dark humor,ironic,psychological,edgy', true),
('Nuclear Boyfriend T-Shirt', 'Quirky "Im in love with my boyfriend dont talk to me he has a nuclear bomb" text', '/resources/img/galerie/img8.jpg', 'TSHIRT', 'DARK', 22.99, 90, 'Black', 'funny,relationships,quirky,meme', false),
('Daily Affirmations T-Shirt', 'Modern affirmations like "im goated, we up, i dont miss my ex, it is what it is"', '/resources/img/galerie/img9.jpg', 'TSHIRT', 'DARK', 44.99, 120, 'Black', 'affirmations,modern,relatable,gen z', false),
('Illegal Activities T-Shirt', 'Floral design with "Everything I want to do is illegal" text', '/resources/img/galerie/img10.jpg', 'TSHIRT', 'DARK', 49.99, 40, 'Black', 'dark humor,edgy,floral,ironic', true);
