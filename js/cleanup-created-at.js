// js/cleanup-created-at.js
// Script para limpiar created_at y labels de productos existentes en Supabase
// Ejecutar UNA SOLA VEZ desde la consola del navegador en admin.html

async function cleanupCreatedAt() {
    console.log('=== LIMPIEZA TOTAL DE created_at Y labels ===');
    
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
            .select('id, created_at, labels, title');
        
        if (fetchError) throw fetchError;
        console.log(`Productos encontrados: ${products.length}`);
        
        let updated = 0;
        let skipped = 0;
        
        // 3. Actualizar cada producto para quitar created_at y limpiar labels
        for (const product of products) {
            // Limpiar created_at (set null) y labels (vacío array)
            const { error: updateError } = await window.supabase
                .from('products')
                .update({ 
                    created_at: null,
                    labels: []
                })
                .eq('id', product.id);
            
            if (updateError) {
                console.error(`Error actualizando ${product.title}:`, updateError);
                skipped++;
            } else {
                updated++;
            }
        }
        
        console.log(`✓ Productos actualizados: ${updated}`);
        console.log(`✗ Productos con error: ${skipped}`);
        console.log('=== LIMPIEZA COMPLETADA ===');
        console.log('Recarga la página (Ctrl+Shift+R) para ver los cambios');
        
    } catch (err) {
        console.error('Error en limpieza:', err.message);
    }
}

// Hacer disponible globalmente
window.cleanupCreatedAt = cleanupCreatedAt;

// Instrucciones
console.log('=== SCRIPT DE LIMPIEZA ===');
console.log('Ejecuta: cleanupCreatedAt()');
console.log('Esto limpiará created_at y labels de todos los productos en Supabase');
