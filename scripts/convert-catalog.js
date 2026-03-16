const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'catalog_products.csv');
const outputFile = path.join(__dirname, '..', 'products_supabase_converted.csv');

function parseCSVComplex(content) {
    const lines = content.split(/\r?\n/);
    const headers = lines[0].split(',');
    const headerMap = {};
    headers.forEach((h, i) => headerMap[h] = i);
    
    const products = [];
    let buffer = [];
    let lineNum = 1;
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith('product_') && buffer.length === 0) {
            buffer = [line];
            lineNum = i;
        } else {
            buffer.push(line);
        }
        
        const fullLine = buffer.join('\n');
        const quoteCount = (fullLine.match(/"/g) || []).length;
        
        if (quoteCount % 2 === 0 && fullLine.startsWith('product_')) {
            const firstComma = fullLine.indexOf(',');
            const productId = fullLine.substring(0, firstComma);
            
            if (productId.startsWith('product_')) {
                const values = parseLine(fullLine);
                const product = {};
                headers.forEach((header, index) => {
                    product[header] = values[index] || '';
                });
                product.handleId = productId;
                products.push(product);
            }
            buffer = [];
        }
    }
    
    return products;
}

function parseLine(line) {
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

function convertToSupabase(products) {
    return products.map(product => {
        const collection = product.collection || '';
        const collections = collection.split(';').filter(c => c.trim());
        
        const animalBreeds = collections.filter(c => 
            ['Bovinos', 'Porcinos', 'Ovinos', 'Equinos', 'Caninos', 'Felinos', 'Aves', 'Caprinos'].includes(c)
        );
        
        const subcategories = collections.filter(c => 
            !['Bovinos', 'Porcinos', 'Ovinos', 'Equinos', 'Caninos', 'Felinos', 'Aves', 'Caprinos', 'Veterinaria', 'Productos del Mes', 'Destacados', 'Nueva Temporada'].includes(c)
        );
        
        const subcategory = subcategories[0] || '';
        
        let drugs = [];
        let dose = '';
        
        const description = product.description || '';
        const additionalInfo = product.additionalInfoDescription1 || '';
        
        const drogasMatch = description.match(/Drogas:?\s*([^\n<]+)/i) || additionalInfo.match(/Drogas:?\s*([^\n<]+)/i);
        if (drogasMatch) {
            drugs = [drogasMatch[1].trim()];
        }
        
        const dosisMatch = description.match(/Dosis y Administaración:?\s*([^\n<]+)/i);
        if (dosisMatch) {
            dose = dosisMatch[1].trim();
        }
        
        const cleanDescription = description
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 5000);
        
        const price = parseFloat(product.price) || 0;
        
        // Fix image URL - add Wix static domain prefix
        let imageUrl = product.productImageUrl || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = 'https://static.wixstatic.com/media/' + imageUrl;
        }
        
        return {
            id: product.handleId || '',
            title: product.name || '',
            price: price,
            laboratory: product.brand || '',
            description: cleanDescription,
            subcategory: subcategory,
            subcategories: subcategories.length > 0 ? JSON.stringify(subcategories) : '',
            animalbreeds: animalBreeds.length > 0 ? JSON.stringify(animalBreeds) : '',
            volume: '',
            image: imageUrl,
            drugs: drugs.length > 0 ? JSON.stringify(drugs) : '',
            dose: dose || '',
            externallink: (product.additionalInfoDescription2 || '').replace(/<[^>]+>/g, '').trim()
        };
    });
}

function toCSV(products) {
    const headers = ['id', 'title', 'price', 'laboratory', 'description', 'subcategory', 'subcategories', 'animalbreeds', 'volume', 'image', 'drugs', 'dose', 'externallink'];
    
    const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('{')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };
    
    let csv = headers.join(',') + '\n';
    
    products.forEach(product => {
        const row = headers.map(header => escapeCSV(product[header] || ''));
        csv += row.join(',') + '\n';
    });
    
    return csv;
}

console.log('Leyendo archivo CSV...');
const content = fs.readFileSync(inputFile, 'utf-8');
console.log('Convirtiendo productos...');
const products = parseCSVComplex(content);
const converted = convertToSupabase(products);
console.log(`Procesando ${converted.length} productos...`);
const csv = toCSV(converted);
fs.writeFileSync(outputFile, csv, 'utf-8');
console.log(`Archivo guardado: ${outputFile}`);
console.log(`Total: ${converted.length} productos convertidos`);
