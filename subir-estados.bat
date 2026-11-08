@echo off
title Publicador de Estados de WhatsApp - Streaming DPC
echo ================================================================
echo    Publicador Automatico a Estados de WhatsApp - Streaming DPC
echo ================================================================
echo.
echo  1. Subir solo 1 video de prueba (el estreno mas reciente)
echo  2. Subir los ultimos 10 estrenos (Recomendado)
echo  3. Ingresar cantidad personalizada
echo.
set /p OPCION="Selecciona una opcion (1, 2 o 3): "

if "%OPCION%"=="1" (
    echo.
    echo Subiendo 1 video de prueba a tus Estados de WhatsApp...
    node post-status-cli.js 1
    goto FIN
)

if "%OPCION%"=="3" (
    echo.
    set /p CANTIDAD="Cuantos videos deseas subir a tus estados?: "
    echo Subiendo %CANTIDAD% videos a tus Estados de WhatsApp...
    node post-status-cli.js %CANTIDAD%
    goto FIN
)

echo.
echo Subiendo los ultimos 10 estrenos a tus Estados de WhatsApp...
node post-status-cli.js 10

:FIN
echo.
echo ================================================================
echo    Proceso enviado al Robot. Revisa la ventana de tu bot
echo    o abre WhatsApp en tu celular para ver los estados.
echo ================================================================
echo.
pause
