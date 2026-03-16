# Instrucciones de Uso del Sistema de Usuarios

## Cómo Probar el Sistema

### 1. Registro de Usuario
1. Abre `index.html` en tu navegador
2. Haz clic en "Registrarse" en la esquina superior derecha
3. Completa los campos:
   - Nombre Completo
   - Correo Electrónico
   - Contraseña (mínimo 6 caracteres)
   - Confirmar Contraseña
4. Haz clic en "Crear Cuenta"
5. ¡Listo! Tu cuenta ha sido creada

### 2. Perfil de Usuario
1. Una vez registrado, haz clic en tu nombre en el header
2. Selecciona "Mi Cuenta"
3. Completa tu perfil con:
   - Teléfono
   - Ubicación/Establecimiento
   - CUIT/DNI
4. Configura tu Pregunta de Seguridad para recuperar contraseña
5. Haz clic en "Guardar Cambios"

### 3. Historial de Pedidos
1. En "Mi Cuenta", haz clic en "Historial de Pedidos"
2. Verás todos los pedidos realizados con:
   - Fecha y hora
   - Productos comprados
   - Total
   - Estado

### 4. Checkout Automático
1. Añade productos al carrito
2. Ve al checkout (`order.html`)
3. Tus datos se pre-rellenarán automáticamente si estás logueado
4. Al realizar el pedido, tus datos se guardarán en tu perfil
5. Próximos pedidos usarán los datos guardados

### 5. Recuperación de Contraseña
1. Haz clic en "Iniciar Sesión"
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu email
4. Responde tu pregunta de seguridad
5. Establece una nueva contraseña

## Características Clave

- ✅ Registro simplificado (solo 4 campos)
- ✅ Perfil completo con datos adicionales
- ✅ Pregunta de seguridad configurable
- ✅ Checkout automático con datos guardados
- ✅ Historial de pedidos completo
- ✅ Recuperación de contraseña segura
- ✅ Datos almacenados en Supabase (producción)

## Notas Importantes

- Los datos de usuarios y pedidos se almacenan en **Supabase** (base de datos en la nube)
- El código fuente se gestiona en **GitHub**
- Los usuarios existentes deben configurar su pregunta de seguridad
- El checkout guarda automáticamente los datos del usuario
