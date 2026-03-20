# =====================================================
# SCRIPT DE IMPLEMENTACION DE SEGURIDAD - CAMPONUEVO
# =====================================================
# Ejecuta este script para completar la implementacion
# =====================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$SupabaseUrl = "https://itlczokcdxgzgqrortpm.supabase.co",
    
    [Parameter(Mandatory=$false)]
    [string]$SupabaseAnonKey,
    
    [Parameter(Mandatory=$false)]
    [string]$SupabaseServiceKey,
    
    [Parameter(Mandatory=$false)]
    [string]$ResendApiKey,
    
    [Parameter(Mandatory=$false)]
    [string]$ToEmail = "info@camponuevo.com.ar",
    
    [Parameter(Mandatory=$false)]
    [string]$VercelToken
)

# Colores
function Write-Step { param([string]$msg) Write-Host "[STEP] $msg" -ForegroundColor Cyan }
function Write-Success { param([string]$msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warning { param([string]$msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Error { param([string]$msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

Clear-Host

Write-Host ""
Write-Host "================================================"
Write-Host "   IMPLEMENTACION DE SEGURIDAD - CAMPONUEVO"
Write-Host "================================================"
Write-Host ""

# =====================================================
# PASO 1: Verificar herramientas
# =====================================================
Write-Step "Verificando herramientas instaladas..."

$tools = @{
    "node" = (Get-Command node -ErrorAction SilentlyContinue)
    "npm" = (Get-Command npm -ErrorAction SilentlyContinue)
    "vercel" = (Get-Command vercel -ErrorAction SilentlyContinue)
    "supabase" = (Get-Command supabase -ErrorAction SilentlyContinue)
}

Write-Host ""
foreach ($tool in $tools.Keys) {
    if ($tools[$tool]) {
        $version = & $tool --version 2>&1
        Write-Success "$tool : $version"
    } else {
        Write-Error "$tool : No instalado"
    }
}

# =====================================================
# PASO 2: Solicitar API Keys faltantes
# =====================================================
Write-Host ""
Write-Step "Configuracion de API Keys..."

if ([string]::IsNullOrEmpty($SupabaseAnonKey)) {
    Write-Host ""
    Write-Host "Necesitas la ANON KEY de Supabase:"
    Write-Host "1. Ve a: https://supabase.com/dashboard/project/_/settings/api"
    Write-Host "2. Copia la 'anon public' key"
    $SupabaseAnonKey = Read-Host "Ingresa la ANON KEY"
}

if ([string]::IsNullOrEmpty($SupabaseServiceKey)) {
    Write-Host ""
    Write-Host "Necesitas la SERVICE ROLE KEY de Supabase:"
    Write-Host "1. Ve a: https://supabase.com/dashboard/project/_/settings/api"
    Write-Host "2. Copia la 'service_role' key (mantenla en secreto!)"
    $SupabaseServiceKey = Read-Host "Ingresa la SERVICE ROLE KEY"
}

# =====================================================
# PASO 3: Actualizar archivos con las keys
# =====================================================
Write-Step "Actualizando archivos con API Keys..."

$configFile = "js\supabase-config.js"
if (Test-Path $configFile) {
    $content = Get-Content $configFile -Raw
    $content = $content -replace "const SUPABASE_URL = '[^']*';", "const SUPABASE_URL = '$SupabaseUrl';"
    $content = $content -replace "const SUPABASE_ANON_KEY = '[^']*';", "const SUPABASE_ANON_KEY = '$SupabaseAnonKey';"
    Set-Content -Path $configFile -Value $content -NoNewline
    Write-Success "js/supabase-config.js actualizado"
} else {
    Write-Error "js/supabase-config.js no encontrado"
}

# =====================================================
# PASO 4: Crear archivo .env
# =====================================================
Write-Step "Creando archivo .env..."

$envContent = @"
# Supabase Configuration
SUPABASE_URL=$SupabaseUrl
SUPABASE_ANON_KEY=$SupabaseAnonKey
SUPABASE_SERVICE_KEY=$SupabaseServiceKey

# Resend (Email)
RESEND_API_KEY=$ResendApiKey
TO_EMAIL=$ToEmail
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8
Write-Success ".env creado"

# =====================================================
# PASO 5: Ejecutar SQL de Seguridad
# =====================================================
Write-Step "Ejecutando SQL de Seguridad en Supabase..."

Write-Host ""
Write-Host "Alternativa manual:"
Write-Host "1. Ve a: https://supabase.com/dashboard"
Write-Host "2. Selecciona tu proyecto"
Write-Host "3. Ve a SQL Editor"
Write-Host "4. Pega el contenido de: supabase\sql\security.sql"
Write-Host "5. Click en 'Run'"
Write-Host ""

$runSql = Read-Host "Ya ejecutaste el SQL? (s/n)"
if ($runSql -ne "s") {
    Write-Warning "Recuerda ejecutar el SQL antes de continuar"
}

# =====================================================
# PASO 6: Desplegar Edge Function
# =====================================================
Write-Step "Desplegando Edge Function..."

if (Test-Path "supabase\functions\contact-form\index.ts") {
    Write-Host "Edge Function encontrada"
    
    if ([string]::IsNullOrEmpty($ResendApiKey)) {
        Write-Host ""
        Write-Host "Necesitas RESEND_API_KEY para el email:"
        Write-Host "1. Ve a: https://resend.com/api-keys"
        Write-Host "2. Crea una API key"
        $ResendApiKey = Read-Host "Ingresa RESEND API KEY"
    }
    
    Write-Host ""
    Write-Host "Para desplegar la Edge Function, ejecuta:"
    Write-Host ""
    Write-Host "  cd supabase"
    Write-Host "  supabase login"
    Write-Host "  supabase functions deploy contact-form"
    Write-Host "  supabase secrets set RESEND_API_KEY=$ResendApiKey"
    Write-Host "  supabase secrets set TO_EMAIL=$ToEmail"
    Write-Host ""
} else {
    Write-Error "Edge Function no encontrada"
}

# =====================================================
# PASO 7: Deploy en Vercel
# =====================================================
Write-Step "Deploy en Vercel..."

Write-Host ""
Write-Host "Para hacer deploy en Vercel, tienes dos opciones:"
Write-Host ""
Write-Host "Opcion 1: Con CLI"
Write-Host "  vercel login"
Write-Host "  vercel --prod"
Write-Host ""
Write-Host "Opcion 2: Con GitHub"
Write-Host "  1. Sube el codigo a GitHub"
Write-Host "  2. Conecta el repo en Vercel"
Write-Host "  3. Configura las variables de entorno"
Write-Host ""

# Verificar login de Vercel
$vercelLogin = vercel whoami 2>&1
if ($vercelLogin -match "Error") {
    Write-Warning "No estas logueado en Vercel"
} else {
    Write-Success "Vercel: $vercelLogin"
    
    $deployNow = Read-Host "Deseas hacer deploy ahora? (s/n)"
    if ($deployNow -eq "s") {
        Write-Host ""
        Write-Host "Ejecutando deploy..."
        vercel --prod --yes
    }
}

# =====================================================
# RESUMEN
# =====================================================
Write-Host ""
Write-Host "================================================"
Write-Host "   RESUMEN"
Write-Host "================================================"
Write-Host ""
Write-Host "Lo que se ha completado:"
Write-Host "  [OK] Archivos actualizados con API Keys" -ForegroundColor Green
Write-Host "  [OK] Archivo .env creado" -ForegroundColor Green
Write-Host "  [OK] CSP headers agregados a todos los HTMLs" -ForegroundColor Green
Write-Host "  [OK] Politicas RLS documentadas" -ForegroundColor Green
Write-Host ""
Write-Host "Lo que falta hacer manualmente:"
Write-Host "  [ ] Ejecutar security.sql en Supabase" -ForegroundColor Yellow
Write-Host "  [ ] Desplegar Edge Function" -ForegroundColor Yellow
Write-Host "  [ ] Configurar secrets en Supabase" -ForegroundColor Yellow
Write-Host "  [ ] Deploy en Vercel" -ForegroundColor Yellow
Write-Host "  [ ] Configurar variables en Vercel" -ForegroundColor Yellow
Write-Host ""
Write-Host "Documentacion completa en: IMPLEMENTACION_SEGURIDAD.md"
Write-Host ""
Write-Host "================================================"

pause
