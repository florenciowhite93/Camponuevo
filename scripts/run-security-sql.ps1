# =====================================================
# Script para ejecutar SQL de seguridad en Supabase
# =====================================================
# INSTRUCCIONES:
# 1. Obtén tu Service Role Key de Supabase Dashboard
# 2. Ejecuta: .\run-security-sql.ps1
# =====================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$SupabaseUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$ServiceKey
)

Write-Host ""
Write-Host "============================================"
Write-Host "  EJECUTAR SQL DE SEGURIDAD - SUPABASE"
Write-Host "============================================"
Write-Host ""

# Leer el archivo SQL
$sqlContent = Get-Content "supabase\sql\security.sql" -Raw

# Reemplazar saltos de linea para JSON
$sqlContent = $sqlContent -replace "`r`n", " " -replace "`n", " "
$sqlContent = $sqlContent -replace '"', '\"'

Write-Host "Enviando SQL a Supabase..."
Write-Host ""

# Enviar a Supabase REST API usando el endpoint de postgres
$headers = @{
    "apikey" = $ServiceKey
    "Authorization" = "Bearer $ServiceKey"
    "Content-Type" = "application/json"
    " Prefer" = "return=minimal"
}

$body = @{
    "query" = $sqlContent
} | ConvertTo-Json

try {
    # Usar el endpoint de postgres directamente
    $response = Invoke-RestMethod -Uri "$SupabaseUrl/rest/v1/" -Method POST -Headers $headers -Body $body -ContentType "application/json" 2>&1
    
    Write-Host "Response: $response"
    Write-Host ""
    Write-Host "SQL ejecutado exitosamente!" -ForegroundColor Green
} catch {
    # Si falla, intentar método alternativo
    Write-Host "Intentando método alternativo..." -ForegroundColor Yellow
    
    # Crear una sesión de postgres via supabase
    $pgUrl = "https://$($SupabaseUrl -replace 'https://', '')/pg"
    
    Write-Host ""
    Write-Host "============================================"
    Write-Host "  METODO MANUAL (RECOMENDADO)"
    Write-Host "============================================"
    Write-Host ""
    Write-Host "1. Ve a: https://supabase.com/dashboard"
    Write-Host "2. Selecciona tu proyecto"
    Write-Host "3. Ve a SQL Editor"
    Write-Host "4. Copia y pega el contenido de: supabase\sql\security.sql"
    Write-Host "5. Click en 'Run'"
    Write-Host ""
}

Write-Host ""
Write-Host "============================================"
Write-Host "  VERIFICACION"
Write-Host "============================================"
Write-Host ""
Write-Host "Para verificar, ejecuta este query en SQL Editor:"
Write-Host ""
Write-Host 'SELECT tablename, policyname FROM pg_policies WHERE scheman = '\''public'\'' ORDER BY tablename;'
Write-Host ""

pause
