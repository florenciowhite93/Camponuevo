// js/supabase-config.js
// Configuración segura de Supabase con Supabase Auth
// IMPORTANTE: Reemplaza los valores con tus nuevas claves del dashboard de Supabase

const SUPABASE_URL = 'https://itlczokcdxgzgqrortpm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGN6b2tjZHhnemdxcm9ydHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDk1MzcsImV4cCI6MjA4OTE4NTUzN30.4j9YbZbeiOJQ6xnoyVjdW8xlv8qsrZnqgmJ3E6jkdCg';

// Cliente Supabase global
if (typeof window !== 'undefined' && !window.supabase) {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            emailRedirectTo: window.location.origin + '/verify-email.html'
        }
    });

    // Configurar persistencia de sesión
    window.supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            console.log('Sesión restaurada:', session.user.email);
        }
    });

    // Escuchar cambios de autenticación
    window.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            console.log('Usuario autenticado:', session?.user?.email);
            // Guardar info del usuario en localStorage de forma segura
            localStorage.setItem('camponuevo_user_id', session?.user?.id || '');
        } else if (event === 'SIGNED_OUT') {
            console.log('Sesión cerrada');
            localStorage.removeItem('camponuevo_user_id');
        }
    });

    console.log('✅ Supabase client inicializado correctamente');
}

// Bandera para usar Supabase
window.USE_SUPABASE = true;

// Verificar disponibilidad de Supabase
function isSupabaseAvailable() {
    return window.USE_SUPABASE === true &&
        window.supabase &&
        typeof window.supabase.from === 'function' &&
        typeof window.supabase.auth === 'object';
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return window.supabase?.auth?.session()?.user != null;
}

// Obtener usuario actual de forma segura
function getCurrentAuthUser() {
    return window.supabase?.auth?.session()?.user || null;
}
