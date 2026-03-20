-- =============================================================================
-- SQL PARA AGREGAR ADMINISTRADORES - Camponuevo
-- =============================================================================
-- IMPORTANTE: Ejecutar DESPUÉS de security.sql
-- =============================================================================

-- Para agregar un admin, primero el usuario debe:
-- 1. Registrarse en la aplicación (se creará en auth.users)
-- 2. Ejecutar este SQL con el ID del usuario

-- EJEMPLO: Agregar admin por user_id
-- Reemplaza 'USER_UUID_AQUI' con el UUID del usuario de auth.users

/*
INSERT INTO admins (user_id, email, added_by)
SELECT 
    id,
    email,
    'system'
FROM auth.users
WHERE id = 'USER_UUID_AQUI'
ON CONFLICT (user_id) DO NOTHING;
*/

-- =============================================================================
-- VER TODOS LOS ADMINES
-- =============================================================================
-- SELECT * FROM admins;

-- =============================================================================
-- VER TODOS LOS USUARIOS REGISTRADOS (para encontrar el user_id)
-- =============================================================================
-- SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- =============================================================================
-- ELIMINAR UN ADMIN
-- =============================================================================
-- DELETE FROM admins WHERE user_id = 'USER_UUID_AQUI';

-- =============================================================================
-- CONTAR ADMINES
-- =============================================================================
-- SELECT COUNT(*) as total_admins FROM admins;
