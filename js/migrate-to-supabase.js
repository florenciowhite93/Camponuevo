// js/migrate-to-supabase.js
// Script para migrar datos locales a Supabase
// Incluir este script después de data.js y ejecutarlo manualmente

async function migrateToSupabase() {
    console.log('=== INICIANDO MIGRACIÓN A SUPABASE ===');
    
    if (!isSupabaseAvailable()) {
        console.error('Supabase no está disponible. Asegúrate de que el SDK esté cargado.');
        return;
    }

    // 1. Migrar productos
    console.log('Migrando productos...');
    const products = JSON.parse(localStorage.getItem('camponuevo_products') || '[]');
    if (products.length > 0) {
        await saveProductsToSupabase(products);
        console.log(`✓ ${products.length} productos migrados`);
    }

    // 2. Migrar categorías
    console.log('Migrando categorías...');
    const categories = JSON.parse(localStorage.getItem('camponuevo_categories') || '[]');
    if (categories.length > 0) {
        await saveCategoriesToSupabase(categories);
        console.log(`✓ ${categories.length} categorías migradas`);
    }

    // 3. Migrar subcategorías
    console.log('Migrando subcategorías...');
    const subCategories = JSON.parse(localStorage.getItem('camponuevo_subcategories') || '[]');
    if (subCategories.length > 0) {
        await saveSubCategoriesToSupabase(subCategories);
        console.log(`✓ ${subCategories.length} subcategorías migradas`);
    }

    // 4. Migrar laboratorios
    console.log('Migrando laboratorios...');
    const labs = JSON.parse(localStorage.getItem('camponuevo_laboratories') || '[]');
    if (labs.length > 0) {
        await saveLaboratoriesToSupabase(labs);
        console.log(`✓ ${labs.length} laboratorios migrados`);
    }

    // 5. Migrar etiquetas
    console.log('Migrando etiquetas...');
    const labels = JSON.parse(localStorage.getItem('camponuevo_labels') || '[]');
    if (labels.length > 0) {
        const labelNames = labels.map(l => typeof l === 'string' ? l : l.name);
        await saveLabelsToSupabase(labelNames);
        console.log(`✓ ${labelNames.length} etiquetas migradas`);
    }

    // 6. Migrar categorías del inicio
    console.log('Migrando categorías del inicio...');
    const homeCategories = JSON.parse(localStorage.getItem('camponuevo_home_categories') || '[]');
    if (homeCategories.length > 0) {
        await saveHomeCategoriesToSupabase(homeCategories);
        console.log(`✓ ${homeCategories.length} categorías del inicio migradas`);
    }

    console.log('=== MIGRACIÓN COMPLETADA ===');
    console.log('Ahora los datos se almacenarán en Supabase.');
    
    // Deshabilitar localStorage y usar solo Supabase
    window.USE_LOCALSTORAGE_AS_FALLBACK = true;
}

// Hacer la función disponible globalmente
window.migrateToSupabase = migrateToSupabase;
