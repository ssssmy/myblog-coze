#!/bin/bash

echo "🚀 启动博客系统..."

# 启动后端服务器
echo "📦 启动后端服务器 (端口 3001)..."
node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "后端 PID: $BACKEND_PID"

# 等待后端启动
sleep 2

# 检查后端是否成功启动
if curl -s http://localhost:3001/api/health > /dev/null; then
  echo "✅ 后端服务器启动成功"
else
  echo "❌ 后端服务器启动失败"
  exit 1
fi

# 启动前端服务器
echo "🎨 启动前端服务器 (端口 5000)..."
pnpm dev > /tmp/dev-server.log 2>&1 &
FRONTEND_PID=$!
echo "前端 PID: $FRONTEND_PID"

# 等待前端启动
sleep 3

echo ""
echo "✨ 博客系统启动完成！"
echo ""
echo "📝 服务地址："
echo "   前端: http://localhost:5000"
echo "   后端: http://localhost:3001"
echo ""
echo "🔧 进程 ID："
echo "   后端: $BACKEND_PID"
echo "   前端: $FRONTEND_PID"
echo ""
echo "📋 查看日志："
echo "   后端: tail -f /tmp/backend.log"
echo "   前端: tail -f /tmp/dev-server.log"
echo ""
echo "⏹️  停止服务："
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
