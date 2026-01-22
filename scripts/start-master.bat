@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ======================================
REM   博客系统 - 启动主项目脚本 (Windows)
REM ======================================

echo ======================================
echo   博客系统 - 启动主项目
echo ======================================

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."

REM 日志目录
set "LOG_DIR=%PROJECT_ROOT%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM 启动主项目后端
:start_master_backend
echo.
echo 🚀 启动主项目后端 (端口 3001)...
cd /d "%PROJECT_ROOT%\master\backend"

REM 检查依赖
if not exist "node_modules" (
    echo   安装依赖...
    call npm install
)

start /B "" cmd /c "npm start > \"%LOG_DIR%\master-backend.log\" 2>&1"

REM 等待服务启动
timeout /t 5 >nul
netstat -ano | findstr ":3001 " >nul
if %errorlevel% equ 0 (
    echo   ✅ 主项目后端启动成功
) else (
    echo   ❌ 主项目后端启动失败，查看日志: type %LOG_DIR%\master-backend.log
    pause
    exit /b 1
)
goto :eof

REM 启动主项目前端
:start_master_frontend
echo.
echo 🚀 启动主项目前端 (端口 5000)...
cd /d "%PROJECT_ROOT%\master\frontend"

REM 检查依赖
if not exist "node_modules" (
    echo   安装依赖...
    call pnpm install
)

start /B "" cmd /c "pnpm dev > \"%LOG_DIR%\master-frontend.log\" 2>&1"

REM 等待服务启动
timeout /t 5 >nul
netstat -ano | findstr ":5000 " >nul
if %errorlevel% equ 0 (
    echo   ✅ 主项目前端启动成功
) else (
    echo   ❌ 主项目前端启动失败，查看日志: type %LOG_DIR%\master-frontend.log
    pause
    exit /b 1
)
goto :eof

REM 显示服务状态
:show_status
echo.
echo ======================================
echo   主项目已启动
echo ======================================
echo.
echo 📊 访问地址：
echo   主项目前台:     http://localhost:5000
echo   主项目后端API:  http://localhost:3001
echo.
echo 📝 日志文件：
echo   主项目后端:     %LOG_DIR%\master-backend.log
echo   主项目前端:     %LOG_DIR%\master-frontend.log
echo.
goto :eof

REM 主流程
cd /d "%PROJECT_ROOT%"

call :start_master_backend
call :start_master_frontend

call :show_status

echo ======================================
echo   ✅ 主项目启动完成！
echo ======================================

pause
