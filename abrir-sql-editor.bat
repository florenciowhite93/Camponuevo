@echo off
chcp 65001 >nul
title Camponuevo - Abrir SQL Editor

echo.
echo ================================================
echo    ABRIR SUPABASE SQL EDITOR
echo ================================================
echo.
echo Se va a abrir Supabase Dashboard.
echo.
echo PASOS:
echo 1. Ve a SQL Editor
echo 2. Copia el contenido de: supabase\sql\security.sql
echo 3. Click en RUN
echo.
echo.

REM Abrir el navegador
start https://supabase.com/dashboard/project/itlczokcdxgzgqrortpm/sql/new

echo Presiona cualquier tecla para salir...
pause >nul
