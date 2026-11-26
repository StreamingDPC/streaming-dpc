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
if "%MES%"=="" (
    for /f "delims=" %%m in ('node -e "const m=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];console.log(m[new Date().getMonth()])"') do set MES_ACTIVO=%%m
) else (
    for /f "delims=" %%m in ('node -e "const s=process.argv[1].trim();console.log(s.charAt(0).toUpperCase()+s.slice(1).toLowerCase())" "%MES%"') do set MES_ACTIVO=%%m
)
title Sincronizador de Estrenos - Carpeta: %MES_ACTIVO%
echo.
echo ================================================================
echo   ESTAS EN LA CARPETA: videos\%MES_ACTIVO%\
echo ================================================================
echo.
set /p DIA=" Ingresa el numero del dia en %MES_ACTIVO% (o ENTER para todo el mes): "
echo ----------------------------------------------------------------

set MES_FLAG=--month %MES_ACTIVO%

if "%DIA%"=="" (
    echo.
    echo Sincronizando todo el mes en la carpeta videos\%MES_ACTIVO%\...
    node sync-video.js %MES_FLAG% --all
) else (
    echo.
    echo Sincronizando dia %DIA% en la carpeta videos\%MES_ACTIVO%\%DIA%\...
    node sync-video.js %MES_FLAG% %DIA%
)
goto SUBIR

:ELIMINAR
echo.
echo ----------------------------------------------------------------
echo  Presiona ENTER para limpiar en el mes actual del calendario,
set /p MES_DEL=" o escribe el mes de la carpeta a limpiar (ej: Diciembre): "
if "%MES_DEL%"=="" (
    for /f "delims=" %%m in ('node -e "const m=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];console.log(m[new Date().getMonth()])"') do set MES_ACTIVO=%%m
) else (
    for /f "delims=" %%m in ('node -e "const s=process.argv[1].trim();console.log(s.charAt(0).toUpperCase()+s.slice(1).toLowerCase())" "%MES_DEL%"') do set MES_ACTIVO=%%m
)
title Limpiador de Estrenos - Carpeta: %MES_ACTIVO%
echo.
echo ================================================================
echo   ESTAS EN LA CARPETA: videos\%MES_ACTIVO%\
echo ================================================================
node sync-video.js --month %MES_ACTIVO% --list-days
echo ----------------------------------------------------------------
echo.
echo Puedes escribir:
echo   - Un solo dia: 1
echo   - Varios dias separados por coma: 1, 2, 3
echo   - Un rango de dias: 1-5
echo.
set /p DEL_DIAS="Ingresa el dia o dias a eliminar de %MES_ACTIVO%: "
if "%DEL_DIAS%"=="" (
    echo No ingresaste ningun dia. Cancelando operacion.
    pause
    exit /b 0
)
echo.
node sync-video.js --month %MES_ACTIVO% --delete %DEL_DIAS%
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

if "%SUB_OPCION%"=="1" goto PUB_TODOS
if "%SUB_OPCION%"=="2" goto PUB_DIA
if "%SUB_OPCION%"=="3" goto PUB_RANGO
if "%SUB_OPCION%"=="4" goto PUB_CANTIDAD
if "%SUB_OPCION%"=="5" goto PUB_PRUEBA

echo Opcion invalida.
echo.
pause
exit /b 0

:PUB_TODOS
echo.
echo Subiendo TODOS los videos a tus Estados de WhatsApp...
node post-status-cli.js --all
echo.
pause
exit /b 0

:PUB_DIA
echo.
set /p DIA_ESTADO="Ingresa el numero del dia a publicar en Estados (ej: 10): "
if "%DIA_ESTADO%"=="" (
    echo No ingresaste ningun dia. Operacion cancelada.
    echo.
    pause
    exit /b 0
)
echo.
echo Subiendo los videos del dia %DIA_ESTADO%...
node post-status-cli.js --day %DIA_ESTADO%
echo.
pause
exit /b 0

:PUB_RANGO
echo.
echo Puedes escribir el rango como: 3-13 (o del 3 al 13)
set /p RANGO_ESTADO="Ingresa el rango de dias a publicar (ej: 3-13): "
if "%RANGO_ESTADO%"=="" (
    echo No ingresaste ningun rango. Operacion cancelada.
    echo.
    pause
    exit /b 0
)
echo.
echo Subiendo videos en el rango %RANGO_ESTADO%...
node post-status-cli.js --range "%RANGO_ESTADO%"
echo.
pause
exit /b 0

:PUB_CANTIDAD
echo.
set /p CANT_ESTADO="Ingresa la cantidad de videos a publicar (ej: 10): "
if "%CANT_ESTADO%"=="" (
    echo No ingresaste ninguna cantidad. Operacion cancelada.
    echo.
    pause
    exit /b 0
)
echo.
echo Subiendo %CANT_ESTADO% videos a tus Estados de WhatsApp...
node post-status-cli.js %CANT_ESTADO%
echo.
pause
exit /b 0

:PUB_PRUEBA
echo.
echo Subiendo 1 video de prueba a tus Estados de WhatsApp...
node post-status-cli.js 1
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
echo Subiendo cambios a GitHub y Render (Carpeta: videos\%MES_ACTIVO%)...
if not "%DIA%"=="" (
    echo Sincronizando especificamente %MES_ACTIVO% dia %DIA% en git...
    git add banners-month.json sync-video.js actualizar-estrenos.bat post-status-cli.js admin.html "videos/%MES_ACTIVO%/%DIA%"
    git commit -m "chore: actualizar estrenos %MES_ACTIVO% dia %DIA%" || echo No habia cambios pendientes.
) else (
    echo Sincronizando cambios en git...
    git add banners-month.json sync-video.js actualizar-estrenos.bat post-status-cli.js admin.html videos
    git commit -m "chore: actualizar y limpiar videos/banners (%MES_ACTIVO%)" || echo No habia cambios pendientes.
)
git push origin main

echo.
echo ================================================================
echo    TODO LISTO!
echo    Los cambios ya se subieron a la nube (Render).
echo    Ahora ve a tu panel Admin (pestana Banners) y presiona:
echo    "Sincronizar Banners del Mes"
echo ================================================================
echo.
pause
