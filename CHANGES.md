# Cambios Realizados en el Sistema de Usuarios

## Resumen
Se simplificó el proceso de registro y se movieron los campos adicionales al perfil de usuario. También se mejoró la integración con el checkout para guardar los datos del cliente.

## Archivos Modificados

### 1. `components/header_content.js`
- **Formulario de Registro Simplificado**:
  - Campos eliminados: Teléfono, Pregunta de Seguridad, Respuesta de Seguridad
  - Campos restantes: Nombre Completo, Correo Electrónico, Contraseña, Confirmar Contraseña

### 2. `js/header.js`
- **Lógica de Registro Actualizada**:
  - Eliminada la validación de campos eliminados
  - Registro ahora solo requiere: nombre, email, contraseña

### 3. `js/data.js`
- **Función `registerUser` Actualizada**:
  - Ya no requiere campos de seguridad durante el registro
  - Inicializa campos de seguridad como vacíos
  - Los campos se pueden configurar después en el perfil

- **Función `updateUserProfile` Actualizada**:
  - Ahora maneja: `location`, `identification`, `securityQuestion`, `securityAnswer`
  - La respuesta de seguridad se hashea antes de guardarla

- **Funciones de Seguridad Mejoradas**:
  - `getSecurityQuestion`: Verifica si el usuario tiene pregunta configurada
  - `validateSecurityAnswer`: Verifica si el usuario tiene pregunta configurada

### 4. `user.html`
- **Nuevo Formulario de Perfil**:
  - Campos básicos: Nombre, Email (solo lectura), Teléfono
  - Campos nuevos: Ubicación/Establecimiento, CUIT/DNI
  
- **Nueva Sección de Seguridad**:
  - Pregunta de Seguridad (predefinida o personalizada)
  - Respuesta de Seguridad
  - Los campos se guardan en el perfil del usuario

### 5. `js/user.js`
- **Manejo de Nuevos Campos**:
  - Inicialización del formulario con datos del usuario
  - Actualización de perfil con todos los campos nuevos
  - Gestión del formulario de seguridad

- **Lógica de Pregunta de Seguridad**:
  - Toggle entre pregunta predefinida y personalizada
  - Validación de la respuesta de seguridad

### 6. `js/order.js`
- **Integración con Checkout**:
  - Pre-llenado de datos del usuario en el checkout
  - Guardado automático de datos de contacto del pedido en el perfil del usuario

## Flujo de Usuario Mejorado

### Registro (Simplificado)
1. Usuario ingresa: Nombre, Email, Contraseña
2. Cuenta creada exitosamente
3. Se sugiere completar el perfil

### Perfil de Usuario
1. **Datos Personales**: Nombre, Teléfono, Ubicación, CUIT/DNI
2. **Pregunta de Seguridad**: Configuración para recuperación de contraseña
3. **Historial de Pedidos**: Lista de todos los pedidos realizados

### Checkout
1. Si el usuario está logueado, se pre-rellenan sus datos guardados
2. Al realizar un pedido, los datos de contacto se guardan en el perfil
3. Próximos pedidos usarán los datos guardados automáticamente

### Recuperación de Contraseña
1. Ingresar email
2. Mostrar pregunta de seguridad configurada
3. Ingresar respuesta
4. Establecer nueva contraseña

## Notas Importantes
- Los usuarios existentes necesitarán configurar su pregunta de seguridad en el perfil
- Los datos del checkout se guardan automáticamente en el perfil del usuario
- El sistema mantiene compatibilidad con la funcionalidad existente del carrito y catálogo
