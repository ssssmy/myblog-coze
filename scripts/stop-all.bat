@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ======================================
REM   博客系统 - 停止所有服务脚本 (Windows)
REM ======================================

echo ======================================
echo   博客系统 - 停止所有服务
echo ======================================

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."

REM 日志目录
set "LOG_DIR=%PROJECT_ROOT%\logs"

REM 停止服务
:stop_service
set service_name=%~1
set port=%~2

echo.
echo 🛑 停止 %service_name% (端口 %port%)...

REM 使用更精确的端口匹配
netstat -ano | findstr ":%port% " >nul
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%port% "') do (
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo   ✅ %service_name% 已停止 (PID: %%a)
        )
    )
) else (
    echo   ℹ️  %service_name% 未运行
)

goto :eof

REM 停止所有服务
call :stop_service master-backend 3001
call :stop_service admin-backend 3002
call :stop_service master-frontend 5000
call :stop_service admin-frontend 5001

echo.
echo ======================================
echo   ✅ 所有服务已停止
echo ======================================

pause
