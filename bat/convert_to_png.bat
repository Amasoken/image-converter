@echo off

node "%~dp0..\index.js" png %*

if errorlevel 1 pause
