# 博客系统项目

## 项目结构

```
.
├── admin/              # 管理后台
│   ├── backend/        # 管理后台后端（Express.js + SQLite + JWT）
│   │   ├── admin.db    # 管理后台数据库（用户数据）
│   │   └── server.js
│   └── frontend/       # 管理后台前端（Vue 3 + Element Plus + TypeScript）
├── master/             # 主项目
│   ├── backend/        # 主项目后端（Express.js + SQLite）
│   │   └── server.js
│   └── frontend/       # 主项目前端（Vue 3 + Vite + TypeScript）
└── blog.db             # 博客数据库（文章数据，主项目和管理后台共享）
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

## 数据库说明

项目使用 SQLite 数据库：

- **blog.db**（根目录）：存储文章数据（posts 表），主项目和管理后台共享此数据库
- **admin.db**（admin/backend/）：存储用户数据（users 表），仅管理后台使用

管理后台后端通过数据库附加（ATTACH DATABASE）的方式共享根目录的 blog.db 中的文章数据，确保数据一致性。

### 数据库结构

**blog.db - posts 表**
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  content TEXT NOT NULL
)
```

**admin.db - users 表**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

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
