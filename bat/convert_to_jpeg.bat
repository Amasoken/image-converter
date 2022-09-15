@echo off

cd "%~dp0" && cd "../" && node "index.js" jpeg %*

if errorlevel 1 pause
