// js/admin.js

// Helper function to get full image URL
function getImageUrl(image) {
    if (!image) return 'https://placehold.co/40x40?text=Sin+Img';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.startsWith('/img/')) return window.location.origin + image;
    return 'https://placehold.co/40x40?text=Img';
}

document.addEventListener('DOMContentLoaded', () => {
    try {
    // Initialize categories (migrate if needed)
    migrateSubCategoriesToCategories();
    
    // Elements
    const productsTableBody = document.getElementById('productsTableBody');
    const emptyState = document.getElementById('emptyState');
    const btnNewProduct = document.getElementById('btnNewProduct');
    const productModal = document.getElementById('productModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancel = document.getElementById('btnCancel');
    const btnSave = document.getElementById('btnSave');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    let currentEditProductId = null;
    
    // File Upload Elements
    const imageInput = document.getElementById('image');
    const imageUploadUrl = document.getElementById('image'); // The text input for URL
    const imageUploadFile = document.getElementById('imageUpload');
    const imageBase64 = document.getElementById('imageBase64');
    const imageDropzone = document.getElementById('imageDropzone');
    const dropzonePrompt = document.getElementById('dropzonePrompt');
    const dropzonePreview = document.getElementById('dropzonePreview');
    const previewImg = document.getElementById('previewImg');
    const btnRemoveImage = document.getElementById('btnRemoveImage');
    
    // Bulk Action Elements
    const selectAllCheckbox = document.getElementById('selectAll');
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    const btnBulkPrice = document.getElementById('btnBulkPrice');
    const btnBulkLabels = document.getElementById('btnBulkLabels');
    const btnBulkSubCats = document.getElementById('btnBulkSubCats');
    let selectedProductIds = new Set();
    
    // Bulk Edit Modal Elements
    const bulkLabelsModal = document.getElementById('bulkLabelsModal');
    const btnCloseBulkLabelsModal = document.getElementById('btnCloseBulkLabelsModal');
    const btnCancelBulkLabels = document.getElementById('btnCancelBulkLabels');
    const btnApplyBulkLabels = document.getElementById('btnApplyBulkLabels');
    const bulkLabelsCount = document.getElementById('bulkLabelsCount');
    const bulkLabelsSelectedPills = document.getElementById('bulkLabelsSelectedPills');
    const bulkLabelsSearch = document.getElementById('bulkLabelsSearch');
    const btnAddBulkLabelInline = document.getElementById('btnAddBulkLabelInline');
    const bulkLabelsDropdown = document.getElementById('bulkLabelsDropdown');
    const bulkLabelsResults = document.getElementById('bulkLabelsResults');
    let bulkSelectedLabels = [];
    
    const bulkSubCatsModal = document.getElementById('bulkSubCatsModal');
    const btnCloseBulkSubCatsModal = document.getElementById('btnCloseBulkSubCatsModal');
    const btnCancelBulkSubCats = document.getElementById('btnCancelBulkSubCats');
    const btnApplyBulkSubCats = document.getElementById('btnApplyBulkSubCats');
    const bulkSubCatsCount = document.getElementById('bulkSubCatsCount');
    const bulkSubCatsSelectedPills = document.getElementById('bulkSubCatsSelectedPills');
    const bulkSubCatsSearch = document.getElementById('bulkSubCatsSearch');
    const btnAddBulkSubCatInline = document.getElementById('btnAddBulkSubCatInline');
    const bulkSubCatsDropdown = document.getElementById('bulkSubCatsDropdown');
    const bulkSubCatsResults = document.getElementById('bulkSubCatsResults');
    let bulkSelectedSubCats = [];
    
    // Bulk Delete Modal Elements
    const bulkDeleteModal = document.getElementById('bulkDeleteModal');
    const btnCloseBulkDeleteModal = document.getElementById('btnCloseBulkDeleteModal');
    const btnCancelBulkDelete = document.getElementById('btnCancelBulkDelete');
    const btnConfirmBulkDelete = document.getElementById('btnConfirmBulkDelete');
    const bulkDeleteCount = document.getElementById('bulkDeleteCount');
    const bulkDeleteConfirmInput = document.getElementById('bulkDeleteConfirmInput');
    const btnBulkDelete = document.getElementById('btnBulkDelete');
    
    // Auth & Filter Elements
    const loginScreen = document.getElementById('loginScreen');
    const adminApp = document.getElementById('adminApp');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const btnLogout = document.getElementById('btnLogout');
    const adminSearch = document.getElementById('adminSearch');
    const adminLabFilter = document.getElementById('adminLabFilter');
    const labFilterDropdown = document.getElementById('labFilterDropdown');
    const labFilterResults = document.getElementById('labFilterResults');
    let selectedLabFilter = '';

    // Tab & View Elements
    const tabProducts = document.getElementById('tabProducts');
    const tabClients = document.getElementById('tabClients');
    const tabCats = document.getElementById('tabCats');
    const tabSubCats = document.getElementById('tabSubCats');
    const tabLabs = document.getElementById('tabLabs');
    const tabLabels = document.getElementById('tabLabels');
    const viewProducts = document.getElementById('viewProducts');
    const viewClients = document.getElementById('viewClients');
    const viewCats = document.getElementById('viewCats');
    const viewSubCats = document.getElementById('viewSubCats');
    const viewLabs = document.getElementById('viewLabs');
    const viewLabels = document.getElementById('viewLabels');

    // Client Elements
    const clientsContainer = document.getElementById('clientsContainer');
    const clientsEmptyState = document.getElementById('clientsEmptyState');
    const clientSearch = document.getElementById('clientSearch');
    const clientModal = document.getElementById('clientModal');
    const clientModalTitle = document.getElementById('clientModalTitle');
    const clientIdInput = document.getElementById('clientId');
    const clientNameInput = document.getElementById('clientName');
    const clientEmailInput = document.getElementById('clientEmail');
    const clientPhoneInput = document.getElementById('clientPhone');
    const clientLocationInput = document.getElementById('clientLocation');
    const clientIdentificationInput = document.getElementById('clientIdentification');
    const clientOrdersSection = document.getElementById('clientOrdersSection');
    const clientOrdersList = document.getElementById('clientOrdersList');
    const btnNewClient = document.getElementById('btnNewClient');
    const btnSaveClient = document.getElementById('btnSaveClient');
    const btnDeleteClient = document.getElementById('btnDeleteClient');
    const btnCloseClientModal = document.getElementById('btnCloseClientModal');
    const btnCancelClient = document.getElementById('btnCancelClient');

    // Sub-category Picker Elements (Product Modal)
    const subCatPicker = document.getElementById('subCatPicker');
    const subCatSelectedPills = document.getElementById('subCatSelectedPills');
    const subCatSearch = document.getElementById('subCatSearch');
    const btnAddNewSubCatInline = document.getElementById('btnAddNewSubCatInline');
    const subCatDropdown = document.getElementById('subCatDropdown');
    const subCatResults = document.getElementById('subCatResults');
    let selectedSubCategories = []; // Local state for the modal

    // Lab Select Elements (Product Modal)
    const labSelect = document.getElementById('labSelect');
    const btnShowLabNew = document.getElementById('btnShowLabNew');
    const labNewOption = document.getElementById('labNewOption');
    let selectedLaboratory = ''; // Single lab selection

    // Label Picker Elements (Product Modal)
    const labelPicker = document.getElementById('labelPicker');
    const labelSelectedPills = document.getElementById('labelSelectedPills');
    const labelSearch = document.getElementById('labelSearch');
    const btnAddNewLabelInline = document.getElementById('btnAddNewLabelInline');
    const labelDropdown = document.getElementById('labelDropdown');
    const labelResults = document.getElementById('labelResults');
    let selectedLabels = [];

    // Sub-category Management Elements (Tab View)
    const subCatsContainer = document.getElementById('subCatsContainer');
    const newSubCatInput = document.getElementById('newSubCatName');

    // Category Management Elements (Tab View)
    const catsContainer = document.getElementById('catsContainer');
    const newCatInput = document.getElementById('newCatName');
    const btnAddCat = document.getElementById('btnAddCat');
    const btnAddSubCat = document.getElementById('btnAddSubCat');

    // Lab Management Elements (Tab View)
    const btnAddLab = document.getElementById('btnAddLab');
    const labsContainer = document.getElementById('labsContainer');

    // Labels Management Elements (Tab View)
    const labelsContainer = document.getElementById('labelsContainer');
    const newLabelName = document.getElementById('newLabelName');
    const newLabelColor = document.getElementById('newLabelColor');
    const btnAddLabel = document.getElementById('btnAddLabel');
    const colorPalette = document.getElementById('colorPalette');
    const editingLabelOriginalName = document.getElementById('editingLabelOriginalName');
    const btnCancelLabelEdit = document.getElementById('btnCancelLabelEdit');

    // Navigation Elements (Sidebar)
    const navProducts = document.getElementById('navProducts');
    const navClients = document.getElementById('navClients');
    const navOrders = document.getElementById('navOrders');
    
    // Orders Management Elements (Tab View)
    const tabOrders = document.getElementById('tabOrders');
    const viewOrders = document.getElementById('viewOrders');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const ordersEmptyState = document.getElementById('ordersEmptyState');
    const orderSearch = document.getElementById('orderSearch');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    
    // Order Details Modal Elements
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const btnCloseOrderDetails = document.getElementById('btnCloseOrderDetails');
    const btnCloseOrderDetailsBottom = document.getElementById('btnCloseOrderDetailsBottom');
    let currentOrderId = null;

    const PRESET_COLORS = [
        '#2D5A27', // Camponuevo Primary
        '#10B981', // Emerald
        '#3B82F6', // Blue
        '#EF4444', // Red
        '#F59E0B', // Amber
        '#A855F7', // Purple
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#F97316', // Orange
        '#6366F1'  // Indigo
    ];

    // Authentication Logic
    function checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true' || 
                          localStorage.getItem('isAdminRemembered') === 'true';
        
        if (isLoggedIn) {
            if (loginScreen) loginScreen.classList.add('hidden');
            if (adminApp) adminApp.classList.remove('hidden');
            initAdminPanel();
        } else {
            if (loginScreen) loginScreen.classList.remove('hidden');
            if (adminApp) adminApp.classList.add('hidden');
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Hardcoded credentials for simulation (as requested)
        if (user === 'admin' && pass === '1234') {
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            if (rememberMe) {
                localStorage.setItem('isAdminRemembered', 'true');
            }
            loginError.classList.add('hidden');
            checkAuth();
        } else {
            loginError.classList.remove('hidden');
            document.getElementById('loginPass').value = ''; // clear password
        }
    });

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('isAdminRemembered');
            window.location.reload(); // Reload to reset state and show login
        });
    }

    const btnResetCatalog = document.getElementById('btnResetCatalog');
    const csvImportInput = document.getElementById('csvImportInput');

    if (btnResetCatalog && csvImportInput) {
        btnResetCatalog.addEventListener('click', () => {
            csvImportInput.click(); // Trigger file selection
        });

        csvImportInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                handleCSVImport(text);
                csvImportInput.value = ''; // Reset input
            };
            reader.readAsText(file);
        });
    }

    function handleCSVImport(csvText) {
        try {
            const lines = csvText.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            
            const importedProducts = [];
            
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                // Simple CSV parser for quoted fields
                const values = [];
                let current = '';
                let inQuotes = false;
                for (let char of lines[i]) {
                    if (char === '"') inQuotes = !inQuotes;
                    else if (char === ',' && !inQuotes) {
                        values.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                values.push(current.trim());
                
                const product = {};
                headers.forEach((header, index) => {
                    let val = values[index] || '';
                    val = val.replace(/^"|"$/g, '');
                    
                    if (header === 'price') product.price = parseFloat(val) || 0;
                    else if (header === 'animalBreeds') product.animalBreeds = val ? val.split(';').map(b => b.trim()) : [];
                    else product[header] = val;
                });
                
                if (!product.id) product.id = generateId();
                importedProducts.push(product);
            }

            if (importedProducts.length > 0) {
                if (confirm(`Se han detectado ${importedProducts.length} productos en el CSV. ¿Deseas reemplazar el catálogo actual?`)) {
                    // Save products
                    localStorage.setItem('camponuevo_products', JSON.stringify(importedProducts));
                    
                    // Extract and save unique laboratories from imported products
                    const labsSet = new Set();
                    importedProducts.forEach(p => {
                        if (p.laboratory) labsSet.add(p.laboratory);
                        if (p.laboratories && Array.isArray(p.laboratories)) {
                            p.laboratories.forEach(lab => labsSet.add(lab));
                        }
                    });
                    
                    // Update laboratories in storage
                    const existingLabs = getLaboratories();
                    let modified = false;
                    labsSet.forEach(lab => {
                        if (!existingLabs.includes(lab)) {
                            existingLabs.push(lab);
                            modified = true;
                        }
                    });
                    if (modified) {
                        existingLabs.sort();
                        localStorage.setItem('camponuevo_laboratories', JSON.stringify(existingLabs));
                    }
                    
                    alert(`✅ ¡Catálogo actualizado con éxito!`);
                    initAdminPanel();
                }
            } else {
                alert('No se encontraron productos válidos en el archivo CSV.');
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Error al procesar el archivo CSV. Verifica el formato.');
        }
    }


    // Initialize Filter with autocomplete
    let availableLabs = [];
    
    function initFilters(products) {
        if (!adminLabFilter) return;
        
        console.log('Init filters called with', products.length, 'products');
        
        // Extract unique labs from current products
        const labsFromProducts = new Set();
        products.forEach(p => {
            if (p.laboratory) labsFromProducts.add(p.laboratory);
            if (p.laboratories && Array.isArray(p.laboratories)) {
                p.laboratories.forEach(lab => labsFromProducts.add(lab));
            }
        });
        
        console.log('Labs from products:', Array.from(labsFromProducts));
        
        // Get labs from storage (or use default if not available)
        let allLabs = [];
        try {
            const storedLabs = localStorage.getItem('camponuevo_laboratories');
            if (storedLabs) {
                allLabs = JSON.parse(storedLabs);
                console.log('Loaded labs from localStorage:', allLabs);
            } else {
                // Try to get from getLaboratories() function
                if (typeof getLaboratories === 'function') {
                    allLabs = getLaboratories();
                    console.log('Loaded labs from getLaboratories():', allLabs);
                } else {
                    // Fallback to hardcoded default labs
                    console.warn('getLaboratories() not available, using default labs');
                    allLabs = [
                        "Konig", "Boehringer Ingelheim", "Zoovet", "Richmond", "Zoetis",
                        "Bioinnovo", "Brouwer", "Hervit", "Kualcos", "Vetanco", "Ourofino",
                        "Biogénesis Bagó", "Ceva", "MSD", "Varios"
                    ];
                }
            }
        } catch (e) {
            console.error('Error getting labs from storage:', e);
            allLabs = [];
        }
        
        console.log('Existing labs from storage:', allLabs);
        
        let modified = false;
        labsFromProducts.forEach(lab => {
            if (!allLabs.includes(lab)) {
                allLabs.push(lab);
                modified = true;
            }
        });
        if (modified) {
            allLabs.sort();
            localStorage.setItem('camponuevo_laboratories', JSON.stringify(allLabs));
            console.log('Updated labs in storage:', allLabs);
        }
        
        availableLabs = allLabs;
        
        console.log('Available labs:', availableLabs.length, availableLabs);
        
        // Set initial placeholder
        adminLabFilter.placeholder = 'Todos';
        adminLabFilter.value = '';
    }
    
    // Show lab filter dropdown
    function showLabFilterDropdown(query = '') {
        if (!labFilterResults || !labFilterDropdown) return;
        
        const filtered = availableLabs.filter(lab => 
            lab.toLowerCase().includes(query.toLowerCase())
        );
        
        labFilterResults.innerHTML = '';
        
        if (filtered.length === 0) {
            labFilterResults.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500 italic">No se encontraron resultados</div>';
        } else {
            // Add "All" option at the top
            const allItem = document.createElement('div');
            allItem.className = 'px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition flex items-center';
            allItem.innerHTML = '<i class="fas fa-times-circle mr-2 text-gray-400"></i> Todos los laboratorios';
            allItem.onclick = () => {
                selectedLabFilter = '';
                adminLabFilter.value = '';
                adminLabFilter.placeholder = 'Todos';
                labFilterDropdown.classList.add('hidden');
                renderProducts();
            };
            labFilterResults.appendChild(allItem);
            
            // Add filtered labs
            filtered.forEach(lab => {
                const item = document.createElement('div');
                item.className = 'px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition flex items-center';
                item.innerHTML = `<i class="fas fa-flask mr-2 text-gray-400"></i> ${lab}`;
                item.onclick = () => {
                    selectedLabFilter = lab;
                    adminLabFilter.value = lab;
                    adminLabFilter.placeholder = lab;
                    labFilterDropdown.classList.add('hidden');
                    renderProducts();
                };
                labFilterResults.appendChild(item);
            });
        }
        
        labFilterDropdown.classList.remove('hidden');
    }
    
    // Hide lab filter dropdown when clicking outside
    function hideLabFilterDropdown() {
        if (labFilterDropdown) {
            labFilterDropdown.classList.add('hidden');
        }
    }

    // --- Tab Management ---
    function switchTab(tab) {
        const tabs = [
            { id: 'products', btn: tabProducts, view: viewProducts, nav: navProducts },
            { id: 'clients', btn: tabClients, view: viewClients, nav: navClients },
            { id: 'orders', btn: tabOrders, view: viewOrders, nav: navOrders },
            { id: 'cats', btn: tabCats, view: viewCats },
            { id: 'subCats', btn: tabSubCats, view: viewSubCats },
            { id: 'homeCats', btn: tabHomeCats, view: viewHomeCats },
            { id: 'labs', btn: tabLabs, view: viewLabs },
            { id: 'labels', btn: tabLabels, view: viewLabels }
        ];

        tabs.forEach(t => {
            if (t.id === tab) {
                if (t.btn) {
                    t.btn.classList.add('text-primary', 'border-b-2', 'border-primary');
                    t.btn.classList.remove('text-gray-500');
                }
                if (t.nav) {
                    t.nav.classList.add('bg-primary', 'bg-opacity-50', 'border-l-4', 'border-accent');
                }
                if (t.view) t.view.classList.remove('hidden');
            } else {
                if (t.btn) {
                    t.btn.classList.remove('text-primary', 'border-b-2', 'border-primary');
                    t.btn.classList.add('text-gray-500');
                }
                if (t.nav) {
                    t.nav.classList.remove('bg-primary', 'bg-opacity-50', 'border-l-4', 'border-accent');
                }
                if (t.view) t.view.classList.add('hidden');
            }
        });

        if (tab === 'products') renderProducts();
        if (tab === 'clients') renderClients();
        if (tab === 'orders') renderOrders();
        if (tab === 'cats') renderCategories();
        if (tab === 'subCats') renderSubCategories();
        if (tab === 'homeCats') renderHomeCategories();
        if (tab === 'labs') renderLaboratories();
        if (tab === 'labels') renderLabels();
    }

    window.switchTab = switchTab;

    const tabHomeCats = document.getElementById('tabHomeCats');
    const viewHomeCats = document.getElementById('viewHomeCats');

    if (tabProducts && tabClients && tabOrders && tabCats && tabSubCats && tabHomeCats && tabLabs && tabLabels) {
        tabProducts.addEventListener('click', () => switchTab('products'));
        tabClients.addEventListener('click', () => switchTab('clients'));
        tabOrders.addEventListener('click', () => switchTab('orders'));
        tabCats.addEventListener('click', () => switchTab('cats'));
        tabSubCats.addEventListener('click', () => switchTab('subCats'));
        tabHomeCats.addEventListener('click', () => switchTab('homeCats'));
        tabLabs.addEventListener('click', () => switchTab('labs'));
        tabLabels.addEventListener('click', () => switchTab('labels'));
    }
    
    // Sidebar navigation event listeners
    if (navProducts) {
        navProducts.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('products');
        });
    }
    
    if (navClients) {
        navClients.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('clients');
        });
    }
    
    if (navOrders) {
        navOrders.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('orders');
        });
    }

    // --- Category UI Management ---
    function renderCategories() {
        if (!catsContainer) return;
        migrateSubCategoriesToCategories();
        const categories = getCategories();
        catsContainer.innerHTML = '';
        
        if (categories.length === 0) {
            catsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">No hay categorías creadas. Crea tu primera categoría arriba.</p>';
            return;
        }
        
        categories.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 hover:border-primary transition';
            div.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <div>
                        <h4 class="text-lg font-bold text-gray-800">${cat.name}</h4>
                        <span class="text-xs text-gray-500">${cat.subCategories.length} subcategoría${cat.subCategories.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="text-gray-400 hover:text-primary p-2" onclick="event.stopPropagation(); openEditCatModal('${cat.id}')" title="Gestionar subcategorías">
                            <i class="fas fa-folder-open"></i>
                        </button>
                        <button class="text-gray-400 hover:text-primary p-2" onclick="event.stopPropagation(); openEditCatNameModal('${cat.id}', '${cat.name}')" title="Editar nombre">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-gray-400 hover:text-red-500 p-2" onclick="event.stopPropagation(); handleDeleteCat('${cat.id}')" title="Eliminar">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${cat.subCategories.length > 0 ? cat.subCategories.map(subCat => `
                        <span class="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 flex items-center gap-1">
                            ${subCat}
                            <button class="text-gray-400 hover:text-red-500 ml-1" onclick="event.stopPropagation(); removeSubCatFromCategory('${cat.id}', '${subCat}')">
                                <i class="fas fa-times text-xs"></i>
                            </button>
                        </span>
                    `).join('') : '<span class="text-xs text-gray-400 italic">Sin subcategorías asignadas</span>'}
                </div>
            `;
            catsContainer.appendChild(div);
        });
    }

    window.handleDeleteCat = function(id) {
        if (confirm('¿Estás seguro de eliminar esta categoría? Las subcategorías no se eliminarán.')) {
            deleteCategory(id);
            renderCategories();
        }
    }

    window.removeSubCatFromCategory = function(categoryId, subCatName) {
        removeSubCategoryFromCategory(categoryId, subCatName);
        renderCategories();
    }

    window.openEditCatModal = function(categoryId) {
        const cat = getCategoryById(categoryId);
        if (!cat) return;
        
        const allSubCats = getSubCategories();
        const assignedSubCats = cat.subCategories;
        const availableSubCats = allSubCats.filter(s => !assignedSubCats.includes(s));
        
        let modalHtml = `
            <div id="editCatModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                    <div class="p-6 border-b border-gray-100">
                        <h3 class="text-xl font-bold text-gray-800">Gestionar: ${cat.name}</h3>
                        <p class="text-sm text-gray-500">Asigna o移除 subcategorías</p>
                    </div>
                    <div class="p-6 overflow-y-auto max-h-96">
                        <div class="mb-4">
                            <h4 class="text-sm font-bold text-gray-600 mb-2">Subcategorías asignadas (${assignedSubCats.length})</h4>
                            <div class="flex flex-wrap gap-2 min-h-12 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                ${assignedSubCats.length > 0 ? assignedSubCats.map(s => `
                                    <span class="bg-primary text-white rounded-full px-3 py-1 text-xs flex items-center gap-1">
                                        ${s}
                                        <button onclick="removeSubCatFromCategory('${categoryId}', '${s}'); renderEditCatModal('${categoryId}')" class="hover:text-red-200">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </span>
                                `).join('') : '<span class="text-gray-400 text-sm italic">Sin subcategorías</span>'}
                            </div>
                        </div>
                        <div class="mb-4">
                            <h4 class="text-sm font-bold text-gray-600 mb-2">Agregar subcategoría</h4>
                            <select id="addSubCatSelect" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" onchange="addSubCatToCategoryFromModal('${categoryId}', this.value)">
                                <option value="">Seleccionar subcategoría...</option>
                                ${availableSubCats.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div class="text-xs text-gray-400 mt-4">
                            <p><strong>Nota:</strong> Las subcategorías disponibles son las que ya existen en el sistema. Crea nuevas subcategorías desde la pestaña "Sub-Categorías".</p>
                        </div>
                    </div>
                    <div class="p-4 border-t border-gray-100 flex justify-end">
                        <button onclick="document.getElementById('editCatModal').remove()" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition font-medium">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    window.renderEditCatModal = function(categoryId) {
        const modal = document.getElementById('editCatModal');
        if (modal) modal.remove();
        openEditCatModal(categoryId);
    }

    window.addSubCatToCategoryFromModal = function(categoryId, subCatName) {
        if (!subCatName) return;
        addSubCategoryToCategory(categoryId, subCatName);
        renderEditCatModal(categoryId);
    }

    window.openEditCatNameModal = function(categoryId, currentName) {
        const newName = prompt('Nuevo nombre de la categoría:', currentName);
        if (newName && newName.trim() && newName !== currentName) {
            updateCategoryName(categoryId, newName.trim());
            renderCategories();
        }
    }

    if (btnAddCat) {
        btnAddCat.addEventListener('click', () => {
            const name = newCatInput.value.trim();
            if (name) {
                const result = addCategory(name);
                if (result.success) {
                    newCatInput.value = '';
                    renderCategories();
                } else {
                    alert(result.message);
                }
            }
        });
    }

    if (newCatInput) {
        newCatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                btnAddCat.click();
            }
        });
    }

    // --- Sub-category UI Management ---
    function renderSubCategories() {
        if (!subCatsContainer) return;
        const cats = getSubCategories();
        subCatsContainer.innerHTML = '';
        
        cats.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between group hover:border-primary transition cursor-pointer';
            div.onclick = () => openEditSubCatModal(cat);
            div.innerHTML = `
                <span class="text-sm font-medium text-gray-700">${cat}</span>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="text-gray-400 hover:text-primary p-1" onclick="event.stopPropagation(); openEditSubCatNameModal('${cat}')" title="Editar nombre">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button class="text-gray-400 hover:text-red-500 p-1" onclick="event.stopPropagation(); handleDeleteSubCat('${cat}')">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
            `;
            subCatsContainer.appendChild(div);
        });
    }

    // --- Laboratory UI Management ---
    function renderLaboratories() {
        if (!labsContainer) return;
        const labs = getLaboratories();
        labsContainer.innerHTML = '';
        
        labs.forEach(lab => {
            const div = document.createElement('div');
            div.className = 'bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between group hover:border-primary transition cursor-pointer';
            div.onclick = () => openEditLabModal(lab);
            div.innerHTML = `
                <span class="text-sm font-medium text-gray-700">${lab}</span>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="text-gray-400 hover:text-primary p-1" onclick="event.stopPropagation(); openEditLabNameModal('${lab}')" title="Editar nombre">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button class="text-gray-400 hover:text-red-500 p-1" onclick="event.stopPropagation(); handleDeleteLab('${lab}')">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
            `;
            labsContainer.appendChild(div);
        });
    }

    // --- Label UI Management ---
    function renderLabels() {
        if (!labelsContainer) return;
        const labelsData = typeof getLabels === 'function' ? getLabels() : [];
        labelsContainer.innerHTML = '';
        
        labelsData.forEach(label => {
            const name = typeof label === 'string' ? label : label.name;
            const color = (typeof label === 'object' && label.color) ? label.color : '#2d5a27';

            const div = document.createElement('div');
            div.className = 'bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between group hover:border-primary transition cursor-pointer';
            div.onclick = () => openEditLabelModal(name, color);
            div.innerHTML = `
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded-full shadow-sm" style="background-color: ${color}"></div>
                    <span class="text-sm font-bold text-gray-700">${name}</span>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="text-gray-400 hover:text-primary p-1" onclick="event.stopPropagation(); openEditLabelNameModal('${name}', '${color}')" title="Editar nombre y color">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button class="text-gray-400 hover:text-red-500 p-1" onclick="event.stopPropagation(); handleDeleteLabel('${name}')">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
            `;
            labelsContainer.appendChild(div);
        });
    }

    // --- Home Categories UI Management ---
    function renderHomeCategories() {
        const homeCatsContainer = document.getElementById('homeCatsContainer');
        const allCatsContainer = document.getElementById('allCatsContainer');
        const homeCatSelector = document.getElementById('homeCatSelector');
        
        if (!homeCatsContainer || !allCatsContainer || !homeCatSelector) return;
        
        const allCats = getCategories();
        const homeCatData = getHomeCategories();
        
        const categoryIcons = {
            'veterinaria': 'fa-vial',
            'bovinos': 'faCow',
            'ovinos': 'faSheep',
            'equinos': 'faHorse',
            'porcinos': 'faPig',
            'caninos': 'faDog',
            'felinos': 'faCat',
            'agricultura': 'fa-leaf'
        };
        
        const defaultIcon = 'fa-box';
        
        // Get category objects for home categories
        const homeCats = homeCatData.map(h => ({
            ...allCats.find(c => c.id === h.id),
            svg: h.svg
        })).filter(Boolean);
        
        const availableCats = allCats.filter(c => !homeCatData.some(h => h.id === c.id));
        
        // Render home categories (draggable)
        homeCatsContainer.innerHTML = '';
        homeCats.forEach((cat, index) => {
            const div = document.createElement('div');
            div.className = 'bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between mb-2 cursor-move hover:border-green-400 transition draggable-item';
            div.draggable = true;
            div.dataset.categoryId = cat.id;
            
            const iconClass = categoryIcons[cat.id] || defaultIcon;
            
            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-green-600 bg-green-100 rounded-full w-5 h-5 flex items-center justify-center">${index + 1}</span>
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center svg-preview" id="preview-${cat.id}">
                        ${cat.svg ? cat.svg : `<i class="fas ${iconClass} text-primary text-sm"></i>`}
                    </div>
                    <span class="text-sm font-medium text-gray-700">${cat.name}</span>
                </div>
                <div class="flex items-center gap-1">
                    <label class="cursor-pointer text-gray-400 hover:text-primary p-1" title="Cambiar icono SVG">
                        <i class="fas fa-image text-sm"></i>
                        <input type="file" accept=".svg" class="hidden" onchange="handleSvgUpload('${cat.id}', this)">
                    </label>
                    ${cat.svg ? `<button class="text-gray-400 hover:text-red-500 p-1" onclick="removeCategorySvg('${cat.id}')" title="Quitar SVG">
                        <i class="fas fa-trash-alt text-sm"></i>
                    </button>` : ''}
                    <button class="text-gray-400 hover:text-red-500 p-1" title="Quitar del inicio">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            `;
            
            div.querySelector('button').onclick = () => {
                removeCategoryFromHome(cat.id);
                renderHomeCategories();
            };
            
            homeCatsContainer.appendChild(div);
        });
        
        if (homeCats.length === 0) {
            homeCatsContainer.innerHTML = '<p class="text-gray-400 text-center py-8 text-sm italic">No hay categorías seleccionadas. Agrega categorías de la lista.</p>';
        }
        
        // Render available categories
        allCatsContainer.innerHTML = '';
        availableCats.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between mb-2 hover:border-primary transition cursor-pointer';
            div.innerHTML = `
                <span class="text-sm font-medium text-gray-700">${cat.name}</span>
                <button class="text-gray-400 hover:text-green-500 p-1" title="Agregar al inicio">
                    <i class="fas fa-plus text-sm"></i>
                </button>
            `;
            
            div.querySelector('button').onclick = () => {
                addCategoryToHome(cat.id);
                renderHomeCategories();
            };
            
            allCatsContainer.appendChild(div);
        });
        
        if (availableCats.length === 0) {
            allCatsContainer.innerHTML = '<p class="text-gray-400 text-center py-8 text-sm italic">Todas las categorías ya están en el inicio.</p>';
        }
        
        // Update selector
        homeCatSelector.innerHTML = '<option value="">Selecciona una categoría para agregar...</option>';
        availableCats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            homeCatSelector.appendChild(option);
        });
        
        // Enable drag and drop
        initDragAndDrop();
    }
    
    window.handleSvgUpload = function(categoryId, input) {
        const file = input.files[0];
        if (file && file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const svgContent = e.target.result;
                // Extraer solo el contenido SVG sin el wrapper
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgContent, 'image/svg+xml');
                const svgElement = doc.querySelector('svg');
                
                if (svgElement) {
                    // Asegurar que el SVG tenga las clases correctas para mantener el color
                    svgElement.setAttribute('class', 'w-6 h-6');
                    svgElement.style.fill = 'currentColor';
                    
                    // Forzar color primario
                    svgElement.style.color = '#2d5a27';
                    
                    const sanitizedSvg = svgElement.outerHTML;
                    updateCategorySvg(categoryId, sanitizedSvg);
                    renderHomeCategories();
                }
            };
            reader.readAsText(file);
        }
        input.value = '';
    };
    
    window.removeCategorySvg
    
    function initDragAndDrop() {
        const container = document.getElementById('homeCatsContainer');
        if (!container) return;
        
        let draggedItem = null;
        
        container.querySelectorAll('.draggable-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = item;
                item.classList.add('opacity-50');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('opacity-50');
                draggedItem = null;
            });
            
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem && draggedItem !== item) {
                    const allItems = [...container.querySelectorAll('.draggable-item')];
                    const draggedIndex = allItems.indexOf(draggedItem);
                    const dropIndex = allItems.indexOf(item);
                    
                    if (draggedIndex < dropIndex) {
                        item.after(draggedItem);
                    } else {
                        item.before(draggedItem);
                    }
                    
                    // Save new order
                    const newOrder = [...container.querySelectorAll('.draggable-item')].map(el => {
                        const id = el.dataset.categoryId;
                        const homeCats = getHomeCategories();
                        const catData = homeCats.find(c => c.id === id);
                        return { id: id, svg: catData ? catData.svg : null };
                    });
                    reorderHomeCategories(newOrder);
                }
            });
        });
    }

    function initColorPalette() {
        if (!colorPalette) return;
        colorPalette.innerHTML = '';
        PRESET_COLORS.forEach(color => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'w-8 h-8 rounded-full border-2 border-transparent hover:scale-110 transition-transform shadow-sm focus:outline-none';
            btn.style.backgroundColor = color;
            btn.onclick = () => selectPaletteColor(color, btn);
            if (newLabelColor && newLabelColor.value === color) {
                btn.classList.add('border-primary', 'scale-110');
            }
            colorPalette.appendChild(btn);
        });
    }

    function selectPaletteColor(color, btn) {
        if (newLabelColor) newLabelColor.value = color;
        // Reset borders
        if (colorPalette) {
            const buttons = colorPalette.querySelectorAll('button');
            buttons.forEach(b => b.classList.remove('border-primary', 'scale-110'));
        }
        // Set border to clicked
        btn.classList.add('border-primary', 'scale-110');
    }

    if (btnAddLab) {
        btnAddLab.addEventListener('click', () => {
            const name = newLabInput.value.trim();
            if (name) {
                saveLaboratory(name);
                newLabInput.value = '';
                renderLaboratories();
                initFilters(getProducts());
            }
        });
    }

    window.handleDeleteLab = function(name) {
        if (confirm(`¿Estás seguro de eliminar el laboratorio "${name}"?`)) {
            deleteLaboratory(name);
            renderLaboratories();
            initFilters(getProducts());
        }
    };

    // Expose delete handler globally for onclick
    window.handleDeleteSubCat = function(name) {
        if (confirm(`¿Estás seguro de eliminar la sub-categoría "${name}"?`)) {
            deleteSubCategory(name);
            renderSubCategories();
            initFilters(getProducts()); // Refresh dropdowns
        }
    };

    window.handleDeleteLabel = function(name) {
        if (confirm(`¿Estás seguro de eliminar la etiqueta "${name}"?`)) {
            if (typeof deleteLabel === 'function') deleteLabel(name);
            renderLabels();
            initAdminPanel(); // Full refresh
        }
    };

    // --- Edit Sub-Category Modal Functions ---
    let currentEditingSubCat = null;
    const editSubCatModal = document.getElementById('editSubCatModal');
    const editSubCatNameModal = document.getElementById('editSubCatNameModal');
    const editSubCatName = document.getElementById('editSubCatName');
    const editSubCatNameInput = document.getElementById('editSubCatNameInput');
    const subCatProductsList = document.getElementById('subCatProductsList');
    const availableProductsList = document.getElementById('availableProductsList');
    const searchProductsForSubCat = document.getElementById('searchProductsForSubCat');
    const noProductsInSubCat = document.getElementById('noProductsInSubCat');

    window.openEditSubCatModal = function(subCatName) {
        currentEditingSubCat = subCatName;
        editSubCatName.textContent = subCatName;
        renderSubCatProducts(subCatName);
        renderAvailableProducts(subCatName);
        editSubCatModal.classList.remove('hidden');
    };

    function renderSubCatProducts(subCatName) {
        const products = getProducts();
        const productsInCat = products.filter(p => {
            const subCats = p.subCategories || [];
            return subCats.includes(subCatName);
        });

        if (productsInCat.length === 0) {
            subCatProductsList.innerHTML = '';
            noProductsInSubCat.classList.remove('hidden');
        } else {
            noProductsInSubCat.classList.add('hidden');
            subCatProductsList.innerHTML = productsInCat.map(p => `
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span class="text-sm text-gray-700 truncate flex-1">${p.title}</span>
                    <button class="text-red-500 hover:text-red-700 ml-2" onclick="removeProductFromSubCat('${p.id}', '${subCatName}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    function renderAvailableProducts(subCatName, searchTerm = '') {
        const products = getProducts();
        const productsInCat = products.filter(p => {
            const subCats = p.subCategories || [];
            return subCats.includes(subCatName);
        });
        const productsInCatIds = productsInCat.map(p => p.id);

        let available = products.filter(p => !productsInCatIds.includes(p.id));

        if (searchTerm) {
            available = available.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (available.length === 0) {
            availableProductsList.innerHTML = '<p class="text-sm text-gray-400 italic p-2">No hay productos disponibles</p>';
        } else {
            availableProductsList.innerHTML = available.map(p => `
                <div class="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 hover:bg-green-50">
                    <span class="text-sm text-gray-700 truncate flex-1">${p.title}</span>
                    <button class="text-green-600 hover:text-green-800 ml-2" onclick="addProductToSubCat('${p.id}', '${subCatName}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    window.removeProductFromSubCat = function(productId, subCatName) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (product && product.subCategories) {
            product.subCategories = product.subCategories.filter(c => c !== subCatName);
            saveProduct(product);
            renderSubCatProducts(subCatName);
            initFilters(getProducts());
        }
    };

    window.addProductToSubCat = function(productId, subCatName) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
            if (!product.subCategories) product.subCategories = [];
            if (!product.subCategories.includes(subCatName)) {
                product.subCategories.push(subCatName);
                saveProduct(product);
                renderSubCatProducts(subCatName);
                renderAvailableProducts(subCatName, searchProductsForSubCat.value);
                initFilters(getProducts());
            }
        }
    };

    if (searchProductsForSubCat) {
        searchProductsForSubCat.addEventListener('input', (e) => {
            if (currentEditingSubCat) {
                renderAvailableProducts(currentEditingSubCat, e.target.value);
            }
        });
    }

    if (document.getElementById('btnCloseEditSubCat')) {
        document.getElementById('btnCloseEditSubCat').addEventListener('click', () => {
            editSubCatModal.classList.add('hidden');
        });
    }
    if (document.getElementById('btnCancelEditSubCat')) {
        document.getElementById('btnCancelEditSubCat').addEventListener('click', () => {
            editSubCatModal.classList.add('hidden');
        });
    }

    // --- Edit Sub-Category Name Modal ---
    window.openEditSubCatNameModal = function(subCatName) {
        currentEditingSubCat = subCatName;
        editSubCatNameInput.value = subCatName;
        editSubCatNameModal.classList.remove('hidden');
    };

    if (document.getElementById('btnCancelEditSubCatName')) {
        document.getElementById('btnCancelEditSubCatName').addEventListener('click', () => {
            editSubCatNameModal.classList.add('hidden');
        });
    }
    if (document.getElementById('btnSaveSubCatName')) {
        document.getElementById('btnSaveSubCatName').addEventListener('click', () => {
            const newName = editSubCatNameInput.value.trim();
            if (newName && newName !== currentEditingSubCat) {
                // Update all products with this sub-category
                const products = getProducts();
                products.forEach(p => {
                    if (p.subCategories && p.subCategories.includes(currentEditingSubCat)) {
                        p.subCategories = p.subCategories.map(c => c === currentEditingSubCat ? newName : c);
                        saveProduct(p);
                    }
                });
                // Update the sub-category in the list
                updateSubCategoryName(currentEditingSubCat, newName);
                renderSubCategories();
                initFilters(getProducts());
            }
            editSubCatNameModal.classList.add('hidden');
        });
    }

    // --- Edit Laboratory Modal ---
    let currentEditingLab = null;
    const editLabModal = document.getElementById('editLabModal');
    const editLabName = document.getElementById('editLabName');
    const labProductsList = document.getElementById('labProductsList');
    const noProductsInLab = document.getElementById('noProductsInLab');
    const searchProductsForLab = document.getElementById('searchProductsForLab');
    const availableProductsForLabList = document.getElementById('availableProductsForLabList');

    window.openEditLabModal = function(labName) {
        currentEditingLab = labName;
        editLabName.textContent = labName;
        renderLabProducts(labName);
        renderAvailableProductsForLab(labName);
        editLabModal.classList.remove('hidden');
    };

    // --- Edit Laboratory Name Modal ---
    let currentEditingLabName = null;
    const editLabNameModal = document.getElementById('editLabNameModal');
    const editLabNameInput = document.getElementById('editLabNameInput');

    window.openEditLabNameModal = function(labName) {
        currentEditingLabName = labName;
        editLabNameInput.value = labName;
        editLabNameModal.classList.remove('hidden');
    };

    if (document.getElementById('btnCancelEditLabName')) {
        document.getElementById('btnCancelEditLabName').addEventListener('click', () => {
            editLabNameModal.classList.add('hidden');
        });
    }
    if (document.getElementById('btnSaveLabName')) {
        document.getElementById('btnSaveLabName').addEventListener('click', () => {
            const newName = editLabNameInput.value.trim();
            if (newName && newName !== currentEditingLabName) {
                const products = getProducts();
                products.forEach(p => {
                    if (p.laboratory === currentEditingLabName) {
                        p.laboratory = newName;
                        saveProduct(p);
                    }
                    if (p.laboratories && p.laboratories.includes(currentEditingLabName)) {
                        p.laboratories = p.laboratories.map(l => l === currentEditingLabName ? newName : l);
                        saveProduct(p);
                    }
                });
                updateLaboratoryName(currentEditingLabName, newName);
                renderLaboratories();
                initFilters(getProducts());
            }
            editLabNameModal.classList.add('hidden');
        });
    }
    if (editLabNameModal) {
        editLabNameModal.addEventListener('click', (e) => {
            if (e.target === editLabNameModal) editLabNameModal.classList.add('hidden');
        });
    }

    // --- Edit Label Name Modal ---
    let currentEditingLabelName = null;
    let currentEditingLabelColor = null;
    const editLabelNameModal = document.getElementById('editLabelNameModal');
    const editLabelNameInput = document.getElementById('editLabelNameInput');
    const editLabelColorValue = document.getElementById('editLabelColorValue');
    const editLabelColorPalette = document.getElementById('editLabelColorPalette');

    window.openEditLabelNameModal = function(labelName, labelColor) {
        currentEditingLabelName = labelName;
        currentEditingLabelColor = labelColor;
        editLabelNameInput.value = labelName;
        editLabelColorValue.value = labelColor;
        renderEditLabelColorPalette(labelColor);
        editLabelNameModal.classList.remove('hidden');
    };

    function renderEditLabelColorPalette(selectedColor) {
        if (!editLabelColorPalette) return;
        editLabelColorPalette.innerHTML = '';
        PRESET_COLORS.forEach(color => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'w-8 h-8 rounded-full border-2 ' + (color === selectedColor ? 'border-primary scale-110' : 'border-transparent') + ' hover:scale-110 transition-transform';
            btn.style.backgroundColor = color;
            btn.onclick = () => {
                editLabelColorValue.value = color;
                renderEditLabelColorPalette(color);
            };
            editLabelColorPalette.appendChild(btn);
        });
    }

    if (document.getElementById('btnCancelEditLabelName')) {
        document.getElementById('btnCancelEditLabelName').addEventListener('click', () => {
            editLabelNameModal.classList.add('hidden');
        });
    }
    if (document.getElementById('btnSaveLabelName')) {
        document.getElementById('btnSaveLabelName').addEventListener('click', () => {
            const newName = editLabelNameInput.value.trim();
            const newColor = editLabelColorValue.value;
            if (newName && (newName !== currentEditingLabelName || newColor !== currentEditingLabelColor)) {
                const products = getProducts();
                products.forEach(p => {
                    if (p.labels && p.labels.includes(currentEditingLabelName)) {
                        p.labels = p.labels.map(l => l === currentEditingLabelName ? newName : l);
                        saveProduct(p);
                    }
                });
                updateLabelName(currentEditingLabelName, newName, newColor);
                renderLabels();
                initFilters(getProducts());
            }
            editLabelNameModal.classList.add('hidden');
        });
    }
    if (editLabelNameModal) {
        editLabelNameModal.addEventListener('click', (e) => {
            if (e.target === editLabelNameModal) editLabelNameModal.classList.add('hidden');
        });
    }

    function renderLabProducts(labName) {
        const products = getProducts();
        const productsInLab = products.filter(p => {
            const labs = p.laboratories || (p.laboratory ? [p.laboratory] : []);
            return labs.includes(labName);
        });

        if (productsInLab.length === 0) {
            labProductsList.innerHTML = '';
            noProductsInLab.classList.remove('hidden');
        } else {
            noProductsInLab.classList.add('hidden');
            labProductsList.innerHTML = productsInLab.map(p => `
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span class="text-sm text-gray-700 truncate flex-1">${p.title}</span>
                    <button class="text-red-500 hover:text-red-700 ml-2" onclick="removeProductFromLab('${p.id}', '${labName}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    function renderAvailableProductsForLab(labName, searchTerm = '') {
        const products = getProducts();
        const productsInLab = products.filter(p => {
            const labs = p.laboratories || (p.laboratory ? [p.laboratory] : []);
            return labs.includes(labName);
        });
        const productsInLabIds = productsInLab.map(p => p.id);

        let available = products.filter(p => !productsInLabIds.includes(p.id));

        if (searchTerm) {
            available = available.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (available.length === 0) {
            availableProductsForLabList.innerHTML = '<p class="text-sm text-gray-400 italic p-2">No hay productos disponibles</p>';
        } else {
            availableProductsForLabList.innerHTML = available.map(p => `
                <div class="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 hover:bg-green-50">
                    <span class="text-sm text-gray-700 truncate flex-1">${p.title}</span>
                    <button class="text-green-600 hover:text-green-800 ml-2" onclick="addProductToLab('${p.id}', '${labName}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    window.removeProductFromLab = function(productId, labName) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
            if (product.laboratories && product.laboratories.includes(labName)) {
                product.laboratories = product.laboratories.filter(l => l !== labName);
            }
            if (product.laboratory === labName) {
                product.laboratory = product.laboratories && product.laboratories.length > 0 ? product.laboratories[0] : '';
            }
            saveProduct(product);
            renderLabProducts(labName);
            initFilters(getProducts());
        }
    };

    window.addProductToLab = function(productId, labName) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
            if (!product.laboratories) product.laboratories = [];
            if (!product.laboratories.includes(labName)) {
                product.laboratories.push(labName);
            }
            if (!product.laboratory) {
                product.laboratory = labName;
            }
            saveProduct(product);
            renderLabProducts(labName);
            renderAvailableProductsForLab(labName, searchProductsForLab.value);
            initFilters(getProducts());
        }
    };

    if (searchProductsForLab) {
        searchProductsForLab.addEventListener('input', (e) => {
            if (currentEditingLab) {
                renderAvailableProductsForLab(currentEditingLab, e.target.value);
            }
        });
    }

    if (document.getElementById('btnCloseEditLab')) {
        document.getElementById('btnCloseEditLab').addEventListener('click', () => {
            editLabModal.classList.add('hidden');
        });
    }
    if (document.getElementById('btnCancelEditLab')) {
        document.getElementById('btnCancelEditLab').addEventListener('click', () => {
            editLabModal.classList.add('hidden');
        });
    }
    if (document.getElementById('btnDeleteLab')) {
        document.getElementById('btnDeleteLab').addEventListener('click', () => {
            if (currentEditingLab && confirm(`¿Estás seguro de eliminar el laboratorio "${currentEditingLab}"?`)) {
                const products = getProducts();
                products.forEach(p => {
                    if (p.laboratories && p.laboratories.includes(currentEditingLab)) {
                        p.laboratories = p.laboratories.filter(l => l !== currentEditingLab);
                        saveProduct(p);
                    }
                    if (p.laboratory === currentEditingLab) {
                        p.laboratory = p.laboratories && p.laboratories.length > 0 ? p.laboratories[0] : '';
                        saveProduct(p);
                    }
                });
                updateLaboratoryName(currentEditingLab, null);
                renderLaboratories();
                initFilters(getProducts());
                editLabModal.classList.add('hidden');
            }
        });
    }

    // Add name editing functionality within the modal
    function initLabNameEditing() {
        editLabName.style.cursor = 'pointer';
        editLabName.onclick = function() {
            const currentName = currentEditingLab;
            const newName = prompt('Nuevo nombre del laboratorio:', currentName);
            if (newName && newName.trim() && newName !== currentName) {
                const products = getProducts();
                products.forEach(p => {
                    if (p.laboratory === currentName) {
                        p.laboratory = newName.trim();
                        saveProduct(p);
                    }
                    if (p.laboratories && p.laboratories.includes(currentName)) {
                        p.laboratories = p.laboratories.map(l => l === currentName ? newName.trim() : l);
                        saveProduct(p);
                    }
                });
                updateLaboratoryName(currentName, newName.trim());
                currentEditingLab = newName.trim();
                editLabName.textContent = newName.trim();
                renderLaboratories();
                initFilters(getProducts());
            }
        };
    }

    if (editLabModal) {
        editLabModal.addEventListener('click', (e) => {
            if (e.target === editLabModal) {
                editLabModal.classList.add('hidden');
            }
        });
        editLabModal.addEventListener('transitionend', () => {
            if (!editLabModal.classList.contains('hidden') && currentEditingLab) {
                initLabNameEditing();
            }
        });
    }

    // --- Edit Label Modal ---
    let currentEditingLabel = null;
    const editLabelModal = document.getElementById('editLabelModal');
    const editLabelName = document.getElementById('editLabelName');
    const editLabelColor = document.getElementById('editLabelColor');
    const labelProductsList = document.getElementById('labelProductsList');
    const noProductsWithLabel = document.getElementById('noProductsWithLabel');
    const searchProductsForLabel = document.getElementById('searchProductsForLabel');
    const availableProductsForLabelList = document.getElementById('availableProductsForLabelList');

    window.openEditLabelModal = function(labelName, labelColor) {
        currentEditingLabel = labelName;
        currentEditingLabelColor = labelColor;
        editLabelName.textContent = labelName;
        editLabelColor.style.backgroundColor = labelColor;
        renderLabelProducts(labelName);
        renderAvailableProductsForLabel(labelName);
        editLabelModal.classList.remove('hidden');
    };

    function renderLabelProducts(labelName) {
        const products = getProducts();
        const productsWithLabel = products.filter(p => {
            const labels = p.labels || [];
            return labels.includes(labelName);
        });

        if (productsWithLabel.length === 0) {
            labelProductsList.innerHTML = '';
            noProductsWithLabel.classList.remove('hidden');
        } else {
            noProductsWithLabel.classList.add('hidden');
            labelProductsList.innerHTML = productsWithLabel.map(p => `
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span class="text-sm text-gray-700 truncate flex-1">${p.title}</span>
                    <button class="text-red-500 hover:text-red-700 ml-2" onclick="removeProductFromLabel('${p.id}', '${labelName}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    function renderAvailableProductsForLabel(labelName, searchTerm = '') {
        const products = getProducts();
        const productsWithLabel = products.filter(p => {
            const labels = p.labels || [];
            return labels.includes(labelName);
        });
        const productsWithLabelIds = productsWithLabel.map(p => p.id);

        let available = products.filter(p => !productsWithLabelIds.includes(p.id));

        if (searchTerm) {
            available = available.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (available.length === 0) {
            availableProductsForLabelList.innerHTML = '<p class="text-sm text-gray-400 italic p-2">No hay productos disponibles</p>';
        } else {
            availableProductsForLabelList.innerHTML = available.map(p => `
                <div class="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 hover:bg-green-50">
                    <span class="text-sm text-gray-700 truncate flex-1">${p.title}</span>
                    <button class="text-green-600 hover:text-green-800 ml-2" onclick="addProductToLabel('${p.id}', '${labelName}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    window.removeProductFromLabel = function(productId, labelName) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (product && product.labels) {
            product.labels = product.labels.filter(l => l !== labelName);
            saveProduct(product);
            renderLabelProducts(labelName);
            initFilters(getProducts());
        }
    };

    window.addProductToLabel = function(productId, labelName) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
            if (!product.labels) product.labels = [];
            if (!product.labels.includes(labelName)) {
                product.labels.push(labelName);
                saveProduct(product);
                renderLabelProducts(labelName);
                renderAvailableProductsForLabel(labelName, searchProductsForLabel.value);
                initFilters(getProducts());
            }
        }
    };

    if (searchProductsForLabel) {
        searchProductsForLabel.addEventListener('input', (e) => {
            if (currentEditingLabel) {
                renderAvailableProductsForLabel(currentEditingLabel, e.target.value);
            }
        });
    }

    if (document.getElementById('btnCloseEditLabel')) {
        document.getElementById('btnCloseEditLabel').addEventListener('click', () => {
            editLabelModal.classList.add('hidden');
        });
    }
    if (document.getElementById('btnCancelEditLabel')) {
        document.getElementById('btnCancelEditLabel').addEventListener('click', () => {
            editLabelModal.classList.add('hidden');
        });
    }
    if (document.getElementById('btnDeleteLabel')) {
        document.getElementById('btnDeleteLabel').addEventListener('click', () => {
            if (currentEditingLabel && confirm(`¿Estás seguro de eliminar la etiqueta "${currentEditingLabel}"?`)) {
                const products = getProducts();
                products.forEach(p => {
                    if (p.labels && p.labels.includes(currentEditingLabel)) {
                        p.labels = p.labels.filter(l => l !== currentEditingLabel);
                        saveProduct(p);
                    }
                });
                deleteLabel(currentEditingLabel);
                renderLabels();
                initFilters(getProducts());
                editLabelModal.classList.add('hidden');
            }
        });
    }

    function initLabelNameEditing() {
        editLabelName.style.cursor = 'pointer';
        editLabelName.onclick = function() {
            const currentName = currentEditingLabel;
            const newName = prompt('Nueva nombre de la etiqueta:', currentName);
            if (newName && newName.trim() && newName !== currentName) {
                const products = getProducts();
                products.forEach(p => {
                    if (p.labels && p.labels.includes(currentName)) {
                        p.labels = p.labels.map(l => l === currentName ? newName.trim() : l);
                        saveProduct(p);
                    }
                });
                updateLabelName(currentName, newName.trim(), currentEditingLabelColor);
                currentEditingLabel = newName.trim();
                editLabelName.textContent = newName.trim();
                renderLabels();
                initFilters(getProducts());
            }
        };
    }

    if (editLabelModal) {
        editLabelModal.addEventListener('click', (e) => {
            if (e.target === editLabelModal) {
                editLabelModal.classList.add('hidden');
            }
        });
        editLabelModal.addEventListener('transitionend', () => {
            if (!editLabelModal.classList.contains('hidden') && currentEditingLabel) {
                initLabelNameEditing();
            }
        });
    }

    btnAddSubCat.addEventListener('click', () => {
        const name = newSubCatInput.value.trim();
        if (name) {
            saveSubCategory(name);
            newSubCatInput.value = '';
            renderSubCategories();
            initFilters(getProducts()); // Refresh dropdowns
        }
    });

    const btnAddHomeCat = document.getElementById('btnAddHomeCat');
    const homeCatSelector = document.getElementById('homeCatSelector');
    if (btnAddHomeCat && homeCatSelector) {
        btnAddHomeCat.addEventListener('click', () => {
            const catId = homeCatSelector.value;
            if (catId) {
                addCategoryToHome(catId);
                renderHomeCategories();
            }
        });
    }

    if (btnAddLabel) {
        btnAddLabel.addEventListener('click', () => {
            const name = newLabelName.value.trim();
            const color = newLabelColor.value;
            const originalName = editingLabelOriginalName ? editingLabelOriginalName.value : null;

            if (name) {
                if (typeof saveLabel === 'function') {
                    saveLabel({ name, color }, originalName);
                }
                newLabelName.value = '';
                if (editingLabelOriginalName) editingLabelOriginalName.value = '';
                cancelLabelEdit(); // Reset UI Mode
                renderLabels();
                initAdminPanel(); // Ensure everything refreshes
            }
        });
    }

    window.handleEditLabel = function(name, color) {
        if (!newLabelName || !newLabelColor) return;
        
        newLabelName.value = name;
        newLabelColor.value = color;
        if (editingLabelOriginalName) editingLabelOriginalName.value = name;
        
        // Match color in palette
        if (colorPalette) {
            const buttons = colorPalette.querySelectorAll('button');
            let matched = false;
            buttons.forEach(btn => {
                const btnColor = btn.style.backgroundColor;
                // Convert hex to rgb for comparison or use a standard approach
                // Simplified: just find the button that was clicked or matching hex
                if (rgbToHex(btnColor).toLowerCase() === color.toLowerCase()) {
                    selectPaletteColor(color, btn);
                    matched = true;
                }
            });
        }
        
        // Update Add Button UI
        if (btnAddLabel) {
            btnAddLabel.classList.replace('bg-primary', 'bg-blue-600');
            const span = btnAddLabel.querySelector('span');
            const icon = btnAddLabel.querySelector('i');
            if (span) span.textContent = 'Guardar Cambios';
            if (icon) icon.classList.replace('fa-plus', 'fa-save');
        }
        if (btnCancelLabelEdit) btnCancelLabelEdit.classList.remove('hidden');
        
        newLabelName.focus();
    };

    window.cancelLabelEdit = function() {
        if (newLabelName) newLabelName.value = '';
        if (editingLabelOriginalName) editingLabelOriginalName.value = '';
        
        if (btnAddLabel) {
            btnAddLabel.classList.replace('bg-blue-600', 'bg-primary');
            const span = btnAddLabel.querySelector('span');
            const icon = btnAddLabel.querySelector('i');
            if (span) span.textContent = 'Añadir Etiqueta';
            if (icon) icon.classList.replace('fa-save', 'fa-plus');
        }
        if (btnCancelLabelEdit) btnCancelLabelEdit.classList.add('hidden');
    };

    if (btnCancelLabelEdit) {
        btnCancelLabelEdit.addEventListener('click', cancelLabelEdit);
    }

    // Helper to compare colors
    function rgbToHex(rgb) {
        if (!rgb) return "";
        if (rgb.startsWith('#')) return rgb;
        const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!parts) return rgb;
        delete(parts[0]);
        for (let i = 1; i <= 3; ++i) {
            parts[i] = parseInt(parts[i]).toString(16);
            if (parts[i].length === 1) parts[i] = '0' + parts[i];
        }
        return '#' + parts.join('');
    }

    function initAdminPanel() {
        selectedProductIds.clear();
        updateBulkToolbarVisibility();
        switchTab('products');
        renderProducts();
        initFilters(getProducts());
        renderSubCategories();
        renderLaboratories();
        renderLabels();
        initColorPalette();
    }

    // --- Client Management ---
    let currentEditingClientId = null;

    function renderClients(searchTerm = '') {
        if (!clientsContainer) return;
        
        let clients = typeof getUsers === 'function' ? getUsers() : [];
        
        if (searchTerm) {
            clients = clients.filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.phone && c.phone.includes(searchTerm))
            );
        }

        if (clients.length === 0) {
            clientsContainer.classList.add('hidden');
            clientsEmptyState.classList.remove('hidden');
        } else {
            clientsContainer.classList.remove('hidden');
            clientsEmptyState.classList.add('hidden');
            
            clientsContainer.innerHTML = clients.map(client => {
                const orders = typeof getOrdersByUser === 'function' ? getOrdersByUser(client.id) : [];
                const orderCount = orders.length;
                const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
                
                return `
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition cursor-pointer" onclick="openClientModal('${client.id}')">
                        <div class="flex items-start justify-between mb-3">
                            <div class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-primary text-xl"></i>
                            </div>
                            <span class="text-xs text-gray-400">${client.id ? client.id.substring(0, 8) : ''}</span>
                        </div>
                        <h3 class="font-bold text-gray-800 mb-1">${client.name || 'Sin nombre'}</h3>
                        <p class="text-sm text-gray-500 mb-3">${client.email}</p>
                        <div class="flex items-center gap-4 text-xs text-gray-600">
                            <span><i class="fas fa-shopping-bag mr-1"></i> ${orderCount} pedidos</span>
                            <span><i class="fas fa-dollar-sign mr-1"></i> $${totalSpent.toLocaleString('es-AR')}</span>
                        </div>
                        ${client.phone ? `<p class="text-xs text-gray-400 mt-2"><i class="fas fa-phone mr-1"></i> ${client.phone}</p>` : ''}
                    </div>
                `;
            }).join('');
        }
    }

    window.openClientModal = function(clientId) {
        const clients = getUsers();
        const client = clients.find(c => c.id === clientId);
        
        if (!client) return;
        
        currentEditingClientId = clientId;
        clientModalTitle.textContent = 'Editar Cliente';
        clientIdInput.value = client.id;
        clientNameInput.value = client.name || '';
        clientEmailInput.value = client.email || '';
        clientPhoneInput.value = client.phone || '';
        clientLocationInput.value = client.location || '';
        clientIdentificationInput.value = client.identification || '';
        
        // Show orders
        const orders = getOrdersByUser(client.id);
        if (orders.length > 0) {
            clientOrdersSection.classList.remove('hidden');
            clientOrdersList.innerHTML = orders.map(order => `
                <div class="bg-gray-50 p-2 rounded-lg flex justify-between items-center text-sm hover:bg-gray-100 cursor-pointer transition" onclick="viewOrderDetail('${order.id}')">
                    <div>
                        <span class="font-medium text-primary">#${order.id ? order.id.substring(0, 8) : ''}</span>
                        <span class="text-gray-500 ml-2">${new Date(order.createdAt).toLocaleDateString('es-AR')}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-xs font-medium ${
                            order.status === 'Entregado' ? 'bg-green-100 text-green-700' :
                            order.status === 'Enviado' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Confirmado' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'Cancelado' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }">${order.status}</span>
                        <span class="font-bold">$${order.total.toLocaleString('es-AR')}</span>
                        <i class="fas fa-chevron-right text-xs text-gray-400 ml-1"></i>
                    </div>
                </div>
            `).join('');
        } else {
            clientOrdersSection.classList.add('hidden');
            clientOrdersList.innerHTML = '';
        }
        
        // Show delete button
        btnDeleteClient.classList.remove('hidden');
        
        clientModal.classList.remove('hidden');
    };

    window.viewOrderDetail = function(orderId) {
        // Close client modal first
        if (clientModal) {
            clientModal.classList.add('hidden');
        }
        
        // Use the existing showOrderDetails function
        showOrderDetails(orderId);
    };

    function openNewClientModal() {
        currentEditingClientId = null;
        clientModalTitle.textContent = 'Nuevo Cliente';
        clientIdInput.value = '';
        clientNameInput.value = '';
        clientEmailInput.value = '';
        clientPhoneInput.value = '';
        clientLocationInput.value = '';
        clientIdentificationInput.value = '';
        clientOrdersSection.classList.add('hidden');
        btnDeleteClient.classList.add('hidden');
        clientModal.classList.remove('hidden');
    }

    function saveClient() {
        const name = clientNameInput.value.trim();
        const email = clientEmailInput.value.trim();
        
        if (!name || !email) {
            alert('Por favor complete los campos requeridos');
            return;
        }

        const clients = getUsers();
        
        if (currentEditingClientId) {
            // Update existing client
            const clientIndex = clients.findIndex(c => c.id === currentEditingClientId);
            if (clientIndex !== -1) {
                clients[clientIndex].name = name;
                clients[clientIndex].email = email;
                clients[clientIndex].phone = clientPhoneInput.value.trim();
                clients[clientIndex].location = clientLocationInput.value.trim();
                clients[clientIndex].identification = clientIdentificationInput.value.trim();
                saveUsers(clients);
            }
        } else {
            // Create new client
            const newClient = {
                id: generateId(),
                name: name,
                email: email,
                phone: clientPhoneInput.value.trim(),
                location: clientLocationInput.value.trim(),
                identification: clientIdentificationInput.value.trim(),
                createdAt: new Date().toISOString()
            };
            clients.push(newClient);
            saveUsers(clients);
        }
        
        clientModal.classList.add('hidden');
        renderClients(clientSearch ? clientSearch.value : '');
    }

    function deleteClient() {
        if (currentEditingClientId && confirm('¿Está seguro de eliminar este cliente?')) {
            let clients = getUsers();
            clients = clients.filter(c => c.id !== currentEditingClientId);
            saveUsers(clients);
            clientModal.classList.add('hidden');
            renderClients(clientSearch ? clientSearch.value : '');
        }
    }

    // Client modal event listeners
    if (btnNewClient) {
        btnNewClient.addEventListener('click', openNewClientModal);
    }
    if (btnSaveClient) {
        btnSaveClient.addEventListener('click', saveClient);
    }
    if (btnDeleteClient) {
        btnDeleteClient.addEventListener('click', deleteClient);
    }
    if (btnCloseClientModal) {
        btnCloseClientModal.addEventListener('click', () => clientModal.classList.add('hidden'));
    }
    if (btnCancelClient) {
        btnCancelClient.addEventListener('click', () => clientModal.classList.add('hidden'));
    }
    if (clientModal) {
        clientModal.addEventListener('click', (e) => {
            if (e.target === clientModal) clientModal.classList.add('hidden');
        });
    }
    if (clientSearch) {
        clientSearch.addEventListener('input', (e) => renderClients(e.target.value));
    }

    // --- Sub-Category Picker Logic (Modal) ---
    
    function renderSubCatPills() {
        subCatSelectedPills.innerHTML = '';
        selectedSubCategories.forEach(cat => {
            const pill = document.createElement('div');
            pill.className = 'bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm';
            pill.innerHTML = `
                ${cat}
                <button type="button" class="ml-2 hover:text-red-200 transition" onclick="removeSubCatFromProduct('${cat}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            subCatSelectedPills.appendChild(pill);
        });
    }

    window.removeSubCatFromProduct = function(name) {
        selectedSubCategories = selectedSubCategories.filter(c => c !== name);
        renderSubCatPills();
    };

    function showSubCatDropdown(query = '') {
        const allCats = getSubCategories();
        const filtered = allCats.filter(c => 
            c.toLowerCase().includes(query.toLowerCase()) && 
            !selectedSubCategories.includes(c)
        );

        subCatResults.innerHTML = '';
        
        if (filtered.length === 0) {
            subCatResults.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500 italic">No se encontraron resultados</div>';
        } else {
            filtered.forEach(cat => {
                const item = document.createElement('div');
                item.className = 'px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition flex items-center';
                item.innerHTML = `<i class="fas fa-tag mr-2 text-gray-300"></i> ${cat}`;
                item.onclick = () => {
                    selectedSubCategories.push(cat);
                    renderSubCatPills();
                    subCatSearch.value = '';
                    subCatDropdown.classList.add('hidden');
                };
                subCatResults.appendChild(item);
            });
        }

        // Show "Add New" button if query doesn't match exactly
        const exactMatch = allCats.find(c => c.toLowerCase() === query.toLowerCase());
        if (query && !exactMatch) {
            btnAddNewSubCatInline.classList.remove('hidden');
        } else {
            btnAddNewSubCatInline.classList.add('hidden');
        }

        subCatDropdown.classList.remove('hidden');
    }

    if (subCatSearch) {
        subCatSearch.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                showSubCatDropdown(query);
            } else {
                subCatDropdown.classList.add('hidden');
                btnAddNewSubCatInline.classList.add('hidden');
            }
        });

        subCatSearch.addEventListener('focus', () => {
            if (subCatSearch.value.trim().length === 0) {
                showSubCatDropdown('');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (subCatPicker && !subCatPicker.contains(e.target)) {
                subCatDropdown.classList.add('hidden');
            }
        });
    }

    if (btnAddNewSubCatInline) {
        btnAddNewSubCatInline.addEventListener('click', () => {
            const name = subCatSearch.value.trim();
            if (name) {
                saveSubCategory(name); // Save to global list
                selectedSubCategories.push(name); // Add to current product
                renderSubCatPills();
                subCatSearch.value = '';
                btnAddNewSubCatInline.classList.add('hidden');
                subCatDropdown.classList.add('hidden');
                renderSubCategories(); // Refresh the management list if it's open
            }
        });
    }

    // --- Label Picker Logic (Modal) ---
    
    function renderLabelPills() {
        if (!labelSelectedPills) return;
        labelSelectedPills.innerHTML = '';
        selectedLabels.forEach(labelName => {
            const labelColor = typeof getColorForLabel === 'function' ? getColorForLabel(labelName) : '#2196f3';
            const pill = document.createElement('div');
            pill.className = 'text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm';
            pill.style.backgroundColor = labelColor;
            pill.innerHTML = `
                ${labelName}
                <button type="button" class="ml-2 hover:opacity-70 transition" onclick="removeLabelFromProduct('${labelName}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            labelSelectedPills.appendChild(pill);
        });
    }

    window.removeLabelFromProduct = function(name) {
        selectedLabels = selectedLabels.filter(l => l !== name);
        renderLabelPills();
    };

    function showLabelDropdown(query = '') {
        const allLabels = typeof getLabels === 'function' ? getLabels() : [];
        const filtered = allLabels.filter(l => {
            const name = typeof l === 'string' ? l : l.name;
            return name.toLowerCase().includes(query.toLowerCase()) && 
                   !selectedLabels.includes(name);
        });

        labelResults.innerHTML = '';
        
        if (filtered.length === 0) {
            labelResults.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500 italic">No se encontraron resultados</div>';
        } else {
            filtered.forEach(label => {
                const name = typeof label === 'string' ? label : label.name;
                const color = (typeof label === 'object' && label.color) ? label.color : '#2d5a27';
                
                const item = document.createElement('div');
                item.className = 'px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition flex items-center';
                item.innerHTML = `
                    <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${color}"></div>
                    ${name}
                `;
                item.onclick = () => {
                    selectedLabels.push(name);
                    renderLabelPills();
                    labelSearch.value = '';
                    labelDropdown.classList.add('hidden');
                };
                labelResults.appendChild(item);
            });
        }

        const exactMatch = allLabels.find(l => {
            const name = typeof l === 'string' ? l : l.name;
            return name.toLowerCase() === query.toLowerCase();
        });
        
        if (query && !exactMatch) {
            btnAddNewLabelInline.classList.remove('hidden');
        } else {
            btnAddNewLabelInline.classList.add('hidden');
        }

        labelDropdown.classList.remove('hidden');
    }

    if (labelSearch) {
        labelSearch.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                showLabelDropdown(query);
            } else {
                labelDropdown.classList.add('hidden');
                btnAddNewLabelInline.classList.add('hidden');
            }
        });

        labelSearch.addEventListener('focus', () => {
            if (labelSearch.value.trim().length === 0) {
                showLabelDropdown('');
            }
        });

        document.addEventListener('click', (e) => {
            if (labelPicker && !labelPicker.contains(e.target)) {
                labelDropdown.classList.add('hidden');
            }
        });
    }

    if (btnAddNewLabelInline) {
        btnAddNewLabelInline.addEventListener('click', () => {
            const name = labelSearch.value.trim();
            if (name) {
                // Pick a random color from the preset highlights
                const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
                if (typeof saveLabel === 'function') saveLabel({ name, color: randomColor });
                selectedLabels.push(name);
                renderLabelPills();
                labelSearch.value = '';
                btnAddNewLabelInline.classList.add('hidden');
                labelDropdown.classList.add('hidden');
                renderLabels();
            }
        });
    }

    // Load and render products (with filtering)
    function renderProducts() {
        let products = getProducts();
        
        console.log('renderProducts called, total products:', products.length);
        
        // Initialize filters if needed
        initFilters(products);
        
        // Apply Filters
        if (adminSearch) {
            const searchTerm = adminSearch.value.toLowerCase().trim();
            const selectedLab = selectedLabFilter || '';
            
            console.log('Filtering - searchTerm:', searchTerm, 'selectedLab:', selectedLab);
            
            products = products.filter(product => {
                const matchSearch = product.title.toLowerCase().includes(searchTerm) || 
                                    (product.action || '').toLowerCase().includes(searchTerm);
                
                // Normalize lab comparison for case-insensitivity
                const productLab = product.laboratory ? product.laboratory.trim() : '';
                const productLabs = product.laboratories ? product.laboratories.map(l => l.trim()) : [];
                const selectedLabNormalized = selectedLab.trim().toLowerCase();
                
                const matchLab = selectedLab === "" || 
                                 productLab.toLowerCase() === selectedLabNormalized || 
                                 productLabs.some(lab => lab.toLowerCase() === selectedLabNormalized);
                
                if (selectedLab && selectedLab !== "") {
                    console.log('Product:', product.title, 'lab:', productLab, 'labs:', productLabs, 'selected:', selectedLab, 'matchLab:', matchLab);
                }
                
                return matchSearch && matchLab;
            });
            
            console.log('Filtered products count:', products.length);
        }

        if (!productsTableBody) return;
        productsTableBody.innerHTML = '';
        
        if (products.length === 0) {
            emptyState.classList.remove('hidden');
            productsTableBody.parentElement.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        productsTableBody.parentElement.classList.remove('hidden');

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            
            // Format price
            const priceStr = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price);
            
            // Format breeds
            const breedsStr = (product.animalBreeds && product.animalBreeds.length > 0)
                ? product.animalBreeds.map(b => `<span class="inline-block bg-accent bg-opacity-20 text-dark text-[10px] px-1.5 py-0.5 rounded capitalize mr-1 mb-1 font-medium">${b}</span>`).join('')
                : '<span class="text-xs text-gray-400 italic">No especificado</span>';
            
            const labBadges = (product.laboratories && product.laboratories.length > 0)
                ? product.laboratories.map(lab => `<div class="mt-1 text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 inline-block mr-1 mb-1">${lab}</div>`).join('')
                : (product.laboratory ? `<div class="mt-1 text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 inline-block">${product.laboratory}</div>` : '');

            const subCatBadges = (product.subCategories && product.subCategories.length > 0)
                ? product.subCategories.map(cat => `<div class="mt-1 text-[10px] font-bold text-primary uppercase bg-green-50 px-1.5 py-0.5 rounded border border-green-100 inline-block mr-1 mb-1">${cat}</div>`).join('')
                : (product.subCategory ? `<div class="mt-1 text-[10px] font-bold text-primary uppercase bg-green-50 px-1.5 py-0.5 rounded border border-green-100 inline-block">${product.subCategory}</div>` : '');
 
            const isChecked = selectedProductIds.has(product.id) ? 'checked' : '';
 
            tr.innerHTML = `
                <td class="p-4 border-b border-gray-200 text-center">
                    <input type="checkbox" class="product-select w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" value="${product.id}" ${isChecked}>
                </td>
                <td class="p-4 border-b border-gray-200">
                    <div class="flex items-center">
                        <img src="${getImageUrl(product.image)}" class="w-10 h-10 rounded object-cover mr-3 border border-gray-100">
                        <div>
                            <div class="font-bold text-gray-800 text-sm leading-tight">${product.title}</div>
                            <div class="text-[11px] text-gray-500 mt-0.5">${product.volumeWeight}</div>
                            <div class="flex flex-wrap mt-1">${subCatBadges}</div>
                        </div>
                    </div>
                </td>
                <td class="p-4 border-b border-gray-200">
                    <div class="flex flex-wrap max-w-[200px]">${labBadges}</div>
                </td>
                <td class="p-4 border-b border-gray-200">
                    <div class="flex flex-wrap max-w-[200px]">${breedsStr}</div>
                </td>
                <td class="p-4 border-b border-gray-200 font-medium text-primary">${priceStr}</td>
                <td class="p-4 border-b border-gray-200 text-center">
                    <button class="text-blue-500 hover:text-blue-700 mx-1 p-2 rounded transition" onclick="editProduct('${product.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-green-500 hover:text-green-700 mx-1 p-2 rounded transition" onclick="duplicateProduct('${product.id}')" title="Duplicar">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-700 mx-1 p-2 rounded transition" onclick="promptDelete('${product.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productsTableBody.appendChild(tr);
        });

        // Re-bind individual checkboxes
        bindSelectionEvents();
    }

    // Modal behavior
    function openModal(titleText) {
        modalTitle.textContent = titleText;
        productModal.classList.remove('hidden');
        resetImageUploadUI();
        populateLabSelect(); // Populate lab select with available labs
    }

    function closeModal() {
        productModal.classList.add('hidden');
        productForm.reset();
        document.getElementById('productId').value = '';
        selectedSubCategories = [];
        renderSubCatPills();
        subCatSearch.value = '';
        btnAddNewSubCatInline.classList.add('hidden');
        subCatDropdown.classList.add('hidden');

        selectedLaboratory = '';
        labSelect.value = '';
        labNewOption.style.display = 'none';
        btnShowLabNew.textContent = 'Agregar nuevo laboratorio';
        btnShowLabNew.onclick = toggleLabNewOption;

        resetImageUploadUI();
    }

    // Populate lab select dropdown
    function populateLabSelect() {
        if (!labSelect) return;
        
        const labs = getLaboratories();
        const currentValue = labSelect.value;
        
        labSelect.innerHTML = '<option value="">Selecciona un laboratorio...</option>';
        
        labs.forEach(lab => {
            const option = document.createElement('option');
            option.value = lab;
            option.textContent = lab;
            labSelect.appendChild(option);
        });
        
        // Restore previous selection if editing
        if (currentValue) {
            labSelect.value = currentValue;
        }
    }

    // Toggle new lab option input
    function toggleLabNewOption() {
        if (labNewOption.style.display === 'none') {
            labNewOption.style.display = 'block';
            labSelect.value = '';
            selectedLaboratory = '';
            btnShowLabNew.textContent = 'Cancelar';
            labNewOption.focus();
        } else {
            labNewOption.style.display = 'none';
            labNewOption.value = '';
            btnShowLabNew.textContent = 'Agregar nuevo laboratorio';
        }
    }

    if (btnShowLabNew) {
        btnShowLabNew.addEventListener('click', toggleLabNewOption);
    }

    if (labSelect) {
        labSelect.addEventListener('change', (e) => {
            selectedLaboratory = e.target.value;
            labNewOption.style.display = 'none';
            labNewOption.value = '';
            btnShowLabNew.textContent = 'Agregar nuevo laboratorio';
        });
    }

    // Populate form for Edit / Duplicate
    function populateForm(product) {
        document.getElementById('title').value = product.title;
        document.getElementById('price').value = product.price;
        document.getElementById('volumeWeight').value = product.volumeWeight;
        document.getElementById('drugs').value = product.drugs;
        document.getElementById('action').value = product.action || '';
        document.getElementById('dose').value = product.dose;
        document.getElementById('indications').value = product.indications || '';
        document.getElementById('externalLink').value = product.externalLink || '';

        // Handle Image population
        if (product.image && product.image.startsWith('data:image')) {
            // It's a base64 image
            setDropzonePreview(product.image);
            imageBase64.value = product.image;
        } else if (product.image) {
            // It's a standard URL or server path - show preview
            const fullUrl = getImageUrl(product.image);
            setDropzonePreview(fullUrl);
            imageInput.value = product.image;
        }

        // Checkboxes
        const checkboxes = document.querySelectorAll('input[name="animalBreeds"]');
        checkboxes.forEach(cb => {
            cb.checked = product.animalBreeds && product.animalBreeds.includes(cb.value);
        });

        // Laboratory (single selection)
        const productLab = product.laboratory || (product.laboratories && product.laboratories[0]) || '';
        selectedLaboratory = productLab;
        
        // Populate select and set value
        populateLabSelect();
        labSelect.value = productLab;

        // Sub-categories
        if (product.subCategories) {
            selectedSubCategories = [...product.subCategories];
        } else if (product.subCategory) {
            selectedSubCategories = [product.subCategory]; // Legacy support
        } else {
            selectedSubCategories = [];
        }
        renderSubCatPills();

        // Labels
        selectedLabels = product.labels || [];
        renderLabelPills();
    }

    // Global Functions for inline onclick handlers
    window.editProduct = function(id) {
        const product = getProductById(id);
        if (product) {
            populateForm(product);
            document.getElementById('productId').value = product.id;
            openModal('Editar Producto');
        }
    };

    window.duplicateProduct = function(id) {
        const product = getProductById(id);
        if (product) {
            populateForm(product);
            document.getElementById('title').value = product.title + ' (Copia)';
            document.getElementById('productId').value = ''; // Empty ID to create new
            openModal('Duplicar Producto');
        }
    };

    window.promptDelete = function(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
            deleteProduct(id);
            renderProducts();
        }
    };

    // Event Listeners
    if (btnNewProduct) {
        btnNewProduct.addEventListener('click', () => {
            selectedLaboratory = '';
            selectedSubCategories = [];
            selectedLabels = [];
            labSelect.value = '';
            labNewOption.style.display = 'none';
            labNewOption.value = '';
            btnShowLabNew.textContent = 'Agregar nuevo laboratorio';
            populateLabSelect();
            renderSubCatPills();
            renderLabelPills();
            openModal('Nuevo Producto');
        });
    }
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    if (btnSave) {
        btnSave.addEventListener('click', async () => {
        // Validate
        if (!productForm.checkValidity()) {
            productForm.reportValidity();
            return;
        }

        // Get breeds
        const breeds = [];
        document.querySelectorAll('input[name="animalBreeds"]:checked').forEach(cb => {
            breeds.push(cb.value);
        });

        // Get laboratorio and product title for image upload
        let laboratorio = '';
        let productTitle = '';
        
        // Get product title first
        const titleInput = document.getElementById('title');
        if (titleInput) {
            productTitle = titleInput.value.trim();
        }
        
        // Get laboratorio - check if new option was typed, otherwise use select value
        const newLabValue = labNewOption.value.trim();
        if (newLabValue) {
            laboratorio = newLabValue;
            // Add to laboratories list if not exists
            const labs = getLaboratories();
            if (!labs.includes(laboratorio)) {
                saveLaboratory(laboratorio);
            }
        } else if (selectedLaboratory) {
            laboratorio = selectedLaboratory;
        }
        
        // If no laboratorio, try to get from the current editing product
        if (!laboratorio) {
            const productIdEl = document.getElementById('productId');
            const productId = productIdEl ? productIdEl.value : null;
            if (productId) {
                const products = getProducts();
                const product = products.find(p => p.id === productId);
                if (product) {
                    if (!productTitle && product.title) {
                        productTitle = product.title;
                    }
                    laboratorio = product.laboratory || '';
                }
            }
        }
        
        console.log('Laboratorio para imagen:', laboratorio, '| Producto:', productTitle);

        // Determine final image string
        let finalImage = 'https://placehold.co/600x400?text=Sin+Imagen';
        
        // Si hay un archivo pendiente por subir al servidor
        if (pendingImageFile) {
            // Si no tiene laboratorio, usar 'otros'
            if (!laboratorio) {
                laboratorio = 'otros';
            }
            
            try {
                btnSave.disabled = true;
                btnSave.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Subiendo imagen...';
                
                const imagePath = await uploadImageToServer(pendingImageFile, laboratorio, productTitle);
                finalImage = imagePath;
                console.log('Imagen subida al servidor:', imagePath);
            } catch (error) {
                console.error('Error al subir imagen:', error);
                alert('Error al subir la imagen. Se usará el método tradicional (base64).');
                // Fallback a base64 si el servidor no está disponible
                if (imageBase64.value) {
                    finalImage = imageBase64.value;
                } else if (imageInput.value) {
                    finalImage = imageInput.value;
                }
            } finally {
                btnSave.disabled = false;
                btnSave.innerHTML = 'Guardar';
                pendingImageFile = null;
            }
        } else {
            // Método tradicional: Base64 o URL
            if (imageBase64.value) {
                finalImage = imageBase64.value;
            } else if (imageInput.value) {
                finalImage = imageInput.value;
            }
        }

        // Create product object
        const finalProductId = document.getElementById('productId').value || generateId();
        
        function toSentenceCase(text) {
            if (!text) return '';
            return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        }
        
        const product = {
            id: finalProductId,
            title: document.getElementById('title').value,
            laboratory: laboratorio || 'Varios',
            price: parseFloat(document.getElementById('price').value),
            volumeWeight: document.getElementById('volumeWeight').value,
            drugs: document.getElementById('drugs').value,
            action: toSentenceCase(document.getElementById('action').value),
            indications: toSentenceCase(document.getElementById('indications').value),
            dose: toSentenceCase(document.getElementById('dose').value),
            image: finalImage,
            externalLink: document.getElementById('externalLink').value,
            animalBreeds: breeds,
            subCategories: selectedSubCategories,
            labels: selectedLabels
        };

        saveProduct(product);
        closeModal();
        renderProducts();
    });
    }

    // Close on click outside modal content
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeModal();
            }
        });
    }

    // Add filter event listeners
    console.log('adminSearch exists:', !!adminSearch);
    console.log('adminLabFilter exists:', !!adminLabFilter);
    
    if (adminSearch) adminSearch.addEventListener('input', renderProducts);
    if (adminLabFilter) {
        // Input events for autocomplete
        adminLabFilter.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                showLabFilterDropdown(query);
            } else {
                hideLabFilterDropdown();
            }
        });
        
        adminLabFilter.addEventListener('focus', (e) => {
            const query = e.target.value.trim();
            showLabFilterDropdown(query);
        });
        
        adminLabFilter.addEventListener('blur', () => {
            // Delay hiding to allow click on dropdown items
            setTimeout(hideLabFilterDropdown, 200);
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!adminLabFilter.contains(e.target) && !labFilterDropdown.contains(e.target)) {
                hideLabFilterDropdown();
            }
        });
        
        console.log('Filter event listeners added to adminLabFilter');
    } else {
        console.error('adminLabFilter element not found!');
    }

    // Variable para guardar el archivo a subir al servidor
    let pendingImageFile = null;

    // --- Image Dropzone Logic ---
    function processImageFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido.');
            return;
        }
        
        // Prevent huge files (e.g. > 5MB = 5 * 1024 * 1024 bytes)
        const MAX_SIZE = 5242880;
        if (file.size > MAX_SIZE) {
            alert('La imagen es demasiado grande. El máximo permitido es 5MB.');
            return;
        }

        // Guardar archivo para subirlo después al servidor
        pendingImageFile = file;
        
        // Mostrar preview usando FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Str = e.target.result;
            setDropzonePreview(base64Str);
            imageBase64.value = base64Str; // Mantener para fallback
            imageInput.value = ''; // Clear URL if local takes precedence
        };
        reader.readAsDataURL(file);
    }

    // Función para subir imagen al servidor (Supabase Storage)
    async function uploadImageToServer(file, laboratorio, productTitle) {
        console.log('uploadImageToServer - Laboratorio:', laboratorio, '| Producto:', productTitle);
        
        // Check if Supabase is available
        if (!isSupabaseAvailable()) {
            throw new Error('Supabase no disponible');
        }
        
        const labFolder = (laboratorio || 'otros').replace(/[^a-zA-Z0-9]/g, '_');
        const productName = (productTitle || 'producto').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        const timestamp = Date.now();
        const fileName = `${labFolder}_${productName}_${timestamp}.${file.name.split('.').pop()}`;
        
        try {
            const { data, error } = await window.supabase.storage
                .from('product-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (error) {
                console.error('Supabase upload error:', error);
                throw new Error(error.message);
            }
            
            // Get public URL
            const { data: urlData } = window.supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);
            
            console.log('Imagen subida a Supabase:', urlData.publicUrl);
            return urlData.publicUrl;
        } catch (err) {
            console.error('Error al subir imagen a Supabase:', err);
            throw err;
        }
    }

    function setDropzonePreview(imgSrc) {
        previewImg.src = imgSrc;
        dropzonePrompt.classList.add('hidden');
        dropzonePreview.classList.remove('hidden');
    }

    function resetImageUploadUI() {
        imageUploadFile.value = '';
        imageBase64.value = '';
        previewImg.src = '';
        dropzonePreview.classList.add('hidden');
        dropzonePrompt.classList.remove('hidden');
        imageDropzone.classList.remove('border-primary', 'bg-green-50');
        pendingImageFile = null;
    }

    // Drag & Drop event bindings
    if (imageDropzone && imageUploadFile) {
        imageUploadFile.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                processImageFile(e.target.files[0]);
            }
        });

        // Visual feedback during drag
        ['dragenter', 'dragover'].forEach(eventName => {
            imageDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageDropzone.classList.add('border-primary', 'bg-green-50');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            imageDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                if(eventName === 'dragleave') {
                    imageDropzone.classList.remove('border-primary', 'bg-green-50');
                }
            });
        });

        // Handle File Drop
        imageDropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files[0]) {
                processImageFile(files[0]);
            }
        });
        
        btnRemoveImage.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Avoid triggering file select
            resetImageUploadUI();
        });
    }

    // --- Bulk Selection & Update Logic ---
    function updateBulkToolbarVisibility() {
        if (!bulkActions || !selectedCount) return;
        
        const count = selectedProductIds.size;
        selectedCount.textContent = count;
        
        if (count > 0) {
            bulkActions.classList.remove('hidden');
        } else {
            bulkActions.classList.add('hidden');
        }
        
        // Sync master checkbox UI
        if(selectAllCheckbox) {
            const visibleCheckboxes = document.querySelectorAll('.product-select').length;
            selectAllCheckbox.checked = count > 0 && count === visibleCheckboxes;
        }
    }

    function bindSelectionEvents() {
        const checkboxes = document.querySelectorAll('.product-select');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedProductIds.add(e.target.value);
                } else {
                    selectedProductIds.delete(e.target.value);
                }
                updateBulkToolbarVisibility();
            });
        });
    }

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.product-select');
            if (e.target.checked) {
                checkboxes.forEach(cb => {
                    cb.checked = true;
                    selectedProductIds.add(cb.value);
                });
            } else {
                checkboxes.forEach(cb => {
                    cb.checked = false;
                    selectedProductIds.delete(cb.value);
                });
            }
            updateBulkToolbarVisibility();
        });
    }

    if (btnBulkPrice) {
        btnBulkPrice.addEventListener('click', () => {
            if (selectedProductIds.size === 0) return;
            
            const percRaw = prompt(`Incrementar el precio de ${selectedProductIds.size} productos seleccionados.\nIngrese el porcentaje de aumento (Ej. 15):`);
            if (percRaw === null) return; // Cancelled
            
            const perc = parseFloat(percRaw);
            if (isNaN(perc) || perc <= 0) {
                alert('Por favor ingrese un número porcentual válido y mayor que cero.');
                return;
            }

            // Apply update
            selectedProductIds.forEach(id => {
                const p = getProductById(id);
                if (p) {
                    // Calculate and round to 2 decimals
                    p.price = Math.round(p.price * (1 + (perc / 100)) * 100) / 100;
                    saveProduct(p);
                }
            });

            alert(`¡Se ha aumentado el precio un ${perc}% a los productos seleccionados exitosamente!`);
            
            // Uncheck all after action
            selectedProductIds.clear();
            renderProducts();
            updateBulkToolbarVisibility();
        });
    }

    // --- Bulk Edit Labels Logic ---
    if (btnBulkLabels) {
        btnBulkLabels.addEventListener('click', () => {
            if (selectedProductIds.size === 0) return;
            
            bulkLabelsCount.textContent = selectedProductIds.size;
            bulkSelectedLabels = [];
            renderBulkLabelsPills();
            bulkLabelsModal.classList.remove('hidden');
        });
    }

    function renderBulkLabelsPills() {
        bulkLabelsSelectedPills.innerHTML = '';
        bulkSelectedLabels.forEach(labelName => {
            const labelColor = typeof getColorForLabel === 'function' ? getColorForLabel(labelName) : '#2196f3';
            const pill = document.createElement('div');
            pill.className = 'text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm';
            pill.style.backgroundColor = labelColor;
            pill.innerHTML = `
                ${labelName}
                <button type="button" class="ml-2 hover:opacity-70 transition" onclick="removeBulkLabel('${labelName}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            bulkLabelsSelectedPills.appendChild(pill);
        });
    }

    window.removeBulkLabel = function(name) {
        bulkSelectedLabels = bulkSelectedLabels.filter(l => l !== name);
        renderBulkLabelsPills();
    };

    function showBulkLabelsDropdown(query = '') {
        const allLabels = typeof getLabels === 'function' ? getLabels() : [];
        const filtered = allLabels.filter(l => {
            const name = typeof l === 'string' ? l : l.name;
            return name.toLowerCase().includes(query.toLowerCase()) && 
                   !bulkSelectedLabels.includes(name);
        });

        bulkLabelsResults.innerHTML = '';
        
        if (filtered.length === 0) {
            bulkLabelsResults.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500 italic">No se encontraron resultados</div>';
        } else {
            filtered.forEach(label => {
                const name = typeof label === 'string' ? label : label.name;
                const color = (typeof label === 'object' && label.color) ? label.color : '#2d5a27';
                
                const item = document.createElement('div');
                item.className = 'px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition flex items-center';
                item.innerHTML = `
                    <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${color}"></div>
                    ${name}
                `;
                item.onclick = () => {
                    bulkSelectedLabels.push(name);
                    renderBulkLabelsPills();
                    bulkLabelsSearch.value = '';
                    bulkLabelsDropdown.classList.add('hidden');
                };
                bulkLabelsResults.appendChild(item);
            });
        }

        const exactMatch = allLabels.find(l => {
            const name = typeof l === 'string' ? l : l.name;
            return name.toLowerCase() === query.toLowerCase();
        });
        
        if (query && !exactMatch) {
            btnAddBulkLabelInline.classList.remove('hidden');
        } else {
            btnAddBulkLabelInline.classList.add('hidden');
        }

        bulkLabelsDropdown.classList.remove('hidden');
    }

    if (bulkLabelsSearch) {
        bulkLabelsSearch.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                showBulkLabelsDropdown(query);
            } else {
                bulkLabelsDropdown.classList.add('hidden');
                btnAddBulkLabelInline.classList.add('hidden');
            }
        });

        bulkLabelsSearch.addEventListener('focus', () => {
            if (bulkLabelsSearch.value.trim().length === 0) {
                showBulkLabelsDropdown('');
            }
        });

        document.addEventListener('click', (e) => {
            if (document.getElementById('bulkLabelsPicker') && !document.getElementById('bulkLabelsPicker').contains(e.target)) {
                bulkLabelsDropdown.classList.add('hidden');
            }
        });
    }

    if (btnAddBulkLabelInline) {
        btnAddBulkLabelInline.addEventListener('click', () => {
            const name = bulkLabelsSearch.value.trim();
            if (name) {
                // Pick a random color from the preset highlights
                const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
                if (typeof saveLabel === 'function') saveLabel({ name, color: randomColor });
                bulkSelectedLabels.push(name);
                renderBulkLabelsPills();
                bulkLabelsSearch.value = '';
                btnAddBulkLabelInline.classList.add('hidden');
                bulkLabelsDropdown.classList.add('hidden');
            }
        });
    }

    if (btnCancelBulkLabels) {
        btnCancelBulkLabels.addEventListener('click', () => {
            bulkLabelsModal.classList.add('hidden');
        });
    }

    if (btnCloseBulkLabelsModal) {
        btnCloseBulkLabelsModal.addEventListener('click', () => {
            bulkLabelsModal.classList.add('hidden');
        });
    }

    if (btnApplyBulkLabels) {
        btnApplyBulkLabels.addEventListener('click', () => {
            if (bulkSelectedLabels.length === 0) {
                alert('Por favor selecciona al menos una etiqueta.');
                return;
            }

            // Apply labels to selected products
            let updatedCount = 0;
            selectedProductIds.forEach(id => {
                const product = getProductById(id);
                if (product) {
                    if (!product.labels) product.labels = [];
                    bulkSelectedLabels.forEach(label => {
                        if (!product.labels.includes(label)) {
                            product.labels.push(label);
                        }
                    });
                    saveProduct(product);
                    updatedCount++;
                }
            });

            alert(`¡Etiquetas agregadas a ${updatedCount} productos exitosamente!`);
            bulkLabelsModal.classList.add('hidden');
            
            // Refresh and reset
            selectedProductIds.clear();
            renderProducts();
            updateBulkToolbarVisibility();
        });
    }

    // --- Bulk Edit Sub-categories Logic ---
    if (btnBulkSubCats) {
        btnBulkSubCats.addEventListener('click', () => {
            if (selectedProductIds.size === 0) return;
            
            bulkSubCatsCount.textContent = selectedProductIds.size;
            bulkSelectedSubCats = [];
            renderBulkSubCatsPills();
            bulkSubCatsModal.classList.remove('hidden');
        });
    }

    function renderBulkSubCatsPills() {
        bulkSubCatsSelectedPills.innerHTML = '';
        bulkSelectedSubCats.forEach(cat => {
            const pill = document.createElement('div');
            pill.className = 'bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm';
            pill.innerHTML = `
                ${cat}
                <button type="button" class="ml-2 hover:text-red-200 transition" onclick="removeBulkSubCat('${cat}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            bulkSubCatsSelectedPills.appendChild(pill);
        });
    }

    window.removeBulkSubCat = function(name) {
        bulkSelectedSubCats = bulkSelectedSubCats.filter(c => c !== name);
        renderBulkSubCatsPills();
    };

    function showBulkSubCatsDropdown(query = '') {
        const allCats = getSubCategories();
        const filtered = allCats.filter(c => 
            c.toLowerCase().includes(query.toLowerCase()) && 
            !bulkSelectedSubCats.includes(c)
        );

        bulkSubCatsResults.innerHTML = '';
        
        if (filtered.length === 0) {
            bulkSubCatsResults.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500 italic">No se encontraron resultados</div>';
        } else {
            filtered.forEach(cat => {
                const item = document.createElement('div');
                item.className = 'px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition flex items-center';
                item.innerHTML = `<i class="fas fa-tag mr-2 text-gray-300"></i> ${cat}`;
                item.onclick = () => {
                    bulkSelectedSubCats.push(cat);
                    renderBulkSubCatsPills();
                    bulkSubCatsSearch.value = '';
                    bulkSubCatsDropdown.classList.add('hidden');
                };
                bulkSubCatsResults.appendChild(item);
            });
        }

        const exactMatch = allCats.find(c => c.toLowerCase() === query.toLowerCase());
        if (query && !exactMatch) {
            btnAddBulkSubCatInline.classList.remove('hidden');
        } else {
            btnAddBulkSubCatInline.classList.add('hidden');
        }

        bulkSubCatsDropdown.classList.remove('hidden');
    }

    if (bulkSubCatsSearch) {
        bulkSubCatsSearch.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                showBulkSubCatsDropdown(query);
            } else {
                bulkSubCatsDropdown.classList.add('hidden');
                btnAddBulkSubCatInline.classList.add('hidden');
            }
        });

        bulkSubCatsSearch.addEventListener('focus', () => {
            if (bulkSubCatsSearch.value.trim().length === 0) {
                showBulkSubCatsDropdown('');
            }
        });

        document.addEventListener('click', (e) => {
            if (document.getElementById('bulkSubCatsPicker') && !document.getElementById('bulkSubCatsPicker').contains(e.target)) {
                bulkSubCatsDropdown.classList.add('hidden');
            }
        });
    }

    if (btnAddBulkSubCatInline) {
        btnAddBulkSubCatInline.addEventListener('click', () => {
            const name = bulkSubCatsSearch.value.trim();
            if (name) {
                saveSubCategory(name);
                bulkSelectedSubCats.push(name);
                renderBulkSubCatsPills();
                bulkSubCatsSearch.value = '';
                btnAddBulkSubCatInline.classList.add('hidden');
                bulkSubCatsDropdown.classList.add('hidden');
            }
        });
    }

    if (btnCancelBulkSubCats) {
        btnCancelBulkSubCats.addEventListener('click', () => {
            bulkSubCatsModal.classList.add('hidden');
        });
    }

    if (btnCloseBulkSubCatsModal) {
        btnCloseBulkSubCatsModal.addEventListener('click', () => {
            bulkSubCatsModal.classList.add('hidden');
        });
    }

    if (btnApplyBulkSubCats) {
        btnApplyBulkSubCats.addEventListener('click', () => {
            if (bulkSelectedSubCats.length === 0) {
                alert('Por favor selecciona al menos una sub-categoría.');
                return;
            }

            // Apply sub-categories to selected products
            let updatedCount = 0;
            selectedProductIds.forEach(id => {
                const product = getProductById(id);
                if (product) {
                    if (!product.subCategories) product.subCategories = [];
                    bulkSelectedSubCats.forEach(cat => {
                        if (!product.subCategories.includes(cat)) {
                            product.subCategories.push(cat);
                        }
                    });
                    saveProduct(product);
                    updatedCount++;
                }
            });

            alert(`¡Sub-categorías agregadas a ${updatedCount} productos exitosamente!`);
            bulkSubCatsModal.classList.add('hidden');
            
            // Refresh and reset
            selectedProductIds.clear();
            renderProducts();
            updateBulkToolbarVisibility();
        });
    }

    // --- Bulk Delete Products Logic ---
    if (btnBulkDelete) {
        btnBulkDelete.addEventListener('click', () => {
            if (selectedProductIds.size === 0) return;
            
            bulkDeleteCount.textContent = selectedProductIds.size;
            bulkDeleteConfirmInput.value = '';
            btnConfirmBulkDelete.disabled = true;
            bulkDeleteModal.classList.remove('hidden');
        });
    }

    // Confirm delete input validation
    if (bulkDeleteConfirmInput) {
        bulkDeleteConfirmInput.addEventListener('input', (e) => {
            const confirmText = e.target.value.trim().toUpperCase();
            btnConfirmBulkDelete.disabled = confirmText !== 'ELIMINAR';
        });
    }

    // Close modal handlers
    if (btnCloseBulkDeleteModal) {
        btnCloseBulkDeleteModal.addEventListener('click', () => {
            bulkDeleteModal.classList.add('hidden');
        });
    }

    if (btnCancelBulkDelete) {
        btnCancelBulkDelete.addEventListener('click', () => {
            bulkDeleteModal.classList.add('hidden');
        });
    }

    // Confirm delete
    if (btnConfirmBulkDelete) {
        btnConfirmBulkDelete.addEventListener('click', () => {
            const confirmText = bulkDeleteConfirmInput.value.trim().toUpperCase();
            if (confirmText !== 'ELIMINAR') {
                alert('Por favor escribe ELIMINAR para confirmar.');
                return;
            }

            const productsToDelete = Array.from(selectedProductIds);
            const allProducts = getProducts();
            const remainingProducts = allProducts.filter(p => !productsToDelete.includes(p.id));
            
            saveAllProducts(remainingProducts);
            
            alert(`¡Se han eliminado ${productsToDelete.length} productos exitosamente!`);
            bulkDeleteModal.classList.add('hidden');
            
            selectedProductIds.clear();
            renderProducts();
            updateBulkToolbarVisibility();
        });
    }

    // Close modal on outside click
    if (bulkDeleteModal) {
        bulkDeleteModal.addEventListener('click', (e) => {
            if (e.target === bulkDeleteModal) {
                bulkDeleteModal.classList.add('hidden');
            }
        });
    }

    // --- Orders Management Functions ---
    
    function renderOrders() {
        const orders = getOrders();
        
        if (!ordersTableBody) return;
        ordersTableBody.innerHTML = '';
        
        // Filter orders
        let filteredOrders = orders;
        const searchTerm = orderSearch ? orderSearch.value.toLowerCase().trim() : '';
        const statusFilter = orderStatusFilter ? orderStatusFilter.value : '';
        
        if (searchTerm) {
            filteredOrders = filteredOrders.filter(order => 
                order.customerInfo.name.toLowerCase().includes(searchTerm) ||
                order.customerInfo.phone.includes(searchTerm) ||
                order.id.includes(searchTerm)
            );
        }
        
        if (statusFilter) {
            filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }
        
        // Sort by date (newest first)
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (filteredOrders.length === 0) {
            ordersEmptyState.classList.remove('hidden');
            return;
        }
        
        ordersEmptyState.classList.add('hidden');
        
        filteredOrders.forEach(order => {
            const row = document.createElement('div');
            row.className = 'grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition cursor-pointer';
            row.innerHTML = `
                <div class="col-span-1 text-xs font-medium text-gray-500">${order.id}</div>
                <div class="col-span-2 text-xs text-gray-600">${new Date(order.createdAt).toLocaleDateString('es-AR')} ${new Date(order.createdAt).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}</div>
                <div class="col-span-2 text-sm font-medium text-gray-800">${order.customerInfo.name}</div>
                <div class="col-span-1 text-xs text-gray-600">${order.customerInfo.phone}</div>
                <div class="col-span-2 text-xs text-gray-600 truncate">${order.customerInfo.email}</div>
                <div class="col-span-1 text-sm font-bold text-gray-800">${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(order.total)}</div>
                <div class="col-span-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(order.status)}">
                        ${order.status}
                    </span>
                </div>
                <div class="col-span-2 flex gap-2">
                    <button class="btn-view-order text-primary hover:text-dark text-xs font-medium" data-id="${order.id}">
                        <i class="fas fa-eye mr-1"></i> Ver
                    </button>
                    <button class="btn-next-status text-gray-500 hover:text-primary text-xs font-medium" data-id="${order.id}">
                        <i class="fas fa-arrow-right mr-1"></i> Siguiente
                    </button>
                </div>
            `;
            
            row.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    showOrderDetails(order.id);
                }
            });
            
            ordersTableBody.appendChild(row);
        });
        
        // Bind action buttons
        document.querySelectorAll('.btn-view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showOrderDetails(btn.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.btn-next-status').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                advanceOrderStatus(btn.getAttribute('data-id'));
            });
        });
    }
    
    function getStatusClasses(status) {
        const classes = {
            'Pendiente': 'bg-yellow-100 text-yellow-800',
            'Confirmado': 'bg-blue-100 text-blue-800',
            'Enviado': 'bg-purple-100 text-purple-800',
            'Entregado': 'bg-green-100 text-green-800',
            'Cancelado': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }
    
    function advanceOrderStatus(orderId) {
        const orders = getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) return;
        
        const statusFlow = ['Pendiente', 'Confirmado', 'Enviado', 'Entregado'];
        const currentStatus = orders[orderIndex].status;
        const currentIndex = statusFlow.indexOf(currentStatus);
        
        if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
            alert('No se puede avanzar más el estado del pedido.');
            return;
        }
        
        orders[orderIndex].status = statusFlow[currentIndex + 1];
        saveOrders(orders);
        renderOrders();
    }
    
    function showOrderDetails(orderId) {
        const orders = getOrders();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) return;
        
        currentOrderId = orderId;
        
        // Populate order info
        document.getElementById('detailOrderId').textContent = order.id;
        document.getElementById('detailOrderDate').textContent = new Date(order.createdAt).toLocaleString('es-AR');
        document.getElementById('detailOrderStatus').textContent = order.status;
        document.getElementById('detailOrderStatus').className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(order.status)}`;
        
        // Populate customer info
        document.getElementById('detailCustomerName').textContent = order.customerInfo.name;
        document.getElementById('detailCustomerPhone').textContent = order.customerInfo.phone;
        document.getElementById('detailCustomerEmail').textContent = order.customerInfo.email;
        
        if (order.customerInfo.identification) {
            document.getElementById('detailCustomerCuit').textContent = order.customerInfo.identification;
            document.getElementById('detailCustomerCuitRow').classList.remove('hidden');
        } else {
            document.getElementById('detailCustomerCuitRow').classList.add('hidden');
        }
        
        // Populate delivery info
        const deliveryInfo = order.customerInfo.delivery;
        let deliveryHtml = '';
        if (deliveryInfo.method === 'pickup') {
            deliveryHtml = `<i class="fas fa-store text-gray-400 mr-2"></i> Retiro en oficina (Paraguay 754)`;
        } else {
            deliveryHtml = `
                <i class="fas fa-truck text-gray-400 mr-2"></i> Envío a domicilio<br>
                <span class="ml-6 text-gray-600">${deliveryInfo.province} - ${deliveryInfo.locality}</span>
            `;
            if (deliveryInfo.address) {
                deliveryHtml += `<br><span class="ml-6 text-gray-600">${deliveryInfo.address}</span>`;
            }
        }
        document.getElementById('detailDeliveryInfo').innerHTML = deliveryHtml;
        
        // Populate products table
        const productsTable = document.getElementById('detailProductsTable');
        productsTable.innerHTML = '';
        
        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                        <img src="${item.image || 'https://placehold.co/40x40?text=Sin+Img'}" alt="${item.title}" class="w-10 h-10 object-contain bg-white rounded border border-gray-100">
                        <div>
                            <div class="font-medium text-gray-800">${item.title}</div>
                            <div class="text-xs text-gray-500">${item.laboratory}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-3 text-center">${item.quantity}</td>
                <td class="px-4 py-3 text-right">${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.price)}</td>
                <td class="px-4 py-3 text-right font-medium">${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.price * item.quantity)}</td>
            `;
            productsTable.appendChild(row);
        });
        
        // Populate totals
        document.getElementById('detailSubtotal').textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(order.subtotal || order.total / 1.21);
        document.getElementById('detailIva').textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(order.iva || order.total * 0.21 / 1.21);
        document.getElementById('detailTotal').textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(order.total);
        
        // Update status buttons
        document.querySelectorAll('.status-change-btn').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-primary');
            if (btn.getAttribute('data-status') === order.status) {
                btn.classList.add('ring-2', 'ring-primary');
            }
            
            btn.onclick = () => {
                updateOrderStatus(orderId, btn.getAttribute('data-status'));
            };
        });
        
        orderDetailsModal.classList.remove('hidden');
    }
    
    function updateOrderStatus(orderId, newStatus) {
        const orders = getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) return;
        
        orders[orderIndex].status = newStatus;
        saveOrders(orders);
        
        // Refresh details and list
        showOrderDetails(orderId);
        renderOrders();
    }
    
    // Event Listeners for Orders
    if (orderSearch) orderSearch.addEventListener('input', renderOrders);
    if (orderStatusFilter) orderStatusFilter.addEventListener('change', renderOrders);
    
    if (btnCloseOrderDetails) {
        btnCloseOrderDetails.addEventListener('click', () => {
            orderDetailsModal.classList.add('hidden');
            currentOrderId = null;
        });
    }
    
    if (btnCloseOrderDetailsBottom) {
        btnCloseOrderDetailsBottom.addEventListener('click', () => {
            orderDetailsModal.classList.add('hidden');
            currentOrderId = null;
        });
    }
    
    // Close modal on outside click
    if (orderDetailsModal) {
        orderDetailsModal.addEventListener('click', (e) => {
            if (e.target === orderDetailsModal) {
                orderDetailsModal.classList.add('hidden');
                currentOrderId = null;
            }
        });
    }

    // Start App
    checkAuth();
    
    // Debug: Log current state
    console.log('Admin JS loaded');
    console.log('Current laboratories in localStorage:', localStorage.getItem('camponuevo_laboratories'));
    console.log('Current products in localStorage:', localStorage.getItem('camponuevo_products') ? 'present' : 'not present');
    
    } catch (error) {
        console.error('Admin JS Error:', error);
        // Even if there's an error, show the login screen
        const loginScreen = document.getElementById('loginScreen');
        const adminApp = document.getElementById('adminApp');
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (adminApp) adminApp.classList.add('hidden');
    }
});
