@echo off
title Sincronizador de Estrenos Streaming DPC
echo ================================================================
echo    Sincronizador y Limpiador de Estrenos - Streaming DPC
echo ================================================================
echo.
echo  1. Sincronizar estrenos (un dia especifico o todo el mes)
echo  2. Eliminar dias antiguos (liberar espacio en disco y web)
echo  3. Publicar ultimos 10 estrenos en Estados de WhatsApp
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
echo    Publicador a Estados de WhatsApp
echo ================================================================
echo  1. Subir solo 1 video de prueba (el estreno mas reciente)
echo  2. Subir los ultimos 10 estrenos (Recomendado)
echo.
set /p SUB_OPCION="Selecciona una opcion (1 o 2): "
if "%SUB_OPCION%"=="1" (
    node post-status-cli.js 1
) else (
    node post-status-cli.js 10
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
git add -A
git commit -m "chore: actualizar y limpiar videos/banners" || echo No habia cambios pendientes.
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
