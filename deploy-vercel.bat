@echo off
chcp 65001 >nul
title Camponuevo - Deploy en Vercel

echo.
echo ================================================
echo    DEPLOY EN VERCEL - CAMPONUECO
echo ================================================
echo.

cd /d "%~dp0"

echo Verificando login en Vercel...
vercel whoami >nul 2>&1

if errorlevel 1 (
    echo.
    echo No estas logueado en Vercel.
    echo.
    echo 1. Se va a abrir el navegador para hacer login
    echo 2. Inicia sesion con tu cuenta de Vercel
    echo 3. Vuelve aqui y presiona una tecla
    echo.
    pause
    
    start https://vercel.com/login
    
    echo.
    echo Presiona una tecla cuando hayas iniciado sesion...
    pause >nul
    
    vercel login
)

echo.
echo.
echo ================================================
echo    INICIANDO DEPLOY
echo ================================================
echo.

echo 1. Verificando archivos...
echo.

if exist "index.html" (
    echo    [OK] index.html
) else (
    echo    [ERROR] index.html no encontrado
    pause
    exit /b 1
)

echo.
echo 2. Iniciando deploy en Vercel...
echo.

vercel --prod --yes

echo.
echo ================================================
echo    DEPLOY COMPLETADO
echo ================================================
echo.
echo Verifica tu sitio en: https://vercel.com/dashboard
echo.
echo IMPORTANTE: No olvides configurar las variables
echo de entorno en Vercel Dashboard:
echo   - SUPABASE_URL
echo   - SUPABASE_ANON_KEY
echo.
pause
