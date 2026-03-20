# Abrir Supabase SQL Editor con el archivo SQL cargado
$sqlFile = "..\supabase\sql\security.sql"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   ABRIENDO SUPABASE SQL EDITOR" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que existe el archivo SQL
if (-not (Test-Path $sqlFile)) {
    Write-Host "[ERROR] No se encontro el archivo: $sqlFile" -ForegroundColor Red
    pause
    exit
}

# Mostrar el contenido del SQL (primeros 50 caracteres)
$sqlContent = Get-Content $sqlFile -Raw
Write-Host "Archivo SQL encontrado: $sqlContent.Length caracteres"
Write-Host ""

# Abrir el SQL Editor de Supabase
Write-Host "Abriendo Supabase Dashboard..." -ForegroundColor Yellow
Start-Process "https://supabase.com/dashboard/project/itlczokcdxgzgqrortpm/sql/new"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   INSTRUCCIONES" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Se abrio Supabase Dashboard en tu navegador" -ForegroundColor White
Write-Host "2. Ve a 'SQL Editor' (si no esta ahi)" -ForegroundColor White
Write-Host "3. Copia y pega el contenido de:" -ForegroundColor White
Write-Host "   supabase\sql\security.sql" -ForegroundColor Green
Write-Host "4. Click en 'Run' o presiona Ctrl+Enter" -ForegroundColor White
Write-Host ""
Write-Host "El archivo tiene $sqlContent.Length caracteres de SQL"
Write-Host ""

pause
