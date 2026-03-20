@echo off
REM =====================================================
REM Script para ejecutar SQL de seguridad en Supabase
REM =====================================================
REM INSTRUCCIONES:
REM 1. Obtén tu Service Role Key de Supabase Dashboard
REM 2. Ejecuta este script y pega la key cuando lo pida
REM =====================================================

echo.
echo ============================================
echo   EJECUTAR SQL DE SEGURIDAD - SUPABASE
echo ============================================
echo.

set /p SUPABASE_URL="Ingresa la URL del proyecto (ej: https://xxx.supabase.co): "
set /p SERVICE_KEY="Ingresa la Service Role Key: "

echo.
echo Ejecutando security.sql...
echo.

REM Leer el archivo SQL
set SQL_CONTENT=
for /f usebackq delims^=^ eol^= %%A in ("supabase\sql\security.sql") do (
    set "line=%%A"
    set "SQL_CONTENT=!SQL_CONTENT!!line! "
)

REM Enviar a Supabase API
curl -X POST ^
    "https://%SUPABASE_URL%/rest/v1/rpc/exec_sql" ^
    -H "apikey: %SERVICE_KEY%" ^
    -H "Authorization: Bearer %SERVICE_KEY%" ^
    -H "Content-Type: application/json" ^
    -d "{\"sql\": \"!SQL_CONTENT!\"}"

echo.
echo.
echo ============================================
echo   COMPLETADO
echo ============================================
echo.
echo Si hubo errores, ejecuta manualmente en:
echo Supabase Dashboard ^> SQL Editor ^> security.sql
echo.

pause
