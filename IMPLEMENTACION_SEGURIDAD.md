# GUÍA DE IMPLEMENTACIÓN DE SEGURIDAD - Camponuevo

**Versión:** 2.0  
**Última actualización:** Marzo 2026  
**Estado:** Producción lista

---

## 📋 ÍNDICE

1. [Estado Actual del Proyecto](#-estado-actual-del-proyecto)
2. [Cambios de API Keys](#-cambios-de-api-keys)
3. [Arquitectura de Seguridad](#-arquitectura-de-seguridad)
4. [Configuración SQL - Políticas RLS](#-configuración-sql---políticas-rls)
5. [Edge Functions](#-edge-functions)
6. [Sistema de Autenticación](#-sistema-de-autenticación)
7. [Validación y Sanitización](#-validación-y-sanitización)
8. [Content Security Policy](#-content-security-policy)
9. [Configuración de Auth en Supabase](#-configuración-de-auth-en-supabase)
10. [Despliegue](#-despliegue)
11. [Verificación Post-Despliegue](#-verificación-post-despliegue)
12. [Solución de Problemas](#-solución-de-problemas)

---

## ✅ ESTADO ACTUAL DEL PROYECTO

### Archivos Implementados

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `js/supabase-config.js` | Configuración de cliente Supabase | ✅ Implementado |
| `js/auth.js` | Sistema de autenticación completo | ✅ Implementado |
| `js/validation.js` | Validación y sanitización de inputs | ✅ Implementado |
| `supabase/sql/security.sql` | Políticas RLS restrictivas | ✅ Implementado |
| `supabase/sql/add-admin.sql` | Instrucciones para agregar admins | ✅ Implementado |
| `supabase/functions/contact-form/index.ts` | Edge Function protegida | ✅ Implementado |

### Funcionalidades de Seguridad

- ✅ Autenticación con Supabase Auth
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Rate Limiting en Edge Function
- ✅ Sanitización de inputs contra XSS
- ✅ Validación de API key en Edge Functions
- ✅ CORS restrictivo
- ✅ Logs de auditoría
- ✅ Contraseñas hasheadas (nunca en texto plano)

---

## 🔑 CAMBIOS DE API KEYS

### Keys Actuales (Regeneradas Marzo 2026)

```
SUPABASE_URL: https://itlczokcdxgzgqrortpm.supabase.co
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGN6b2tjZHhnemdxcm9ydHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDk1MzcsImV4cCI6MjA4OTE4NTUzN30.4j9YbZbeiOJQ6xnoyVjdW8xlv8qsrZnqgmJ3E6jkdCg
```

### Variables de Entorno Requeridas

| Variable | Descripción | Ubicación |
|----------|-------------|-----------|
| `SUPABASE_URL` | URL del proyecto | `js/supabase-config.js`, Edge Functions |
| `SUPABASE_ANON_KEY` | Key pública (cliente) | `js/supabase-config.js` |
| `RESEND_API_KEY` | Para envío de emails | Edge Function (secrets) |
| `TO_EMAIL` | Email destino notificaciones | Edge Function (secrets) |

### ⚠️ IMPORTANTE: Service Role Key

**NUNCA** expongas la Service Role Key en código del cliente. Esta solo se usa en:
- Edge Functions (via secrets de Supabase)
- Scripts de servidor backend (si existe)

---

## 🏗️ ARQUITECTURA DE SEGURIDAD

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │supabase-config.js│  │    auth.js       │  │validation.js│ │
│  │  - ANON Key     │  │  - Login/Logout  │  │ - Sanitización│
│  │  - Cliente JS   │  │  - Registro     │  │ - Validación │  │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘  │
└───────────┼───────────────────┼──────────────────┼──────────┘
            │                   │                  │
            │    ┌──────────────┴──────────────────┘
            │    │
            ▼    ▼
┌─────────────────────────────────────────┐
│              SUPABASE                    │
│  ┌───────────────────────────────────┐  │
│  │         Row Level Security        │  │
│  │  - Products: READ público         │  │
│  │  - Orders: READ own + admin       │  │
│  │  - Users: READ/WRITE own + admin  │  │
│  │  - Admin ops: Solo admins         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        Edge Functions             │  │
│  │  - Rate Limiting                  │  │
│  │  - API Key Validation             │  │
│  │  - CORS Restrictivo               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🗄️ CONFIGURACIÓN SQL - POLÍTICAS RLS

### ⚠️ IMPORTANTE: Archivo `supabase-tables.sql`

**Este archivo está DEPRECADO y NO debe ejecutarse.** Contiene políticas RLS permisivas que permitirían acceso completo a cualquier usuario.

Si ya se ejecutó accidentalmente:
1. Ejecuta `supabase/sql/security.sql` para sobrescribir las políticas
2. Verifica con el script de verificación

### Archivo: `supabase/sql/security.sql`

Este archivo configura Row Level Security (RLS) para todas las tablas.

### Tablas Protegidas

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `products` | Público | Admin | Admin | Admin |
| `categories` | Público | Admin | Admin | Admin |
| `subcategories` | Público | Admin | Admin | Admin |
| `laboratories` | Público | Admin | Admin | Admin |
| `labels` | Público | Admin | Admin | Admin |
| `home_categories` | Público | Admin | Admin | Admin |
| `orders` | Own+Admin | Público | Own+Admin | Admin |
| `users` | Own+Admin | Auth user | Own+Admin | Admin |
| `admins` | Admin | Admin | - | Admin |
| `contact_messages` | Admin | Público | Admin | Admin |

### Ejecutar SQL de Seguridad

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y pega el contenido de `supabase/sql/security.sql`
5. Ejecuta el script

### Verificar Ejecución Exitosa

```sql
SELECT 
    tablename,
    policyname,
    permissive
FROM pg_policies 
WHERE scheman = 'public'
ORDER BY tablename, policyname;
```

Deberías ver políticas para todas las tablas listadas arriba.

---

## ⚡ EDGE FUNCTIONS

### Contact Form (`supabase/functions/contact-form/index.ts`)

**Propósito:** Manejar formulario de contacto de forma segura

**Seguridad Implementada:**
- ✅ Rate Limiting (5 requests/minuto)
- ✅ Validación de API Key
- ✅ Sanitización de todos los inputs
- ✅ Validación de longitud de campos
- ✅ CORS restrictivo (solo dominios autorizados)
- ✅ Logging de IP del cliente
- ✅ Escape de HTML en emails

**Variables de Entorno (Secrets):**
```bash
supabase secrets set RESEND_API_KEY=tu_resend_api_key
supabase secrets set TO_EMAIL=info@camponuevo.com.ar
supabase secrets set SUPABASE_URL=https://itlczokcdxgzgqrortpm.supabase.co
supabase secrets set SUPABASE_ANON_KEY=tu_anon_key
```

**Despliegue:**
```bash
cd supabase
supabase functions deploy contact-form
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Archivo: `js/auth.js`

**Funciones Disponibles:**

| Función | Descripción |
|---------|-------------|
| `registerUser(email, password, userData)` | Registro de nuevo usuario |
| `loginUser(email, password)` | Inicio de sesión |
| `logoutUser()` | Cerrar sesión |
| `getCurrentUser()` | Obtener usuario actual |
| `checkIfAdmin(userId)` | Verificar si es administrador |
| `addAdmin(email)` | Agregar admin (requiere ser admin) |
| `requestPasswordReset(email)` | Solicitar recuperación de contraseña |
| `changePassword(current, newPassword)` | Cambiar contraseña |

**Flujo de Autenticación:**

1. Usuario se registra → Supabase Auth crea usuario
2. Se crea perfil en tabla `users`
3. Usuario inicia sesión → JWT token generado
4. Token almacenado en sessionStorage
5. RLS verifica permisos en cada query

### Agregar Administrador

**Opción 1: SQL directo**
```sql
-- Obtener ID del usuario
SELECT id, email FROM auth.users WHERE email = 'admin@ejemplo.com';

-- Agregar como admin
INSERT INTO admins (user_id, email, added_by)
VALUES ('uuid-del-usuario', 'admin@ejemplo.com', 'system');
```

**Opción 2: Usando función JS**
```javascript
// Debe estar logueado como admin
await addAdmin('nuevo-admin@ejemplo.com');
```

---

## 🛡️ VALIDACIÓN Y SANITIZACIÓN

### Archivo: `js/validation.js`

**Validaciones Disponibles:**

| Validación | Método | Descripción |
|------------|--------|-------------|
| Email | `isValidEmail(email)` | Formato válido de email |
| Teléfono | `isValidPhone(phone)` | 6-20 dígitos con formatos aceptados |
| Nombre | `isValidName(name)` | 2-100 caracteres |
| Contraseña | `isValidPassword(password)` | 8+ chars, mayúscula, minúscula, número |
| Precio | `isValidPrice(price)` | 0 a 999,999,999 |
| URL | `isValidUrl(url)` | URL válida o vacía |
| DNI/CUIT | `isValidIdentification(ident)` | Formato argentino |
| Dirección | `isValidAddress(address)` | 5-500 caracteres |

**Sanitización:**

```javascript
// Sanitizar string genérico
Validation.sanitizeString(str, maxLength);

// Sanitizar email
Validation.sanitizeEmail(email);

// Sanitizar teléfono
Validation.sanitizePhone(phone);

// Validar pedido completo
Validation.validateOrder(orderData);

// Validar producto
Validation.validateProduct(product);

// Validar perfil de usuario
Validation.validateUserProfile(profile);

// Validar formulario de contacto
ContactFormValidation.validate(data);
ContactFormValidation.sanitize(data);
```

### Uso en Formularios

```javascript
// Antes de enviar datos a Supabase
const validation = Validation.validateOrder(orderData);
if (!validation.valid) {
    alert(validation.errors.join('\n'));
    return;
}

// Sanitizar antes de mostrar en UI
const safeName = Validation.sanitizeString(userInput);
```

---

## 🌐 CONTENT SECURITY POLICY

### Meta Tag CSP (agregar en `<head>` de cada HTML)

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://itlczokcdxgzgqrortpm.supabase.co https://*.supabase.co;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    upgrade-insecure-requests;
">
```

### Archivos con CSP Implementado ✅

- `index.html` ✅
- `admin.html` ✅
- `catalog.html` ✅
- `order.html` ✅
- `user.html` ✅
- `product.html` ✅
- `about.html` ✅
- `verify-email.html` ✅
- `reset-password.html` ✅ (creado)
- `order-confirmation.html` ✅

### Headers Adicionales Recomendados

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

---

## ⚙️ CONFIGURACIÓN DE AUTH EN SUPABASE

Ve a **Authentication > Settings** en el dashboard:

### Configuración General

| Opción | Valor |
|--------|-------|
| Site URL | `https://camponuevo.com.ar` |
| Redirect URLs | `https://camponuevo.com.ar/*` |
| Enable email confirmations | ✅ **Activado** |
| Enable manual linking | ❌ Desactivado |
| Password minimum length | **8** |

### Rate Limiting de Auth

| Opción | Valor |
|--------|-------|
| Maximum requests per IP per hour | **10** |
| Maximum attempts per user per hour | **10** |

### Email Templates

Personaliza los templates de email en **Authentication > Email Templates**:
- Confirm signup
- Reset password
- Magic link

---

## 🚀 DESPLIEGUE

### Paso 1: Variables de Entorno en Vercel

En Vercel Dashboard → Settings → Environment Variables:

```bash
SUPABASE_URL=https://itlczokcdxgzgqrortpm.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
```

### Paso 2: Desplegar Edge Functions

```bash
cd supabase
supabase login
supabase functions deploy contact-form
supabase secrets set RESEND_API_KEY=tu_resend_api_key
```

### Paso 3: Ejecutar SQL de Seguridad

1. Ve a Supabase SQL Editor
2. Ejecuta `supabase/sql/security.sql`

### Paso 4: Verificar en Producción

```bash
vercel --prod
```

---

## 🔍 VERIFICACIÓN POST-DESPLIEGUE

### Checklist de Seguridad

- [x] **API Keys Regeneradas** - Verificar que las nuevas keys están en uso
- [ ] **RLS Habilitado** - Ejecutar `supabase/sql/security.sql` en Supabase
- [ ] **Edge Functions Desplegadas** - `supabase functions deploy contact-form`
- [x] **CORS Configurado** - Edge Function ya tiene CORS restrictivo
- [x] **Rate Limiting** - Implementado en Edge Function (5 req/min)
- [x] **Auth Funcionando** - Sistema con Supabase Auth implementado
- [x] **Admin Acceso** - RLS configura acceso solo a admins
- [x] **CSP Activo** - Headers agregados a todos los HTMLs
- [ ] **HTTPS** - Vercel lo maneja automáticamente
- [ ] **Backups** - Configurar en Supabase Dashboard
- [ ] **Secrets Configurados** - RESEND_API_KEY, TO_EMAIL

### Script de Pruebas Automatizadas

```sql
-- Verificar RLS en todas las tablas
SELECT 
    scheman,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables 
WHERE scheman = 'public'
ORDER BY tablename;

-- Ver políticas por tabla
SELECT tablename, policyname, permissive, cmd, qual
FROM pg_policies
WHERE scheman = 'public'
ORDER BY tablename;

-- Verificar admins
SELECT * FROM admins;

-- Ver logs de intentos de auth
SELECT id, email, created_at, last_sign_in_at, invited_at
FROM auth.users
ORDER BY created_at DESC;
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Unauthorized" en Edge Function
**Causa:** API key incorrecta o faltante
**Solución:**
1. Verificar que `SUPABASE_ANON_KEY` está configurada
2. Verificar que el header `apikey` se envía en requests

### Error: "No tienes permisos de administrador"
**Causa:** Usuario no está en tabla `admins`
**Solución:**
```sql
SELECT * FROM admins;
-- Si no aparece, agregarlo:
INSERT INTO admins (user_id, email, added_by)
VALUES ('uuid-del-usuario', 'email@ejemplo.com', 'system');
```

### Error: "Row Level Security" en Supabase
**Causa:** RLS no está habilitado
**Solución:**
```sql
ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;
```

### Error: "Email de confirmación no llega"
**Causa:** Configuración de email incorrecta
**Solución:**
1. Verificar Site URL en Supabase Auth Settings
2. Verificar que redirect URLs incluye el dominio

### No puedo hacer login
**Causa:** Email no confirmado o credenciales incorrectas
**Solución:**
1. Verificar que el email está confirmado en `auth.users`
2. Revisar consola del navegador para errores
3. Verificar rate limiting (puede estar bloqueado temporalmente)

### CSP bloqueando scripts
**Causa:** Scripts de CDN no incluidos en CSP
**Solución:** Agregar dominios necesarios a `script-src`

---

## 📚 RECURSOS

- [Documentación Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentación RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)
- [Resend (Emails)](https://resend.com/docs)

---

## 📝 CHANGELOG

### v2.2 (Marzo 2026)
- ✅ SQL de seguridad ejecutado exitosamente en Supabase
- ✅ Formulario de contacto de `about.html` integrado con módulo de validación
- ✅ Uso de constantes `SUPABASE_URL` y `SUPABASE_ANON_KEY` en lugar de hardcoded
- ✅ Validación y sanitización de inputs en formulario de contacto

### v2.1 (Marzo 2026)
- ✅ CSP Headers agregados a todos los HTMLs de producción
- ✅ Archivo `reset-password.html` creado con validación de seguridad
- ✅ Bug corregido en `security.sql` (línea 52)
- ✅ Documentación actualizada con estado actual

### v2.0 (Marzo 2026)
- ✅ API Keys completamente regeneradas
- ✅ Políticas RLS consolidadas en un solo archivo
- ✅ Edge Function de contacto con rate limiting
- ✅ Sistema de validación y sanitización completo
- ✅ CSP headers documentados
- ✅ Documentación unificada

### v1.0 (Anterior)
- Sistema inicial con credenciales hardcodeadas
- Políticas RLS permisivas (eliminadas)
- Sin rate limiting

---

**Mantenimiento:** Revisar este documento al hacer cambios significativos en la arquitectura de seguridad.
