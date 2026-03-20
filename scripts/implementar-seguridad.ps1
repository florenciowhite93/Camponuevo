# =====================================================
# IMPLEMENTACION DE SEGURIDAD - CAMPONUEVO
# =====================================================

param(
    [string]$SupabaseUrl = "https://itlczokcdxgzgqrortpm.supabase.co",
    [string]$SupabaseAnonKey = "",
    [string]$SupabaseServiceKey = "",
    [string]$ResendApiKey = "",
    [string]$ToEmail = "info@camponuevo.com.ar"
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   IMPLEMENTACION DE SEGURIDAD - CAMPONUEVO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Solicitar ANON KEY
if ([string]::IsNullOrEmpty($SupabaseAnonKey)) {
    Write-Host "PASO 1: Ingresa tu ANON KEY de Supabase" -ForegroundColor Yellow
    Write-Host "   Obtener en: https://supabase.com/dashboard/project/_/settings/api"
    $SupabaseAnonKey = Read-Host "   ANON KEY (pega y presiona Enter)"
}

# Paso 2: Solicitar SERVICE ROLE KEY
if ([string]::IsNullOrEmpty($SupabaseServiceKey)) {
    Write-Host ""
    Write-Host "PASO 2: Ingresa tu SERVICE ROLE KEY de Supabase" -ForegroundColor Yellow
    Write-Host "   IMPORTANTE: Esta es secreta, mantenla segura!"
    Write-Host "   Obtener en: https://supabase.com/dashboard/project/_/settings/api"
    $SupabaseServiceKey = Read-Host "   SERVICE ROLE KEY (pega y presiona Enter)"
}

# Paso 3: Solicitar RESEND API KEY
if ([string]::IsNullOrEmpty($ResendApiKey)) {
    Write-Host ""
    Write-Host "PASO 3: Ingresa tu RESEND API KEY (opcional para emails)" -ForegroundColor Yellow
    Write-Host "   Obtener en: https://resend.com/api-keys (o presiona Enter para omitir)"
    $ResendApiKey = Read-Host "   RESEND API KEY"
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   EJECUTANDO CONFIGURACIONES..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Funcion para escribir con colores
function Write-Status {
    param([string]$msg, [string]$type = "info")
    switch ($type) {
        "success" { Write-Host "[OK] $msg" -ForegroundColor Green }
        "warning" { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
        "error" { Write-Host "[ERROR] $msg" -ForegroundColor Red }
        default { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
    }
}

# 1. Actualizar supabase-config.js
Write-Status "Actualizando js/supabase-config.js..."
$configFile = "js\supabase-config.js"
if (Test-Path $configFile) {
    $content = Get-Content $configFile -Raw
    $content = $content -replace "const SUPABASE_URL = '[^']*'", "const SUPABASE_URL = '$SupabaseUrl'"
    $content = $content -replace "const SUPABASE_ANON_KEY = '[^']*'", "const SUPABASE_ANON_KEY = '$SupabaseAnonKey'"
    Set-Content -Path $configFile -Value $content -NoNewline
    Write-Status "supabase-config.js actualizado" "success"
} else {
    Write-Status "supabase-config.js no encontrado" "error"
}

# 2. Actualizar data.js (por si acaso)
Write-Status "Verificando js/data.js..."
$dataFile = "js\data.js"
if (Test-Path $dataFile) {
    $content = Get-Content $dataFile -Raw
    if ($content -match "supabase\.createClient") {
        Write-Status "data.js ya tiene configuracion de Supabase" "success"
    }
}

# 3. Crear archivo .env
Write-Status "Creando archivo .env..."
$envContent = "SUPABASE_URL=$SupabaseUrl`nSUPABASE_ANON_KEY=$SupabaseAnonKey`nSUPABASE_SERVICE_KEY=$SupabaseServiceKey`nRESEND_API_KEY=$ResendApiKey`nTO_EMAIL=$ToEmail"
Set-Content -Path ".env" -Value $envContent -Encoding UTF8
Write-Status ".env creado" "success"

# 4. Crear archivo .env.local para Vercel
Write-Status "Creando archivo .env.local para Vercel..."
$envLocalContent = "SUPABASE_URL=$SupabaseUrl`nSUPABASE_ANON_KEY=$SupabaseAnonKey"
Set-Content -Path ".env.local" -Value $envLocalContent -Encoding UTF8
Write-Status ".env.local creado" "success"

# 5. Verificar SQL
Write-Status "Verificando supabase/sql/security.sql..."
$sqlFile = "supabase\sql\security.sql"
if (Test-Path $sqlFile) {
    Write-Status "security.sql encontrado" "success"
} else {
    Write-Status "security.sql no encontrado" "error"
}

# 6. Verificar Edge Function
Write-Status "Verificando Edge Function..."
$edgeFile = "supabase\functions\contact-form\index.ts"
if (Test-Path $edgeFile) {
    Write-Status "Edge Function de contacto encontrada" "success"
} else {
    Write-Status "Edge Function no encontrada" "warning"
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   CONFIGURACIONES COMPLETADAS" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 7. Mostrar resumen de proximos pasos
Write-Host "PROXIMOS PASOS MANUALES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. EJECUTAR SQL EN SUPABASE:" -ForegroundColor White
Write-Host "   - Ve a: https://supabase.com/dashboard/project/_/sql"
Write-Host "   - Copia y pega el contenido de: supabase\sql\security.sql"
Write-Host "   - Click en 'Run'"
Write-Host ""

Write-Host "2. DESPLEGAR EDGE FUNCTION (opcional):" -ForegroundColor White
Write-Host "   cd supabase"
Write-Host "   npx supabase login"
Write-Host "   npx supabase functions deploy contact-form"
Write-Host "   npx supabase secrets set RESEND_API_KEY=$ResendApiKey"
Write-Host ""

Write-Host "3. DEPLOY EN VERCEL:" -ForegroundColor White
Write-Host "   vercel login"
Write-Host "   vercel --prod"
Write-Host ""

Write-Host "4. CONFIGURAR VARIABLES EN VERCEL:" -ForegroundColor White
Write-Host "   En Vercel Dashboard > Settings > Environment Variables:"
Write-Host "   - SUPABASE_URL = $SupabaseUrl"
Write-Host "   - SUPABASE_ANON_KEY = (tu anon key)"
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Preguntar si quiere abrir el dashboard
$openDashboard = Read-Host "Abrir Supabase Dashboard? (s/n)"
if ($openDashboard -eq "s") {
    Start-Process "https://supabase.com/dashboard"
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
