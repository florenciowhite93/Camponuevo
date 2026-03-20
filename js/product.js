// js/product.js

document.addEventListener('DOMContentLoaded', async () => {
    // Elements
    const loader = document.getElementById('loader');
    const productNotFound = document.getElementById('productNotFound');
    const productWrapper = document.getElementById('productWrapper');
    const relatedSection = document.getElementById('relatedSection');

    // Breadcrumbs
    const bcTitle = document.getElementById('bcTitle');

    // Details text
    const productTitle = document.getElementById('productTitle');
    const productLaboratories = document.getElementById('productLaboratories');
    const productPrice = document.getElementById('productPrice');
    const productDescription = document.getElementById('productDescription');
    const productVol = document.getElementById('productVol');
    const productBreeds = document.getElementById('productBreeds');
    const productDrugs = document.getElementById('productDrugs');
    const productImage = document.getElementById('productImage');
    const productSubCategories = document.getElementById('productSubCategories');
    
    // Buttons
    const btnAddToCart = document.getElementById('btnAddToCart');
    const btnWhatsApp = document.getElementById('btnWhatsApp');
    const btnExternal = document.getElementById('btnExternal');
    const cartCount = document.getElementById('cartCount');

    // Animal icons mapper
    const animalIconsMap = {
        bovino: '<i class="fas fa-cow text-2xl" title="Bovino"></i>',
        ovino: '<i class="fas fa-sheep text-2xl" title="Ovino"></i>', // Using sheep icon if available or just text
        equino: '<i class="fas fa-horse text-2xl" title="Equino"></i>',
        porcino: '<i class="fas fa-pig text-2xl" title="Porcino"></i>' // Using generic or specific if fontawesome has it
        // Or we can use generic SVGs. We'll try fontawesome 6 icons.
    };

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    async function loadProduct() {
        if (!productId) {
            showNotFound();
            return;
        }

        const products = await getProductsAsync();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            showNotFound();
            return;
        }

        // Populate fields
        bcTitle.textContent = product.title;
        productTitle.textContent = product.title;
        // Laboratories
        if (productLaboratories) {
            const labs = product.laboratories || (product.laboratory ? [product.laboratory] : []);
            productLaboratories.innerHTML = labs.map(lab => 
                `<span class="text-[11px] font-bold text-primary uppercase bg-green-50 px-2 py-1 rounded border border-green-100">${lab}</span>`
            ).join('');
        }
        productPrice.textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price);
        productDescription.textContent = product.description;
        productVol.textContent = product.volumeWeight || '--';
        productBreeds.textContent = (product.animalBreeds || []).join(', ');

        // Sub-categories
        if (productSubCategories) {
            const subCats = product.subCategories || (product.subCategory ? [product.subCategory] : []);
            productSubCategories.innerHTML = subCats.map(cat => 
                `<span class="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded border border-gray-100">${cat}</span>`
            ).join('');
        }
        
        // Dose: hide if empty
        if (product.dose) {
            document.getElementById('productDose').textContent = product.dose;
        } else {
            const doseSection = document.getElementById('doseSection');
            if (doseSection) doseSection.classList.add('hidden');
        }

        // Drugs: render as bulleted list items - handle both array and string
        if (product.drugs) {
            let drugItems;
            if (Array.isArray(product.drugs)) {
                drugItems = product.drugs.map(d => d.trim()).filter(d => d.length > 1);
            } else {
                drugItems = product.drugs
                    .split(/[;,](?![^(]*\))/g)
                    .map(d => d.trim())
                    .filter(d => d.length > 1);
            }
            
            if (drugItems.length > 1) {
                productDrugs.innerHTML = drugItems.map(d =>
                    `<li class="flex items-start gap-2"><span class="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0"></span><span>${d}</span></li>`
                ).join('');
            } else {
                // Single item: just show as one pill
                productDrugs.innerHTML = `<li class="flex items-start gap-2"><span class="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0"></span><span>${product.drugs}</span></li>`;
            }
        } else {
            document.getElementById('drugsSection').classList.add('hidden');
        }
        
        // Helper function to get full image URL
        function getImageUrl(image) {
            if (!image) return 'https://placehold.co/600x400?text=Sin+Imagen';
            if (image.startsWith('http://') || image.startsWith('https://')) return image;
            if (image.startsWith('/img/')) return window.location.origin + image;
            return 'https://placehold.co/600x400?text=Imagen';
        }
        
        productImage.src = getImageUrl(product.image);

        // Animal SVG icons - use shared animalIcons.js
        if (typeof getAnimalIconsHtml === 'function') {
            const breeds = product.animalBreeds || [];
            const iconsHtml = breeds.map(b => {
                const icon = getAnimalIcon(b, 24) || '<i class="fas fa-paw"></i>';
                return `
                    <div class="bg-white p-3 rounded-full shadow-md text-primary" title="${breedLabel[b] || b}">
                        ${icon}
                    </div>
                `;
            }).join('');
            document.getElementById('animalIcons').innerHTML = iconsHtml;
        } else {
            // Fallback
            const animalIconsMap = {
                bovino: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10s.5-3 4-3 4 3 4 3"/><path d="M14 10s.5-3 4-3 4 3 4 3"/><path d="M6 17h12"/><path d="M8 10v6"/><path d="M16 10v6"/><ellipse cx="12" cy="18" rx="4" ry="2"/><path d="M8 3 6 7"/><path d="M16 3l2 4"/></svg>`,
                ovino:  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="4"/><path d="M8 9c0-2 1-4 4-5"/><path d="M16 9c0-2-1-4-4-5"/><path d="M9 13v5"/><path d="M15 13v5"/><path d="M9 18h6"/></svg>`,
                equino: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 0-2 2-2 5s2 4 2 7"/><path d="M10 7H7l-2 4 1 7h8l1-7-2-4z"/><path d="M9 18l-1 4"/><path d="M15 18l1 4"/></svg>`,
                porcino:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><circle cx="10" cy="11" r="1" fill="currentColor"/><circle cx="14" cy="11" r="1" fill="currentColor"/><path d="M9 14s1 1 3 1 3-1 3-1"/><path d="M18 8l3-2"/></svg>`,
                caninos:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5.172a4 4 0 0 0-5.656 5.656l.707.707a10 10 0 1 0 14.142 0l.707-.707a4 4 0 1 0-5.656-5.656l-1.414 1.414-1.414-1.414z"/></svg>`,
                felinos:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26a5 5 0 0 0-4-4.26V3a2 2 0 0 0 4 0V1a5 5 0 0 0-4 4.26c.65-.17 1.33-.26 2-.26zM7 10v2a5 5 0 0 0 10 0v-2a3 3 0 0 0-6 0v1h2v-1a1 1 0 0 1 2 0v2a3 3 0 0 1-6 0v-2a3 3 0 0 1 3-3V5a5 5 0 0 0-5 5z"/></svg>`
            };
            const iconsHtml = (product.animalBreeds || []).map(b => {
                const svg = animalIconsMap[b] || '<i class="fas fa-paw"></i>';
                return `
                    <div class="bg-white p-3 rounded-full shadow-md text-primary" title="${b}">
                        ${svg}
                    </div>
                `;
            }).join('');
            document.getElementById('animalIcons').innerHTML = iconsHtml;
        }

        // External Link
        if (product.externalLink) {
            btnExternal.href = product.externalLink;
            btnExternal.classList.remove('hidden');
        }

        // WhatsApp Link
        const waMessage = encodeURIComponent(`Hola Camponuevo, me interesa el producto: *${product.title}* de ${product.laboratory}.`);
        btnWhatsApp.href = `https://wa.me/5491112345678?text=${waMessage}`;

        // Add to cart click
        btnAddToCart.addEventListener('click', () => {
            addToCart(product, 1);
            if (typeof updateHeaderCartCount === 'function') updateHeaderCartCount();
            
            // Open cart drawer for feedback
            const btnOpenCart = document.getElementById('btnOpenCart');
            if (btnOpenCart) btnOpenCart.click();
        });

        // Load specific related
        loadRelated(product);

        // Show UI
        loader.classList.add('hidden');
        productWrapper.classList.remove('hidden');
        productWrapper.classList.add('flex');
    }

    function showNotFound() {
        loader.classList.add('hidden');
        productNotFound.classList.remove('hidden');
    }

    function loadRelated(currentProduct) {
        const allProducts = getProducts();
        
        // Find products with similar breeds or laboratory, excluding current
        const related = allProducts.filter(p => {
            if (p.id === currentProduct.id) return false;
            
            // Match lab or at least one breed
            const sameLab = p.laboratory === currentProduct.laboratory;
            const sharedBreeds = p.animalBreeds.some(b => currentProduct.animalBreeds.includes(b));
            
            return sameLab || sharedBreeds;
        }).slice(0, 4); // Max 4 items

        if (related.length > 0) {
            const container = document.getElementById('relatedContainer');
            
            related.forEach(p => {
                const priceStr = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(p.price);
                
                const card = document.createElement('a');
                card.href = `product.html?id=${p.id}`;
                card.className = 'bg-white rounded-xl overflow-hidden shadow-md transition duration-300 transform hover:-translate-y-1 block border border-transparent hover:border-primary';
                
                card.innerHTML = `
                    <div class="relative flex items-center justify-center bg-white p-4" style="height:160px; border-bottom: 1px solid #f0f0f0;">
                        <img src="${p.image || 'https://placehold.co/400x300?text=Sin+Imagen'}" alt="${p.title}" class="w-full h-full object-contain" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=Sin+Imagen'">
                    </div>
                    <div class="p-5">
                        <div class="text-xs text-gray-500 mb-1">${p.laboratory}</div>
                        <h4 class="text-lg font-bold text-gray-800 mb-2 truncate">${p.title}</h4>
                        <div class="flex justify-between items-center mt-4">
                            <span class="font-bold text-primary">${priceStr}</span>
                            <span class="text-sm text-gray-400"><i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            relatedSection.classList.remove('hidden');
        }
    }

    // Initialize
    setTimeout(loadProduct, 300); // Small fake delay for loading immersion

    // Image hover effect - move based on mouse position
    const imgPanel = document.querySelector('.img-panel');
    const productImg = document.getElementById('productImage');
    
    if (imgPanel && productImg) {
        imgPanel.addEventListener('mousemove', (e) => {
            const rect = imgPanel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            // Use transform-origin to center zoom on mouse position
            productImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            productImg.style.transform = 'scale(1.5)';
        });
        
        imgPanel.addEventListener('mouseleave', () => {
            productImg.style.transformOrigin = 'center center';
            productImg.style.transform = 'scale(1)';
        });
    }
    
    // Collapsible additional details section
    const toggleBtn = document.getElementById('toggleDetailsBtn');
    const detailsContent = document.getElementById('additionalDetailsContent');
    const toggleIcon = document.getElementById('toggleDetailsIcon');
    
    if (toggleBtn && detailsContent) {
        toggleBtn.addEventListener('click', () => {
            if (detailsContent.classList.contains('hidden')) {
                detailsContent.classList.remove('hidden');
                toggleIcon.style.transform = 'rotate(0deg)';
            } else {
                detailsContent.classList.add('hidden');
                toggleIcon.style.transform = 'rotate(-90deg)';
            }
        });
    }
});
