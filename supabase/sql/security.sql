-- =============================================================================
-- SQL DE SEGURIDAD PARA SUPABASE - Camponuevo
-- =============================================================================
-- IMPORTANTE: Este script ELIMINA todas las políticas existentes y crea nuevas
-- =============================================================================

-- =============================================================================
-- PARTE 1: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- =============================================================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

-- =============================================================================
-- PARTE 2: CREAR TABLA DE ADMINISTRADORES (si no existe)
-- =============================================================================

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    added_by TEXT
);

-- Habilitar RLS en admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PARTE 3: AGREGAR COLUMNA client_ip A contact_messages (si no existe)
-- =============================================================================

ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS client_ip TEXT;

-- =============================================================================
-- PARTE 4: NUEVAS POLÍTICAS RLS RESTRICTIVAS
-- =============================================================================

-- Función helper para obtener user_id como texto
CREATE OR REPLACE FUNCTION auth_uid_text()
RETURNS TEXT AS $$
BEGIN
    RETURN auth.uid()::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================
-- PRODUCTS (Productos)
-- ========================
CREATE POLICY "products_select_public" ON products
    FOR SELECT USING (true);

CREATE POLICY "products_insert_admin" ON products
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "products_update_admin" ON products
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "products_delete_admin" ON products
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- CATEGORIES (Categorías)
-- ========================
CREATE POLICY "categories_select_public" ON categories
    FOR SELECT USING (true);

CREATE POLICY "categories_insert_admin" ON categories
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "categories_update_admin" ON categories
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "categories_delete_admin" ON categories
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- SUBCATEGORIES (Subcategorías)
-- ========================
CREATE POLICY "subcategories_select_public" ON subcategories
    FOR SELECT USING (true);

CREATE POLICY "subcategories_insert_admin" ON subcategories
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "subcategories_update_admin" ON subcategories
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "subcategories_delete_admin" ON subcategories
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- LABORATORIES (Laboratorios)
-- ========================
CREATE POLICY "laboratories_select_public" ON laboratories
    FOR SELECT USING (true);

CREATE POLICY "laboratories_insert_admin" ON laboratories
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "laboratories_update_admin" ON laboratories
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "laboratories_delete_admin" ON laboratories
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- LABELS (Etiquetas)
-- ========================
CREATE POLICY "labels_select_public" ON labels
    FOR SELECT USING (true);

CREATE POLICY "labels_insert_admin" ON labels
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "labels_update_admin" ON labels
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "labels_delete_admin" ON labels
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- HOME_CATEGORIES (Categorías del inicio)
-- ========================
CREATE POLICY "home_categories_select_public" ON home_categories
    FOR SELECT USING (true);

CREATE POLICY "home_categories_insert_admin" ON home_categories
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "home_categories_update_admin" ON home_categories
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "home_categories_delete_admin" ON home_categories
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- ORDERS (Pedidos)
-- ========================
CREATE POLICY "orders_select_own_or_admin" ON orders
    FOR SELECT USING (
        auth_uid_text() = userid OR
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "orders_insert_public" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_update_own_or_admin" ON orders
    FOR UPDATE USING (
        auth_uid_text() = userid OR
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "orders_delete_admin" ON orders
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- USERS (Usuarios)
-- ========================
CREATE POLICY "users_select_own_or_admin" ON users
    FOR SELECT USING (
        auth_uid_text() = id OR
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "users_insert_auth" ON users
    FOR INSERT WITH CHECK (auth_uid_text() = id);

CREATE POLICY "users_update_own_or_admin" ON users
    FOR UPDATE USING (
        auth_uid_text() = id OR
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "users_delete_admin" ON users
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- ADMINS (Tabla de admins)
-- ========================
CREATE POLICY "admins_select_admin" ON admins
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "admins_insert_admin" ON admins
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "admins_delete_admin" ON admins
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- ========================
-- CONTACT_MESSAGES (Mensajes de contacto)
-- ========================
CREATE POLICY "contact_messages_select_admin" ON contact_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "contact_messages_insert_public" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_messages_update_admin" ON contact_messages
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

CREATE POLICY "contact_messages_delete_admin" ON contact_messages
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text())
    );

-- =============================================================================
-- PARTE 5: FUNCIONES DE SEGURIDAD AUXILIARES
-- =============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM admins WHERE user_id = auth_uid_text());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_order_owner(order_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM orders WHERE id = order_id AND userid = auth_uid_text());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- PARTE 6: ÍNDICES PARA MEJORAR RENDIMIENTO
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_orders_userid ON orders(userid);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- =============================================================================
-- VERIFICACIÓN
-- =============================================================================

SELECT 
    'Políticas RLS configuradas correctamente' AS status,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'products') AS products_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'orders') AS orders_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') AS users_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'admins') AS admins_policies;
