# 博客主项目

## 项目结构

```
master/
├── frontend/          # 前端应用（Vue 3 + Vite + TypeScript）
│   ├── index.html
│   ├── src/
│   ├── scripts/
│   ├── package.json
│   └── vite.config.ts
└── backend/           # 后端服务（Express.js + SQLite）
    ├── server.js
    ├── blog.db
    ├── package.json
    └── scripts/
```

## 快速开始

### 前端
```bash
cd frontend
pnpm install
pnpm dev      # 开发模式（http://localhost:5000）
pnpm build    # 构建生产版本
```

### 后端
```bash
cd backend
npm install
npm start     # 启动服务（http://localhost:3001）
```

## 端口说明

- 前端开发服务器: 5000
- 后端 API 服务: 3001

## 功能特性

- 炫酷的首页动画效果
- 文章分类和筛选
- 文章详情展示（Markdown渲染）
- 响应式设计
- 前后端分离架构
