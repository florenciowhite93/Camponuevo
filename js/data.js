// js/data.js
// Funciones de acceso a datos usando Supabase
// La configuración de Supabase se carga desde supabase-config.js

// Función para verificar si Supabase está disponible
function isSupabaseAvailable() {
    return window.supabase && typeof window.supabase.from === 'function';
}

function addAutoLabel(product) {
    if (!product.created_at) return product;
    const createdDate = new Date(product.created_at);
    const now = new Date();
    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 30) {
        if (!product.labels) product.labels = [];
        if (!product.labels.includes('Nuevo')) {
            product.labels = ['Nuevo', ...product.labels];
        }
    }
    return product;
}

// ============ PRODUCTOS ============
async function getProductsFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    try {
        const { data, error } = await window.supabase.from('products').select('*');
        if (error) throw error;
        return data;
    } catch (err) {
        console.warn('Supabase products not available:', err.message);
        return null;
    }
}

async function saveProductsToSupabase(products) {
    if (!isSupabaseAvailable()) return false;
    try {
        await window.supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const { error } = await window.supabase.from('products').insert(products.map(p => ({
            id: p.id, title: p.title, price: p.price, laboratory: p.laboratory,
            description: p.description, subcategory: p.subCategory,
            subcategories: p.subCategories || [], animalbreeds: p.animalBreeds || [],
            volume: p.volumeWeight, image: p.image, drugs: p.drugs || [],
            dose: p.dose, externallink: p.externalLink, created_at: new Date().toISOString(),
            labels: p.labels || []
        })));
        if (error) throw error;
        console.log('Products saved to Supabase');
        return true;
    } catch (err) {
        console.error('Error saving products to Supabase:', err.message);
        return false;
    }
}

// ============ CATEGORÍAS ============
async function getCategoriesFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    try {
        const { data, error } = await window.supabase.from('categories').select('*');
        if (error) throw error;
        return data.map(c => ({ id: c.id, name: c.name, subCategories: c.subcategories || [], svg: c.svg }));
    } catch (err) {
        console.warn('Supabase categories not available:', err.message);
        return null;
    }
}

async function saveCategoriesToSupabase(categories) {
    if (!isSupabaseAvailable()) {
        console.log('Supabase not available, skipping categories save');
        return false;
    }
    try {
        console.log('Saving categories to Supabase:', categories.length);
        await window.supabase.from('categories').delete().neq('id', '');
        const { error } = await window.supabase.from('categories').insert(
            categories.map(c => ({ id: c.id, name: c.name, subcategories: c.subCategories || [], svg: c.svg }))
        );
        if (error) throw error;
        console.log('Categories saved to Supabase successfully');
        return true;
    } catch (err) {
        console.error('Error saving categories to Supabase:', err.message);
        return false;
    }
}

// ============ LABORATORIOS ============
async function getLaboratoriesFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    try {
        const { data, error } = await window.supabase.from('laboratories').select('name');
        if (error) throw error;
        return data.map(l => l.name);
    } catch (err) {
        return null;
    }
}

async function saveLaboratoriesToSupabase(labs) {
    if (!isSupabaseAvailable()) return false;
    try {
        await window.supabase.from('laboratories').delete().neq('id', '');
        const { error } = await window.supabase.from('laboratories').insert(labs.map(name => ({ name })));
        if (error) throw error;
        return true;
    } catch (err) {
        return false;
    }
}

async function deleteLaboratoryFromSupabase(name) {
    if (!isSupabaseAvailable()) return false;
    try {
        console.log('Deleting lab from Supabase:', name);
        const { error } = await window.supabase.from('laboratories').delete().eq('name', name);
        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }
        console.log('Lab deleted from Supabase successfully');
        return true;
    } catch (err) {
        console.error('Error deleting lab from Supabase:', err);
        return false;
    }
}

// ============ HOME CATEGORIES ============
async function getHomeCategoriesFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    try {
        const { data, error } = await window.supabase.from('home_categories').select('*').order('position');
        if (error) throw error;
        return data;
    } catch (err) {
        return null;
    }
}

async function saveHomeCategoriesToSupabase(homeCategories) {
    if (!isSupabaseAvailable()) return false;
    try {
        console.log('Saving home categories to Supabase:', homeCategories);
        await window.supabase.from('home_categories').delete().neq('id', '');
        const { error } = await window.supabase.from('home_categories').insert(
            homeCategories.map((hc, index) => ({ 
                id: hc.id, 
                categoryid: hc.id, 
                position: index,
                svg: hc.svg || null
            }))
        );
        if (error) throw error;
        console.log('Home categories saved to Supabase');
        return true;
    } catch (err) {
        console.error('Error saving home categories to Supabase:', err);
        return false;
    }
}

// ============ PEDIDOS ============
async function getOrdersFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    try {
        const { data, error } = await window.supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    } catch (err) {
        return null;
    }
}

async function saveOrderToSupabase(order) {
    if (!isSupabaseAvailable()) return false;
    try {
        const { error } = await window.supabase.from('orders').insert({
            id: order.id, 
            userid: order.userId, 
            products: JSON.stringify(order.items),
            customer_info: JSON.stringify(order.customerInfo),
            subtotal: order.subtotal,
            iva: order.iva,
            total: order.total, 
            status: order.status, 
            created_at: order.createdAt || new Date().toISOString()
        });
        if (error) {
            console.error('Error saving order to Supabase:', error);
            throw error;
        }
        console.log('Order saved to Supabase:', order.id);
        return true;
    } catch (err) {
        console.error('Error saving order to Supabase:', err);
        return false;
    }
}

// ============ ETIQUETAS ============
async function getLabelsFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    try {
        const { data, error } = await window.supabase.from('labels').select('name');
        if (error) throw error;
        return data.map(l => l.name);
    } catch (err) {
        return null;
    }
}

async function saveLabelsToSupabase(labels) {
    if (!isSupabaseAvailable()) return false;
    try {
        await window.supabase.from('labels').delete().neq('id', '');
        const { error } = await window.supabase.from('labels').insert(labels.map(name => ({ name })));
        if (error) throw error;
        return true;
    } catch (err) {
        return false;
    }
}

// ============ SUBCATEGORÍAS ============
async function getSubCategoriesFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    try {
        const { data, error } = await window.supabase.from('subcategories').select('name');
        if (error) throw error;
        return data.map(s => s.name);
    } catch (err) {
        return null;
    }
}

async function saveSubCategoriesToSupabase(subCategories) {
    if (!isSupabaseAvailable()) return false;
    try {
        await window.supabase.from('subcategories').delete().neq('id', '');
        const { error } = await window.supabase.from('subcategories').insert(subCategories.map(name => ({ name })));
        if (error) throw error;
        return true;
    } catch (err) {
        return false;
    }
}

// Exportar funciones
window.getProductsFromSupabase = getProductsFromSupabase;
window.saveProductsToSupabase = saveProductsToSupabase;
window.getCategoriesFromSupabase = getCategoriesFromSupabase;
window.saveCategoriesToSupabase = saveCategoriesToSupabase;
window.getLaboratoriesFromSupabase = getLaboratoriesFromSupabase;
window.saveLaboratoriesToSupabase = saveLaboratoriesToSupabase;
window.deleteLaboratoryFromSupabase = deleteLaboratoryFromSupabase;
window.getHomeCategoriesFromSupabase = getHomeCategoriesFromSupabase;
window.saveHomeCategoriesToSupabase = saveHomeCategoriesToSupabase;
window.getOrdersFromSupabase = getOrdersFromSupabase;
window.saveOrderToSupabase = saveOrderToSupabase;
window.getLabelsFromSupabase = getLabelsFromSupabase;
window.saveLabelsToSupabase = saveLabelsToSupabase;
window.getSubCategoriesFromSupabase = getSubCategoriesFromSupabase;
window.saveSubCategoriesToSupabase = saveSubCategoriesToSupabase;

console.log('✅ Data layer with Supabase integration loaded');
