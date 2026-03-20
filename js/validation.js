// js/validation.js
// Módulo de validación y sanitización de inputs
// Usa estas funciones antes de enviar datos a Supabase

const Validation = {
    // ============ EMAIL ============
    isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },

    // ============ TELÉFONO ============
    isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') return false;
        // Acepta formatos: +54 11 1234-5678, 11 1234 5678, etc.
        const phoneRegex = /^[\d\s\-\+\(\)]{6,20}$/;
        return phoneRegex.test(phone.trim());
    },

    // ============ NOMBRE ============
    isValidName(name) {
        if (!name || typeof name !== 'string') return false;
        const trimmed = name.trim();
        return trimmed.length >= 2 && trimmed.length <= 100;
    },

    // ============ CONTRASEÑA ============
    isValidPassword(password) {
        if (!password || typeof password !== 'string') return false;
        
        const errors = [];
        
        if (password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres');
        }
        if (password.length > 128) {
            errors.push('La contraseña no puede superar los 128 caracteres');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una mayúscula');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una minúscula');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('La contraseña debe contener al menos un número');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // ============ PRECIO ============
    isValidPrice(price) {
        const num = parseFloat(price);
        return !isNaN(num) && num >= 0 && num <= 999999999;
    },

    // ============ URL ============
    isValidUrl(url) {
        if (!url || typeof url !== 'string') return false;
        if (url.trim() === '') return true; // URL vacía es válida (campo opcional)
        
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    // ============ IDENTIFICACIÓN (DNI/CUIT) ============
    isValidIdentification(ident) {
        if (!ident || typeof ident !== 'string') return false;
        const trimmed = ident.trim();
        
        // DNI: 7-8 dígitos
        const dniRegex = /^\d{7,8}$/;
        
        // CUIT/CUIL: XX-XXXXXXXX-X
        const cuitRegex = /^\d{2}\-\d{8}\-\d{1}$/;
        
        return dniRegex.test(trimmed) || cuitRegex.test(trimmed);
    },

    // ============ DIRECCIÓN ============
    isValidAddress(address) {
        if (!address || typeof address !== 'string') return false;
        const trimmed = address.trim();
        return trimmed.length >= 5 && trimmed.length <= 500;
    },

    // ============ LOCALIDAD/PROVINCIA ============
    isValidLocation(location) {
        if (!location || typeof location !== 'string') return false;
        const trimmed = location.trim();
        return trimmed.length >= 2 && trimmed.length <= 100;
    },

    // ============ SANITIZACIÓN ============
    sanitizeString(str, maxLength = 1000) {
        if (!str || typeof str !== 'string') return '';
        
        return str
            .replace(/<[^>]*>/g, '') // Eliminar tags HTML
            .replace(/[<>'"]/g, '') // Eliminar caracteres peligrosos
            .replace(/javascript:/gi, '') // Eliminar javascript:
            .replace(/on\w+=/gi, '') // Eliminar event handlers
            .replace(/&/g, '&amp;') // Escapar &
            .replace(/\0/g, '') // Eliminar bytes nulos
            .trim()
            .slice(0, maxLength);
    },

    sanitizeEmail(email) {
        if (!email || typeof email !== 'string') return '';
        return email.toLowerCase().trim().replace(/[<>'"]/g, '');
    },

    sanitizePhone(phone) {
        if (!phone || typeof phone !== 'string') return '';
        return phone.replace(/[^\d\s\-\+\(\)]/g, '').trim();
    },

    // ============ VALIDACIÓN DE PEDIDO ============
    validateOrder(orderData) {
        const errors = [];

        // Validar cliente
        if (!this.isValidName(orderData.customerInfo?.name)) {
            errors.push('El nombre del cliente es inválido');
        }

        if (!this.isValidEmail(orderData.customerInfo?.email)) {
            errors.push('El email del cliente es inválido');
        }

        if (orderData.customerInfo?.phone && !this.isValidPhone(orderData.customerInfo.phone)) {
            errors.push('El teléfono del cliente es inválido');
        }

        if (orderData.customerInfo?.identification && !this.isValidIdentification(orderData.customerInfo.identification)) {
            errors.push('La identificación (DNI/CUIT) es inválida');
        }

        // Validar envío
        if (orderData.customerInfo?.delivery?.method === 'shipping') {
            if (!this.isValidLocation(orderData.customerInfo.delivery.province)) {
                errors.push('La provincia es inválida');
            }
            if (!this.isValidLocation(orderData.customerInfo.delivery.locality)) {
                errors.push('La localidad es inválida');
            }
            if (orderData.customerInfo.delivery.address && !this.isValidAddress(orderData.customerInfo.delivery.address)) {
                errors.push('La dirección es inválida');
            }
        }

        // Validar productos
        if (!orderData.items || orderData.items.length === 0) {
            errors.push('El pedido debe contener al menos un producto');
        }

        // Validar totales
        if (typeof orderData.subtotal !== 'number' || orderData.subtotal < 0) {
            errors.push('El subtotal es inválido');
        }

        if (typeof orderData.iva !== 'number' || orderData.iva < 0) {
            errors.push('El IVA es inválido');
        }

        if (typeof orderData.total !== 'number' || orderData.total < 0) {
            errors.push('El total es inválido');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // ============ VALIDACIÓN DE PRODUCTO ============
    validateProduct(product) {
        const errors = [];

        if (!this.sanitizeString(product.title) || product.title.trim().length < 2) {
            errors.push('El título del producto es requerido');
        }

        if (product.price !== undefined && !this.isValidPrice(product.price)) {
            errors.push('El precio es inválido');
        }

        if (product.image && !this.isValidUrl(product.image)) {
            errors.push('La URL de la imagen es inválida');
        }

        if (product.externalLink && !this.isValidUrl(product.externalLink)) {
            errors.push('El enlace externo es inválido');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // ============ VALIDACIÓN DE PERFIL DE USUARIO ============
    validateUserProfile(profile) {
        const errors = [];

        if (profile.name && !this.isValidName(profile.name)) {
            errors.push('El nombre es inválido');
        }

        if (profile.email && !this.isValidEmail(profile.email)) {
            errors.push('El email es inválido');
        }

        if (profile.phone && !this.isValidPhone(profile.phone)) {
            errors.push('El teléfono es inválido');
        }

        if (profile.identification && !this.isValidIdentification(profile.identification)) {
            errors.push('La identificación es inválida');
        }

        if (profile.location && !this.isValidLocation(profile.location)) {
            errors.push('La localidad es inválida');
        }

        if (profile.address && !this.isValidAddress(profile.address)) {
            errors.push('La dirección es inválida');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
};

// Validaciones específicas para el formulario de contacto
const ContactFormValidation = {
    validate(data) {
        const errors = [];

        if (!Validation.isValidName(data.name)) {
            errors.push('El nombre es requerido (mínimo 2 caracteres)');
        }

        if (!Validation.isValidEmail(data.email)) {
            errors.push('El email es requerido y debe ser válido');
        }

        if (data.phone && !Validation.isValidPhone(data.phone)) {
            errors.push('El teléfono tiene un formato inválido');
        }

        if (!data.message || data.message.trim().length < 10) {
            errors.push('El mensaje es requerido (mínimo 10 caracteres)');
        }

        if (data.message && data.message.length > 5000) {
            errors.push('El mensaje no puede superar los 5000 caracteres');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    sanitize(data) {
        return {
            name: Validation.sanitizeString(data.name, 100),
            email: Validation.sanitizeEmail(data.email),
            phone: data.phone ? Validation.sanitizePhone(data.phone) : '',
            subject: Validation.sanitizeString(data.subject || 'Sin asunto', 200),
            message: Validation.sanitizeString(data.message, 5000)
        };
    }
};

// Hacer disponible globalmente
window.Validation = Validation;
window.ContactFormValidation = ContactFormValidation;

console.log('✅ Módulo de validación cargado');
