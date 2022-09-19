@echo off

node "%~dp0..\index.js" webp %*

if errorlevel 1 pause
