// components/header_content.js
// Contenido del header compartido como variable de JS para máxima compatibilidad (incluso sin servidor local)

window.SHARED_HEADER_HTML = `
<header class="site-header glass-header sticky top-0 z-50 transition-all duration-300">
    <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4 w-full">
            <!-- Logo -->
            <div class="flex-shrink-0">
                <a href="index.html" class="flex items-center group flex-shrink-0">
                    <div class="flex items-center">
                        <!-- Asset 7 with rotation -->
                        <div class="w-10 h-10 rotate-logo flex items-center justify-center mr-2">
                            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.99 82.99" class="w-full h-full">
                                <path fill="#0a92cf" d="M82.99,41.49c0,3.01-.32,5.95-.93,8.77-8.39-13.6-23.44-22.69-40.56-22.69S9.32,36.66.93,50.27c-.61-2.83-.93-5.76-.93-8.78C0,18.58,18.58,0,41.5,0s41.49,18.58,41.49,41.49Z"/>
                                <path fill="#03a84d" d="M80.49,55.64c-5.77,15.96-21.05,27.35-38.99,27.35S8.28,71.59,2.49,55.65c7.18-14.27,21.97-24.08,39.01-24.08s31.81,9.81,38.99,24.07Z"/>
                            </svg>
                        </div>
                        <!-- Stylized Text -->
                        <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#03a84d] to-[#038C41]">CAMPONUEVO</span>
                    </div>
                </a>
            </div>
            <!-- Desktop Navigation -->
            <nav class="flex-1 flex justify-center hidden md:flex items-center space-x-8 font-medium">
                <a href="index.html" class="nav-link" data-page="index">Inicio</a>
                <a href="catalog.html" class="nav-link" data-page="catalog">Catálogo</a>
                <a href="about.html#nosotros" class="nav-link" data-page="about">Nosotros</a>
                <a href="about.html#contacto" class="nav-link" data-page="about">Contacto</a>
            </nav>
            <!-- Right Actions -->
            <div class="flex items-center gap-3 flex-shrink-0">
                <!-- Header Search -->
                <div id="headerSearchWrapper" class="relative flex items-center">
                    <!-- Search Button (Icon) -->
                    <div id="searchContainer" class="relative flex items-center justify-center">
                        <button id="btnToggleSearch" class="w-10 h-10 flex-shrink-0 text-gray-600 hover:text-primary transition flex items-center justify-center rounded-full hover:bg-gray-100">
                            <i class="fas fa-search"></i>
                        </button>
                        
                        <!-- Search Dropdown (appears below on hover) -->
                        <div id="searchDropdown" class="hidden absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100]">
                            <!-- Search Input -->
                            <div class="p-3 border-b border-gray-100">
                                <input type="text" id="headerSearchInput" placeholder="Buscar productos..." class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                            </div>
                            
                            <!-- Search Results -->
                            <div id="searchResultItems" class="max-h-64 overflow-y-auto">
                                <!-- Populated by JS -->
                            </div>
                            
                            <!-- Footer -->
                            <div class="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                <a href="catalog.html" id="btnSeeAllResults" class="text-xs font-bold text-primary hover:underline">Ver todos los resultados</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Menu / Auth Buttons Container (with relative positioning) -->
                <div id="userMenuContainer" class="relative flex items-center gap-2">
                    <div id="userAuthContainer" class="flex items-center gap-2">
                        <!-- Will be populated by JS -->
                    </div>
                    
                    <!-- User Dropdown Menu (Hidden by default) -->
                    <div id="userDropdown" class="hidden absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[1000] origin-top-right transform transition-all duration-200">
                        <div class="px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                            <p class="text-sm font-medium text-gray-800 truncate" id="dropdownUserName">Usuario</p>
                            <p class="text-xs text-gray-500 truncate" id="dropdownUserEmail">email@example.com</p>
                        </div>
                        <a href="user.html" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition">
                            <i class="fas fa-user-circle w-6 text-primary"></i>
                            <span class="ml-2">Mi Cuenta</span>
                        </a>
                        <a href="user.html?tab=orders" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition">
                            <i class="fas fa-box w-6 text-primary"></i>
                            <span class="ml-2">Historial de Pedidos</span>
                        </a>
                        <div class="border-t border-gray-100 my-1"></div>
                        <button id="btnLogout" class="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition rounded-b-xl">
                            <i class="fas fa-sign-out-alt w-6"></i>
                            <span class="ml-2">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>

                <button id="btnOpenCart" class="text-gray-600 hover:text-primary transition p-2 rounded-full hover:bg-gray-100 relative group/cart">
                    <i class="fas fa-shopping-cart text-lg"></i>
                    <span id="cartCount" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold hidden">0</span>
                </button>
                <button id="mobile-menu-button" class="md:hidden text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>
        </div>
        <nav id="mobile-menu" class="hidden md:hidden mt-3 pb-2 border-t border-gray-100 pt-3 flex flex-col gap-2">
            <a href="index.html" class="nav-link px-2 py-2 rounded-lg hover:bg-gray-50" data-page="index">Inicio</a>
            <a href="catalog.html" class="nav-link px-2 py-2 rounded-lg hover:bg-gray-50" data-page="catalog">Catálogo</a>
            <a href="about.html#nosotros" class="nav-link px-2 py-2 rounded-lg hover:bg-gray-50" data-page="about">Nosotros</a>
            <a href="about.html#contacto" class="nav-link px-2 py-2 rounded-lg hover:bg-gray-50" data-page="about">Contacto</a>
        </nav>
    </div>
</header>

<!-- Global WhatsApp Floating Button -->
<a href="https://wa.me/5491112345678" target="_blank" class="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-green-500/40 hover:scale-110 hover:bg-green-600 transition-all z-50 group">
    <i class="fab fa-whatsapp"></i>
    <span class="absolute right-16 bg-white text-gray-800 text-sm px-3 py-1 rounded-lg border border-gray-100 shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">Chat con Asesor</span>
</a>

<!-- Shopping Cart Drawer Overlay -->
<div id="cartOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-[60] hidden transition-opacity duration-300 opacity-0 pointer-events-none"></div>

<!-- Shopping Cart Drawer -->
<div id="cartDrawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col pointer-events-auto">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
        <div class="flex items-center gap-2">
            <i class="fas fa-shopping-cart text-primary"></i>
            <h2 class="text-lg font-bold text-gray-800">Tu Pedido</h2>
        </div>
        <button id="btnCloseCart" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
            <i class="fas fa-times text-xl"></i>
        </button>
    </div>

    <!-- Items List -->
    <div id="cartItemsList" class="flex-1 overflow-y-auto p-6 space-y-4">
        <!-- Populated by JS -->
        <div id="emptyCartMessage" class="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4 py-20">
            <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <i class="fas fa-shopping-cart text-3xl opacity-20"></i>
            </div>
            <p>Tu carrito está vacío.</p>
            <a href="catalog.html" class="text-primary font-bold hover:underline">Ver productos</a>
        </div>
    </div>

    <!-- Footer -->
    <div id="cartFooter" class="p-6 border-t border-gray-100 bg-gray-50 hidden">
        <div class="flex justify-between items-center mb-6">
            <span class="text-gray-500 font-medium">Subtotal Estimado:</span>
            <span id="cartTotal" class="text-2xl font-black text-gray-900">$0,00</span>
        </div>
        <a href="order.html" class="block w-full bg-primary hover:bg-dark text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition transform hover:-translate-y-0.5 active:scale-95">
            Continuar con el Pedido
        </a>
        <p class="text-center text-[11px] text-gray-400 mt-4 italic">
            * El total es aproximado y se confirmará al solicitar el presupuesto.
        </p>
    </div>
</div>

<!-- Auth Modal Overlay -->
<div id="authOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-[80] hidden transition-opacity duration-300 opacity-0 pointer-events-none"></div>

<!-- Auth Modal -->
<div id="authModal" class="fixed inset-0 z-[90] hidden items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md my-8 relative">
        <!-- Close Button -->
        <button id="btnCloseAuth" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition z-10">
            <i class="fas fa-times text-xl"></i>
        </button>

        <!-- Login Form -->
        <div id="loginFormContainer" class="p-8">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                    <i class="fas fa-user text-white text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h2>
                <p class="text-sm text-gray-500 mt-1">Ingresa a tu cuenta para continuar</p>
            </div>

            <form id="loginForm" class="space-y-5">
                <div id="loginError" class="hidden bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start">
                    <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
                    <span id="loginErrorMessage">Credenciales incorrectas.</span>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico</label>
                    <input type="email" id="loginEmail" required placeholder="tu@email.com" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                    <input type="password" id="loginPassword" required placeholder="••••••••" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" id="rememberMe" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                        <span class="ml-2 text-sm text-gray-600">Recordarme</span>
                    </label>
                    <button type="button" id="btnForgotPassword" class="text-sm text-primary hover:text-dark font-medium">
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <button type="submit" class="w-full bg-gradient-to-r from-primary to-dark hover:from-dark hover:to-black text-white font-bold py-4 rounded-xl transition shadow-lg mt-4">
                    Iniciar Sesión
                </button>

                <p class="text-center text-sm text-gray-500 mt-6">
                    ¿No tienes cuenta? 
                    <button type="button" id="btnGoToRegister" class="text-primary hover:text-dark font-bold">Regístrate</button>
                </p>
            </form>
        </div>

        <!-- Register Form -->
        <div id="registerFormContainer" class="p-8 hidden">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                    <i class="fas fa-user-plus text-white text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Crear Cuenta</h2>
                <p class="text-sm text-gray-500 mt-1">Únete a Camponuevo y disfruta de nuestros beneficios</p>
            </div>

            <form id="registerForm" class="space-y-4">
                <div id="registerError" class="hidden bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start">
                    <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
                    <span id="registerErrorMessage">Error al registrarse.</span>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nombre Completo *</label>
                    <input type="text" id="regName" required placeholder="Juan Pérez" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico *</label>
                    <input type="email" id="regEmail" required placeholder="tu@email.com" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña *</label>
                    <input type="password" id="regPassword" required placeholder="Mínimo 6 caracteres" minlength="6" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar Contraseña *</label>
                    <input type="password" id="regConfirmPassword" required placeholder="Repite tu contraseña" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                </div>

                <button type="submit" class="w-full bg-gradient-to-r from-primary to-dark hover:from-dark hover:to-black text-white font-bold py-4 rounded-xl transition shadow-lg mt-4">
                    Crear Cuenta
                </button>

                <p class="text-center text-sm text-gray-500 mt-6">
                    ¿Ya tienes cuenta? 
                    <button type="button" id="btnGoToLogin" class="text-primary hover:text-dark font-bold">Inicia Sesión</button>
                </p>
            </form>
        </div>

        <!-- Recovery Form -->
        <div id="recoveryFormContainer" class="p-8 hidden">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                    <i class="fas fa-key text-white text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Recuperar Contraseña</h2>
                <p class="text-sm text-gray-500 mt-1">Responde tu pregunta de seguridad para restablecerla</p>
            </div>

            <form id="recoveryForm" class="space-y-5">
                <div id="recoveryError" class="hidden bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start">
                    <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
                    <span id="recoveryErrorMessage">Error.</span>
                </div>

                <div id="recoveryStep1">
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico</label>
                    <input type="email" id="recoveryEmail" required placeholder="tu@email.com" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                    <button type="button" id="btnFindQuestion" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition mt-3">
                        Buscar mi pregunta
                    </button>
                </div>

                <div id="recoveryStep2" class="hidden">
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Tu Pregunta de Seguridad</label>
                    <div id="recoveryQuestionDisplay" class="bg-gray-50 p-4 rounded-xl text-gray-700 italic mb-4">
                        Cargando...
                    </div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Respuesta</label>
                    <input type="text" id="recoveryAnswer" required placeholder="Tu respuesta" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                    <button type="button" id="btnVerifyAnswer" class="w-full bg-primary hover:bg-dark text-white font-bold py-3 rounded-xl transition mt-3">
                        Verificar Respuesta
                    </button>
                </div>

                <div id="recoveryStep3" class="hidden">
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nueva Contraseña</label>
                    <input type="password" id="recoveryNewPassword" required placeholder="Mínimo 6 caracteres" minlength="6" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5 mt-3">Confirmar Nueva Contraseña</label>
                    <input type="password" id="recoveryConfirmPassword" required placeholder="Repite tu contraseña" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition">
                    <button type="submit" class="w-full bg-gradient-to-r from-primary to-dark hover:from-dark hover:to-black text-white font-bold py-3 rounded-xl transition shadow-lg mt-4">
                        Restablecer Contraseña
                    </button>
                </div>

                <p class="text-center text-sm text-gray-500 mt-6">
                    <button type="button" id="btnBackToLogin" class="text-primary hover:text-dark font-bold">
                        <i class="fas fa-arrow-left mr-1"></i> Volver al Inicio de Sesión
                    </button>
                </p>
            </form>
        </div>
    </div>
</div>

<style>
    .glass-header {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    }
    .rotate-logo {
        animation: logo-bounce 10s ease-in-out infinite;
        transform-origin: center;
    }
    @keyframes logo-bounce {
        0%, 90%, 100% { transform: translateY(0); }
        92% { transform: translateY(-5px); }
        95% { transform: translateY(2px); }
        98% { transform: translateY(-2px); }
    }
    
    /* User dropdown animation */
    #userDropdown {
        transform-origin: top right;
        transition: all 0.15s ease-out;
    }
    
    #userDropdown.hidden {
        opacity: 0;
        transform: scale(0.95);
    }
    
    #userDropdown:not(.hidden) {
        opacity: 1;
        transform: scale(1);
    }
</style>
`;
