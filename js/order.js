// js/order.js

document.addEventListener('DOMContentLoaded', () => {
    const orderItemsContainer = document.getElementById('orderItemsContainer');
    const orderTotal = document.getElementById('orderTotal');
    const orderCount = document.getElementById('orderCount');
    const orderForm = document.getElementById('orderForm');
    
    // Modal elements
    const cuitInfoBtn = document.getElementById('cuitInfoBtn');
    const infoModal = document.getElementById('infoModal');
    const closeInfoModal = document.getElementById('closeInfoModal');

    // Get current user (if logged in)
    let currentUser = null;
    (async () => {
        currentUser = await getCurrentUser();
    })();

    function renderOrderItems() {
        const cart = getCart();
        orderItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = `
                <div class="text-center py-20">
                    <p class="text-gray-400 mb-6">No hay productos en tu pedido.</p>
                    <a href="catalog.html" class="bg-primary text-white px-8 py-3 rounded-xl font-bold">Ir al Catálogo</a>
                </div>
            `;
            orderCount.textContent = '0 ítems';
            orderTotal.textContent = '$0,00';
            return;
        }

        orderCount.textContent = `${cart.reduce((sum, item) => sum + item.quantity, 0)} ítems`;
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemEl = document.createElement('div');
            itemEl.className = 'flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100';
            itemEl.innerHTML = `
                <div class="w-24 h-24 bg-white rounded-xl overflow-hidden border border-gray-100 p-2 flex-shrink-0">
                    <img src="${item.image || 'https://placehold.co/150x150?text=Sin+Img'}" alt="${item.title}" class="w-full h-full object-contain">
                </div>
                <div class="flex-1 text-center sm:text-left">
                    <h4 class="text-lg font-bold text-gray-800 mb-1 italic">${item.title}</h4>
                    <p class="text-sm text-gray-400 mb-2">${item.laboratory}</p>
                    <div class="flex items-center justify-center sm:justify-start gap-4">
                        <span class="text-sm text-gray-500 font-medium">${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.price)} x ${item.quantity}</span>
                    </div>
                </div>
                <div class="text-center sm:text-right flex flex-col items-center sm:items-end gap-3">
                    <span class="text-xl font-black text-gray-900">${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.price * item.quantity)}</span>
                    <button class="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-wider btn-remove-order" data-id="${item.id}">
                        <i class="fas fa-trash-alt mr-1"></i> Quitar
                    </button>
                </div>
            `;
            orderItemsContainer.appendChild(itemEl);
        });

        // Calculate IVA (21%)
        const iva = subtotal * 0.21;
        const totalWithIva = subtotal + iva;
        
        // Update display
        document.getElementById('orderSubtotal').textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(subtotal);
        document.getElementById('orderIva').textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(iva);
        orderTotal.textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalWithIva);

        // Bind remove buttons
        document.querySelectorAll('.btn-remove-order').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                removeFromCart(id);
                renderOrderItems();
                if (typeof updateHeaderCartCount === 'function') updateHeaderCartCount();
            });
        });
    }

    // Pre-fill form if user is logged in
    async function prefillForm() {
        // Wait for currentUser to be loaded
        await new Promise(resolve => {
            const checkUser = setInterval(() => {
                if (currentUser !== null) {
                    clearInterval(checkUser);
                    resolve();
                }
            }, 10);
        });
        
        if (currentUser) {
            document.getElementById('custName').value = currentUser.name || '';
            document.getElementById('custPhone').value = currentUser.phone || '';
            document.getElementById('custEmail').value = currentUser.email || '';
            document.getElementById('custIdentification').value = currentUser.identification || '';
        }
    }

    // Modal logic
    cuitInfoBtn.addEventListener('click', () => {
        infoModal.classList.remove('hidden');
        infoModal.classList.add('flex');
    });

    closeInfoModal.addEventListener('click', () => {
        infoModal.classList.add('hidden');
        infoModal.classList.remove('flex');
    });

    // Delivery method toggle
    document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const shippingDetails = document.getElementById('shippingDetails');
            if (e.target.value === 'shipping') {
                shippingDetails.classList.remove('hidden');
            } else {
                shippingDetails.classList.add('hidden');
            }
        });
    });

    // Form submission
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cart = getCart();
        if (cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
        
        const deliveryInfo = {
            method: deliveryMethod,
            province: deliveryMethod === 'shipping' ? document.getElementById('shippingProvince').value : '',
            locality: deliveryMethod === 'shipping' ? document.getElementById('shippingLocality').value : '',
            address: deliveryMethod === 'shipping' ? document.getElementById('shippingAddress').value : ''
        };
        
        // Validate shipping fields if shipping is selected
        if (deliveryMethod === 'shipping') {
            if (!deliveryInfo.province || !deliveryInfo.locality) {
                alert('Por favor completa los campos de provincia y localidad para el envío.');
                return;
            }
        }

        const customerInfo = {
            name: document.getElementById('custName').value,
            phone: document.getElementById('custPhone').value,
            email: document.getElementById('custEmail').value,
            identification: document.getElementById('custIdentification').value,
            delivery: deliveryInfo
        };

        // Generate order ID (CN-0001, CN-0002, etc.)
        const nextNumber = getNextOrderNumber();
        const orderId = 'CN-' + nextNumber.toString().padStart(4, '0');
        
        // Calculate totals with IVA
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const iva = subtotal * 0.21;
        const totalWithIva = subtotal + iva;
        
        const orderData = {
            id: orderId,
            items: cart,
            subtotal: subtotal,
            iva: iva,
            total: totalWithIva,
            customerInfo: customerInfo
        };

        // Save order to localStorage if user is logged in
        if (currentUser) {
            saveOrder(orderData);
            
            // Update user profile with the contact info used in this order
            updateUserProfile(currentUser.id, {
                name: customerInfo.name,
                phone: customerInfo.phone,
                identification: customerInfo.identification
            }).then(result => {
                if (result.success) {
                    console.log('User profile updated with order contact info');
                }
            });
        }

        const orderDate = new Date().toLocaleString('es-AR');
        
        // Format WhatsApp message
        let message = `*Nuevo Pedido - Camponuevo*\n\n`;
        message += `*Número de Pedido:* ${orderData.id}\n`;
        message += `*Fecha:* ${orderDate}\n`;
        message += `*Cliente:* ${customerInfo.name}\n`;
        message += `*Tel:* ${customerInfo.phone}\n`;
        message += `*Email:* ${customerInfo.email}\n`;
        if (customerInfo.identification) message += `*CUIT/DNI:* ${customerInfo.identification}\n`;
        
        // Add delivery info
        message += `\n*Método de Entrega:*\n`;
        if (customerInfo.delivery.method === 'pickup') {
            message += `Retiro en oficina (Paraguay 754)\n`;
        } else {
            message += `Envío a domicilio\n`;
            message += `*Provincia:* ${customerInfo.delivery.province}\n`;
            message += `*Localidad:* ${customerInfo.delivery.locality}\n`;
            if (customerInfo.delivery.address) message += `*Dirección:* ${customerInfo.delivery.address}\n`;
        }
        
        message += `\n*Detalle del Pedido:*\n`;
        
        orderData.items.forEach(item => {
            message += `- ${item.quantity}x ${item.title} (${item.laboratory})\n`;
        });
        
        message += `\n*Subtotal:* ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(orderData.subtotal)}`;
        message += `\n*IVA (21%):* ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(orderData.iva)}`;
        message += `\n*Total:* ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(orderData.total)}`;
        message += `\n\n_Aguardo su confirmación para coordinar el pago y envío._`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5491144096789?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Clear cart after sending order
        setTimeout(() => {
            clearCart();
            renderOrderItems();
            if (typeof updateHeaderCartCount === 'function') updateHeaderCartCount();
        }, 1000);
    });

    // Initialize
    renderOrderItems();
    (async () => await prefillForm())();
});
