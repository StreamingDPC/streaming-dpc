@echo off
title Streaming DPC - Bot Local de TV
color 0A
echo.
echo  ==========================================
echo    STREAMING DPC - Bot de Activacion TV
echo  ==========================================
echo.

cd /d "f:\Antigravity\Antigravity\streaming-dpc"

:: 1. Verificar si ngrok ya esta corriendo
tasklist /FI "IMAGENAME eq ngrok.exe" 2>NUL | find /I /N "ngrok.exe" >NUL
if NOT ERRORLEVEL 1 (
    echo  [OK] ngrok ya esta corriendo.
) else (
    echo  [1/2] Iniciando ngrok (tunel publico para clientes remotos)...
    start /B "" ngrok http 3099 --log=stderr >nul 2>&1
    echo  [OK] ngrok iniciado en segundo plano.
    :: Esperar 3 segundos para que ngrok establezca el tunel
    timeout /t 3 /nobreak >nul
)

echo.
echo  [2/2] Iniciando Bot Local...
echo.
node local-bot.js
pause
