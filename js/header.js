(function () {
    function getCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename.includes('catalog')) return 'catalog';
        if (filename.includes('about')) return 'about';
        if (filename.includes('product')) return 'product';
        if (filename.includes('user')) return 'user';
        if (filename.includes('order')) return 'order';
        return 'index';
    }

    function initHeader() {
        const page = getCurrentPage();
        const hash = window.location.hash;
        
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            let isActive = false;
            
            if (page === 'about') {
                // Special handling for about page with hashes
                if (hash) {
                    // If there's a hash, only activate the link that matches the hash
                    isActive = link.href.includes(hash);
                } else {
                    // If no hash on about page, neither "Nosotros" nor "Contacto" is active
                    // But the main "Nosotros y Contacto" link would be active (if it existed)
                    // Since we split them, we'll leave both inactive when on about without hash
                    isActive = false;
                }
            } else {
                // Standard page matching
                isActive = link.dataset.page === page || (page === 'product' && link.dataset.page === 'catalog');
            }
            
            if (isActive) {
                link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-0.5');
                link.classList.remove('text-gray-600', 'hover:text-primary', 'transition');
            } else {
                link.classList.add('text-gray-600', 'hover:text-primary', 'transition');
                link.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-0.5');
            }
        });

        const toggler = document.getElementById('mobile-menu-button');
        const mobileNav = document.getElementById('mobile-menu');
        if (toggler && mobileNav) {
            toggler.addEventListener('click', () => {
                mobileNav.classList.toggle('hidden');
                const icon = toggler.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });
        }
        
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.site-header');
            if (header) {
                if (window.scrollY > 20) header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
                else header.style.boxShadow = '';
            }
        }, { passive: true });

        // Search Logic
        const headerSearchInput = document.getElementById('headerSearchInput');
        const searchDropdown = document.getElementById('searchDropdown');
        const searchResultItems = document.getElementById('searchResultItems');
        const btnToggleSearch = document.getElementById('btnToggleSearch');
        const btnSeeAllResults = document.getElementById('btnSeeAllResults');
        const searchContainer = document.getElementById('searchContainer');
        const headerSearchWrapper = document.getElementById('headerSearchWrapper');

        let hideTimeout;

        if (headerSearchInput && searchContainer) {
            const showSearchDropdown = () => {
                clearTimeout(hideTimeout);
                searchDropdown.classList.remove('hidden');
            };

            const hideSearchDropdown = () => {
                if (document.activeElement === headerSearchInput || headerSearchInput.value.trim() !== '') return;
                // Delay hiding for 2 seconds to allow user to move mouse to dropdown
                hideTimeout = setTimeout(() => {
                    searchDropdown.classList.add('hidden');
                }, 2000);
            };

            // Show dropdown on hover over search container
            searchContainer.addEventListener('mouseenter', showSearchDropdown);
            searchContainer.addEventListener('mouseleave', hideSearchDropdown);

            // Show dropdown on click
            btnToggleSearch.addEventListener('click', (e) => {
                e.preventDefault();
                showSearchDropdown();
                headerSearchInput.focus();
            });

            // Keep dropdown visible when input is focused
            headerSearchInput.addEventListener('focus', showSearchDropdown);
            headerSearchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (document.activeElement !== searchDropdown && !searchDropdown.contains(document.activeElement)) {
                        searchDropdown.classList.add('hidden');
                    }
                }, 200);
            });

            // Search on input
            headerSearchInput.addEventListener('input', (e) => {
                performSearch(e.target.value);
            });
            
            // Search on Enter key
            headerSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch(headerSearchInput.value, true);
                }
            });
            
            // Perform search function
            function performSearch(value, forceRedirect = false) {
                const query = value.toLowerCase().trim();
                
                console.log('Input event fired. Query:', query, 'Length:', query.length);
                
                if (query.length < 2) {
                    // Show autocomplete suggestions when less than 2 characters
                    showAutocompleteSuggestions(query);
                    return;
                }

                // Get all products
                const products = typeof getProducts === 'function' ? getProducts() : [];
                console.log('Total products found:', products.length);
                
                if (products.length === 0) {
                    console.error('No products found! getProducts returned empty array');
                    searchResultItems.innerHTML = `
                        <div class="p-4 text-center text-red-500 text-sm italic">
                            Error: No se pudieron cargar los productos
                        </div>
                    `;
                    return;
                }

                // Filter products that match the query
                const matches = products.filter(p => {
                    // Search in ALL product fields
                    const searchText = [
                        p.title || '',
                        p.laboratory || '',
                        p.description || '',
                        p.drugs || '',
                        p.subCategory || '',
                        (p.subCategories && p.subCategories.length > 0) ? p.subCategories.join(' ') : '',
                        (p.labels && p.labels.length > 0) ? p.labels.join(' ') : '',
                        (p.animalBreeds && p.animalBreeds.length > 0) ? p.animalBreeds.join(' ') : ''
                    ].join(' ').toLowerCase();
                    
                    // Check if the search text includes the query (subcadena search)
                    return searchText.includes(query);
                });

                console.log('Matches found:', matches.length);
                console.log('Matches:', matches);

                // Show matches or autocomplete suggestions
                if (matches.length > 0) {
                    renderHeaderSearchResults(matches, query);
                } else {
                    // No exact matches, show autocomplete suggestions
                    showAutocompleteSuggestions(query, products);
                }
                
                // If Enter was pressed, redirect to catalog
                if (forceRedirect) {
                    window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
                } else {
                    // Update "Ver todos los resultados" link to include search query
                    if (btnSeeAllResults) {
                        btnSeeAllResults.href = `catalog.html?search=${encodeURIComponent(query)}`;
                    }
                }
            }

            // Prevent hiding when mouse is over dropdown
            searchDropdown.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
            });
            
            searchDropdown.addEventListener('mouseleave', () => {
                hideSearchDropdown();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                // Check if click is outside the search wrapper and not on a suggestion
                if (headerSearchWrapper && 
                    !headerSearchWrapper.contains(e.target) && 
                    !e.target.closest('.suggestion-item')) {
                    searchDropdown.classList.add('hidden');
                }
            });
        }

        function renderHeaderSearchResults(matches, query) {
            if (matches.length === 0) {
                searchResultItems.innerHTML = `
                    <div class="p-4 text-center text-gray-500 text-sm italic">
                        No se encontraron productos para "${query}"
                    </div>
                `;
            } else {
                searchResultItems.innerHTML = matches.map(p => `
                    <a href="catalog.html?search=${encodeURIComponent(query)}" class="flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                        <div class="w-10 h-10 flex-shrink-0 bg-white border border-gray-100 rounded-lg overflow-hidden p-1">
                            <img src="${p.image || 'https://placehold.co/100x100?text=Sin+Img'}" alt="${p.title}" class="w-full h-full object-contain">
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-bold text-gray-800 truncate">${p.title}</h4>
                            <p class="text-[11px] text-gray-400 uppercase font-bold">${p.laboratory || 'Varios'}</p>
                        </div>
                        <div class="text-xs font-black text-primary">
                            ${p.price > 0 ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(p.price) : 'Consultar'}
                        </div>
                    </a>
                `).join('');
            }
            
            // Link to catalog with search filters
            if (btnSeeAllResults) {
                btnSeeAllResults.href = `catalog.html?search=${encodeURIComponent(query)}`;
            }
        }

        // Show autocomplete suggestions
        function showAutocompleteSuggestions(query, products = []) {
            if (products.length === 0) {
                // Get all products if not provided
                products = typeof getProducts === 'function' ? getProducts() : [];
            }

            // Extract words from product titles and laboratories
            const words = new Set();
            products.forEach(p => {
                if (p.title) {
                    p.title.split(' ').forEach(word => {
                        const cleanWord = word.toLowerCase().replace(/[^a-z0-9áéíóúñü]/g, '');
                        if (cleanWord.length >= 3) {
                            words.add(cleanWord);
                        }
                    });
                }
                if (p.laboratory) {
                    p.laboratory.split(' ').forEach(word => {
                        const cleanWord = word.toLowerCase().replace(/[^a-z0-9áéíóúñü]/g, '');
                        if (cleanWord.length >= 3) {
                            words.add(cleanWord);
                        }
                    });
                }
            });

            // Filter words that contain the query (subcadena search)
            const suggestions = Array.from(words)
                .filter(word => word.includes(query.toLowerCase()))
                .slice(0, 5);

            if (suggestions.length > 0) {
                searchResultItems.innerHTML = `
                    <div class="p-3 border-b border-gray-100 bg-gray-50">
                        <p class="text-xs text-gray-500">Sugerencias:</p>
                    </div>
                    ${suggestions.map(word => `
                        <div class="suggestion-item p-3 hover:bg-gray-50 cursor-pointer transition flex items-center gap-2" data-word="${word}">
                            <i class="fas fa-search text-gray-400 text-xs"></i>
                            <span class="text-sm text-gray-700">${query}<strong>${word.substring(query.length)}</strong></span>
                        </div>
                    `).join('')}
                `;

                // Add click listeners to suggestions
                document.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const word = item.dataset.word;
                        headerSearchInput.value = word;
                        headerSearchInput.dispatchEvent(new Event('input'));
                    });
                });
            } else if (query.length >= 2) {
                searchResultItems.innerHTML = `
                    <div class="p-4 text-center text-gray-500 text-sm italic">
                        No hay sugerencias para "${query}"
                    </div>
                `;
            } else {
                searchResultItems.innerHTML = `
                    <div class="p-4 text-center text-gray-500 text-sm italic">
                        Escribe al menos 2 caracteres para buscar
                    </div>
                `;
            }
            
            // Always link to catalog without search filters
            if (btnSeeAllResults) {
                btnSeeAllResults.href = 'catalog.html';
            }
        }

        // Fix header jumps for other components
        document.querySelectorAll('.site-header a[href="#"], .site-header button').forEach(el => {
            el.addEventListener('click', (e) => {
                const href = el.getAttribute('href');
                if ((href === '#' || !href) && el.id !== 'mobile-menu-button') {
                    e.preventDefault();
                }
            });
        });
    }

    // --- Authentication Logic ---

    function initAuth() {
        const userAuthContainer = document.getElementById('userAuthContainer');
        const userMenuContainer = document.getElementById('userMenuContainer');
        const authOverlay = document.getElementById('authOverlay');
        const authModal = document.getElementById('authModal');
        const btnCloseAuth = document.getElementById('btnCloseAuth');
        
        // Form containers
        const loginFormContainer = document.getElementById('loginFormContainer');
        const registerFormContainer = document.getElementById('registerFormContainer');
        const recoveryFormContainer = document.getElementById('recoveryFormContainer');
        
        // Forms
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const recoveryForm = document.getElementById('recoveryForm');
        
        // Buttons
        const btnGoToRegister = document.getElementById('btnGoToRegister');
        const btnGoToLogin = document.getElementById('btnGoToLogin');
        const btnForgotPassword = document.getElementById('btnForgotPassword');
        const btnBackToLogin = document.getElementById('btnBackToLogin');
        const btnFindQuestion = document.getElementById('btnFindQuestion');
        const btnVerifyAnswer = document.getElementById('btnVerifyAnswer');
        const btnLogout = document.getElementById('btnLogout');
        
        // Dropdown
        const userDropdown = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        const userDropdownContainer = document.getElementById('userDropdown');

        // Security question custom input
        const regSecurityQuestion = document.getElementById('regSecurityQuestion');
        const customQuestionContainer = document.getElementById('customQuestionContainer');
        const regCustomQuestion = document.getElementById('regCustomQuestion');

        // Recovery steps
        const recoveryStep1 = document.getElementById('recoveryStep1');
        const recoveryStep2 = document.getElementById('recoveryStep2');
        const recoveryStep3 = document.getElementById('recoveryStep3');
        const recoveryQuestionDisplay = document.getElementById('recoveryQuestionDisplay');

        let recoveryEmail = '';
        let currentRecoveryStep = 1;

        // Update UI based on user session
        async function updateAuthUI() {
            const user = await getCurrentUser();
            
            if (user && userAuthContainer) {
                // User is logged in - show dropdown button
                userAuthContainer.innerHTML = `
                    <div class="relative">
                        <button id="btnUserMenu" class="flex items-center gap-2 text-gray-600 hover:text-primary transition p-2 rounded-full hover:bg-gray-100">
                            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                                ${user.name.charAt(0).toUpperCase()}
                            </div>
                            <span class="hidden md:inline text-sm font-medium">${user.name.split(' ')[0]}</span>
                            <i class="fas fa-chevron-down text-xs"></i>
                        </button>
                    </div>
                `;
                
                // Show dropdown on click
                const btnUserMenu = document.getElementById('btnUserMenu');
                if (btnUserMenu) {
                    btnUserMenu.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isHidden = userDropdownContainer.classList.contains('hidden');
                        if (isHidden) {
                            userDropdownContainer.classList.remove('hidden');
                            userDropdownContainer.classList.add('scale-100', 'opacity-100');
                        } else {
                            userDropdownContainer.classList.add('hidden');
                            userDropdownContainer.classList.remove('scale-100', 'opacity-100');
                        }
                    });
                }
                
                // Update dropdown info
                if (userDropdown) userDropdown.textContent = user.name;
                if (dropdownUserEmail) dropdownUserEmail.textContent = user.email;
                
            } else if (userAuthContainer) {
                // User is not logged in - show only login button with improved style
                userAuthContainer.innerHTML = `
                    <button id="btnShowLogin" class="bg-gradient-to-r from-primary to-dark hover:from-dark hover:to-black text-white px-5 py-2.5 rounded-full text-sm font-bold transition shadow-md flex items-center gap-2">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Iniciar Sesión</span>
                    </button>
                `;
                
                // Add event listeners
                document.getElementById('btnShowLogin').addEventListener('click', () => openAuthModal('login'));
            }
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#btnUserMenu') && !e.target.closest('#userDropdown')) {
                    userDropdownContainer.classList.add('hidden');
                }
            });
        }

        function openAuthModal(form = 'login') {
            authOverlay.classList.remove('hidden');
            authModal.classList.remove('hidden');
            authModal.classList.add('flex');
            
            // Reset forms
            loginFormContainer.classList.add('hidden');
            registerFormContainer.classList.add('hidden');
            recoveryFormContainer.classList.add('hidden');
            
            // Show selected form
            if (form === 'login') {
                loginFormContainer.classList.remove('hidden');
            } else if (form === 'register') {
                registerFormContainer.classList.remove('hidden');
            } else if (form === 'recovery') {
                recoveryFormContainer.classList.remove('hidden');
                resetRecoveryForm();
            }
            
            // Animate in
            setTimeout(() => {
                authOverlay.classList.remove('opacity-0');
                authOverlay.classList.add('opacity-100');
                authModal.querySelector('.bg-white').style.transform = 'scale(1)';
            }, 10);
        }

        function closeAuthModal() {
            authOverlay.classList.add('opacity-0');
            authOverlay.classList.remove('opacity-100');
            setTimeout(() => {
                authOverlay.classList.add('hidden');
                authModal.classList.add('hidden');
                authModal.classList.remove('flex');
            }, 300);
            
            // Reset forms
            loginForm.reset();
            registerForm.reset();
            recoveryForm.reset();
            document.getElementById('loginError').classList.add('hidden');
            document.getElementById('registerError').classList.add('hidden');
            document.getElementById('recoveryError').classList.add('hidden');
        }

        function resetRecoveryForm() {
            currentRecoveryStep = 1;
            recoveryStep1.classList.remove('hidden');
            recoveryStep2.classList.add('hidden');
            recoveryStep3.classList.add('hidden');
            document.getElementById('recoveryEmail').value = '';
            document.getElementById('recoveryAnswer').value = '';
            document.getElementById('recoveryNewPassword').value = '';
            document.getElementById('recoveryConfirmPassword').value = '';
            recoveryQuestionDisplay.textContent = 'Cargando...';
        }

        // Event Listeners for Auth Modal
        if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);
        if (authOverlay) authOverlay.addEventListener('click', closeAuthModal);
        
        if (btnGoToRegister) btnGoToRegister.addEventListener('click', () => openAuthModal('register'));
        if (btnGoToLogin) btnGoToLogin.addEventListener('click', () => openAuthModal('login'));
        if (btnForgotPassword) btnForgotPassword.addEventListener('click', () => openAuthModal('recovery'));
        if (btnBackToLogin) btnBackToLogin.addEventListener('click', () => openAuthModal('login'));

        // Security question custom input toggle
        if (regSecurityQuestion) {
            regSecurityQuestion.addEventListener('change', () => {
                if (regSecurityQuestion.value === '__custom__') {
                    customQuestionContainer.classList.remove('hidden');
                    regCustomQuestion.required = true;
                } else {
                    customQuestionContainer.classList.add('hidden');
                    regCustomQuestion.required = false;
                }
            });
        }

        // Handle Login Form
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const rememberMe = document.getElementById('rememberMe').checked;
                
                const result = await loginUser(email, password, rememberMe);
                
                if (result.success) {
                    closeAuthModal();
                    await updateAuthUI();
                    // Update cart count if needed
                    if (typeof updateHeaderCartCount === 'function') {
                        updateHeaderCartCount();
                    }
                } else {
                    document.getElementById('loginError').classList.remove('hidden');
                    document.getElementById('loginErrorMessage').textContent = result.message;
                }
            });
        }

        // Handle Register Form
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const name = document.getElementById('regName').value;
                const email = document.getElementById('regEmail').value;
                const password = document.getElementById('regPassword').value;
                const confirmPassword = document.getElementById('regConfirmPassword').value;
                
                // Validations
                if (password.length < 6) {
                    document.getElementById('registerError').classList.remove('hidden');
                    document.getElementById('registerErrorMessage').textContent = 'La contraseña debe tener al menos 6 caracteres.';
                    return;
                }
                
                if (password !== confirmPassword) {
                    document.getElementById('registerError').classList.remove('hidden');
                    document.getElementById('registerErrorMessage').textContent = 'Las contraseñas no coinciden.';
                    return;
                }
                
                const result = await registerUser({
                    name,
                    email,
                    password
                });
                
                if (result.success) {
                    closeAuthModal();
                    await updateAuthUI();
                    // Show success message
                    alert('¡Cuenta creada exitosamente! Completa tu perfil para acceder a todas las funcionalidades.');
                } else {
                    document.getElementById('registerError').classList.remove('hidden');
                    document.getElementById('registerErrorMessage').textContent = result.message;
                }
            });
        }

        // Handle Recovery - Find Question
        if (btnFindQuestion) {
            btnFindQuestion.addEventListener('click', () => {
                const email = document.getElementById('recoveryEmail').value;
                if (!email) {
                    document.getElementById('recoveryError').classList.remove('hidden');
                    document.getElementById('recoveryErrorMessage').textContent = 'Por favor ingresa tu email.';
                    return;
                }
                
                const result = getSecurityQuestion(email);
                if (result.success) {
                    recoveryEmail = email;
                    recoveryQuestionDisplay.textContent = result.question;
                    recoveryStep1.classList.add('hidden');
                    recoveryStep2.classList.remove('hidden');
                    currentRecoveryStep = 2;
                } else {
                    document.getElementById('recoveryError').classList.remove('hidden');
                    document.getElementById('recoveryErrorMessage').textContent = result.message;
                }
            });
        }

        // Handle Recovery - Verify Answer
        if (btnVerifyAnswer) {
            btnVerifyAnswer.addEventListener('click', async () => {
                const answer = document.getElementById('recoveryAnswer').value;
                
                const result = await validateSecurityAnswer(recoveryEmail, answer);
                if (result.success) {
                    recoveryStep2.classList.add('hidden');
                    recoveryStep3.classList.remove('hidden');
                    currentRecoveryStep = 3;
                } else {
                    document.getElementById('recoveryError').classList.remove('hidden');
                    document.getElementById('recoveryErrorMessage').textContent = result.message;
                }
            });
        }

        // Handle Recovery - Reset Password
        if (recoveryForm) {
            recoveryForm.addEventListener('submit', async (e) => {
                if (currentRecoveryStep !== 3) return;
                e.preventDefault();
                
                const newPassword = document.getElementById('recoveryNewPassword').value;
                const confirmPassword = document.getElementById('recoveryConfirmPassword').value;
                
                if (newPassword.length < 6) {
                    document.getElementById('recoveryError').classList.remove('hidden');
                    document.getElementById('recoveryErrorMessage').textContent = 'La contraseña debe tener al menos 6 caracteres.';
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    document.getElementById('recoveryError').classList.remove('hidden');
                    document.getElementById('recoveryErrorMessage').textContent = 'Las contraseñas no coinciden.';
                    return;
                }
                
                const result = await resetPasswordWithSecurity(recoveryEmail, newPassword);
                if (result.success) {
                    closeAuthModal();
                    alert('¡Contraseña restablecida exitosamente! Ahora puedes iniciar sesión.');
                } else {
                    document.getElementById('recoveryError').classList.remove('hidden');
                    document.getElementById('recoveryErrorMessage').textContent = result.message;
                }
            });
        }

        // Handle Logout
        if (btnLogout) {
            btnLogout.addEventListener('click', async () => {
                logoutUser();
                await updateAuthUI();
                userDropdownContainer.classList.add('hidden');
                // Update cart count
                if (typeof updateHeaderCartCount === 'function') {
                    updateHeaderCartCount();
                }
                // Redirect to home if on user page
                if (window.location.pathname.includes('user.html')) {
                    window.location.href = 'index.html';
                }
            });
        }

        // Initialize UI
        (async () => await updateAuthUI())();
    }

    // --- End Authentication Logic ---

    const placeholder = document.getElementById('site-header-placeholder');
    if (!placeholder) return;

    if (window.SHARED_HEADER_HTML) {
        placeholder.outerHTML = window.SHARED_HEADER_HTML;
        initHeader();
        initAuth();
        
        // Add event listeners for hash changes with custom offsets
        document.querySelectorAll('.nav-link[href*="about.html#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const hash = link.getAttribute('href').split('#')[1];
                if (hash && window.location.pathname.includes('about')) {
                    e.preventDefault();
                    
                    let scrollTarget;
                    let offset = 0;
                    
                    if (hash === 'nosotros') {
                        // Scroll to top of page for "Nosotros"
                        scrollTarget = 0;
                    } else if (hash === 'contacto') {
                        // Scroll to #contacto with -120px offset
                        const element = document.getElementById(hash);
                        if (element) {
                            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                            scrollTarget = elementPosition - 120;
                        }
                    }
                    
                    if (scrollTarget !== undefined) {
                        window.scrollTo({
                            top: scrollTarget,
                            behavior: 'smooth'
                        });
                        
                        // Update URL hash without scrolling
                        history.pushState(null, null, `#${hash}`);
                        
                        // Update active link state
                        document.querySelectorAll('.nav-link').forEach(l => {
                            l.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-0.5');
                            l.classList.add('text-gray-600', 'hover:text-primary', 'transition');
                        });
                        link.classList.remove('text-gray-600', 'hover:text-primary', 'transition');
                        link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-0.5');
                    }
                }
            });
        });

        // Handle hash changes (e.g., browser back/forward)
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && window.location.pathname.includes('about')) {
                const element = document.getElementById(hash);
                if (element) {
                    setTimeout(() => {
                        const offset = hash === 'contacto' ? -40 : 0;
                        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: elementPosition + offset,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        });
        
        // Dynamically load cart.js if not already present
        if (!document.querySelector('script[src="js/cart.js"]')) {
            const cartScript = document.createElement('script');
            cartScript.src = 'js/cart.js';
            cartScript.onload = function() {
                document.dispatchEvent(new CustomEvent('headerLoaded'));
            };
            document.body.appendChild(cartScript);
        } else {
            document.dispatchEvent(new CustomEvent('headerLoaded'));
        }
    } else {
        console.error('SHARED_HEADER_HTML not found. Make sure components/header_content.js is loaded.');
        console.log('Available window keys:', Object.keys(window).filter(k => k.includes('HEADER')));
        if (placeholder) {
            placeholder.innerHTML = '<div style="background:#fff3cd; color:#856404; padding:15px; text-align:center; border:1px solid #ffeeba;">Verificando carga del menú...</div>';
        }
    }
})();
