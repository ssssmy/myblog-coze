#!/bin/bash

# Node.js 环境检查脚本

echo "======================================"
echo "  Node.js 环境检查"
echo "======================================"
echo ""

# 检查 Node.js 版本
echo "检查 Node.js 版本..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    NODE_MINOR=$(echo $NODE_VERSION | cut -d'.' -f2)

    echo "  当前版本: v$NODE_VERSION"

    # 检查版本是否 >= 18.20.0
    if [ $NODE_MAJOR -gt 18 ] || ([ $NODE_MAJOR -eq 18 ] && [ $NODE_MINOR -ge 20 ]); then
        echo "  ✅ Node.js 版本符合要求 (>= 18.20.0)"
    else
        echo "  ❌ Node.js 版本不符合要求，需要 >= 18.20.0"
        echo ""
        echo "  请升级 Node.js："
        echo "  - 使用 nvm: nvm install 18.20.0 && nvm use 18.20.0"
        echo "  - 访问 https://nodejs.org/ 下载最新 LTS 版本"
        exit 1
    fi
else
    echo "  ❌ 未安装 Node.js"
    echo ""
    echo "  请先安装 Node.js："
    echo "  - 访问 https://nodejs.org/ 下载安装"
    echo "  - 或使用 nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi
echo ""

# 检查 npm 版本
echo "检查 npm 版本..."
NPM_VERSION=$(npm --version)
echo "  当前版本: v$NPM_VERSION"
echo "  ✅ npm 已安装"
echo ""

# 检查 pnpm 版本
echo "检查 pnpm 版本..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo "  当前版本: v$PNPM_VERSION"

    # 检查版本是否 >= 9.0.0
    PNPM_MAJOR=$(echo $PNPM_VERSION | cut -d'.' -f1)
    if [ $PNPM_MAJOR -ge 9 ]; then
        echo "  ✅ pnpm 版本符合要求 (>= 9.0.0)"
    else
        echo "  ⚠️  pnpm 版本过低，建议升级到 9.0.0 或更高版本"
        echo "     升级命令: npm install -g pnpm@latest"
    fi
else
    echo "  ⚠️  未安装 pnpm（主项目前端需要）"
    echo "     安装命令: npm install -g pnpm@latest"
fi
echo ""

echo "======================================"
echo "  环境检查完成"
echo "======================================"
