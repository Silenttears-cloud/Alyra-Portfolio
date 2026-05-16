@echo off
setlocal
cls

echo ==========================================
echo       Starting Portfolio Website...
echo ==========================================

:: Check if pnpm is installed, if not use npx
where pnpm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set PNPM_CMD=pnpm
) else (
    echo [INFO] pnpm not found in PATH, using npx pnpm...
    set PNPM_CMD=npx pnpm
)

:: Check for node_modules
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    %PNPM_CMD% install
)

:: Start the development server
echo [INFO] Launching development server...
%PNPM_CMD% run dev

pause
