-- =============================================================================
-- SQL PARA CREAR TABLAS EN SUPABASE
-- =============================================================================
-- Ejecuta este código en el Editor SQL de Supabase (https://supabase.com)
-- =============================================================================

-- Tabla: products (Productos)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT,
    price NUMERIC,
    laboratory TEXT,
    description TEXT,
    subcategory TEXT,
    subcategories TEXT[],
    animalbreeds TEXT[],
    volume TEXT,
    image TEXT,
    drugs TEXT[],
    dose TEXT,
    externallink TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: categories (Categorías)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT,
    subcategories TEXT[],
    svg TEXT
);

-- Tabla: subcategories (Subcategorías)
CREATE TABLE IF NOT EXISTS subcategories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

-- Tabla: laboratories (Laboratorios)
CREATE TABLE IF NOT EXISTS laboratories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

-- Tabla: labels (Etiquetas)
CREATE TABLE IF NOT EXISTS labels (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

-- Tabla: home_categories (Categorías del inicio)
CREATE TABLE IF NOT EXISTS home_categories (
    id TEXT PRIMARY KEY,
    categoryid TEXT,
    position INTEGER
);

-- Tabla: orders (Pedidos)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userid TEXT,
    products TEXT,
    total NUMERIC,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: users (Usuarios)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (cualquiera puede leer)
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public read laboratories" ON laboratories FOR SELECT USING (true);
CREATE POLICY "Public read labels" ON labels FOR SELECT USING (true);
CREATE POLICY "Public read home_categories" ON home_categories FOR SELECT USING (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);

-- Políticas de inserción (cualquiera puede insertar datos)
-- NOTA: En producción, esto debería restrictirse a usuarios autenticados
CREATE POLICY "Allow insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert subcategories" ON subcategories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert laboratories" ON laboratories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert labels" ON labels FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert home_categories" ON home_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert users" ON users FOR INSERT WITH CHECK (true);

-- Políticas de actualización
CREATE POLICY "Allow update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow update categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow update subcategories" ON subcategories FOR UPDATE USING (true);
CREATE POLICY "Allow update laboratories" ON laboratories FOR UPDATE USING (true);
CREATE POLICY "Allow update labels" ON labels FOR UPDATE USING (true);
CREATE POLICY "Allow update home_categories" ON home_categories FOR UPDATE USING (true);
CREATE POLICY "Allow update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Allow update users" ON users FOR UPDATE USING (true);

-- Políticas de eliminación
CREATE POLICY "Allow delete products" ON products FOR DELETE USING (true);
CREATE POLICY "Allow delete categories" ON categories FOR DELETE USING (true);
CREATE POLICY "Allow delete subcategories" ON subcategories FOR DELETE USING (true);
CREATE POLICY "Allow delete laboratories" ON laboratories FOR DELETE USING (true);
CREATE POLICY "Allow delete labels" ON labels FOR DELETE USING (true);
CREATE POLICY "Allow delete home_categories" ON home_categories FOR DELETE USING (true);
CREATE POLICY "Allow delete orders" ON orders FOR DELETE USING (true);
CREATE POLICY "Allow delete users" ON users FOR DELETE USING (true);

-- =============================================================================
-- VERIFICACIÓN
-- =============================================================================
SELECT 'Tablas creadas correctamente' AS status;
