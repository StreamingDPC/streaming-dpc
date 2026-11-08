@echo off
title Sincronizador de Estrenos Streaming DPC
echo ================================================================
echo    Sincronizador y Limpiador de Estrenos - Streaming DPC
echo ================================================================
echo.
echo  1. Sincronizar estrenos (un dia especifico o todo el mes)
echo  2. Eliminar dias antiguos (liberar espacio en disco y web)
echo.
set /p OPCION="Selecciona una opcion (1 o 2): "

if "%OPCION%"=="2" goto ELIMINAR

:SINCRONIZAR
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
echo    "Cargar Banners de Noviembre"
echo ================================================================
echo.
pause
