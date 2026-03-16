const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeProducts() {
    console.log('Iniciando scraping de productos...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Navegar a la página de productos
        console.log('Navegando a https://www.camponuevosrl.com/productos...');
        await page.goto('https://www.camponuevosrl.com/productos', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Esperar a que los productos se carguen
        console.log('Esperando a que se carguen los productos...');
        await page.waitForSelector('.product-item, .producto, [class*="product"]', { timeout: 10000 })
            .catch(() => console.log('No se encontró selector específico, intentando extraer de todos los elementos'));

        // Extraer productos
        console.log('Extrayendo datos de productos...');
        const products = await page.evaluate(() => {
            const items = [];
            
            // Intentar diferentes selectores
            const selectors = [
                '.product-item',
                '.producto',
                '[class*="product"]',
                '.item-producto',
                '.product-card'
            ];
            
            let productElements = [];
            for (const selector of selectors) {
                productElements = document.querySelectorAll(selector);
                if (productElements.length > 0) break;
            }
            
            // Si no se encontraron con clases específicas, intentar extraer de estructuras comunes
            if (productElements.length === 0) {
                // Buscar elementos que contengan nombre y precio
                const allElements = document.querySelectorAll('*');
                productElements = Array.from(allElements).filter(el => {
                    return el.textContent && el.textContent.includes('$') && el.textContent.length > 20;
                });
            }

            productElements.forEach((element, index) => {
                const text = element.textContent || '';
                
                // Intentar extraer nombre y precio
                let title = '';
                let price = '';
                let laboratory = '';
                let category = '';
                
                // Buscar el título (generalmente el primer texto significativo)
                const titleElement = element.querySelector('h1, h2, h3, h4, .title, .nombre, .product-title');
                if (titleElement) {
                    title = titleElement.textContent.trim();
                } else {
                    // Intentar extraer del texto del elemento
                    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
                    if (lines.length > 0) {
                        title = lines[0];
                    }
                }
                
                // Buscar precio
                const priceElement = element.querySelector('.price, .precio, [class*="price"]');
                if (priceElement) {
                    price = priceElement.textContent.trim();
                } else {
                    // Buscar en el texto
                    const priceMatch = text.match(/\$[\d.,]+/);
                    if (priceMatch) {
                        price = priceMatch[0];
                    }
                }
                
                // Limpiar precio (quitar signo $ y separadores de miles)
                price = price.replace(/[^\d.,]/g, '').replace(',', '').replace('.', '');
                
                // Buscar laboratorio
                const labElement = element.querySelector('.laboratory, .lab, [class*="lab"]');
                if (labElement) {
                    laboratory = labElement.textContent.trim();
                }
                
                // Buscar categoría
                const catElement = element.querySelector('.category, .cat, [class*="cat"]');
                if (catElement) {
                    category = catElement.textContent.trim();
                }
                
                // Solo agregar si tenemos título y precio
                if (title && price) {
                    items.push({
                        id: `product_${Date.now()}_${index}`,
                        title: title,
                        price: parseFloat(price) || 0,
                        laboratory: laboratory,
                        description: '',
                        subcategory: category,
                        subcategories: [],
                        animalbreeds: [],
                        volume: '',
                        image: '',
                        drugs: [],
                        dose: '',
                        externallink: ''
                    });
                }
            });
            
            return items;
        });

        console.log(`Se extrajeron ${products.length} productos`);
        
        if (products.length === 0) {
            console.log('No se encontraron productos. Guardando HTML para análisis...');
            const html = await page.content();
            fs.writeFileSync(path.join(__dirname, '..', 'scraped_page.html'), html);
            console.log('HTML guardado en scraped_page.html');
        }

        // Guardar como CSV compatible con Supabase
        const csvPath = path.join(__dirname, '..', 'scraped_products.csv');
        const csvContent = [
            ['id', 'title', 'price', 'laboratory', 'description', 'subcategory', 'subcategories', 'animalbreeds', 'volume', 'image', 'drugs', 'dose', 'externallink'].join(','),
            ...products.map(p => [
                p.id,
                `"${p.title.replace(/"/g, '""')}"`,
                p.price,
                `"${p.laboratory.replace(/"/g, '""')}"`,
                `"${p.description.replace(/"/g, '""')}"`,
                `"${p.subcategory.replace(/"/g, '""')}"`,
                `"${p.subcategories.join(';')}"`,
                `"${p.animalbreeds.join(';')}"`,
                `"${p.volume}"`,
                `"${p.image}"`,
                `"${p.drugs.join(';')}"`,
                `"${p.dose}"`,
                `"${p.externallink}"`
            ].join(','))
        ].join('\n');

        fs.writeFileSync(csvPath, csvContent, 'utf8');
        console.log(`CSV guardado en: ${csvPath}`);

        // Guardar también como JSON para depuración
        const jsonPath = path.join(__dirname, '..', 'scraped_products.json');
        fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf8');
        console.log(`JSON guardado en: ${jsonPath}`);

    } catch (error) {
        console.error('Error durante el scraping:', error);
    } finally {
        await browser.close();
    }
}

scrapeProducts();
