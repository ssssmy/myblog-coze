@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ======================================
REM   博客系统 - 启动管理后台脚本 (Windows)
REM ======================================

echo ======================================
echo   博客系统 - 启动管理后台
echo ======================================

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."

REM 日志目录
set "LOG_DIR=%PROJECT_ROOT%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM 启动管理后台后端
echo.
echo 🚀 启动管理后台后端 (端口 3002)...
cd /d "%PROJECT_ROOT%\admin\backend"

REM 检查依赖
if not exist "node_modules" (
    echo   安装依赖...
    call npm install
)

echo   启动服务...
start /min cmd /c "npm start > \"%LOG_DIR%\admin-backend.log\" 2>&1"

REM 等待服务启动
echo   等待服务启动...
timeout /t 5 >nul 2>&1
netstat -ano | findstr ":3002 " >nul 2>&1
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

echo   启动服务...
start /min cmd /c "npm run dev > \"%LOG_DIR%\admin-frontend.log\" 2>&1"

REM 等待服务启动
echo   等待服务启动...
timeout /t 5 >nul 2>&1
netstat -ano | findstr ":5001 " >nul 2>&1
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
echo   管理后台已启动
echo ======================================
echo.
echo 📊 访问地址：
echo   管理后台:       http://localhost:5001
echo   管理后台API:    http://localhost:3002
echo.
echo 🔐 默认账号：
echo   用户名: admin
echo   密码: admin123
echo.
echo 📝 日志文件：
echo   管理后台后端:   %LOG_DIR%\admin-backend.log
echo   管理后台前端:   %LOG_DIR%\admin-frontend.log
echo.

echo ======================================
echo   ✅ 管理后台启动完成！
echo ======================================

pause
