@echo off

node "%~dp0..\index.js" avif %*

if errorlevel 1 pause

