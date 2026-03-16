// Script para verificar productos en Supabase
const { createClient } = require('@supabase/supabase-js');

// Usar la clave anónima (la misma que se usa en el front-end)
const SUPABASE_URL = 'https://itlczokcdxgzgqrortpm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGN6b2tjZHhnemdxcm9ydHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTcwMDAsImV4cCI6MjA2MTA3MzAwMH0.K4AXxMHVd0VqeFR9gUGMSyq-zVYHj4pH1vsH5KGTFqc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkProducts() {
    console.log('=== VERIFICANDO PRODUCTOS EN SUPABASE ===');

    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, title, price')
            .limit(5);

        if (error) {
            console.error('Error:', error.message);
            console.error('Detalles:', error);
            return;
        }

        if (!data || data.length === 0) {
            console.log('⚠️ La tabla products está vacía o no hay permisos para leerla');
            return;
        }

        console.log(`✅ Se encontraron ${data.length} productos (mostrando los primeros 5):`);
        data.forEach(p => {
            console.log(`  - ${p.title} ($${p.price}) [ID: ${p.id}]`);
        });
    } catch (err) {
        console.error('Error inesperado:', err);
    }
}

checkProducts();
