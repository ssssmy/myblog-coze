#!/bin/bash

# 博客系统 - 启动管理后台脚本 (Linux/macOS)

set -e

echo "======================================"
echo "  博客系统 - 启动管理后台"
echo "======================================"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 日志目录
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"

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
    echo "  管理后台已启动"
    echo "======================================"
    echo ""
    echo "📊 访问地址："
    echo "  管理后台:       http://localhost:5001"
    echo "  管理后台API:    http://localhost:3002"
    echo ""
    echo "🔐 默认账号："
    echo "  用户名: admin"
    echo "  密码: admin123"
    echo ""
    echo "📝 日志文件："
    echo "  管理后台后端:   $LOG_DIR/admin-backend.log"
    echo "  管理后台前端:   $LOG_DIR/admin-frontend.log"
    echo ""
}

# 主流程
cd "$PROJECT_ROOT"

start_admin_backend
start_admin_frontend

show_status

echo "======================================"
echo "  ✅ 管理后台启动完成！"
echo "======================================"
