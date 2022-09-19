@echo off

node "%~dp0..\index.js" jpeg %*

if errorlevel 1 pause
