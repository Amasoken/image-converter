@echo off

node "%~dp0..\index.js" webp_sticker %*

if errorlevel 1 pause
