#!/bin/bash

# 博客系统 - 启动主项目脚本 (Linux/macOS)

set -e

echo "======================================"
echo "  博客系统 - 启动主项目"
echo "======================================"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 日志目录
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"

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

    sleep 5
    if ss -tuln 2>/dev/null | grep -q ":3001[[:space:]]"; then
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

    sleep 5
    if ss -tuln 2>/dev/null | grep -q ":5000[[:space:]]"; then
        echo "  ✅ 主项目前端启动成功"
    else
        echo "  ❌ 主项目前端启动失败，查看日志: tail -f $LOG_DIR/master-frontend.log"
        exit 1
    fi
}

# 显示服务状态
show_status() {
    echo ""
    echo "======================================"
    echo "  主项目已启动"
    echo "======================================"
    echo ""
    echo "📊 访问地址："
    echo "  主项目前台:     http://localhost:5000"
    echo "  主项目后端API:  http://localhost:3001"
    echo ""
    echo "📝 日志文件："
    echo "  主项目后端:     $LOG_DIR/master-backend.log"
    echo "  主项目前端:     $LOG_DIR/master-frontend.log"
    echo ""
}

# 主流程
cd "$PROJECT_ROOT"

start_master_backend
start_master_frontend

show_status

echo "======================================"
echo "  ✅ 主项目启动完成！"
echo "======================================"
