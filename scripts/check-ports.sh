#!/bin/bash

# 端口状态检查工具 (Linux/macOS)

echo "======================================"
echo "  端口状态检查工具"
echo "======================================"
echo ""

check_port() {
    local port=$1
    local service=$2

    echo "检查端口 $port ($service)..."
    if ss -tuln 2>/dev/null | grep -q ":${port}[[:space:]]"; then
        echo "  ❌ 端口 $port 已被占用"
        pid=$(ss -lptn "sport = :${port}" 2>/dev/null | grep -o 'pid=[0-9]*' | cut -d= -f2 || true)
        if [ -n "$pid" ]; then
            echo "  进程 PID: $pid"
            if command -v ps &> /dev/null; then
                echo "  进程信息:"
                ps -p $pid -o comm= 2>/dev/null || echo "    (无法获取进程信息)"
            fi
        fi
    else
        echo "  ✅ 端口 $port 可用"
    fi
    echo ""
}

check_port 3001 "主项目后端"
check_port 3002 "管理后台后端"
check_port 5000 "主项目前端"
check_port 5001 "管理后台前端"

echo "======================================"
echo "  检查完成"
echo "======================================"
echo ""
echo "如果端口被占用，请运行:"
echo "  bash scripts/stop-all.sh"
echo ""
