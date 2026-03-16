// js/cart.js

(function() {
    // Wait for header to be loaded via CustomEvent from header.js
    document.addEventListener('headerLoaded', initCartUI);

    // Also try to init immediately if header is already there
    if (document.getElementById('btnOpenCart')) {
        initCartUI();
    }

    function initCartUI() {
        const btnOpenCart = document.getElementById('btnOpenCart');
        const btnCloseCart = document.getElementById('btnCloseCart');
        const cartDrawer = document.getElementById('cartDrawer');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartItemsList = document.getElementById('cartItemsList');
        const cartCount = document.getElementById('cartCount');
        const cartFooter = document.getElementById('cartFooter');
        const cartTotal = document.getElementById('cartTotal');

        if (!btnOpenCart || !btnCloseCart || !cartDrawer) return;

        // Toggle Drawer
        function toggleCart(show) {
            if (show) {
                cartOverlay.classList.remove('hidden');
                setTimeout(() => {
                    cartOverlay.classList.remove('opacity-0');
                    cartOverlay.classList.add('opacity-100');
                    cartOverlay.classList.remove('pointer-events-none');
                    cartDrawer.classList.remove('translate-x-full');
                }, 10);
                renderCartDrawer();
            } else {
                cartOverlay.classList.add('opacity-0');
                cartOverlay.classList.remove('opacity-100');
                cartOverlay.classList.add('pointer-events-none');
                cartDrawer.classList.add('translate-x-full');
                setTimeout(() => {
                    cartOverlay.classList.add('hidden');
                }, 300);
            }
        }

        btnOpenCart.addEventListener('click', () => toggleCart(true));
        btnCloseCart.addEventListener('click', () => toggleCart(false));
        cartOverlay.addEventListener('click', () => toggleCart(false));

        // Render Items in Drawer
        function renderCartDrawer() {
            const cart = getCart();
            
            // Update Header Count
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems > 0) {
                cartCount.textContent = totalItems;
                cartCount.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
            }

            // Populate List
            if (cart.length === 0) {
                cartItemsList.innerHTML = `
                    <div id="emptyCartMessage" class="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4 py-20">
                        <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                            <i class="fas fa-shopping-cart text-3xl opacity-20"></i>
                        </div>
                        <p>Tu carrito está vacío.</p>
                        <a href="catalog.html" class="text-primary font-bold hover:underline">Ver productos</a>
                    </div>
                `;
                cartFooter.classList.add('hidden');
            } else {
                cartItemsList.innerHTML = '';
                let total = 0;

                cart.forEach(item => {
                    total += item.price * item.quantity;
                    const itemEl = document.createElement('div');
                    itemEl.className = 'flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm';
                    itemEl.innerHTML = `
                        <div class="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                            <img src="${item.image || 'https://placehold.co/100x100?text=Sin+Img'}" alt="${item.title}" class="w-full h-full object-contain p-1">
                        </div>
                        <div class="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 class="text-sm font-bold text-gray-800 line-clamp-1">${item.title}</h4>
                                <p class="text-[11px] text-gray-400">${item.laboratory}</p>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                                    <button class="px-2 hover:bg-gray-100 text-gray-500 transition btn-qty" data-id="${item.id}" data-action="decrease">
                                        <i class="fas fa-minus text-[10px]"></i>
                                    </button>
                                    <span class="w-8 text-center text-sm font-bold text-gray-700">${item.quantity}</span>
                                    <button class="px-2 hover:bg-gray-100 text-gray-500 transition btn-qty" data-id="${item.id}" data-action="increase">
                                        <i class="fas fa-plus text-[10px]"></i>
                                    </button>
                                </div>
                                <span class="font-bold text-gray-900 text-sm">${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.price * item.quantity)}</span>
                            </div>
                        </div>
                        <button class="text-gray-300 hover:text-red-500 transition flex-shrink-0 btn-remove" data-id="${item.id}">
                            <i class="fas fa-trash-alt text-sm"></i>
                        </button>
                    `;
                    cartItemsList.appendChild(itemEl);
                });

                // Calculate IVA (21%)
                const subtotal = total;
                const iva = subtotal * 0.21;
                const totalWithIva = subtotal + iva;
                
                // Update cart total display with IVA
                cartTotal.innerHTML = `
                    <div class="text-right">
                        <div class="text-sm text-gray-500">Subtotal: ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(subtotal)}</div>
                        <div class="text-sm text-gray-500">IVA (21%): ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(iva)}</div>
                        <div class="text-lg font-bold text-gray-900 mt-1">Total: ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalWithIva)}</div>
                    </div>
                `;
                cartFooter.classList.remove('hidden');

                // Bind quantity and remove buttons
                document.querySelectorAll('.btn-qty').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = btn.getAttribute('data-id');
                        const action = btn.getAttribute('data-action');
                        const cart = getCart();
                        const item = cart.find(i => i.id === id);
                        if (item) {
                            const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                            updateCartQuantity(id, newQty);
                            renderCartDrawer();
                        }
                    });
                });

                document.querySelectorAll('.btn-remove').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        removeFromCart(id);
                        renderCartDrawer();
                    });
                });
            }
        }

        // Expose function to update count globally
        window.updateHeaderCartCount = function() {
            const cart = getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems > 0) {
                cartCount.textContent = totalItems;
                cartCount.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
            }
        };

        // Initial count update
        updateHeaderCartCount();
    }
})();
