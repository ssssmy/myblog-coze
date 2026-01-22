@echo off
chcp 65001 >nul

REM ======================================
REM   Node.js 环境检查脚本 (Windows)
REM ======================================

echo ======================================
echo   Node.js 环境检查
echo ======================================
echo.

REM 检查 Node.js 版本
echo 检查 Node.js 版本...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    for /f "tokens=2 delims=v." %%a in ("%NODE_VERSION%") do set NODE_MAJOR=%%a
    for /f "tokens=3 delims=." %%b in ("%NODE_VERSION%") do set NODE_MINOR=%%b

    echo   当前版本: %NODE_VERSION%

    REM 检查版本是否 >= 18.20.0
    if %NODE_MAJOR% gtr 18 (
        echo   ✅ Node.js 版本符合要求 ^(^>= 18.20.0^)
    ) else if %NODE_MAJOR% equ 18 (
        if %NODE_MINOR% geq 20 (
            echo   ✅ Node.js 版本符合要求 ^(^>= 18.20.0^)
        ) else (
            echo   ❌ Node.js 版本不符合要求，需要 ^>= 18.20.0
            echo.
            echo   请升级 Node.js：
            echo   - 访问 https://nodejs.org/ 下载最新 LTS 版本
            pause
            exit /b 1
        )
    ) else (
        echo   ❌ Node.js 版本不符合要求，需要 ^>= 18.20.0
        echo.
        echo   请升级 Node.js：
        echo   - 访问 https://nodejs.org/ 下载最新 LTS 版本
        pause
        exit /b 1
    )
) else (
    echo   ❌ 未安装 Node.js
    echo.
    echo   请先安装 Node.js：
    echo   - 访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)
echo.

REM 检查 npm 版本
echo 检查 npm 版本...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo   当前版本: v%NPM_VERSION%
    echo   ✅ npm 已安装
) else (
    echo   ❌ npm 未安装
    pause
    exit /b 1
)
echo.

REM 检查 pnpm 版本
echo 检查 pnpm 版本...
pnpm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('pnpm --version') do set PNPM_VERSION=%%i
    echo   当前版本: v%PNPM_VERSION%

    REM 检查版本是否 >= 9.0.0
    for /f "tokens=1 delims=." %%a in ("%PNPM_VERSION%") do set PNPM_MAJOR=%%a
    if %PNPM_MAJOR% geq 9 (
        echo   ✅ pnpm 版本符合要求 ^(^>= 9.0.0^)
    ) else (
        echo   ⚠️  pnpm 版本过低，建议升级到 9.0.0 或更高版本
        echo      升级命令: npm install -g pnpm@latest
    )
) else (
    echo   ⚠️  未安装 pnpm（主项目前端需要）
    echo      安装命令: npm install -g pnpm@latest
)
echo.

echo ======================================
echo   环境检查完成
echo ======================================

pause
