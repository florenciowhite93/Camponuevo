@echo off
chcp 65001 >nul
title Camponuevo - SQL de Correccion

echo.
echo ================================================
echo    SQL DE CORRECCION - CAMPONUECO
echo ================================================
echo.
echo Este script corrige las politicas RLS para:
echo - Tabla users
echo - Tabla admins
echo.
echo.

REM Abrir el navegador con el SQL Editor
start https://supabase.com/dashboard/project/itlczokcdxgzgqrortpm/sql/new

echo Se abrio Supabase Dashboard.
echo.
echo INSTRUCCIONES:
echo 1. Ve a SQL Editor
echo 2. Copia y pega el contenido de:
echo    supabase\sql\fix-users-policy.sql
echo 3. Click en RUN
echo.
echo NOTA: Si ya ejecutaste security.sql, usa fix-users-policy.sql
echo.

pause
