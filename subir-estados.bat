@echo off
title Publicador de Estados de WhatsApp - Streaming DPC
echo ================================================================
echo    Publicador Automatico a Estados de WhatsApp - Streaming DPC
echo ================================================================
echo.
echo  Presiona ENTER para publicar del mes actual del calendario,
set /p MES_EST=" o escribe el mes que deseas publicar (ej: Diciembre): "
if "%MES_EST%"=="" (
    for /f "delims=" %%m in ('node -e "const m=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];console.log(m[new Date().getMonth()])"') do set MES_EST_ACTIVO=%%m
) else (
    for /f "delims=" %%m in ('node -e "const s=process.argv[1].trim();console.log(s.charAt(0).toUpperCase()+s.slice(1).toLowerCase())" "%MES_EST%"') do set MES_EST_ACTIVO=%%m
)
title Publicador Estados WhatsApp - Carpeta: %MES_EST_ACTIVO%
echo.
echo ================================================================
echo   ESTAS EN LA CARPETA DE ESTADOS: videos\%MES_EST_ACTIVO%\
echo ================================================================
echo  1. Subir TODOS los videos de %MES_EST_ACTIVO% (De mayor a menor dia)
echo  2. Subir los videos de UN DIA especifico de %MES_EST_ACTIVO% (ej: Dia 10)
echo  3. Subir los videos de un RANGO de dias de %MES_EST_ACTIVO% (ej: del 1 al 4)
echo  4. Subir solo los ultimos N videos de %MES_EST_ACTIVO% (ej: 10)
echo  5. Subir 1 video de prueba de %MES_EST_ACTIVO% (el mas reciente)
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
echo Subiendo TODOS los videos de %MES_EST_ACTIVO% a tus Estados de WhatsApp...
node post-status-cli.js --month %MES_EST_ACTIVO% --all
goto FIN

:OP_DIA
echo.
set /p DIA_ESTADO="Ingresa el numero del dia de %MES_EST_ACTIVO% a publicar en Estados (ej: 1): "
if "%DIA_ESTADO%"=="" (
    echo No ingresaste ningun dia. Operacion cancelada.
    goto FIN
)
echo.
echo Subiendo los videos del dia %DIA_ESTADO% de %MES_EST_ACTIVO%...
node post-status-cli.js --month %MES_EST_ACTIVO% --day %DIA_ESTADO%
goto FIN

:OP_RANGO
echo.
echo Puedes escribir el rango como: 1-4 (o del 1 al 4)
set /p RANGO_ESTADO="Ingresa el rango de dias de %MES_EST_ACTIVO% a publicar (ej: 1-4): "
if "%RANGO_ESTADO%"=="" (
    echo No ingresaste ningun rango. Operacion cancelada.
    goto FIN
)
echo.
echo Subiendo videos de %MES_EST_ACTIVO% en el rango %RANGO_ESTADO%...
node post-status-cli.js --month %MES_EST_ACTIVO% --range "%RANGO_ESTADO%"
goto FIN

:OP_CANTIDAD
echo.
set /p CANTIDAD="Cuantos videos de %MES_EST_ACTIVO% deseas subir a tus estados? (ej: 10): "
if "%CANTIDAD%"=="" (
    echo No ingresaste ninguna cantidad. Operacion cancelada.
    goto FIN
)
echo.
echo Subiendo %CANTIDAD% videos de %MES_EST_ACTIVO% a tus Estados de WhatsApp...
node post-status-cli.js --month %MES_EST_ACTIVO% %CANTIDAD%
goto FIN

:OP_PRUEBA
echo.
echo Subiendo 1 video de prueba de %MES_EST_ACTIVO% a tus Estados de WhatsApp...
node post-status-cli.js --month %MES_EST_ACTIVO% 1
goto FIN

:FIN
echo.
echo ================================================================
echo    Proceso enviado al Robot. Revisa la ventana de tu bot
echo    o abre WhatsApp en tu celular para ver los estados.
echo ================================================================
echo.
pause
