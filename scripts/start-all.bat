@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ======================================
REM   博客系统 - 全部服务启动脚本 (Windows)
REM ======================================

echo ======================================
echo   博客系统 - 启动所有服务
echo ======================================

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."

REM 日志目录
set "LOG_DIR=%PROJECT_ROOT%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM 停止已存在的服务
echo.
echo 📋 检查并停止已存在的服务...

REM 停止端口 3001 的服务
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001 "') do (
    echo   停止端口 3001 的服务 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 >nul
)

REM 停止端口 3002 的服务
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002 "') do (
    echo   停止端口 3002 的服务 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 >nul
)

REM 停止端口 5000 的服务
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 "') do (
    echo   停止端口 5000 的服务 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 >nul
)

REM 停止端口 5001 的服务
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001 "') do (
    echo   停止端口 5001 的服务 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 >nul
)

echo   ✅ 已清理完成

REM 启动主项目后端
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
echo   等待服务启动...
timeout /t 5 >nul
netstat -ano | findstr ":3001 " >nul
if %errorlevel% equ 0 (
    echo   ✅ 主项目后端启动成功
) else (
    echo   ❌ 主项目后端启动失败，查看日志: type %LOG_DIR%\master-backend.log
    pause
    exit /b 1
)

REM 启动主项目前端
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
echo   等待服务启动...
timeout /t 5 >nul
netstat -ano | findstr ":5000 " >nul
if %errorlevel% equ 0 (
    echo   ✅ 主项目前端启动成功
) else (
    echo   ❌ 主项目前端启动失败，查看日志: type %LOG_DIR%\master-frontend.log
    pause
    exit /b 1
)

REM 启动管理后台后端
echo.
echo 🚀 启动管理后台后端 (端口 3002)...
cd /d "%PROJECT_ROOT%\admin\backend"

REM 检查依赖
if not exist "node_modules" (
    echo   安装依赖...
    call npm install
)

start /B "" cmd /c "npm start > \"%LOG_DIR%\admin-backend.log\" 2>&1"

REM 等待服务启动
echo   等待服务启动...
timeout /t 5 >nul
netstat -ano | findstr ":3002 " >nul
if %errorlevel% equ 0 (
    echo   ✅ 管理后台后端启动成功
) else (
    echo   ❌ 管理后台后端启动失败，查看日志: type %LOG_DIR%\admin-backend.log
    pause
    exit /b 1
)

REM 启动管理后台前端
echo.
echo 🚀 启动管理后台前端 (端口 5001)...
cd /d "%PROJECT_ROOT%\admin\frontend"

REM 检查依赖
if not exist "node_modules" (
    echo   安装依赖...
    call npm install
)

start /B "" cmd /c "npm run dev > \"%LOG_DIR%\admin-frontend.log\" 2>&1"

REM 等待服务启动
echo   等待服务启动...
timeout /t 5 >nul
netstat -ano | findstr ":5001 " >nul
if %errorlevel% equ 0 (
    echo   ✅ 管理后台前端启动成功
) else (
    echo   ❌ 管理后台前端启动失败，查看日志: type %LOG_DIR%\admin-frontend.log
    pause
    exit /b 1
)

REM 显示服务状态
echo.
echo ======================================
echo   服务状态
echo ======================================
echo.
echo 📊 访问地址：
echo   主项目前台:     http://localhost:5000
echo   主项目后端API:  http://localhost:3001
echo   管理后台:       http://localhost:5001
echo   管理后台API:    http://localhost:3002
echo.
echo 📝 日志文件：
echo   主项目后端:     %LOG_DIR%\master-backend.log
echo   主项目前端:     %LOG_DIR%\master-frontend.log
echo   管理后台后端:   %LOG_DIR%\admin-backend.log
echo   管理后台前端:   %LOG_DIR%\admin-frontend.log
echo.
echo 🛑 停止服务：
echo   scripts\stop-all.bat
echo.

echo ======================================
echo   ✅ 所有服务启动完成！
echo ======================================

pause
