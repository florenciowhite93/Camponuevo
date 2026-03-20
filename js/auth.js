// js/auth.js
// Sistema de autenticación usando Supabase Auth
// Reemplaza el sistema anterior de credenciales hardcodeadas

// ============ REGISTRO ============
async function registerUser(email, password, userData = {}) {
    if (!isSupabaseAvailable()) {
        return { success: false, error: 'Supabase no disponible' };
    }

    try {
        // Validaciones
        if (!email || !isValidEmail(email)) {
            return { success: false, error: 'Email inválido' };
        }

        if (!password || password.length < 8) {
            return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
        }

        // Intentar registrar
        const { data, error } = await window.supabase.auth.signUp({
            email: email.toLowerCase().trim(),
            password: password,
            options: {
                data: {
                    name: userData.name || '',
                    role: 'customer' // Por defecto, todos son clientes
                }
            }
        });

        if (error) {
            console.error('Error en registro:', error.message);
            return { success: false, error: error.message };
        }

        if (data.user) {
            // Crear perfil de usuario en la tabla users
            await saveUserProfile({
                id: data.user.id,
                email: data.user.email,
                name: userData.name || '',
                phone: userData.phone || '',
                location: userData.location || '',
                identification: userData.identification || ''
            });

            return { success: true, user: data.user };
        }

        return { success: false, error: 'No se pudo crear el usuario' };
    } catch (err) {
        console.error('Error en registerUser:', err);
        return { success: false, error: 'Error interno del servidor' };
    }
}

// ============ LOGIN ============
async function loginUser(email, password) {
    if (!isSupabaseAvailable()) {
        return { success: false, error: 'Supabase no disponible' };
    }

    try {
        if (!email || !password) {
            return { success: false, error: 'Email y contraseña son requeridos' };
        }

        const { data, session, error } = await window.supabase.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password: password
        });

        if (error) {
            console.error('Error en login:', error.message);
            return { success: false, error: error.message };
        }

        if (data.session) {
            // Verificar si es admin
            const isAdmin = await checkIfAdmin(data.user.id);
            
            return {
                success: true,
                user: data.user,
                session: data.session,
                isAdmin: isAdmin
            };
        }

        return { success: false, error: 'No se pudo iniciar sesión' };
    } catch (err) {
        console.error('Error en loginUser:', err);
        return { success: false, error: 'Error interno del servidor' };
    }
}

// ============ LOGOUT ============
async function logoutUser() {
    if (!isSupabaseAvailable()) {
        return { success: false, error: 'Supabase no disponible' };
    }

    try {
        const { error } = await window.supabase.auth.signOut();
        
        if (error) {
            console.error('Error en logout:', error.message);
            return { success: false, error: error.message };
        }

        // Limpiar datos locales
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('camponuevo_user_id');
        
        return { success: true };
    } catch (err) {
        console.error('Error en logoutUser:', err);
        return { success: false, error: 'Error interno del servidor' };
    }
}

// ============ VERIFICAR SI ES ADMIN ============
async function checkIfAdmin(userId) {
    if (!isSupabaseAvailable() || !userId) return false;

    try {
        // Buscar en la tabla admins o verificar metadata
        const { data, error } = await window.supabase
            .from('admins')
            .select('user_id')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error verificando admin:', error);
            return false;
        }

        return data !== null;
    } catch (err) {
        console.error('Error en checkIfAdmin:', err);
        return false;
    }
}

// ============ GESTIÓN DE ADMINES ============
async function addAdmin(email) {
    if (!isSupabaseAvailable()) return { success: false, error: 'Supabase no disponible' };

    try {
        // Buscar usuario por email
        const { data: users, error: userError } = await window.supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (userError || !users) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        // Agregar a tabla de admins
        const { error: adminError } = await window.supabase
            .from('admins')
            .insert({ user_id: users.id });

        if (adminError) {
            return { success: false, error: adminError.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Error en addAdmin:', err);
        return { success: false, error: 'Error interno' };
    }
}

async function removeAdmin(userId) {
    if (!isSupabaseAvailable()) return { success: false, error: 'Supabase no disponible' };

    try {
        const { error } = await window.supabase
            .from('admins')
            .delete()
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: 'Error interno' };
    }
}

// ============ RECUPERACIÓN DE CONTRASEÑA ============
async function requestPasswordReset(email) {
    if (!isSupabaseAvailable()) {
        return { success: false, error: 'Supabase no disponible' };
    }

    try {
        if (!email || !isValidEmail(email)) {
            return { success: false, error: 'Email inválido' };
        }

        const { error } = await window.supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
            redirectTo: window.location.origin + '/reset-password.html'
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: 'Error interno del servidor' };
    }
}

// ============ CAMBIO DE CONTRASEÑA ============
async function changePassword(currentPassword, newPassword) {
    if (!isSupabaseAvailable()) {
        return { success: false, error: 'Supabase no disponible' };
    }

    try {
        // Verificar que la nueva contraseña sea válida
        if (!newPassword || newPassword.length < 8) {
            return { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres' };
        }

        // Re-autenticar antes de cambiar contraseña
        const session = window.supabase.auth.session();
        if (!session?.user?.email) {
            return { success: false, error: 'No hay sesión activa' };
        }

        // Intentar re-autenticar
        const { error: reauthError } = await window.supabase.auth.signInWithPassword({
            email: session.user.email,
            password: currentPassword
        });

        if (reauthError) {
            return { success: false, error: 'Contraseña actual incorrecta' };
        }

        // Cambiar contraseña
        const { error } = await window.supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Error en changePassword:', err);
        return { success: false, error: 'Error interno del servidor' };
    }
}

// ============ ACTUALIZAR PERFIL ============
async function updateUserProfile(userId, profileData) {
    if (!isSupabaseAvailable()) {
        return { success: false, error: 'Supabase no disponible' };
    }

    try {
        const { error } = await window.supabase
            .from('users')
            .upsert({
                id: userId,
                email: profileData.email || undefined,
                name: profileData.name || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
                location: profileData.location || '',
                identification: profileData.identification || '',
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error actualizando perfil:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Error en updateUserProfile:', err);
        return { success: false, error: 'Error interno del servidor' };
    }
}

// ============ GUARDAR PERFIL DE USUARIO ============
async function saveUserProfile(profileData) {
    if (!isSupabaseAvailable()) {
        return { success: false, error: 'Supabase no disponible' };
    }

    try {
        const { error } = await window.supabase
            .from('users')
            .upsert({
                id: profileData.id,
                email: profileData.email || '',
                name: profileData.name || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
                location: profileData.location || '',
                identification: profileData.identification || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id'
            });

        if (error) {
            console.error('Error guardando perfil:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Error en saveUserProfile:', err);
        return { success: false, error: 'Error interno del servidor' };
    }
}

// ============ OBTENER USUARIO ACTUAL (compatible con código existente) ============
async function getCurrentUser() {
    if (!isSupabaseAvailable()) return null;

    try {
        const session = window.supabase.auth.session();
        if (!session?.user) return null;

        // Intentar obtener perfil de la tabla users
        const { data: userData, error } = await window.supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.warn('Error obteniendo perfil:', error);
        }

        // Combinar datos de auth con perfil
        return {
            id: session.user.id,
            email: session.user.email,
            name: userData?.name || '',
            phone: userData?.phone || '',
            address: userData?.address || '',
            location: userData?.location || '',
            identification: userData?.identification || '',
            createdAt: session.user.created_at,
            lastLogin: userData?.last_login || null,
            isAdmin: await checkIfAdmin(session.user.id)
        };
    } catch (err) {
        console.error('Error en getCurrentUser:', err);
        return null;
    }
}

// ============ VERIFICAR SI ESTÁ AUTENTICADO ============
function isAuthenticated() {
    if (!isSupabaseAvailable()) return false;
    
    const session = window.supabase.auth.session();
    return session?.user !== null;
}

// ============ VALIDACIONES ============
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/[<>]/g, '') // Eliminar < y >
        .replace(/javascript:/gi, '') // Eliminar javascript:
        .replace(/on\w+=/gi, '') // Eliminar event handlers
        .trim();
}

// ============ LISTENERS DE AUTENTICACIÓN ============
function onAuthStateChange(callback) {
    if (!isSupabaseAvailable()) return () => {};

    return window.supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}

// Exportar funciones para uso global
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.checkIfAdmin = checkIfAdmin;
window.changePassword = changePassword;
window.updateUserProfile = updateUserProfile;
window.saveUserProfile = saveUserProfile;
window.requestPasswordReset = requestPasswordReset;
window.addAdmin = addAdmin;
window.removeAdmin = removeAdmin;
window.isAuthenticated = isAuthenticated;
window.sanitizeInput = sanitizeInput;

console.log('✅ Sistema de autenticación con Supabase Auth cargado');
