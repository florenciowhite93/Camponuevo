# Scripts de Implementación de Seguridad

Este directorio contiene scripts para facilitar la implementación de seguridad en Camponuevo.

## Scripts Disponibles

### 1. `setup-security.ps1` - Setup Completo (RECOMENDADO)

Script principal que guía paso a paso toda la implementación.

```powershell
.\setup-security.ps1
```

**Parámetros opcionales:**
- `-SupabaseUrl` - URL del proyecto Supabase
- `-SupabaseAnonKey` - ANON key pública
- `-SupabaseServiceKey` - SERVICE ROLE key (secreta)
- `-ResendApiKey` - API key de Resend para emails
- `-ToEmail` - Email destino para notificaciones
- `-VercelToken` - Token de Vercel

**Ejemplo:**
```powershell
.\setup-security.ps1 -SupabaseAnonKey "eyJ..." -SupabaseServiceKey "eyJ..."
```

### 2. `run-sql.js` - Ejecutar SQL en Supabase

Ejecuta el archivo `security.sql` en tu base de datos de Supabase.

```bash
node run-sql.js <SUPABASE_URL> <SERVICE_ROLE_KEY>
```

**Ejemplo:**
```bash
node run-sql.js https://itlczokcdxgzgqrortpm.supabase.co eyJhbGci...
```

### 3. `deploy-vercel.ps1` - Deploy en Vercel

Script para desplegar el proyecto en Vercel.

```powershell
.\deploy-vercel.ps1
```

**Parámetros:**
- `-VercelToken` - Token de Vercel (opcional si ya estás logueado)
- `-Production` - Desplegar en producción

### 4. `run-security-sql.ps1` - Script PowerShell para SQL

Versión alternativa en PowerShell para ejecutar el SQL.

```powershell
.\run-security-sql.ps1 -SupabaseUrl "https://xxx.supabase.co" -ServiceKey "eyJ..."
```

## Ejecución Manual (Alternativa)

Si los scripts no funcionan, puedes hacer lo siguiente manualmente:

### Ejecutar SQL

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y pega el contenido de `../supabase/sql/security.sql`
5. Click en **Run**

### Desplegar Edge Function

```bash
cd ../supabase
supabase login
supabase functions deploy contact-form
supabase secrets set RESEND_API_KEY=tu_key
supabase secrets set TO_EMAIL=info@camponuevo.com.ar
```

### Deploy en Vercel

```bash
# Login
vercel login

# Deploy preview
vercel

# Deploy producción
vercel --prod
```

## Requisitos

- Node.js 18+ (para run-sql.js)
- PowerShell 5+ (para scripts .ps1)
- Vercel CLI (para deploy)
- Cuenta en Supabase
- Cuenta en Vercel

## Notas

- La `SERVICE_ROLE_KEY` es **secreta** - nunca la compartas
- Los scripts crean un archivo `.env` con las credenciales
- Asegúrate de que `.env` esté en `.gitignore`
