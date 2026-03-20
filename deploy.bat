@echo off
REM Script seguro para desplegar Camponuevo a Vercel

REM Ir al directorio del proyecto
cd /d "%~dp0"

REM Verificar que no haya secrets en el código
echo Verificando posibles secrets...
findstr /S /M /C:"eyJ" *.js *.html *.md 2>nul >nul
if %errorlevel% equ 0 (
    echo ERROR: Posibles API keys detectadas en archivos.
    echo Revisa los archivos antes de continuar.
    pause
    exit /b 1
)

REM Verificar que no haya archivos temporales
if exist "temp_*.html" (
    echo WARNING: Archivos temporales detectados. Continuando...
)

REM Agregar solo archivos necesarios (ignorando node_modules y archivos sensibles)
git add index.html catalog.html product.html order.html user.html admin.html about.html
git add js/ components/ css/ img/ svg/ public/
git add package.json vercel.json .gitignore

REM Verificar si hay cambios
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo No hay cambios para commitar.
    pause
    exit /b 0
)

REM Pedir mensaje de commit
set /p commit_message="Mensaje del commit: "

if "%commit_message%"=="" (
    set commit_message="Update: Mejoras de seguridad"
)

echo.
echo Commiteando cambios...
git commit -m "%commit_message%"

echo.
echo Subiendo a GitHub...
git push

echo.
echo Despliegue iniciado en Vercel.
echo Verifica el deployment en: https://vercel.com/dashboard
pause
