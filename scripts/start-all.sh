#!/bin/bash

# 博客系统 - 全部服务启动脚本 (Linux/macOS)

set -e

echo "======================================"
echo "  博客系统 - 启动所有服务"
echo "======================================"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 日志目录
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"

# 检查端口是否被占用
check_port() {
    local port=$1
    local service=$2
    if ss -tuln 2>/dev/null | grep -q ":${port}" | grep -q LISTEN; then
        echo "⚠️  端口 $port 已被占用 ($service)"
        return 1
    fi
    return 0
}

# 停止已存在的服务
stop_existing_services() {
    echo "📋 检查并停止已存在的服务..."
    for port in 3001 3002 5000 5001; do
        pid=$(ss -lptn "sport = :${port}" 2>/dev/null | grep -o 'pid=[0-9]*' | cut -d= -f2 || true)
        if [ -n "$pid" ]; then
            echo "  停止端口 $port 的服务 (PID: $pid)"
            kill -9 $pid 2>/dev/null || true
            sleep 1
        fi
    done
}

# 启动主项目后端
start_master_backend() {
    echo ""
    echo "🚀 启动主项目后端 (端口 3001)..."
    cd "$PROJECT_ROOT/master/backend"

    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "  安装依赖..."
        npm install
    fi

    nohup npm start > "$LOG_DIR/master-backend.log" 2>&1 &
    echo $! > "$LOG_DIR/master-backend.pid"

    # 等待服务启动
    sleep 3
    if ss -tuln 2>/dev/null | grep -q ":3001"; then
        echo "  ✅ 主项目后端启动成功"
    else
        echo "  ❌ 主项目后端启动失败，查看日志: tail -f $LOG_DIR/master-backend.log"
        exit 1
    fi
}

# 启动主项目前端
start_master_frontend() {
    echo ""
    echo "🚀 启动主项目前端 (端口 5000)..."
    cd "$PROJECT_ROOT/master/frontend"

    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "  安装依赖..."
        pnpm install
    fi

    nohup pnpm dev > "$LOG_DIR/master-frontend.log" 2>&1 &
    echo $! > "$LOG_DIR/master-frontend.pid"

    # 等待服务启动
    sleep 3
    if ss -tuln 2>/dev/null | grep -q ":5000"; then
        echo "  ✅ 主项目前端启动成功"
    else
        echo "  ❌ 主项目前端启动失败，查看日志: tail -f $LOG_DIR/master-frontend.log"
        exit 1
    fi
}

# 启动管理后台后端
start_admin_backend() {
    echo ""
    echo "🚀 启动管理后台后端 (端口 3002)..."
    cd "$PROJECT_ROOT/admin/backend"

    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "  安装依赖..."
        npm install
    fi

    nohup npm start > "$LOG_DIR/admin-backend.log" 2>&1 &
    echo $! > "$LOG_DIR/admin-backend.pid"

    # 等待服务启动
    sleep 3
    if ss -tuln 2>/dev/null | grep -q ":3002"; then
        echo "  ✅ 管理后台后端启动成功"
    else
        echo "  ❌ 管理后台后端启动失败，查看日志: tail -f $LOG_DIR/admin-backend.log"
        exit 1
    fi
}

# 启动管理后台前端
start_admin_frontend() {
    echo ""
    echo "🚀 启动管理后台前端 (端口 5001)..."
    cd "$PROJECT_ROOT/admin/frontend"

    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "  安装依赖..."
        npm install
    fi

    nohup npm run dev > "$LOG_DIR/admin-frontend.log" 2>&1 &
    echo $! > "$LOG_DIR/admin-frontend.pid"

    # 等待服务启动
    sleep 3
    if ss -tuln 2>/dev/null | grep -q ":5001"; then
        echo "  ✅ 管理后台前端启动成功"
    else
        echo "  ❌ 管理后台前端启动失败，查看日志: tail -f $LOG_DIR/admin-frontend.log"
        exit 1
    fi
}

# 显示服务状态
show_status() {
    echo ""
    echo "======================================"
    echo "  服务状态"
    echo "======================================"
    echo ""
    echo "📊 访问地址："
    echo "  主项目前台:     http://localhost:5000"
    echo "  主项目后端API:  http://localhost:3001"
    echo "  管理后台:       http://localhost:5001"
    echo "  管理后台API:    http://localhost:3002"
    echo ""
    echo "📝 日志文件："
    echo "  主项目后端:     $LOG_DIR/master-backend.log"
    echo "  主项目前端:     $LOG_DIR/master-frontend.log"
    echo "  管理后台后端:   $LOG_DIR/admin-backend.log"
    echo "  管理后台前端:   $LOG_DIR/admin-frontend.log"
    echo ""
    echo "🛑 停止服务："
    echo "  bash scripts/stop-all.sh"
    echo ""
}

# 主流程
cd "$PROJECT_ROOT"

# 停止已存在的服务
stop_existing_services

# 启动所有服务
start_master_backend
start_master_frontend
start_admin_backend
start_admin_frontend

# 显示状态
show_status

echo "======================================"
echo "  ✅ 所有服务启动完成！"
echo "======================================"
