@echo off
title Push SI-KEBUN SAWIT ke GitHub (giginswanto-ship-it/Petani-Sawit)
color 0A
chcp 65001 >nul
cls

echo ===================================================================
echo   🌴 PUSH PROYEK SI-KEBUN SAWIT KE GITHUB REPOSITORY 🌴
echo ===================================================================
echo Target Repository : https://github.com/giginswanto-ship-it/Petani-Sawit.git
echo Branch Target     : main
echo.
echo Menjalankan git push ke repository GitHub...
echo (Jika muncul jendela login GitHub / browser, silakan klik 'Sign in with browser')
echo.

git remote set-url origin https://github.com/giginswanto-ship-it/Petani-Sawit.git
git push -u origin main

echo.
echo ===================================================================
if %ERRORLEVEL% EQU 0 (
    echo [BERHASIL] Kode proyek berhasil terunggah ke GitHub!
    echo Silakan periksa di: https://github.com/giginswanto-ship-it/Petani-Sawit
) else (
    echo [PERHATIAN] Push membutuhkan otorisasi akun giginswanto-ship-it.
    echo Pastikan akun Anda memiliki akses tulis (write access) ke repository tersebut.
)
echo ===================================================================
pause
