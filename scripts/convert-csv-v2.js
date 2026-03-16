// Script para convertir CSV de productos al formato de Supabase (v2)
// Maneja correctamente saltos de línea dentro de comillas

function convertCSVtoSupabaseFormat(csvText) {
    const products = [];
    let currentLine = '';
    let inQuotes = false;
    let lineNumber = 0;
    
    // Primera pasada: encontrar los headers
    const firstLineEnd = csvText.indexOf('\n');
    const headers = parseCSVLine(csvText.substring(0, firstLineEnd));
    
    // Segunda pasada: parsear línea por línea
    for (let i = firstLineEnd + 1; i < csvText.length; i++) {
        const char = csvText[i];
        const prevChar = csvText[i - 1];
        
        if (char === '"') {
            if (prevChar === '"' && inQuotes) {
                // Escaped quote
            } else if (prevChar !== '\\') {
                inQuotes = !inQuotes;
            }
        }
        
        if (char === '\n' && !inQuotes) {
            // Fin de línea
            if (currentLine.trim()) {
                const values = parseCSVLine(currentLine);
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                
                // Solo procesar si es un producto (fieldType = Product)
                if (row['fieldType'] === 'Product' && row['handleId']) {
                    const collection = row['collection'] || '';
                    const collectionParts = collection.split(';').filter(c => c.trim());
                    
                    const product = {
                        id: row['handleId'],
                        title: row['name'] || '',
                        price: parseFloat(row['price']) || 0,
                        laboratory: row['brand'] || '',
                        description: (row['description'] || '').replace(/<[^>]*>/g, '').substring(0, 1000),
                        subcategory: collectionParts[0] || '',
                        subcategories: collectionParts.slice(1).filter(c => c),
                        animalbreeds: [],
                        volume: '',
                        image: row['productImageUrl'] || '',
                        drugs: [],
                        dose: '',
                        externallink: ''
                    };
                    
                    products.push(product);
                }
            }
            currentLine = '';
        } else {
            currentLine += char;
        }
    }
    
    return products;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// Si se ejecuta en Node.js
if (typeof require !== 'undefined') {
    const fs = require('fs');
    
    console.log('Leyendo archivo CSV...');
    const csv = fs.readFileSync('catalog_products.csv', 'utf8');
    
    console.log('Convirtiendo productos...');
    const products = convertCSVtoSupabaseFormat(csv);
    
    // Guardar como JSON
    console.log('Guardando products_supabase.json...');
    fs.writeFileSync('products_supabase.json', JSON.stringify(products, null, 2));
    
    // Guardar como CSV
    console.log('Guardando products_supabase.csv...');
    const csvHeaders = 'id,title,price,laboratory,description,subcategory,subcategories,animalbreeds,volume,image,drugs,dose,externallink';
    const csvRows = products.map(p => {
        const desc = p.description.replace(/"/g, '""').substring(0, 500);
        return `"${p.id}","${p.title.replace(/"/g, '""')}","${p.price}","${p.laboratory}","${desc}","${p.subcategory}","${p.subcategories.join(';')}","${p.animalbreeds.join(';')}","${p.volume}","${p.image}","${p.drugs.join(';')}","${p.dose}","${p.externallink}"`;
    });
    
    fs.writeFileSync('products_supabase.csv', csvHeaders + '\n' + csvRows.join('\n'));
    
    console.log(`\n✓ Convertidos ${products.length} productos`);
    console.log('Archivos generados:');
    console.log('  - products_supabase.json');
    console.log('  - products_supabase.csv');
}
