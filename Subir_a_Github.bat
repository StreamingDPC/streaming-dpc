@echo off
color 0A
title Subir Cambios a GitHub
echo =========================================
echo    SUBIENDO CAMBIOS A GITHUB...
echo =========================================
echo.

REM Agregar los cambios al sistema
echo [1/3] Agregando archivos cambiados...
git add .

REM Hacer commit usando la fecha y hora actuales como nombre
echo.
echo [2/3] Guardando el estado (Commit)...
set fecha=%date% %time:~0,8%
git commit -m "Auto-commit de cambios (Streaming DPC): %fecha%"

REM Subir los cambios
echo.
echo [3/3] Subiendo los archivos a GitHub...
git push

echo.
echo =========================================
echo   ¡PROCESO TERMINADO CON EXITO!
echo =========================================
echo.
pause
