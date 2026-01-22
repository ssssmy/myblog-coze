# 博客系统项目

## 项目结构

```
.
├── admin/              # 管理后台
│   ├── backend/        # 管理后台后端（Express.js + SQLite + JWT）
│   └── frontend/       # 管理后台前端（Vue 3 + Element Plus + TypeScript）
└── master/             # 主项目
    ├── backend/        # 主项目后端（Express.js + SQLite）
    └── frontend/       # 主项目前端（Vue 3 + Vite + TypeScript）
```

## 快速开始

### 管理后台

**后端（端口 3002）**
```bash
cd admin/backend
npm install
npm start
```

**前端（端口 5001）**
```bash
cd admin/frontend
npm install
npm run dev
```

**默认账号**: admin / admin123

### 主项目

**后端（端口 3001）**
```bash
cd master/backend
npm install
npm start
```

**前端（端口 5000）**
```bash
cd master/frontend
pnpm install
pnpm dev
```

## 功能特性

### 主项目
- 炫酷的首页动画效果（粒子特效、打字机效果）
- 文章分类和筛选
- 文章详情展示（Markdown渲染）
- 左右分栏布局（分类文章树 + 内容区）
- 响应式设计
- 前后端分离架构

### 管理后台
- 用户登录认证（JWT）
- 文章管理（增删改查、批量操作）
- 文章导入导出（Excel）
- 个人信息配置
- 数据统计仪表盘

## 技术栈

### 主项目
- **前端**: Vue 3, TypeScript, Vite, Tailwind CSS, Vue Router, marked
- **后端**: Express.js, SQLite3

### 管理后台
- **前端**: Vue 3, TypeScript, Element Plus, Vue Router, Pinia, Axios
- **后端**: Express.js, SQLite3, JWT, bcryptjs, XLSX

## 端口说明

| 服务 | 端口 |
|------|------|
| 主项目前端 | 5000 |
| 主项目后端 | 3001 |
| 管理后台前端 | 5001 |
| 管理后台后端 | 3002 |

## 开发规范

### 依赖管理
- 主项目使用 **pnpm**
- 管理后台使用 **npm**

### 代码规范
- 使用 TypeScript 确保类型安全
- 遵循 ESLint 规范
- 组件化开发

## 部署

### 生产构建

**主项目**
```bash
cd master/frontend
pnpm build
```

**管理后台**
```bash
cd admin/frontend
npm run build
```

构建产物可部署到 Nginx、CDN 等静态托管服务。
