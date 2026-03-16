// Script to parse catalog_products.csv and generate a JSON array for data.js
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'catalog_products.csv');
const outputPath = path.join(__dirname, '..', 'js', 'data.js');

// ---- CSV Parser (handles quoted fields with embedded newlines & commas) ----
function parseCSV(raw) {
    const rows = [];
    let i = 0;
    let inRow = true;
    let currentRow = [];
    let currentField = '';
    let inQuote = false;

    while (i < raw.length) {
        const ch = raw[i];

        if (inQuote) {
            if (ch === '"') {
                // Peek at next character
                if (raw[i + 1] === '"') {
                    // Escaped quote inside quoted field
                    currentField += '"';
                    i += 2;
                    continue;
                } else {
                    // End of quoted field
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

        // Not in quote
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

// Strip HTML tags from a string
function stripHtml(str) {
    return str
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
}

// Convert collections string to animalBreeds array
function extractBreeds(collections) {
    const breedMap = {
        'bovinos': 'bovino',
        'ovinos': 'ovino',
        'equinos': 'equino',
        'porcinos': 'porcino'
    };
    const found = [];
    const lower = collections.toLowerCase();
    for (const [key, val] of Object.entries(breedMap)) {
        if (lower.includes(key)) {
            found.push(val);
        }
    }
    return found.length > 0 ? found : ['bovino']; // default to bovino
}

// Extract laboratory from collections
function extractLaboratory(collections) {
    const knownLabs = [
        'Konig', 'Zoetis', 'Boehringer Ingelheim', 'Biogenesis Bago', 'Richmond',
        'Syntex', 'Zoovet', 'Leon Pharma', 'Over', 'Von Franken', 'Rio de Janeiro',
        'Burnet', 'Tecnovax', 'Providean', 'Sanidad Animal', 'Bayer', 'Elanco',
        'MSD', 'Pfizer', 'Mevak', 'Labet', 'Holliday-Scott', 'Laboratorio Santa Elena',
        'Biofarm', 'Hipra', 'Merial', 'Virbac', 'Ema'
    ];
    for (const lab of knownLabs) {
        if (collections.toLowerCase().includes(lab.toLowerCase())) {
            return lab;
        }
    }
    // Try to extract an unknown lab from collection fields
    const parts = collections.split(';');
    const nonSpecies = parts.filter(p => {
        const lower = p.trim().toLowerCase();
        return !['bovinos', 'ovinos', 'equinos', 'porcinos', 'veterinaria',
                 'varios', 'otros', 'destacados', 'productos del mes',
                 'sarna'].includes(lower)
            && !lower.includes('antiparasitarios')
            && !lower.includes('antibióticos')
            && !lower.includes('vitamínicos')
            && !lower.includes('vacunas')
            && !lower.includes('antiinflamatorio')
            && !lower.includes('antidiarreicos')
            && !lower.includes('endectocidas')
            && !lower.includes('sincronizador');
    });
    return nonSpecies.length > 0 ? nonSpecies[0].trim() : 'Varios';
}

// Extract volume/weight from product name (e.g. "500ml.", "1kg.", "x 24 Bolos")
function extractVolume(name) {
    const match = name.match(/(\d+[\.,]?\d*\s*(ml|lt|l|kg|gr|g|mg|dosis|bolos|dispositivos)\b.*)/i);
    return match ? match[0].trim() : '';
}

// Extract external link from additionalInfoDescription2 (+ INFO column)
function extractExternalLink(raw) {
    if (!raw) return '';
    const match = raw.match(/href=['"](https?:\/\/[^'"]+)/i);
    return match ? match[1] : '';
}

// Build image URL from Wix image filename
function buildImageUrl(imgFile) {
    if (!imgFile) return 'https://via.placeholder.com/600';
    // Wix static image URL pattern
    const fileId = imgFile.replace('~mv2.png', '').replace('~mv2.jpg', '');
    return `https://static.wixstatic.com/media/${imgFile}`;
}

// --- Main ---
console.log('Reading CSV...');
const raw = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(raw);

console.log(`Total rows (including header): ${rows.length}`);

const headers = rows[0];
console.log('Headers:', headers.slice(0, 10));

// Map indices
const idx = {};
headers.forEach((h, i) => { idx[h.trim()] = i; });

const products = [];
let skipped = 0;

for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length < 5) { skipped++; continue; }
    
    const fieldType = (row[idx['fieldType']] || '').trim();
    if (fieldType !== 'Product') { skipped++; continue; }

    const handleId = (row[idx['handleId']] || '').trim();
    const name = (row[idx['name']] || '').trim();
    if (!name) { skipped++; continue; }

    const descriptionRaw = row[idx['description']] || '';
    const description = stripHtml(descriptionRaw);
    
    const collections = row[idx['collection']] || '';
    const priceRaw = (row[idx['price']] || '0').replace(',', '.');
    const price = parseFloat(priceRaw) || 0;
    const imgFile = (row[idx['productImageUrl']] || '').trim();

    // Additional info columns
    const addTitle1 = row[idx['additionalInfoTitle1']] || '';
    const addDesc1 = row[idx['additionalInfoDescription1']] || '';
    const addTitle2 = row[idx['additionalInfoTitle2']] || '';
    const addDesc2 = row[idx['additionalInfoDescription2']] || '';

    // Extract dose info from the additionalInfoDescription1 (full details)
    const fullDetails = stripHtml(addDesc1);
    
    // Extract dose from details
    const doseMatch = fullDetails.match(/Dosis\s+y\s+Administra[a-z]*:\s*([^.]+\.)/i);
    const dose = doseMatch ? doseMatch[1].trim() : '';

    // Extract drugs
    const drugMatch = fullDetails.match(/Drogas?:\s*([^\n.]{5,120})/i);
    const drugs = drugMatch ? stripHtml(drugMatch[1]).trim() : '';

    const externalLink = extractExternalLink(addDesc2);
    const animalBreeds = extractBreeds(collections);
    const laboratory = extractLaboratory(collections);
    const volumeWeight = extractVolume(name);

    // Use product handleId as stable ID
    const productId = handleId.replace('product_', '');

    products.push({
        id: productId,
        title: name,
        laboratory,
        animalBreeds,
        description: description.substring(0, 400),
        image: buildImageUrl(imgFile),
        volumeWeight,
        dose: dose.substring(0, 300),
        drugs: drugs.substring(0, 200),
        externalLink,
        price
    });
}

console.log(`Parsed products: ${products.length}, skipped rows: ${skipped}`);

// Generate data.js content
const jsContent = `// js/data.js
// Auto-generated from catalog_products.csv on ${new Date().toISOString().split('T')[0]}

// Product catalog (imported from Wix CSV export)
const defaultProducts = ${JSON.stringify(products, null, 2)};

// Initialize database
function initDB() {
    if (!localStorage.getItem('camponuevo_products')) {
        localStorage.setItem('camponuevo_products', JSON.stringify(defaultProducts));
    }
}

// Get all products
function getProducts() {
    initDB();
    const data = localStorage.getItem('camponuevo_products');
    return data ? JSON.parse(data) : [];
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
}

// Delete a product
function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem('camponuevo_products', JSON.stringify(products));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
`;

fs.writeFileSync(outputPath, jsContent, 'utf8');
console.log(`\n✅ Done! Wrote ${products.length} products to ${outputPath}`);
