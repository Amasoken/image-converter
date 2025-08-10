@echo off

node "%~dp0..\index.js" webp_sticker_upscale %*

if errorlevel 1 pause
