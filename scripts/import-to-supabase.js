// Script para importar products_supabase.csv a Supabase
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuración de Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://itlczokcdxgzgqrortpm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_KEY no está configurada en .env');
    console.error('Por favor, agrega tu Service Role Key de Supabase en el archivo .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Función para parsear CSV (versión simple para este script)
function parseCSV(raw) {
    const rows = [];
    let i = 0;
    let currentRow = [];
    let currentField = '';
    let inQuote = false;

    while (i < raw.length) {
        const ch = raw[i];

        if (inQuote) {
            if (ch === '"') {
                if (raw[i + 1] === '"') {
                    currentField += '"';
                    i += 2;
                    continue;
                } else {
                    inQuote = false;
                    i++;
                    continue;
                }
            } else {
                currentField += ch;
                i++;
                continue;
            }
        }

        if (ch === '"') {
            inQuote = true;
            i++;
            continue;
        }

        if (ch === ',') {
            currentRow.push(currentField);
            currentField = '';
            i++;
            continue;
        }

        if (ch === '\r' && raw[i + 1] === '\n') {
            currentRow.push(currentField);
            currentField = '';
            rows.push(currentRow);
            currentRow = [];
            i += 2;
            continue;
        }

        if (ch === '\n') {
            currentRow.push(currentField);
            currentField = '';
            rows.push(currentRow);
            currentRow = [];
            i++;
            continue;
        }

        currentField += ch;
        i++;
    }

    // Final row if there's no trailing newline
    if (currentField !== '' || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }

    return rows;
}

async function importCSVToSupabase() {
    console.log('=== INICIANDO IMPORTACIÓN A SUPABASE ===');

    // Leer el CSV
    const csvPath = path.join(__dirname, '..', 'products_supabase.csv');
    const raw = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(raw);

    console.log(`Total rows (including header): ${rows.length}`);

    const headers = rows[0];
    console.log('Headers:', headers);

    // Mapear índices
    const idx = {};
    headers.forEach((h, i) => { idx[h.trim()] = i; });

    const products = [];
    let skipped = 0;

    for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.length < 5) { skipped++; continue; }

        const product = {
            id: row[idx['id']] || '',
            title: row[idx['title']] || '',
            price: parseFloat(row[idx['price']]) || 0,
            laboratory: row[idx['laboratory']] || '',
            description: row[idx['description']] || '',
            subcategory: row[idx['subcategory']] || '',
            subcategories: row[idx['subcategories']] ? row[idx['subcategories']].split(';').filter(s => s.trim()) : [],
            animalbreeds: row[idx['animalbreeds']] ? row[idx['animalbreeds']].split(';').filter(s => s.trim()) : [],
            volume: row[idx['volume']] || '',
            image: row[idx['image']] || '',
            drugs: row[idx['drugs']] ? row[idx['drugs']].split(';').filter(s => s.trim()) : [],
            dose: row[idx['dose']] || '',
            externallink: row[idx['externallink']] || '',
            created_at: new Date().toISOString()
        };

        products.push(product);
    }

    console.log(`Parsed products: ${products.length}, skipped rows: ${skipped}`);

    if (products.length === 0) {
        console.log('No products to import.');
        return;
    }

    // Insertar en Supabase (en lotes para evitar límites)
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        console.log(`Importing batch ${Math.floor(i / batchSize) + 1} (${batch.length} products)...`);

        const { error } = await supabase
            .from('products')
            .upsert(batch, { onConflict: 'id' });

        if (error) {
            console.error('Error inserting batch:', error.message);
            errorCount++;
            // Intentar insertar uno por uno para identificar productos problemáticos
            for (const product of batch) {
                const { error: singleError } = await supabase
                    .from('products')
                    .upsert([product], { onConflict: 'id' });
                if (singleError) {
                    console.error(`Error inserting product ${product.id} (${product.title}):`, singleError.message);
                } else {
                    insertedCount++;
                }
            }
        } else {
            insertedCount += batch.length;
        }
    }

    console.log(`\n✅ Importación completada!`);
    console.log(`   Productos insertados: ${insertedCount}`);
    console.log(`   Errores: ${errorCount}`);
}

importCSVToSupabase().catch(console.error);
