@echo off

node "%~dp0..\index.js" png_sticker %*

if errorlevel 1 pause
