#!/bin/bash

# 博客系统 - 停止所有服务脚本 (Linux/macOS)

set -e

echo "======================================"
echo "  博客系统 - 停止所有服务"
echo "======================================"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 日志目录
LOG_DIR="$PROJECT_ROOT/logs"

# 停止服务
stop_service() {
    local service_name=$1
    local port=$2
    local pid_file="$LOG_DIR/${service_name}.pid"

    echo ""
    echo "🛑 停止 $service_name (端口 $port)..."

    # 优先使用 PID 文件
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        if kill -0 $pid 2>/dev/null; then
            kill -15 $pid 2>/dev/null || true
            sleep 2
            if kill -0 $pid 2>/dev/null; then
                kill -9 $pid 2>/dev/null || true
            fi
            echo "  ✅ $service_name 已停止 (PID: $pid)"
        else
            echo "  ℹ️  $service_name 进程不存在"
        fi
        rm -f "$pid_file"
    else
        # 通过端口查找进程
        pid=$(ss -lptn "sport = :${port}" 2>/dev/null | grep -o 'pid=[0-9]*' | cut -d= -f2 || true)
        if [ -n "$pid" ]; then
            kill -15 $pid 2>/dev/null || true
            sleep 2
            if kill -0 $pid 2>/dev/null; then
                kill -9 $pid 2>/dev/null || true
            fi
            echo "  ✅ $service_name 已停止 (PID: $pid)"
        else
            echo "  ℹ️  $service_name 未运行"
        fi
    fi
}

# 停止所有服务
stop_service "master-backend" 3001
stop_service "master-frontend" 5000
stop_service "admin-frontend" 5001

echo ""
echo "======================================"
echo "  ✅ 所有服务已停止"
echo "======================================"
