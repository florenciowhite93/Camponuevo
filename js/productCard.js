// js/productCard.js

// breedLabel is defined in animalIcons.js

function getImageUrl(image) {
    if (!image) return 'https://placehold.co/400x300?text=Sin+Imagen';
    
    // Handle multiple images separated by semicolon - take first one
    if (typeof image === 'string' && image.includes(';')) {
        image = image.split(';')[0].trim();
    }
    
    // Handle array of images - take first one
    if (Array.isArray(image)) {
        image = image[0];
    }
    
    // If it's a local path starting with /img/, use localhost
    if (image.startsWith('/img/')) {
        return 'http://localhost:3000' + image;
    }
    
    // If it's already a full URL, use it directly
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }
    
    // Default placeholder
    return 'https://placehold.co/400x300?text=Imagen';
}

function buildProductCard(product, options = {}) {
    const {
        showAnimalIcons = true,
        showSubCategory = true,
        showVolumeWeight = true,
        buttonType = 'viewMore', // 'viewMore' | 'addCart'
        imageHeight = 'h-56',
        cardClass = ''
    } = options;

    const priceStr = product.price > 0
        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price)
        : '<span class="text-sm font-semibold text-amber-600">Consultar precio</span>';

    // Animal icons
    // Animal icons - use the shared animalIcons.js
    let iconsHtml = '';
    if (showAnimalIcons) {
        const breeds = product.animalBreeds || [];
        if (typeof getAnimalIconsHtml === 'function') {
            iconsHtml = getAnimalIconsHtml(breeds);
        } else {
            // Fallback if animalIcons.js not loaded
            iconsHtml = breeds.map(b => {
                const label = breedLabel[b] || b;
                return `<span class="inline-flex items-center gap-1 text-[10px] bg-white border border-green-100 text-primary px-1.5 py-0.5 rounded-full shadow-sm capitalize font-medium" title="${label}">${label}</span>`;
            }).join('');
        }
    }

    // Labels
    let labelsHtml = '';
    if (product.labels && product.labels.length > 0) {
        product.labels.forEach((label, i) => {
            const labelColor = typeof getColorForLabel === 'function' ? getColorForLabel(label) : '#2d5a27';
            const topPos = 4 + (i * 9);
            labelsHtml += `<span class="absolute top-${topPos} left-4 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg z-10 uppercase tracking-tighter" style="background-color: ${labelColor}">${label}</span>`;
        });
    }

    // Subcategory
    let subCatHtml = '';
    if (showSubCategory) {
        const subCat = (product.subCategories && product.subCategories.length > 0) 
            ? product.subCategories[0] 
            : product.subCategory;
        if (subCat) {
            subCatHtml = `<div class="text-[10px] font-bold text-gray-400 uppercase bg-white px-1.5 py-0.5 rounded border border-gray-100">${subCat}</div>`;
        }
    }

    // Volume/Weight
    let volumeHtml = '';
    if (showVolumeWeight && product.volumeWeight) {
        volumeHtml = `<span class="text-[11px] text-gray-400 block mb-0.5">${product.volumeWeight}</span>`;
    }

    // Button
    let buttonHtml = '';
    if (buttonType === 'viewMore') {
        buttonHtml = `<a href="product.html?id=${product.id}" class="bg-primary hover:bg-dark text-white px-5 py-2 rounded-full transition text-sm font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5">Ver más</a>`;
    } else if (buttonType === 'addCart') {
        buttonHtml = `<button class="bg-primary hover:bg-dark text-white w-10 h-10 rounded-xl flex items-center justify-center transition shadow-sm flex-shrink-0 btn-add-cart-fast" data-id="${product.id}" title="Añadir al carrito"><i class="fas fa-cart-plus text-sm"></i></button>`;
    }

    return `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-md border border-transparent hover:border-primary flex flex-col h-full group transition duration-300 ${cardClass}" style="transform: translateY(0);">
            ${labelsHtml}
            <a href="product.html?id=${product.id}" class="block relative ${imageHeight} overflow-hidden bg-gray-100 flex items-center justify-center">
                <img src="${getImageUrl(product.image)}" alt="${product.title}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/400x300?text=Sin+Imagen'">
                <div class="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition"></div>
                ${iconsHtml ? `
                    <div class="absolute bottom-2 left-2 flex flex-wrap gap-1 z-10">
                        ${iconsHtml}
                    </div>
                ` : ''}
            </a>
            <div class="p-6 flex flex-col flex-grow">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">${product.laboratory}</div>
                    ${subCatHtml}
                </div>
                <h3 class="text-xl font-bold mb-2 text-gray-800 line-clamp-2"><a href="product.html?id=${product.id}" class="hover:text-primary transition">${product.title}</a></h3>
                <p class="text-sm text-gray-500 mb-4 line-clamp-2">${product.description}</p>
                
                <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                        ${volumeHtml}
                        <span class="text-xl font-black text-gray-900">${priceStr}</span>
                    </div>
                    ${buttonHtml}
                </div>
            </div>
        </div>
    `;
}
