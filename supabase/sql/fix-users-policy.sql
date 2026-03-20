-- =============================================================================
-- SQL DE CORRECCIÓN PARA USERS Y ADMINS
-- =============================================================================
-- Ejecutar este SQL para corregir problemas con auth.uid()
-- =============================================================================

-- Verificar que la función helper existe
CREATE OR REPLACE FUNCTION auth_uid_text()
RETURNS TEXT AS $$
BEGIN
    RETURN auth.uid()::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hacer que la función sea accessible a usuarios autenticados
GRANT EXECUTE ON FUNCTION auth_uid_text() TO authenticated;

-- Eliminar políticas existentes de users
DROP POLICY IF EXISTS "users_select_own_or_admin" ON users;
DROP POLICY IF EXISTS "users_insert_auth" ON users;
DROP POLICY IF EXISTS "users_update_own_or_admin" ON users;
DROP POLICY IF EXISTS "users_delete_admin" ON users;

-- Recrear políticas con la función helper
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

-- Eliminar políticas existentes de admins
DROP POLICY IF EXISTS "admins_select_admin" ON admins;
DROP POLICY IF EXISTS "admins_insert_admin" ON admins;
DROP POLICY IF EXISTS "admins_delete_admin" ON admins;

-- Recrear políticas de admins
CREATE POLICY "admins_select_admin" ON admins
    FOR SELECT USING (true);

CREATE POLICY "admins_insert_admin" ON admins
    FOR INSERT WITH CHECK (true);

CREATE POLICY "admins_delete_admin" ON admins
    FOR DELETE USING (true);

-- Verificación
SELECT 
    'Políticas corregidas' AS status,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') AS users_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'admins') AS admins_policies;
