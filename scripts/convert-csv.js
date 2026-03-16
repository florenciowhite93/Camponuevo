// Script para convertir CSV de productos al formato de Supabase
// Ejecutar en navegador o Node.js

const csvContent = `handleId,fieldType,name,description,productImageUrl,collection,sku,ribbon,price,surcharge,visible,discountMode,discountValue,inventory,weight,cost,productOptionName1,productOptionType1,productOptionDescription1,productOptionName2,productOptionType2,productOptionDescription2,productOptionName3,productOptionType3,productOptionDescription3,productOptionName4,productOptionType4,productOptionDescription4,productOptionName5,productOptionType5,productOptionDescription5,productOptionName6,productOptionType6,productOptionDescription6,additionalInfoTitle1,additionalInfoDescription1,additionalInfoTitle2,additionalInfoDescription2,additionalInfoTitle3,additionalInfoDescription3,additionalInfoTitle4,additionalInfoDescription4,additionalInfoTitle5,additionalInfoDescription5,additionalInfoTitle6,additionalInfoDescription6,customTextField1,customTextCharLimit1,customTextMandatory1,customTextField2,customTextCharLimit2,customTextMandatory2,brand`;

// Función para parsear CSV con comillas
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

// Función principal de conversión
function convertCSVtoSupabaseFormat(csvText) {
    const lines = csvText.split('\n');
    const headers = parseCSVLine(lines[0]);
    
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        // Mapear al formato de Supabase
        const collection = row['collection'] || '';
        const collectionParts = collection.split(';').filter(c => c.trim());
        
        const product = {
            id: row['handleId'] || '',
            title: row['name'] || '',
            price: parseFloat(row['price']) || 0,
            laboratory: row['brand'] || '',
            description: row['description'] || '',
            subcategory: collectionParts[0] || '',
            subcategories: collectionParts.slice(1),
            animalbreeds: [],
            volume: '',
            image: row['productImageUrl'] || '',
            drugs: [],
            dose: '',
            externallink: ''
        };
        
        products.push(product);
    }
    
    return products;
}

// Si se ejecuta en Node.js
if (typeof require !== 'undefined') {
    const fs = require('fs');
    
    const csv = fs.readFileSync('catalog_products.csv', 'utf8');
    const products = convertCSVtoSupabaseFormat(csv);
    
    // Guardar como JSON
    fs.writeFileSync('products_supabase.json', JSON.stringify(products, null, 2));
    
    // Guardar como CSV
    const csvHeaders = 'id,title,price,laboratory,description,subcategory,subcategories,animalbreeds,volume,image,drugs,dose,externallink';
    const csvRows = products.map(p => {
        return `"${p.id}","${p.title.replace(/"/g, '""')}","${p.price}","${p.laboratory}","${p.description.replace(/"/g, '""').substring(0, 500)}","${p.subcategory}","${p.subcategories.join(';')}","${p.animalbreeds.join(';')}","${p.volume}","${p.image}","${p.drugs.join(';')}","${p.dose}","${p.externallink}"`;
    });
    
    fs.writeFileSync('products_supabase.csv', csvHeaders + '\n' + csvRows.join('\n'));
    
    console.log(`Convertidos ${products.length} productos`);
    console.log('Archivos generados: products_supabase.json y products_supabase.csv');
}

// Exportar para usar en navegador
if (typeof window !== 'undefined') {
    window.convertCSVtoSupabaseFormat = convertCSVtoSupabaseFormat;
}
