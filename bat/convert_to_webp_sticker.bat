@echo off

cd "%~dp0" && cd "../" && node "index.js" webp_sticker %*

if errorlevel 1 pause
