@echo off
chcp 65001 > nul
title Sincronizador de Estrenos Streaming DPC
echo ================================================================
echo   🎬 Sincronizador de Estrenos y Banners - Streaming DPC
echo ================================================================
echo.

set /p DIA="Ingresa el número del día a sincronizar (o presiona ENTER para todo el mes): "

if "%DIA%"=="" (
    echo.
    echo 🔄 Sincronizando todos los días del mes...
    node sync-video.js --all
) else (
    echo.
    echo 🔄 Sincronizando día %DIA%...
    node sync-video.js %DIA%
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Ocurrió un error en la sincronización. Revisa el mensaje arriba.
    echo.
    pause
    exit /b 1
)

echo.
echo 📤 Subiendo videos y banners a GitHub y Render...
git add videos/ banners-month.json sync-video.js
git commit -m "chore: actualizar videos y banners de estrenos"
git push all main

echo.
echo ================================================================
echo   ✅ ¡TODO LISTO! 
echo   Los videos ya se subieron a la nube (Render).
echo   Ahora ve a tu panel Admin (pestaña Banners) y presiona:
echo   👉 'Cargar Banners de Noviembre'
echo ================================================================
echo.
pause
