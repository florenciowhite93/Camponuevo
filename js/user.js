// js/user.js - User Profile and Order History Logic

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
        // Redirect to login or show message
        alert('Por favor inicia sesión para acceder a tu cuenta.');
        window.location.href = 'index.html';
        return;
    }

    // Elements
    const tabProfile = document.getElementById('tabProfile');
    const tabOrders = document.getElementById('tabOrders');
    const tabSecurity = document.getElementById('tabSecurity');
    
    const viewProfile = document.getElementById('viewProfile');
    const viewOrders = document.getElementById('viewOrders');
    const viewSecurity = document.getElementById('viewSecurity');
    
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const btnLogoutSidebar = document.getElementById('btnLogoutSidebar');

    // Tab Navigation
    function switchTab(tab) {
        // Update tab buttons
        [tabProfile, tabOrders, tabSecurity].forEach(btn => {
            btn.classList.remove('tab-active');
            btn.classList.add('text-gray-600', 'hover:bg-gray-50');
        });
        
        // Update views
        viewProfile.classList.add('hidden');
        viewOrders.classList.add('hidden');
        viewSecurity.classList.add('hidden');
        
        if (tab === 'profile') {
            tabProfile.classList.add('tab-active');
            tabProfile.classList.remove('text-gray-600', 'hover:bg-gray-50');
            viewProfile.classList.remove('hidden');
        } else if (tab === 'orders') {
            tabOrders.classList.add('tab-active');
            tabOrders.classList.remove('text-gray-600', 'hover:bg-gray-50');
            viewOrders.classList.remove('hidden');
        } else if (tab === 'security') {
            tabSecurity.classList.add('tab-active');
            tabSecurity.classList.remove('text-gray-600', 'hover:bg-gray-50');
            viewSecurity.classList.remove('hidden');
        }
    }

    // Tab click events
    tabProfile.addEventListener('click', () => switchTab('profile'));
    tabOrders.addEventListener('click', () => switchTab('orders'));
    tabSecurity.addEventListener('click', () => switchTab('security'));

    // Check URL parameter for default tab
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'orders') {
        switchTab('orders');
    }

    // Initialize Profile Form
    function initProfileForm() {
        document.getElementById('profileName').value = currentUser.name || '';
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileLocation').value = currentUser.location || '';
        document.getElementById('profileIdentification').value = currentUser.identification || '';
        
        // Initialize security question
        if (currentUser.securityQuestion) {
            const securityQuestionSelect = document.getElementById('profileSecurityQuestion');
            const customQuestionContainer = document.getElementById('customQuestionContainerProfile');
            const customQuestionInput = document.getElementById('profileCustomQuestion');
            
            // Check if it's a predefined question or custom
            const predefinedQuestions = [
                "¿Nombre de tu primera mascota?",
                "¿Ciudad donde naciste?",
                "¿Nombre de tu mejor amigo de la infancia?",
                "¿Marca de tu primer auto?",
                "¿Comida favorita de tu infancia?"
            ];
            
            if (predefinedQuestions.includes(currentUser.securityQuestion)) {
                securityQuestionSelect.value = currentUser.securityQuestion;
                customQuestionContainer.classList.add('hidden');
                customQuestionInput.required = false;
            } else {
                securityQuestionSelect.value = '__custom__';
                customQuestionContainer.classList.remove('hidden');
                customQuestionInput.value = currentUser.securityQuestion;
                customQuestionInput.required = true;
            }
        }
    }

    // Profile Form Submit
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('profileName').value.trim();
        const phone = document.getElementById('profilePhone').value.trim();
        const location = document.getElementById('profileLocation').value.trim();
        const identification = document.getElementById('profileIdentification').value.trim();
        
        const result = await updateUserProfile(currentUser.id, { name, phone, location, identification });
        
        if (result.success) {
            document.getElementById('profileSuccess').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('profileSuccess').classList.add('hidden');
            }, 3000);
            
            // Update current user reference
            currentUser.name = name;
            currentUser.phone = phone;
            currentUser.location = location;
            currentUser.identification = identification;
            
            // Update header UI if available
            const dropdownUserName = document.getElementById('dropdownUserName');
            if (dropdownUserName) dropdownUserName.textContent = name;
        }
    });
    
    // Security Question Form
    const securityQuestionForm = document.getElementById('securityQuestionForm');
    const profileSecurityQuestion = document.getElementById('profileSecurityQuestion');
    const customQuestionContainerProfile = document.getElementById('customQuestionContainerProfile');
    const profileCustomQuestion = document.getElementById('profileCustomQuestion');
    
    profileSecurityQuestion.addEventListener('change', () => {
        if (profileSecurityQuestion.value === '__custom__') {
            customQuestionContainerProfile.classList.remove('hidden');
            profileCustomQuestion.required = true;
        } else {
            customQuestionContainerProfile.classList.add('hidden');
            profileCustomQuestion.required = false;
        }
    });
    
    securityQuestionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const securityQuestionSelect = profileSecurityQuestion.value;
        const customQuestion = profileCustomQuestion.value.trim();
        const securityAnswer = document.getElementById('profileSecurityAnswer').value.trim();
        
        if (securityQuestionSelect === '') {
            alert('Por favor selecciona una pregunta de seguridad.');
            return;
        }
        
        if (securityQuestionSelect === '__custom__' && customQuestion.length < 3) {
            alert('La pregunta personalizada debe tener al menos 3 caracteres.');
            return;
        }
        
        if (securityAnswer.length < 3) {
            alert('La respuesta debe tener al menos 3 caracteres.');
            return;
        }
        
        const finalQuestion = securityQuestionSelect === '__custom__' ? customQuestion : securityQuestionSelect;
        
        const result = await updateUserProfile(currentUser.id, {
            securityQuestion: finalQuestion,
            securityAnswer: securityAnswer
        });
        
        if (result.success) {
            document.getElementById('securitySuccess').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('securitySuccess').classList.add('hidden');
            }, 3000);
            
            // Clear answer field
            document.getElementById('profileSecurityAnswer').value = '';
            
            // Update current user reference
            currentUser.securityQuestion = finalQuestion;
        }
    });

    // Password Form Submit
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        // Reset messages
        document.getElementById('passwordSuccess').classList.add('hidden');
        document.getElementById('passwordError').classList.add('hidden');
        
        // Validations
        if (newPassword.length < 6) {
            document.getElementById('passwordError').classList.remove('hidden');
            document.getElementById('passwordErrorMessage').textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            document.getElementById('passwordError').classList.remove('hidden');
            document.getElementById('passwordErrorMessage').textContent = 'Las contraseñas no coinciden.';
            return;
        }
        
        const result = await changePassword(currentUser.id, currentPassword, newPassword);
        
        if (result.success) {
            document.getElementById('passwordSuccess').classList.remove('hidden');
            passwordForm.reset();
            setTimeout(() => {
                document.getElementById('passwordSuccess').classList.add('hidden');
            }, 3000);
        } else {
            document.getElementById('passwordError').classList.remove('hidden');
            document.getElementById('passwordErrorMessage').textContent = result.message;
        }
    });

    // Load Orders
    function loadOrders() {
        const orders = getOrdersByUser(currentUser.id);
        const container = document.getElementById('ordersContainer');
        const noOrders = document.getElementById('noOrders');
        
        if (orders.length === 0) {
            noOrders.classList.remove('hidden');
            return;
        }
        
        noOrders.classList.add('hidden');
        
        // Clear existing orders (except noOrders message)
        const orderElements = container.querySelectorAll('.order-item');
        orderElements.forEach(el => el.remove());
        
        orders.forEach(order => {
            const orderEl = document.createElement('div');
            orderEl.className = 'order-item bg-gray-50 rounded-xl p-6 border border-gray-100 transition cursor-pointer';
            
            const date = new Date(order.createdAt).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const statusColors = {
                'Pendiente': 'bg-yellow-100 text-yellow-800',
                'Confirmado': 'bg-blue-100 text-blue-800',
                'Enviado': 'bg-purple-100 text-purple-800',
                'Entregado': 'bg-green-100 text-green-800'
            };
            
            const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';
            
            // Get product names
            const productNames = order.items.map(item => item.title).join(', ');
            
            orderEl.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500">Pedido #${order.id}</p>
                        <p class="text-lg font-bold text-gray-800">${date}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold ${statusColor}">
                        ${order.status}
                    </span>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                    <p class="text-sm text-gray-600 mb-2">
                        <i class="fas fa-box mr-2 text-primary"></i>
                        ${order.items.length} producto(s)
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                        ${productNames}
                    </p>
                </div>
                
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span class="text-sm text-gray-500">Total:</span>
                    <span class="text-lg font-bold text-gray-900">
                        ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(order.total)}
                    </span>
                </div>
            `;
            
            container.appendChild(orderEl);
        });
    }

    // Logout
    function handleLogout() {
        logoutUser();
        window.location.href = 'index.html';
    }

    if (btnLogoutSidebar) {
        btnLogoutSidebar.addEventListener('click', handleLogout);
    }

    // Initialize
    initProfileForm();
    loadOrders();
});
