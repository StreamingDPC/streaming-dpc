@echo off
title Publicador de Estados de WhatsApp - Streaming DPC
echo ================================================================
echo    Publicador Automatico a Estados de WhatsApp - Streaming DPC
echo ================================================================
echo.
echo  1. Subir TODOS los videos disponibles (De mayor a menor dia)
echo  2. Subir los videos de UN DIA especifico (ej: Dia 10)
echo  3. Subir los videos de un RANGO de dias (ej: del 2 al 12)
echo  4. Subir solo los ultimos N videos (ej: 10)
echo  5. Subir 1 video de prueba (el mas reciente)
echo.
set /p OPCION="Selecciona una opcion (1, 2, 3, 4 o 5): "

if "%OPCION%"=="1" (
    echo.
    echo Subiendo TODOS los videos a tus Estados de WhatsApp...
    node post-status-cli.js --all
    goto FIN
)

if "%OPCION%"=="2" (
    echo.
    set /p DIA_ESTADO="Ingresa el numero del dia a publicar en Estados (ej: 10): "
    echo Subiendo los videos del dia %DIA_ESTADO%...
    node post-status-cli.js --day %DIA_ESTADO%
    goto FIN
)

if "%OPCION%"=="3" (
    echo.
    echo Puedes escribir el rango como: 2-12 (o del 2 al 12)
    set /p RANGO_ESTADO="Ingresa el rango de dias a publicar (ej: 2-12): "
    echo Subiendo videos en el rango %RANGO_ESTADO%...
    node post-status-cli.js --range "%RANGO_ESTADO%"
    goto FIN
)

if "%OPCION%"=="4" (
    echo.
    set /p CANTIDAD="Cuantos videos deseas subir a tus estados? (ej: 10): "
    echo Subiendo %CANTIDAD% videos a tus Estados de WhatsApp...
    node post-status-cli.js %CANTIDAD%
    goto FIN
)

if "%OPCION%"=="5" (
    echo.
    echo Subiendo 1 video de prueba a tus Estados de WhatsApp...
    node post-status-cli.js 1
    goto FIN
)

echo Opcion invalida.

:FIN
echo.
echo ================================================================
echo    Proceso enviado al Robot. Revisa la ventana de tu bot
echo    o abre WhatsApp en tu celular para ver los estados.
echo ================================================================
echo.
pause
