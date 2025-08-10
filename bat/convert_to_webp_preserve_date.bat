@echo off

node "%~dp0..\index.js" webp_same_date %*

if errorlevel 1 pause
