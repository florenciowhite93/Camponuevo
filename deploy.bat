@echo off
REM Script para desplegar cambios a GitHub automáticamente

REM Agregar todos los cambios al staging area
git add .

REM Verificar si hay cambios para commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo No hay cambios para commitar.
    pause
    exit /b 0
)

REM Pedir mensaje de commit al usuario
set /p commit_message="Ingresa el mensaje del commit (o presiona Enter para usar mensaje por defecto): "

REM Si el mensaje está vacío, usar mensaje por defecto
if "%commit_message%"=="" (
    set commit_message="Update: Cambios automatizados"
)

REM Hacer commit
git commit -m "%commit_message%"

REM Subir cambios a GitHub
git push

echo.
echo Despliegue completado exitosamente.
pause