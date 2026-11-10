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

if "%OPCION%"=="1" goto OP_TODOS
if "%OPCION%"=="2" goto OP_DIA
if "%OPCION%"=="3" goto OP_RANGO
if "%OPCION%"=="4" goto OP_CANTIDAD
if "%OPCION%"=="5" goto OP_PRUEBA

echo Opcion invalida.
goto FIN

:OP_TODOS
echo.
echo Subiendo TODOS los videos a tus Estados de WhatsApp...
node post-status-cli.js --all
goto FIN

:OP_DIA
echo.
set /p DIA_ESTADO="Ingresa el numero del dia a publicar en Estados (ej: 10): "
if "%DIA_ESTADO%"=="" (
    echo No ingresaste ningun dia. Operacion cancelada.
    goto FIN
)
echo.
echo Subiendo los videos del dia %DIA_ESTADO%...
node post-status-cli.js --day %DIA_ESTADO%
goto FIN

:OP_RANGO
echo.
echo Puedes escribir el rango como: 3-13 (o del 3 al 13)
set /p RANGO_ESTADO="Ingresa el rango de dias a publicar (ej: 3-13): "
if "%RANGO_ESTADO%"=="" (
    echo No ingresaste ningun rango. Operacion cancelada.
    goto FIN
)
echo.
echo Subiendo videos en el rango %RANGO_ESTADO%...
node post-status-cli.js --range "%RANGO_ESTADO%"
goto FIN

:OP_CANTIDAD
echo.
set /p CANTIDAD="Cuantos videos deseas subir a tus estados? (ej: 10): "
if "%CANTIDAD%"=="" (
    echo No ingresaste ninguna cantidad. Operacion cancelada.
    goto FIN
)
echo.
echo Subiendo %CANTIDAD% videos a tus Estados de WhatsApp...
node post-status-cli.js %CANTIDAD%
goto FIN

:OP_PRUEBA
echo.
echo Subiendo 1 video de prueba a tus Estados de WhatsApp...
node post-status-cli.js 1
goto FIN

:FIN
echo.
echo ================================================================
echo    Proceso enviado al Robot. Revisa la ventana de tu bot
echo    o abre WhatsApp en tu celular para ver los estados.
echo ================================================================
echo.
pause
