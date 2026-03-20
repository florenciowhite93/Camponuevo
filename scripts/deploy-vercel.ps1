# =====================================================
# Script para desplegar en Vercel
# =====================================================
# INSTRUCCIONES:
# 1. Login en Vercel: vercel login
# 2. Ejecuta: .\deploy-vercel.ps1
# =====================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$VercelToken,
    
    [Parameter(Mandatory=$false)]
    [switch]$Production
)

Write-Host ""
Write-Host "============================================"
Write-Host "  DEPLOY EN VERCEL"
Write-Host "============================================"
Write-Host ""

# Verificar si está logueado
Write-Host "Verificando credenciales de Vercel..."
$whoami = vercel whoami 2>&1

if ($whoami -match "Error|No existing credentials") {
    Write-Host ""
    Write-Host "No estás logueado en Vercel CLI." -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones:"
    Write-Host "1. Ejecuta: vercel login"
    Write-Host "2. O proporciona un token: .\deploy-vercel.ps1 -VercelToken 'tu-token'"
    Write-Host ""
    
    # Crear enlace para obtener token
    Write-Host "Para obtener un token:"
    Write-Host "1. Ve a: https://vercel.com/account/tokens"
    Write-Host "2. Crea un nuevo token con nombre 'Camponuevo'"
    Write-Host "3. Copia el token y pégalo aquí"
    Write-Host ""
    
    $token = Read-Host "Ingresa tu Vercel Token (o Enter para cancelar)"
    
    if ([string]::IsNullOrEmpty($token)) {
        Write-Host "Deploy cancelado." -ForegroundColor Yellow
        exit
    }
    
    $VercelToken = $token
}

Write-Host ""
Write-Host "Verificando variables de entorno..."
Write-Host ""

# Verificar si existen las variables en .env
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "Archivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host "Creando archivo .env.example..."
}

Write-Host ""
Write-Host "============================================"
Write-Host "  PREPARANDO DEPLOY"
Write-Host "============================================"
Write-Host ""
Write-Host "1. Verificando archivos..."
Write-Host ""

# Verificar que los archivos importantes existan
$requiredFiles = @(
    "index.html",
    "admin.html",
    "catalog.html",
    "order.html",
    "user.html",
    "about.html",
    "js\supabase-config.js",
    "js\auth.js",
    "js\validation.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "ADVERTENCIA: Faltan archivos requeridos!" -ForegroundColor Red
    Write-Host "El deploy puede fallar."
    Write-Host ""
    $continue = Read-Host "Continuar de todas formas? (s/n)"
    if ($continue -ne "s") {
        exit
    }
}

Write-Host ""
Write-Host "2. Verificando Edge Functions..."
if (Test-Path "supabase\functions\contact-form\index.ts") {
    Write-Host "  [OK] Edge Function de contacto encontrada" -ForegroundColor Green
} else {
    Write-Host "  [MISSING] Edge Function no encontrada" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. Verificando CSP en archivos HTML..."
$htmlFiles = Get-ChildItem "*.html" -File
$cspCount = 0
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "Content-Security-Policy") {
        $cspCount++
    }
}
Write-Host "  Archivos con CSP: $cspCount / $($htmlFiles.Count)" -ForegroundColor $(if ($cspCount -eq $htmlFiles.Count) { "Green" } else { "Yellow" })

Write-Host ""
Write-Host "============================================"
Write-Host "  INICIANDO DEPLOY"
Write-Host "============================================"
Write-Host ""

# Ir al directorio del proyecto
Set-Location $PSScriptRoot

# Preparar comando de deploy
$deployCmd = "vercel"
if ($Production) {
    $deployCmd += " --prod"
}
if ($VercelToken) {
    $deployCmd += " --token $VercelToken"
}
$deployCmd += " --yes"

Write-Host "Comando: $deployCmd"
Write-Host ""

# Ejecutar deploy
Invoke-Expression $deployCmd

Write-Host ""
Write-Host "============================================"
Write-Host "  POST-DEPLOY"
Write-Host "============================================"
Write-Host ""
Write-Host "1. Verifica el deploy en: https://vercel.com/dashboard"
Write-Host "2. Prueba las siguientes funcionalidades:"
Write-Host "   - Registro/Login de usuarios"
Write-Host "   - Navegación del catálogo"
Write-Host "   - Formulario de contacto"
Write-Host "   - Panel de administración (solo admins)"
Write-Host ""
Write-Host "3. Configura las variables de entorno en Vercel:"
Write-Host "   - SUPABASE_URL"
Write-Host "   - SUPABASE_ANON_KEY"
Write-Host ""

pause
