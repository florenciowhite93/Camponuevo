# Guía de Pruebas del Sistema de Usuarios

## Preparación
1. Abre la carpeta `camponuevo` en tu navegador
2. Asegúrate de tener acceso a `file:///C:/Users/User/Dev/camponuevo/`

## Prueba 1: Registro de Usuario
**Objetivo**: Verificar que el registro funciona correctamente

**Pasos**:
1. Abrir `index.html`
2. Clic en "Registrarse" (esquina superior derecha)
3. Completar el formulario:
   - Nombre: "Usuario de Prueba"
   - Email: "prueba@test.com"
   - Contraseña: "test123"
   - Confirmar: "test123"
4. Clic en "Crear Cuenta"
5. **Verificar**: Aparece alerta de éxito y se cierra el modal
6. **Verificar**: El header muestra el nombre del usuario

**Resultado Esperado**:
- ✅ Modal de registro se cierra
- ✅ Header muestra nombre del usuario
- ✅ Usuario aparece en sessionStorage

## Prueba 2: Perfil de Usuario
**Objetivo**: Verificar edición de perfil y campos nuevos

**Pasos**:
1. Clic en el nombre del usuario (header)
2. Seleccionar "Mi Cuenta"
3. Completar campos adicionales:
   - Teléfono: "+54 11 1234-5678"
   - Ubicación: "Estancia Los Pinos"
   - CUIT/DNI: "20-12345678-9"
4. Clic en "Guardar Cambios"
5. **Verificar**: Mensaje de éxito aparece

**Resultado Esperado**:
- ✅ Datos guardados en localStorage
- ✅ Mensaje de confirmación visible
- ✅ Campos persisten al recargar

## Prueba 3: Configuración de Seguridad
**Objetivo**: Verificar pregunta de seguridad

**Pasos**:
1. En "Mi Cuenta", ir a sección "Pregunta de Seguridad"
2. Seleccionar pregunta: "¿Nombre de tu primera mascota?"
3. Escribir respuesta: "Firulais"
4. Clic en "Guardar Pregunta de Seguridad"
5. **Verificar**: Mensaje de éxito

**Resultado Esperado**:
- ✅ Pregunta y respuesta guardadas
- ✅ Mensaje de confirmación visible

## Prueba 4: Checkout Automático
**Objetivo**: Verificar pre-llenado y guardado de datos

**Pasos**:
1. Añadir productos al carrito
2. Ir a checkout (`order.html`)
3. **Verificar**: Campos pre-llenados con datos del perfil
4. Modificar algún campo (opcional)
5. Clic en "Solicitar Presupuesto"
6. **Verificar**: WhatsApp se abre con datos correctos

**Resultado Esperado**:
- ✅ Campos pre-llenados automáticamente
- ✅ Datos se guardan en perfil del usuario
- ✅ Mensaje de WhatsApp con información correcta

## Prueba 5: Historial de Pedidos
**Objetivo**: Verificar que los pedidos aparecen en el historial

**Pasos**:
1. Realizar un pedido (desde Prueba 4)
2. Ir a "Mi Cuenta" → "Historial de Pedidos"
3. **Verificar**: Pedido aparece en la lista
4. **Verificar**: Muestra fecha, productos y total

**Resultado Esperado**:
- ✅ Pedido aparece en historial
- ✅ Información completa visible
- ✅ Ordenado por fecha (más reciente primero)

## Prueba 6: Recuperación de Contraseña
**Objetivo**: Verificar flujo de recuperación

**Pasos**:
1. Clic en "Iniciar Sesión"
2. Clic en "¿Olvidaste tu contraseña?"
3. Ingresar email: "prueba@test.com"
4. Clic en "Buscar mi pregunta"
5. **Verificar**: Se muestra "¿Nombre de tu primera mascota?"
6. Ingresar respuesta: "Firulais"
7. Clic en "Verificar Respuesta"
8. Ingresar nueva contraseña: "nueva123"
9. Clic en "Restablecer Contraseña"
10. **Verificar**: Alerta de éxito
11. Intentar iniciar sesión con nueva contraseña

**Resultado Esperado**:
- ✅ Pregunta de seguridad se muestra
- ✅ Respuesta correcta permite continuar
- ✅ Nueva contraseña funciona
- ✅ Mensaje de éxito visible

## Prueba 7: Cierre de Sesión
**Objetivo**: Verificar que el logout funciona

**Pasos**:
1. Clic en el nombre del usuario (header)
2. Clic en "Cerrar Sesión"
3. **Verificar**: Header muestra botones "Iniciar Sesión" y "Registrarse"
4. Intentar acceder a `user.html`
5. **Verificar**: Redirección a `index.html`

**Resultado Esperado**:
- ✅ Header cambia a botones de auth
- ✅ Sesión se cierra correctamente
- ✅ Redirección a home si intenta acceder a perfil

## Prueba 8: Datos Persisten entre Sesiones
**Objetivo**: Verificar que los datos se guardan

**Pasos**:
1. Registrar usuario y completar perfil
2. Cerrar sesión
3. Recargar la página
4. Iniciar sesión nuevamente
5. Ir a "Mi Cuenta"
6. **Verificar**: Todos los datos siguen guardados

**Resultado Esperado**:
- ✅ Datos de perfil persisten
- ✅ Historial de pedidos visible
- ✅ Pregunta de seguridad configurada

## Reporte de Errores

Si encuentras algún error, anota:
1. **Página donde ocurre**: 
2. **Acción realizada**:
3. **Error obtenido**:
4. **Mensaje de consola** (F12 → Consola):

## Notas Importantes

- Todos los datos se guardan en el navegador (localStorage)
- Para probar en diferentes navegadores, se pierde el historial
- Para producción, se necesita backend seguro
- El sistema es funcional para demostración y desarrollo
