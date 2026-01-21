#!/bin/bash

echo "🛑 停止博客系统..."

# 停止后端服务器
BACKEND_PID=$(lsof -ti:3001 2>/dev/null)
if [ -n "$BACKEND_PID" ]; then
  echo "停止后端服务器 (PID: $BACKEND_PID)..."
  kill $BACKEND_PID
  echo "✅ 后端服务器已停止"
else
  echo "⚠️  后端服务器未运行"
fi

# 停止前端服务器
FRONTEND_PID=$(lsof -ti:5000 2>/dev/null)
if [ -n "$FRONTEND_PID" ]; then
  echo "停止前端服务器 (PID: $FRONTEND_PID)..."
  kill $FRONTEND_PID
  echo "✅ 前端服务器已停止"
else
  echo "⚠️  前端服务器未运行"
fi

echo ""
echo "🎉 所有服务已停止"
