// js/cleanup-created-at.js
// Script para limpiar created_at de productos existentes en Supabase
// Ejecutar UNA SOLA VEZ desde la consola del navegador en admin.html

async function cleanupCreatedAt() {
    console.log('=== LIMPIEZA DE created_at ===');
    
    if (!isSupabaseAvailable()) {
        console.error('Supabase no está disponible');
        return;
    }

    try {
        // 1. Limpiar localStorage primero
        localStorage.removeItem('camponuevo_products');
        console.log('✓ localStorage limpiado');
        
        // 2. Obtener todos los productos de Supabase
        const { data: products, error: fetchError } = await window.supabase
            .from('products')
            .select('id, created_at, title');
        
        if (fetchError) throw fetchError;
        console.log(`Productos encontrados: ${products.length}`);
        
        // 3. Actualizar cada producto para quitar created_at
        // En Supabase, para quitar un campo lo establecemos a null
        for (const product of products) {
            const { error: updateError } = await window.supabase
                .from('products')
                .update({ created_at: null })
                .eq('id', product.id);
            
            if (updateError) {
                console.error(`Error actualizando ${product.title}:`, updateError);
            }
        }
        
        console.log('✓ created_at limpiado en Supabase');
        console.log('=== LIMPIEZA COMPLETADA ===');
        console.log('Recarga la página para ver los cambios');
        
    } catch (err) {
        console.error('Error en limpieza:', err.message);
    }
}

// Hacer disponible globalmente
window.cleanupCreatedAt = cleanupCreatedAt;

// Instrucciones
console.log('=== SCRIPT DE LIMPIEZA ===');
console.log('Ejecuta: cleanupCreatedAt()');
console.log('Esto limpiará created_at de todos los productos en Supabase');
