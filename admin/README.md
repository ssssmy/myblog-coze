# 博客管理后台系统

## 项目概述

这是一个基于 Vue 3 + Express + SQLite 的博客管理后台系统，提供文章管理、个人信息配置等功能。

## 技术栈

### 后端
- Node.js
- Express.js 4
- SQLite3
- JWT (JSON Web Token)
- bcryptjs (密码加密)
- XLSX (Excel 导出)

### 前端
- Vue 3
- TypeScript
- Vite
- Element Plus
- Vue Router
- Pinia
- Axios
- Marked (Markdown 渲染)

## 项目结构

```
admin/
├── backend/              # 后端项目
│   ├── routes/          # 路由文件
│   │   ├── auth.js      # 认证路由
│   │   ├── posts.js     # 文章管理路由
│   │   └── profile.js   # 个人信息路由
│   ├── middleware/      # 中间件
│   │   └── auth.js      # JWT 认证中间件
│   ├── server.js        # 服务器入口
│   ├── package.json     # 依赖配置
│   └── admin.db         # 管理后台数据库
└── frontend/            # 前端项目
    ├── src/
    │   ├── api/         # API 接口
    │   ├── layout/      # 布局组件
    │   ├── router/      # 路由配置
    │   ├── styles/      # 样式文件
    │   └── views/       # 页面组件
    │       ├── Login.vue      # 登录页
    │       ├── Dashboard.vue  # 仪表盘
    │       ├── Posts.vue      # 文章管理
    │       ├── PostEdit.vue   # 文章编辑
    │       └── Profile.vue    # 个人信息
    ├── index.html       # HTML 入口
    └── package.json     # 依赖配置
```

## 功能特性

### 1. 用户认证
- ✅ 登录功能
- ✅ JWT Token 认证
- ✅ 修改密码
- ✅ 自动登录（Token 存储）

### 2. 文章管理
- ✅ 文章列表（分页）
- ✅ 搜索功能（关键词、分类）
- ✅ 创建文章
- ✅ 编辑文章（Markdown 编辑器）
- ✅ 删除文章（逻辑删除）
- ✅ 批量删除
- ✅ 导出文章（Excel）
- ✅ 文章预览

### 3. 个人信息配置
- ✅ 昵称设置
- ✅ 角色/职位设置
- ✅ 头像选择（表情）
- ✅ 社交链接配置（GitHub、Twitter、邮箱）
- ✅ 实时预览

### 4. 仪表盘
- ✅ 统计数据展示
- ✅ 最新文章列表
- ✅ 分类统计

## 快速开始

### 后端启动

```bash
cd admin/backend
pnpm install
pnpm start
```

后端服务运行在：`http://localhost:3002`

默认账号：
- 用户名：`admin`
- 密码：`admin123`

### 前端启动

```bash
cd admin/frontend
pnpm install
pnpm dev
```

前端服务运行在：`http://localhost:5001`

## API 文档

### 认证相关

#### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

响应：
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@blog.com"
    }
  }
}
```

#### 修改密码
```
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "admin",
  "oldPassword": "admin123",
  "newPassword": "newpassword"
}
```

### 文章管理

#### 获取文章列表
```
GET /api/posts/list?page=1&pageSize=10&keyword=&category=
Authorization: Bearer {token}
```

#### 创建文章
```
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "文章标题",
  "excerpt": "文章摘要",
  "category": "技术",
  "date": "2024-01-15",
  "content": "# Markdown 内容"
}
```

#### 更新文章
```
PUT /api/posts/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "更新后的标题",
  "excerpt": "更新后的摘要",
  "category": "技术",
  "date": "2024-01-15",
  "content": "# 更新后的内容"
}
```

#### 删除文章
```
DELETE /api/posts/{id}
Authorization: Bearer {token}
```

#### 批量删除
```
POST /api/posts/batch-delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

#### 导出文章
```
GET /api/posts/export/excel
Authorization: Bearer {token}
```

### 个人信息

#### 获取个人信息
```
GET /api/profile
Authorization: Bearer {token}
```

#### 更新个人信息
```
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "博客主人",
  "role": "全栈开发者",
  "avatar": "👨‍💻",
  "social": {
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username",
    "email": "example@email.com"
  }
}
```

## 开发注意事项

1. **数据库连接**：后端使用 SQLite，同时连接管理后台数据库（admin.db）和博客数据库（../blog.db）

2. **JWT Secret**：生产环境请修改 `middleware/auth.js` 中的 `JWT_SECRET`

3. **Token 过期时间**：默认 24 小时，可在 `routes/auth.js` 中修改

4. **端口配置**：
   - 后端：3002
   - 前端：5001

5. **跨域配置**：已在后端配置 CORS，允许前端跨域访问

## 安全建议

1. 修改默认管理员密码
2. 修改 JWT Secret
3. 启用 HTTPS（生产环境）
4. 添加 IP 白名单
5. 定期备份数据库

## 常见问题

### 1. sqlite3 模块报错
```bash
npm rebuild sqlite3
```

### 2. 前端代理不生效
检查 `vite.config.ts` 中的 proxy 配置是否正确

### 3. Token 过期
清除浏览器 localStorage 中的 `admin_token`，重新登录

## 许可证

MIT
