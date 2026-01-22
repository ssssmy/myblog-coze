@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ======================================
REM   博客系统 - 停止所有服务脚本 (Windows)
REM ======================================

echo ======================================
echo   博客系统 - 停止所有服务
echo ======================================

REM 停止端口 3001 的服务
echo.
echo 🛑 停止主项目后端 (端口 3001)...
netstat -ano | findstr ":3001 " >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001 "') do (
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo   ✅ 主项目后端已停止 ^(PID: %%a^)
        )
    )
) else (
    echo   ℹ️  主项目后端未运行
)

REM 停止端口 3002 的服务
echo.
echo 🛑 停止管理后台后端 (端口 3002)...
netstat -ano | findstr ":3002 " >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002 "') do (
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo   ✅ 管理后台后端已停止 ^(PID: %%a^)
        )
    )
) else (
    echo   ℹ️  管理后台后端未运行
)

REM 停止端口 5000 的服务
echo.
echo 🛑 停止主项目前端 (端口 5000)...
netstat -ano | findstr ":5000 " >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 "') do (
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo   ✅ 主项目前端已停止 ^(PID: %%a^)
        )
    )
) else (
    echo   ℹ️  主项目前端未运行
)

REM 停止端口 5001 的服务
echo.
echo 🛑 停止管理后台前端 (端口 5001)...
netstat -ano | findstr ":5001 " >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001 "') do (
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo   ✅ 管理后台前端已停止 ^(PID: %%a^)
        )
    )
) else (
    echo   ℹ️  管理后台前端未运行
)

echo.
echo ======================================
echo   ✅ 所有服务已停止
echo ======================================

pause
