@echo off
title Sincronizador de Estrenos Streaming DPC
echo ================================================================
echo    Sincronizador y Limpiador de Estrenos - Streaming DPC
echo ================================================================
echo.
echo  1. Sincronizar estrenos (un dia especifico o todo el mes)
echo  2. Eliminar dias antiguos (liberar espacio en disco y web)
echo  3. Publicar estrenos en Estados de WhatsApp
echo.
set /p OPCION="Selecciona una opcion (1, 2 o 3): "

if "%OPCION%"=="3" goto PUBLICAR_ESTADOS
if "%OPCION%"=="2" goto ELIMINAR

:SINCRONIZAR
echo.
echo ----------------------------------------------------------------
echo  Presiona ENTER para usar el mes actual del calendario,
set /p MES=" o escribe otro mes si deseas cambiarlo (ej: Diciembre): "
echo.
set /p DIA=" Ingresa el numero del dia (o ENTER para todo el mes): "
echo ----------------------------------------------------------------

set MES_FLAG=
if not "%MES%"=="" set MES_FLAG=--month %MES%

if "%DIA%"=="" (
    echo.
    echo Sincronizando todo el mes...
    node sync-video.js %MES_FLAG% --all
) else (
    echo.
    echo Sincronizando dia %DIA%...
    node sync-video.js %MES_FLAG% %DIA%
)
goto SUBIR

:ELIMINAR
echo.
echo ----------------------------------------------------------------
node sync-video.js --list-days
echo ----------------------------------------------------------------
echo.
echo Puedes escribir:
echo   - Un solo dia: 1
echo   - Varios dias separados por coma: 1, 2, 3
echo   - Un rango de dias: 1-5
echo.
set /p DEL_DIAS="Ingresa el dia o dias a eliminar: "
if "%DEL_DIAS%"=="" (
    echo No ingresaste ningun dia. Cancelando operacion.
    pause
    exit /b 0
)
echo.
node sync-video.js --delete %DEL_DIAS%
goto SUBIR

:PUBLICAR_ESTADOS
echo.
echo ================================================================
echo    Publicador a Estados de WhatsApp - Streaming DPC
echo ================================================================
echo  1. Subir TODOS los videos disponibles (De mayor a menor dia)
echo  2. Subir los videos de UN DIA especifico (ej: Dia 10)
echo  3. Subir los videos de un RANGO de dias (ej: del 2 al 12)
echo  4. Subir solo los ultimos N videos (ej: 10)
echo  5. Subir 1 video de prueba (el mas reciente)
echo.
set /p SUB_OPCION="Selecciona una opcion (1, 2, 3, 4 o 5): "
if "%SUB_OPCION%"=="1" (
    node post-status-cli.js --all
) else if "%SUB_OPCION%"=="2" (
    echo.
    set /p DIA_ESTADO="Ingresa el numero del dia a publicar en Estados (ej: 10): "
    node post-status-cli.js --day %DIA_ESTADO%
) else if "%SUB_OPCION%"=="3" (
    echo.
    echo Puedes escribir el rango como: 2-12 (o del 2 al 12)
    set /p RANGO_ESTADO="Ingresa el rango de dias a publicar (ej: 2-12): "
    node post-status-cli.js --range "%RANGO_ESTADO%"
) else if "%SUB_OPCION%"=="4" (
    echo.
    set /p CANT_ESTADO="Ingresa la cantidad de videos a publicar (ej: 10): "
    node post-status-cli.js %CANT_ESTADO%
) else if "%SUB_OPCION%"=="5" (
    node post-status-cli.js 1
) else (
    echo Opcion invalida.
)
echo.
pause
exit /b 0

:SUBIR
if errorlevel 1 (
    echo.
    echo Ocurrio un error. Revisa el mensaje arriba.
    pause
    exit /b 1
)

echo.
echo Subiendo cambios a GitHub y Render...
if not "%DIA%"=="" (
    echo Sincronizando especificamente el dia %DIA% en git...
    git add banners-month.json sync-video.js actualizar-estrenos.bat post-status-cli.js admin.html videos/%DIA%
    git commit -m "chore: actualizar estrenos dia %DIA%" || echo No habia cambios pendientes.
) else (
    echo Sincronizando cambios en git...
    git add banners-month.json sync-video.js actualizar-estrenos.bat post-status-cli.js admin.html videos
    git commit -m "chore: actualizar y limpiar videos/banners" || echo No habia cambios pendientes.
)
git push all main

echo.
echo ================================================================
echo    TODO LISTO!
echo    Los cambios ya se subieron a la nube (Render).
echo    Ahora ve a tu panel Admin (pestana Banners) y presiona:
echo    "Sincronizar Banners del Mes"
echo ================================================================
echo.
pause
