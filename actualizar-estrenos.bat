@echo off
title Sincronizador de Estrenos Streaming DPC
echo ================================================================
echo    Sincronizador de Estrenos y Banners - Streaming DPC
echo ================================================================
echo.

set /p DIA="Ingresa el numero del dia a sincronizar (o ENTER para todo el mes): "

if "%DIA%"=="" (
    echo.
    echo Sincronizando todo el mes...
    node sync-video.js --all
) else (
    echo.
    echo Sincronizando dia %DIA%...
    node sync-video.js %DIA%
)

if errorlevel 1 (
    echo.
    echo Ocurrio un error en la sincronizacion.
    pause
    exit /b 1
)

echo.
echo Subiendo videos y banners a GitHub y Render...
git add videos/ banners-month.json sync-video.js actualizar-estrenos.bat
git commit -m "chore: actualizar videos y banners de estrenos" || echo No habia cambios nuevos para commit.
git push all main

echo.
echo ================================================================
echo    TODO LISTO!
echo    Los videos ya se subieron a la nube (Render).
echo    Ahora ve a tu panel Admin (pestana Banners) y presiona:
echo    "Cargar Banners de Noviembre"
echo ================================================================
echo.
pause
