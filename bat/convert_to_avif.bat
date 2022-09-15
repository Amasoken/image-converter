@echo off

cd "%~dp0" && cd "../" && node "index.js" avif %*

if errorlevel 1 pause

