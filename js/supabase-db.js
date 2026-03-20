// js/supabase-db.js
// Funciones de base de datos usando Supabase

// Función para verificar si Supabase está disponible
function isSupabaseAvailable() {
    return window.USE_SUPABASE && window.supabase && typeof window.supabase.from === 'function';
}

// ============ PRODUCTOS ============

// Obtener todos los productos de Supabase
async function getProductsFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    
    try {
        const { data, error } = await window.supabase
            .from('products')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.warn('Error fetching from Supabase (using localStorage fallback):', err.message);
        return null;
    }
}

// Guardar productos en Supabase
async function saveProductsToSupabase(products) {
    if (!isSupabaseAvailable()) return false;
    
    try {
        // Primero eliminar todos los productos existentes
        const { error: deleteError } = await window.supabase
            .from('products')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (deleteError) throw deleteError;
        
        // Insertar los nuevos productos
        const { error: insertError } = await window.supabase
            .from('products')
            .insert(products.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                laboratory: p.laboratory,
                description: p.description,
                subcategory: p.subCategory,
                subcategories: p.subCategories || [],
                animalbreeds: p.animalBreeds || [],
                volume: p.volumeWeight,
                image: p.image,
                drugs: p.drugs || [],
                dose: p.dose,
                externallink: p.externalLink,
                created_at: new Date().toISOString()
            })));
        
        if (insertError) throw insertError;
        
        console.log('Products saved to Supabase');
        return true;
    } catch (err) {
        console.error('Error saving to Supabase:', err.message);
        return false;
    }
}

// ============ CATEGORÍAS ============

async function getCategoriesFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    
    try {
        const { data, error } = await window.supabase
            .from('categories')
            .select('*');
        
        if (error) throw error;
        
        // Transformar formato de Supabase al formato local
        return data.map(c => ({
            id: c.id,
            name: c.name,
            subCategories: c.subcategories || [],
            svg: c.svg
        }));
    } catch (err) {
        console.warn('Error fetching categories from Supabase:', err.message);
        return null;
    }
}

async function saveCategoriesToSupabase(categories) {
    if (!isSupabaseAvailable()) return false;
    
    try {
        await window.supabase.from('categories').delete().neq('id', '');
        
        const { error } = await window.supabase
            .from('categories')
            .insert(categories.map(c => ({
                id: c.id,
                name: c.name,
                subcategories: c.subCategories || [],
                svg: c.svg
            })));
        
        if (error) throw error;
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
        const { data, error } = await window.supabase
            .from('laboratories')
            .select('name');
        
        if (error) throw error;
        return data.map(l => l.name);
    } catch (err) {
        console.warn('Error fetching laboratories from Supabase:', err.message);
        return null;
    }
}

async function saveLaboratoriesToSupabase(labs) {
    if (!isSupabaseAvailable()) return false;
    
    try {
        await window.supabase.from('laboratories').delete().neq('id', '');
        
        const { error } = await window.supabase
            .from('laboratories')
            .insert(labs.map(name => ({ name })));
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error saving laboratories to Supabase:', err.message);
        return false;
    }
}

// ============ HOME CATEGORIES ============

async function getHomeCategoriesFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    
    try {
        const { data, error } = await window.supabase
            .from('home_categories')
            .select('*')
            .order('position');
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.warn('Error fetching home categories from Supabase:', err.message);
        return null;
    }
}

async function saveHomeCategoriesToSupabase(homeCategories) {
    if (!isSupabaseAvailable()) return false;
    
    try {
        await window.supabase.from('home_categories').delete().neq('id', '');
        
        const { error } = await window.supabase
            .from('home_categories')
            .insert(homeCategories.map((hc, index) => ({
                id: hc.id,
                categoryid: hc.categoryId,
                position: index
            })));
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error saving home categories to Supabase:', err.message);
        return false;
    }
}

// ============ PEDIDOS ============

async function getOrdersFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    
    try {
        const { data, error } = await window.supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.warn('Error fetching orders from Supabase:', err.message);
        return null;
    }
}

async function saveOrderToSupabase(order) {
    if (!isSupabaseAvailable()) return false;
    
    try {
        const { error } = await window.supabase
            .from('orders')
            .insert({
                id: order.id,
                userid: order.userId,
                products: JSON.stringify(order.products),
                total: order.total,
                status: order.status,
                created_at: order.createdAt || new Date().toISOString()
            });
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error saving order to Supabase:', err.message);
        return false;
    }
}

// ============ USUARIOS ============

async function getUsersFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    
    try {
        const { data, error } = await window.supabase
            .from('users')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.warn('Error fetching users from Supabase:', err.message);
        return null;
    }
}

async function saveUserToSupabase(user) {
    if (!isSupabaseAvailable()) return false;
    
    try {
        const { error } = await window.supabase
            .from('users')
            .upsert({
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                created_at: user.createdAt || new Date().toISOString()
            });
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error saving user to Supabase:', err.message);
        return false;
    }
}

// ============ ETIQUETAS ============

async function getLabelsFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    
    try {
        const { data, error } = await window.supabase
            .from('labels')
            .select('name');
        
        if (error) throw error;
        return data.map(l => l.name);
    } catch (err) {
        console.warn('Error fetching labels from Supabase:', err.message);
        return null;
    }
}

async function saveLabelsToSupabase(labels) {
    if (!isSupabaseAvailable()) return false;
    
    try {
        await window.supabase.from('labels').delete().neq('id', '');
        
        const { error } = await window.supabase
            .from('labels')
            .insert(labels.map(name => ({ name })));
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error saving labels to Supabase:', err.message);
        return false;
    }
}

// ============ SUBCATEGORÍAS ============

async function getSubCategoriesFromSupabase() {
    if (!isSupabaseAvailable()) return null;
    
    try {
        const { data, error } = await window.supabase
            .from('subcategories')
            .select('name');
        
        if (error) throw error;
        return data.map(s => s.name);
    } catch (err) {
        console.warn('Error fetching subcategories from Supabase:', err.message);
        return null;
    }
}

async function saveSubCategoriesToSupabase(subCategories) {
    if (!isSupabaseAvailable()) return false;
    
    try {
        await window.supabase.from('subcategories').delete().neq('id', '');
        
        const { error } = await window.supabase
            .from('subcategories')
            .insert(subCategories.map(name => ({ name })));
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error saving subcategories to Supabase:', err.message);
        return false;
    }
}

console.log('Supabase DB functions loaded');
