// js/catalog.js

document.addEventListener('DOMContentLoaded', async () => {
    // Verify getProductsAsync is available
    if (typeof getProductsAsync !== 'function') {
        console.error('getProductsAsync function not found! Make sure data.js is loaded before catalog.js');
        document.getElementById('catalogGrid').innerHTML = '<div class="col-span-full text-center text-red-500 py-8">Error: No se pudo cargar la base de datos de productos.</div>';
        return;
    }
    
    // Elements
    const catalogGrid = document.getElementById('catalogGrid');
    const noResults = document.getElementById('noResults');
    const resultsCountEl = document.getElementById('resultsCount')?.querySelector('span');
    
    // Filter Inputs
    const searchInput = document.getElementById('searchInput');
    const labFilter = document.getElementById('labFilter');
    const catFilter = document.getElementById('catFilter');
    const sortFilter = document.getElementById('sortFilter');
    const breedCheckboxes = document.querySelectorAll('.filter-checkbox');
    const subCatFilter = document.getElementById('subCatFilter');
    const btnResetFilters = document.getElementById('btnResetFilters');
    const resetButtons = document.querySelectorAll('.btn-reset');

    if (!catalogGrid || !resultsCountEl) {
        console.error('Critical catalog elements missing. Aborting load.');
        console.log('catalogGrid:', catalogGrid);
        console.log('resultsCount:', document.getElementById('resultsCount'));
        return;
    }

    // Pagination state
    const PAGE_SIZE = 20;
    let currentPage = 0;
    let filteredProducts = [];
    let isLoading = false;

    // Sentinel element for IntersectionObserver
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.cssText = 'height: 100px; width: 100%;';
    
    // Wait for catalogGrid to be ready before appending sentinel
    if (catalogGrid && catalogGrid.parentElement) {
        catalogGrid.parentElement.appendChild(sentinel);
    } else {
        console.error('Cannot append sentinel - catalogGrid parent not found');
    }

    // Loading spinner
    const loadingEl = document.createElement('div');
    loadingEl.id = 'loadingSpinner';
    loadingEl.innerHTML = `
        <div class="flex justify-center items-center py-10 gap-3 text-gray-400">
            <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm font-medium">Cargando productos...</span>
        </div>
    `;
    loadingEl.classList.add('hidden');
    sentinel.after(loadingEl);

    // Load Data
    console.log('Loading products...');
    let allProducts = typeof getProductsAsync === 'function' ? await getProductsAsync() : [];
    console.log('Products loaded:', allProducts.length);

    // Safety: If products are STILL empty after getProductsAsync, 
    // it might be a corrupted localStorage state. Force re-init.
    if (allProducts.length === 0) {
        console.warn('Catalog empty on load. Forcing database re-initialization.');
        localStorage.removeItem('camponuevo_products');
        allProducts = typeof getProductsAsync === 'function' ? await getProductsAsync() : [];
        console.log('Products after re-init:', allProducts.length);
    }

    // Initialize Labs and Sub-categories Dropdown
    async function initFilters() {
        // Labs
        if (labFilter) {
            const labs = typeof getLaboratories === 'function' ? getLaboratories() : [];
            labFilter.innerHTML = '<option value="">Todos los laboratorios</option>';
            labs.forEach(lab => {
                const option = document.createElement('option');
                option.value = lab;
                option.textContent = lab;
                labFilter.appendChild(option);
            });
        }

        // Categories - getCategories is async so we await it
        if (catFilter) {
            const categories = typeof getCategories === 'function' ? await getCategories() : [];
            catFilter.innerHTML = '<option value="">Todas las categorías</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                catFilter.appendChild(option);
            });
        }

        // Sub-categories
        if (subCatFilter) {
            const subCats = typeof getSubCategories === 'function' ? getSubCategories() : [];
            subCatFilter.innerHTML = '<option value="">Todas las sub-categorías</option>';
            subCats.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                subCatFilter.appendChild(option);
            });
        }
    }

    // Build a single product card HTML (using shared component)
    function buildCard(product, index) {
        return buildProductCard(product, {
            showAnimalIcons: true,
            showSubCategory: true,
            showVolumeWeight: true,
            buttonType: 'addCart',
            imageHeight: 'h-[200px]',
            cardClass: 'rounded-2xl'
        });
    }

    // Apply filters and sorting → rebuild filteredProducts, reset pagination
    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedLab = labFilter ? labFilter.value : '';
        const selectedCat = catFilter ? catFilter.value : '';
        const sortMode = sortFilter ? sortFilter.value : 'newest';
        const selectedBreeds = breedCheckboxes 
            ? Array.from(breedCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
            : [];

        const selectedSubCat = subCatFilter ? subCatFilter.value : '';

        filteredProducts = allProducts.filter(product => {
            // Search in ALL product fields (subcadena search)
            const searchText = [
                product.title || '',
                product.laboratory || '',
                product.description || '',
                product.drugs || '',
                product.subCategory || '',
                (product.subCategories && product.subCategories.length > 0) ? product.subCategories.join(' ') : '',
                (product.labels && product.labels.length > 0) ? product.labels.join(' ') : '',
                (product.animalBreeds && product.animalBreeds.length > 0) ? product.animalBreeds.join(' ') : ''
            ].join(' ').toLowerCase();
            
            // Check if search term is found anywhere in the product text
            const matchSearch = searchTerm === '' || searchText.includes(searchTerm);
            
            const matchLab = selectedLab === '' || 
                product.laboratory === selectedLab || 
                (product.laboratories && product.laboratories.includes(selectedLab));
            
            // Category filter: check if product's subCategories belong to selected category
            let matchCat = true;
            if (selectedCat !== '') {
                if (typeof getCategories === 'function') {
                    const categories = getCategories();
                    const category = categories.find(c => c.id === selectedCat);
                    if (category && category.subCategories.length > 0) {
                        const productSubCats = product.subCategories || [];
                        matchCat = productSubCats.some(subCat => category.subCategories.includes(subCat));
                    } else {
                        matchCat = false;
                    }
                }
            }
            
            const matchSubCat = selectedSubCat === '' || 
                product.subCategory === selectedSubCat || 
                (product.subCategories && product.subCategories.includes(selectedSubCat));
            const matchBreed = selectedBreeds.length === 0 ||
                ((product.animalBreeds || []).some(breed => selectedBreeds.includes(breed)));
            return matchSearch && matchLab && matchCat && matchSubCat && matchBreed;
        });

        // Sorting
        filteredProducts.sort((a, b) => {
            switch (sortMode) {
                case 'price_asc':  return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                case 'name_asc':   return a.title.localeCompare(b.title);
                case 'newest':
                default:
                    // Products from CSV have stable index-based ordering; treat array position as "recency"
                    return allProducts.indexOf(a) - allProducts.indexOf(b);
            }
        });

        // Update count
        resultsCountEl.textContent = filteredProducts.length;

        // Reset pagination and grid
        currentPage = 0;
        catalogGrid.innerHTML = '';

        if (filteredProducts.length === 0) {
            noResults.classList.remove('hidden');
            sentinel.classList.add('hidden');
        } else {
            noResults.classList.add('hidden');
            sentinel.classList.remove('hidden');
            loadNextPage();
        }
    }

    // Append the next PAGE_SIZE products without clearing the grid
    function loadNextPage() {
        if (isLoading) {
            console.log('Already loading, skipping...');
            return;
        }
        
        const start = currentPage * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const slice = filteredProducts.slice(start, end);

        console.log('Loading page', currentPage, 'products:', slice.length, 'total:', filteredProducts.length);
        
        if (slice.length === 0) {
            console.log('No more products to load');
            sentinel.classList.add('hidden');
            return;
        }

        isLoading = true;
        loadingEl.classList.remove('hidden');

        // Small timeout for perceived smoothness
        setTimeout(() => {
            const fragment = document.createDocumentFragment();
            slice.forEach((product, i) => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = buildCard(product, i);
                if (wrapper.firstElementChild) {
                    fragment.appendChild(wrapper.firstElementChild);
                }
            });
            catalogGrid.appendChild(fragment);
            currentPage++;

            // If no more products, hide sentinel so observer stops firing
            if (currentPage * PAGE_SIZE >= filteredProducts.length) {
                sentinel.classList.add('hidden');
                console.log('All products loaded');
            }

            loadingEl.classList.add('hidden');
            isLoading = false;
            bindCartButtons();
        }, 150);
    }

    function bindCartButtons() {
        document.querySelectorAll('.btn-add-cart-fast').forEach(btn => {
            // Remove existing listener to avoid duplicates if re-binding
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const product = allProducts.find(p => p.id === id);
                if (product) {
                    addToCart(product, 1);
                    if (typeof updateHeaderCartCount === 'function') updateHeaderCartCount();
                    
                    // Open cart drawer for feedback
                    const btnOpenCart = document.getElementById('btnOpenCart');
                    if (btnOpenCart) btnOpenCart.click();
                }
            };
        });
    }

    // IntersectionObserver watches the sentinel at the bottom
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadNextPage();
            }
        });
    }, {
        root: null,
        rootMargin: '200px', // start loading 200px before sentinel comes into view
        threshold: 0
    });

    observer.observe(sentinel);

    // Breed Filter Dropdown Logic
    const breedFilterBtn = document.getElementById('breedFilterBtn');
    const breedFilterDropdown = document.getElementById('breedFilterDropdown');
    const breedFilterChevron = document.getElementById('breedFilterChevron');
    const breedFilterText = document.getElementById('breedFilterText');
    
    function updateBreedFilterText() {
        if (!breedFilterText) return;
        const selected = Array.from(breedCheckboxes).filter(cb => cb.checked);
        if (selected.length === 0) {
            breedFilterText.textContent = 'Todas las especies';
        } else if (selected.length === 1) {
            const value = selected[0].value;
            const labels = { bovino: 'Bovino', ovino: 'Ovino', equino: 'Equino', porcino: 'Porcino', caninos: 'Caninos', felinos: 'Felinos' };
            breedFilterText.textContent = labels[value] || value;
        } else {
            breedFilterText.textContent = `${selected.length} especies`;
        }
    }

    // Reset Filters
    function resetFilters() {
        if (catFilter) catFilter.value = '';
        if (subCatFilter) subCatFilter.value = '';
        if (sortFilter) sortFilter.value = 'newest';
        breedCheckboxes.forEach(cb => cb.checked = false);
        updateBreedFilterText();
        applyFilters();
    }
    
    if (breedFilterBtn && breedFilterDropdown) {
        breedFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            breedFilterDropdown.classList.toggle('hidden');
            breedFilterChevron.classList.toggle('rotate-180');
        });
        
        document.addEventListener('click', (e) => {
            if (!breedFilterBtn.contains(e.target) && !breedFilterDropdown.contains(e.target)) {
                breedFilterDropdown.classList.add('hidden');
                breedFilterChevron.classList.remove('rotate-180');
            }
        });
        
        breedCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                updateBreedFilterText();
                applyFilters();
            });
        });
    }

    // Bind Events
    searchInput.addEventListener('input', applyFilters);
    labFilter.addEventListener('change', applyFilters);
    catFilter.addEventListener('change', () => {
        applyFilters();
    });
    sortFilter.addEventListener('change', applyFilters);
    breedCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
    subCatFilter.addEventListener('change', applyFilters);

    // Update sub-categories when category changes
    function updateSubCategoriesForCategory(categoryId) {
        if (!subCatFilter) return;
        
        subCatFilter.innerHTML = '<option value="">Todas las sub-categorías</option>';
        
        if (categoryId && typeof getCategoryById === 'function') {
            const category = getCategoryById(categoryId);
            if (category && category.subCategories && category.subCategories.length > 0) {
                category.subCategories.forEach(subCat => {
                    const option = document.createElement('option');
                    option.value = subCat;
                    option.textContent = subCat;
                    subCatFilter.appendChild(option);
                });
            }
        }
        
        subCatFilter.value = '';
    }

    // Initialize sub-categories dropdown based on default (empty) category
    updateSubCategoriesForCategory('');

    // Listen for category changes to update sub-categories
    catFilter.addEventListener('change', (e) => {
        updateSubCategoriesForCategory(e.target.value);
    });

    if (btnResetFilters) btnResetFilters.addEventListener('click', resetFilters);
    resetButtons.forEach(btn => btn.addEventListener('click', resetFilters));

    // Entrance animation keyframes
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes dropIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .product-card { will-change: transform; }
    `;
    document.head.appendChild(style);

    // Initial load
    await initFilters();
    sortFilter.value = 'newest'; // default sort: newest first
    
    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && searchInput) {
        searchInput.value = searchParam;
    }
    
    // Check for category parameter in URL
    const categoryParam = urlParams.get('category');
    if (categoryParam && catFilter) {
        catFilter.value = categoryParam;
        updateSubCategoriesForCategory(categoryParam);
    }
    
    applyFilters();
});
