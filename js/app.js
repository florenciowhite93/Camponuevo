// js/app.js

document.addEventListener('DOMContentLoaded', async () => {
    // Verify getProductsAsync is available
    if (typeof getProductsAsync !== 'function') {
        console.error('getProductsAsync function not found! Make sure data.js is loaded before app.js');
        document.getElementById('featuredContainer').innerHTML = '<div class="col-span-full text-center text-red-500 py-8">Error: No se pudo cargar la base de datos de productos.</div>';
        return;
    }
    
    const featuredContainer = document.getElementById('featuredContainer');
    
    // Render featured products
    async function renderFeaturedProducts() {
        if (!featuredContainer) return;

        const allProducts = await getProductsAsync();
        
        // Filter products with "Productos destacados" subcategory
        const featured = allProducts.filter(p => {
            const subCats = p.subCategories || [];
            return subCats.includes('Productos destacados');
        }).slice(0, 8);
        
        if (featured.length === 0) {
            featuredContainer.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No hay productos destacados disponibles.</div>';
            return;
        }

        featuredContainer.innerHTML = '';
        
        featured.forEach((product) => {
            featuredContainer.innerHTML += buildProductCard(product, {
                showAnimalIcons: true,
                showSubCategory: true,
                showVolumeWeight: true,
                buttonType: 'viewMore',
                imageHeight: 'h-[200px]',
                cardClass: 'rounded-2xl'
            });
        });
    }

    // Initialize
    renderFeaturedProducts();
});
