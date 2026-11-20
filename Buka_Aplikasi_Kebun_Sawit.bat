@echo off
title SI-KEBUN SAWIT - Logbook Keuangan Kebun Sawit
color 0A
chcp 65001 >nul
cls

echo ===================================================================
echo     🌴 SISTEM INFORMASI & BUKU KAS KEUANGAN KEBUN SAWIT 🌴
echo ===================================================================
echo Memeriksa sistem...

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js terdeteksi. Memulai server lokal...
    start /min "" cmd /c "node server.js"
    timeout /t 2 /nobreak >nul
    echo Membuka aplikasi di browser...
    start http://localhost:3001
) else (
    echo [INFO] Menjalankan aplikasi langsung melalui browser...
    start "" index.html
)

echo.
echo Aplikasi telah berhasil dibuka! (http://localhost:3001)
echo Anda dapat menutup jendela ini kapan saja.
echo ===================================================================
timeout /t 5

