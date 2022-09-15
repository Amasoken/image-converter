@echo off

cd "%~dp0" && cd "../" && node "index.js" webp %*

if errorlevel 1 pause
