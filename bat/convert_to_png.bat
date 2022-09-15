@echo off

cd "%~dp0" && cd "../" && node "index.js" png %*

if errorlevel 1 pause
