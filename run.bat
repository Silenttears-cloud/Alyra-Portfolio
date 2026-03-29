@echo off
setlocal
cls

:menu
echo ==========================================
echo       Project Run Menu (Windows)
echo ==========================================
echo 1. Start Development Server (pnpm dev)
echo 2. Build for Production (pnpm build)
echo 3. Start Production Server (node dist/index.js)
echo 4. Exit
echo ==========================================
set /p choice="Select an option (1-4): "

if "%choice%"=="1" (
    echo Starting Development Server...
    pnpm run dev
    pause
    goto menu
)

if "%choice%"=="2" (
    echo Building for Production...
    pnpm run build
    pause
    goto menu
)

if "%choice%"=="3" (
    if not exist "dist/index.js" (
        echo [ERROR] Production build not found. Please run Option 2 first.
        pause
        goto menu
    )
    echo Starting Production Server...
    set NODE_ENV=production
    node dist/index.js
    pause
    goto menu
)

if "%choice%"=="4" (
    echo Exiting...
    exit /b
)

echo Invalid choice, please try again.
pause
goto menu
