// js/data.js
// Auto-generated from catalog_products.csv on 2026-03-11

// Configuración de Supabase
(function() {
    if (typeof window !== 'undefined' && !window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = function() {
            window.supabase = window.supabase.createClient(
                'https://itlczokcdxgzgqrortpm.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGN6b2tjZHhnemdxcm9ydHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTcwMDAsImV4cCI6MjA2MTA3MzAwMH0.K4AXxMHVd0VqeFR9gUGMSyq-zVYHj4pH1vsH5KGTFqc'
            );
            console.log('Supabase client initialized from data.js');
        };
        document.head.appendChild(script);
    }
})();

// Bandera para usar Supabase (true = habilitar, false = solo localStorage)
window.USE_SUPABASE = true;

// Función para verificar si Supabase está disponible
function isSupabaseAvailable() {
    return window.USE_SUPABASE === true && window.supabase && typeof window.supabase.from === 'function';
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
            dose: p.dose, externallink: p.externalLink, created_at: new Date().toISOString()
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
    if (!isSupabaseAvailable()) return false;
    try {
        await window.supabase.from('categories').delete().neq('id', '');
        const { error } = await window.supabase.from('categories').insert(
            categories.map(c => ({ id: c.id, name: c.name, subcategories: c.subCategories || [], svg: c.svg }))
        );
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
        await window.supabase.from('home_categories').delete().neq('id', '');
        const { error } = await window.supabase.from('home_categories').insert(
            homeCategories.map((hc, index) => ({ id: hc.id, categoryid: hc.categoryId, position: index }))
        );
        if (error) throw error;
        return true;
    } catch (err) {
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
            id: order.id, userid: order.userId, products: JSON.stringify(order.products),
            total: order.total, status: order.status, created_at: order.createdAt || new Date().toISOString()
        });
        if (error) throw error;
        return true;
    } catch (err) {
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

// Product catalog (imported from Wix CSV export)
const defaultProducts = [
  {
    "id": "eb90318a-69c7-f3fc-f31f-cc3435b85a45",
    "title": "Dardox Konig 5lt.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Dardox es un antiparasitario externo de aplicación tópicos, formulado a base de la combinación de flumetrina y eprinomectina. Está autorizado para el control estratégico de garrapatas, sarna y piojos chupadores y masticadores. Dardox es el primer pour on sarnicida, garrapaticida y piojicida del mercado. Posee 7 características como producto para el control de寄生虫 externos: su efecto garrapati",
    "image": "https://static.wixstatic.com/media/06b954_6a7d4ff81e2e468f81373e81e89c20b9~mv2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "Cada 100 mL contiene: Eprinomectina 0,5 g; Flumetrina 2 g; Butóxido de piperonilo 6g; excipientes c",
    "externalLink": "https://www.koniglab.com/en/producto/dardox/",
    "price": 480862,
    "subCategories": ["Productos destacados"]
  },
  {
    "id": "63b2be70-b606-1d59-5255-2c1c93a8d272",
    "title": "Pomada Curabichera Bactrovet Plata Konig 1,2kg.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antimiásico, repelente, bactericida, antifúngico, cicatrizante, epitelizador y hemostático - Tratamiento de todo tipo de heridas en todas las especies - Tratamiento y prevención de bicheras en intervenciones quirúrgicas como castración, y heridas de cualquier origen - Heridas en general. - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_80d24fdf84a94958a3d4bc9e26cafa2d~mv2.png",
    "volumeWeight": "1,2kg.",
    "dose": "",
    "drugs": "Cada 100 gramos contiene: Sulfadiazina de Plata, 0,1 gr",
    "externalLink": "http://www.koniglab.com/producto/bactrovet-plata-pasta/",
    "price": 46430,
    "subCategories": ["Productos destacados"]
  },
  {
    "id": "ec15408d-dd50-5067-491b-751d6f7d4e26",
    "title": "Bovikalc Boehringer Ingelheim x 24 Bolos",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Aporte de calcio por via oral. - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_3e40ada2544b4f5e8929fb9dccaea570~mv2.png",
    "volumeWeight": "24 Bolos",
    "dose": "",
    "drugs": "Cloruro de calcio, Sulfato de calcio mono y diglicéridos de ácidos grasos esterificados con ácido acético",
    "externalLink": "https://www.boehringer-ingelheim.com/sa/salud-animal/productos/bovikalcr",
    "price": 281051.75,
    "subCategories": ["Productos destacados"]
  },
  {
    "id": "85038c9f-69e4-6354-d478-148632ef0cac",
    "title": "Ecto Tak Zoovet x 5lt.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo - Garrapaticida sistémico pour on - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b76e8ffb68fa40b88beefe2eb7e66736~mv2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "Fluazurón 2,5%",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/328-ecto-tak",
    "price": 0,
    "subCategories": ["Productos destacados"]
  },
  {
    "id": "d9f89f7f-29ca-dff0-4fb1-2be877d70856",
    "title": "Hepatone Richmond 250ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Protector y estimulante de la función hepática - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_5e5517ddbef14b228e48a75c8af74e95~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Sorbitol: 21 g D-L Metionina: 1,5 g Tiamina HCl: 0,30 g Ácido Tióctico: 0,20 g Excipientes c",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=30&amp;id=31&amp;pg=1",
    "price": 0,
    "subCategories": ["Productos destacados"]
  },
  {
    "id": "d73e630f-3736-8ed3-312b-adcb58b6043d",
    "title": "DIB 1gr Zoetis Syntex 10 dispositivos.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "El Dispositivo Intravaginal Bovino Zoetis (DIB) es un dispositivo intravaginal impregnado de progesterona utilizado para la regulación del ciclo estral en bovinos. La progesterona liberada a partir de la colocación del dispositivo tiene un papel importante sobre la dinámica folicular ovárica. Los niveles supraluteales > 1 ng/ mL obtenidos a los pocos minutos de la introducción del dispositivo, pro",
    "image": "https://static.wixstatic.com/media/06b954_6076b4a48f5446b8bac4e08585606b1a~mv2.png",
    "volumeWeight": "1gr Zoetis Syntex 10 dispositivos.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0,
    "subCategories": ["Productos destacados"]
  },
  {
    "id": "82aba63a-839e-ab8a-aec8-6834247b7cf3",
    "title": "Tiamina Rio de Janeiro 50ml.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Profilaxis y tratamiento de estados carenciales de tiamina.. - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_d7a85f13d08848f7ad4df9f32ae78c6f~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Vitamina B110g Vehículo c",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/91",
    "price": 0,
    "subCategories": ["Productos destacados"]
  },
  {
    "id": "cf33cc25-4e7a-46d9-f52f-b6238b7d3dc8",
    "title": "Birmicina E25 Burnet 40ml",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "el sulfato de estreptomicina es un antibiótico aminoglucósido especialmente orientado hacia los microorganismos Gram negativos y Gram positivos. Difunde con rapidez por todo el organismo alcanzando incluso, al humor acuoso y vítreo. Supera con facilidad la placenta, pasa al líquido amniótico y a la sangre fetal, en la que logra concentraciones cercanas a las de la mitad de la sangre materna. - Par",
    "image": "https://static.wixstatic.com/media/06b954_9adbe47cf55e45e6be35e349788be894~mv2.png",
    "volumeWeight": "40ml",
    "dose": "",
    "drugs": "Estreptomicina sulfato 25 g",
    "externalLink": "https://burnet.com.ar/birmicinae25/",
    "price": 5323.4,
    "subCategories": ["Productos destacados"]
  },
  {
    "id": "63b2be70-b606-1d59-5255-2c1c93a8d272",
    "title": "Pomada Curabichera Bactrovet Plata Konig 1,2kg.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antimiásico, repelente, bactericida, antifúngico, cicatrizante, epitelizador y hemostático - Tratamiento de todo tipo de heridas en todas las especies - Tratamiento y prevención de bicheras en intervenciones quirúrgicas como castración, y heridas de cualquier origen - Heridas en general. - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_80d24fdf84a94958a3d4bc9e26cafa2d~mv2.png",
    "volumeWeight": "1,2kg.",
    "dose": "",
    "drugs": "Cada 100 gramos contiene: Sulfadiazina de Plata, 0,1 gr",
    "externalLink": "http://www.koniglab.com/producto/bactrovet-plata-pasta/",
    "price": 46430
  },
  {
    "id": "ec15408d-dd50-5067-491b-751d6f7d4e26",
    "title": "Bovikalc Boehringer Ingelheim x 24 Bolos",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Aporte de calcio por via oral. - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_3e40ada2544b4f5e8929fb9dccaea570~mv2.png",
    "volumeWeight": "24 Bolos",
    "dose": "",
    "drugs": "Cloruro de calcio, Sulfato de calcio mono y diglicéridos de ácidos grasos esterificados con ácido acético",
    "externalLink": "https://www.boehringer-ingelheim.com/sa/salud-animal/productos/bovikalcr",
    "price": 281051.75
  },
  {
    "id": "85038c9f-69e4-6354-d478-148632ef0cac",
    "title": "Ecto Tak Zoovet x 5lt.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo - Garrapaticida sistémico pour on - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b76e8ffb68fa40b88beefe2eb7e66736~mv2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "Fluazurón 2,5%",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/328-ecto-tak",
    "price": 0
  },
  {
    "id": "d9f89f7f-29ca-dff0-4fb1-2be877d70856",
    "title": "Hepatone Richmond 250ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Protector y estimulante de la función hepática - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_5e5517ddbef14b228e48a75c8af74e95~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Sorbitol: 21 g D-L Metionina: 1,5 g Tiamina HCl: 0,30 g Ácido Tióctico: 0,20 g Excipientes c",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=30&amp;id=31&amp;pg=1",
    "price": 0
  },
  {
    "id": "d73e630f-3736-8ed3-312b-adcb58b6043d",
    "title": "DIB 1gr Zoetis Syntex 10 dispositivos.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "El Dispositivo Intravaginal Bovino Zoetis (DIB) es un dispositivo intravaginal impregnado de progesterona utilizado para la regulación del ciclo estral en bovinos. La progesterona liberada a partir de la colocación del dispositivo tiene un papel importante sobre la dinámica folicular ovárica. Los niveles supraluteales > 1 ng/ mL obtenidos a los pocos minutos de la introducción del dispositivo, pro",
    "image": "https://static.wixstatic.com/media/06b954_6076b4a48f5446b8bac4e08585606b1a~mv2.png",
    "volumeWeight": "1gr Zoetis Syntex 10 dispositivos.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "82aba63a-839e-ab8a-aec8-6834247b7cf3",
    "title": "Tiamina Rio de Janeiro 50ml.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Profilaxis y tratamiento de estados carenciales de tiamina.. - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_d7a85f13d08848f7ad4df9f32ae78c6f~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Vitamina B110g Vehículo c",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/91",
    "price": 0
  },
  {
    "id": "cf33cc25-4e7a-46d9-f52f-b6238b7d3dc8",
    "title": "Birmicina E25 Burnet 40ml",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "el sulfato de estreptomicina es un antibiótico aminoglucósido especialmente orientado hacia los microorganismos Gram negativos y Gram positivos. Difunde con rapidez por todo el organismo alcanzando incluso, al humor acuoso y vítreo. Supera con facilidad la placenta, pasa al líquido amniótico y a la sangre fetal, en la que logra concentraciones cercanas a las de la mitad de la sangre materna. - Par",
    "image": "https://static.wixstatic.com/media/06b954_9adbe47cf55e45e6be35e349788be894~mv2.png",
    "volumeWeight": "40ml",
    "dose": "",
    "drugs": "Estreptomicina sulfato 25 g",
    "externalLink": "https://burnet.com.ar/birmicinae25/",
    "price": 5323.4
  },
  {
    "id": "6dcf5100-9be9-6024-0dcb-9aac6829dbad",
    "title": "Lidocalm Pro-Ser x100",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución anestésica a base de Lidocaína para animales grandes y pequeños. - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_d0a12d241ec44a8b8337e41320ec885d~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Lidocaina:2 g Excipientes c",
    "externalLink": "http://www.labproser.com.ar/prod_03.htm​​​​​​​",
    "price": 0
  },
  {
    "id": "01b61f8c-6be5-5308-76ba-405f1445501a",
    "title": "Fortevit ADE Leon Pharma 100ml.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Mineralizante - Vitamínico. Solución inyectable. - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6e0573375dc64bceab8f5c9787752e39~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Vitamina A 25",
    "externalLink": "",
    "price": 13698.75
  },
  {
    "id": "daa22cea-0d09-2028-8b3c-ae4000b9360e",
    "title": "Floxanol 5 Leon Pharma 100ml.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antimicrobiano inyectable de amplio espectro. Quinolona.. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_fa1631c13be043f4996ec0acf2456cfb~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Enrofloxacina5% Animales: Bovinos",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "c926018b-c700-21f2-f603-c35e6b7c866b",
    "title": "Tilmilon 300 Leon Pharma 100ml.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico macrólido de amplio espectro.. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_70ae13837783406ea0e637e81a0591cc~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Tilmicosina30 g Excipientes c",
    "externalLink": "",
    "price": 13647.2
  },
  {
    "id": "70c79e5f-edef-5ff7-3041-b5f7e6f001c3",
    "title": "Flok 3,15 Biogenesis Bago 500ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo altamente efectivo para el control y tratamiento de los parásitos gastrointestinales y pulmonares, sarna, miasis y garrapatas de bovinos y ovinos. Solución inyectable de doramectina al 3,15% lista para usar. - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6d98c9948ea94367aa81cdf568008e1a~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Doramectina, 3,15 g Excipientes, c",
    "externalLink": "https://biovademecum.biogenesisbago.com/endectocidas/flok-315",
    "price": 0
  },
  {
    "id": "a3a9698a-6a7f-79c6-9247-e27ba958e68d",
    "title": "Rochy Spray Zoovet 267ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario externo - Curabicheras - Antimicrobiano - Cicatrizante - Para: Bovinos - Ovinos - Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_ede56d1b9acb45ada129de633e954b96~mv2.png",
    "volumeWeight": "267ml.",
    "dose": "",
    "drugs": "Contiene: Fipronil 1,372 g Clorhexidina Acetato 0,17 g Vehículo con citronella, pasta de aluminio y propelente",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/330-rochy-curabicheras-aerosol",
    "price": 0
  },
  {
    "id": "9ebaf2b8-8f42-3377-06d1-3af42ad22d6f",
    "title": "Zeleris Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibióticos - Quimioterápicos clásicos y combinados - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e599bafb3fd348ad9724f00b8209229f~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Florfenicol: 0",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/587-zeleris",
    "price": 0
  },
  {
    "id": "3f906b70-fd14-1a4a-1fcf-91c8616b9c0e",
    "title": "Overmectina F Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo. - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e2bb98a334bc4ff7aaff8d8ae1011070~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Ivermectina 1 g Clorsulón 10 g Agentes de formulación c",
    "externalLink": "https://over.com.ar/product/overmectina-f/",
    "price": 0
  },
  {
    "id": "69f6f94b-6a0f-22d8-853d-826fe153553d",
    "title": "Synect Polvo Over 400gr.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario externo. Curabicheras. Cicatrizante con bacteriostático. - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_5144eff3895c49fdb71d0ba877773f09~mv2.png",
    "volumeWeight": "400gr.",
    "dose": "",
    "drugs": "Cada 100 g contiene: Cipermetrina 1 g Carbaril 2 g Sulfametazina sódica 1 g Óxido de zinc 10 g Esencia de pino 0,2 g Age",
    "externalLink": "https://over.com.ar/product/synect-curabicheras-polvo/",
    "price": 0
  },
  {
    "id": "6f0e3039-1c58-8a64-0498-727a9f4e6a51",
    "title": "Aplonal Konig 50ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "equino"
    ],
    "description": "El Analgésico, antipirético, antiendotóxico y antiinflamatorio no esteroide de máxima potencia. - Para Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_fca039cd63ab4d62a6451a08f490db66~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Cada mL contiene: Flunixín base (como meglumina) 50 mg Excipientes y vehículo c",
    "externalLink": "https://www.koniglab.com/producto/aplonal-5/",
    "price": 8838
  },
  {
    "id": "40f62051-3f56-b43b-a0cc-ed9760a1020d",
    "title": "Kuramicina L.A. Konig 500ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable de acción inmediata y prolongada. - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_46013363b3cf4f1fa416cf36cbded3d3~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Oxitetraciclina base (como clorhidrato) 20 g",
    "externalLink": "http://www.koniglab.com/producto/kuramicina-l-a/",
    "price": 32414.25
  },
  {
    "id": "8fbea780-c771-cf4f-b5c3-13acb4808132",
    "title": "Bactrovet Plata AM Dualtap Spray Curabichera Konig 420ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Aerosol con cánula incorporada para heridas profundasCurabichera cicatrizante hemostático de alta adherencia. - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_e7f3aa831c804d6e9a6a28aa0422fb40~mv2.png",
    "volumeWeight": "420ml.",
    "dose": "",
    "drugs": "Cada 100 gramos de concentrado contiene: Sulfadiazina de Plata 0,1 gramos Aluminio 5,0 gramos DDVP 1,6 gramos Cipermetri",
    "externalLink": "https://www.koniglab.com/en/producto/bactrovet-plata-dual-tap/",
    "price": 0
  },
  {
    "id": "ea3b8680-d5db-1e1b-edc9-db175369d37a",
    "title": "Duphamox LA Zoetis 100ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "La amoxicilina es un antibiótico bactericida de amplio espectro perteneciente a los betalactámicos. Impide la síntesis de la pared celular bacteriana por inhibición de las enzimas traspeptidasa y carboxipeptidasa. Formulado para alcanzar una larga acción, llegando a las mayores concentraciones séricas en poco menos de dos horas persistiendo como mínimo 4 horas. Activo frente a Leptospira spp, Gram",
    "image": "https://static.wixstatic.com/media/06b954_af7c0983a00f4a80a706e4eb77b434a7~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Amoxicilina, trihidrato: 15 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/duphamox.aspx",
    "price": 0
  },
  {
    "id": "19a98cf6-ca69-c577-7881-11ad73c5955d",
    "title": "Randon Titanium Konig 500ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida (endoparasiticida y ectoparasiticida) inyectable - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ac97de54cda141a3b8a2965811c36f22~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 mL contiene: Ivermectina 3,15 gramos; excipientes c",
    "externalLink": "https://www.koniglab.com/producto/randon-titanium/",
    "price": 33932.1
  },
  {
    "id": "bac900e1-9375-b61b-a92c-c6d039ba8bc4",
    "title": "Micospectone Von Franken 250ml.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico de amplio espectro - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_acdc7f60ea4848f28b3144547fa5cda6~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.fatrovonfranken.com/detalle-productos/micospectone/",
    "price": 0
  },
  {
    "id": "4326e80f-f751-4c21-fdee-dab31f7cbe70",
    "title": "Encefalomielitis Equina Providean Tecnovax 20 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "equino"
    ],
    "description": "Prevención o profilaxis de la Encefalomielitis en Equinos. - Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_bd5dab6eb24344f68ed16d9eeaa514bd~mv2.png",
    "volumeWeight": "20 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-contendor-encefalo/",
    "price": 0
  },
  {
    "id": "f901436d-496f-5cf0-9f38-25f8aa6dbe0e",
    "title": "Linco 300 Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Infecciones por gérmenes Gram (+) del tracto respiratorio, genitourinario, piel y tejidos blandos, huesos y articulaciones. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ccb9423d14ca43ffb06016085e15849e~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Lincomicina (como Clorhidrato) 30 %",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/256-linco-300-ga",
    "price": 41359.45
  },
  {
    "id": "72901abe-0a67-edfa-9e3b-13e3a2b64271",
    "title": "Tilmicofull Dúo Inyectable Zoovet 250ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento de enfermedades infecciosas causadas por microorganismos Gram (+), Gram (-) y micoplasmas sensibles a la Tilmicosina. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_0965c7a14480411389db90b74cbc75fa~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Tilmicosina 30% Flunixin 3,9% Animales: Bovinos",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/292-tilmicofull-duo-inyectable",
    "price": 63288.45
  },
  {
    "id": "a9dcd8c7-fa5a-ea08-214f-db2ceb5360f9",
    "title": "Tilmicofull Dúo Inyectable Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento de enfermedades infecciosas causadas por microorganismos Gram (+), Gram (-) y micoplasmas sensibles a la Tilmicosina. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_d36c3f443fd04a4eb5316d7b692fd214~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Tilmicosina 30% Flunixin 3,9% Animales: Bovinos",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/292-tilmicofull-duo-inyectable",
    "price": 27406.1
  },
  {
    "id": "3a70f1b6-d26f-1ab9-4116-5b5da70fb772",
    "title": "Salix MSD 10ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Diurético – Salurético. - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_e4180d9dae134947871b7b03e9d48768~mv2.png",
    "volumeWeight": "10ml.",
    "dose": "",
    "drugs": "Ácido 4-cloro-N-furfuril-5-Sulfamoil Antranílico (furosemida)",
    "externalLink": "https://www.msd-salud-animal.com.ar/productos/salix-diuretico-veterinario/",
    "price": 13757.65
  },
  {
    "id": "d03c6694-feed-4912-0d18-f3ea120e1ce5",
    "title": "Jeringa Lider Dial PRO 50c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Jeringa de cuerpo Plástico - Una jeringa liviana, precisa y ergonómica. Con la nueva jeringa Dial Pro se obtiene una dosificación precisa, evitando errores en la aplicación y por su diseño ergonómico y bajo peso se puede trabajar de manera cómoda incluso en largas jornadas de trabajo.",
    "image": "https://static.wixstatic.com/media/06b954_15228971f3484b6ea0e2ecbf0c9f0010~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "3c10304c-3159-3a1f-01ec-3d6062c10bea",
    "title": "Endoral Von Franken 1l.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario Interno. Tratamiento de parasitosis gastrointestinales (Nematodes), parasitosis pulmonares (Dictyocaulus), tenias (Anaplocephalidos), y parasitosis hepáticas (Fasciola hepática adulta). - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b2f0109330a94d33873a0aa94e2085a5~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Albendazol 10,00 g Sulfato de cobalto hexahidrato 1,30 g Excipientes c",
    "externalLink": "https://www.fatrovonfranken.com/detalle-productos/endoral/",
    "price": 0
  },
  {
    "id": "e530ec9e-9132-7557-d045-fdbed191ac27",
    "title": "Advocin 180 Zoetis 50ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "a solución inyectable de Advocin 18% es un agente antimicrobiano de amplio espectro perteneciente a la clase de las Fluoroquinolonas, con actividad contra una amplia gama de bacterias Gram negativas, Gram positivas y micoplasmas. Advocin 18 % exhibe una actividad rápidamente bactericida debido a la inhibición de la ADN girasa bacteriana y no es afectado por los mecanismos de resistencia bacteriana",
    "image": "https://static.wixstatic.com/media/06b954_c571f73937814024b27e4800eec85aa8~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Cada 100 ml",
    "externalLink": "https://ar.zoetis.com/products/bovinos/advocin-180.aspx",
    "price": 0
  },
  {
    "id": "d86b7ba7-b20f-53b5-f064-f3f76d860f7a",
    "title": "Ciclase DL Zoetis 20ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Prostaglandina F2alfa, solución inyectable - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b96368e77bb549b39c02c79fc48e005a~mv2.png",
    "volumeWeight": "20ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://zoetis.cl/productos-y-servicios/bovinos/ciclase-dl.aspx",
    "price": 0
  },
  {
    "id": "c42cb354-47ca-a2b0-d3a1-7e6956fdf372",
    "title": "Cipiosyn Cipionato de Estradiol 100ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "El Cipionato de Estradiol (CPE) es un derivado semisintético de acción prolongada del 17 Estradiol, hormona esteroidea sintetizada por el folículo ovárico, desarrollada para optimizar los resultados de los tratamientos con progestágenos en bovinos. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_652cffaa25254c28a22f74343c931ba5~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cipionato de estradiol 50 mg Excipientes c",
    "externalLink": "https://www.zoetis.co.cr/products/bovinos/cipiosyn.aspx",
    "price": 0
  },
  {
    "id": "f2b70e97-8060-eb38-f830-e07298d24f67",
    "title": "Novormon 20000 Zoetis.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Inducción y sincronización de celos - Inducción de la ovulación y superovulación - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a248a712de294769bcc0d0a7fd459bb1~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 159168
  },
  {
    "id": "b0a48105-127e-c1eb-e306-5a638d61d47b",
    "title": "Ioduro de Sodio Zoovet 50ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Quimioterápico - Antimicótico - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2c7020459012495dacf141b407e2a224~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/itemlist/search?searchword=ioduro&amp;categories=9%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C31%2C32%2C170%2C172&amp;format=html&amp;t=&amp;tpl=search",
    "price": 15159.35
  },
  {
    "id": "d3fb05fc-7143-8bc8-f3ae-477938aca8df",
    "title": "Electrolac Zoovet 1l.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Rehidratante - Energizante. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_dbb87615e0bd4b5faae0f4ae2dd9de07~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/itemlist/search?searchword=electrolac&amp;categories=9%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C31%2C32%2C170%2C172&amp;format=html&amp;t=&amp;tpl=search",
    "price": 40765.05
  },
  {
    "id": "66096fc9-9845-b105-a29b-772a60169b74",
    "title": "Algitocina Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiinflamatorio no esteroide - Hormonal - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_88b7c7fbaf4c42ad83029593df4de444~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Oxitocina 400 UI Flunixín Meglumine 11 g excipientes c",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/itemlist/search?searchword=algitocina&amp;categories=9%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C31%2C32%2C170%2C172&amp;format=html&amp;t=&amp;tpl=search",
    "price": 0
  },
  {
    "id": "20ea11fe-2bf4-ad81-e732-58d260d7cccc",
    "title": "Folirec Zoovet 30ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Manejo de la reproducción - Hormonal - Gonadotrofina - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e6bb8bb5e9f1477fa5e71bf790efe0f6~mv2.png",
    "volumeWeight": "30ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/414-foli-rec-liquido",
    "price": 54205.15
  },
  {
    "id": "4c6fe4c7-b4c8-53b0-8bbc-0a9c69ae55be",
    "title": "Folirec Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Manejo de la reproducción - Hormonal - Gonadotrofina - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a04178f02cdd4d35b2f1e2802942ffbe~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/414-foli-rec-liquido",
    "price": 149077
  },
  {
    "id": "c15b9f11-b5c3-d216-2c5f-102b0c3f8e0f",
    "title": "Oleovet ADE Inyectable Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Estados carenciales, estrés; coadyuvante en procesos infecciosos y/o parasitarios - Retraso del celo - Raquitismo y osteomalacia. - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_77aadcd5ec72405b853bb85be1f5e01b~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Vitamina A Palmitato 25",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/438-oleovet-ade-inyectable",
    "price": 0
  },
  {
    "id": "88863cfb-67a3-413e-1b7e-56a07901ad95",
    "title": "Pinza Elastrator Primor",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Pinza para anillos Elastrator Primor - Pinza para castración.",
    "image": "https://static.wixstatic.com/media/06b954_80ac4bb76b8c44d28d882086bda6fd5f~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "dc24d145-27d8-6e71-9305-4dcdad92d57b",
    "title": "Rodilon Bayer 1kg.",
    "laboratory": "Bayer",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Nueva formulacion \"Rodilon® BLOQUE EXTRUSADO\" de 15 gr. con nervaduras en dos de las superficies expuestas.",
    "image": "https://static.wixstatic.com/media/06b954_e9794c6d1d204b0caaa14d6cf67c9f5f~mv2.png",
    "volumeWeight": "1kg.",
    "dose": "",
    "drugs": "Difethialone 0,0025 g cereales, parafina, amargante, azucar, saborizante, antioxidante, c",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "9184f7e3-f511-695e-6d5c-ab30d828b9e0",
    "title": "Cetri-Amon Ale-bet 1l.",
    "laboratory": "Ale Bet",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Detergente catiónico con acción antiséptica notable a base de amonio cuaternario - Disminuye en presencia de sulfatos o jabones - Bactericida, desinfectante, antiséptico, desodorizante, fungicida - No ocasiona en la dilución indicada irritación en la piel sana, ni en las heridas. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a31330388ec94fd4968b60f53da801ec~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Cada 100 ml de Cetri-Amon contiene: Cloruro de Benzalconio: 2000 mg Nitrito de Sodio: 0,5 mg Excipientes: 100 ml Conteni",
    "externalLink": "https://www.ale-bet.com.ar/aves/cetriamon.html",
    "price": 0
  },
  {
    "id": "29cef9be-c0ab-c77c-6e75-8a90762c9be7",
    "title": "Optimizador Bio Agro Insumos 500ml.",
    "laboratory": "Agro Insumos",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento vitamínico, mineral y de aminoácidos - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bb8c6eabd1b247eab1e0a36315958eeb~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Fosforilcolamina 2,00 g Ioduro de Potasio 0,40 g Gluconato de Calcio H2O 1,87 g Edetato de Cobalto x H2O 1,25 g Edetato",
    "externalLink": "https://laboratoriosagroinsumos.com/producto/optimizador-bio/",
    "price": 0
  },
  {
    "id": "afeb42d6-3f72-f5e2-d247-33b53e96dd96",
    "title": "IR9 Rosenbusch 50 dosis.",
    "laboratory": "Rosenbusch",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna Clostridial multiple indicada para la prevención de: Mancha, Gangrena Gaseosa, Hepatitis Infecciosa Necrosante, Icterohemoglobinuria Bacilar Infecciosa, Enterotoxemia, Cabeza hinchada de los lanares y Muerte súbita. Destinada a bovinos, ovinos - Para: Bovinos - Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_49d1a89093c34493abd8515958763f6f~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://rosenbusch.com/argentina/gprodbio_clostridiales.html",
    "price": 0
  },
  {
    "id": "ced68090-9642-431f-f8c2-c332fc6a5fc4",
    "title": "Vermiplex Plus 500 Konig 26gr.",
    "laboratory": "Konig",
    "animalBreeds": [
      "equino"
    ],
    "description": "Antiparasitario de espectro amplio para equinos, yeguas preñadas, potrillos, P.S.C. en training - Antihelmíntico en pasta de espectro total y acción ovicida, larvicida y adulticida - Tiene acción sistémica (eliminando las larvas en fase migratoria) y local a nivel del tracto gastrointestinal. - Para: Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_2ba14da91c114492bcbe1463bf70f983~mv2.png",
    "volumeWeight": "26gr.",
    "dose": "",
    "drugs": "Cada 100 g contiene: Mebendazol 12,5 gr Closantel 11,8 gr Excipientes c",
    "externalLink": "https://www.koniglab.com/producto/vermiplex-plus/",
    "price": 8055.9
  },
  {
    "id": "5cb0880d-0773-6f29-1c88-bceeadef29b2",
    "title": "Faxidan Konig 500ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno de amplio espectro con máximo poder Fasciolicida - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_5e0bcc357990414aa32ef234cfbfae48~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada mL contiene 200 mg de nitroxinilo de levamisol Excipientes c",
    "externalLink": "https://www.koniglab.com/producto/faxidan/",
    "price": 0
  },
  {
    "id": "433390f4-5924-8a09-c5e9-87b2bd6d07ad",
    "title": "Control Part Konig 50ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución Inyectable - Relajante del musculo liso uterino - Agente tocolítico - Relaja intensa y prolongadamente el músculo liso uterino, facilitando maniobras obstétricas antes, durante y después del parto - Mejora el suministro de sangre a la placenta y al feto durante la fase de relajación miometrial completa. - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9e5d1973cf724828a197f3c0a483bcbb~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Clenbuterol 3,2 gm% Animales: Bovinos, Equinos, Ovinos",
    "externalLink": "https://www.koniglab.com/producto/control-part/",
    "price": 7155
  },
  {
    "id": "3bb23544-b7b8-f42e-aa3e-6ec53b7baec4",
    "title": "Kuramicina MAX Konig 250ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Kuramicina Max, es una moderna formulación de acción dual - La oxitetraciclina de larga acción, genera en una sola aplicación, 5 días de terapia antimicrobiana y la flunixina, un potente antiinflamatorio, analgésico y antipirético, brinda una terapia sintomática rápida y eficaz. - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_abde106c0c8b4597b1c300a0c0bc3b11~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Cada mL contiene: Flunixina base, 20 mg Oxitetraciclina base, 200 mg Excipientes c",
    "externalLink": "https://www.koniglab.com/producto/kuramicina-max/",
    "price": 0
  },
  {
    "id": "019a4d82-33e9-45e9-b03b-16ff24b5e993",
    "title": "Entero Relax Duo Zoovet x50ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antidiarreicos - Hipersecretores - Analgésico - Espasmolítico - Para: Bovinos, Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_830bc34281cb465f80971130034ea7f6~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Hioscina Butilbromuro 0,4% Flunixin Meglumine 2,2%",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/itemlist/search?searchword=entero&amp;categories=9%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C31%2C32%2C170%2C172&amp;format=html&amp;t=&amp;tpl=search",
    "price": 0
  },
  {
    "id": "8f9965ca-5ded-808e-faae-76d0cebbe896",
    "title": "Interfen Leon Pharma 5l.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antihelmintico intraruminal - Tratamiento y control de parásitos gastrointestinales y pulmonares - Para: Bovinos, Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_98904b4af1d24e91b47a9f11786263fb~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Fenbendazol 10% Animales: Bovinos - Ovinos",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "2ae80946-a234-0398-4dee-b6eae16f7782",
    "title": "Fluxin 5 Leon Pharma 100ml.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Moderno antiinflamatorio inyectable, no esteroide con acción analgésico y antipiretico - Para Bovinos, Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_775cc9c331114973a3247d63c5d960b8~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Flunixin Meglumina 5%",
    "externalLink": "",
    "price": 13937.3
  },
  {
    "id": "b8bee323-b930-563c-7c45-73c9adc4d426",
    "title": "Fluxin 5 Leon Pharma 50ml.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Moderno antiinflamatorio inyectable, no esteroide con acción analgésico y antipiretico - Para Bovinos, Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_c3025909ccbd447f81662a7722100964~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Flunixin Meglumina 5%",
    "externalLink": "",
    "price": 9785.45
  },
  {
    "id": "3a1a4226-84bd-2cfc-9da4-4fb8248e3315",
    "title": "Dexa LP Leon Pharma 100ml.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Corticosteroide, Antialérgico y Antiflogístico. - Para bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f09330900e8e4e50bf315242d91e36bf~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Dexametasona Fosfato Sódico 200 mg Excipientes c",
    "externalLink": "",
    "price": 7251.45
  },
  {
    "id": "b4ea0a33-6e50-f4b0-281e-14ffa583ecd7",
    "title": "Tres Quince Leon Pharma 500ml.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida. Garrapaticida. Larga acción. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_89f1ff004aaa4b5dbbc9561c411e5fe7~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Ivermectina 3,15 g Agentes de Formulación c",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "0ec18592-7006-221f-099b-9d54065fd440",
    "title": "Tilflex 375 Leon Pharma 250ml.",
    "laboratory": "Leon Pharma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "TILFLEX 375 es un producto que combina un antibiótico de amplio espectro, buenas características farmacocinéticas y pocos efectos colaterales como la tilmicosina, junto a un antiinflamatorio no esteroide con actividad analgésica, antipirética y antiinflamatoria, el diclofenac. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6af749098c664d2c8022a8d068e336c6~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Fosfato de Tilmicosina 30,0 g Diclofenac Sódico 7,5 g Excipientes c",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d776fb77-066d-6ab6-96f8-dad44ef4b727",
    "title": "Jeringa Automática Dial Millenium Primor 50c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "CONSULTAR PRECIO. Administración precisa y rápida, con rango de dosificación ajustable - La Jeringa Automática Primor evita errores en la aplicación y dosificación de substancias que requieren precisión.",
    "image": "https://static.wixstatic.com/media/06b954_d0c0054b968342618e20eeb0122ac939~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "0491f572-bc59-7a84-f688-5f0aed9a70dc",
    "title": "Dovertec Dorado Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida inyectable de acción prolongada - Tratamiento y control de parasitosis externas e internas que afectan a los bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_17c4a25ad85b4ad390c6891577436532~mv2.png;06b954_2c0bbdf8129748febb10764093b162f4~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Doramectina 3,5 g",
    "externalLink": "https://over.com.ar/product/dovertec-dorado/",
    "price": 0
  },
  {
    "id": "1f9f66ae-88c6-d4bc-bd2e-ab0efd677aa1",
    "title": "Bactroflay Konig 1l.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo pour on sin restricción en leche y con mínima restricción en carne. Poder residual excelente. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_d6840858f0bd49bc92298f4aae778f7b~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cipermetrina 5,00 g",
    "externalLink": "http://www.koniglab.com/producto/bactroflay-pour-on/",
    "price": 27388
  },
  {
    "id": "864d9e66-6420-31c7-0ce3-ea87da0caab4",
    "title": "Derribante ACA 5l.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo, aplicacion Pour on, para el control de Mosquicida para Bovinos. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8817036d066e49e39d44801a8f52397d~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cipermetrina 4% Imidacloprid 4% Butoxido de Piperonilo 4% Animales: Bovinos",
    "externalLink": "https://www.acamarket.com.ar/derribante-pour-on-5-litros.html",
    "price": 0
  },
  {
    "id": "4ec9033d-918d-cf90-c477-7fd07301e4f8",
    "title": "Bactroflay Konig 5l.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "CONSULTAR PRECIO. Antiparasitario externo pour on sin restricción en leche y con mínima restricción en carne. Poder residual excelente. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9ddf7f8381ac40d1b314210e8cf4ac44~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cipermetrina 5,00 g",
    "externalLink": "http://www.koniglab.com/producto/bactroflay-pour-on/",
    "price": 0
  },
  {
    "id": "9dcd28c4-ef2a-75f6-3e70-558d24bdd2a1",
    "title": "Carretel con Hilo x500 mts 12 hebras Carreteles Rafaela.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Carretel con hilo de 500mts 12 hebras.",
    "image": "https://static.wixstatic.com/media/06b954_062d34ccd14b40e0b16361235380c51b~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "dba46fae-9d9e-c775-db4f-a35b814c648f",
    "title": "Coagulante Chinfield 50ml.",
    "laboratory": "Chinfield",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Consultar precio. Antihemorrágico - cubre todo el cuadro de hemorragias cualquiera sea su etiología y localización merced a los dos componentes activos de su formulación, que lo distinguen como un producto único en su género - Para Bovinos, Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_5ac2f0ca0a9f43a28d903dfec3c5248f~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Ciclonamina (etamsilato) 15 g",
    "externalLink": "https://chinfield.com/coagulante-chinfield/",
    "price": 0
  },
  {
    "id": "547ccccd-2b88-1502-4cde-20cc6d74c726",
    "title": "Dila T Vetue 100ml.",
    "laboratory": "Vetue",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Consultar precio. Clenbuterol, monodroga activa de DILA-T Bronquial, es una amina simpaticomimética que actúa sobrelos receptores beta 2 de la musculatura bronquial, provocando la broncodilatación, la aceleración de la expulsión del mucusobstructivo y la ventilación pulmonar - Además actúa sobre el miometrio de varias especies en forma anticonstrictiva. - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_0efa7c64b69f469e93b9931678235a1e~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Clenbuterol, clorhidrato 3 mg",
    "externalLink": "https://www.vetue.com.ar/productos-vetue/8-productos/29-dila-t-inyectable",
    "price": 0
  },
  {
    "id": "f28f766c-1d47-7004-b4fc-c5950de33d1e",
    "title": "Curabichera Pomada Indio Rio de Janeiro 1kg.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario externo - Pasta curabicheras curativo y preventivo de miasis cutáneas, gusaneras o bicheras. - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_574013215f004343815b85d81af9d8ee~mv2.png",
    "volumeWeight": "1kg.",
    "dose": "",
    "drugs": "Fenitrotion al 95 % 5g",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/165",
    "price": 0
  },
  {
    "id": "3475c0bd-694c-afd1-899b-1d40cd69b877",
    "title": "Parenteril Inyectable Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Consultar precio. Antibiótico, Antiinflamatorio, Antipirético y Analgésico - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9bfbcb77f0c041348fbc8bc2af1f7805~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Espiramicina Adipato 5,5%",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/itemlist/search?searchword=parente&amp;categories=9%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C31%2C32%2C170%2C172&amp;format=html&amp;t=&amp;tpl=search",
    "price": 0
  },
  {
    "id": "18db155e-5e8e-4429-503d-bfd52b68beda",
    "title": "Broncomicina Zoovet 250ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Consultar precio. Antibitótico, Antiinflamatorio, Antipirético y Mucolítico - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_01a24d4a4e6e426d837b8fb4d8a54562~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Tilmicosina 30%",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/itemlist/search?searchword=broncomi&amp;categories=9%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C31%2C32%2C170%2C172&amp;format=html&amp;t=&amp;tpl=search",
    "price": 0
  },
  {
    "id": "242e069f-d809-dd22-33e7-c7212fe1ba9e",
    "title": "Entero Plus Jarabe Zoovet x500ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Consultar precio. Bacteriostático intestinal - Antidiarreico- Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_79b6a57ab3c34b0faefbdbaf3243317f~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Enrofloxacina 2,5%",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/369-enteroplus-jarabe-ga",
    "price": 0
  },
  {
    "id": "62ed52a6-284c-386b-6b8e-d3913b3600bc",
    "title": "Neumoxina Zoovet 50ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Consultar precio. Antibiótico macrólido de larga acción- Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_48ea81b81e5c44fd8b322a9bd420a178~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Tulatromicina 10%",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/268-neumoxina",
    "price": 64564
  },
  {
    "id": "43af43e4-b251-3160-b6ed-6649c248c6dd",
    "title": "Llave de Corte Potrero.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Consultar precio. Una llave, con contactos en acero inoxidable. Úselas para conectar y desconectar sectores fácimente de acuerdo a la necesidad. También le permitirá trabajar por descarte en la búsqueda de una pérdida en el sistema. Incluye 2 tornillos auto roscantes para fijar al poste.",
    "image": "https://static.wixstatic.com/media/06b954_8ef8d453d42f4cc7b25105160bec8130~mv2.png;06b954_6318835fab1e46f690773ae62aadb9e5~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "18d93f50-2c35-5f1f-25df-144cb3309f3e",
    "title": "Energo-mag Konig 250ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Consultar precio. Controla la hipomagnesemia. Preventivo y curativo de la vaca caída. - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b1382e85c2734499a1df034f7de64dd7~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Pirrolidón carboxilato de magnesio monohidrato 60gr",
    "externalLink": "http://www.koniglab.com/producto/energo-mag/",
    "price": 0
  },
  {
    "id": "1a3df314-2f77-b20a-d562-8f85dfe05843",
    "title": "Lapiz Descornador Rio de Janeiro 8u.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Consultar precio. Se caracteriza por la acción cauterizantedel hidróxido de potasio, el cual produce la coagulación de las células corneas, evitando asi su posterior crecimiento. - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bcd13900dcc14ab3a709631c0257a572~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Parafina 2g",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/67",
    "price": 0
  },
  {
    "id": "567d01ab-bdfc-b7c6-41bb-a56b4b6a5891",
    "title": "Miotonico Rio de Janeiro 10ml.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Consultar precio. Este preparado es de alto valor para controlar todos aquellos casos en que los animales necesitan de un estímulo vitamínico cardiotónico muscular. Por múltiples factores, en la época invernal o en la época de pastos de verdeos, es frecuente observar animales que muestran signos de deficiencia que se traducen por la falta de coordinación de movimientos, agitación y posteriormente ",
    "image": "https://static.wixstatic.com/media/06b954_7c9d78780e374ac29097e3d3d4c728fe~mv2.png",
    "volumeWeight": "10ml.",
    "dose": "",
    "drugs": "Niketamida 5",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/71",
    "price": 0
  },
  {
    "id": "055634c3-3f5f-79f0-01aa-186a33d371ca",
    "title": "Rumio Tonic Rio de Janeiro 10ml.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Consultar precio. Rumio Tonic es una combinación farmacológica ideada para el tratamiento de las disfunciones digestivas que cursan con disminución de la motilidad, ya sea gástrica o intestinal. - Para Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_625890a1c4e0482f8ae83763e681ab04~mv2.png",
    "volumeWeight": "10ml.",
    "dose": "",
    "drugs": "Neostigmina metilsulfato 0",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/106",
    "price": 0
  },
  {
    "id": "59980f02-4068-fbf2-806e-2dbb145a48dc",
    "title": "Calcio 50 Rio de Janeiro 100ml.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Consultar precio. Hipocalcemia, Hipomagnesemia y/o Deficiencia de Hierro. - Para Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_0baf5aab78a845e59b0cfbc16cd693ac~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Gluconato de calcio 50g",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/30",
    "price": 0
  },
  {
    "id": "00c1101c-44f5-4834-8118-93127558c563",
    "title": "Antitóxico Rio de Janeiro 20ml.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Consultar precio. El Antitóxico polivalente Río de Janeiro está indicado en todos aquellos casos de envenenamiento en que el origen de la intoxicación está dado por pastos cianógenos o de otros tipos, cuando no existe un antídoto específico. - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_007ff5e12d0d4f64a69ff2124e949150~mv2.png",
    "volumeWeight": "20ml.",
    "dose": "",
    "drugs": "Niketamida 3",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/18",
    "price": 0
  },
  {
    "id": "3756d38e-5eae-c30f-0f6c-2956eecf86d9",
    "title": "Pilocarpina 2% Rio de Janeiro 10ml.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Consultar precio. Catártico, estimulante de la musculatura lisa intestinal. - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_433ff42f5fc34c669edaa0e6f433e0e9~mv2.png",
    "volumeWeight": "10ml.",
    "dose": "",
    "drugs": "Pilocarpina clorhidrato 2g",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/74",
    "price": 0
  },
  {
    "id": "f8c6192a-e4c2-6ea4-4125-b2498d47f7f6",
    "title": "Vermkon APR Konig 4lt.",
    "laboratory": "Konig",
    "animalBreeds": [
      "ovino"
    ],
    "description": "Consultar precio. Antihelmíntico para ovinos. Acción contra Parásitos Resistentes. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1ff44c2da2f643f4a5e6e13b8df966e7~mv2.png",
    "volumeWeight": "4lt.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Naftalofos 15 g",
    "externalLink": "http://www.koniglab.com/producto/vermkon-apr/",
    "price": 0
  },
  {
    "id": "d5a91fed-88b4-5970-9703-6daecefe1c68",
    "title": "Adenitis Equina Clinica Equina x25ds.",
    "laboratory": "Varios",
    "animalBreeds": [
      "equino"
    ],
    "description": "Consultar precio. Vacuna contra Adenitis o Moquillo equino por Streptococus equi. - Para: Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_42fe877db831444798dd28146453058d~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Contiene cultivos de Streptococcus equi inactivados con formol y precipitados con sulfato de aluminio y potasio",
    "externalLink": "http://clinicaequina.com.ar/productos-biologicos/",
    "price": 0
  },
  {
    "id": "6712de9d-9af8-eed0-d283-fdea1dd3ba2d",
    "title": "Carretel con Hilo x500 mts 9 hebras Carreteles Rafaela.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Carretel con hilo de 500mts 9 hebras.",
    "image": "https://static.wixstatic.com/media/06b954_c8776b7a537a46ea84b704738e1104d1~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d3b8d7cd-7408-caf2-2dc9-a1fd6f5b5b14",
    "title": "Tiamina Hampton 100ml.",
    "laboratory": "Varios",
    "animalBreeds": [
      "equino"
    ],
    "description": "Neuritis, polineuritis, síndromes ciáticos, reumatismos, algias, hepatopatías, para reforzar la fijación de glucógeno. - Para: Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_5e2413de9d4e4f549c2b4cbad23eb773~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Tiamina Clorhidrato 30 g",
    "externalLink": "https://www.calastreme.com.ar/producto/tiamina/",
    "price": 0
  },
  {
    "id": "dd0991a0-5af7-61c7-ec96-ec5b991db1cc",
    "title": "Suiferro Fuerte Chinfield 50ml.",
    "laboratory": "Chinfield",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "La anemia debida a deficiencia de hierro se presenta en el ganado, bovino y porcino y puede ser debida a falta de mineral en la alimentación así como a parasitosis, enfermedades infecciosas o constitucionales o deficiencias en la asimilación intestinal del hierro - SUIFERRO FUERTE asocia los tres elementos minerales que rigen el proceso de formación y maduración de los glóbulos rojos y la hemoglob",
    "image": "https://static.wixstatic.com/media/06b954_3d4b2df2944b49b5ae56bace684848f6~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Edetato de Sodio y Hierro 10",
    "externalLink": "https://chinfield.com/suiferro-fuerte-2/?cat=bovinos",
    "price": 0
  },
  {
    "id": "44f2695f-e46d-1c64-bdbc-d9126c616e90",
    "title": "Metaxona Weizur 100ml.",
    "laboratory": "Weizur",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiinflamatorio esteroide. - Para Bovinos, Equinos, Porcinos, Ovinos, Caninos y Felinos.",
    "image": "https://static.wixstatic.com/media/06b954_4087f56a3b754eb29c9f1985dbdcaecf~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Dexametasona (como 21 fosfato sódico) 2 Mg/ Ml Animales: Bovinos - Ovinos - Equinos - Porcinos",
    "externalLink": "https://www.weizur.com/producto/metaxona/",
    "price": 0
  },
  {
    "id": "e51c9830-7a62-f2f6-9cfd-81536a20d5fa",
    "title": "Hilo para Sutura Interna Catgut Able.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Especial para la realización de suturas internas. Para: Bovinos - Ovinos - Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_f4259e23c73341da8f33f8621db950b2~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f4439d46-cb51-c558-c557-6737dd0383df",
    "title": "Tiza para marcar Lanares Patente.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Tiza para marcar lanares Patente. Para: Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7f7f035efc804f89b5b14bca39cbbc35~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7ccb3ceb-eb97-0ad4-93a5-beffa6946f3e",
    "title": "Hoja para Bisturí Swann-Mortom.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "La cuchilla N.º 24 tiene una forma semicircular y está también afilada a lo largo de su filo frontal. Se utiliza para realizar incisiones largas en cirugía general y también en procedimientos de autopsia, la N.º 24 se adapta a los mangos 4 4L 4 Graduado y amp; 6B..",
    "image": "https://static.wixstatic.com/media/06b954_9c4e2fdf25784ff3b3635e99cc1f7a05~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "https://es.swann-morton.com/product/46.php",
    "price": 0
  },
  {
    "id": "327c543e-41c3-b714-b38a-a1b34bc76a61",
    "title": "Amantina Ale-bet 500ml.",
    "laboratory": "Ale Bet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Altas concentraciones de cobre cobalto zinc permiten su almacenamiento en las células hepáticas para el aprovechamiento del animal en función de su carencia tanto primaria como secundaria de dichos minerales que se presentan como: pérdida de peso, lento desarrollo, alopecias, infertilidad, bajos índices reproductivos, diarreas no específicas, fracturas espontáneas, alteración de pezuñas. Además, s",
    "image": "https://static.wixstatic.com/media/06b954_8251a2585ed4444a9afdac1d83b12257~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cloruro cúprico: 2500 mg",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a1470618-245b-3e83-5fef-3830bcff96ef",
    "title": "Clostridial Polivalente 10P Providean Tecnovax 60 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna decavalente para la protección de enfermedades clostridiales, tétanos y neumonías - Para: Bovinos - Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a6ef28b6e340441684b3e659b4e8e0b8~mv2.png",
    "volumeWeight": "60 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-clostridial-10p/",
    "price": 0
  },
  {
    "id": "4336da03-c58d-3db5-ba7d-cfb2e0c5ffbb",
    "title": "Ziflor Fenac Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antimicrobiano - Antibiótico - Antiinflamatorio no esteroide - Flofernicol + Diclofenac- Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_428d6d0ac512449486bc31a0b406e6d9~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Florfenicol 30 % Diclofenac 3,75 % Animales: Bovinos",
    "externalLink": "https://www.zoovet.com.ar/grandes-animales/item/296-ziflor-fenac",
    "price": 21351.8
  },
  {
    "id": "2473a6a0-d99e-dd53-aa62-df232a5fc9b2",
    "title": "Kit Reproductivo Carne Sincrover 700 Over 100 dispositivos.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Control del ciclo estral en vaquillonas y vacas - Sincronización de celo - Tratamiento del anestro post parto - Acortamiento del período concepción-parto. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2dfd493060c54243a7f5040ff046d3c5~mv2.png",
    "volumeWeight": "100 dispositivos.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://over.com.ar/product/kits-reproductivos-over/",
    "price": 0
  },
  {
    "id": "8a1db20e-7a75-f839-91cb-b59aaa59b391",
    "title": "Cipersin Biogénesis Bago 5l.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Garrapaticida bovino, antisárnico y melofaguicida ovino. Líquido emulsionable. - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_53a1e0aca98e4da9a54b581d24f93fd0~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cipermetrina 20 g",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id65/",
    "price": 0
  },
  {
    "id": "a3714ae3-8773-af7e-05e9-aceb6c4275ca",
    "title": "Poncho Resero.",
    "laboratory": "Indumentaria Rural",
    "animalBreeds": [
      "bovino"
    ],
    "description": "El Poncho Resero es un producto 100% impermeable ideal para el uso de cabalgatas en días lluviosos, ya que cubre el cuello, recado y las ancas del animal mientras el jinete también se proteje de la lluvia.",
    "image": "https://static.wixstatic.com/media/06b954_2c148bfa3e9844cbbe33583cd473a91b~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "44e8a96c-e054-463d-0dc3-826824f06fa2",
    "title": "Bota Calfor Pampeana.",
    "laboratory": "Indumentaria Rural",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Para realizar tareas rurales en general, la bota Calfor Pampeana ofrece comodidad y flexibilidad sin perder la calidad y seguridad que la caracteriza.",
    "image": "https://static.wixstatic.com/media/06b954_fc22499d14c746f08317fdb285e42b66~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4605c06f-991a-b9a3-9ff3-2fcad5509337",
    "title": "Traje de Lluvia Ombu.",
    "laboratory": "Indumentaria Rural",
    "animalBreeds": [
      "bovino"
    ],
    "description": "El traje de lluvia OMBU es ideal para el uso en las tareas rurales, pesca, fumigación. Resistente y de muy buena calidad, Ombu ofrece un producto confiable y seguro.",
    "image": "https://static.wixstatic.com/media/06b954_a2318c325760401092e7c2130d048708~mv2.png;06b954_745aac1c33fa48b28a3e5bd5b5d2a731~mv2.png;06b954_8d3491d6e1f44c28a30386303908621f~mv2.png;06b954_6a409fdd655d437aa280baafaeb4fbc4~mv2.png;06b954_7f7f8c4dab114501a84465016b495194~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "https://ombuindumentaria.com.ar/producto/traje-de-lluvia/",
    "price": 0
  },
  {
    "id": "bd4556f1-e2eb-4b8d-e618-eefe19b4815f",
    "title": "Eprinover Over 1l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_0ab346b2372f4c98b5796bbbc023a438~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Eprinomectina 0,5 g",
    "externalLink": "https://over.com.ar/en/product/eprinover-pour-on/​​​​​​​",
    "price": 0
  },
  {
    "id": "cee4c4bb-328e-2f10-eb0a-05adae386648",
    "title": "Gonaxal Biogénesis Bago 50ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Es una solución inyectable de acetato de buserelina al 0,00042%, análogo sintético del de GnRH hipotalámica. Producto para el aparato reproductor y manejo de la reproducción en hembras bovinas y equinas - Para: Bovinos - Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_b236c74fc65c49278a6732916bdee394~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id88/",
    "price": 0
  },
  {
    "id": "7f504502-f862-93d9-f442-cb22b6275f1a",
    "title": "Ultrachoice 8 Zoetis 50 dosis 100ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna acterina-Toxoide de Clostridium chauvoei-septicumhaemolyticum-novyi-sordelliiperfringens - Para: Bovinos - Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c782e43c95174762b020fb30b472e28f~mv2.png",
    "volumeWeight": "50 dosis 100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://ar.zoetis.com/products/bovinos/ultrachoice.aspx​​​​​​​",
    "price": 0
  },
  {
    "id": "e959c570-6e83-7a03-ecab-d4414c57c567",
    "title": "Guantes largos para examinación Super Flex 100u.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Guantes largos descartables para tacto, maniobras obstétricas.",
    "image": "https://static.wixstatic.com/media/06b954_465a016e0ba24ef789fc9a142276e923~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "783c496d-b307-9547-a878-c4166c550707",
    "title": "Ripercol L Fosfato Zoetis x250ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario e inmunoestimulante para control de parasitosis gastrointestinales y pulmonares - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_de52cc17f08b4065b1223fd9ec709c68~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Levamisol, fosfato: 18,8 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/ripercol-l-fosfato.aspx",
    "price": 0
  },
  {
    "id": "9cc17671-ac04-3a01-9bb1-6b13a2b9be76",
    "title": "Cipionato de Estradiol Von Franken 100ml.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Complemento en la inducción y sincronización de celos- Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8be122a851af4fe3a37aa4bb9723969f~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cipionato de estradiol 50 mg Excipientes c",
    "externalLink": "https://www.fatrovonfranken.com/es/large-animals/product-details/cipionato-de-estradiol-von-franken/",
    "price": 0
  },
  {
    "id": "27c74302-f151-cb7d-39ea-61b44893572a",
    "title": "Flunixin Antiinflamatorio Dairyfarma 50ml.",
    "laboratory": "Dairyfarma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Moderno antiinflamatorio inyectable, no esteroide con acción analgésico y antipiretico - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_59650771444a466d909a124a4627c21e~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Flunixin Meglumina 5%",
    "externalLink": "http://www.dairyfarma.com.ar/antiinflamatorio-df/",
    "price": 0
  },
  {
    "id": "ce139e18-2a83-4045-dca6-fd68278a7d88",
    "title": "Kit Sinergia Engorde Zoovet 2 x 500ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Desde el ingreso al engorde hasta el fin del ciclo (Feed lot o Pastura suplementada) - Está pensado para mejorar la conversión al energizar, hacer descender el estrés, dar una sólida inmuno estimulación, vitaminizar y aportar una mineralización general estratégica de animales durante el engorde - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_263f77e4fd144c66bc2c7b949d1da8f4~mv2.png;06b954_58c00f0b43944623a71414b71cd7b566~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Powermin ADE: Adenosín Trifosfato (ATP) 0,3%",
    "externalLink": "https://www.zoovet.com.ar/images/Folletos/kitsinergia.pdf",
    "price": 0
  },
  {
    "id": "8fd2ba9f-86cb-17aa-3317-266197125ac8",
    "title": "Kit Sinergia Recría Zoovet 2 x 500ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Desde el nacimiento hasta el destete - Está pensado para acelerar el crecimiento al dar una sólida inmuno estimulación, vitaminización y aporte de minerales estratégicos, imprescindibles en la etapa de la cría - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2453524211f64de9b29f0a697cdb4c5f~mv2.png;06b954_179619ada28b489aa42e922bf09c183a~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Once 7 + 4 con Selenio: Gluconato de Cobalto 0,5%",
    "externalLink": "https://www.zoovet.com.ar/images/Folletos/kitsinergia.pdf",
    "price": 0
  },
  {
    "id": "6045d17d-5865-9c11-4efa-1d7abf1aef2b",
    "title": "Broncomicina Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento y prevención de enfermedades infecciosas producidas por microorganismos sensibles a la Tilmicosina. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_01a24d4a4e6e426d837b8fb4d8a54562~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Tilmicosina 30%",
    "externalLink": "https://www.zoovet.com.ar/es/grandes-animales/item/228-broncomicina",
    "price": 0
  },
  {
    "id": "4dc69cf4-3253-90f1-ae37-e8ad20a6f14c",
    "title": "Floxa Max 10% Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Control de infecciones provocadas por bacterias Gram (+), Gram (-), micoplasmas y clamidias - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_637fb607e2fd4145b81e178a51b721f4~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Enrofloxacina 10%",
    "externalLink": "http://zoovet.com.ar/es/grandes-animales/item/252-floxa-max-10​​​​​​​",
    "price": 39788.2
  },
  {
    "id": "362dbfc3-0484-b447-acc2-b022eecfd2a5",
    "title": "Jeringa Automática Fix Master 50c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Administración precisa y rápida, con rango de dosificación ajustable - La Jeringa Automática Fix evita errores en la aplicación y dosificación de substancias que requieren precisión.",
    "image": "https://static.wixstatic.com/media/06b954_6a620bafa076464bbb25e10ceb864a8c~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 33960
  },
  {
    "id": "9aea43d9-16bb-4a38-68b1-95a52103fd30",
    "title": "Kit Reproductivo Diprogest 600 Zoovet 50 dispositivos.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Presentación comercial que contiene todos los elementos necesarios para la ejecución de los protocolos de IATF clásicos en hembras bovinas. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a12e60342a994f8e812b14c997c2abd8~mv2.png",
    "volumeWeight": "50 dispositivos.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.zoovet.com.ar/es/grandes-animales/item/424-kit-reproductivo-diprogest-600-50-dosis",
    "price": 126315
  },
  {
    "id": "4477ea33-2a31-ffcd-71e2-89d5c4fa83a9",
    "title": "Overmectina Triplex Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo de amplio espectro. - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b942cb454a0e43c9973042436c5598fe~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Levamisol clorhidrato 20 g",
    "externalLink": "http://www.over.com.ar/product/overmectina-triplex-2/",
    "price": 0
  },
  {
    "id": "a0c65130-1f70-8916-0c47-c3febc15e78c",
    "title": "Agroforce 20 SC Fipronil 20% Huagro 1lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Es un Insecticida que corresponde a un nuevo grupo químico, el de los fenil pirazoles. Actúa por contacto e ingestión, afectando el sistema nervioso central de los insectos. Agroforce 20 SC tiene uso contra las principales plagas: lepidópteros, ortópteros y contra larvas de coleópteros en los suelos, entre otros. También es usado para el control de hormigas y cucarachas.",
    "image": "https://static.wixstatic.com/media/06b954_27245ed11dfa47d3b248ef019c3614a4~mv2.png",
    "volumeWeight": "1lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "70be0319-08d8-ca6b-ffc2-3798b66ab16b",
    "title": "D.R.M. 1% Doramectina Zoovet 500ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida indicado para el tratamiento y prevención de nematodes (parásitos redondos) y parásitos externos, incluidas las tan temidas miasis multicavitarias de verano (bicheras) - Para: Bovinos - Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f1204b10b56c49f9852aaf69b67d12b1~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Doramectina 1 g",
    "externalLink": "https://www.zoovet.com.ar/images/Folletos/drm.pdf​​​​​​​",
    "price": 64566.7
  },
  {
    "id": "ead93bda-5b40-43c6-3ced-37a248c2d570",
    "title": "Tocon Extra Dow 1lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Tocon Extra es un herbicida para control de malezas de porte arbustivo y sub-arbustivo en áreas de pasturas.",
    "image": "https://static.wixstatic.com/media/06b954_9b6d43418b4348e4b80505792ef8519f~mv2.png",
    "volumeWeight": "1lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7a757073-a16f-fe90-aebd-ec80d66cab8a",
    "title": "Pastar Gold Dow 5lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Pastar Gold es un herbicida sistémico de aplicación foliar, recomendado para el control de malezas de hoja ancha, semi-leñosas y leñosas en áreas de pasturas de gramíneas.",
    "image": "https://static.wixstatic.com/media/06b954_7217d87cd2a7482c8374231475f2d724~mv2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "aed9dbc2-d836-8d57-33cd-fca1a801dc1a",
    "title": "Eprinex Boehringer Ingelheim x 2,5lt.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida de aplicación pour on, sin restricción prefaena ni descarte de leche - Primer endectocida sin restricción prefaena ni descarte de leche - Resistencia al agua - Alta eficacia en piojos y Cooperia - Puede aplicarse en cualquier momento y condición climática - Calidad de leche asegurada - Seguridad y efectividad en el control de los parásitos mencionados - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bc040d4b5379476d9c873726df334de3~mv2.png",
    "volumeWeight": "2,5lt.",
    "dose": "",
    "drugs": "Eprinomectina 5gr",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1f75f242-5b41-e926-3e06-49f0cff1d81c",
    "title": "Selevit Energy Zoovet 500ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Como energizante y fuente de minerales y/o vitaminas. Especial para el crecimiento, lactación y engorde. - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7eab976d3c3348acb0f7bda6240f060e~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Hipofosfito de Sodio 15%",
    "externalLink": "https://www.zoovet.com.ar/es/grandes-animales/item/446-selevit-energy​​​​​​​",
    "price": 0
  },
  {
    "id": "20a8348b-db68-4c11-501c-6ad3dbd9d0e0",
    "title": "Vaquero Pour-on Zoovet x 5lt.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo Pour-on - Piojicida - Endectocida - Garrapaticida. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c5f1281e2e444e2a82c89defb92ce7fe~mv2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "Fipronil 2%",
    "externalLink": "https://www.zoovet.com.ar/es/grandes-animales/item/354-vaquero-pour-on",
    "price": 396314
  },
  {
    "id": "3d93f942-8d31-5bf5-9623-d0ab33fab66b",
    "title": "Endectomicín ADE 4% Zoovet 500ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida - Suplemento vitamínico de acción persistnete - Para: Bovinos - Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_62b6ec3cef4b4f40ab3d0a9f330456c3~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Ivermectina 4%",
    "externalLink": "https://www.zoovet.com.ar/es/grandes-animales/item/346-endectomicin-ade-4",
    "price": 50149.7
  },
  {
    "id": "d49e1008-2af6-db17-5384-da2eddde114d",
    "title": "Mamyzin P Boehringer Ingelheim 10 fr. y ampollas solventes.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_22b1d19ce438474c92e9dd1f06a7938f~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Penetamato, yodhidrato 5",
    "externalLink": "https://www.boehringer-ingelheim.mx/salud-animal/bovinos/mamyzin-m",
    "price": 0
  },
  {
    "id": "3fbf9d80-8379-90da-f4bd-51d2fba6a05b",
    "title": "Trifect Forte Over.",
    "laboratory": "Over",
    "animalBreeds": [
      "equino"
    ],
    "description": "Tratamiento de adenitis equina, leptospirosis, infecciones respiratorias, enteritis, nefritis, tétanos, artritis, inflamaciones de pene, infecciones secundarias a virosis, infecciones en heridas, flemones, cistitis, pielonefritis, y osteomielitis. - Para Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_7c08bc246bcc4f2c982e9d9b03ee6121~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Cada frasco con 18 g de polvo contiene: Penicilina G sódica 4",
    "externalLink": "http://www.over.com.ar/product/trifect-forte-3/",
    "price": 0
  },
  {
    "id": "56614200-2a18-c57f-e704-34180223c9ee",
    "title": "Tetinas Peach Teats.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Las tetinas Peach Teats, están hechas con una fórmula exclusiva, desarrollada para cubrir las necesidades de los guacheros - Son confortables y naturales para el ternero y eliminarán las úlceras en la boca.",
    "image": "https://static.wixstatic.com/media/06b954_086506b4efe647e5b54f58e81b421691~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "45d46650-eac0-82e8-0c05-01bbe8d9265c",
    "title": "Idocarb 12 Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Tratamiento y prevención de anaplasmosis y piroplasmosis - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_e1ae2fb50c974d7d93da8a5a0df3c5f2~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Imidocarb Dipropionato 12% Cianocobalamina 0,005%",
    "externalLink": "https://www.zoovet.com.ar/es/grandes-animales/item/254-idocarb12",
    "price": 0
  },
  {
    "id": "efcde5ae-9d7e-7cd8-56f0-896476feeee8",
    "title": "Guantes largos para examinación Sensy Flex 100u.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Guantes largos descartables para tacto, maniobras obstétricas.",
    "image": "https://static.wixstatic.com/media/06b954_8e86c685bd7942c189208595ffcff997~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "6b2a1cd7-4cb8-2195-948d-4ee78f199b33",
    "title": "Ciclar Zoovet 20ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Sincronizador del celo - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_16d88530f4444b77b039c38521dd376a~mv2.png",
    "volumeWeight": "20ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 12642.85
  },
  {
    "id": "505015c7-8c1f-fe80-0f52-b4d355d7cbe0",
    "title": "Cable Electroplástico Carreteles Rafaela 7 hilos 500mts.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Cable Electroplástico 7 Hilos.",
    "image": "https://static.wixstatic.com/media/06b954_47c2e7cefb4e4e2ca1fe739e66b412c9~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "85364635-5b59-874f-3434-245043b0b6c1",
    "title": "Kobra Spray Curabichera Konig 440ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Curabicheras, Uricida y Antimiásico- Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b4347005e12c49069d50a076f1302c2d~mv2.png",
    "volumeWeight": "440ml.",
    "dose": "",
    "drugs": "Cada 100 g de concentrado contiene: Cipermetrina 1,30 gramos",
    "externalLink": "http://www.koniglab.com/producto/kobra/",
    "price": 4204.6
  },
  {
    "id": "fbaeff9a-6720-bf0e-7007-1c8edb27d728",
    "title": "Revical Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Calcificante energético. - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_112dd92e5edb4af5a1787a103c2144bd~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Gluconato de calcio 20 g",
    "externalLink": "http://www.over.com.ar/product/revical-3/",
    "price": 0
  },
  {
    "id": "a8936c6c-6761-67e7-b7f2-aa0d80097ad5",
    "title": "Tilmicovet Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico, Antimicrobiano, Macrólido- Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ac84b6ce7e5347dcab3b6277b0afe59f~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Tilmicosina 30%",
    "externalLink": "https://www.zoovet.com.ar/es/grandes-animales/item/290-tilmicovet",
    "price": 0
  },
  {
    "id": "7c91249c-6fd3-f4b7-a8b0-1c41ae2b9ae6",
    "title": "Triben Calier 2,5l.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno oral saguaypicida. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2763c927c3fd484eb0d61a150ea3b0c6~mv2.png",
    "volumeWeight": "2,5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Triclabendazol 10 g",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b306fc71-92c5-cda3-ed48-c5d73490ef41",
    "title": "Ubrolexin Boehringer Ingelheim 20 inyectores de 10 ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Combinación intramamaria sinérgica y de amplio espectro para el tratamiento de las mastitis clínicas - Inyector intramamario estéril. - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bc06d54ad7d44f73a46462463d054a93~mv2.png",
    "volumeWeight": "10 ml.",
    "dose": "",
    "drugs": "Cefalexina monohidrato200 mg",
    "externalLink": "",
    "price": 103402.9
  },
  {
    "id": "6827418d-091a-3075-67fb-6f503f27d73c",
    "title": "Overxinil Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno - Tratamiento de infestaciones provocadas por trematodes. Aumenta la capacidad defensiva natural del hígado - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_66414f8b689d45a7bff601160d06404f~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Nitroxinil 34 g",
    "externalLink": "http://www.over.com.ar/product/overxinil-4/",
    "price": 0
  },
  {
    "id": "67e1a811-4edd-31f3-548f-67c4d4ba633c",
    "title": "Powermin ADE Zoovet 500ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Como energizante y fuente de minerales y/o vitaminas. Especial para el crecimiento, lactación y engorde. - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6920fca6504743b49e1a681166fd55c9~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "ATP 0,300 g",
    "externalLink": "https://www.zoovet.com.ar/images/Folletos/mineralizantes.pdf",
    "price": 0
  },
  {
    "id": "16a5cb7c-2fdd-208f-268a-c61bba747c87",
    "title": "Mamyzin S Boehringer Ingelheim 20 inyectores de 5 ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Inyector intramamario - Antibiótico intramamario para el secado de las vacas lecheras. - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_721cd890c2a34322b8a4b4ee01446892~mv2.png",
    "volumeWeight": "5 ml.",
    "dose": "",
    "drugs": "Penetamato yodhidrato 100 mg",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "e58f3370-9d02-a5e7-4678-1a963b61d9b8",
    "title": "Suraze Rosenbusch 5l.",
    "laboratory": "Rosenbusch",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno de amplio espectro, con poder ovicida, efectivo contra nematodes gastrointestinales y nematodes pulmonares, Tenias (anoplocephalideos) y Trematodes (Fasciola hepática). Actúa sobre Ostertagia inhibida. Destinado a bovinos. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_4330bca7dd99409dafb36b630db8c6e9~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Albendazol 10 g",
    "externalLink": "https://www.rosenbusch.com/argentina/gprodfarm_antiparasitarios.html",
    "price": 0
  },
  {
    "id": "7344df9e-795b-9fd5-b33d-039b2cd7727f",
    "title": "Maxibiotic LA Biogénesis Bago x250ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Solución antibiótica inyectable de amplio espectro y acción prolongada - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_98094b31a93b41a1b86335ab4a9a703e~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id79/",
    "price": 0
  },
  {
    "id": "4379a2b9-3595-e830-45b5-36dfc5376eb8",
    "title": "TDF 35 Zoovet 100ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento y prevención en bovinos de enfermedades respiratorias, queratoconjuntivitis y pododermatitis - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_14c29bc84872492daf332e1541903c54~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Tilmicosina 30%",
    "externalLink": "https://www.zoovet.com.ar/es/grandes-animales/item/288-tdf-35",
    "price": 30166.95
  },
  {
    "id": "acb19f51-500e-8802-8fa5-5bf2e95bb991",
    "title": "Microflud F Vetanco 100ml.",
    "laboratory": "Vetanco",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "El producto es activo contra los gérmenes sensibles al florfenicol - Está indicado para el tratamiento de enfermedades respiratorias, síndrome diarreico y afecciones podales de origen infeccioso - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_91f0723e60d14c45bc22cdda0349411d~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Florfenicol 30% Animales: Bovinos",
    "externalLink": "https://www.vetanco.com/es/produto/microflud-f/",
    "price": 0
  },
  {
    "id": "59d7677c-87b1-156e-086c-80deebde11e2",
    "title": "Bactrovet Plata Inyectable Konig 500ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida inyectable de amplio espectro y larga persistencia - Parasiticida de amplio espectro y larga persistencia que actúa sobre los parásitos internos y externos de importancia económica - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_fff81e50425c4bc8a0dbdcb0ae68be4b~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Doramectina: 1 g",
    "externalLink": "http://www.koniglab.com/en/producto/bactrovet-plata-inyectable/",
    "price": 0
  },
  {
    "id": "182927c3-8d24-6f98-8c99-a5faa4b33706",
    "title": "Caravana Botón Oficial SENASA Resolución 257 Allflex 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas oficiales SENASA resolución 257 - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_df8e0665044b4445aea48805d28434cc~mv2_d_6667_3751_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 3208.75
  },
  {
    "id": "cefbb45d-88ed-a608-0be3-5d950cd661a0",
    "title": "Caravana Binomio Oficial SENASA Resolución 257 Allflex 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas binomio oficial SENASA resolución 257 - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_01cee2fce96f43debcf449db2c79cdb9~mv2_d_6667_3751_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 13088.75
  },
  {
    "id": "fbfb8279-f086-a132-121b-25d5bc8a40e5",
    "title": "Ricoverm Konig x 625ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario de amplio espectro: adulticida, larvicida y ovicida - No irrita - Máxima biodisponibilidad - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c70ad833b691486798a2aa31efb90a2e~mv2.png",
    "volumeWeight": "625ml.",
    "dose": "",
    "drugs": "Cada 100 mL contiene: Ricobendazol 15 gramos",
    "externalLink": "http://www.koniglab.com/en/producto/ricoverm/",
    "price": 38379.55
  },
  {
    "id": "7cf227d4-876f-c1cc-5779-98e163405eb1",
    "title": "Caravana Maxi Carreteles Rafaela con número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Numeradas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8bf1cae9f7d846c69128289f46eae17a~mv2_d_6668_3752_s_4_2.png;06b954_9d8427fc46ab4a9fb304c9d10b6b8b1e~mv2_d_6668_3752_s_4_2.png;06b954_975ff750e9924815a309b590363ba1ff~mv2_d_6668_3752_s_4_2.png;06b954_f6c6fac9f99145eba1a0099d542f9bdc~mv2_d_6668_3752_s_4_2.png;06b954_7597623f7bab4113b040802f504ba7ff~mv2_d_6668_3752_s_4_2.png;06b954_2ff7bea15ad4463891b30486e2a43ba8~mv2_d_6668_3752_s_4_2.png;06b954_89b0270a4b5f4dc09e41957a5f5e4c7c~mv2_d_6668_3752_s_4_2.png;06b954_34bdb12ca0794ed7adef996107d803c4~mv2_d_6668_3752_s_4_2.png;06b954_1278891ee96846719da7f5f20f9dbfe2~mv2_d_6668_3752_s_4_2.png;06b954_825051215bf7480fb1826916ea4fa160~mv2_d_6668_3752_s_4_2.png;06b954_806711697b78487c896ab0b184a71c54~mv2_d_6668_3752_s_4_2.png;06b954_d9cf1b51a157440ea6079c634d601e1d~mv2_d_6668_3752_s_4_2.png;06b954_1576d77412e24beeab2e094677a21c44~mv2_d_6668_3752_s_4_2.png;06b954_249e2734dd304ed0b5c93b3f98e009bf~mv2_d_6668_3752_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "ad601a79-a7ff-3d33-e889-cd80388f118e",
    "title": "Caravana Maxi Carreteles Rafaela sin número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Sin numerar - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8bf1cae9f7d846c69128289f46eae17a~mv2_d_6668_3752_s_4_2.png;06b954_155db23591744b44ab8b6f0db6beb28f~mv2_d_6668_3752_s_4_2.png;06b954_975ff750e9924815a309b590363ba1ff~mv2_d_6668_3752_s_4_2.png;06b954_f6c6fac9f99145eba1a0099d542f9bdc~mv2_d_6668_3752_s_4_2.png;06b954_7597623f7bab4113b040802f504ba7ff~mv2_d_6668_3752_s_4_2.png;06b954_2ff7bea15ad4463891b30486e2a43ba8~mv2_d_6668_3752_s_4_2.png;06b954_89b0270a4b5f4dc09e41957a5f5e4c7c~mv2_d_6668_3752_s_4_2.png;06b954_34bdb12ca0794ed7adef996107d803c4~mv2_d_6668_3752_s_4_2.png;06b954_1278891ee96846719da7f5f20f9dbfe2~mv2_d_6668_3752_s_4_2.png;06b954_825051215bf7480fb1826916ea4fa160~mv2_d_6668_3752_s_4_2.png;06b954_806711697b78487c896ab0b184a71c54~mv2_d_6668_3752_s_4_2.png;06b954_d9cf1b51a157440ea6079c634d601e1d~mv2_d_6668_3752_s_4_2.png;06b954_1576d77412e24beeab2e094677a21c44~mv2_d_6668_3752_s_4_2.png;06b954_249e2734dd304ed0b5c93b3f98e009bf~mv2_d_6668_3752_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b8804ae6-192a-a7b8-407b-f22b3c7185d7",
    "title": "Caravana Premium Carreteles Rafaela con número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Numeradas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8e96cfbfa9324ad9a14ee9dbfe1ca190~mv2_d_6668_3752_s_4_2.png;06b954_9d8427fc46ab4a9fb304c9d10b6b8b1e~mv2_d_6668_3752_s_4_2.png;06b954_975ff750e9924815a309b590363ba1ff~mv2_d_6668_3752_s_4_2.png;06b954_f6c6fac9f99145eba1a0099d542f9bdc~mv2_d_6668_3752_s_4_2.png;06b954_7597623f7bab4113b040802f504ba7ff~mv2_d_6668_3752_s_4_2.png;06b954_2ff7bea15ad4463891b30486e2a43ba8~mv2_d_6668_3752_s_4_2.png;06b954_89b0270a4b5f4dc09e41957a5f5e4c7c~mv2_d_6668_3752_s_4_2.png;06b954_34bdb12ca0794ed7adef996107d803c4~mv2_d_6668_3752_s_4_2.png;06b954_1278891ee96846719da7f5f20f9dbfe2~mv2_d_6668_3752_s_4_2.png;06b954_825051215bf7480fb1826916ea4fa160~mv2_d_6668_3752_s_4_2.png;06b954_806711697b78487c896ab0b184a71c54~mv2_d_6668_3752_s_4_2.png;06b954_d9cf1b51a157440ea6079c634d601e1d~mv2_d_6668_3752_s_4_2.png;06b954_1576d77412e24beeab2e094677a21c44~mv2_d_6668_3752_s_4_2.png;06b954_249e2734dd304ed0b5c93b3f98e009bf~mv2_d_6668_3752_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "0f6ecf19-c535-2a17-df79-97cb2cb4e7c9",
    "title": "Caravana Premium Carreteles Rafaela sin número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Sin numerar - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8e96cfbfa9324ad9a14ee9dbfe1ca190~mv2_d_6668_3752_s_4_2.png;06b954_155db23591744b44ab8b6f0db6beb28f~mv2_d_6668_3752_s_4_2.png;06b954_975ff750e9924815a309b590363ba1ff~mv2_d_6668_3752_s_4_2.png;06b954_f6c6fac9f99145eba1a0099d542f9bdc~mv2_d_6668_3752_s_4_2.png;06b954_7597623f7bab4113b040802f504ba7ff~mv2_d_6668_3752_s_4_2.png;06b954_2ff7bea15ad4463891b30486e2a43ba8~mv2_d_6668_3752_s_4_2.png;06b954_89b0270a4b5f4dc09e41957a5f5e4c7c~mv2_d_6668_3752_s_4_2.png;06b954_34bdb12ca0794ed7adef996107d803c4~mv2_d_6668_3752_s_4_2.png;06b954_1278891ee96846719da7f5f20f9dbfe2~mv2_d_6668_3752_s_4_2.png;06b954_825051215bf7480fb1826916ea4fa160~mv2_d_6668_3752_s_4_2.png;06b954_806711697b78487c896ab0b184a71c54~mv2_d_6668_3752_s_4_2.png;06b954_d9cf1b51a157440ea6079c634d601e1d~mv2_d_6668_3752_s_4_2.png;06b954_1576d77412e24beeab2e094677a21c44~mv2_d_6668_3752_s_4_2.png;06b954_249e2734dd304ed0b5c93b3f98e009bf~mv2_d_6668_3752_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f5398d72-f014-aee1-66f7-41cd3c43c0de",
    "title": "Caravana Grande Carreteles Rafaela con número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Numeradas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_85f37421a7934957a348b6759048768f~mv2_d_6668_3752_s_4_2.png;06b954_9d8427fc46ab4a9fb304c9d10b6b8b1e~mv2_d_6668_3752_s_4_2.png;06b954_975ff750e9924815a309b590363ba1ff~mv2_d_6668_3752_s_4_2.png;06b954_f6c6fac9f99145eba1a0099d542f9bdc~mv2_d_6668_3752_s_4_2.png;06b954_7597623f7bab4113b040802f504ba7ff~mv2_d_6668_3752_s_4_2.png;06b954_2ff7bea15ad4463891b30486e2a43ba8~mv2_d_6668_3752_s_4_2.png;06b954_89b0270a4b5f4dc09e41957a5f5e4c7c~mv2_d_6668_3752_s_4_2.png;06b954_34bdb12ca0794ed7adef996107d803c4~mv2_d_6668_3752_s_4_2.png;06b954_1278891ee96846719da7f5f20f9dbfe2~mv2_d_6668_3752_s_4_2.png;06b954_825051215bf7480fb1826916ea4fa160~mv2_d_6668_3752_s_4_2.png;06b954_806711697b78487c896ab0b184a71c54~mv2_d_6668_3752_s_4_2.png;06b954_d9cf1b51a157440ea6079c634d601e1d~mv2_d_6668_3752_s_4_2.png;06b954_1576d77412e24beeab2e094677a21c44~mv2_d_6668_3752_s_4_2.png;06b954_249e2734dd304ed0b5c93b3f98e009bf~mv2_d_6668_3752_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a9b0a1fe-ea18-983d-b250-8bdbd5d16f7d",
    "title": "Caravana Grande Carreteles Rafaela sin número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Sin numerar - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_85f37421a7934957a348b6759048768f~mv2_d_6668_3752_s_4_2.png;06b954_155db23591744b44ab8b6f0db6beb28f~mv2_d_6668_3752_s_4_2.png;06b954_975ff750e9924815a309b590363ba1ff~mv2_d_6668_3752_s_4_2.png;06b954_f6c6fac9f99145eba1a0099d542f9bdc~mv2_d_6668_3752_s_4_2.png;06b954_7597623f7bab4113b040802f504ba7ff~mv2_d_6668_3752_s_4_2.png;06b954_2ff7bea15ad4463891b30486e2a43ba8~mv2_d_6668_3752_s_4_2.png;06b954_89b0270a4b5f4dc09e41957a5f5e4c7c~mv2_d_6668_3752_s_4_2.png;06b954_34bdb12ca0794ed7adef996107d803c4~mv2_d_6668_3752_s_4_2.png;06b954_1278891ee96846719da7f5f20f9dbfe2~mv2_d_6668_3752_s_4_2.png;06b954_825051215bf7480fb1826916ea4fa160~mv2_d_6668_3752_s_4_2.png;06b954_806711697b78487c896ab0b184a71c54~mv2_d_6668_3752_s_4_2.png;06b954_d9cf1b51a157440ea6079c634d601e1d~mv2_d_6668_3752_s_4_2.png;06b954_1576d77412e24beeab2e094677a21c44~mv2_d_6668_3752_s_4_2.png;06b954_249e2734dd304ed0b5c93b3f98e009bf~mv2_d_6668_3752_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "fc56f4e8-4733-0d0d-e56f-8c776f032087",
    "title": "Caravana Chica Carreteles Rafaela con número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Numeradas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_352744a346a04d0983a747fad076ad64~mv2_d_6668_3752_s_4_2.png;06b954_9d8427fc46ab4a9fb304c9d10b6b8b1e~mv2_d_6668_3752_s_4_2.png;06b954_975ff750e9924815a309b590363ba1ff~mv2_d_6668_3752_s_4_2.png;06b954_f6c6fac9f99145eba1a0099d542f9bdc~mv2_d_6668_3752_s_4_2.png;06b954_7597623f7bab4113b040802f504ba7ff~mv2_d_6668_3752_s_4_2.png;06b954_2ff7bea15ad4463891b30486e2a43ba8~mv2_d_6668_3752_s_4_2.png;06b954_89b0270a4b5f4dc09e41957a5f5e4c7c~mv2_d_6668_3752_s_4_2.png;06b954_34bdb12ca0794ed7adef996107d803c4~mv2_d_6668_3752_s_4_2.png;06b954_1278891ee96846719da7f5f20f9dbfe2~mv2_d_6668_3752_s_4_2.png;06b954_825051215bf7480fb1826916ea4fa160~mv2_d_6668_3752_s_4_2.png;06b954_806711697b78487c896ab0b184a71c54~mv2_d_6668_3752_s_4_2.png;06b954_d9cf1b51a157440ea6079c634d601e1d~mv2_d_6668_3752_s_4_2.png;06b954_1576d77412e24beeab2e094677a21c44~mv2_d_6668_3752_s_4_2.png;06b954_249e2734dd304ed0b5c93b3f98e009bf~mv2_d_6668_3752_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7e01c7be-7f11-fcdd-0b0d-d080f5f9578c",
    "title": "Caravana Binomio Oficial SENASA Resolución 257 Carreteles Rafaela 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas binomio oficial SENASA resolución 257 - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_01cee2fce96f43debcf449db2c79cdb9~mv2_d_6667_3751_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 8536.25
  },
  {
    "id": "298c0a42-0632-1a80-ece6-365c185bc0e4",
    "title": "Caravana Botón Oficial SENASA Resolución 257 Carreteles Rafaela 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas oficiales SENASA resolución 257 - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_df8e0665044b4445aea48805d28434cc~mv2_d_6667_3751_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 2562.5
  },
  {
    "id": "b7c43204-248c-d0b4-1de6-bf4181290615",
    "title": "Caravana Chica Carreteles Rafaela sin número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Sin numerar - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_352744a346a04d0983a747fad076ad64~mv2_d_6668_3752_s_4_2.png;06b954_155db23591744b44ab8b6f0db6beb28f~mv2_d_6668_3752_s_4_2.png;06b954_975ff750e9924815a309b590363ba1ff~mv2_d_6668_3752_s_4_2.png;06b954_f6c6fac9f99145eba1a0099d542f9bdc~mv2_d_6668_3752_s_4_2.png;06b954_7597623f7bab4113b040802f504ba7ff~mv2_d_6668_3752_s_4_2.png;06b954_2ff7bea15ad4463891b30486e2a43ba8~mv2_d_6668_3752_s_4_2.png;06b954_89b0270a4b5f4dc09e41957a5f5e4c7c~mv2_d_6668_3752_s_4_2.png;06b954_34bdb12ca0794ed7adef996107d803c4~mv2_d_6668_3752_s_4_2.png;06b954_1278891ee96846719da7f5f20f9dbfe2~mv2_d_6668_3752_s_4_2.png;06b954_825051215bf7480fb1826916ea4fa160~mv2_d_6668_3752_s_4_2.png;06b954_806711697b78487c896ab0b184a71c54~mv2_d_6668_3752_s_4_2.png;06b954_d9cf1b51a157440ea6079c634d601e1d~mv2_d_6668_3752_s_4_2.png;06b954_1576d77412e24beeab2e094677a21c44~mv2_d_6668_3752_s_4_2.png;06b954_249e2734dd304ed0b5c93b3f98e009bf~mv2_d_6668_3752_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1516b920-05ae-469e-4413-4b0930d89af9",
    "title": "Caravana Chica Carreteles Rafaela con número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Numeradas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_23bb1944ae244cf39e2637bf863680c4~mv2_d_1950_1950_s_2.png;06b954_91f67064702c40a490b5a0b35d8ab945~mv2_d_1950_1950_s_2.png;06b954_717238b684a5426c84a1d0d36bdd2463~mv2_d_1950_1949_s_2.png;06b954_862b2831aca147969dcc37777e757617~mv2_d_1950_1950_s_2.png;06b954_a9265801c7784e1685003f7151a06b5d~mv2_d_1950_1950_s_2.png;06b954_2f99f718e3054d6fb91f1abedf916a8f~mv2_d_1950_1950_s_2.png;06b954_13d54f35313640d1b458f5f145299225~mv2_d_1950_1950_s_2.png;06b954_881c2a30742e4129b4a638c2c29c196a~mv2_d_1950_1950_s_2.png;06b954_ebaaefe40e5d430ba804d91f222b863f~mv2_d_1950_1950_s_2.png;06b954_b6ea78716a45436994e4a67fab8301e5~mv2_d_1950_1950_s_2.png;06b954_5ff225fc3bf2477ea5ab53ce27e4aa5a~mv2_d_1950_1949_s_2.png;06b954_af5d807238d14d828ed74a2a3aa15fea~mv2_d_1950_1950_s_2.png;06b954_9e24f2dcdc14420599cb6e9573e5b006~mv2_d_1950_1949_s_2.png;06b954_8b0068fb16c44e30be3ff0c7e42d83cf~mv2_d_1950_1950_s_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "3aa3a217-975b-a49f-de88-c109285a3e4a",
    "title": "Caravana Grande Carreteles Rafaela con número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Numeradas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_357ea9c377c145a3b2c6a7cfba640134~mv2_d_1950_1949_s_2.png;06b954_91f67064702c40a490b5a0b35d8ab945~mv2_d_1950_1950_s_2.png;06b954_717238b684a5426c84a1d0d36bdd2463~mv2_d_1950_1949_s_2.png;06b954_862b2831aca147969dcc37777e757617~mv2_d_1950_1950_s_2.png;06b954_a9265801c7784e1685003f7151a06b5d~mv2_d_1950_1950_s_2.png;06b954_2f99f718e3054d6fb91f1abedf916a8f~mv2_d_1950_1950_s_2.png;06b954_13d54f35313640d1b458f5f145299225~mv2_d_1950_1950_s_2.png;06b954_881c2a30742e4129b4a638c2c29c196a~mv2_d_1950_1950_s_2.png;06b954_ebaaefe40e5d430ba804d91f222b863f~mv2_d_1950_1950_s_2.png;06b954_b6ea78716a45436994e4a67fab8301e5~mv2_d_1950_1950_s_2.png;06b954_5ff225fc3bf2477ea5ab53ce27e4aa5a~mv2_d_1950_1949_s_2.png;06b954_af5d807238d14d828ed74a2a3aa15fea~mv2_d_1950_1950_s_2.png;06b954_9e24f2dcdc14420599cb6e9573e5b006~mv2_d_1950_1949_s_2.png;06b954_8b0068fb16c44e30be3ff0c7e42d83cf~mv2_d_1950_1950_s_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "56aa5307-22d6-8411-e6cd-c6df31e6b418",
    "title": "Caravana Premium Carreteles Rafaela con número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Numeradas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e371f17cddee4e359d688580cf11950a~mv2_d_1950_1949_s_2.png;06b954_91f67064702c40a490b5a0b35d8ab945~mv2_d_1950_1950_s_2.png;06b954_717238b684a5426c84a1d0d36bdd2463~mv2_d_1950_1949_s_2.png;06b954_862b2831aca147969dcc37777e757617~mv2_d_1950_1950_s_2.png;06b954_a9265801c7784e1685003f7151a06b5d~mv2_d_1950_1950_s_2.png;06b954_2f99f718e3054d6fb91f1abedf916a8f~mv2_d_1950_1950_s_2.png;06b954_13d54f35313640d1b458f5f145299225~mv2_d_1950_1950_s_2.png;06b954_881c2a30742e4129b4a638c2c29c196a~mv2_d_1950_1950_s_2.png;06b954_ebaaefe40e5d430ba804d91f222b863f~mv2_d_1950_1950_s_2.png;06b954_b6ea78716a45436994e4a67fab8301e5~mv2_d_1950_1950_s_2.png;06b954_5ff225fc3bf2477ea5ab53ce27e4aa5a~mv2_d_1950_1949_s_2.png;06b954_af5d807238d14d828ed74a2a3aa15fea~mv2_d_1950_1950_s_2.png;06b954_9e24f2dcdc14420599cb6e9573e5b006~mv2_d_1950_1949_s_2.png;06b954_8b0068fb16c44e30be3ff0c7e42d83cf~mv2_d_1950_1950_s_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d4287ba6-4fca-39dd-d978-0cb4707afb1d",
    "title": "Caravana Maxi Carreteles Rafaela sin número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Sin numerar- Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2ef6b85a1ce54b29803ab30a88fa64ab~mv2_d_1950_1950_s_2.png;06b954_42b671fa74ee46b7b5c22f999002c6ce~mv2_d_1950_1950_s_2.png;06b954_717238b684a5426c84a1d0d36bdd2463~mv2_d_1950_1949_s_2.png;06b954_862b2831aca147969dcc37777e757617~mv2_d_1950_1950_s_2.png;06b954_a9265801c7784e1685003f7151a06b5d~mv2_d_1950_1950_s_2.png;06b954_2f99f718e3054d6fb91f1abedf916a8f~mv2_d_1950_1950_s_2.png;06b954_13d54f35313640d1b458f5f145299225~mv2_d_1950_1950_s_2.png;06b954_881c2a30742e4129b4a638c2c29c196a~mv2_d_1950_1950_s_2.png;06b954_ebaaefe40e5d430ba804d91f222b863f~mv2_d_1950_1950_s_2.png;06b954_b6ea78716a45436994e4a67fab8301e5~mv2_d_1950_1950_s_2.png;06b954_5ff225fc3bf2477ea5ab53ce27e4aa5a~mv2_d_1950_1949_s_2.png;06b954_af5d807238d14d828ed74a2a3aa15fea~mv2_d_1950_1950_s_2.png;06b954_9e24f2dcdc14420599cb6e9573e5b006~mv2_d_1950_1949_s_2.png;06b954_8b0068fb16c44e30be3ff0c7e42d83cf~mv2_d_1950_1950_s_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "596746d1-76ad-471e-ed5f-89b99b8a8d35",
    "title": "Caravana Grande Carreteles Rafaela sin número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Sin Numerar - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_357ea9c377c145a3b2c6a7cfba640134~mv2_d_1950_1949_s_2.png;06b954_42b671fa74ee46b7b5c22f999002c6ce~mv2_d_1950_1950_s_2.png;06b954_717238b684a5426c84a1d0d36bdd2463~mv2_d_1950_1949_s_2.png;06b954_862b2831aca147969dcc37777e757617~mv2_d_1950_1950_s_2.png;06b954_a9265801c7784e1685003f7151a06b5d~mv2_d_1950_1950_s_2.png;06b954_2f99f718e3054d6fb91f1abedf916a8f~mv2_d_1950_1950_s_2.png;06b954_13d54f35313640d1b458f5f145299225~mv2_d_1950_1950_s_2.png;06b954_881c2a30742e4129b4a638c2c29c196a~mv2_d_1950_1950_s_2.png;06b954_ebaaefe40e5d430ba804d91f222b863f~mv2_d_1950_1950_s_2.png;06b954_b6ea78716a45436994e4a67fab8301e5~mv2_d_1950_1950_s_2.png;06b954_5ff225fc3bf2477ea5ab53ce27e4aa5a~mv2_d_1950_1949_s_2.png;06b954_af5d807238d14d828ed74a2a3aa15fea~mv2_d_1950_1950_s_2.png;06b954_9e24f2dcdc14420599cb6e9573e5b006~mv2_d_1950_1949_s_2.png;06b954_8b0068fb16c44e30be3ff0c7e42d83cf~mv2_d_1950_1950_s_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a1875122-d143-65cc-abf4-24c86b33c623",
    "title": "Caravana Premium Carreteles Rafaela sin número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Sin Numerar - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e371f17cddee4e359d688580cf11950a~mv2_d_1950_1949_s_2.png;06b954_42b671fa74ee46b7b5c22f999002c6ce~mv2_d_1950_1950_s_2.png;06b954_717238b684a5426c84a1d0d36bdd2463~mv2_d_1950_1949_s_2.png;06b954_862b2831aca147969dcc37777e757617~mv2_d_1950_1950_s_2.png;06b954_a9265801c7784e1685003f7151a06b5d~mv2_d_1950_1950_s_2.png;06b954_2f99f718e3054d6fb91f1abedf916a8f~mv2_d_1950_1950_s_2.png;06b954_13d54f35313640d1b458f5f145299225~mv2_d_1950_1950_s_2.png;06b954_881c2a30742e4129b4a638c2c29c196a~mv2_d_1950_1950_s_2.png;06b954_ebaaefe40e5d430ba804d91f222b863f~mv2_d_1950_1950_s_2.png;06b954_b6ea78716a45436994e4a67fab8301e5~mv2_d_1950_1950_s_2.png;06b954_5ff225fc3bf2477ea5ab53ce27e4aa5a~mv2_d_1950_1949_s_2.png;06b954_af5d807238d14d828ed74a2a3aa15fea~mv2_d_1950_1950_s_2.png;06b954_9e24f2dcdc14420599cb6e9573e5b006~mv2_d_1950_1949_s_2.png;06b954_8b0068fb16c44e30be3ff0c7e42d83cf~mv2_d_1950_1950_s_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4a3a8c08-a639-94f6-8306-1f2fef15f7bd",
    "title": "Caravana Maxi Carreteles Rafaela con número 25u.",
    "laboratory": "Carreteles Rafaela",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Numeradas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2ef6b85a1ce54b29803ab30a88fa64ab~mv2_d_1950_1950_s_2.png;06b954_91f67064702c40a490b5a0b35d8ab945~mv2_d_1950_1950_s_2.png;06b954_717238b684a5426c84a1d0d36bdd2463~mv2_d_1950_1949_s_2.png;06b954_862b2831aca147969dcc37777e757617~mv2_d_1950_1950_s_2.png;06b954_a9265801c7784e1685003f7151a06b5d~mv2_d_1950_1950_s_2.png;06b954_2f99f718e3054d6fb91f1abedf916a8f~mv2_d_1950_1950_s_2.png;06b954_13d54f35313640d1b458f5f145299225~mv2_d_1950_1950_s_2.png;06b954_881c2a30742e4129b4a638c2c29c196a~mv2_d_1950_1950_s_2.png;06b954_ebaaefe40e5d430ba804d91f222b863f~mv2_d_1950_1950_s_2.png;06b954_b6ea78716a45436994e4a67fab8301e5~mv2_d_1950_1950_s_2.png;06b954_5ff225fc3bf2477ea5ab53ce27e4aa5a~mv2_d_1950_1949_s_2.png;06b954_af5d807238d14d828ed74a2a3aa15fea~mv2_d_1950_1950_s_2.png;06b954_9e24f2dcdc14420599cb6e9573e5b006~mv2_d_1950_1949_s_2.png;06b954_8b0068fb16c44e30be3ff0c7e42d83cf~mv2_d_1950_1950_s_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b36f2db3-5932-0ee7-b616-42d3b40996ab",
    "title": "Kit Reproductivo Full Zoovet 50 dispositivos.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Presentación comercial que contiene todos los elementos necesarios para la ejecución de los protocolos de IATF clásicos en hembras bovinas. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6bdaf5facbb1469b9d1b46f49544eab1~mv2.png",
    "volumeWeight": "50 dispositivos.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.mercosur.com/media/filer_public/2c/e0/2ce00082-0e12-49ad-aca9-e1a02346bf43/grandes20animales.pdf",
    "price": 0
  },
  {
    "id": "dc2f745f-2908-8629-c941-7d6ac0fa3f6d",
    "title": "MAS D3 Zoovet 100 jeringas de 10 ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento de mastitis producidas por microorganismos sensibles a la Espira-micina adipato, Gentamicina base, durante la lactancia en bovinos. Con un nuevo concepto de inmunoestimulación local por el aporte vitamínico. - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8d072198d9424a47adb05b64d7e0023f~mv2.png",
    "volumeWeight": "10 ml.",
    "dose": "",
    "drugs": "Cada inyector contiene de 10 ml: Espiramicina adipato 300 mg",
    "externalLink": "https://www.mercosur.com/media/filer_public/2c/e0/2ce00082-0e12-49ad-aca9-e1a02346bf43/grandes20animales.pdf",
    "price": 264050
  },
  {
    "id": "102ce8f0-a5af-336a-fc8d-2408b7b05c3f",
    "title": "Aguja Aplicador de Caravanas Allflex",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aguja para Aplicador de Caravanas.",
    "image": "https://static.wixstatic.com/media/06b954_af6738c4f64e47c3b16f12c632f8e175~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 7996.8
  },
  {
    "id": "83198988-aeba-f8f2-0f71-e75983262b30",
    "title": "Kit Dispocel Von Franken 100 dispositivos.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Control del ciclo estral en vaquillonas y vacas para Inseminación a Tiempo Fijo o a celo detectado - Tratamiento del anestro post-parto - Acortamiento del período parto concepción - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_02217a61de8b49448d2559c2bb65c134~mv2.png",
    "volumeWeight": "100 dispositivos.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Grandes-Animales_Hormonales/Dispocel-Monouso",
    "price": 0
  },
  {
    "id": "a5877a96-6545-7fea-9434-285771cf9e75",
    "title": "Entero Plus Capsulas Zoovet x100u.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Bacteriostático intestinal - Se trata de una formulación antimicrobiana de amplio espectro asociada a un adsorbente gastrointestinal. Se indica para el tratamiento de enteritis, gastroenteritis y diarreas inespecíficas- Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1ff2ad48b3bb42c7b2b55768e1c5fd61~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Cada cápsula contiene: Enrofloxacina 100 mg",
    "externalLink": "https://www.mercosur.com/media/filer_public/2c/e0/2ce00082-0e12-49ad-aca9-e1a02346bf43/grandes20animales.pdf",
    "price": 0
  },
  {
    "id": "4e09c343-43a8-633c-10e3-6d023d875db2",
    "title": "Tilmicofull Spray Zoovet 200ml.",
    "laboratory": "Zoovet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento de la queratoconjuntivitis infecciosa - Antimicrobiano, Antiflamatorio - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9952a003832545f9817daacd04090f13~mv2.png",
    "volumeWeight": "200ml.",
    "dose": "",
    "drugs": "Tilmicosina 2,5 g",
    "externalLink": "https://www.mercosur.com/media/filer_public/2c/e0/2ce00082-0e12-49ad-aca9-e1a02346bf43/grandes20animales.pdf",
    "price": 0
  },
  {
    "id": "047f6957-6ad1-1e8b-da9e-3ef98d43f7fa",
    "title": "Torniquete N°8 Golondrina.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Tanto la calidad de sus materiales, su construcción y su recubrimiento protector, garantizan en el torniquete resistencia y una vida útil prolongada.",
    "image": "https://static.wixstatic.com/media/06b954_233596603f264d41873975b09256e6f1~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a790c9cc-f592-b2bc-1544-e0983fe992ec",
    "title": "Overmectina Duplex Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida inyectable, destinado al tratamiento y control de parasitosis externas e internas - Antiparasitario interno y externo de amplio espectro - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1fab2513cbdf44c78246a4ac77655ab8~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Levamisol clorhidrato 20 g",
    "externalLink": "http://www.over.com.ar/product/overmectina-duplex-4/",
    "price": 0
  },
  {
    "id": "e5ecfa09-a95c-bf2f-3c0a-1af8cf4afa86",
    "title": "Tilmic Mivet 100ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiotico Inyectable de amplio espectro - Indicado en el tratamiento de Enfermedades u otros cuadros infecciosos causados por gérmenes sensibles a la Tilmicosina. - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_87c4f4d6a0eb465eb15616031855017f~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 mL contiene: Tilmicosina (como fosfato) 30 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/tilmic/",
    "price": 0
  },
  {
    "id": "173f7a26-564c-d513-896b-d3593102aa3c",
    "title": "Carretel Vacío Carreteles Rafaela.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Carretel vacío",
    "image": "https://static.wixstatic.com/media/06b954_d7995f1b4c29446db2a58737c589ad82~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5f2a4dbe-47eb-491b-dde1-c066c34456b6",
    "title": "Fosfamisol Biogenesis Bago 500ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno inyectable de amplio espectro para bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_950de1330cdf45b4af45d7b64d0050ea~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Fosfato de L-tetramisol, 22,3 g Excipientes c",
    "externalLink": "http://www.biogenesisbago.com/sv/productos/id293/",
    "price": 0
  },
  {
    "id": "87c933e9-64a3-4ced-14ee-766167af0385",
    "title": "Kuramicina L.A. Konig 250ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable de acción inmediata y prolongada. - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b878b276b62e4b7eb80ea99dc0f9c1e9~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Oxitetraciclina base (como clorhidrato) 20 g",
    "externalLink": "http://www.koniglab.com/producto/kuramicina-l-a/",
    "price": 18007.9
  },
  {
    "id": "ac6b998b-7d87-4a5f-89e2-aa2fdf393400",
    "title": "Distrepbencil E-T Novartis x 25 ampollas.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Distrepbencil E-T es una combinación de tres tipos de penicilina, eficaz contra una amplia variedad de bacterias gram-positivas y gram-negativas - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_de1456a65ff843db8a925b908398de86~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Penicilina G benzatínica: 2",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "61926f1e-ba23-5eb9-0a48-eae22a4493c2",
    "title": "Batoxil L.A. Richmond 500ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico de amplio espectro y acción prolongada - Es una solución inyectable estéril de Oxitetraciclina - Antimicrobiano Bacteriostático, formulado especialmente con agentes y vehículos que le confieren a su formulación un efecto prolongado - Logra concentraciones óptimas en fluidos corporales, suero y exudados - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c694b14e5c5447368297683c5c17b2fe~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Oxitetraciclina base: 20 g",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=2&amp;id=11&amp;pg=1",
    "price": 29800
  },
  {
    "id": "f46a2de7-4180-503d-510f-79626502c5df",
    "title": "Revimin Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Formulación completa de vitaminas y minerales destinada a prevenir y corregir la carencia de los mismos - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2965c93df2a1419f955b8f267626612e~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Vitamina A palmitato 0,50 g",
    "externalLink": "http://www.over.com.ar/product/revimin/",
    "price": 0
  },
  {
    "id": "90999f1a-1184-7da3-2e29-fe6405017c87",
    "title": "Aceite Curativo MSD 500ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiséptico, Calmante, Cicatrizante y Repelente de uso externo - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_a93ebffede4149758f784e596ba2cf48~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.msd-salud-animal.com.ar/products/aceite-curativo/product-aceite-curativo.aspx",
    "price": 0
  },
  {
    "id": "d0f9af0d-be33-2afc-e911-79da916b6fc2",
    "title": "Coagulamax DUO Over 50ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Coagulante - Prevención y tratamiento de hemorragias de etiología y localización diversa - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_566648c2617c40ebba31368e781e1ac9~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Etamsilato 15 g",
    "externalLink": "http://www.over.com.ar/product/coagulamax-duo/",
    "price": 0
  },
  {
    "id": "333e7344-7e57-3124-380d-c60c9ffcd7e7",
    "title": "Tetraciclina C InmunoVet 100 capsulas.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico vitaminado de amplio espectro - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_4f0c2bc11616456f8492f9189333dd3a~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Sulfametoxazol",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "682a8bda-218a-2fb3-9c38-73ba82c5f290",
    "title": "Romagel Lactancia Boehringer 160 Jeringas.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamientode mastitis clínicas y subclínicas en vacas en lactanciay vaquillonas, causadas por bacterias sensibles,incluídas las que producen beta-lactamasas. - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2649542d08924436b7fbbdf914b46b8f~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Lincomicina 330 mg (como clorhidrato)",
    "externalLink": "http://www.merial.com.ar/Producers/Dairy/Products/Pages/ROMAGEL%C2%AE.aspx",
    "price": 699502.95
  },
  {
    "id": "ed951bc0-0230-4087-0a53-e956d396a306",
    "title": "Varilla de Hierro con Rulo x 8mm.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "De hierro aleteado, la varilla de hierro con rulo es ideal para suelos duros. La horquilla y su vara superior, facilitan su colocación.",
    "image": "https://static.wixstatic.com/media/06b954_c9fc5d8dc2864b91b3ab43ad673d5531~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "25daa576-e8f3-eb68-ab4a-93d2ed49321a",
    "title": "Varilla de Hierro con Rulo x 10mm.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "De hierro aleteado, la varilla de hierro con rulo es ideal para suelos duros. La horquilla y su vara superior, facilitan su colocación.",
    "image": "https://static.wixstatic.com/media/06b954_b421c816a8b9438e80dc5fba3b0f1ca3~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "cdd46058-9e23-fb6f-af06-b3a075cb3a23",
    "title": "Varilla de Hierro con Doble Rulo x 10mm.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "De hierro aleteado, la varilla de hierro con rulo es ideal para suelos duros. La horquilla y su vara superior, facilitan su colocación. El doble rulo le confiere mayor funcionalidad al contar con mayor espacio para pasar cables.",
    "image": "https://static.wixstatic.com/media/06b954_336cd3a43c2c405490f5ad196af3f901~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5a2771ea-7b7b-f282-5df0-2f0caabf8e9a",
    "title": "Varilla Plastica c/alma de Acero.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "La varilla con alma de acero galvanizado posee un cuerpo exterior de plástico estabilizado con UV para una aislación eficaz. Además. Su para robusta cuenta con dos puntas de acero que facilita su colocación.",
    "image": "https://static.wixstatic.com/media/06b954_c995d76883dc4e979128e9a61231bad1~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b82a7509-4fec-1934-7b90-a84bb5918908",
    "title": "Torniquete con Aislador.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Tanto la calidad de sus materiales, su construcción y su recubrimiento protector, garantizan en el torniquete resistencia y una vida útil prolongada.",
    "image": "https://static.wixstatic.com/media/06b954_762d192129524a37816da093875bb3fa~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "e4ad865e-dfaf-4c6d-01f3-e67be4322968",
    "title": "Torniquete N°6 Golondrina.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Tanto la calidad de sus materiales, su construcción y su recubrimiento protector, garantizan en el torniquete resistencia y una vida útil prolongada.",
    "image": "https://static.wixstatic.com/media/06b954_07548543badb492594d3165d943fc65f~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "df2c79fc-2356-b78c-c9b0-052c2a3db12d",
    "title": "Manija Premium.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Inyectada en polietileno con inhibidor UV, la manija premium posee un resorte y gancho en acero galvanizado que permiten un enganche seguro.",
    "image": "https://static.wixstatic.com/media/06b954_2a78d7e50f144e3892b0f0ef7c9fd922~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b0d97dfd-29ae-2e38-dbb9-f2aa0db5deb9",
    "title": "Manija Importada.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "La manija negro garantiza un agarre firme, y tanto su cobertura de caucho reforzado como el tubo interior semi-rígido de vinilo, proporcionan una capa adicional de aislamiento.",
    "image": "https://static.wixstatic.com/media/06b954_7a5947174aa44b4ca58259742064d63b~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "197b8b0d-208f-3770-f1a4-3249b701b422",
    "title": "Manija Importada.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Manija con una cobertura de vinilo, la manija asegura un efecto aislante.",
    "image": "https://static.wixstatic.com/media/06b954_0d74ab3ab8ab49c38ae582229b315862~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d1119c65-4606-8574-ab71-43651d67d4ce",
    "title": "Manija Plastica de Compresion Full.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Para instalar pasos o puertas de cerco eléctrico y permitir una fácil apertura y cierre. - Gancho en acero galvanizado - Más robusta, más resistente, más aislación - Inyectado en polietileno con protección UV.",
    "image": "https://static.wixstatic.com/media/06b954_7bc7fd917cef41a593b5a3d4b6467431~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "2cc7339f-ade0-b49d-0f4e-35ac7c9ce890",
    "title": "Manija Nacional.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "La manija negra garantiza un agarre firme, y tanto su cobertura de caucho reforzado como el tubo interior semi-rígido de vinilo, proporcionan una capa adicional de aislamiento.",
    "image": "https://static.wixstatic.com/media/06b954_957b0705b0ec482e8c1f423fa847080b~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a3e99783-5389-f0c1-1f50-7f15f7110ffa",
    "title": "Mango Aislante.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Mango Aislante inyectado en polietileno con inhibidor UV, el diseño ergonómico de este asegura el enganche y facilita la extracción.",
    "image": "https://static.wixstatic.com/media/06b954_032e31d560c44a5c9ddc1166fcb255b9~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "03a7b684-bc11-0bd9-5df6-a7641fcc48c3",
    "title": "Llave de Corte.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Llave de corte inyectada en polipropileno con aditivo UV, sus contactos firmes y seguros en acero inoxidable garantizan en la llave de corte confiabilidad a lo largo del tiempo.",
    "image": "https://static.wixstatic.com/media/06b954_3714ab1a05ca4afb9fed9dfdc115fb76~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "0800c046-1507-3d16-2060-48a0afb21e62",
    "title": "Aislador Campanita de Porcelana Importado.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aislador fabricado con porcelana resistente, los aisladores campanita de porcelana están recubiertos además de un barniz protector.",
    "image": "https://static.wixstatic.com/media/06b954_b2695e0692054e2093a80f9ad194e6ce~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f3143604-5cef-a6c2-1efd-c0132d7c94f5",
    "title": "Aislador Carretel de Porcelana Importado.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aislador fabricado con porcelana resistente, los aisladores carreteles de porcelana están recubiertos además de un barniz protector.",
    "image": "https://static.wixstatic.com/media/06b954_45047b4328bf477db0273b1c1cc45b42~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "13a1e7b5-c6ca-3f98-0b04-e2653d9cc2b9",
    "title": "Aislador Esquinero de Porcelana Importado.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aislador fabricado con porcelana resistente, los aisladores esquineros de porcelana están recubiertos además de un barniz protector.",
    "image": "https://static.wixstatic.com/media/06b954_ffc4c60b6ab24fd69d92882c93519f94~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b0bf8fa9-5bd0-558e-ec5c-40b1a2eafce3",
    "title": "Aislador Esquinero de Porcelana c/agujeros Importado.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aislador fabricado con porcelana resistente, los aisladores esquineros de porcelana están recubiertos además de un barniz protector.",
    "image": "https://static.wixstatic.com/media/06b954_67455bb6accf4463b7e461369d9c90a6~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "68ede3bf-3250-9482-4a26-729b9ae92801",
    "title": "Aislador Roldana x unidad.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aislador inyectado en polietileno con inhibidor UV, el aislador Roldana posee un orificio amplio que permite que el alambre se deslice aun con empalmes.",
    "image": "https://static.wixstatic.com/media/06b954_5fb69d3e0ed546db92e3d038ded2ebfe~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "0af44f74-4676-53cb-4bb4-5820516e076a",
    "title": "Aislador Campanita x 100u.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aislador inyectado en polietileno con inhibidor UV, el Aislador Campanita es de uso conveniente en casos de tensiones largas de la cerca.",
    "image": "https://static.wixstatic.com/media/06b954_1a5ca9d254fa41c1850aaab8ea5a1601~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "28cfe613-a9c5-fde3-8780-0c22eb234e09",
    "title": "Aislador Esquinero x unidad.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aislador inyectado en polietileno con inhibidor UV, el aislador esquinero asegura la tensión del centro del aislador al atar.",
    "image": "https://static.wixstatic.com/media/06b954_6381b8f41fd7421ebd0f0b322f3cb2c5~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "56d46d30-28de-50f5-da88-32c0667de703",
    "title": "Aislador Esquinero Maxi Rienda x unidad.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aislador inyectado en polietileno con inhibidor UV, el aislador esquinero asegura la tensión del centro del aislador al atar.",
    "image": "https://static.wixstatic.com/media/06b954_561066cf1fec4bb38104af88edab8213~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4abeb4af-6344-a865-a694-dfeb50c1c2ef",
    "title": "Ememast Plus Lactancia Boehringer 160 Jeringas.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento curativo de la Mastitis subclínica y clínica(agudas y crónicas) de vacas lecheras durante lalactancia, causadas por gérmenes sensibles a laespiramicina y a la neomicina - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e00c8ee283a54858961d28f1224f9bf8~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Flumetasona 0,0025 g",
    "externalLink": "http://www.merial.com.ar/Producers/Dairy/Products/Pages/EMEMAST-PLUS-%C2%AE.aspx",
    "price": 0
  },
  {
    "id": "e50427fa-846e-3cb7-fa8b-37b8e6274d23",
    "title": "Tuberculina Providean Tecnovax 50 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Derivado proteico purificado, inyectable - Para el tratamiento de la tuberculosis bovina - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_346a9f598be44000b67e6675e299b2f7~mv2.png;06b954_43bf9a182200493998be783f805417b6~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/ppd-3000-tuberculina-bovina/",
    "price": 0
  },
  {
    "id": "a21251ec-936d-4d07-b75d-74379df2a5ca",
    "title": "Overline Large Duo Over 5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo Pour-on - Antiparasitario interno y externo pour on para uso en bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7f4f615af3fe40ac8cbaf5dabea55e75~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Fipronil 1 g",
    "externalLink": "http://www.over.com.ar/product/overline-large-duo/",
    "price": 0
  },
  {
    "id": "59504fc0-e58c-6128-59df-b42ab931d1da",
    "title": "Electrificador Solar 40km Mandinga B120 con Bateria.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga B120 - Funciona a energía solar.",
    "image": "https://static.wixstatic.com/media/06b954_d5afeaa9c16d40ed8a19c3e4421883e5~mv2.png;06b954_06c9ea5ce9194bce9b5d9e29539363bb~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a2555866-6b52-6975-72d7-8e4bf20ed168",
    "title": "Electrificador Solar 20km Mandinga B60 con Bateria.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga B60 - Funciona a energía solar.",
    "image": "https://static.wixstatic.com/media/06b954_8cf28171174944d7b3394c3582b4b3d5~mv2.png;06b954_06c9ea5ce9194bce9b5d9e29539363bb~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "e5cde3f1-60fd-ec34-bd13-06f14ca0c4d4",
    "title": "Electrificador 220 V 200km Mandinga C1200.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga C1200 - Desde pequeñas superficies hasta más de 1000 has electrificadas en forma segura. Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_578701b04eaa444cb700831467841ada~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "60c1a5b1-6735-1e67-175e-231a4c2b7d33",
    "title": "Electrificador 220V 40km Mandinga C120.",
    "laboratory": "Mandinga",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga C120 - Desde pequeñas superficies hasta 600 has electrificadas en forma segura. Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_d36b7d596cd64b83867cf19478f1af58~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "72355dd9-bf71-db36-d4e1-c9c65f861051",
    "title": "Electrificador a Batería 12V 200km Mandinga B1200.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga B1200 - Desde pequeñas superficies hasta más de 1000 has electrificadas en forma segura. Funciona a 12-36 V. - No incluye batería.",
    "image": "https://static.wixstatic.com/media/06b954_b782ba68c81c4e51ba8df426273c5a47~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "60540f2d-c7d9-fa1f-8b3f-4d93ae5187ad",
    "title": "Selcozinc Biotay 500ml.",
    "laboratory": "Biotay",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Complejo vitamínico mineral inyectable - Para prevenir carencias de Selenio, Cobre y Zinc - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_74c3d77096344299b4d76869cd4764f1~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada ml contiene: 2,5 mg de Selenio",
    "externalLink": "http://biotay.com/productos/selcozinc/",
    "price": 0
  },
  {
    "id": "81005d5b-3def-2613-ac1d-2c4a189c01a7",
    "title": "Overtak Full Over 5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo Pour-on - Antiparasitario interno y externo pour on para uso en bovinos - Inhibidor del desarrollo de las garrapatas de los bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_4233d39c3ac6494eb493f5179665eb77~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Fluazurón 2,5 g",
    "externalLink": "http://www.over.com.ar/product/overtak-full/",
    "price": 0
  },
  {
    "id": "8d3b73a5-aaa1-5c99-ce77-a4cb5b1d5d40",
    "title": "Revervac Hemoglobinuria Biogenesis Bago 80 dosis 240ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna para la prevención de la Hemoglobinuria Bacilar en bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_4cf677e5f3b4479ca128cd7af3713e29~mv2.png",
    "volumeWeight": "80 dosis 240ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id5/",
    "price": 0
  },
  {
    "id": "373800c2-a44e-2cc1-68b4-73e38d87273f",
    "title": "Povizur 10 Weizur 1Lt.",
    "laboratory": "Weizur",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiséptico y desinfectante - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_89fe0e0d796b46938b481cf5be9b9447~mv2.png",
    "volumeWeight": "1Lt.",
    "dose": "",
    "drugs": "Iodopovidona 10%",
    "externalLink": "https://www.weizur.com/producto.php?p=21",
    "price": 0
  },
  {
    "id": "6c7026de-e67c-1d40-61da-28a5df21485b",
    "title": "Yoduro de Sodio al 60% Von Franken 50ml.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Solución quimioterápica inyectable a base de Yoduro de sodio - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a271982b51f74213b7712cd8f277cbeb~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Grandes-Animales_Especificos/Yoduro-De-Sodio-Al-60",
    "price": 0
  },
  {
    "id": "1e9c6b44-8ed0-126d-b186-5e38df3d8af8",
    "title": "Dovenix Supra Boehringer x 500ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Dovenix contiene nitroxinil, que es un antiparasitario del grupo de los fenoles sustituidos que actúa interfiriendo el metabolismo energético del parásito, produciéndose así su muerte - Actúa a nivel de la fosforilación oxidativa - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bb50e0faae194e58a230dbc2c4f9c2cf~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Nitroxilin al 34% en solución acuosa",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5fb86eb8-e9e3-d1cc-e387-38a596bac722",
    "title": "Intrasil Sellador Boehringer 20 Jeringas.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Sello interno - Pasta de aplicación intramamaria, destinada a vacas en secado - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7c6325461d5e475ab168e22af3ab203c~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Bismuto, subnitrato60 g",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f6cd8692-4d5e-33b7-8589-43cbd617b3e2",
    "title": "Suanovil MSD 100ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Es la asociación de 2 antibióticos complementarios y sinérgicos, la espiramicina y la estreptomicina, listo para preparar una solución inyectable en proporciones que le permiten alcanzar, a las dosis indicadas, altos niveles terapéuticos de ambos antibióticos - Actividad antibiótica: La espiramicina posee efectiva actividad bactericida y bacteriostática sobre gérmenes Gram positivos, Estreptococos",
    "image": "https://static.wixstatic.com/media/06b954_346e97a6d34541829b51235d141346d2~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.msd-salud-animal.com.ar/products/112_141383/productdetails_112_141635.aspx",
    "price": 0
  },
  {
    "id": "43acdaf8-a382-9d2c-f89a-4609e1c62685",
    "title": "Dexametasona L.A. Over 12 frascos x 10ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Corticosteroide, antialérgico, antiflogístico - Larga acción - Para bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bf006a326a284d3e8d19e4b279169ddd~mv2.png",
    "volumeWeight": "10ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Acetato de Dexametasona 0,80 g",
    "externalLink": "http://www.over.com.ar/product/dexametasona-la/",
    "price": 0
  },
  {
    "id": "7ea7d9bf-5514-9fdc-1665-db4d454d2b95",
    "title": "Triclabendazol Over 2,5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno indicado para controlar infestaciones de Fasciola hepática y Fasciola gigántica adultas e inmaduras. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e32fafacfb4444678a90a837c6b0ca26~mv2.png",
    "volumeWeight": "2,5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Triclabendazol 10 g",
    "externalLink": "http://www.over.com.ar/product/triclabendazol-10/",
    "price": 0
  },
  {
    "id": "6659895b-9c10-18ab-07bb-fa6997b21cf3",
    "title": "Curapezuñas Concentrado Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiséptico y desinfectante podal - Formulación líquida destinada al tratamiento de la necrobacilosis del pie (pietín), con acción detergente, bactericida y cicatrizante - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_48ee4ee72a9645329c7cd626abd0c9dc~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Formol al 40º/o 50 g",
    "externalLink": "http://www.over.com.ar/product/curapezunas-concentrado/",
    "price": 0
  },
  {
    "id": "47f07837-fb40-2828-2ef4-f94d55073acf",
    "title": "Sales Rehidratantes FS 200 45 sobres de 35g c/u.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "FS200 viene a complementar la estrategia FS para el control de la diarrea - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ebf7a15963904054b7eeb88f248eb228~mv2.png",
    "volumeWeight": "35g c/u.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.lineafs.com/index.php?option=com_content&amp;view=article&amp;id=46&amp;Itemid=55",
    "price": 0
  },
  {
    "id": "248e3e3e-e66b-fd63-4346-bd61f18463f8",
    "title": "Florfenicol Dairyfarma 100ml.",
    "laboratory": "Dairyfarma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Potente antibiotico de larga acción. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_68be8cc70229470198a43f6a933e6c66~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f59fbbaf-76f6-40b0-1c94-72b662e544f6",
    "title": "Dicloxifen Q Ario Q 250ml.",
    "laboratory": "Ario Q",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Es la combinación de un antibiótico de amplio espectro con un Antiinflamtorio, analgésico y antipirético. Está indicado contra un amplio rango de enfermedades que afectan a Bovinos, ovinos y Porcinos, causadas por microorganismos sensibles a la Oxitetraciclina. - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_830bf52c44aa48a5b41ec644d40fc470~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Oxitetraciclina clorhidrato 5,0 g",
    "externalLink": "http://www.arioq.com.ar/pro_dicloxifen.html",
    "price": 0
  },
  {
    "id": "5d85d6ee-956c-a9af-1c7c-911a9a809692",
    "title": "Curamic Ag Plata Microsules 440ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Prevención y control de miasis - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_f48a44b75f6848fb900399976a41936d~mv2.png",
    "volumeWeight": "440ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: DDVP (vapona) 1,60 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/curamic-ag/",
    "price": 0
  },
  {
    "id": "1229e649-38ad-0f02-05b6-ff07a947d01c",
    "title": "Overpen Compuesto LPU Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico de amplio espectro con el agregado de meloxicam como agente antiinflamatorio - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_30bb0ebc7bb041fdb0242e493480d34c~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Penicilina G procaínica 10",
    "externalLink": "http://www.over.com.ar/product/overpen-compuesto-lpu/",
    "price": 0
  },
  {
    "id": "640b67f3-9fce-5c2e-c958-3cb512d1fa69",
    "title": "Neosulf C Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico bactericida y antidiarreico - Antibiótico de amplio espectro - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f26e4292ea274d50981164293af87e59~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada comprimido contiene: Sulfametoxazol 0,40 g",
    "externalLink": "http://www.over.com.ar/product/neosulf-c/",
    "price": 0
  },
  {
    "id": "da3c31f9-44b7-ffff-74e7-14859573ff7f",
    "title": "OverSeal Over 24 Jeringas.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Sellador interno de pezones. - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e21b10dd118e40708a6858cdda4cf138~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Cada jeringa de 4 g contiene: Bismuto subnitrato 2,6 g",
    "externalLink": "http://www.over.com.ar/product/overseal/",
    "price": 0
  },
  {
    "id": "002bb516-02f0-b408-eeba-a41faa42627a",
    "title": "Levac Biotay 1Lt.",
    "laboratory": "Biotay",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suspensión de propionato de calcio de administración oral - Para prevención y tratamiento de la Hipocalcemia - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1323a4b404d14260b31891aa58a6d616~mv2.png",
    "volumeWeight": "1Lt.",
    "dose": "",
    "drugs": "Propionato de calcio al 42% Animales: Bovinos",
    "externalLink": "http://biotay.com/productos/levac/",
    "price": 0
  },
  {
    "id": "4219ecce-ab7f-53a2-36f1-f1fb43dffb69",
    "title": "Venda Vetrap.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Venda Vetrap",
    "image": "https://static.wixstatic.com/media/06b954_48361d7006bc412bbb850708b83e4e75~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "6b145553-e29e-23e3-ae02-189dd7a0f055",
    "title": "Bicholuz Rio de Janeiro 1Lt.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Curabicheras de uso tópico para el tratamiento y control de Miasis - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_0388f5566b0d45f1b0bf4d7a8e5b0052~mv2.png",
    "volumeWeight": "1Lt.",
    "dose": "",
    "drugs": "Acido Tánico 2g",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7152ffc4-784e-959e-3bd0-f804a839b2e2",
    "title": "Energizador de Alambrados Solar Plyrap 85km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Consumo 200-230 mA - Incluye bateria.",
    "image": "https://static.wixstatic.com/media/06b954_4f50e4c2cbfa450b89a3de049ee840dc~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "71962614-5308-957e-3504-d9c9c3d29b35",
    "title": "Energizador de Alambrados Solar Plyrap 75km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Consumo 160-220 mA - Incluye bateria.",
    "image": "https://static.wixstatic.com/media/06b954_4f50e4c2cbfa450b89a3de049ee840dc~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "106e2a85-f65f-c22f-b4f8-e580309877a6",
    "title": "Energizador de Alambrados Solar Plyrap 60km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Consumo 120-160 mA - Incluye bateria.",
    "image": "https://static.wixstatic.com/media/06b954_4f50e4c2cbfa450b89a3de049ee840dc~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f3d55e2b-05cd-6273-1f4c-2676bcc58e51",
    "title": "Energizador de Alambrados Solar Plyrap 45km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Consumo 80-130 mA - Incluye bateria.",
    "image": "https://static.wixstatic.com/media/06b954_4f50e4c2cbfa450b89a3de049ee840dc~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "6270caff-ed7c-069b-33c7-11fcde667c82",
    "title": "Energizador de Alambrados Solar Plyrap 35km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Consumo 70-100 mA - Incluye bateria.",
    "image": "https://static.wixstatic.com/media/06b954_4f50e4c2cbfa450b89a3de049ee840dc~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "52cea640-3eb2-1d85-2de7-837c8515bee7",
    "title": "Energizador de Alambrados Solar Plyrap 20km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Consumo 50-70 mA - Incluye bateria.",
    "image": "https://static.wixstatic.com/media/06b954_4f50e4c2cbfa450b89a3de049ee840dc~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d115078a-0261-b374-1d1c-551a5675cec5",
    "title": "Energizador de Alambrados Solar Plyrap 7km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Consumo 30mA - Incluye bateria.",
    "image": "https://static.wixstatic.com/media/06b954_4f50e4c2cbfa450b89a3de049ee840dc~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "10c62926-dd52-5fd8-e487-cfbb06f19df0",
    "title": "Energizador de Alambrados Dual Plyrap 120km 12/220 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 5.0km - Funciona a 12 y 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "97d65981-2720-3c64-cdde-2a2886e4f977",
    "title": "Energizador de Alambrados Dual Plyrap 70km 12/220 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 2.5km - Funciona a 12 y 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "bbeb7df1-6121-aecf-8cb8-5113beb1e93f",
    "title": "Energizador de Alambrados Dual Plyrap 40km 12/220 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 1.2km - Funciona a 12 y 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "bc91354e-7b9d-b124-96e1-696e81f34d9e",
    "title": "Energizador de Alambrados Plyrap 400km 220 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta +7 km - Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1307a747-b644-8c5b-b6a6-f51923777942",
    "title": "Energizador de Alambrados Plyrap 200km 220 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 7 km - Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "aec8f22a-5c08-bcfa-2a19-6e89e3328713",
    "title": "Energizador de Alambrados Plyrap 120km 220 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 5 km - Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "02bd46e9-f222-244f-69a3-b8e536576002",
    "title": "Energizador de Alambrados Plyrap 120km 12 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 5 km - Funciona a 12 V.",
    "image": "https://static.wixstatic.com/media/06b954_cea5c70963244b1790ed5b0a0bea8ad4~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d793c193-78ad-6033-e5e7-7e65f52a2209",
    "title": "Energizador de Alambrados Plyrap 70km 12 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 2.5 km - Funciona a 12 V.",
    "image": "https://static.wixstatic.com/media/06b954_cea5c70963244b1790ed5b0a0bea8ad4~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "59f19d42-5ac0-a22b-de62-35270eb4924a",
    "title": "Energizador de Alambrados Plyrap 70km 220 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 2.5 km - Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "53ef6d06-e252-13be-4a28-b244e068d4eb",
    "title": "Energizador de Alambrados Plyrap 40km 220V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 1.2km - Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "25dfb6e5-ae44-a291-dcae-befceb58ece3",
    "title": "Energizador de Alambrados Plyrap 40km 220 V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 1.2km - Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_00f31b016901463cbcb8414f6dffcf07~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7027700b-787c-33a1-4429-99be617564b2",
    "title": "Alambre Galvanizado 16/14 Mediana Resistencia 1km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Alambre Galvanizado.",
    "image": "https://static.wixstatic.com/media/06b954_571c4e8bf9574dcd87ff927311c4bfe3~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "9da8bb61-52a8-3408-b497-a89a482333f3",
    "title": "Ocramicin L.A. Biotay 250ml.",
    "laboratory": "Biotay",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable para el tratamiento de enfermedades causadas por agentes suceptibles - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_fb35458b474f4ce1b0c9c3d8e2cc7add~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Oxitetraciclina L",
    "externalLink": "http://biotay.com/productos/ocramicin-la/",
    "price": 0
  },
  {
    "id": "ae943496-48bc-252f-d047-2c561d78928a",
    "title": "Unimag Richmond 530ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Sales de magnesio y calcio - Unimag provee cuatro compuestos de magnesio orgánico de alta biodisponibilidad, en combinación con una sal orgánica de calcio - El Magnesio en el organismo animal no posee ningún órgano de reserva o depósito específico - Este nutriente se encuentra en todas las células activando un extenso sistema enzimático preciso e imprescindible para la vida, mantenimiento y produc",
    "image": "https://static.wixstatic.com/media/06b954_ff4014e4eadb4518b5a87c4a73887199~mv2.png",
    "volumeWeight": "530ml.",
    "dose": "",
    "drugs": "Magnesio, lactobionato: 10,76 g",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=4",
    "price": 0
  },
  {
    "id": "ccce5780-76d3-5ab2-5fb8-65ff6ef40ad9",
    "title": "Bebedero galvanizado de 5 x 0,8 mt para hacienda.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Estos bebederos son aptos para cualquier tipo de animal. Su poco peso y su construcción simple, los hace fáciles de manipular. Las bateas son de chapa galvanizada con marcos de hierro ángulo que aumentan su resistencia.",
    "image": "https://static.wixstatic.com/media/06b954_9490a4d4b26940619625e7248ba42e9d~mv2.png;06b954_f05d88ef578a494d905986ccebe1bd94~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7acbe201-d40c-ffb7-5846-1adcb6857d81",
    "title": "Bebedero galvanizado de 5 x 0,65 mt para hacienda.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Estos bebederos son aptos para cualquier tipo de animal. Su poco peso y su construcción simple, los hace fáciles de manipular. Las bateas son de chapa galvanizada con marcos de hierro ángulo que aumentan su resistencia.",
    "image": "https://static.wixstatic.com/media/06b954_7303fcef7f3445f5a8c70b523a6e77f6~mv2.png;06b954_f05d88ef578a494d905986ccebe1bd94~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "891c2ef4-4337-d1f3-1db4-1f51f209b468",
    "title": "Chapa acanaladas N°18 para Tanque Australiano de 1,10 x 3,05 mt.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Los tanques australianos son construidos con chapas galvanizadas de 1,10m x 3,05m en calibre N° 18.",
    "image": "https://static.wixstatic.com/media/06b954_661d5672f5bc401584f9e48eb0bc813e~mv2.png;06b954_4deb3a59b03d4c159e55284c2459487a~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "452b5e46-5b2a-0f21-1f36-aec4cbad754c",
    "title": "Torre para Molino Huracan 27 pies para rueda de 6 y 8 pies.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Torre para molino de 27 pies para rueda de 6 y 8 pies - En los molinos a viento Huracan no hay partes ni mecanismos complejos - La totalidad de sus piezas están diseñadas para proporcionar una construcción sólida y a la vez sencilla, asegurando un rendimiento insuperable y prolongada vida útil bajo condiciones climáticas extremas.",
    "image": "https://static.wixstatic.com/media/06b954_b285ba4983a2472fa0b05f216bd4bc54~mv2.png;06b954_b87c40a74b114c84be9714b085468bd2~mv2.png;06b954_555c6021e714423285f71a3f4e3752c5~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "77725677-6233-7543-5da3-e35ca7e3d5da",
    "title": "Torre para Molino Huracan 27 pies para rueda de 10 pies.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Torre para molino de 27 pies para rueda de 10 pies - En los molinos a viento Huracan no hay partes ni mecanismos complejos - La totalidad de sus piezas están diseñadas para proporcionar una construcción sólida y a la vez sencilla, asegurando un rendimiento insuperable y prolongada vida útil bajo condiciones climáticas extremas.",
    "image": "https://static.wixstatic.com/media/06b954_3fb82b474e46403ebc42a7ebd9aca6b4~mv2.png;06b954_4f5179b2e3d04fdd8601cb4395ff6d30~mv2.png;06b954_555c6021e714423285f71a3f4e3752c5~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1ab759fb-a7aa-3b50-2cda-dab43b02d05e",
    "title": "Torre para Molino Huracan 21 pies para rueda de 10 pies.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Torre para molino de 21 pies para rueda de 10 pies - En los molinos a viento Huracan no hay partes ni mecanismos complejos - La totalidad de sus piezas están diseñadas para proporcionar una construcción sólida y a la vez sencilla, asegurando un rendimiento insuperable y prolongada vida útil bajo condiciones climáticas extremas.",
    "image": "https://static.wixstatic.com/media/06b954_f0e54d42118b4c79a900ba054a556321~mv2.png;06b954_b32e620e7a1a46929ce1a5acfcd13755~mv2.png;06b954_555c6021e714423285f71a3f4e3752c5~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "34496c10-fcbd-3369-cf16-fad98415a617",
    "title": "Torre para Molino Huracan 21 pies para rueda de 6 y 8 pies.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Torre para molino de 21 pies para rueda de 6 y 8 pies - En los molinos a viento Huracan no hay partes ni mecanismos complejos - La totalidad de sus piezas están diseñadas para proporcionar una construcción sólida y a la vez sencilla, asegurando un rendimiento insuperable y prolongada vida útil bajo condiciones climáticas extremas.",
    "image": "https://static.wixstatic.com/media/06b954_999a1eef9cc34629aa4bbc1c6138cb7c~mv2.png;06b954_a814c9e18a8f427ca90209c441fa391a~mv2.png;06b954_555c6021e714423285f71a3f4e3752c5~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d2b65f53-1ee4-e035-5242-822f9fd4fa90",
    "title": "Maquina para Molino Huracan 10 pies.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "En los molinos a viento Huracan no hay partes ni mecanismos complejos - La totalidad de sus piezas están diseñadas para proporcionar una construcción sólida y a la vez sencilla, asegurando un rendimiento insuperable y prolongada vida útil bajo condiciones climáticas extremas.",
    "image": "https://static.wixstatic.com/media/06b954_28516eca5a834387982d04c8f8946dbc~mv2.png;06b954_85c17a3f499641169b485cf1ca357d64~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "84c2d6d1-c117-f433-6339-4f6b983dacad",
    "title": "Maquina para Molino Huracan 8 pies.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "En los molinos a viento Huracan no hay partes ni mecanismos complejos - La totalidad de sus piezas están diseñadas para proporcionar una construcción sólida y a la vez sencilla, asegurando un rendimiento insuperable y prolongada vida útil bajo condiciones climáticas extremas.",
    "image": "https://static.wixstatic.com/media/06b954_fedc4bad74c84d979b4699d1212822c2~mv2.png;06b954_a536f559382c40f4a66a3855cd59a066~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "11879959-5b04-345a-ff8c-4b906fad8b33",
    "title": "Maquina para Molino Huracan 6 pies.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "En los molinos a viento Huracan no hay partes ni mecanismos complejos - La totalidad de sus piezas están diseñadas para proporcionar una construcción sólida y a la vez sencilla, asegurando un rendimiento insuperable y prolongada vida útil bajo condiciones climáticas extremas.",
    "image": "https://static.wixstatic.com/media/06b954_3f3ec96084e74b00928d19e1982ec9e4~mv2.png;06b954_c7322265683f41e8bf18d801ca1f059c~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "faa6043f-b12a-7003-ab59-6ac2e4276ae9",
    "title": "Cable Subterraneo x 50 mt.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Cable Subterraneo por 50 metros.",
    "image": "https://static.wixstatic.com/media/06b954_4cde473b1c334d05b2253d8380075289~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "15f0b41c-245c-d1dc-a29f-3b9a7506e58f",
    "title": "Estrumate MSD 100ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Prostaglandina sintética - Sincronización de celos, endometritis crónica purulenta, interrupción de preñez ( aborto o parto) - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7f332966c0b54c66b803b214b0d94bcf~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.msd-salud-animal.cl/products/estrumate/020_detalle_de_producto.aspx",
    "price": 0
  },
  {
    "id": "1224920b-0a6d-5ebd-caa5-b6ce5ec4472f",
    "title": "Neocuprexan Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento mineralizante destinado al tratamiento preventivo de las deficiencias de cobre, zinc, selenio, iodo y manganeso en bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_fb4c01bd2a1a4f7195192d4be6783d70~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cobre metálico (como edetato) 1,5 g",
    "externalLink": "http://www.over.com.ar/product/neocuprexan/",
    "price": 0
  },
  {
    "id": "b9d635b3-a4ed-977a-68b5-f5e673cb214f",
    "title": "Bloker Ultra 80% Biotay 20l.",
    "laboratory": "Biotay",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Carminativo, en base a Tensioactivos no Iónicos, para dosificar en bebederos o aspersión de pasturas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c636949355364177b62b24d6b3aeae1d~mv2.png",
    "volumeWeight": "20l.",
    "dose": "",
    "drugs": "Alcoholes etoxilados",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "52918e44-a245-8a3e-edbc-d190ef8eca96",
    "title": "Carminativo NF Max Brouwer 20l.",
    "laboratory": "Brouwer",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico y antidiarreico - Carminativo - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e28768c131d441eebd4d9e1f50994759~mv2.png",
    "volumeWeight": "20l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Macrogol lauril éter 32 g",
    "externalLink": "http://brouwer.com.ar/productos/carminativo-nf-max/",
    "price": 0
  },
  {
    "id": "69ff8349-f2c4-6736-2f33-b858a894e5ea",
    "title": "Marcador Allflex",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Los marcadores Allflex aseguran un marcaje de máxima perdurabilidad en la caravana - Permiten un secado inmediato de la tinta y soportan condiciones climáticas adversas.",
    "image": "https://static.wixstatic.com/media/06b954_36a8bce5afcb44f798e36ac4104252bf~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 18375
  },
  {
    "id": "495191e5-8a2e-c441-ef01-2cd560ab0d24",
    "title": "Pour Metrin Von Franken 5l.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo Pour-on - Piojicida, acaricida, eficaz contrala mosca de los cuernos (Haematobia irritans). - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_4f30356c93744c7bb0e158535d5e1973~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cipermetrina 5,00 g",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Grandes-Animales_Antiparasitarios-Externos/Pour-Metrin",
    "price": 76670.5
  },
  {
    "id": "51eb9799-db34-4ba6-6858-b7d211fb9f61",
    "title": "Albendazol Vetanco 5l.",
    "laboratory": "Vetanco",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno - Para el tratamiento de Nematodes gastrointestinales y pulmonares, Anoplocefalídeos y Trematodes. - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e7eddc91e93e46a7af110e3a5437fdcf~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Albendazol 10% Indicaciones: Utilizado en bovinos y ovinos para Nematodes gastrointestinales y pulmonares, Anoplocefalíd",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f11b60f0-a2cb-f6f3-26a6-28f438478b8a",
    "title": "Triplemic Microsules 3l.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "ovino"
    ],
    "description": "Endectocida - Antiparasitario interno de amplio espectro, Nematodicida de amplio espectro y fasciolicida con acción sobre jovenes y adultos - Para: Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_0ead2bab1f0349b395a0dc816c819d37~mv2.png",
    "volumeWeight": "3l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Levamisol clorhidrato 8,0 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/triplemic/",
    "price": 0
  },
  {
    "id": "6c2226e4-86ee-3120-0441-b0c5e843c352",
    "title": "Cumevern Agropharma 1 Dosis.",
    "laboratory": "Agropharma",
    "animalBreeds": [
      "equino"
    ],
    "description": "Antiparasitario interno de amplio espectro - Antiparasitario interno de amplio espectro - Para Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_18e166b8093d45c6b173e4a5b115a270~mv2.png",
    "volumeWeight": "1 Dosis.",
    "dose": "",
    "drugs": "Cada 100 gramos contiene: Mebendazol 14g",
    "externalLink": "http://richmondvet.com.ar/?seccion=productos&amp;sub=4&amp;cat=17",
    "price": 0
  },
  {
    "id": "3104acad-f950-0cb2-3142-961332c7b875",
    "title": "Parasinort D Nort 22gr.",
    "laboratory": "Nort",
    "animalBreeds": [
      "equino"
    ],
    "description": "Antiparasitario Interno - En todas las paracitosis gastrointestinales, tanto en sus formas adultas así también en larvas y huevo - El agregado de metionina protege la célula hepática evitando lesiones de origen medicamentoso - Para: Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_27ab2adfbeff44a79d3405aab85cc672~mv2.png",
    "volumeWeight": "22gr.",
    "dose": "",
    "drugs": "Metionina-Oxibendazol-Tricolorfon Oxibendazol 22,7 grs",
    "externalLink": "http://laboratoriosnort.com/index.php?sec=3&amp;cod=6",
    "price": 0
  },
  {
    "id": "9c43f82e-175f-b383-9df0-d71d46a4abbe",
    "title": "Piedra Hexaplus Hipermagnesiado Hexagono 20kg.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Los principales factores que intervinientes o desencadenantes de la hipomagnesemia son: aumento brusco de la la temperatura (rebrotes de otoño) genera desbalances de minerales dentro de la plantalos días nublados reducen el foto periodohaciendo menos digestibles los forrajessuelos mal drenados con baja absorción decationes por la la planta. Forrajes con bajo contenido de emergía y altocontenido de",
    "image": "https://static.wixstatic.com/media/06b954_e8fc7a56ae694c4fa648762aa5838133~mv2.png",
    "volumeWeight": "20kg.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.hexagono.com.ar/nuevo_site/hexaplus_hipermagnesiado.html",
    "price": 52412.65
  },
  {
    "id": "34cc38e9-ccef-b455-4317-8627b5f623cb",
    "title": "Kit Adaptador Vit y Min Biogenesis Bago 500ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Adaptador Min: Suplemento mineral inyectable - Adaptador Vit: Suplemento Vitamínico inyectable - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_46e1f599b2ac4fc6926c13cb4a76f6ed~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id91/",
    "price": 0
  },
  {
    "id": "99d63b7e-3a3c-66a3-dfcd-bcbe496148a5",
    "title": "Treo Zoetis 500ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida inyectable de amplio espectro y larga persistencia - Para: Bovinos y Ovinos .",
    "image": "https://static.wixstatic.com/media/06b954_000be4313fb54a5b820b09591e51365b~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml de solución contiene: Doramectina: 3,5g",
    "externalLink": "",
    "price": 164915
  },
  {
    "id": "5be0b91d-3ec6-98ae-71a9-6d4737c4b45d",
    "title": "Aut Pietin Rio de Janeiro 500ml.",
    "laboratory": "Rio de Janeiro",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Es una preparación farmacológica ideal, para utilizar en problemas de pie - Asocia en su formula, el ácido Hidroclórico y el Azul de Metileno, para lograr un efecto local potenciado - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_0f0f3d8697764088802c5a87f20113a8~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Acido hidroclórico 83 ml",
    "externalLink": "http://www.allignanihnos.com.ar/#/landing/detalleProducto/20",
    "price": 0
  },
  {
    "id": "8eb7adbd-6f85-c4b7-0db3-8921ad566f4a",
    "title": "Kit Emefur Boehringer 100 dispositivos.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Regulación del ciclo estral en vacas y vaquillonas - Programas de inseminación artificial a tiempo fijo (IATF) o con detección de celo programado - Transferencia embrionaria - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_3362794298f940cbacbc050c42dcb817~mv2.png",
    "volumeWeight": "100 dispositivos.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "ba508a9c-fbb4-fef9-5341-b4393f2004fe",
    "title": "Hilo para Arrolladora Pick Up 3000mts.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Hilo para Arrolladora",
    "image": "https://static.wixstatic.com/media/06b954_b2c82e6e957547cfb7039b72d9247e0f~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b34098b2-c7bd-2a22-2b0a-de409430671d",
    "title": "Mamyzin M Boehringer Ingelheim 20 inyectores de 5 ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Inyector intramamario - Antibiótico de amplio espectro para el tratamiento de mastitis durante el periodo de ordeña - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_528440c5a8f64d03baafcadefcac8d03~mv2.png",
    "volumeWeight": "5 ml.",
    "dose": "",
    "drugs": "Cada 5 ml contienen: Yodohidrato de penetamato 150 mg",
    "externalLink": "https://www.boehringer-ingelheim.mx/salud-animal/bovinos/mamyzin-m",
    "price": 0
  },
  {
    "id": "cc58db46-7cdf-a00a-2dd2-308feb3c1d1d",
    "title": "Overseg Plus OXI Over 25ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Formulación destinada al control simultáneo de anaplasmosis y piroplasmosis, contiene diminacene diaceturato, que al no eliminar el 100% de las babesias genera un estado de inmunidad que es más eficiente que la eliminación total - La oxitetraciclina es el antibiótico de elección contra anaplasmosis - La dipirona detiene la fiebre, evita la depresión, estimulando el apetito y la pronta recuperación",
    "image": "https://static.wixstatic.com/media/06b954_833c360a6f8a45ae9e42ca29089f18e2~mv2.png",
    "volumeWeight": "25ml.",
    "dose": "",
    "drugs": "Cada frasco con polvo contiene: Diminacene diaceturato 1,00 g",
    "externalLink": "http://www.over.com.ar/product/overseg-plus-oxi/",
    "price": 0
  },
  {
    "id": "02bf27eb-794d-c641-ea9b-3e219d34f38c",
    "title": "Gemicin 100 Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico de amplio espectro (Gentamicina al 10%) destinado al tratamiento y control de enfermedades específicas e inespecíficas - Solución lista para usar - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_804d952a35fa4761a10a7e3ccb936128~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml de producto contiene: Gentamicina: 10 g",
    "externalLink": "http://www.over.com.ar/product/gemicin-100/",
    "price": 0
  },
  {
    "id": "0822d3a6-6a0c-fd13-f98e-b5f47943ea8d",
    "title": "Imidover (Imidocarb 12%) Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Hemoparasiticida destinado al tratamiento y control de babesiosis y anaplasmosis - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_153d199f41ff4191a7fdb0436e38a133~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Dipropionato de imidocarb 12 g",
    "externalLink": "http://www.over.com.ar/product/imidover-imidocarb-12/",
    "price": 0
  },
  {
    "id": "95a82dce-4331-e40b-2914-9421383a2cb0",
    "title": "Zactran Boehringer 100ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable - Tratamiento terapéutico y preventivo de la enfermedadrespiratoria bovina (ERB) asociada a Mannheimia haemolytica, Pasteurella multocida e Histophilus somni - Antes del tratamiento preventivo, deberá establecerse lapresencia de la enfermedad en el rodeo - Para bovinos - Una única inyección subcutánea.",
    "image": "https://static.wixstatic.com/media/06b954_ba9af3e434db46e3816e67c97acfb512~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada ml",
    "externalLink": "http://www.sani.com.ar/producto.php?id_producto=6625",
    "price": 0
  },
  {
    "id": "47fe1f00-5035-4812-ec82-6342ee0abafe",
    "title": "AZ5 Von Franken 500ml.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Prevención y tratamiento de hipocalcemias, hipomagnesemias, hipofosfatemias, afosforosis, hipocuprosis y raquitismo - Mejoramiento de la fertilidad y actividad sexual de los machos, regularización de los celos, prevención de abortos - Aumento de la producción láctea, activación del crecimiento y desarrollo - Recuperación de animales convalescientes y desnutridos - Elevación de las defensas natural",
    "image": "https://static.wixstatic.com/media/06b954_34c7699b90e14b83a22486f530f1beec~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Magnesio hipofosfito hexahidrato 10 g",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Grandes-Animales_Mineralizantes/A-Z-5",
    "price": 30507.35
  },
  {
    "id": "8d654b1a-f994-6a0d-9bd9-f3a7a428c643",
    "title": "Micotil 300 Elanco 10ml.",
    "laboratory": "Elanco",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico Inyectable - Solución Inyectable exclusivamente subcutánea en bovinos - Tratamiento sintomático y específico de afeciones broncopulmonares agudas causadas por agentes sensibles a la oxitetraciclina - Tratamiento de la Queratoconjuntivitis infecciosa bovina relacionada con sepas suceptibles de moraxella bovis - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c1a3d051c16d44f4a1d800c868a2f21e~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "10ml.",
    "dose": "",
    "drugs": "Cada ml contiene: Fosfato de tilmicosina 300 mg",
    "externalLink": "https://www.viarural.com.ar/viarural.com.ar/insumosagropecuarios/ganaderos/laboratorio-vet/elanco/micotil-300.htm",
    "price": 0
  },
  {
    "id": "475988f7-9182-592f-c796-c6bd03ca26d8",
    "title": "Zactran Boehringer 250ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable - Tratamiento terapéutico y preventivo de la enfermedadrespiratoria bovina (ERB) asociada a Mannheimia haemolytica, Pasteurella multocida e Histophilus somni - Antes del tratamiento preventivo, deberá establecerse lapresencia de la enfermedad en el rodeo - Para bovinos - Una única inyección subcutánea.",
    "image": "https://static.wixstatic.com/media/06b954_ba9af3e434db46e3816e67c97acfb512~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Cada ml",
    "externalLink": "http://www.sani.com.ar/producto.php?id_producto=6625",
    "price": 0
  },
  {
    "id": "fbecd241-b440-da1a-5646-c25451420a36",
    "title": "Azadieno Plus Boehringer 4l.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Ectoparasiticida bovino sin resistencia, prolongado efecto residual, que mantiene el baño aséptico todo el año - Garrapaticida, antisárnico y piojicida - Control de garrapatas resistentes - Garrapaticida sin resistencia, residual - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f4e11dde5e3144459065a622391e80bd~mv2.png",
    "volumeWeight": "4l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "8f0187af-8698-06db-3f15-36bc82e7b509",
    "title": "Fatroximin Secado Fatro Von Franken 12 Jeringas.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Indicado en la prevención y tratamiento de la mastitis clínica y subclínica en el período de secado de la vaca lechera - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6c3498d4a7294d7b930809fdc5485f91~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Rifaximina 0,100 g",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d1549dcb-dc92-854e-4750-af4788b010cb",
    "title": "Vitaminas AD3E Microsules 500ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución oleosa inyectable de vitaminas A, D3 y E - Indicada para el tratamiento de las avitaminosis A, D y E, y como terapia complementaria de:Tratamientos antimicrobianos y antiparasitarios, Convalecencias, Gestación y post-parto, Estrés y Carencias alimentarias de diversas etiologías - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c77c09ceae3b451ebcff01a994db653e~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Vitamina A (Palmitato)50",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/ad3e-microsules/",
    "price": 93166.1
  },
  {
    "id": "f8c354a0-985c-3397-94b3-551315db92f2",
    "title": "Piliguard Moraxella bovis trivalente MSD 50 dosis 100ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna bacterina para la prevención de la queratoconjuntivitis bovina causada por las cepas de moraxella bovis - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6e81bad4c67f4063ba81675aae52ff9c~mv2.png",
    "volumeWeight": "50 dosis 100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.msd-salud-animal.com.ar/products/piliguard-querato-i/productdetails-piliguard-querato-i.aspx",
    "price": 108137.5
  },
  {
    "id": "4ad51616-ac2e-0e2a-ee52-60e1775ff409",
    "title": "Pomada Curabichera Bactrovet Plata Konig 455gr.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antimiásico, repelente, bactericida, antifúngico, cicatrizante, epitelizador y hemostático - Tratamiento de todo tipo de heridas en todas las especies - Tratamiento y prevención de bicheras en intervenciones quirúrgicas como castración, y heridas de cualquier origen - Heridas en general. - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_47e0f884538a43b08dd7a15718d59bc7~mv2.png",
    "volumeWeight": "455gr.",
    "dose": "",
    "drugs": "Cada 100 gramos contiene: Sulfadiazina de Plata, 0,1 gr",
    "externalLink": "http://www.koniglab.com/producto/bactrovet-plata-pasta/",
    "price": 0
  },
  {
    "id": "62a40885-e1c8-8e53-6a34-b3c072468e12",
    "title": "Tetraelmer Elmer 100 capsulas.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Indigestiones, intoxicaciones alimenticias, acetonemia, insuficiencia hepática, inapetencia, meteorismo, coadyuvante en el tratamiento de las parasitosis intestinales - Es activo frente a un gran número de agentes Gram positivos como negativos: Estreptococos, estafilococos, clostridium, bacillus anthracis, diplococos, corynebacterium, actinomyces, actinobacilus, colibacilos, salmonellas, pasteurel",
    "image": "https://static.wixstatic.com/media/06b954_07bfcee78094421ba4aa9d9e4d2bf724~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "http://elmerlab.com/producto/tetraelmer/",
    "price": 0
  },
  {
    "id": "090939dd-bb8b-49cc-55d8-04c12fc5831f",
    "title": "Prosel Richmond 500ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Promotor orgánico de crecimiento, desarrollo y fertilidad - Satisface las necesidades de vitamina E y vitamina A, garantizando un aporte de Selenio inocuo y preciso - Aumenta la formación de espermatozoides (cantidad y viabilidad) - Reduce cuadros de disfunción ovárica nutricional (anestro, ovarios quísticos, cuerpos lúteos persistentes) - Elimina las retenciones de placenta, los abortos, metritis",
    "image": "https://static.wixstatic.com/media/06b954_3090e4a9a0bd44ac9e2bc53ee5a55e1c~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Selenio: 0,32 mg",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=4&amp;id=24&amp;pg=1",
    "price": 19870
  },
  {
    "id": "4402d598-1d23-0e68-f37e-f52e9d1b5467",
    "title": "Iodo Doble Cu-Tral-Co 250ml.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Cáustico - Revulsivo - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c23cd280d8e14dfaa6b9d6b3b6a75707~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Iodo metalico 7 g",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b5a81b60-6104-2b09-5639-ec6d386bf9a7",
    "title": "Gondadiol Benzoato de Estradiol Zoetis 100ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "El uso de Benzoato de Estradiol al momento de la aplicación del progestágeno provoca una nueva onda folicular; la aplicación del Benzoato de Estradiol a la extracción del progestágeno induce un pico preovulatorio de LH a través del feed back positivo del estradiol sobre el GnRH y LH lo que resulta en una alta sincronía de ovulaciones - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_cc380f35a0da4b9a997edd1907d5c44a~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "02506160-60d5-2f30-3612-4355094683b3",
    "title": "Trivalico A.D.E. 5 Rosenbusch 250ml.",
    "laboratory": "Rosenbusch",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento indicado para estados deficitarios vitamínico-minerales, alimentarios o fisiológicos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_cb78d3cdb78e4ac987c2f55a1acaf514~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Vitamina A 5",
    "externalLink": "http://www.rosenbusch.com/argentina/gprodfarm_vitam.html",
    "price": 0
  },
  {
    "id": "c831cd53-9d90-98f1-79e0-6c3183f12504",
    "title": "Nutrekid V.M. 10 Rosenbusch 250ml.",
    "laboratory": "Rosenbusch",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento vitamínico mineral indicado para el tratamiento de deficiencias de oligoelementos y vitaminas A, D y E en terneros - Especialmente indicado para prevenir el stress en el momento del destete - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8b4f422117bc40ca8d44337e4ee82c45~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Vitamina A 2",
    "externalLink": "http://www.rosenbusch.com/argentina/gprodfarm_vitam.html",
    "price": 0
  },
  {
    "id": "7d195da2-a1cd-df48-3020-4a7f9fe96b13",
    "title": "Hepagen Von Franken 100ml.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Indigestiones, intoxicaciones alimenticias, acetonemia, insuficiencia hepática, inapetencia, meteorismo, coadyuvante en el tratamiento de las parasitosis intestinales - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c873c318a32f47329a859e4f9917ba28~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Grandes-Animales_Hepatoprotectores/Hepagen",
    "price": 52466.6
  },
  {
    "id": "75a03ec1-900a-26dc-67ea-418a898b32ea",
    "title": "Lidocaína 2% Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Anestésico local para anestesia de infiltración o bloqueo nervioso; anestesia epidural y anestesia de superficie. - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_fb3e1ff4e09f48838976d6ecc9e82b07~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Lidocaína clorhidrato 2 g",
    "externalLink": "http://www.over.com.ar/en/product/lidocaine-2/",
    "price": 0
  },
  {
    "id": "aa8fc066-9906-6608-ceb0-d1bc7e101e6f",
    "title": "Duva Rehidratante Agropharma 500ml.",
    "laboratory": "Agropharma",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Rehidratante Electrolítico con Aminoácidos - Deshidratación de cualquier etiología (diarrea, vómitos, etc.) - Intoxicaciones - Estados de agotamiento físico - Pérdida de electrolítos - Hemorragias - Stress - Hipoproteinemias - Poliurias - Hepatopatías - Sudoración intensa - Convalescencia - Sobreentrenamiento - Shock quirúrgico o traumático - Inapetencia - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_cad1cc014eb14c25b33c3f4ee1d2fae2~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://agropharma.net/producto/duva-rehidratante/",
    "price": 0
  },
  {
    "id": "f4259e6a-b4b0-dcea-0090-7e41bf0c0843",
    "title": "Sulfaprim Von Franken 100ml.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Infecciones pulmonares y gastroentéricas, flemones, abscesos, Coccidiosis, tratamiento pre y postoperatorio - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1fc32915a1f24ce3a5c9f6765d679187~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Pequenos-Animales_Antibioticos/Sulfaprim",
    "price": 35676.15
  },
  {
    "id": "b9ed0f33-2e06-8889-d6d1-4078172bbd7d",
    "title": "Alliance Respiratoria Boehringer 50 dosis.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Para la prevención de afecciones respiratorias en bovinos, asociadas a virosis por Rinotraqueítis infecciosa bovina HBV 1, Parainfluenza 3 bovina PI3 y bacterias: neumonías causadas por Pasteurella multocida tipo A, o Histophilus somni, y co-infecciones con Arcanobacterium pyogenes- Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1c11cd4e04424137b189925b10edee60~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "49fa30fe-a60d-a7b5-c4f4-9d77e99a064b",
    "title": "Dipirona 50% Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Analgésico - Antipirético - Antiespasmódico - Antiinflamatorio - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1b681e15b79e4ce693b287c07d3250fd~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Dipirona sódica 50 g",
    "externalLink": "http://www.over.com.ar/product/dipirona-50/",
    "price": 0
  },
  {
    "id": "f92d5d04-428d-259e-4de9-9f9d6d39aa37",
    "title": "Microfos Microsules 100ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Microfos contiene fósforo, asociado a cobalto, cobre y manganeso, lo que permite la regulación de trastornos metabólicos agudos y crónicos así como también sobre el comportamiento reproductivo - El fósforo es esencial para la formación de huesos y dientes, y los fosfatos en la formación de proteínas y enzimas tisulares y son de gran importancia en el metabolismo intermedio de los hidratos de carbo",
    "image": "https://static.wixstatic.com/media/06b954_567a16bfdd5a42568133e8adef307b1e~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Glicerofosfato de magnesio 15,0 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/microfos/",
    "price": 0
  },
  {
    "id": "e1a95f09-660b-dad2-bf94-08518ac8f8db",
    "title": "Calciomic Microsules 500ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Calcificante magnesiado con Fósforo, Glucosa, Calcio y Magnesio, con acción estimuladora y reanimante. Hipocalcemia, hipomagnesemia, debilidad, temblores, tetanias, fiebre vitular, eclampsia y acetonemia - Síndrome de vaca caída - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e24eff317091403aae2a41e8457b3640~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Gluconato de calcio monohidrato 40 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/calciomic/",
    "price": 0
  },
  {
    "id": "0d5dc04f-1cff-1506-bf85-5ea0e19bfda5",
    "title": "Vitonal B Richmond 530ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Solución iónica balanceada, específicamente desarrollada para reponer en forma instantánea el desbalance interno producido en el síndrome de vaca caída - A base de sales orgánicas de Calcio, Magnesio, Fósforo, Potasio, Cloro y Sodio combinadas con Tiamina y Cafeína, inyectable - Provee todas las calorías que el animal en la grave situación (desbalance nutricional) requiere, restaurando su metaboli",
    "image": "https://static.wixstatic.com/media/06b954_c5b4109b07fa4df088c35a697dc6ef7f~mv2.png",
    "volumeWeight": "530ml.",
    "dose": "",
    "drugs": "Calcio, borogluconato: 8,26 g",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=4&amp;id=23&amp;pg=1",
    "price": 17372
  },
  {
    "id": "6bc528c7-8490-55c2-ed9f-6d7b894c6c7e",
    "title": "Crema de Ordeño Over 500g.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Crema con propiedades antisépticas, lubricantes, cicatrizantes y anestésicas - Para: Bovinos, Equinos, Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_97858acfbb6d49718db1da19789026b1~mv2.png",
    "volumeWeight": "500g.",
    "dose": "",
    "drugs": "Cada 100 g contiene: Vitamina A palmitato 0,07 g",
    "externalLink": "http://www.over.com.ar/product/crema-de-ordeno-con-anestesico/",
    "price": 0
  },
  {
    "id": "21ca71c6-909e-eb8f-07f7-435bcf0339d2",
    "title": "Tambox Crema de Ordeño Rosenbusch 1kg.",
    "laboratory": "Rosenbusch",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiséptico y cicatrizante de escoriaciones, llagas y heridas de los pezones de vacas en ordeñe - Lubricante de las manos del ordeñador - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_15b6d325f14b4bfd92cedb1964b44485~mv2.png",
    "volumeWeight": "1kg.",
    "dose": "",
    "drugs": "Vitamina A 10",
    "externalLink": "http://www.rosenbusch.com/argentina/gprodfarm.html",
    "price": 0
  },
  {
    "id": "0e801250-8215-2fe8-4328-cfd48d625078",
    "title": "Overxicam Over 50cc.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiinflamatorio no esteroide. Potente acción analgésica y antiinflamatoria - Indicado para fuertes dolores musculares y calambres - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_4348611bba7e4ded923cac2ca673531f~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Meloxicam 2 g",
    "externalLink": "http://www.over.com.ar/product/overxicam/",
    "price": 0
  },
  {
    "id": "aa6ff473-2e0e-33d4-534c-2a9c42db5965",
    "title": "Clamoxyl L.A. Zoetis 100ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable de larga acción, bactericida de amplio espectro y larga acción, efectivo sobre patógenos Gram positivos y Gram negativos - La amoxicilina se absorbe rápidamente alcanzando su pico máximo a los 30 minutos y mantiene niveles terapéuticos en sangre y tejidos durante 48 horas luego de la administración - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f954140d47694dbca6158b6d0ab63075~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Amoxicilina trihidrato: 15,3 g",
    "externalLink": "https://ar.zoetis.com/products/clamoxyl-la.aspx",
    "price": 0
  },
  {
    "id": "5a1a3b86-5dc4-65ac-0dde-dcc74a4af2c4",
    "title": "Aspersin Biogénesis Bagó 250ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo formulado a base de cipermetrina y clorpirifós - Esta combinación potencia mutuamente el efecto de ambos principios activos dado el sinergismo que producen entre sí los piretroides y órganofosforados - Su formulación especial para aspersión facilita un correcto mojado y la adherencia de los principios activos a la piel de los animales - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7d5465892ab042268bffc29e766f890d~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Cipermetrina 20 g",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id64/",
    "price": 0
  },
  {
    "id": "1cd445cf-c69b-ff3f-c928-e2a4b8ffb1b9",
    "title": "Señalador de Oreja Villa Nueva",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Señalador de Oreja. Preguntar por modelos disponibles.",
    "image": "https://static.wixstatic.com/media/06b954_84c055bb9d464959a4ae987886aa2127~mv2.png;06b954_431ba542f8194e5bad09ce9d1ba43279~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 146616.4
  },
  {
    "id": "01182bee-79ce-379d-2281-1bc1799606ce",
    "title": "Triple Mancha, Gangrena y Enterotoxemia Providean Tecnovax 60 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Los agentes clostridiales causantes de Mancha, Gangrena y Enterotoxemia pueden prevenirse en forma económica eligiendo una vacuna con potencia garantizada en cada serie.Las Enfermedades Clostridiales (EC) enferman al ganado en forma repentina, causando muertes, incluso antes de que puedan observarse síntomas. Los animales de todas las categorías son susceptibles en todo momento de su vida. - Para:",
    "image": "https://static.wixstatic.com/media/06b954_524e8a0b2f374bfbaa47cae69109302b~mv2.png",
    "volumeWeight": "60 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-mge/",
    "price": 0
  },
  {
    "id": "6a2b31c9-8fbf-541f-47e2-e4012282b79a",
    "title": "Lepto 8 Tecnovax Providean 50 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Providean Lepto 8, es la vacuna contra la mayor cantidad de serovares de leptospiras disponible en el mercado. Cada lote de producción, es sometido a pruebas de potencia directa, brindando de esta forma una combinación de amplio espectro y alta potencia protectiva en cada lote. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b7373646a59448f5a604b56199a53635~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-lepto-8/",
    "price": 0
  },
  {
    "id": "26463733-ee96-7eea-56b8-e6f4d47da5bf",
    "title": "Prostal Over 20ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Hormonal. Análogo sintético de la prostaglandina F2 alfa - Agente luteolítico - Indicado para la sincronización del celo, desórdenes funcionales del ciclo estral, inducción al parto o al aborto, desórdenes funcionales de los ovarios (quistes luteales o foliculares), patologías uterinas postparto (piómetras, endometritis) - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_8c923388de50467abc6dfac681cf29b3~mv2.png",
    "volumeWeight": "20ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1ade0945-95ea-f74e-dc54-0cb2885cd76f",
    "title": "Kit DIB 0,5 Zoetis Syntex 100 dispositivos.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Dispositivo de silicona inerte impregnado con 0.5 g de progesterona natural de liberación controlada para un solo uso - Sincroniza el celo en vacas y vaquillonas - Tratamiento de anestro pos parto - Posibilita el retorno a servicio - Acortamiento de período parto-concepción - Complemento en tratamiento de superovulación - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6076b4a48f5446b8bac4e08585606b1a~mv2.png",
    "volumeWeight": "100 dispositivos.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "007b7ffb-8e71-e85e-7429-c2688fd187e8",
    "title": "Ovusyn Syntex.",
    "laboratory": "Syntex",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Inductor y sincronizador de la ovulación - Estimula el desarrollo luteal y la secreción de progesterona plasmática; previene la muerte embrionaria - Coadyuvante en el tratamiento de subfertilidad, infertilidad, anestro - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_596d76debda94258882c229cc09788ac~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1354ca3a-4b32-1e7b-2e68-ddc061b21d94",
    "title": "Novormon 5000 Zoetis.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Inducción y sincronización de celos - Inducción de la ovulación y superovulación - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2f412e56cb8f4217b43b501a41d55d01~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "bc31116e-d402-a116-25e9-9ae61191491f",
    "title": "Celo Test Biotay 500ml.",
    "laboratory": "Biotay",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Pintura para marcar la cola de las vacas facilitando la identificación de las que están en celo y se han dejado montar - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7c68e857cf2741c29d4831593cc194df~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 17504.45
  },
  {
    "id": "c509622b-7683-e84e-1216-9a5a380c2660",
    "title": "Alliance Plus Boehringer 50 dosis.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Segura prevención en manejos intensivos contra las Neumonías, Queratoconjuntivitis, Mancha y Enterotoxemia con muerte súbita en los bovinos. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_0826db6571fb48c4909d722c61d66731~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "e7c7a631-b6a9-accb-311a-9445db5d947a",
    "title": "Alliance Reproductiva Boehringer 50 dosis.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Prevención de los problemas reproductivos en bovinos debido a: Rinotraqueítis viral bovina, diarrea viral bovina, leptospirosis, campylobacteriosis e histophilosis - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ac7f057b90cc4ab6a6252242bcf70d95~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "c1484eff-c2dc-55fb-bae1-769fc6025390",
    "title": "Alliance Querato Boehringer 50 dosis.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Para la prevención de infecciones oculares en bovinos, particularmente conjuntivitis y queratitis debido a: Rinotraqueítis Viral Bovina, Moraxella bovis y complicaciones con Arcanobacterium pyogenes. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_d6139ed47d8d427394992c7a562ffe0b~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b6758f45-38e2-fcf2-2d87-5a26b8687622",
    "title": "Querato Providean Tecnovax 50 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "La Queratoconjuntivitis infecciosa (QIB) genera una severa infección en la conjuntiva y cornea. Esta enfermedad causa altos costos de tratamiento y un fuerte debilitamiento general del animal, estimado en 10 kg. de peso vivo por cada ojo afectado. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_970f02acf9f24fc3a3c85ec5b0e479e7~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-querato/",
    "price": 0
  },
  {
    "id": "a1dbf319-84cd-d52d-1356-6f9133fc27d8",
    "title": "Autodosificadora Lider Matic 5 c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Desarrollado tanto para uso inyectable u oral - Resistente a pour on - Su sistema de mangos tipo tijera está diseñado para emplear el mínimo esfuerzo en la expulsión del medicamento (aún los más espesos) permitiendo el pasaje del líquido y logrando rapidez en las recargas - Provisto de una aguja punza matic, permite dosificar de un modo más directo.",
    "image": "https://static.wixstatic.com/media/06b954_ee5c892f49aa4c43b601eef43af778e4~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "df630747-d073-95aa-4488-5fe2d0b1c055",
    "title": "Autodosificadora Lider Matic 10c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Equipo provisto de una aguja punza matic, para poder dosificar de un modo directo desde el medicamento - Permite utilizar el dosificador en distintas posiciones sin alterar las aplicaciones - Su sistema de válvulas superaspirantes permiten el paso abundante y controlado del fluido, brindando velocidad en la recarga.",
    "image": "https://static.wixstatic.com/media/06b954_8dbc0538076c480c83b6bbf74553b7e4~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "c3dadd4e-92fd-953f-1ecd-d07ea7aa2800",
    "title": "Autodosificadora Lider Dosi 50c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Diseñado para la aplicación de antiparasitarios orales de gran capacidad - Su sistema de dosificador seguro, permite graduar el equipo en distintas posiciones y utilizar al máximo su capacidad - Realizado con mangos de aleación de aluminio inyectado con esmaltado inalterable, lo cual ofrece especial resistencia en usos prolongados.",
    "image": "https://static.wixstatic.com/media/06b954_4e82237fd380420fb9945dbcaffa59c7~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "85168f44-6d6c-93ee-c0ef-9185afb2d1ea",
    "title": "Karate Zeon 5 CS Zyngenta 1l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Insecticida piretroide con base en lambda cyalotrina que actúa por contacto e ingestión sobre las plagas.",
    "image": "https://static.wixstatic.com/media/06b954_2bed97b4113b4aaba00e2c762199167f~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "c9697835-84e6-da0b-a3af-6779270ed9f4",
    "title": "Clap Bayer 250ml.",
    "laboratory": "Bayer",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Novedoso insecticida, por su modo de acción y residualidad, logra un excelente control de estas nuevas plagas en Siembra Directa - El ingrediente activo de Clap es Fipronil y está formulado como una suspensión concentrada al 20% - Pertenece a una nueva familia de insecticidas, los Fenilpirazoles, cuyo modo de acción es diferente a los grupos químicos de insecticidas hasta hoy conocidos - Una carac",
    "image": "https://static.wixstatic.com/media/06b954_b3d1b6855e5943f787a6b6cbfb3075ec~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.camponuevosrl.com/product-page/agroforce-20-sc-fipronil-20-huagro-1lt-consultar-precio",
    "price": 0
  },
  {
    "id": "7d119303-820b-23ec-4e2a-3f7a04b6d362",
    "title": "Oxitocina Over 50ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución inyectable de oxitocina sintética, que actúa sobre la musculatura lisa del útero y de la ubre, provocando su contracción - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_43133688b3a048e8b1cdca2d2df5aade~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Oxitocina Sintética 1",
    "externalLink": "http://www.over.com.ar/product/oxitocina/",
    "price": 0
  },
  {
    "id": "e35a7326-e920-5634-c1a8-0806e1f12bc2",
    "title": "Togar BT Dow 1lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "REEMPLAZADO POR EL TOCON EXTRA. Arbusticida específico para combatir malezas semi-leñosas, leñosas y palmas en pasturas naturales e implantadas - Su uso está recomendado específicamente para el control de renovales, fachinales, y malezas leñosas de gran porte - Sus principios activos son Picloram y Triclopyr.",
    "image": "https://static.wixstatic.com/media/06b954_5e7b37be089f440b84f56bfc2c2d4359~mv2.png",
    "volumeWeight": "1lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "14a7f5d0-be38-2a0e-eae0-42789a128012",
    "title": "Tocon Dow 1lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "REEMPLAZADO POR EL TOCON EXTRA. Tocon es un herbicida selectivo, destinado al control de malezas dicotiledóneas de porte herbáceo, arbustivo y sub-arbustivo, en áreas de pasturas, específico para aplicaciones al tocón (inmediatamente después del corte de la planta) - El producto incluye un colorante que permite reconocer los tocones tratados - Su principio activo es Aminopyralid.",
    "image": "https://static.wixstatic.com/media/06b954_17814975ada740f39fb616c1d82075a0~mv2.png",
    "volumeWeight": "1lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.camponuevosrl.com/product-page/tocon-extra-dow-1lt-consultar-precio",
    "price": 0
  },
  {
    "id": "2a537051-920b-8160-5c93-d2cde1084e77",
    "title": "Storm Basf 1kg.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Rodenticida anticoagulante de última generación, de “una sola ingesta”, formulado como lentejones secos - Su elevada palatabilidad, su forma, peso, baja dosis y tamaño brindan versatilidad y permiten adoptar la estrategia correcta para lograr elevados niveles de control en pocos días, de manera segura y económica.",
    "image": "https://static.wixstatic.com/media/06b954_4b23b264d01f417782e0a294762a7ac5~mv2.png",
    "volumeWeight": "1kg.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "870f4ef4-42e5-47d7-b571-c02c3f102b80",
    "title": "Biopoligen Air Biogenesis Bago 80 dosis 240ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna para la prevención de la queratoconjuntivitis infecciosa bovina producida por la acción individual o combinada de Herpesvirus bovino, Moraxella bovis y Branhamella ovis - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8ab5a268f44a40c8b9feceb235fb8fa4~mv2.png",
    "volumeWeight": "80 dosis 240ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id4/",
    "price": 0
  },
  {
    "id": "6c8147bd-6afd-6fc3-295b-5043a951f071",
    "title": "Campylobacter 40 CDV 50 dosis.",
    "laboratory": "CDV",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Preventivo de cuadros reproductivos (infertilidad, aborto y muerte perinatal) producidos por bacterias del género Campylobacter (Vibrio). - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_40116042563d48bdb0f8691196e66f4c~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "25f9d2d2-9e42-c4d6-a54f-8d6c3528ef7b",
    "title": "Tuberculina PPD CDV 10ml.",
    "laboratory": "CDV",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antígeno para el diagnóstico de la tuberculosis en los Programas de Control y Erradicación de la enfermedad en los bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9d761e93fe774a078906a30e11835b63~mv2.png;06b954_97d6ca5daeeb4391b0a3d745b6b9316b~mv2.png",
    "volumeWeight": "10ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5576fcbb-7a3d-d5b5-ddcb-bd2b4b30ebc3",
    "title": "Juego de Peines para peladora Heiniger.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Juego de Peines para peladora Heiniger.",
    "image": "https://static.wixstatic.com/media/06b954_4b17b69004c74e8ea5e5a51313cf238a~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f566c236-6b22-d600-c741-4d158f9c69f5",
    "title": "Peladora Heiniger C12.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Peladora Heiniger C12.",
    "image": "https://static.wixstatic.com/media/06b954_70d3dbad46854b01a0957bb93046d190~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "85d6b57a-2e05-0df9-6489-72528e0a2443",
    "title": "Voltimetro Mandinga.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Voltimetro Mandinga.",
    "image": "https://static.wixstatic.com/media/06b954_719b92300b9e46b88e84bf828abf834e~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "9848c057-f761-5eea-f93c-fadfdd7d7a02",
    "title": "Carretel con Cable Electroplástico Arriero 6 hilos 500mts.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Carretel con Cable Electroplástico 6 hilos 500mts.",
    "image": "https://static.wixstatic.com/media/06b954_73161d2a76e74dbda605c74aa7c22abf~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "aabf1097-389c-13fb-c0b4-5b1172194d64",
    "title": "Cinta Electroplástica Arriero 5 hilos 400mts.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Cable Electroplástico 5 Hilos.",
    "image": "https://static.wixstatic.com/media/06b954_e8b01bae231841d684328f6c6f2936e6~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "53717cfc-1b63-2599-bd4c-f29635a07994",
    "title": "Cable Electroplástico Arriero 6 hilos 500mts.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Cable Electroplástico 6 Hilos.",
    "image": "https://static.wixstatic.com/media/06b954_94d19d96c56541ca9d3d8d9816fbb212~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "9277fe50-e913-6dbd-a300-8246ddcecdfc",
    "title": "Meflosyl Zoetis 50ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Analgésico. Antipirético. Antinflamatorio no esteroide con actividad analgésica no narcótica y antipirética. - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_01d2cabcdc214908ae18e14137fa8a9d~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Flunixin meglumina: 5 g",
    "externalLink": "https://ar.zoetis.com/products/equinos/meflosyl.aspx",
    "price": 0
  },
  {
    "id": "6cdae5d2-beb7-f36f-f067-5130efdad2ec",
    "title": "Ubredem Biogenesis Bago 25ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Asociación diurético-corticoide inyectable a base de Furosemida y Dexametasona - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_f8ad24a1fb724de5bb905d5c4fd96624~mv2.png",
    "volumeWeight": "25ml.",
    "dose": "",
    "drugs": "Furosemida 5 g",
    "externalLink": "https://cc.biogenesisbago.com/ar/2021/ubredem/",
    "price": 0
  },
  {
    "id": "543a849c-65e9-16fc-9784-a771dec6f03a",
    "title": "Synedem Over 12 frascos x 25ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiedematoso, diurético, antiinflamatorio - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_68f20a08ba334fdfbc63000ef8cebb25~mv2.png",
    "volumeWeight": "25ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Fursemida 5 g",
    "externalLink": "http://www.over.com.ar/product/synedem/",
    "price": 0
  },
  {
    "id": "63bebb6b-2a98-356e-3198-1128457c9d09",
    "title": "Estreptopenicilina Mivet 12 frascos x 25ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Para el control y tratamiento de infecciones con localización en aparato respiratorio, tracto urinario, gastrointestinal, reproductivo, glándula mamaria, piel - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b9fa8497ebe24d26a6ed013b4f82029e~mv2.png",
    "volumeWeight": "25ml.",
    "dose": "",
    "drugs": "Cada 1 ml contiene: Procaína Penicilina G200",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/estreptopenicilina-microsules/",
    "price": 0
  },
  {
    "id": "393d50e7-1e16-3f21-c691-e06a62ecce69",
    "title": "Ceftiover Maxium Over 1 dosis.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable de acción prolongada que combina una cefalosporina de 3ª generación (ceftiofur) y un AINEs (meloxicam) - Esta combinación aporta un amplio espectro terapéutico por su acción antibiótica, antiinflamatoria, analgésica y antipirética - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_3c81e8d776654a4898ee1db701626075~mv2.png",
    "volumeWeight": "1 dosis.",
    "dose": "",
    "drugs": "Ceftiofur 2 g",
    "externalLink": "http://www.over.com.ar/product/ceftiover-maxium/",
    "price": 0
  },
  {
    "id": "a579a27e-d001-9460-9ba0-d1866046220c",
    "title": "Orbenin Extra Zoetis 24 Jeringas 3,6 gr.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico para uso intramamario en vacas secas - Posee acción bactericida de amplio espectro, es efectivo sobre patógenos Gram positivos y Gram negativos. - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f817412a8fff4106abb5ac9aaca3a9a8~mv2.png",
    "volumeWeight": "3,6 gr.",
    "dose": "",
    "drugs": "Cloxacilina benzatínica: 0,600 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/orbenin-extra.aspx",
    "price": 0
  },
  {
    "id": "5d769ccd-0e0f-7f8e-30b7-020586d29927",
    "title": "Novantel Lactancia Boehringer 20 Jeringas.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Asociación antibiótica para el tratamientointramamario de mastitis clínica ocasionadas porgérmenes sensibles, en vacas en lactancia. - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_4b62a09de9524e51af47140510bd95be~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Cloxacilina, 200 mg (como sal sódica)",
    "externalLink": "http://www.merial.com.ar/Producers/Dairy/Products/Pages/NOVANTEL%C2%AE-LACTANCIA.aspx",
    "price": 0
  },
  {
    "id": "00219d3e-a77c-2f9c-f814-d6f3d6c5a78d",
    "title": "Ememast Plus Lactancia Boehringer 20 Jeringas.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento curativo de la Mastitis subclínica y clínica(agudas y crónicas) de vacas lecheras durante lalactancia, causadas por gérmenes sensibles a laespiramicina y a la neomicina - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e00c8ee283a54858961d28f1224f9bf8~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Espiramicina 2 g",
    "externalLink": "http://www.merial.com.ar/Producers/Dairy/Products/Pages/EMEMAST-PLUS-%C2%AE.aspx",
    "price": 0
  },
  {
    "id": "f3f60053-4bf5-bda2-3080-f3438959c2ae",
    "title": "Novantel Secado Boehringer 20 Jeringas.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Prevención de la mastitisproducida por gérmenes sensibles en vacas lecheras. - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_eb5b18a3c74341d689288a7282bfa1d3~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Cloxacilina, 500 mg (como sal benzatínica)",
    "externalLink": "http://www.merial.com.ar/Producers/Dairy/Products/Pages/NOVANTEL%C2%AE-SECADO.aspx",
    "price": 0
  },
  {
    "id": "007c9779-fd1a-4f32-a9f8-6e8508a4698a",
    "title": "Romagel Lactancia Boehringer 20 Jeringas.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamientode mastitis clínicas y subclínicas en vacas en lactanciay vaquillonas, causadas por bacterias sensibles,incluídas las que producen beta-lactamasas. - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2649542d08924436b7fbbdf914b46b8f~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Lincomicina 330 mg (como clorhidrato)",
    "externalLink": "http://www.merial.com.ar/Producers/Dairy/Products/Pages/ROMAGEL%C2%AE.aspx",
    "price": 0
  },
  {
    "id": "195d6ed8-b772-0eb4-f10e-4e0a7b9329f0",
    "title": "Tilosina 20 Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "TILOSINA 20 es una solución estéril y estable de Tilosina al 20% lista para usar - Activo principalmente contra: gérmenes Gram positivos, ciertas Leptospiras, virus de molécula grande, algunos Gram negativos agentes PPLO - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_abd98652e9e64a1aab240e60c80bafab~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Tilosina (tartrato) 20 g",
    "externalLink": "http://www.over.com.ar/product/tilosina-20/",
    "price": 0
  },
  {
    "id": "26d23843-8e17-2db4-d54e-8393907b590d",
    "title": "Tetradur L.A. 300 Boehringer 250ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Oxitetraciclina 30%, amplio espectro y larga acción antibiótica, niveles terapeúticos - Indicada para tratar enfermedades causadas por organismos sensibles a la oxitetraciclina (bacterias Gram- y Gram+) - Es más poderoso, ya que contiene 50% más de oxitetraciclina por ml que las formulaciones de LA comunes. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_48e95c9ecbcc418ca595b1da2773d60f~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "52e040e8-fcd6-04d6-1fa4-ee2ccb9274d7",
    "title": "Bio Fenicol Florfenicol Bio98 100ml.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico de amplio espectro - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_95693256c5dc4467a1a90a2762c03116~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "14004481-c37d-5954-1d9c-1a979bf43e8f",
    "title": "Excede Cattle Zoetis 100ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Excede es un antibiótico de amplio espectro, del grupo de las cefalosporinas, activo contra bacterias patógenas Gram + y Gram -, incluyendo a las cepas productoras de betalactamasa - El ceftiofur, es bactericida, se caracteriza por su mecanismo de acción, el cual inhibe la síntesis de la pared celular - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_613f7f4e6f594109b59a82cfb61f8a74~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://ar.zoetis.com/products/bovinos/excede-cattle.aspx",
    "price": 0
  },
  {
    "id": "4a468361-2702-bb75-4829-414fa0f40b4e",
    "title": "Estreptopendiben Biogénesis Bago.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico inyectable de amplio espectro - Asociación sinérgica bifásica de Penicilina y Estreptomicina con Dipirona y Vitamina C - antitérmico - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_b626dbe0ca8d43808d0fc511f9213b03~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id78/",
    "price": 0
  },
  {
    "id": "d2bd8660-20c5-7da3-f283-1f6e78de9570",
    "title": "Emestryn Boehringer 24 ampollas.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución inyectable con rápida y efectiva acción antibiótica - Utilización profiláctica antes y después de las intervenciones quirúrgicas, castraciones, descole, señalada, infecciones de la pleura y peritoneo, abscesos profundos, Fiebre del transporte y Mastitis, infecciones intestinales, del tracto urinario y uterino, infecciones del oído, Neumonías y otras afecciones - Para: Bovinos, Equinos y O",
    "image": "https://static.wixstatic.com/media/06b954_afeb4987d81941228184adc3eb925112~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "35ea8738-39e8-93fd-948c-091139378f6c",
    "title": "Estreptocarbocaftiazol Biogénesis Bago 1l.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antidiarreico, antiséptico, carminativo, normalizador de la flora intestinal - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_84e01f2249eb4ba78eb52c3d81504d99~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Ftalisulfatiazol 2,5 g",
    "externalLink": "http://www.biogenesisbago.com/uy/productos/id218/",
    "price": 0
  },
  {
    "id": "fd59a170-5521-079e-ee2e-34545035c378",
    "title": "Protecto Entero Pectin 900ml.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antidiarreico, espasmolítico, protector de la mucosa, antiséptico, adsorbente de toxinas, carminativo - Poderosa acción antidiarreica que respeta la flora bacteriana normal - Crea una cubierta protectora de la mucosa irritada - Así encapsula las terminaciones nerviosas sensitivas irritadas, anulando el principal estímulo de la motilidad intestinal anormal - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_16474bb4cc154dca9e7677c786ae8047~mv2.png",
    "volumeWeight": "900ml.",
    "dose": "",
    "drugs": "Bismuto subnitrato 3gr",
    "externalLink": "http://www.laboratoriofundacion.com/uploads/5/1/8/4/51847047/pep.pdf",
    "price": 26902.45
  },
  {
    "id": "17c004e1-1d6e-30a2-2c64-0e0c76a0849e",
    "title": "Polixane Over 5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Formulación destinada a la prevención y tratamiento del meteorismo (timpanismo o empaste) de bovinos y ovinos - Cólicos y diarreas fermentativas de todas las especies - Flatulencia - Aerofagia - Distensión y dolores abdominales postoperatorios - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_2ab0de367e4941a6a25b0f107d0fc41c~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Dimetilpolisiloxano activado 10 g",
    "externalLink": "http://www.over.com.ar/product/polixane-liquido/",
    "price": 0
  },
  {
    "id": "05b9db45-f156-84ff-e05b-de546bbccc05",
    "title": "Terra Cortril Spray Zoetis 125ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Es una especialidad farmacéutica que combina simultáneamente en un solo preparado, la acción antiinflamatoria de la Hidrocortisona, y la acción antibiótica de la Oxitetraciclina - Su aplicación en forma de spray es práctica y accesible pudiéndose repetir las veces que sea necesario - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_e190f9c7a11a4ab1872e6584d258d415~mv2.png",
    "volumeWeight": "125ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://ar.zoetis.com/products/terra-cortril-spray.aspx",
    "price": 32960
  },
  {
    "id": "cfcc340b-6463-496f-227f-c44f63d0758d",
    "title": "Negasunt Polvo Bayer 1kg.",
    "laboratory": "Bayer",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "DISCONTINUADO - Los dos distintos larvicidas contenidos en Negasunt polvo se encargan de aniquilar los gusanos de las temidas gusaneras o miasis cutáneas - Uno de ellos posee una acción mortal relativamente rápida, mientras que el otro actúa más lentamente pero previene de un nuevo agusanamiento de la herida durante varios días después de su aplicación, manteniéndola limpia y dando tiempo para que",
    "image": "https://static.wixstatic.com/media/06b954_58760b192445424d9d37ca2372c7cd03~mv2.png",
    "volumeWeight": "1kg.",
    "dose": "",
    "drugs": "Coumaphos 3%",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a09c87ce-2db9-1492-c24c-b6bb183d6aa2",
    "title": "Pomada Galmetrin Biogénesis Bago 1kg.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Larvicida externo, curabicheras en pomada de uso local para ovinos, equinos, porcinos y bovinos - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_1c12b50029f34f21bb7c38720aba4c99~mv2.png",
    "volumeWeight": "1kg.",
    "dose": "",
    "drugs": "Cipermetrina 2 g",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id67/",
    "price": 0
  },
  {
    "id": "a48dfa88-4798-872f-ffb1-b32833eb9517",
    "title": "Overmectina Triple Over 2,5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno de amplio espectro - Indicado para el tratamiento de las parasitosis producidaspor vermes gastrointestinales y pulmonares - Fasciolicida - Para: Bovinos, Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e21d660c7b54449f8d4c817e42f81d1d~mv2.png",
    "volumeWeight": "2,5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Levamisol clorhidrato 8,00 g",
    "externalLink": "http://www.over.com.ar/product/overmectina-triple-oral/",
    "price": 0
  },
  {
    "id": "70e710b0-88e3-70be-ca40-2a002a6dccaf",
    "title": "Bifetacel 10 Co Se Microsules 5l.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario interno de amplio espectro, adulticida, larvicida y ovicida. Indicado para el tratamiento y la prevención de Nematodes gastrointestinales y pulmonares - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_6f2558ab4d3c471e9659708698e3c9b7~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Fenbendazole10,0 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/bifetacel-co-se/",
    "price": 145510.35
  },
  {
    "id": "534f7310-d76e-3c60-63c5-b7c8fd83361b",
    "title": "Super Synect Over 1l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario externo - Pour on - Piojicida - Repelente de insectos - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_823acad77c5e4d2aab173d958a2f588e~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cipermetrina 5 g",
    "externalLink": "http://www.over.com.ar/product/super-synect-pour-on/",
    "price": 0
  },
  {
    "id": "2c2cdbc2-e606-31aa-8f1c-e0b1fe01bee4",
    "title": "Overxicam Gel Equinos Over 30gr.",
    "laboratory": "Over",
    "animalBreeds": [
      "equino"
    ],
    "description": "Antiinflamatorio no esteroide de uso oral para equinos - Esta indicado para aliviar el dolor y la inflamación en trastornos locomotores y musculoesqueléticos agudos y crónicos; dolor asociado a cólicos; analgesia pre y post quirúrgica. - Para: Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_9b232a9917f445649651aaee7cea9ea4~mv2.png",
    "volumeWeight": "30gr.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Fursemida 5 g",
    "externalLink": "http://www.over.com.ar/product/overxicam-gel-equinos/",
    "price": 0
  },
  {
    "id": "c8e386c5-f4ce-4c98-7958-ff4b5a30e2a1",
    "title": "Overmectina Total Equinos Over 10gr.",
    "laboratory": "Over",
    "animalBreeds": [
      "equino"
    ],
    "description": "Antiparasitario interno a base de Ivermectina al 1,2% y Praziquantel 15% - Amplio espectro para el control de parasitosis internas y externas - Sabor manzana - Alta palatabilidad - Para: Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_a33e9c0183e14721a46b38aefe282ffa~mv2.png",
    "volumeWeight": "10gr.",
    "dose": "",
    "drugs": "Cada 100 g contiene: Ivermectina 1,20 g",
    "externalLink": "http://www.over.com.ar/product/overmectina-total-equinos/",
    "price": 0
  },
  {
    "id": "24e334f3-1125-7346-c460-3cf7c84b6f38",
    "title": "Vermectin Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida inyectable para bovinos, destinado al tratamiento y control de parasitosis externas e internas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_37cb9fc4faef4dcebd85c4e7aae4257e~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Ivermectina 1 g",
    "externalLink": "http://www.over.com.ar/product/vermectin/",
    "price": 0
  },
  {
    "id": "e15064fe-0174-ca38-1582-5168d363c8c8",
    "title": "Doramic AD3E Microsules 500ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario de amplio espectro contra endo y ectoparásitos (endectocida) con vitaminas A, D3 y E- Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e5f31a41db7c40f984aa829f320820ca~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Doramectina 1,00 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/doramic-ad3e/",
    "price": 68365
  },
  {
    "id": "89e17f40-7043-2fea-a5d5-065f87c09def",
    "title": "Cincha Azoxi Pro Zamba 5l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Fungicida para utilizar en soja, maíz, sorgo, trigo cebada cervecera, maní, poroto y ajo - Posee acción sistémica, mesostémica y translaminar para el control de enfermedades foliares - Azoxistrobina + Cyproconozale.",
    "image": "https://static.wixstatic.com/media/06b954_4cb99f60546f4f7f8990353194f43d82~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "16349ded-ef18-913a-e662-28a0726785b6",
    "title": "Clorpirifos Zamba 20l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Insecticida-acaricida Clorpirifos Zamba, compuesto órgano fosforado que actúa por contacto, ingestión e inhalación, siendo eficaz contra insectos chupadores y masticadores.",
    "image": "https://static.wixstatic.com/media/06b954_1eed871f5d024a9d9feea46407f24e28~mv2.png",
    "volumeWeight": "20l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f5cad219-f3cb-0600-9b0a-6152920a268f",
    "title": "Apero Lambda 25% CS Zamba 5l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Insecticida piretroide de amplio espectro - Actua especialmente sobre larvas de lepidópteros - Posee buen poder de volteo, residualidad y propiedades repelentes.",
    "image": "https://static.wixstatic.com/media/06b954_562b5a7073db41a38c6c4512943a78da~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "ba3b092a-a186-24af-a9bb-0c6755e33465",
    "title": "Dicamba Zamba 5l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida postemergente sistémico selectivo que se absorbe por hojas y raíces, trasladándose vía floemática y xilemática - Controla malezas de hoja ancha resistentes a 2,4-D o MCPA - Puede utilizarse solo o en mezclas con otros herbicidas sobre diferentes cultivos en distintos estados de desarrollo.",
    "image": "https://static.wixstatic.com/media/06b954_aa93b814193a4a74af44d66363932a32~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5cd4d435-fb76-9b59-1e18-c9576386513e",
    "title": "Paraquat Zamba 5l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida, defoliante y desecante.Actúa sólo por contacto, de forma rápida y enérgica sobre el follaje, sin afectar tallos de corteza marrón.",
    "image": "https://static.wixstatic.com/media/06b954_73a62eb278084e80a853ac2dfc8ba6fe~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7587d547-cfb6-d1a4-c59a-53e38efed1dd",
    "title": "S-Metolacloro Zamba 5l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida preemergente de acción sistémica - Controla amplio espectro de malezas de hojas angostas y anchas - Selectivo para cultivos de maíz, soja, girasol, hortícolas y sorgo granífero (tratado con antídoto).",
    "image": "https://static.wixstatic.com/media/06b954_80e50d4fca564351abefa416e02095eb~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "ff7d59fb-ab5f-0f5d-caf7-db523633bd7b",
    "title": "Bajador Haloxi 12% Zamba 5l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida postemergente de acción sistémica selectivo para cultivos de girasol, maní, poroto, soja y algodón - Controla malezas gramíneas perennes y anuales - Detienen su crecimiento inmediatamente después de la aplicación - En los rizomas destruye inicialmente las yemas y luego el tejido se necrosa - Posee alta capacidad de penetración por el follaje.",
    "image": "https://static.wixstatic.com/media/06b954_5c6d7b69a5d942658f0537e2904c91c5~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f28ecc73-c44d-5e38-015f-1cfc9b5ce678",
    "title": "Atrazina Zamba 20l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida selectivo: controla malezas de hoja ancha y pastos anuales (gramíneas) en cultivos de: caña de azúcar, maíz, sorgo granífero - Actúa por translocación y es de acción residual - Herbicida a base de Atrazina, presenta ventajas como: suspensión líquida, flotable que permite la medición fácil y segura de las dosis.",
    "image": "https://static.wixstatic.com/media/06b954_a44bdd182cb14e64b153f5c405222761~mv2.png",
    "volumeWeight": "20l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7eb775ce-9dd0-8342-7916-729da86466b7",
    "title": "2,4 D Amina Zamba 20l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida efectivo, de acción sistémica y de baja volatilidad - Destinado al control eficaz de malezas de hoja ancha en determinados cultivos - Se recomienda emplearlo en zonas críticas, donde la volatibilidad de los selectivos corrientes (esteres del ácido 2,4D) pueda alcanzar a cultivos hortícolas, forestales y florales cultivados en la proximidad.",
    "image": "https://static.wixstatic.com/media/06b954_a6bd75a20c274eb69c1f32676460c625~mv2.png",
    "volumeWeight": "20l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4169adad-9e93-2372-04c9-b19ede9be941",
    "title": "2,4-D Zamba 20l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Combate las malezas, actuando selectivamente por la absorción de las hojas, de su principio activo, el éster butílico del 2,4 D - La susceptibilidad de las malezas al producto está relacionada al estado de crecimiento de las mismas, debiendo aplicarse mayor dosis cuanto más avanzado sea el desarrollo de las mismas.",
    "image": "https://static.wixstatic.com/media/06b954_eeacb80607304bddb4f339d3c5a054a9~mv2.png",
    "volumeWeight": "20l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4c785450-ace6-6c51-ef04-0b722a3383d6",
    "title": "2,4 DB Zamba 20l.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida selectivo sistémico para el control de malezas de hoja ancha, en cultivos de alfalfa, maní y pasturas mixtas o consociadas formadas por leguminosas.",
    "image": "https://static.wixstatic.com/media/06b954_0abecc7f609d4b599e5dab65a6fd470a~mv2.png",
    "volumeWeight": "20l.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4426bd85-d519-434a-376a-feb04971f19a",
    "title": "Caravana Maxi Allflex sin numeración 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c60c24b7269947cfb0c5c376146a342b~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "6c14f514-cc8d-7d60-951e-279e81d5eaaf",
    "title": "Caravana Grande Allflex sin numeración 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_0a0dea73fe4a4e42bf3bd27d388097d5~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d01445e3-ce5f-66b1-759e-e76a615c2ee8",
    "title": "Caravana Mediana Allflex sin numeración 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Para: Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_208dc0afaa044b7cad1f4fa89973c686~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a3ec6954-895c-1cfc-a881-8669f1d3ed17",
    "title": "Pinza Aplicador de Caravanas Allflex",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Aplicador de Caravanas.",
    "image": "https://static.wixstatic.com/media/06b954_d3d18f4c9e0d4533b4dec1ad5cc40b7e~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 42620.9
  },
  {
    "id": "a8681431-6f9e-6380-9e3c-4d79aaecbb40",
    "title": "Señalador de Oreja Sharp Vet.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Señalador de Oreja. Preguntar disponibilidad y opciones.",
    "image": "https://static.wixstatic.com/media/06b954_4baaf58d59f043dca1e34b3de198cac1~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "2bd81e34-d9ba-f9c8-a5f6-fc2b8c9e033c",
    "title": "Pasta verde para Tatuar Kemco 28g.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Pasta para tatuar verde.",
    "image": "https://static.wixstatic.com/media/06b954_9f63e03be0a44f5fb9fe486972b12a81~mv2.png",
    "volumeWeight": "28g.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4343a4d7-5bd1-2d4d-9a42-81e270e7ea36",
    "title": "Energizador de Alambrados Plyrap 40km 12V.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Plyrap - Alcance en línea recta 1.2km - Funciona a 12 V.",
    "image": "https://static.wixstatic.com/media/06b954_cea5c70963244b1790ed5b0a0bea8ad4~mv2.png;06b954_d2e64096e16e44c8b21c96d85990f7ab~mv2.jpg",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "762c15cb-4d11-d1b2-efbe-094ffeed8130",
    "title": "Electrificador 220V 60km Mandinga C250.",
    "laboratory": "Mandinga",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga C250 - Desde pequeñas superficies hasta 600 has electrificadas en forma segura. Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_a403ddcc86b94de58d8a095c03dcc546~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5339aa5d-605f-2ca6-8b24-4fc079382505",
    "title": "Electrificador Dual 120km Mandinga CB600.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga CB600 - Desde pequeñas superficies hasta 1000 has electrificadas en forma segura. Funciona a 12-220 V. No incluye Batería.",
    "image": "https://static.wixstatic.com/media/06b954_64244f1d2ab04957917a04a3e06e807b~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "35d40190-e1aa-5d99-48b7-a3e2db741827",
    "title": "Electrificador 220 V 120km Mandinga C600.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga C600 - Desde pequeñas superficies hasta 1000 has electrificadas en forma segura. Funciona a 220 V.",
    "image": "https://static.wixstatic.com/media/06b954_2b1856b8fd444a35872c9fe90bb35172~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "85aeda00-d8a3-3e81-5378-8491bc3d2daf",
    "title": "Electrificador Dual 60km Mandinga CB250.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga CB250 - Desde pequeñas superficies hasta 600 has electrificadas en forma segura. Funciona a 12-220 V. No incluye Batería.",
    "image": "https://static.wixstatic.com/media/06b954_c29d2d61cc104ca99f9c81e3967acde1~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "10939e33-8af8-6206-8668-c1ea75f4b6e7",
    "title": "Electrificador Dual 40km Mandinga CB120.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga CB120 - Desde pequeñas superficies hasta 300 has electrificadas en forma segura. Funciona a 12-220 V. No incluye Batería.",
    "image": "https://static.wixstatic.com/media/06b954_2618e84b2f8d40ee8bf7691740295e1c~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "87093132-4eb7-6c9b-1e9b-8decf8c40006",
    "title": "Electrificador a Batería 12V 120km Mandinga B600.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga B600 - Desde pequeñas superficies hasta 1000 has electrificadas en forma segura. Funciona a 12-36 V. - No incluye batería.",
    "image": "https://static.wixstatic.com/media/06b954_a612c4c3146c437398778d94a4c4bbc1~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "9ea6122f-546c-cef6-9b56-4a5130693d7e",
    "title": "Electrificador a Batería 12V 60km Mandinga B250.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga B250 - Desde pequeñas superficies hasta 600 has electrificadas en forma segura. Funciona a 12V - No incluye batería.",
    "image": "https://static.wixstatic.com/media/06b954_8d7d075742074ecaba4cfcfcd30c7e5c~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "c14622c0-bed1-132a-7eb8-c2e1c69f3113",
    "title": "Alambre de Manea N° 8, 9 o 10 x 25 kg.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Alambre de Manea - Diámetros: 8= 4.06mm- 9= 3.65mm- 10= 3.25mm.",
    "image": "https://static.wixstatic.com/media/06b954_2217f562a3f941e996305b0e84af2350~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "25 kg.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "de9038c6-7b82-bc17-d698-c7fe39dc1256",
    "title": "Alambre Galvanizado 16/14 Alta Resistencia 1km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Alambre Galvanizado.",
    "image": "https://static.wixstatic.com/media/06b954_571c4e8bf9574dcd87ff927311c4bfe3~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f3ccfc89-1b58-abc2-ef71-e9f7d6f6280b",
    "title": "Respi 8 Querato Providean Tecnovax 50 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Respi 8 Querato es la vacuna más completa para la prevención de las Enfermedades Respiratorias Bovinas (ERB) y Queratoconjuntivitis Infecciosa Bovina (QIB) - Estas enfermedades son particularmente agresivas en los animales jóvenes, causando pérdidas de hasta 30 kg en cada animal afectado por ambas enfermedades - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_102437863d0c4f63abbfe0181f053701~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-respi-8-querato-2/",
    "price": 0
  },
  {
    "id": "31b04303-22ed-79fd-5112-7f7f359cc4a7",
    "title": "Jeringa Automática Fix Master Plus 50c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Administración precisa y rápida, con rango de dosificación ajustable - La Jeringa Automática Fix evita errores en la aplicación y dosificación de substancias que requieren precisión.",
    "image": "https://static.wixstatic.com/media/06b954_7dd6ed5266724184b9cf9273175bacd3~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "eee0f223-4e5e-e8cf-6793-a4f1aafc3b3f",
    "title": "Autodosificadora Lider Matic 20c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Equipado con tirafondo para ser emplead con bidones de 5 a 10 litros - Posee un cuerpo de plástico reforzado totalmente resistente a productos pour on y se puede utilizar como jeringa intraruminal, como dosificador oral y jeringa para inyectar, siempre empleando los accesorios específicos en sus distintos usos.",
    "image": "https://static.wixstatic.com/media/06b954_7af1cf81c8844cae901c417365078986~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "f3dcd708-eb54-d478-fd38-66721a8245d5",
    "title": "Diarrea Neonatal CDV 50 dosis.",
    "laboratory": "CDV",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Preventivo de cuadros clínicos de diarrea neonatal causados por la infección con Rotavirus y Coronavirus y enfermedades entéricas producidas por Escherichia coli y Salmonella - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_0a09f275bf9241cab17ae90e41b6c745~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.cdv.com.ar/index.php/2015/07/vacuna-anti-diarrea-neonatal/",
    "price": 0
  },
  {
    "id": "def1578d-5b66-fbdf-118d-a6b85262cdaf",
    "title": "Tipertox Brouwer 145ml.",
    "laboratory": "Brouwer",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antisárnico, piojicida y mosquicida - Para: Bovinos y Equinos",
    "image": "https://static.wixstatic.com/media/06b954_54a2961eca0647fe83af9ee41c89bc7e~mv2.png",
    "volumeWeight": "145ml.",
    "dose": "",
    "drugs": "Cipermetrina 5,6 g",
    "externalLink": "http://brouwer.com.ar/productos/tipertox/",
    "price": 0
  },
  {
    "id": "a444783f-a482-69b4-9cf9-732d90f80234",
    "title": "Yodacalcio B12 D Chinfield 250ml.",
    "laboratory": "Chinfield",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento mineral vitamínico indicado cuando se necesite incrementar la provisión de minerales y vitaminas en casos de, hipocalcemia, hipofosfatemia, hipomagnesemia hipotiroidismo, debilidad, paresia puerperal, disminución de fertilidad - Coadyuvante en carencias minerales vitamínicas durante la preñez, lactancia, crecimiento, engorde, convalecencias, pre-parto y pre-servicio, pre y postdestete -",
    "image": "https://static.wixstatic.com/media/06b954_d3c02deb7e3143f4b72b4d5f80acec0f~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Gluconato de calcio",
    "externalLink": "http://www.chinfield.com/vademecum-items/yodacalcio-b12-d-2/",
    "price": 0
  },
  {
    "id": "b7c855a0-e806-d5f4-2c5a-4fef6aa79453",
    "title": "Caravana Mediana Allflex con numeración 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Para: Ovinos. ESPECIFICAR NUMEROS AL FINAL DE LA COMPRA",
    "image": "https://static.wixstatic.com/media/06b954_0223f5d345aa4d93851380c49602bdea~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7e0cde28-bdea-3b3a-f7c5-a8fca9178907",
    "title": "Caravana Grande Allflex con numeración 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Para: Bovinos. ESPECIFICAR NUMEROS AL FINAL DE LA COMPRA",
    "image": "https://static.wixstatic.com/media/06b954_95712cc914cd478ba0561c71ff8d438a~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "37a1636c-dd49-0ad8-dbc4-89ae43925eb1",
    "title": "Caravana Maxi Allflex con numeración 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente - Para: Bovinos. ESPECIFICAR NUMEROS AL FINAL DE LA COMPRA",
    "image": "https://static.wixstatic.com/media/06b954_212cc948888b4769bc905d260d1f2ceb~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1cff3876-cef3-4cac-cd0c-60170b2fe997",
    "title": "Caravanas Insecticidas Synect-dc Over 40% 100u.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo para uso en bovinos. Indicado para el control y tratamiento de infestaciones por Haematobia irritans (mosca de los cuernos). - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9f413da508264e1ba51e052aa9f1e9ed~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 497.5
  },
  {
    "id": "33bc9c6f-77ba-13c5-45c4-9949c042b9b8",
    "title": "Caravanas Diazinón Over 40% 100u. C",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo. Indicado para el control y tratamiento de infestaciones por Haematobia irritans (mosca de los cuernos) - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_da834a2fffb64ea58ca5f0ad066693d6~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.over.com.ar/product/caravanas-diazinon-40/",
    "price": 0
  },
  {
    "id": "5a5f5d83-aa14-bae4-4ef5-0d2d5635ce53",
    "title": "Caravana Botón Allflex 25u.",
    "laboratory": "Allflex",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Caravanas para identificar su ganado en forma eficiente. - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_bef76a9e27434f15b9ccc116a1c42385~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d9cc3364-8803-1de4-9bc0-ccc55cfb53fa",
    "title": "Toram Nufarm 5lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Toram NF es un herbicida postemergente sistémico de acción hormonal para el control de malezas de hoja ancha, anuales y perennes, en cereales, caña de azúcar, lino y praderas de gramíneas - Se absorbe por vía radicular y foliar, se traslada por floema y xilema - Actúa como una hormona vegetal (Auxinas) que impide la síntesis de proteínas sobre las zonas de crecimiento de la planta, afectando el no",
    "image": "https://static.wixstatic.com/media/06b954_edc3681adf424e83861b828e54438a2d~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "fbe084c2-0ba3-f0ee-d852-5e589ae6f754",
    "title": "Reg-Sec IV 20lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Reg-Sec IV simplifica al máximo los controles de aplicación - Su presentación es de un color rojo oscuro y su naturaleza ácida, agregado al agua dura vira a un color amarillo intenso - Para comodidad del usuario hemos establecido una escala de aplicaciones por color, basadas en el pH original del agua a emplear.",
    "image": "https://static.wixstatic.com/media/06b954_9d35f313e2ff47b181977f28586469b7~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "27d8d8bf-c150-6f13-efa2-413b19309acb",
    "title": "Power Plus/ Glifosato Full II 20lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida no selectivo para el control post-emergente de las malezas anuales y perennes - Es de acción sistémica, se absorbe por las hojas y tallos verdes - Inhibe la síntesis de aminoácidos aromáticos.",
    "image": "https://static.wixstatic.com/media/06b954_ecaaf0c08a8b4bde830b083c5b89c8e6~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "fdfa3762-e609-f0b6-8a7b-3f8d2db7b323",
    "title": "Pastar Dow 5lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "REEMPLAZADO POR EL PASTAR GOLD. Pastar es un herbicida selectivo y sistémico, recomendado para el control de malezas de hoja ancha de porte herbáceo, semi-arbustivo y arbustivo, en áreas de pasturas de gramíneas - Sus principios activos son Aminopyralid y Fluroxypyr.",
    "image": "https://static.wixstatic.com/media/06b954_439987cb3c2f47dca3c18f0b11b65653~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://www.camponuevosrl.com/product-page/pastar-gold-dow-5lt-consultar-precio",
    "price": 0
  },
  {
    "id": "3f80c85c-882b-6c36-ecb7-d1bef1fbe384",
    "title": "Nufuron Metsulfuron Nufarm 100g.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Nufuron es un herbicida selectivo postemergente para el control de malezas latifoliadas en cereales de invierno (trigo y cebada principalmente) - Posee acción sistémica y residual y su modo de acción es mediante la inhibición de la división y crecimiento celular (ALS) de las malezas latifoliadas - Nufuron es un herbicida muy activo en malezas pequeñas, en crecimiento - Es absorbido a través del fo",
    "image": "https://static.wixstatic.com/media/06b954_146c4859f38f4b34b16abfca3bd243db~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "100g.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4818f7be-79c4-e8c2-1f2d-9cfeacbd6dcd",
    "title": "Navajo Nufarm 5kg.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Navajo es un herbicida selectivo sistémico y de acción hormonal para el control de malezas de hoja ancha en determinados cultivos - Posee la concentración de sal y ácido más alta del mercado - Al ser una sal Amina del ácido 2,4 D, es de muy baja volatilidad pudiendo ser aplicado en zonas donde el 2,4 D Ester (por su volatilidad) está prohibido, o en lotes con cultivos vecinos sensibles al 2,4D - F",
    "image": "https://static.wixstatic.com/media/06b954_c8f3b380a0a3460ba97152f5c8b10003~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "5kg.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "e150c330-850a-f9fb-ff19-3c41715f3464",
    "title": "Lontrel Dow 5lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Lontrel es un herbicida selectivo sistémico de acción hormonal que se aplica en postemergencia.",
    "image": "https://static.wixstatic.com/media/06b954_c6a82e04932e43e1971fd7555b3cc1b0~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "43ebe89b-596e-2485-8be6-47aa89d8d08f",
    "title": "Lero-Wett Lero Técnica 20lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Lero-Wett es un humectante higroscópico de gran versatilidad, actúa sobre las tensiones superficiales permitiendo una buena cobertura de las superficies tratadas - Favorece la penetración de los principios activos herbicidas en las malezas, mejorando su eficiencia e incrementando su acceso a los Sitios Activos.",
    "image": "https://static.wixstatic.com/media/06b954_049e10e1c9b0439fb30be250c35748f3~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "71a97cef-aad7-f298-634e-e03c5712ee2e",
    "title": "Lero-Wett Lero Técnica 5lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Lero-Wett es un humectante higroscópico de gran versatilidad, actúa sobre las tensiones superficiales permitiendo una buena cobertura de las superficies tratadas - Favorece la penetración de los principios activos herbicidas en las malezas, mejorando su eficiencia e incrementando su acceso a los Sitios Activos.",
    "image": "https://static.wixstatic.com/media/06b954_d159ee297ae34e07974c23af405b8eb7~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "0596865d-43c9-c1a8-16ef-8c04f5081022",
    "title": "Lero-Wett Lero Técnica 1lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Lero-Wett es un humectante higroscópico de gran versatilidad, actúa sobre las tensiones superficiales permitiendo una buena cobertura de las superficies tratadas - Favorece la penetración de los principios activos herbicidas en las malezas, mejorando su eficiencia e incrementando su acceso a los Sitios Activos.",
    "image": "https://static.wixstatic.com/media/06b954_f39cb52d6f5146eda03bb1861f4fcf4e~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "1lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1df3ec6e-c12e-6575-2cc9-a56d0b8d98c7",
    "title": "Kamba Nufarm 5lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Kamba es un herbicida hormonal postemergente de acción sistémica, foliar y selectiva en cultivos de gramíneas para el control de malezas de hoja ancha resistentes al 2,4 D o MCPA - Se absorbe a través de las hojas y raíces traslocándose con facilidad a todos los órganos de la planta a través de ﬂoema y xilema, controlando totalmente la maleza.",
    "image": "https://static.wixstatic.com/media/06b954_b1cb7a28d6784414af5ae94ad4824208~mv2_d_2736_1824_s_2.png",
    "volumeWeight": "5lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "8fb3f67f-376f-8158-510f-09ea72f0695f",
    "title": "Glifosato II Atanor 20lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida no selectivo para el control post-emergente de las malezas anuales y perennes - Es de acción sistémica, se absorbe por las hojas y tallos verdes - Inhibe la síntesis de aminoácidos aromáticos.",
    "image": "https://static.wixstatic.com/media/06b954_ef12a99ab3154be48fba3a8eda698a1f~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "682fe577-2e7f-c9b9-5a67-42a521ad6a45",
    "title": "Glifomax NG Zamba 10kg.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida selectivo post-emergente de acción sistémica que controla malezas de hoja ancha - Se absorbe por las hojas y las raíces, trasladándose a toda la planta a través del sistema vascular - Regulador de crecimiento (imitador de auxinas).",
    "image": "https://static.wixstatic.com/media/06b954_39724c261c81445a81cd7f42377d4440~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "10kg.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "8f5446c8-bf0e-593e-944e-da4574bf3a44",
    "title": "Dicamba Atanor 10lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Herbicida selectivo post-emergente de acción sistémica que controla malezas de hoja ancha - Se absorbe por las hojas y las raíces, trasladándose a toda la planta a través del sistema vascular - Regulador de crecimiento (imitador de auxinas).",
    "image": "https://static.wixstatic.com/media/06b954_7502e1d647ac4c5fbb1bebe20021af76~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "10lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a7805ea6-f591-69e2-7b42-08925ea36304",
    "title": "Credit Amonio Glifosato Nufarm 20lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Credit Amonio es un herbicida no selectivo para el control postemergente de malezas anuales y perennes en áreas agrícolas, industriales, caminos y vías férreas - Posee acción sistémica, es absorbido por hojas y tallos verdes y traslocado hacia las raíces y órganos vegetativos subterráneos, ocasionando la muerte total de las malezas emergidas - Los efectos son lentos, sobre todo en las especies per",
    "image": "https://static.wixstatic.com/media/06b954_2def28464ae0443e9d8ac028f6f21975~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "8b585564-e473-7795-a137-0cbcc085ae02",
    "title": "Atrazina 90 Nufarm 10kg.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Atrazina 90 WG Nufarm es un herbicida selectivo sistémico y residual, para el control de malezas en cultivos de Maíz, Sorgo granifero y Caña de azúcar - Se puede usar en tratamiento preemergencia y postemergencia, controlando malezas de hoja ancha y algunas gramíneas e impidiendo su crecimiento durante varios meses - El producto es absorbido por las raíces y las hojas de las malezas, inhibiendo el",
    "image": "https://static.wixstatic.com/media/06b954_f1b36acdb2b242318d849ddb5e341e4d~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "10kg.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "4a492b90-d7e6-232b-e3e8-feb9dc55bd28",
    "title": "Clorpirifos Nufarm 20lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Clorpirifos Nufarm es un insecticida perteneciente a la familia de los Organofosforados, con acción sobre el sistema nervioso del insecto, siendo un producto efectivo para el control de insectos chupadores y masticadores en cultivos extensivos e intensivos - Posee acción por contacto, ingestión e inhalación - Afecta el sistema nervioso central mediante la inhibición de la enzima Acetilcolinestersa",
    "image": "https://static.wixstatic.com/media/06b954_a1e179529f944c17a056ea70223bcd61~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b4d81880-b5f0-449d-3256-43c7a6835353",
    "title": "Cipermetrina Nufarm 20lt.",
    "laboratory": "Agroquímicos",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Cipermetrina Nufarm es un insecticida perteneciente a la familia de los Piretroides, con acción sobre el sistema nervioso del insecto, siendo un producto efectivo para el control de plagas insectiles como lepidópteros, coleópteros y trips - Posee acción por contacto, ingestión e inhalación - Afecta el sistema nervioso central mediante la inhibición de la enzima Acetilcolinestersa, produciendo la a",
    "image": "https://static.wixstatic.com/media/06b954_8801242c3c6348a59106e940eb54f20c~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20lt.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b04d8d78-fd5e-35fa-ced2-580553795be7",
    "title": "Guantes de Látex Largos Verdes Krutex 100u.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Guantes de Látex examinación.",
    "image": "https://static.wixstatic.com/media/06b954_bd929eb3d88c4fe7815e8e866a9edbdc~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 16446
  },
  {
    "id": "ce4f08bf-269a-42ab-c30d-8e7bed9fdc02",
    "title": "Guantes de Látex Cortos Dexal 100u.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Guantes de Látex.",
    "image": "https://static.wixstatic.com/media/06b954_f5b7c9df3ae14e4d84456df23e795ae5~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 3430.35
  },
  {
    "id": "734e6716-3b07-7e74-b254-fdd6b5370ad2",
    "title": "Electrificador a Batería 12V 40km Mandinga B120.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Energizador de Alambrados Mandinga B120 - Desde pequeñas superficies hasta 300 has electrificadas en forma segura - Funciona a 12V - No incluye batería.",
    "image": "https://static.wixstatic.com/media/06b954_62ae8e3cd8be487d9f152fd528ae57e4~mv2.png;06b954_c54acac3f5e743ac85bf134166b755a8~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "64f46783-c0b4-f993-f973-45fc079a80f3",
    "title": "Cable Electroplástico Arriero 9 hilos 500mts.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Cable Electroplástico 9 Hilos.",
    "image": "https://static.wixstatic.com/media/06b954_0283e98aa5b948d9bb83ab937b6b5596~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "ec0da94d-70f8-d7cf-0309-537081c144fa",
    "title": "Barra Paintstick U.S.A. c/u.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Barra Paintstick Tiza U.S.A.",
    "image": "https://static.wixstatic.com/media/06b954_12a3479df52949fd9da0cc8b772980fc~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 3450
  },
  {
    "id": "0787dafe-d0fa-9f66-f6c8-0a530389c156",
    "title": "Alambre Galvanizado 3.25mm 380m.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Alambre Galvanizado - Diámetro: 3.25mm.",
    "image": "https://static.wixstatic.com/media/06b954_2217f562a3f941e996305b0e84af2350~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5f855d8f-0fc2-562f-3592-11214f5393aa",
    "title": "Alambre Galvanizado 17/15 1km.",
    "laboratory": "Artículos Rurales",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Alambre Galvanizado.",
    "image": "https://static.wixstatic.com/media/06b954_571c4e8bf9574dcd87ff927311c4bfe3~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "c58b7801-ef73-fce8-b999-c97334b29bb5",
    "title": "Trebol Blanco GAPP 20kg.",
    "laboratory": "Semillas Híbridas y Forrajeras",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Trebol Blanco.",
    "image": "https://static.wixstatic.com/media/06b954_4ae810e370b8495d8192c5f442908504~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20kg.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "12786c74-30cb-5942-bbe6-fed8ea067592",
    "title": "Sorgo Forrajero Sudan 25kg.",
    "laboratory": "Semillas Híbridas y Forrajeras",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Sorgo Forrajero Palo Verde.",
    "image": "https://static.wixstatic.com/media/06b954_b6785922006a43efb87627b7b1482536~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "25kg.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "3954cfb4-3d0a-afaa-a210-e05158b92176",
    "title": "Viral Reproductiva CDV 50 dosis.",
    "laboratory": "CDV",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Preventivo de cuadros respiratorios y reproductivos (infertilidad, aborto y muerte perinatal) producidos por los virus de IBR y BVD y bacterias del género Leptospira,Campylobacter y Haemophilus somnus. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b2fa90fc82824e248b9387ca3444bdf5~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5677b9df-89b7-245a-7c7d-16c54f52a0cf",
    "title": "Viral Feedlot CDV 50 dosis.",
    "laboratory": "CDV",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Preventivo de cuadros respiratorios y oculares producidos por los virus de IBR, BVD y PI3 y las bacterias asociadas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_42dc919b557840aa83d2488216e355c2~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "22c7eae8-5c57-108c-d449-c3828b16d59c",
    "title": "Clostridial Polivalente Bovino Lanar Tradicional CDV 50 dosis.",
    "laboratory": "CDV",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Preventivo de Mancha, Gangrena gaseosa, Enterotoxemia, Hepatitis necrótica, Edema maligno y Muerte súbita - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_89873208602a41278da4b9b2f2c23c32~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "cd1e641f-75d5-e285-ee75-bf29e8b470ae",
    "title": "Rotatec J5 Biogénesis Bago 80 dosis.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna para la prevención del síndrome de la diarrea neonatal del ternero causado por Rotavirus bovino y bacterias Gram negativas - Endotoxemias secundarias a infecciones por bacterias Gram negativas y mástitis por coliformes en vacas de tambo - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_cd5d0b3c78da4f9f9115c9f3dc4b8200~mv2.png",
    "volumeWeight": "80 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.biogenesisbago.com/uy/productos/id176/",
    "price": 0
  },
  {
    "id": "c9b9e4f8-668f-59ef-e71b-93e92383d4ae",
    "title": "Biopoligen HS Respiratoria Biogénesis Bago 50 dosis.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna para la prevención del Síndrome Respiratorio en bovinos (Complejo de enfermedades respiratorias/ Fiebre del Transporte/ Neumonía) y cuadros reproductivos, neurológicos y entéricos asociados a la acción individual o combinada de los virus y bacterias presentes en la composición - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_298388ceedc24b8e92457ea1497f931e~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "8042216f-f31a-c931-25e1-18275170d062",
    "title": "Bioabortogen H (Reproductiva) Biogénesis Bago 50 dosis.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna para la prevención de enfermedades que provocan infertilidad y abortos en bovinos, ocasionados por los microorganismos presentes en la composición - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9533c04709e14e1fbf5dd7e4169a2c16~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "28b0abe5-f798-1b55-098f-fff077262963",
    "title": "Bioclostrigen J5 MGE Triple Biogénesis Bago 60 dosis.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna para la prevención de cuadros de mancha y gangrena gaseosa producidas por Clostridium chauvoei y C. septicum, y enterotoxemias producidas por C. perfringens tipos C y D - Contribuye a la prevención de cuadros entéricos o sistémicos producidos por toxinas de bacterias Gram negativas - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e1e6681441ce4c918a00d56371d5786e~mv2.png",
    "volumeWeight": "60 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1f2e33bf-43de-3e4d-cdf8-00952cb0e72c",
    "title": "Respiratoria Providean Tecnovax 50 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Las enfermedades respiratorias y nerviosas bovinas, también conocidas como ERB, ocasionan enormes pérdidas en las explotaciones ganaderas con brotes generalmente masivos en los animales más jóvenes. Infecciones virales y bacterianas que desencadenan la enfermedad, también pueden generar complicaciones neurológicas y comprometer la viabilidad de la preñez en animales gestantes. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_4c56eacf6d554a989e69a2560f3f5512~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-respiratoria/",
    "price": 0
  },
  {
    "id": "4a809e95-e63e-4dc0-f9f0-7258bda4d31a",
    "title": "Repro 12 Providean Tecnovax 50 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna con 12 antígenos virales y bacterianos para prevenir las principales enfermedades abortigénicas en bovinos - Providean Repro 12, es una vacuna polivalente compuesta por doce antígenos virales y bacterianos para contribuir en la prevención de abortos y fallas reproductivas, de etiología infecciosa, en animales reproductores - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_af30e9dc72714e00a549f5d67ce51723~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-repro-12/",
    "price": 0
  },
  {
    "id": "fbf654f7-ab0e-6d35-9ae3-c1cb41893dac",
    "title": "Reproductiva Providean Tecnovax 50 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Más terneros, con los mismos vientres - Vacuna contra el síndrome reproductivo en bovinos - Más de la mitad de los abortos y fallas reproductivas en bovinos se deben a causas infecciosas - Providean Reproductiva previene infecciones ayudándolo a producir más terneros cada año - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6f2a457b7c7e4c87a0b11c527f0888cb~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-reproductiva/",
    "price": 0
  },
  {
    "id": "c258d94f-4218-ab73-d27a-46843a30bda5",
    "title": "Entero Plus 7 Diarrea Neonatal Providean Tecnovax 50 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Providean Entero Plus 7 es la primera vacuna del mercado que incluye en su fórmula siete antígenos virales y bacterianos para contribuir en la prevención de la DNT. - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_35051f51026045339fc4dd9e6069c7c1~mv2.png",
    "volumeWeight": "50 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-entero-plus-7/",
    "price": 0
  },
  {
    "id": "f1ac55b0-3acd-af41-fe03-f772948a25d6",
    "title": "Clostridial Polivalente 8 Providean Tecnovax 60 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Si conoce las consecuencias de las enfermedades clostridiales, no quiere mancharse nuevamente con ninguna de ellas - Providean Clostridial 8 protege contra la mayor cantidad de clostridios circulantes a campo - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b35861f220e2486880de60e428551498~mv2.png",
    "volumeWeight": "60 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-clostridial-8/",
    "price": 0
  },
  {
    "id": "8c12da37-e8c9-02ea-053a-648971a73482",
    "title": "Carbunclo Providean Tecnovax 125 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna contra el Carbunclo Bacteridiano - El anthrax es una enfermedad mortal causante de enormes pérdidas en la producción animal y una amenaza para el personal del establecimiento - Las bacterias esporuladas tienen la capacidad de permanecer viables por años en el medio ambiente, diseminando la enfermedad - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ddf207e384cd44ccbbea9ba0159eaaae~mv2.png",
    "volumeWeight": "125 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-carbunclo-bacteridiano/",
    "price": 0
  },
  {
    "id": "ef86d1e0-ce0a-8a22-cc6a-616e153d616d",
    "title": "Brucelosis Providean Tecnovax 12 dosis.",
    "laboratory": "Tecnovax",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna liofilizada contra la Brucelosis Bovina - Brucella abortus Cepa 19 - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f70074bd536d4e2a841cf0d108782dce~mv2.png",
    "volumeWeight": "12 dosis.",
    "dose": "",
    "drugs": "",
    "externalLink": "https://tecnovax.com/producto/providean-brucelosis/",
    "price": 0
  },
  {
    "id": "ad1a37c1-bf02-8274-d696-69c8dc63cd60",
    "title": "Jeringa Lider Dial 50c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Jeringa de cuerpo Plástico - Sistema Dial para una simple graduación, garantiza una dosis exacta en cada aplicación.",
    "image": "https://static.wixstatic.com/media/06b954_962c775c6eb44e578511afc748c1320b~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "2af39ded-63e8-7d31-5d55-5adefaf05aa4",
    "title": "Pistola Dosificadora Automática Lider 50c.c.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Pistola Dosificadora Automática de cuerpo metálico y tubo de vidrio - Sistema simple de graduación, garantiza una dosis exacta en cada aplicación.",
    "image": "https://static.wixstatic.com/media/06b954_b7583d01880c4c8faa314279ad6653db~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "0c07dc28-eb53-49f2-6a4d-cb1c7ae9c273",
    "title": "Agujas Hipodérmicas Cono Verde Neojet 100u.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Agujas hipodérmicas Descartables - Estéril (Oxido de Etileno) - Libre de Pirógenos - Atóxica.",
    "image": "https://static.wixstatic.com/media/06b954_1610c2b52ac04e4eb10463c75ce31050~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "0209fa96-dd74-dc1a-fa1d-e16c7859313b",
    "title": "Agujas Hipodérmicas Cono Rosa Neojet 100u.",
    "laboratory": "Jeringas",
    "animalBreeds": [
      "bovino"
    ],
    "description": "Agujas hipodérmicas Descartables - Estéril (Oxido de Etileno) - Libre de Pirógenos - Atóxica.",
    "image": "https://static.wixstatic.com/media/06b954_4ddbfab7d4574c0cb396119dce737f1a~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "a71f39fb-35a2-6a41-f2b5-2d3dd0b334b9",
    "title": "Yodacalcio B12 D Chinfield 500ml.",
    "laboratory": "Chinfield",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento mineral vitamínico indicado cuando se necesite incrementar la provisión de minerales y vitaminas en casos de, hipocalcemia, hipofosfatemia, hipomagnesemia hipotiroidismo, debilidad, paresia puerperal, disminución de fertilidad - Coadyuvante en carencias minerales vitamínicas durante la preñez, lactancia, crecimiento, engorde, convalecencias, pre-parto y pre-servicio, pre y postdestete -",
    "image": "https://static.wixstatic.com/media/06b954_d3c02deb7e3143f4b72b4d5f80acec0f~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Gluconato de calcio",
    "externalLink": "http://www.chinfield.com/vademecum-items/yodacalcio-b12-d-2/",
    "price": 21957.55
  },
  {
    "id": "734d4b11-62ee-e0a4-6853-b6c995309b2b",
    "title": "Vitaminas A-D-E Zoetis 100ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Shock vitamínico inyectable estable listo para usar y absolutamente estéril - Indicado para prevenir o tratar estados carenciales, promover el crecimiento de animales jóvenes, incrementar la producción, mejorar la conversión alimenticia, aumentar el índice de fertilidad, mejorar el rendimiento de reproductores o animales de carrera y como complemento de la medicación destinada a tratar enfermedade",
    "image": "https://static.wixstatic.com/media/06b954_e6b059fd5469404e8ade35979c8717a8~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Vitamina A: 25 millones U",
    "externalLink": "https://ar.zoetis.com/products/vitaminas-a-d-e.aspx",
    "price": 57515
  },
  {
    "id": "76746780-c211-33a4-c951-beb87438b1c7",
    "title": "Suplenut Biogenesis Bago 500ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Es una solución inyectable de Cobre (Cu) y Zinc (Zn), para corregir y evitar las deficiencias de estos microelementos que se manifiestan en los bovinos en vastas zonas del país - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_0ef784e620ec4afd9d876f90ffb08d90~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cobre (como Edetato), 1,5 g",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id93/",
    "price": 0
  },
  {
    "id": "27792182-6b38-5f01-12dc-9713d50d7164",
    "title": "Selfos Plus Agro Insumos 500ml.",
    "laboratory": "Agro Insumos",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Prevención y tratamiento de estados carenciales de Selenio, Fósforo, Vitamina A,D,E, osteomalacia y raquitismo - Reduce el recuento de células somáticas en la leche producida - Aumenta la salud de la ubre - Provoca un significativo aumento de peso ante el perfeccionamiento del anabolismo - Mejora las defensas a infecciones virales y bacterianas - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a22e30944a5e471fa44e78a15f7a3bcb~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Selenito de Sodio0,347 g",
    "externalLink": "http://www.laboratoriosagroinsumos.com/pdf-productos/selfos-plus.pdf",
    "price": 0
  },
  {
    "id": "2397e07c-f4aa-1e78-f8b2-3f652b581e1e",
    "title": "Nutrimin Richmond 530ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento nutricional inyectable - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8f9207fa96914e838a2205ae1eb9bbae~mv2.png",
    "volumeWeight": "530ml.",
    "dose": "",
    "drugs": "Calcio, cloruro: 0,014 g",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=4&amp;id=26&amp;pg=1",
    "price": 29923.2
  },
  {
    "id": "e9f065ae-ef88-e853-12e6-84311fae0333",
    "title": "Magnecal Plus Zinc Agro Insumos 500ml.",
    "laboratory": "Agro Insumos",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Prevención y tratamiento de podopatías originadas por debilitamiento cutáneo - Prevención y/o tratamiento de “Tetania de los avenales” - Coadyuvante en la respuesta a enfermedades infecciosas y prevención de queratoconjuntivitis - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_c2c15f2479f343e5b9d34e47e37f9c43~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Dextronato de Magnesio16,79 g",
    "externalLink": "http://www.laboratoriosagroinsumos.com/pdf-productos/magnecal-zinc.pdf",
    "price": 16797.3
  },
  {
    "id": "474c26ea-0bb2-c569-5d74-a751ec7c21eb",
    "title": "Glypondin 4 Multimineral Konig 500ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento multimineral inyectable - Preventivo y curativo en casos de deficiencias de zinc, cobre, manganeso, y selenio en bovinos - Optimiza la producción, la función reproductiva y el sistema inmune - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_90410d05e1b64ca293f88552240aacb1~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 mL contiene: EDTA disódico Manganeso 7,10 gr",
    "externalLink": "http://www.koniglab.com/producto/glypondin-4-multimineral/",
    "price": 54568.45
  },
  {
    "id": "e45e6bf0-75f7-9d7a-e4a4-7b8598d14cc0",
    "title": "Glypondin Konig 248ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Emulsión de cobre de liberación prolongada para el tratamiento de la hipocuprosis - Tratamiento de estados carenciales de cobre. Curativo y preventivo en zonas de hipocuprosis endémica - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9a2827a780aa460494630477e3667a9a~mv2.png",
    "volumeWeight": "248ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cobre (etileno dinitrilo acetato cálcico cúprico 16,300 g% P/V), equivalente a 25 mg de cobre acti",
    "externalLink": "http://www.koniglab.com/producto/glypondin/",
    "price": 16419.85
  },
  {
    "id": "47df35ae-0f6a-3dfd-8132-b859363c060a",
    "title": "Gluforal M.F. 500 Rosenbusch 500ml.",
    "laboratory": "Rosenbusch",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Mineralizante indicado para el tratamiento de hipocalcemia, hipomagnesemia, hipofosfatemia, tetania y acetonemia en bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_afb0b0d6b5194573a2845e7ccfd69dee~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Calcio gluconato 15 g",
    "externalLink": "http://www.rosenbusch.com/argentina/gprodfarm_vitam.html",
    "price": 0
  },
  {
    "id": "e0c1bc77-47cb-7b54-7b7c-830b167db8ec",
    "title": "Gluconato de Calcio Magnesiado Rosenbusch 250ml.",
    "laboratory": "Rosenbusch",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Calcificante indicado para el tratamiento de hipocalcemias e hipomagnesemias - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_361f83d0b0ac48eab65154f6a7491a16~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Calcio gluconato 50 g",
    "externalLink": "http://www.rosenbusch.com/argentina/gprodfarm_vitam.html",
    "price": 0
  },
  {
    "id": "9eafd42e-ad5b-db58-5cee-925581d297a9",
    "title": "CM22 Von Franken 500ml.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento sindrome de hipocalcemia o hipomagnesemia, fiebre de la leche, tetanias, transportes prolongados, tetanias de los terneros, acetonemias - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9ae137b861b343deb6cab60be6213e5c~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Borogluconato de calcio 22,40 g",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Grandes-Animales_Mineralizantes/C-M-22",
    "price": 18850.75
  },
  {
    "id": "69d66c21-2b04-1dcd-9d39-270b8088ce6e",
    "title": "Acuprin Richmond 500ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Suplemento nutricional corrector de desbalances dependientes de zinc y cobre - Gel de liberación gradual, corrección de desbalances dependientes de Zinc y Cobre. - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6b3f0e91d6ad45edb99db4f6c29a4776~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Etilendiaminotetracetato Cúprico Cálcico: 7,35 g",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=4&amp;id=25&amp;pg=1",
    "price": 27880
  },
  {
    "id": "a74db0ba-dff0-d24c-815b-4195928b5fc9",
    "title": "Receptal MSD 50ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Hormona Gonadotrófica - Hormona liberadora (GnRH) de FSH y LH - Actúa sobre el lóbulo anterior de la hipófisis estimulando la secreción de las gonadotrofinas FSH y LH, que entran al torrente circulatorio periférico - La acción fisiológica de estas hormonas, es estimular la maduración de los folículos, desencadenar la ovulación y la posterior luteinización en el ovario con la formación del cuerpo l",
    "image": "https://static.wixstatic.com/media/06b954_86f2c9b2a4224c2cb13910687e7ab315~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Buserelina, acetato: 0,42 mg",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "91eb248f-aec3-e96a-efb9-5c5634e905a5",
    "title": "Oxiton Ovulos Agropharma 60u.",
    "laboratory": "Agropharma",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico Quimioterápico con enzimas - Ovulos efervescentes - Prevención y tratamiento de los procesos infecciosos de las vías uterinas - Metritis - Endometritis - Retención de placenta - Abortos - Vaginitis - Piómetras - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_9b382ea29caa413fbdda721d5ea48270~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Cada 100 gr contiene: Oxitetraciclina Clorhidrato USP 500 mgr",
    "externalLink": "http://agropharma.net/producto/oxiton-ovulos-2/",
    "price": 0
  },
  {
    "id": "51c205ef-367c-c83d-45c9-698488a4f3b8",
    "title": "Estrumate MSD 20ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Prostaglandina sintética - Sincronización de celos, endometritis crónica purulenta, interrupción de preñez ( aborto o parto) - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bfeb7766374b4e34b4cd0cd543cb795f~mv2.png",
    "volumeWeight": "20ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "92c0c669-2942-87ea-ba88-222149035769",
    "title": "Gestar Over 50ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución lista para usar, que contiene la hormona liberadora de las gonadotrofinas, sintética, que estimula la liberación de FSH (Hormona folículo estimulante) y LH (Hormona luteinizante) - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_f5403c33e375496094cb55d12986d046~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1a235769-ecb3-4ca7-7696-05e17b8e2ff6",
    "title": "CIDR Zoetis 10 Dispositivos Intravaginales.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Dispositivo de aplicación intravaginal a base de progesterona, indicado para la sincronización de servicios y tratamiento del anestro - Depósito de progesterona natural, la cual es liberada y absorbida por la mucosa vaginal, en cantidades suficientes para inhibir la liberación de las hormonas luteinizante (LH) y folículo estimulante (FSH) por la hipófisis frenando la ovulación y consecuente aparic",
    "image": "https://static.wixstatic.com/media/06b954_5defedff6bab4c7b8a6022fe0a2f98b0~mv2.png",
    "volumeWeight": "10 Dispositivos Intravaginales.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "fbd3057e-06c0-f234-1138-139bcf631ca7",
    "title": "Bioprost D 20ml.",
    "laboratory": "Biotay",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Sincronización de celo, uso terapéutico en celos silentes, piómetras por retención de placenta, inducción de partos - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9ec83c3d21ad4bf69df5a1c43e9c9193~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "20ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "75835fbf-59fe-04bf-3b45-8faa60e44210",
    "title": "Viral Querato CDV 250ml.",
    "laboratory": "Queratoconjuntivitis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Preventivo de cuadros respiratorios y oculares producidos por los virus IBR y BVD y Moraxella bovis - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9e50068bd86c404e88a13b743cdf9a02~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.cdv.com.ar/index.php/2015/07/vacuna-anti-viral-querato-doble-emulsion/",
    "price": 0
  },
  {
    "id": "0d89282f-6351-ef82-9c8d-61828672eebf",
    "title": "Tilmicosina 30% Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Formulación antibiótica inyectable destinada al tratamiento de neumonía, queratoconjuntivitis y pietín en bovinos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_d2a3e9a52648417db5e2c7a101d04e62~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Tilmicosina 30 g",
    "externalLink": "http://www.over.com.ar/product/tilmicosina-30/",
    "price": 0
  },
  {
    "id": "dd9536c4-a6b0-3f69-9260-076493c1d360",
    "title": "Pinkeye sin esteroides 120ml.",
    "laboratory": "Queratoconjuntivitis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico bactericida, viricida, antiséptico, anestésico y descongestivo - Su válvula dosificadora vaporiza un micronizado imperceptible para el animal - El agregado de EDTA produce lisis de los tejidos necrosados, para facilitar la acción de sus principios activos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8f5b61106e5247369586d7107fa5cafe~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "120ml.",
    "dose": "",
    "drugs": "Gramicidina 0,0001 g",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "91822dc9-cdb3-cae9-f782-9103bd7aea20",
    "title": "Overtil Forte Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico a base de tilmicosina con el agregado de meloxicam como agente antiinflamatorio - Doble acción antibiótica y antiinflamatoria con una sola dosis - Para el tratamiento de Neumonías, Queratoconjuntivitis y Pietín - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_097fe1f5140e4b5cbe609eea707bf608~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Tilmicosina 30 g",
    "externalLink": "http://www.over.com.ar/product/overtil-forte/",
    "price": 0
  },
  {
    "id": "601d389c-1e6d-0b0a-e0fb-07465d74de11",
    "title": "Gemicin Spray Over 250ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico de amplio espectro destinado al tratamiento y control de infecciones locales provocadas por gérmenes sensibles a la Gentamicina - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b15ae6236e5341ffacab2f6c3984db8d~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Gentamicina 0,30 g",
    "externalLink": "http://www.over.com.ar/product/gemicin-spray/",
    "price": 0
  },
  {
    "id": "e0092898-4b5c-aebd-8353-830d2b923c0c",
    "title": "G1 plus Von Franken 250ml.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Coadyuvante en la prevención y tratamiento de la Queratoconjuntivitis bovina - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_92800adc344b4d8db6413059bb1d8bc5~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Aminoácidos, pool 53,7mg",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Grandes-Animales_Queratoconjuntivitis/G-1-Plus",
    "price": 0
  },
  {
    "id": "6d5cf4d6-eb4a-d0c1-05e6-4772857aebed",
    "title": "BTK 35 Konig 420ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Tópico oftálmico - Curativo y preventivo de la queratoconjuntivitis - Bactericida, fungicida y viricida de acción total - Antiinflamatorio - Rápida desinfección y cicatrización de todo tipo de heridas y quemaduras - Tratamiento específico contra la queratoconjuntivitis - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_dab72c6974fb4ef99200eb5b11f70d23~mv2.png",
    "volumeWeight": "420ml.",
    "dose": "",
    "drugs": "Cada 100 gramos de concentrado: Oxitetraciclina (como clorhidrato) 5,00 gr",
    "externalLink": "http://www.koniglab.com/producto/btk-35/",
    "price": 14380
  },
  {
    "id": "2dfdd011-0ae5-7a0b-1fae-4b2d1719337b",
    "title": "Bioqueratogen Oleo Max Biogenesis Bago 80 dosis 240ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Vacuna para la prevención de la queratoconjuntivitis infecciosa bovina producida por la acción individual o combinada de Herpesvirus bovino, Moraxella bovis y Branhamella ovis - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_26923e640dfa40c5a09b172eaaa04fc2~mv2.png",
    "volumeWeight": "80 dosis 240ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id2/",
    "price": 0
  },
  {
    "id": "7ebd4f2a-3ea4-9189-d69f-b73ee574c5ec",
    "title": "Ineran Richmond 100ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución inyectable acuosa hormonal a base occitocina altamente purificada de uso obstétrico y ginecológico - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_639a6bc8c1f445e8a4815f84f69d10ce~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Occitocina: 10 U",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=30&amp;id=31&amp;pg=1",
    "price": 11914
  },
  {
    "id": "0991042e-3926-964a-aa54-5338c2fe1bf7",
    "title": "Estradiol Over 20ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución oleosa de benzoato de estradiol indicada para el tratamiento de anestros, expulsión de placenta retenida, inducción al celo, tratamiento de falsa preñez - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_dfc7b000568240eb85c5a700043c7b03~mv2.png",
    "volumeWeight": "20ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Benzoato de estradiol 0,25 g",
    "externalLink": "http://www.over.com.ar/product/estradiol-multidosis/",
    "price": 0
  },
  {
    "id": "4b443419-67fd-4856-6b65-870e3128dda8",
    "title": "Iverton L.A. 3.50 500ml.",
    "laboratory": "Agropharma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida de Acción prolongada - Antisárnico - Garrapaticida - Melofagicida - Inyectable - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b650532eed87495e9f8bbcc7e7e17d45~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Ivermectina 3",
    "externalLink": "http://agropharma.net/producto/iverton-l-a-3-50/",
    "price": 0
  },
  {
    "id": "44949893-4059-a17e-db55-acc53a967453",
    "title": "Vermectin LA Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida inyectable de acción prolongada - Garrapaticida - Para el tratamiento y control de parasitosis internas y externas que afectan a los bovinos y ovinos - Para: Bovinos y ovinos .",
    "image": "https://static.wixstatic.com/media/06b954_c3e95519d2994803a33ca21d7c0a5b9a~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Ivermectina al 3",
    "externalLink": "http://www.over.com.ar/product/vermectin-la-premium/",
    "price": 0
  },
  {
    "id": "75b8f957-93e2-05d5-8522-a31bb03e4ac5",
    "title": "Ivomec Gold Boehringer 500ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Ivermectina al 3.15%, de acción prolongada, para el tratamiento y control de los parásitos internos y externos - Puede controlar los parásitos durante un año con dos tratamientos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_cf4e9a0fe125441ca4ce608b6d26696a~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Ivermectina al 3",
    "externalLink": "http://www.merial.com.ar/Producers/Dairy/Products/Pages/products_ivomecgold.aspx",
    "price": 70451
  },
  {
    "id": "e357da9c-8cbe-3b67-ab3b-f684997d8b46",
    "title": "Flok Biogenesis Bago 500ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo altamente efectivo para el control y tratamiento de los parásitos gastrointestinales y pulmonares, sarna, miasis y garrapatas - Solución inyectable de Doramectina al 1,1% listo para usar - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_5c87f07dea934cb287e843b3cfacded7~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Doramectina 1,1 g",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id75/",
    "price": 0
  },
  {
    "id": "ac2ce9ae-df39-5bb6-21e6-ee6c0bed7de6",
    "title": "Dovertec Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Solución comprobada para el problema de la miasis (bicheras) - Amplio espectro de acción contra parásitos internos y externos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_48a8d4b1ba0346d2aab3b9ef86862b25~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Doramectina 1 g",
    "externalLink": "http://www.over.com.ar/product/dovertec/",
    "price": 0
  },
  {
    "id": "61f7cc39-3774-dd2e-025a-c7a143785e27",
    "title": "Dectomax Zoetis 500ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Endectocida inyectable de amplio espectro y larga persistencia - Parasiticida de amplio espectro y larga persistencia que actúa sobre los parásitos internos y externos de importancia económica - Posee además una indicación de ayuda al control de la Mosca de los Cuernos- Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_d0ed14ef590347379f36cbf05578f872~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Doramectina: 1 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/dectomax.aspx",
    "price": 120628
  },
  {
    "id": "b474b8a7-b112-3500-4337-d56eb755d7e6",
    "title": "Bagomectina Biogenesis Bago 500ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo - combate los parásitos gastrointestinales, pulmonares, sarna, piojos, ura y miasis - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_389fadd1d38242a4ac35e766c576b6ca~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Ivermectina 1 g",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id71/",
    "price": 0
  },
  {
    "id": "15b63963-0667-1d7a-acaa-eb2732ec4035",
    "title": "Ivomec Boehringer 1l.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo - Control efectivo y prolongado de los parásitos gastrointestinales adultos y juveniles, pulmonares, ura, piojos y ácaros de la sarna - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_8a0b5d1969404f4baca106b5f7b764d9~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Ivermectina al 1%",
    "externalLink": "http://www.merial.com.ar/Producers/Feedlot/Products/Pages/products_ivomec.aspx",
    "price": 89936
  },
  {
    "id": "a9ecb8cd-164d-273a-0301-2ac51d53d200",
    "title": "Ivomec Boehringer 500ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo - Control efectivo y prolongado de los parásitos gastrointestinales adultos y juveniles, pulmonares, ura, piojos y ácaros de la sarna - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_17f7bf16c8ac48668226bab2bc56e4d4~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Ivermectina al 1%",
    "externalLink": "http://www.merial.com.ar/Producers/Feedlot/Products/Pages/products_ivomec.aspx",
    "price": 51975
  },
  {
    "id": "69dddf60-60cb-9dfb-d31d-cb4d687d0ecb",
    "title": "Ivomec F Boehringer 500ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario - Controla una amplia gama de parásitos gastrointestinales, trematodes hepáticos, ura, piojos y ácaros de la sarna - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9c0f7509aca84ac88dd143b968c85217~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Clorsulon al 1%",
    "externalLink": "http://www.merial.com.ar/Producers/Dairy/Products/Pages/products_ivomec_f.aspx",
    "price": 158355
  },
  {
    "id": "03edab01-17ab-0fd2-50bc-8a067b71b62f",
    "title": "Meltra Brouwer 1l.",
    "laboratory": "Brouwer",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo e interno - Endectocida para tratamiento de parasitosis gastrointestinales, ura, miasis, piojos y acaros de la sarna - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a520a80e319c40de9d065a19a8aca62a~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Ivermectina 1,0 g",
    "externalLink": "http://brouwer.com.ar/productos/meltra-endectocida/",
    "price": 0
  },
  {
    "id": "d8960ee8-5381-631b-83f2-8f3fc943e53c",
    "title": "Cydectin Alfa Zoetis 500ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Solución antiparasitaria endectocida inyectable - Endectocida para tratamiento de parasitosis gastrointestinales, pulmonares, piojos y sarna - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_63de065c1cda485aba71511d510b3579~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Moxidectin: 1,05 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/cydectin-solucion-inyectable-al-1-para-ganado-ovino.aspx",
    "price": 108570
  },
  {
    "id": "38bd64d3-9b29-a7fb-2310-0d1d7d730ade",
    "title": "Bovicine Richmond 500ml.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Solución antiparasitaria endectocida inyectable - Es conocido por su potente acción parasiticida y amplio espectro, tanto contra los parásitos internos (Ascaris suum, Hiostrongylus rubidus, Strongylloides ransomi, Metastrongylus spp), como externos (sarna, piojos y otros ácaros e insectos) - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_89eea3bdd23c4997931875280898abe1~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Ivermectina: 1 g",
    "externalLink": "http://www.richmondvet.com.ar/?seccion=productos&amp;sub=1&amp;cat=3&amp;id=16&amp;pg=1",
    "price": 16894
  },
  {
    "id": "4453c96e-a906-c795-78fc-425612e9d9b2",
    "title": "Bagomectina AD3E Biogenesis Bago 500ml.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno y externo para bovinos y ovinos - Garrapaticida bovino - Antisárnico ovino - Solución oleosa inyectable de Ivermectina 3.15% vitaminizada - Su acción antiparasitaria se complementa con una balanceada composición de tres vitaminas liposolubles indispensables para el crecimiento, desarrollo y reproducción del ganado - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_688b902e92834e49b5d512edef8d5622~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Ivermectina 3",
    "externalLink": "http://www.biogenesisbago.com/ar/productos/id73/",
    "price": 0
  },
  {
    "id": "c7ade09c-c185-6919-9d7e-ca2749d28acd",
    "title": "Synect Premium Over 5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario externo Pour-on - Formulación a base de Cipermetrina y Carbaril, con Butóxido de Piperonilo como sinergizante, en vehículo oleoso - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_990c806b34fe4ecf91398743764730c9~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cipermetrina 5,00 gCarbaril 2,00 g",
    "externalLink": "http://www.over.com.ar/product/synect-premium-pour-on/",
    "price": 0
  },
  {
    "id": "63844f3a-f3fe-697c-6aa7-f9880941014b",
    "title": "Synect Premium Over 1l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario externo Pour-on - Formulación a base de Cipermetrina y Carbaril, con Butóxido de Piperonilo como sinergizante, en vehículo oleoso - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f46d273e8aa1458591e4f920c6f69107~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cipermetrina 5,00 gCarbaril 2,00 g",
    "externalLink": "http://www.over.com.ar/product/synect-premium-pour-on/",
    "price": 0
  },
  {
    "id": "044e909d-2006-0221-f7c9-e7dfcea9558a",
    "title": "Derramin Pour-on Brouwer 5l.",
    "laboratory": "Brouwer",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario externo Pour-on - Antiparasitario externo de aplicación pour on, para el control de la mosca de los cuernos, piojos, ácaros y repelente de insectos - Es eficaz contra la mosca de los cuernos - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f87dae31892c440abdbe86540e131288~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cipermetrina 5,00 g",
    "externalLink": "http://brouwer.com.ar/productos/derramin-nf-pour-on/",
    "price": 0
  },
  {
    "id": "5d1da36b-db32-a7bf-6245-71b6ea16ec9c",
    "title": "Mosktion Over 5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo Pour-on - Indicado para el control y tratamiento de infestaciones producidas por H. Irritans (Mosca de los Cuernos), para moscas sensibles y resistentes a piretroides - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_20d5ee0dc49541dc8ccfacacb0a13824~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cipermetrina 5,00 g",
    "externalLink": "http://www.over.com.ar/product/mos-k-tion-pf/",
    "price": 0
  },
  {
    "id": "d82d4a61-31f0-a9a6-4eef-7be9ade8f5db",
    "title": "Mosktion Over 1l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo Pour-on - Indicado para el control y tratamiento de infestaciones producidas por H. Irritans (Mosca de los Cuernos), para moscas sensibles y resistentes a piretroides - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_b703f095eca448b58147835a8100ed2c~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Cipermetrina 5,00 g",
    "externalLink": "http://www.over.com.ar/product/mos-k-tion-pf/",
    "price": 0
  },
  {
    "id": "5132b951-ea7b-b3ae-d8ed-bc42f8a64d6e",
    "title": "Ectoline Boehringer 5l.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario Pour-on - Control de la mosca de los cuernos, garrapata, ura, piojos masticadores, chupadores y bicheras - Alta eficacia contra cepas de mosca de los cuernos y garrapata resistentes a piretroides y fosforados - La nueva molécula (fipronil) que controla ectoparásitos mejor y por más tiempo - Menos estrés por menos movimientos y baños - Más ganancia de peso - Seguridad para el animal",
    "image": "https://static.wixstatic.com/media/06b954_efdf4dc46e104e1fb37ba590db91065f~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Fipronil al 1%",
    "externalLink": "http://www.merial.com.ar/Producers/Feedlot/Products/Pages/products_ectoline.aspx",
    "price": 264625.1
  },
  {
    "id": "bde9d601-2b69-03b0-043c-5082ab311dff",
    "title": "OverZOL 10Co Over 5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno de uso oral o intrarruminal en bovinos - Suspensión acuosa lista para usar de Albendazol al 10% con el agregado de Sulfato de cobalto - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_df525a74b16647ba8aa2ab7c354d6443~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Albendazol 10 g",
    "externalLink": "http://www.over.com.ar/product/albendazol-overzol-10-co/",
    "price": 0
  },
  {
    "id": "e2d7aadc-7492-c126-c91b-1a53fd108fc7",
    "title": "Eleval con minerales Over 2.5l.",
    "laboratory": "Over",
    "animalBreeds": [
      "ovino"
    ],
    "description": "Antiparasitario interno para ovinos con minerales - Para: Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ed854c04465446a899a016e50febee88~mv2.png",
    "volumeWeight": "2.5l.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Albendazol 2,500 g",
    "externalLink": "http://www.over.com.ar/product/eleval-ovinos-con-minerales/",
    "price": 0
  },
  {
    "id": "8de25d57-a14b-7649-a032-c7ea9358a361",
    "title": "Cyverm Intraruminal Zoetis 2.5l.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Discontinuado. Antihelmintico intraruminal - Tratamiento y control de parásitos gastrointestinales y pulmonares - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1a84509ac8874370a69043be2529af50~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "2.5l.",
    "dose": "",
    "drugs": "Fenbendazol 20% Animales: Bovinos",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "d2fde6c7-b08f-be08-7deb-e83106f1412f",
    "title": "Cyverm F-10 Zoetis 5l.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Discontinuado. Alternativa Bifetacel https://www.camponuevosrl.com/product-page/bifetacel-10-co-se-microsules-5l . Antiparasitario Oral - Antihelmintico oral - Tratamiento y control de parásitos gastrointestinales, pulmonares y de tenias - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_a98510e6ba17414cac71e5bf697cc2ce~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Fenbendazol 10% Indicaciones: El producto está indicado para control de nematodes gastrointestinales y pulmonares, actúa",
    "externalLink": "https://ar.zoetis.com/products/bovinos/cyverm-f-10.aspx",
    "price": 0
  },
  {
    "id": "3526410e-a147-e90d-f481-d1d4dd58f4b1",
    "title": "Biofasiolex T10 Biogenesis Bago 2.5l.",
    "laboratory": "Biogenesis Bago",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Saguaypicida - Suspensión oral para bovinos - Tratamiento y control de fascioliasis hepática (Saguaypé) - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e98334ba4c114424a4e0e461e57a19be~mv2.png",
    "volumeWeight": "2.5l.",
    "dose": "",
    "drugs": "Triclabendazol 10 g",
    "externalLink": "http://www.biogenesisbago.com/mx/productos/id228/",
    "price": 0
  },
  {
    "id": "150af773-3384-b08a-2fa5-2c9e6348605d",
    "title": "Ricomax con minerales Over 500ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno - Solución inyectable lista para usar de Ricobendazol al 15% con elementos minerales que previenen y corrigen su carencia, favoreciendo rápidamente la recuperación de los animales tratados - Contiene lidocaína para evitar el dolor en el sitio de inyección - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_17259c5bef93477d86c861128e36b97d~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Ricobendazol(Sulfóxido de Albendazol) 15,00 g",
    "externalLink": "http://www.over.com.ar/product/ricomax-con-minerales/",
    "price": 0
  },
  {
    "id": "226c2aa8-cfd6-938a-bf6a-7eea24fee2da",
    "title": "Ricobendazol 15% Mivet 1lt.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno para bovinos de amplio espectro y triple acción - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_33986a1af8b5485983406e5a69a0a71d~mv2.png",
    "volumeWeight": "1lt.",
    "dose": "",
    "drugs": "Ricobendazole15,0 grs",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/parasules-forte/",
    "price": 46342.95
  },
  {
    "id": "1dd6f45b-08a7-9517-113e-75d09d78a6ee",
    "title": "Levamic Fosfato Mivet 500ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario interno - Para el tratamiento y control de nematodes gastrointestinales y pulmonares - Para: Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_9961055a72e646d7aed62bcac8534cec~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Levamisol fosfato 22,3 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/levamic-fosfato/",
    "price": 29011.1
  },
  {
    "id": "759f3feb-7d78-8762-3df1-e681501a8f53",
    "title": "Axilur PI Inyectable MSD 1l.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario Interno con efecto vermicida, larvicida y ovicida en las Parasitosis Internas - Actúa con efecto vermicida, larvicida y ovicida en las parasitosis internas de los bovinos - Biodisponibilidad: El ricobendazol es el metabolito activo del albendazol - Cuando se administra albendazol a un animal, inmediatamente después de la absorción, es rápida y extensamente metabolizado a ricobendaz",
    "image": "https://static.wixstatic.com/media/06b954_08a877c62ad94641821d6abbc8b70492~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "Ricobendazol (Albendazole, sulfoxido): 15 g",
    "externalLink": "http://www.msd-salud-animal.com.ar/products/112_141308/productdetails_112_141392.aspx",
    "price": 0
  },
  {
    "id": "3f0154fe-3898-b874-7209-4f7ab11879f5",
    "title": "Fort Dodge Spray Curabichera Zoetis 500ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Matabicheras Fort Dodge es un moderno larvicida, repelente y cicatrizante, formulado a base de Vapona y Supona, dos productos insecticidas fosforados y Violeta de Genciana, quimioterapéutico y cicatrizante - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_510b6e8721694e9c95633ff39539a160~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Clorfenvinfos: 0,52 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/matabichera-fd.aspx",
    "price": 0
  },
  {
    "id": "90793bfb-9fb6-f368-21ca-05f116f216e3",
    "title": "Ectoline Spray Curabichera Boehringer 440ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Producto spray, para uso externo (tópico), larvicida, cicatrizante y antimicrobiano indicado para la prevención y control de miasis o gusaneras causadas por larvas - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_4313fb7ef72845438c613b472c89f4d9~mv2.png",
    "volumeWeight": "440ml.",
    "dose": "",
    "drugs": "Cada 100 ml",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "1cbed9f6-6a71-1fc3-b403-71d783c96279",
    "title": "Bactrovet Plata AM Spray Curabichera Konig 440ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Curabichera cicatrizante hemostático de alta adherencia - Cicatrizante, antimiásico, repelente, antimicrobiano, epitelizador y hemostático de alta adherencia de uso tópico - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_eb4ca5928d654185b17379a49251daca~mv2.png",
    "volumeWeight": "440ml.",
    "dose": "",
    "drugs": "Cada 100 gramos de concentrado contiene: Sulfadiazina de Plata 0,1 gr",
    "externalLink": "http://www.koniglab.com/producto/bactrovet-plata-am/",
    "price": 6490
  },
  {
    "id": "d01ceb2c-20f8-8c4f-7809-3985a632b2d5",
    "title": "Curabichera Pomada Cacique MSD 950gr.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antiparasitario externo - Pasta Curabicheras conteniendo Cipermetrina y Acido salicílico como ingredientes activos junto con otros agentes (inertes) de formulación, para ser aplicado directamente en la zona afectada del animal. - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_8d927faceaf943fda70427de033b85cc~mv2.png",
    "volumeWeight": "950gr.",
    "dose": "",
    "drugs": "Cipermetrina 3,00 g",
    "externalLink": "http://www.msd-salud-animal.com.ar/products/112_141324/productdetails_112_141440.aspx",
    "price": 0
  },
  {
    "id": "17f1fe79-a55b-8f62-32fd-7971d071f9cc",
    "title": "Curabicheras DKL5 Von Franken 1l.",
    "laboratory": "Von Franken",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Curabicheras líquido - Tratamiento y prevención de miasis, en todo tipo de heridas accidentales y quirúrgicas, descorne, señalada, marcación, descole, esquila, castración, y tratamiento del ombligo de los recién nacidos - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_45663d004bf84c75bf32d5565aadeb81~mv2.png",
    "volumeWeight": "1l.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.fatrovonfranken.com/Productos/Grandes-Animales_Antiparasitarios-Externos/Dkl-5",
    "price": 24216.85
  },
  {
    "id": "d3484ae2-02db-f8a7-7e42-de68dac219ac",
    "title": "Curabicheras Coopers MSD 1lt.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Curabicheras líquido - Larvicida externo. Antimiásico. Mata gusanos y protege contra la reinfestación - Para: Bovinos, Ovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_9d113041ee384759b04d147acf20afc0~mv2.png",
    "volumeWeight": "1lt.",
    "dose": "",
    "drugs": "Cipermetrina: 0,3 g",
    "externalLink": "http://www.msd-salud-animal.com.ar/products/curabichera-liquido/productdetails-curabichera-liquido.aspx",
    "price": 0
  },
  {
    "id": "e16a96ad-f3b7-15cf-e85d-5debdf04162a",
    "title": "Butox Garrapaticida MSD 5l.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antiparasitario externo por inmersión - Garrapaticida, la deltametrina, es el único piretroide que en formulaciones comerciales presenta un solo isómero lo cual garantiza su efectividad absoluta, brindándole mayor potencia, residualidad, seguridad y amplio espectro de acción - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_575014034a8b4c7fb0c8922af8e67c70~mv2.png",
    "volumeWeight": "5l.",
    "dose": "",
    "drugs": "Deltametrina: 3 g",
    "externalLink": "http://www.msd-salud-animal.com.ar/products/112_141321/productdetails_112_141431.aspx",
    "price": 0
  },
  {
    "id": "cc748271-bb6b-eb2f-53fc-b78d8618330e",
    "title": "Terramicina LA Zoetis 500ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable de larga acción - Antibiótico de amplio espectro, eficaz contra bacterias, Mycoplasmas y protozoos de importancia en Medicina veterinaria - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_3ebea63aeed34121b0f29784211eaed2~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Oxitetraciclina: 20 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/terramicina-la.aspx",
    "price": 135608
  },
  {
    "id": "fd20f65c-c2d7-e135-71b9-5b7c96c91aee",
    "title": "Terramicina Solución Zoetis 500ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución de Clorhidrato de Oxitetraciclina en Propilenglicol - Antibiótico de amplio espectro, eficaz contra bacterias, Mycoplasmas y protozoos de importancia en Medicina veterinaria - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_f6335c11ed0e465d955888eda50738a1~mv2.png",
    "volumeWeight": "500ml.",
    "dose": "",
    "drugs": "Oxitetraciclina: 5 g",
    "externalLink": "https://ar.zoetis.com/products/terramicina_100_solucion_inyectable.aspx",
    "price": 62138
  },
  {
    "id": "005fc8b4-9211-874f-e2fc-ce358383bfb5",
    "title": "Tetraciclina C InmunoVet 200 capsulas.",
    "laboratory": "Varios",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico vitaminado de amplio espectro - Para: Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_4f0c2bc11616456f8492f9189333dd3a~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Sulfametoxazol",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "b417939d-cf2c-039b-e9b8-8671bd454ffb",
    "title": "Oversulf ADI Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico bactericida y antidiarreico - Endovenosa para equinos y subcutánea o intramuscular para el resto de las especies. - Para: Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f70a57ea51274fbc8ec73892585190c0~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Trimetropina 2gr",
    "externalLink": "http://www.over.com.ar/product/oversulf-adi/",
    "price": 0
  },
  {
    "id": "a7cc4bdf-186f-0d27-9b89-cc3486122fe8",
    "title": "Overbiotic Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Overbiotic Antidiarreico Inyectable asocia en su fórmula un depresor de la motilidad intestinal (loperamida) y un antibiótico de amplio espectro (oxitetraciclina), lo que constituye una eficaz combinación para el tratamiento de diarreas por causas infecciosas en general - Aplicación subcutánea e intramuscular - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_abd04f30172e473497397181d506b8d1~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Loperamida Clorhidrato 0,04 %",
    "externalLink": "http://www.over.com.ar/product/overbiotic-antidiarreico-inyectable/",
    "price": 0
  },
  {
    "id": "591133e9-f464-a6a9-4c66-a965e56abe13",
    "title": "Diafin N Konig frasco x 20ml.",
    "laboratory": "Konig",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico y antidiarreico modulador de la motilidad intestinal e inyectable - Una sola aplicación pone fin a la diarrea - Elimina las enterobacterias patógenas - Para: Bovinos, Equinos, Porcinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_31e83de5a2184b4b8f3cb4a8bb51f158~mv2.png",
    "volumeWeight": "20ml.",
    "dose": "",
    "drugs": "Cada 100 mL contiene: Clorhidrato de Bencetimida 0,0165 gr",
    "externalLink": "http://www.koniglab.com/producto/diafin-n/",
    "price": 9935.35
  },
  {
    "id": "205df77d-1ce7-a7de-2bf8-4ffb436ccd4d",
    "title": "Vermectín B12 Over 1 dosis.",
    "laboratory": "Over",
    "animalBreeds": [
      "equino"
    ],
    "description": "Antiparasitario interno de amplio espectro - Ivermectina al 1% con Vitamina B12 como factor antianémico - Para: Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_7d47da42bcae40b09cb9f44daf2b7444~mv2.png",
    "volumeWeight": "1 dosis.",
    "dose": "",
    "drugs": "Cada 100 g contiene: Ivermectina 1,00 g Vitamina B12 0,05 g Agentes de Formulación c",
    "externalLink": "http://www.over.com.ar/product/vermectin-b12-equinos/",
    "price": 0
  },
  {
    "id": "7fa66422-d995-52f0-2bb0-921f0bb1e9ce",
    "title": "Eqvalan Pasta Boehringer Jeringa 1 dosis.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "equino"
    ],
    "description": "Antiparasitario interno-oral - Controla parásitos gastrointestinales, gastrófilos, pulmonares y cutáneos - Para: Equinos de cualquier edad, incluyendo yeguas preñadas y caballos reproductores.",
    "image": "https://static.wixstatic.com/media/06b954_6297b7e0b0dc47eca842660bc96b716d~mv2.png",
    "volumeWeight": "1 dosis.",
    "dose": "",
    "drugs": "Ivermectina 1,87% Indicaciones: Con una sola dosis, controla parásitos gastrointestinales, gastrófilos, pulmonares y cut",
    "externalLink": "http://www.merial.com.ar/Equine/Products/Pages/products_eqvalan.aspx",
    "price": 0
  },
  {
    "id": "58a55470-2bbc-d291-3213-32838b93e3ce",
    "title": "Equiverm Richmond 3 Dosis.",
    "laboratory": "Richmond",
    "animalBreeds": [
      "equino"
    ],
    "description": "Gel de administración oral - Antiparasitario endectocida de real amplio espectro contra gusanos chatos y redondos - Para Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_44456035dec64ce1a61e4225f3ee8feb~mv2.png",
    "volumeWeight": "3 Dosis.",
    "dose": "",
    "drugs": "Vermectina: 2 g",
    "externalLink": "http://richmondvet.com.ar/?seccion=productos&amp;sub=4&amp;cat=17",
    "price": 9720
  },
  {
    "id": "7c3a94dd-4d71-728e-d94b-95eeb59febb7",
    "title": "Planipart Boehringer Ingelheim 50ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "ALTERNATIVA: https://www.camponuevosrl.com/product-page/dila-t-vetue-100ml Solución Inyectable - Supresor de las contraciones uterinas, facilitando el parto - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_00c66bea647a42e1a47ce87dcd62f41e~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Clenbuterol, clorhidrato 3 mg",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "9f4dc570-ab32-7668-ff50-5562694677fd",
    "title": "Overbiotic DUO L.A. Over 250ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico Antiinflamatorio Inyectable - Terapia combinada de antibiótico con antiinflamatorio para el tratamiento de enfermedades específicas o inespecíficas provocadas por gérmenes susceptibles a la oxitetraciclina - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ba6f3d128e804e489aa8318924d75e28~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Oxitetraciclina clorhidrato: 20,00 g",
    "externalLink": "http://www.over.com.ar/product/overbiotic-duo/",
    "price": 0
  },
  {
    "id": "be1baa35-639e-cba2-7171-adb745542469",
    "title": "Ketofen 10% Boehringer 50ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución Inyectable - Antiinflamatorio no esteroide, antiálgico y antipirético para tratamiento de afecciones respiratorias, músculo-esqueléticas, edemas mamarios, mastitis agudas, cólicos, artrosis, esparaván, enfermedad del navicular, tendinitis, bursitis, infosuras, miositis, inflamaciones post-quirúrgicas, tratamientos sintomáticos de los estados febriles - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_f025152edcd940be85385b39dac24e65~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Ketoprofeno 10% Animales: Bovinos - Equinos",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "7bf1c202-7020-4388-4dff-33b20731185f",
    "title": "Flumeg Over 25ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución Inyectable - Antiinflamatorio no esteroide y analgésico - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_544a0e641cc24863ac9c49ea67c1fe12~mv2.png",
    "volumeWeight": "25ml.",
    "dose": "",
    "drugs": "Flunixin meglumina 5% Animales: Bovinos - Equinos",
    "externalLink": "http://www.over.com.ar/product/flumeg/",
    "price": 0
  },
  {
    "id": "2c43fcaf-152a-4f65-17d8-54b807be7450",
    "title": "Dexametasona Over 12 frascos x 10ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Corticosteroide, Antialérgico y Antiflogístico. - Para bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_6089c27809684cd9b35c933405a5556b~mv2.png",
    "volumeWeight": "10ml.",
    "dose": "",
    "drugs": "Cada 100 ml contiene: Dexametasona 21 fosfato 200 mg Agentes de Formulación c",
    "externalLink": "http://www.over.com.ar/product/dexametasona/",
    "price": 0
  },
  {
    "id": "37d34a3c-7c6d-ab62-e13b-9943495ad9f8",
    "title": "Banamine MSD 50ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Anitiinflamatorio no esteroide antipirético, antiendotóxico y analgésico - Para bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_16d5ef8a6b184c54a6e4407bd7306c75~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Meglumina de Flunixin 50 mg/ml",
    "externalLink": "http://www.msd-salud-animal.com.ar/products/banamine/productdetails-banamine.aspx",
    "price": 0
  },
  {
    "id": "4d7a711c-0f4f-b86e-d35b-167153197b1b",
    "title": "Tylan 200 Elanco 250ml.",
    "laboratory": "Elanco",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable - Alcanza concentraciones en tejidos de 5 a 7 veces superiores a las que se obtienen en sangre - Trabaja en conjunto con el sistema inmunológico del animal, para problemas respiratorios, reproductivos y de patas - Atraviesa membranas lipídicas - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7ac029811198468da6ea5ce80456c813~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Tilosina 200mg",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "5e425e49-1f96-9d01-46a4-c1875db1592e",
    "title": "Terramicina LA Zoetis 250ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable de larga acción - Antibiótico de amplio espectro, eficaz contra bacterias, Mycoplasmas y protozoos de importancia en Medicina veterinaria - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_1aebca0e096946fab0f08a6899aa8d55~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Oxitetraciclina: 20 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/terramicina-la.aspx",
    "price": 76426
  },
  {
    "id": "2f04ddd8-aec2-1107-b575-741b03e59cc1",
    "title": "Terramicina Solución Zoetis 250ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Solución de Clorhidrato de Oxitetraciclina en Propilenglicol - Antibiótico de amplio espectro, eficaz contra bacterias, Mycoplasmas y protozoos de importancia en Medicina veterinaria - Para Bovinos y Equinos.",
    "image": "https://static.wixstatic.com/media/06b954_53b57a593eab4290a235e180c8ae518c~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Oxitetraciclina: 5 g",
    "externalLink": "https://ar.zoetis.com/products/terramicina_100_solucion_inyectable.aspx",
    "price": 36166
  },
  {
    "id": "6aeb8d6a-0982-80b5-b2c4-d75d0c2bfa83",
    "title": "Taiker 200 Biotay 250ml.",
    "laboratory": "Biotay",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable - Aplicado para el tratamiento de Mastitis agudas, Pietín, Endometritis, Neumonías, abscesos por Estaÿlococos y otras infecciones generadas por microorganismos sensibles a la tilosina - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e4de5ba60cc0483494aaf979c666c90d~mv2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Tartrato de Tilosina al 20 %",
    "externalLink": "http://biotay.com/productos/taiker-200/",
    "price": 0
  },
  {
    "id": "0c4bfb9b-2f90-7c8a-e645-28d0615fda7e",
    "title": "Raxidal MSD 50ml.",
    "laboratory": "MSD",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Es la asociación de 2 antibióticos complementarios y sinérgicos, la espiramicina y la estreptomicina, listo para preparar una solución inyectable en proporciones que le permiten alcanzar, a las dosis indicadas, altos niveles terapéuticos de ambos antibióticos - Actividad antibiótica: La espiramicina posee efectiva actividad bactericida y bacteriostática sobre gérmenes Gram positivos, Estreptococos",
    "image": "https://static.wixstatic.com/media/06b954_ee3a596b122c4817aa149ba19bd70e29~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://www.msd-salud-animal.com.ar/products/112_141379/productdetails_112_141623.aspx",
    "price": 34232.45
  },
  {
    "id": "98fc015f-d387-691b-86ff-534b6676a247",
    "title": "Pentabiotico Zoetis 24 Ampollas.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico inyectable - El producto logra niveles altos e inmediatos de penicilinas en suero - Con el agregado de Estreptomicina y Dihidroestreptomicina, se amplía el espectro de acción ya que actúan contra gérmenes gram negativos - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_3a5fe5934ece439cbe09d0ef9be11b15~mv2.png;06b954_bc2288c27d2441eeaab6c7e79292ee61~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Penicilinas (benzatínica, potásica, procaínica): 400",
    "externalLink": "https://ar.zoetis.com/products/pentabiotico-reforzado-24-fr.aspx",
    "price": 217656
  },
  {
    "id": "787c8b6a-8859-2d6d-2f31-b46a2fc1d1e9",
    "title": "Oxitetraciclina 20% LA Mivet 250ml.",
    "laboratory": "Microsules/ Mivet",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiotico Inyectable de amplio espectro - Promover una acción prolongada y sostenida en el control y tratamiento de cuadros infecciosos causados por gérmenes, ciertos hongos patógenos o protozoarios - Para Bovinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_87d34d77ede14c489ace80e88fbe1654~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "250ml.",
    "dose": "",
    "drugs": "Cada ml contiene: Oxitetraciclina (clorhidrato) 20 g",
    "externalLink": "http://www.laboratoriosmicrosules.com/producto/oximic-20-la/",
    "price": 0
  },
  {
    "id": "e252ad0f-a8a2-a3ae-a944-5078788a214f",
    "title": "Micotil 300 Elanco 100ml.",
    "laboratory": "Elanco",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico Inyectable - Solución Inyectable exclusivamente subcutánea en bovinos - Tratamiento sintomático y específico de afeciones broncopulmonares agudas causadas por agentes sensibles a la oxitetraciclina - Tratamiento de la Queratoconjuntivitis infecciosa bovina relacionada con sepas suceptibles de moraxella bovis - Para: Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_ee460d4b751b4347b29cc29691b7d719~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Cada ml contiene: Fosfato de tilmicosina 300 mg",
    "externalLink": "https://www.viarural.com.ar/viarural.com.ar/insumosagropecuarios/ganaderos/laboratorio-vet/elanco/micotil-300.htm",
    "price": 0
  },
  {
    "id": "7ed27bca-dc3f-f984-e05a-8095915523d8",
    "title": "Genabil Boehringer Ingelheim 100ml.",
    "laboratory": "Boehringer Ingelheim",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "Antibiótico Inyectable - Estimulante de secreción de las glándulas digestivas superior, para el tratamiento de desequilibrios nutricionales - Hipersecretor Hepático, Gástrico y Pancreático - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_85c29723f45c45f0bc3386739da5f6e4~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Icteryl o ácido genabílico 100 mg",
    "externalLink": "",
    "price": 0
  },
  {
    "id": "9251453a-cc5a-a556-7c77-7c0e8601ffaa",
    "title": "Penicilina Estreptomicina Over 6 Aplicaciones.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino",
      "equino"
    ],
    "description": "CONSULTAR PRECIO. Asociación antibiótica sinérgica de amplio espectro bactericida - Analgésico - Antitérmico - Solución Inyectable Intramuscular - Para Bovinos, Equinos y Ovinos.",
    "image": "https://static.wixstatic.com/media/06b954_e207d23265914018aa5173d954b5663b~mv2.png",
    "volumeWeight": "",
    "dose": "",
    "drugs": "Cada frasco con polvo contiene: Penicilina G Sódica 2",
    "externalLink": "https://over.com.ar/product/penicilina-estreptomicina/",
    "price": 0
  },
  {
    "id": "c1f3b9ea-1bb8-ef46-1e23-f9b9fdefe3a8",
    "title": "Draxxin Zoetis 50ml.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico Inyectable en solución lista para usar en bovinos a base tulatromicina es un novedoso antibiótico - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_f87dcce27edd412295f9ec953e17476b~mv2.png",
    "volumeWeight": "50ml.",
    "dose": "",
    "drugs": "Tulatromicina 10 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/draxxin-bovino.aspx",
    "price": 0
  },
  {
    "id": "56d202d3-039e-07c9-b8a0-ed595a946dbd",
    "title": "Cumetyl 300 Agropharma 100ml.",
    "laboratory": "Agropharma",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Tratamiento de enfermedades respiratorias de los bovinos (ERB), especialmente las asociadas con Pasteurella haemolytica y multocida y otros microorganismos sensibles a la tilmicosina - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bedf3d6e8e79496caa97883ae8debe5f~mv2_d_4896_3264_s_4_2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "",
    "externalLink": "http://agropharma.net/producto/cumetyl-300/",
    "price": 0
  },
  {
    "id": "4a147a89-091b-faeb-9ebb-1d1779a4853f",
    "title": "Ceftiofur L.P.U. Over 100ml.",
    "laboratory": "Over",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibiótico inyectable de amplio espectro (Ceftiofur al 5%) - Sin restricciones en leche - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_7375d86ed8254423a68a28c321fd9783~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Ceftiofur 5g",
    "externalLink": "http://www.over.com.ar/en/product/ceftiofur-l-p-u/",
    "price": 0
  },
  {
    "id": "6705d170-a07e-720f-e8e1-0e61344826c3",
    "title": "Baytril Max Bayer 100ml.",
    "laboratory": "Bayer",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Antibacteriano de dosis única - Solución Inyectable - Para Bovinos.",
    "image": "https://static.wixstatic.com/media/06b954_bbbbacc3b6ae4117a9d127401b358cd8~mv2.png",
    "volumeWeight": "100ml.",
    "dose": "",
    "drugs": "Enrofloxacina al 10%",
    "externalLink": "https://andina.bayer.com/es/productos/salud/animal-health/baytril-max-.php",
    "price": 0
  },
  {
    "id": "81f0cc3f-206d-e63b-99b8-f3adeb2323da",
    "title": "Clavamox LC Zoetis 12 Jeringas 3gr.",
    "laboratory": "Zoetis",
    "animalBreeds": [
      "bovino",
      "ovino"
    ],
    "description": "Combinación antibiótica y antiinflamatoria para uso intramamario para vacas en lactancia - Bactericida de amplio espectro, el cual actúa sobre patógenos productores de mastitis tales como Streptococcusss spp, Staphylococcus spp y otras especies sensibles a la Amoxicilina, incluyendo las especies productoras de Beta lactamasa - El ácido clavulánico neutraliza el mecanismo de defensa de las bacteria",
    "image": "https://static.wixstatic.com/media/06b954_1885403879234fc0b6acbbf8b919f15d~mv2.png",
    "volumeWeight": "3gr.",
    "dose": "",
    "drugs": "Amoxicilina trihidrato: 0,200 g",
    "externalLink": "https://ar.zoetis.com/products/bovinos/clavamox-lc.aspx",
    "price": 0
  }
];

// Variable global para almacenar productos cacheados
let productsCache = null;
let supabaseDataLoaded = false;

// Initialize database
function initDB() {
    try {
        const data = localStorage.getItem('camponuevo_products');
        let isEmpty = !data;
        
        // Verificar si es un JSON válido y no está vacío
        if (data) {
            try {
                const parsed = JSON.parse(data);
                isEmpty = !parsed || parsed.length === 0;
            } catch (e) {
                // Si hay error al parsear, consideramos los datos corruptos
                console.warn('Corrupted localStorage data, resetting...');
                isEmpty = true;
            }
        }
        
        if (isEmpty) {
            console.log('Initializing products from default data...');
            localStorage.setItem('camponuevo_products', JSON.stringify(defaultProducts));
        }
    } catch (e) {
        console.error('Error in initDB:', e);
    }
}

// Get all products - prioritize Supabase over localStorage
async function getProductsAsync() {
    if (productsCache) return productsCache;
    
    // Try to load from Supabase first if available
    if (isSupabaseAvailable()) {
        try {
            const supabaseProducts = await getProductsFromSupabase();
            if (supabaseProducts && supabaseProducts.length > 0) {
                const mappedProducts = supabaseProducts.map(p => ({
                    id: p.id, title: p.title, price: p.price, laboratory: p.laboratory,
                    description: p.description, subCategory: p.subcategory,
                    subCategories: p.subcategories || [], animalBreeds: p.animalbreeds || [],
                    volumeWeight: p.volume, image: p.image, drugs: p.drugs || [],
                    dose: p.dose, externalLink: p.externallink
                }));
                
                localStorage.setItem('camponuevo_products', JSON.stringify(mappedProducts));
                productsCache = mappedProducts;
                console.log('Products loaded from Supabase:', mappedProducts.length);
                return mappedProducts;
            }
        } catch (err) {
            console.log('Supabase load failed, falling back to localStorage:', err.message);
        }
    }
    
    // Fallback to localStorage
    initDB();
    const data = localStorage.getItem('camponuevo_products');
    if (!data) return [];
    try {
        const products = JSON.parse(data);
        console.log('Products loaded from localStorage:', products.length);
        productsCache = products;
        return products;
    } catch (e) {
        console.error('Error parsing products:', e);
        return [];
    }
}

// Sync wrapper for backward compatibility
function getProducts() {
    const products = getProductsAsync();
    if (products && typeof products.then === 'function') {
        console.warn('getProducts called synchronously but returns a Promise. Use getProductsAsync() for async access.');
        // Return cached or localStorage while async loads
        initDB();
        const data = localStorage.getItem('camponuevo_products');
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) { return []; }
        }
        return [];
    }
    return products || [];
}

// Cargar datos desde Supabase en background (sin bloquear)
async function loadFromSupabaseInBackground() {
    if (supabaseDataLoaded) return;
    
    try {
        const supabaseProducts = await getProductsFromSupabase();
        if (supabaseProducts && supabaseProducts.length > 0) {
            const mappedProducts = supabaseProducts.map(p => ({
                id: p.id, title: p.title, price: p.price, laboratory: p.laboratory,
                description: p.description, subCategory: p.subcategory,
                subCategories: p.subcategories || [], animalBreeds: p.animalbreeds || [],
                volumeWeight: p.volume, image: p.image, drugs: p.drugs || [],
                dose: p.dose, externalLink: p.externallink
            }));
            
            // Guardar en localStorage para futuras cargas
            localStorage.setItem('camponuevo_products', JSON.stringify(mappedProducts));
            
            productsCache = mappedProducts;
            console.log('Products loaded from Supabase in background and saved to localStorage');
            supabaseDataLoaded = true;
        }
    } catch (err) {
        console.log('Supabase not available yet, using localStorage');
    }
}

// Get product by ID
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === id) || null;
}

// Save a product (Create or Update)
function saveProduct(product) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
        // Update existing
        products[index] = product;
    } else {
        // Create new
        products.push(product);
    }
    
    localStorage.setItem('camponuevo_products', JSON.stringify(products));
    
    // Also save to Supabase in background
    saveProductToSupabase(product);
}

async function saveProductToSupabase(product) {
    console.log('=== saveProductToSupabase called ===');
    console.log('Product:', product);
    console.log('isSupabaseAvailable:', isSupabaseAvailable());
    console.log('window.supabase:', window.supabase);
    
    if (!isSupabaseAvailable()) {
        console.log('Supabase not available, product saved locally only');
        return;
    }
    try {
        const productData = {
            id: product.id,
            title: product.title,
            price: product.price,
            laboratory: product.laboratory || '',
            description: product.description || '',
            subcategory: product.subCategory || product.subcategory || '',
            subcategories: product.subCategories || product.subcategories || [],
            animalbreeds: product.animalBreeds || product.animalbreeds || [],
            volume: product.volumeWeight || product.volume || '',
            image: product.image || '',
            drugs: product.drugs || [],
            dose: product.dose || '',
            externallink: product.externalLink || product.externallink || ''
        };
        
        // Check if product exists in Supabase
        const { data: existing } = await window.supabase
            .from('products')
            .select('id')
            .eq('id', product.id)
            .single();
        
        if (existing) {
            // Update
            const { error } = await window.supabase
                .from('products')
                .update(productData)
                .eq('id', product.id);
            if (error) throw error;
            console.log('Product updated in Supabase:', product.title);
        } else {
            // Insert
            const { error } = await window.supabase
                .from('products')
                .insert([productData]);
            if (error) throw error;
            console.log('Product saved to Supabase:', product.title);
        }
    } catch (err) {
        console.error('Error saving product to Supabase:', err.message);
    }
}

// Delete a product
function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem('camponuevo_products', JSON.stringify(products));
    
    // Also delete from Supabase
    deleteProductFromSupabase(id);
}

async function deleteProductFromSupabase(id) {
    if (!isSupabaseAvailable()) return;
    try {
        const { error } = await window.supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw error;
        console.log('Product deleted from Supabase:', id);
    } catch (err) {
        console.error('Error deleting product from Supabase:', err.message);
    }
}

// --- Sub-categories Management ---

// Default sub-categories
const defaultSubCategories = [
    "Productos destacados",
    "Endectocida",
    "Endectocida LA",
    "Antibióticos",
    "Artículos rurales"
];

// Initialize sub-categories in storage if empty
function initSubCategories() {
    let stored = localStorage.getItem('camponuevo_subcategories');
    if (!stored) {
        localStorage.setItem('camponuevo_subcategories', JSON.stringify(defaultSubCategories));
    } else {
        // Ensure "Productos destacados" is always present
        const cats = JSON.parse(stored);
        if (!cats.includes('Productos destacados')) {
            cats.push('Productos destacados');
            cats.sort();
            localStorage.setItem('camponuevo_subcategories', JSON.stringify(cats));
        }
    }
}

let subCategoriesCache = null;
let subCategoriesSupabaseLoaded = false;

function getSubCategories() {
    if (subCategoriesCache) return subCategoriesCache;
    
    initSubCategories();
    subCategoriesCache = JSON.parse(localStorage.getItem('camponuevo_subcategories') || '[]');
    
    if (!subCategoriesSupabaseLoaded) {
        loadSubCategoriesFromSupabaseInBackground();
    }
    
    return subCategoriesCache;
}

async function loadSubCategoriesFromSupabaseInBackground() {
    if (subCategoriesSupabaseLoaded) return;
    try {
        const supabaseSubCats = await getSubCategoriesFromSupabase();
        if (supabaseSubCats && supabaseSubCats.length > 0) {
            subCategoriesCache = supabaseSubCats;
            subCategoriesSupabaseLoaded = true;
        }
    } catch (err) {
        console.log('Supabase subcategories not available yet');
    }
}

// Save/Update a sub-category
function saveSubCategory(name) {
    let cats = getSubCategories();
    if (!cats.includes(name)) {
        cats.push(name);
        cats.sort();
        localStorage.setItem('camponuevo_subcategories', JSON.stringify(cats));
    }
}

// Delete a sub-category
function deleteSubCategory(name) {
    let cats = getSubCategories();
    cats = cats.filter(c => c !== name);
    localStorage.setItem('camponuevo_subcategories', JSON.stringify(cats));
}

// Update a sub-category name
function updateSubCategoryName(oldName, newName) {
    let cats = getSubCategories();
    const index = cats.indexOf(oldName);
    if (index !== -1) {
        cats[index] = newName;
        localStorage.setItem('camponuevo_subcategories', JSON.stringify(cats));
    }
}

// --- Categories Management (Parent Categories) ---

const defaultCategories = [
    {
        id: "veterinaria",
        name: "Veterinaria",
        subCategories: ["Antibióticos Inyectables", "Antidiarreicos y Carminativos", "Endectocida", "Endectocida LA", "Antibióticos", "Productos destacados", "Artículos rurales"]
    },
    {
        id: "bovinos",
        name: "Bovinos",
        subCategories: []
    },
    {
        id: "ovinos",
        name: "Ovinos",
        subCategories: []
    },
    {
        id: "equinos",
        name: "Equinos",
        subCategories: []
    },
    {
        id: "porcinos",
        name: "Porcinos",
        subCategories: []
    },
    {
        id: "caninos",
        name: "Caninos",
        subCategories: []
    },
    {
        id: "felinos",
        name: "Felinos",
        subCategories: []
    },
    {
        id: "agricultura",
        name: "Agricultura",
        subCategories: []
    }
];

function initCategories() {
    let stored = localStorage.getItem('camponuevo_categories');
    if (!stored) {
        localStorage.setItem('camponuevo_categories', JSON.stringify(defaultCategories));
    }
}

let categoriesCache = null;
let categoriesSupabaseLoaded = false;

async function getCategories() {
    if (categoriesCache) return categoriesCache;
    
    // Try Supabase first
    if (isSupabaseAvailable()) {
        try {
            const supabaseCats = await getCategoriesFromSupabase();
            if (supabaseCats && supabaseCats.length > 0) {
                categoriesCache = supabaseCats;
                console.log('Categories loaded from Supabase:', categoriesCache.length);
                return categoriesCache;
            }
        } catch (err) {
            console.warn('Error loading categories from Supabase, trying localStorage:', err.message);
        }
    }
    
    // Fallback to localStorage
    initCategories();
    const data = localStorage.getItem('camponuevo_categories');
    if (data) {
        try {
            categoriesCache = JSON.parse(data);
            console.log('Categories loaded from localStorage:', categoriesCache.length);
            return categoriesCache;
        } catch (e) {
            console.error('Error parsing categories:', e);
        }
    }
    return [];
}

async function loadCategoriesFromSupabaseInBackground() {
    if (categoriesSupabaseLoaded) return;
    try {
        const supabaseCats = await getCategoriesFromSupabase();
        if (supabaseCats && supabaseCats.length > 0) {
            categoriesCache = supabaseCats;
            categoriesSupabaseLoaded = true;
            console.log('Categories loaded from Supabase in background');
        }
    } catch (err) {
        console.log('Supabase categories not available yet');
    }
}

async function getCategoryById(id) {
    const categories = await getCategories();
    return categories.find(c => c.id === id);
}

async function getCategoryByName(name) {
    const categories = await getCategories();
    return categories.find(c => c.name.toLowerCase() === name.toLowerCase());
}

async function saveCategory(categoryData) {
    const categories = await getCategories();
    const existingIndex = categories.findIndex(c => c.id === categoryData.id);
    
    if (existingIndex !== -1) {
        categories[existingIndex] = categoryData;
    } else {
        categories.push(categoryData);
    }
    
    // Guardar en localStorage
    localStorage.setItem('camponuevo_categories', JSON.stringify(categories));
    
    // Guardar en Supabase
    if (isSupabaseAvailable()) {
        try {
            await saveCategoriesToSupabase(categories);
            console.log('Category saved to Supabase');
        } catch (err) {
            console.error('Error saving category to Supabase:', err.message);
        }
    }
}

async function addCategory(name) {
    const categories = await getCategories();
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    if (categories.some(c => c.id === id)) {
        return { success: false, message: "Ya existe una categoría con ese nombre" };
    }
    
    const newCategory = {
        id: id,
        name: name,
        subCategories: []
    };
    
    categories.push(newCategory);
    
    // Guardar en localStorage
    localStorage.setItem('camponuevo_categories', JSON.stringify(categories));
    
    // Guardar en Supabase
    if (isSupabaseAvailable()) {
        try {
            await saveCategoriesToSupabase(categories);
            console.log('Category added to Supabase');
        } catch (err) {
            console.error('Error adding category to Supabase:', err.message);
        }
    }
    
    return { success: true, category: newCategory };
}

async function deleteCategory(id) {
    const categories = await getCategories();
    const filtered = categories.filter(c => c.id !== id);
    
    // Guardar en localStorage
    localStorage.setItem('camponuevo_categories', JSON.stringify(filtered));
    
    // Guardar en Supabase
    if (isSupabaseAvailable()) {
        try {
            await saveCategoriesToSupabase(filtered);
            console.log('Category deleted from Supabase');
        } catch (err) {
            console.error('Error deleting category from Supabase:', err.message);
        }
    }
}

async function updateCategoryName(id, newName) {
    const categories = await getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
        categories[index].name = newName;
        
        // Guardar en localStorage
        localStorage.setItem('camponuevo_categories', JSON.stringify(categories));
        
        // Guardar en Supabase
        if (isSupabaseAvailable()) {
            try {
                await saveCategoriesToSupabase(categories);
                console.log('Category name updated in Supabase');
            } catch (err) {
                console.error('Error updating category name in Supabase:', err.message);
            }
        }
    }
}

async function addSubCategoryToCategory(categoryId, subCategoryName) {
    const categories = await getCategories();
    const category = categories.find(c => c.id === categoryId);
    if (category && !category.subCategories.includes(subCategoryName)) {
        category.subCategories.push(subCategoryName);
        category.subCategories.sort();
        
        // Guardar en localStorage
        localStorage.setItem('camponuevo_categories', JSON.stringify(categories));
        
        // Guardar en Supabase
        if (isSupabaseAvailable()) {
            try {
                await saveCategoriesToSupabase(categories);
                console.log('Subcategory added in Supabase');
            } catch (err) {
                console.error('Error adding subcategory in Supabase:', err.message);
            }
        }
    }
}

async function removeSubCategoryFromCategory(categoryId, subCategoryName) {
    const categories = await getCategories();
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        category.subCategories = category.subCategories.filter(s => s !== subCategoryName);
        
        // Guardar en localStorage
        localStorage.setItem('camponuevo_categories', JSON.stringify(categories));
        
        // Guardar en Supabase
        if (isSupabaseAvailable()) {
            try {
                await saveCategoriesToSupabase(categories);
                console.log('Subcategory removed in Supabase');
            } catch (err) {
                console.error('Error removing subcategory in Supabase:', err.message);
            }
        }
    }
}

async function moveSubCategoryToCategory(subCategoryName, fromCategoryId, toCategoryId) {
    await removeSubCategoryFromCategory(fromCategoryId, subCategoryName);
    await addSubCategoryToCategory(toCategoryId, subCategoryName);
}

// --- Homepage Categories Management ---

let homeCategoriesCache = null;
let homeCategoriesSupabaseLoaded = false;

async function getHomeCategories() {
    if (homeCategoriesCache) return homeCategoriesCache;
    
    // Intentar cargar desde Supabase primero
    if (isSupabaseAvailable()) {
        try {
            const supabaseHomeCats = await getHomeCategoriesFromSupabase();
            if (supabaseHomeCats && supabaseHomeCats.length > 0) {
                homeCategoriesCache = supabaseHomeCats;
                console.log('Home categories loaded from Supabase:', homeCategoriesCache.length);
                return homeCategoriesCache;
            }
        } catch (err) {
            console.warn('Error loading home categories from Supabase, trying localStorage:', err.message);
        }
    }
    
    // Fallback a localStorage
    initCategories();
    const stored = localStorage.getItem('camponuevo_home_categories');
    if (!stored) {
        const cats = await getCategories();
        const defaultHome = cats.slice(0, 4).map(c => ({ id: c.id, svg: null }));
        localStorage.setItem('camponuevo_home_categories', JSON.stringify(defaultHome));
        homeCategoriesCache = defaultHome;
        return defaultHome;
    }
    homeCategoriesCache = JSON.parse(stored);
    console.log('Home categories loaded from localStorage:', homeCategoriesCache.length);
    return homeCategoriesCache;
}

async function loadHomeCategoriesFromSupabaseInBackground() {
    if (homeCategoriesSupabaseLoaded) return;
    try {
        const supabaseHomeCats = await getHomeCategoriesFromSupabase();
        if (supabaseHomeCats && supabaseHomeCats.length > 0) {
            homeCategoriesCache = supabaseHomeCats.map(hc => ({ 
                id: hc.id, 
                categoryId: hc.categoryid,
                svg: null 
            }));
            homeCategoriesSupabaseLoaded = true;
        }
    } catch (err) {
        console.log('Supabase home categories not available yet');
    }
}

async function saveHomeCategories(categories) {
    localStorage.setItem('camponuevo_home_categories', JSON.stringify(categories));
    await saveHomeCategoriesToSupabase(categories);
}

async function addCategoryToHome(categoryId) {
    const current = await getHomeCategories();
    if (!current.some(c => c.id === categoryId)) {
        current.push({ id: categoryId, svg: null });
        await saveHomeCategories(current);
    }
    return current;
}

async function removeCategoryFromHome(categoryId) {
    const current = await getHomeCategories();
    const filtered = current.filter(c => c.id !== categoryId);
    await saveHomeCategories(filtered);
    return filtered;
}

function reorderHomeCategories(categories) {
    saveHomeCategories(categories);
}

function updateCategorySvg(categoryId, svgContent) {
    const current = getHomeCategories();
    const cat = current.find(c => c.id === categoryId);
    if (cat) {
        cat.svg = svgContent;
        saveHomeCategories(current);
    }
    return current;
}

function isCategoryInHome(categoryId) {
    const current = getHomeCategories();
    return current.some(c => c.id === categoryId);
}

// Migrar subcategorías existentes a categoría Veterinaria si no existen categorías
function migrateSubCategoriesToCategories() {
    try {
        const stored = localStorage.getItem('camponuevo_categories');
        if (!stored) {
            const subCats = getSubCategories();
            defaultCategories[0].subCategories = subCats;
            localStorage.setItem('camponuevo_categories', JSON.stringify(defaultCategories));
        }
    } catch (e) {
        console.log('Error in migrateSubCategoriesToCategories:', e);
    }
}

// --- laboratory Management ---

const defaultLaboratories = [
    "Konig",
    "Boehringer Ingelheim",
    "Zoovet",
    "Richmond",
    "Zoetis",
    "Bioinnovo",
    "Brouwer",
    "Hervit",
    "Kualcos",
    "Vetanco",
    "Ourofino",
    "Biogénesis Bagó",
    "Ceva",
    "MSD",
    "Varios"
];

// Initialize laboratories in storage if empty
function initLaboratories() {
    if (!localStorage.getItem('camponuevo_laboratories')) {
        localStorage.setItem('camponuevo_laboratories', JSON.stringify(defaultLaboratories));
    }
}

let laboratoriesCache = null;
let laboratoriesSupabaseLoaded = false;

function getLaboratories() {
    if (laboratoriesCache) return laboratoriesCache;
    
    initLaboratories();
    laboratoriesCache = JSON.parse(localStorage.getItem('camponuevo_laboratories') || '[]');
    
    if (!laboratoriesSupabaseLoaded) {
        loadLaboratoriesFromSupabaseInBackground();
    }
    
    return laboratoriesCache;
}

async function loadLaboratoriesFromSupabaseInBackground() {
    if (laboratoriesSupabaseLoaded) return;
    try {
        const supabaseLabs = await getLaboratoriesFromSupabase();
        if (supabaseLabs && supabaseLabs.length > 0) {
            laboratoriesCache = supabaseLabs;
            laboratoriesSupabaseLoaded = true;
            console.log('Laboratories loaded from Supabase in background');
        }
    } catch (err) {
        console.log('Supabase laboratories not available yet');
    }
}

// Save/Update a laboratory
function saveLaboratory(name) {
    let labs = getLaboratories();
    if (!labs.includes(name)) {
        labs.push(name);
        labs.sort();
        localStorage.setItem('camponuevo_laboratories', JSON.stringify(labs));
    }
}

// Delete a laboratory
async function deleteLaboratory(name) {
    let labs = getLaboratories();
    labs = labs.filter(l => l !== name);
    localStorage.setItem('camponuevo_laboratories', JSON.stringify(labs));
    laboratoriesCache = labs;
    laboratoriesSupabaseLoaded = false; // Reset flag to allow refresh
    await deleteLaboratoryFromSupabase(name);
}

// Update a laboratory name or delete it
async function updateLaboratoryName(oldName, newName) {
    let labs = getLaboratories();
    const index = labs.indexOf(oldName);
    if (index !== -1) {
        if (newName === null) {
            labs.splice(index, 1);
            laboratoriesSupabaseLoaded = false;
            await deleteLaboratoryFromSupabase(oldName);
        } else {
            labs[index] = newName;
            await saveLaboratoriesToSupabase(labs);
        }
        localStorage.setItem('camponuevo_laboratories', JSON.stringify(labs));
        laboratoriesCache = labs;
    }
}

// --- label Management ---

const defaultLabels = [
    { name: "Nuevo", color: "#4caf50" },      // secondary
    { name: "Oferta", color: "#f44336" },     // red-500
    { name: "Destacado", color: "#ff9800" },  // amber-500
    { name: "Promoción", color: "#2196f3" }   // blue-500
];

// Initialize labels in storage if empty
function initLabels() {
    if (!localStorage.getItem('camponuevo_labels')) {
        localStorage.setItem('camponuevo_labels', JSON.stringify(defaultLabels));
    }
}

let labelsCache = null;
let labelsSupabaseLoaded = false;

function getLabels() {
    if (labelsCache) return labelsCache;
    
    initLabels();
    let labels = JSON.parse(localStorage.getItem('camponuevo_labels') || '[]');
    
    let migrated = false;
    labels = labels.map(l => {
        if (typeof l === 'string') {
            migrated = true;
            return { name: l, color: "#2d5a27" };
        }
        return l;
    });

    if (migrated) {
        localStorage.setItem('camponuevo_labels', JSON.stringify(labels));
    }

    labelsCache = labels;
    
    if (!labelsSupabaseLoaded) {
        loadLabelsFromSupabaseInBackground();
    }
    
    return labelsCache;
}

async function loadLabelsFromSupabaseInBackground() {
    if (labelsSupabaseLoaded) return;
    try {
        const supabaseLabels = await getLabelsFromSupabase();
        if (supabaseLabels && supabaseLabels.length > 0) {
            labelsCache = supabaseLabels.map(name => ({ name, color: "#2d5a27" }));
            labelsSupabaseLoaded = true;
        }
    } catch (err) {
        console.log('Supabase labels not available yet');
    }
}

// Save/Update a label object
function saveLabel(labelObj, originalName = null) {
    let labels = getLabels();
    
    if (originalName && originalName !== labelObj.name) {
        // Handle Rename
        const index = labels.findIndex(l => l.name === originalName);
        if (index !== -1) {
            labels[index] = labelObj;
            // Recursively update products
            renameLabelGlobal(originalName, labelObj.name);
        } else {
            labels.push(labelObj);
        }
    } else {
        // Standard Save/Update
        const index = labels.findIndex(l => l.name === labelObj.name);
        if (index !== -1) {
            labels[index] = labelObj; // Update color/etc
        } else {
            labels.push(labelObj); // Add new
        }
    }
    
    labels.sort((a, b) => a.name.localeCompare(b.name));
    localStorage.setItem('camponuevo_labels', JSON.stringify(labels));
}

// Function to update label name across all products
function renameLabelGlobal(oldName, newName) {
    let products = getProducts();
    let updated = false;
    
    products.forEach(p => {
        if (p.labels && p.labels.includes(oldName)) {
            p.labels = p.labels.map(l => l === oldName ? newName : l);
            saveProduct(p);
            updated = true;
        }
    });
    
    return updated;
}

// Delete a label
function deleteLabel(name) {
    let labels = getLabels();
    labels = labels.filter(l => l.name !== name);
    localStorage.setItem('camponuevo_labels', JSON.stringify(labels));
    
    // Also remove from all products for consistency
    let products = getProducts();
    products.forEach(p => {
        if (p.labels && p.labels.includes(name)) {
            p.labels = p.labels.filter(l => l !== name);
            saveProduct(p);
        }
    });
}

// Update a label name
function updateLabelName(oldName, newName, color) {
    let labels = getLabels();
    const index = labels.findIndex(l => l.name === oldName);
    if (index !== -1) {
        labels[index] = { name: newName, color: color };
        localStorage.setItem('camponuevo_labels', JSON.stringify(labels));
    }
}

// Helper to get color by label name
function getColorForLabel(name) {
    const labels = getLabels();
    const label = labels.find(l => l.name === name);
    return label ? label.color : "#2d5a27"; // Default primary
}

// --- Cart Management ---

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('camponuevo_cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('camponuevo_cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(product, quantity = 1) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            laboratory: product.laboratory,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    return cart;
}

// Update item quantity
function updateCartQuantity(productId, quantity) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    
    if (index !== -1) {
        if (quantity <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = quantity;
        }
        saveCart(cart);
    }
    return cart;
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

// Clear cart
function clearCart() {
    localStorage.removeItem('camponuevo_cart');
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// --- User Management ---

// Security Questions (Predefined list + custom option)
const securityQuestions = [
    "¿Nombre de tu primera mascota?",
    "¿Ciudad donde naciste?",
    "¿Nombre de tu mejor amigo de la infancia?",
    "¿Marca de tu primer auto?",
    "¿Comida favorita de tu infancia?"
];

// Initialize users in storage if empty
function initUsers() {
    if (!localStorage.getItem('camponuevo_users')) {
        localStorage.setItem('camponuevo_users', JSON.stringify([]));
    }
}

// Get all users
function getUsers() {
    initUsers();
    return JSON.parse(localStorage.getItem('camponuevo_users'));
}

// Save users to storage
function saveUsers(users) {
    localStorage.setItem('camponuevo_users', JSON.stringify(users));
}

// Hash password using Web Crypto API (async) or simple fallback
async function hashPassword(password) {
    // Try Web Crypto API first
    if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback simple hash
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Register new user
async function registerUser(userData) {
    // Check if Supabase is available
    if (isSupabaseAvailable()) {
        try {
            // Check if email already exists in Supabase
            const { data: existingUsers, error: checkError } = await window.supabase
                .from('users')
                .select('email')
                .eq('email', userData.email.toLowerCase());
            
            if (checkError) throw checkError;
            
            if (existingUsers && existingUsers.length > 0) {
                return { success: false, message: "El email ya está registrado" };
            }
            
            // Hash password
            const passwordHash = await hashPassword(userData.password);
            
            // Create user object
            const user = {
                id: generateId(),
                email: userData.email,
                passwordHash: passwordHash,
                name: userData.name,
                phone: "",
                securityQuestion: "",
                securityAnswerHash: "",
                location: "",
                identification: "",
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            // Save to Supabase
            const { error } = await window.supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email,
                    password_hash: user.passwordHash,
                    name: user.name,
                    phone: user.phone,
                    security_question: user.securityQuestion,
                    security_answer_hash: user.securityAnswerHash,
                    location: user.location,
                    identification: user.identification,
                    created_at: user.createdAt,
                    last_login: user.lastLogin
                });
            
            if (error) throw error;
            
            // Auto login after registration
            sessionStorage.setItem('camponuevo_session', JSON.stringify({
                userId: user.id,
                rememberMe: false
            }));
            
            return { success: true, user: user };
        } catch (err) {
            console.error('Error registering user in Supabase:', err.message);
            return { success: false, message: "Error al registrar usuario" };
        }
    } else {
        // Fallback to localStorage
        initUsers();
        const users = getUsers();
        
        // Check if email already exists
        const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (existingUser) {
            return { success: false, message: "El email ya está registrado" };
        }
        
        // Hash password
        const passwordHash = await hashPassword(userData.password);
        
        // Create user object (without security data initially)
        const user = {
            id: generateId(),
            email: userData.email,
            passwordHash: passwordHash,
            name: userData.name,
            phone: "",
            securityQuestion: "",
            securityAnswerHash: "",
            location: "",
            identification: "",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        users.push(user);
        saveUsers(users);
        
        // Auto login after registration
        sessionStorage.setItem('camponuevo_session', JSON.stringify({
            userId: user.id,
            rememberMe: false
        }));
        
        return { success: true, user: user };
    }
}

// Login user
async function loginUser(email, password, rememberMe = false) {
    // Check if Supabase is available
    if (isSupabaseAvailable()) {
        try {
            // Get user from Supabase
            const { data: users, error } = await window.supabase
                .from('users')
                .select('*')
                .eq('email', email.toLowerCase());
            
            if (error) throw error;
            
            if (!users || users.length === 0) {
                return { success: false, message: "Email no registrado" };
            }
            
            const user = users[0];
            const passwordHash = await hashPassword(password);
            
            if (user.password_hash !== passwordHash) {
                return { success: false, message: "Contraseña incorrecta" };
            }
            
            // Update last login in Supabase
            const { error: updateError } = await window.supabase
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', user.id);
            
            if (updateError) throw updateError;
            
            // Set session
            const session = {
                userId: user.id,
                rememberMe: rememberMe
            };
            
            sessionStorage.setItem('camponuevo_session', JSON.stringify(session));
            
            if (rememberMe) {
                localStorage.setItem('camponuevo_session', JSON.stringify(session));
            }
            
            return { success: true, user: user };
        } catch (err) {
            console.error('Error logging in with Supabase:', err.message);
            return { success: false, message: "Error al iniciar sesión" };
        }
    } else {
        // Fallback to localStorage
        initUsers();
        const users = getUsers();
        
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return { success: false, message: "Email no registrado" };
        }
        
        const passwordHash = await hashPassword(password);
        if (user.passwordHash !== passwordHash) {
            return { success: false, message: "Contraseña incorrecta" };
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        saveUsers(users);
        
        // Set session
        const session = {
            userId: user.id,
            rememberMe: rememberMe
        };
        
        sessionStorage.setItem('camponuevo_session', JSON.stringify(session));
        
        if (rememberMe) {
            localStorage.setItem('camponuevo_session', JSON.stringify(session));
        }
        
        return { success: true, user: user };
    }
}

// Logout user
function logoutUser() {
    sessionStorage.removeItem('camponuevo_session');
    localStorage.removeItem('camponuevo_session');
}

// Get current logged in user
async function getCurrentUser() {
    // Check sessionStorage first
    let session = sessionStorage.getItem('camponuevo_session');
    if (!session) {
        // Check localStorage for "remember me"
        session = localStorage.getItem('camponuevo_session');
    }
    
    if (!session) return null;
    
    try {
        const sessionData = JSON.parse(session);
        
        // Check if Supabase is available
        if (isSupabaseAvailable()) {
            try {
                const { data: users, error } = await window.supabase
                    .from('users')
                    .select('*')
                    .eq('id', sessionData.userId);
                
                if (error) throw error;
                
                return users && users.length > 0 ? users[0] : null;
            } catch (err) {
                console.error('Error fetching user from Supabase:', err.message);
                return null;
            }
        } else {
            // Fallback to localStorage
            const users = getUsers();
            return users.find(u => u.id === sessionData.userId) || null;
        }
    } catch (e) {
        return null;
    }
}

// Get security question for email
function getSecurityQuestion(email) {
    initUsers();
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        return { success: false, message: "Email no encontrado" };
    }
    
    if (!user.securityQuestion) {
        return { success: false, message: "No tienes una pregunta de seguridad configurada. Contacta con soporte para recuperar tu contraseña." };
    }
    
    return { 
        success: true, 
        question: user.securityQuestion,
        isCustom: !securityQuestions.includes(user.securityQuestion)
    };
}

// Validate security answer
async function validateSecurityAnswer(email, answer) {
    initUsers();
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        return { success: false, message: "Email no encontrado" };
    }
    
    // Check if user has a security question configured
    if (!user.securityQuestion || !user.securityAnswerHash) {
        return { success: false, message: "No tienes una pregunta de seguridad configurada. Contacta con soporte para recuperar tu contraseña." };
    }
    
    const answerHash = await hashPassword(answer);
    if (user.securityAnswerHash !== answerHash) {
        return { success: false, message: "Respuesta incorrecta" };
    }
    
    return { success: true };
}

// Reset password with security validation
async function resetPasswordWithSecurity(email, newPassword) {
    initUsers();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) {
        return { success: false, message: "Email no encontrado" };
    }
    
    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);
    users[userIndex].passwordHash = newPasswordHash;
    
    saveUsers(users);
    return { success: true };
}

// Update user profile
async function updateUserProfile(userId, updates) {
    initUsers();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return { success: false, message: "Usuario no encontrado" };
    }
    
    // Update basic fields
    if (updates.name) users[userIndex].name = updates.name;
    if (updates.phone !== undefined) users[userIndex].phone = updates.phone;
    if (updates.location !== undefined) users[userIndex].location = updates.location;
    if (updates.identification !== undefined) users[userIndex].identification = updates.identification;
    
    // Update security question if provided
    if (updates.securityQuestion) {
        users[userIndex].securityQuestion = updates.securityQuestion;
    }
    
    // Update security answer if provided (hash it first)
    if (updates.securityAnswer) {
        const answerHash = await hashPassword(updates.securityAnswer);
        users[userIndex].securityAnswerHash = answerHash;
    }
    
    saveUsers(users);
    return { success: true, user: users[userIndex] };
}

// Change password (requires old password)
async function changePassword(userId, oldPassword, newPassword) {
    initUsers();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return { success: false, message: "Usuario no encontrado" };
    }
    
    const user = users[userIndex];
    const oldPasswordHash = await hashPassword(oldPassword);
    
    if (user.passwordHash !== oldPasswordHash) {
        return { success: false, message: "Contraseña actual incorrecta" };
    }
    
    const newPasswordHash = await hashPassword(newPassword);
    users[userIndex].passwordHash = newPasswordHash;
    
    saveUsers(users);
    return { success: true };
}

// --- Order Management ---

// Initialize orders in storage if empty
function initOrders() {
    if (!localStorage.getItem('camponuevo_orders')) {
        localStorage.setItem('camponuevo_orders', JSON.stringify([]));
    }
}

let ordersCache = null;
let ordersSupabaseLoaded = false;

function getOrders() {
    if (ordersCache) return ordersCache;
    
    initOrders();
    ordersCache = JSON.parse(localStorage.getItem('camponuevo_orders') || '[]');
    
    if (!ordersSupabaseLoaded) {
        loadOrdersFromSupabaseInBackground();
    }
    
    return ordersCache;
}

async function loadOrdersFromSupabaseInBackground() {
    if (ordersSupabaseLoaded) return;
    try {
        const supabaseOrders = await getOrdersFromSupabase();
        if (supabaseOrders && supabaseOrders.length > 0) {
            ordersCache = supabaseOrders.map(o => ({
                id: o.id, userId: o.userid, items: JSON.parse(o.products || '[]'),
                total: o.total, status: o.status, createdAt: o.created_at
            }));
            ordersSupabaseLoaded = true;
            console.log('Orders loaded from Supabase in background');
        }
    } catch (err) {
        console.log('Supabase orders not available yet');
    }
}

// Save orders to storage
async function saveOrders(orders) {
    localStorage.setItem('camponuevo_orders', JSON.stringify(orders));
    // También guardar en Supabase
    for (const order of orders) {
        await saveOrderToSupabase(order);
    }
}

// Save order (associate with user if logged in)
async function saveOrder(orderData) {
    initOrders();
    const orders = await getOrders();
    const currentUser = await getCurrentUser();
    
    const order = {
        id: orderData.id || generateId(),
        userId: currentUser ? currentUser.id : null,
        items: orderData.items,
        subtotal: orderData.subtotal,
        iva: orderData.iva,
        total: orderData.total,
        customerInfo: orderData.customerInfo,
        status: "Pendiente",
        createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    await saveOrders(orders);
    
    // También guardar en Supabase
    await saveOrderToSupabase(order);
    
    return order;
}

// Get orders by user ID
function getOrdersByUser(userId) {
    const orders = getOrders();
    return orders.filter(o => o.userId === userId).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
}

// Get next order number for CN-0001 format
function getNextOrderNumber() {
    initOrders();
    const orders = getOrders();
    return orders.length + 1;
}

// Get all predefined security questions
function getSecurityQuestions() {
    return securityQuestions;
}

// Exponer funciones principales globalmente
window.getProducts = getProducts;
window.getProductsAsync = getProductsAsync;
window.getProductById = getProductById;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.getCategories = getCategories;
window.getCategoryById = getCategoryById;
window.saveCategory = saveCategory;
window.deleteCategory = deleteCategory;
window.getSubCategories = getSubCategories;
window.saveSubCategory = saveSubCategory;
window.deleteSubCategory = deleteSubCategory;
window.getLabels = getLabels;
window.saveLabel = saveLabel;
window.deleteLabel = deleteLabel;
window.getLaboratories = getLaboratories;
window.saveLaboratory = saveLaboratory;
window.getHomeCategories = getHomeCategories;
window.saveHomeCategories = saveHomeCategories;
window.addCategoryToHome = addCategoryToHome;
window.removeCategoryFromHome = removeCategoryFromHome;
window.isCategoryInHome = isCategoryInHome;
window.migrateSubCategoriesToCategories = migrateSubCategoriesToCategories;
window.getOrders = getOrders;
window.saveOrder = saveOrder;
window.getOrdersByUser = getOrdersByUser;
window.getNextOrderNumber = getNextOrderNumber;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.updateUserProfile = updateUserProfile;
window.changePassword = changePassword;
window.validateSecurityAnswer = validateSecurityAnswer;
window.resetPasswordWithSecurity = resetPasswordWithSecurity;
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.clearCart = clearCart;
window.getSecurityQuestions = getSecurityQuestions;
window.generateId = generateId;
window.hashPassword = hashPassword;
