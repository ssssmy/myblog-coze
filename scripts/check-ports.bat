@echo off
chcp 65001 >nul

echo ======================================
echo   端口状态检查工具
echo ======================================
echo.

echo 检查端口 3001 (主项目后端)...
netstat -ano | findstr ":3001 " >nul
if %errorlevel% equ 0 (
    echo   ❌ 端口 3001 已被占用
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001 "') do (
        echo   进程 PID: %%a
        tasklist | findstr "%%a" >nul && (
            echo   进程名称:
            tasklist | findstr "%%a"
        )
    )
) else (
    echo   ✅ 端口 3001 可用
)
echo.

echo 检查端口 3002 (管理后台后端)...
netstat -ano | findstr ":3002 " >nul
if %errorlevel% equ 0 (
    echo   ❌ 端口 3002 已被占用
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002 "') do (
        echo   进程 PID: %%a
        tasklist | findstr "%%a" >nul && (
            echo   进程名称:
            tasklist | findstr "%%a"
        )
    )
) else (
    echo   ✅ 端口 3002 可用
)
echo.

echo 检查端口 5000 (主项目前端)...
netstat -ano | findstr ":5000 " >nul
if %errorlevel% equ 0 (
    echo   ❌ 端口 5000 已被占用
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 "') do (
        echo   进程 PID: %%a
        tasklist | findstr "%%a" >nul && (
            echo   进程名称:
            tasklist | findstr "%%a"
        )
    )
) else (
    echo   ✅ 端口 5000 可用
)
echo.

echo 检查端口 5001 (管理后台前端)...
netstat -ano | findstr ":5001 " >nul
if %errorlevel% equ 0 (
    echo   ❌ 端口 5001 已被占用
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001 "') do (
        echo   进程 PID: %%a
        tasklist | findstr "%%a" >nul && (
            echo   进程名称:
            tasklist | findstr "%%a"
        )
    )
) else (
    echo   ✅ 端口 5001 可用
)
echo.

echo ======================================
echo   检查完成
echo ======================================
echo.
echo 如果端口被占用，请运行:
echo   scripts\stop-all.bat
echo.
pause
