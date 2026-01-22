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

REM 转换为绝对路径
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

REM 日志目录
set "LOG_DIR=%PROJECT_ROOT%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM 启动主项目后端
echo.
echo 🚀 启动主项目后端 (端口 3001)...
cd /d "%PROJECT_ROOT%\master\backend"

REM 检查依赖
if not exist "node_modules" (
    echo   安装依赖...
    call pnpm install
)

echo   启动服务...
start /min "MasterBackend" cmd /c "node server.js > \"%LOG_DIR%\master-backend.log\" 2>&1"

REM 等待服务启动并检查
echo   等待服务启动...
set /a retry=0
:check_master_backend
timeout /t 2 >nul 2>&1
set /a retry+=1
netstat -ano | findstr ":3001 " >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✅ 主项目后端启动成功
) else (
    if !retry! lss 5 (
        echo   正在检测服务... ^(第 !retry! 次^)
        goto check_master_backend
    ) else (
        echo   ❌ 主项目后端启动失败
        echo.
        echo   查看日志:
        type "%LOG_DIR%\master-backend.log"
        echo.
        pause
        exit /b 1
    )
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

echo   启动服务...
start /min "MasterFrontend" cmd /c "pnpm dev > \"%LOG_DIR%\master-frontend.log\" 2>&1"

REM 等待服务启动并检查
echo   等待服务启动...
set /a retry=0
:check_master_frontend
timeout /t 2 >nul 2>&1
set /a retry+=1
netstat -ano | findstr ":5000 " >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✅ 主项目前端启动成功
) else (
    if !retry! lss 5 (
        echo   正在检测服务... ^(第 !retry! 次^)
        goto check_master_frontend
    ) else (
        echo   ❌ 主项目前端启动失败
        echo.
        echo   查看日志:
        type "%LOG_DIR%\master-frontend.log"
        echo.
        pause
        exit /b 1
    )
)

REM 显示服务状态
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

echo ======================================
echo   ✅ 主项目启动完成！
echo ======================================

pause
