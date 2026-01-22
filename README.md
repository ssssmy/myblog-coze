# 博客系统

一个基于 Vue 3 + Express.js 的现代化博客系统，包含炫酷的前台展示和功能完善的后台管理。

## 项目简介

> **重要声明：本项目完全由 Coze 自动生成，开发者不参与任何代码编写工作。**

本项目是一个前后端分离的博客系统，采用现代化的技术栈，具备以下特点：
- 炫酷的动画效果和交互体验
- 完整的内容管理功能
- 响应式设计，支持多终端访问
- 前后端分离架构，易于扩展和维护

## 核心特性

### 主项目前台
- 炫酷的首页动画效果（粒子特效、打字机效果）
- 文章分类和筛选功能
- 文章详情展示（Markdown渲染）
- 左右分栏布局（分类文章树 + 内容区）
- 响应式设计，适配各种设备

### 管理后台
- 用户登录认证（JWT Token）
- 文章管理（增删改查、批量操作）
- 文章导入导出（Excel格式）
- 个人信息配置
- 数据统计仪表盘
- 分类管理

## 技术栈

### 主项目
- **前端**
  - Vue 3（组合式 API）
  - TypeScript
  - Vite（构建工具）
  - Tailwind CSS（样式框架）
  - Vue Router（路由管理）
  - marked（Markdown渲染）

- **后端**
  - Express.js（Web框架）
  - SQLite3（数据库）

### 管理后台
- **前端**
  - Vue 3
  - TypeScript
  - Element Plus（UI组件库）
  - Vue Router
  - Pinia（状态管理）
  - Axios（HTTP客户端）
  - marked（Markdown渲染）

- **后端**
  - Express.js
  - SQLite3
  - JWT（身份认证）
  - bcryptjs（密码加密）
  - XLSX（Excel导出）

## 项目结构

```
.
├── .npmrc                      # npm 配置文件（固定 Node 版本）
├── .nvmrc                      # nvm 配置文件（Node 18.20.0）
├── .gitignore                  # Git 忽略文件
├── package.json                # 项目根配置
├── README.md                   # 项目文档
├── scripts/                    # 工具脚本
│   ├── start-all.bat/sh        # 启动所有服务
│   ├── start-master.bat/sh     # 启动主项目
│   ├── start-admin.bat/sh      # 启动管理后台
│   ├── stop-all.bat/sh         # 停止所有服务
│   ├── check-ports.bat/sh      # 端口检查工具
│   ├── check-env.bat/sh        # 环境检查工具
│   └── TROUBLESHOOTING.md      # 故障排除指南
├── admin/                      # 管理后台
│   ├── backend/                # 管理后台后端
│   │   ├── .npmrc              # npm 配置
│   │   ├── admin.db            # 管理后台数据库（用户数据）
│   │   ├── middleware/         # 中间件
│   │   │   └── auth.js         # JWT认证中间件
│   │   ├── routes/             # 路由
│   │   │   ├── auth.js         # 认证路由
│   │   │   ├── posts.js        # 文章路由
│   │   │   └── profile.js      # 个人信息路由
│   │   ├── server.js           # 服务器入口
│   │   ├── package.json
│   │   └── scripts/
│   │       └── start.sh        # 启动脚本
│   ├── frontend/               # 管理后台前端
│   │   ├── src/
│   │   │   ├── api/            # API封装
│   │   │   ├── components/     # 组件
│   │   │   ├── layout/         # 布局组件
│   │   │   ├── router/         # 路由配置
│   │   │   ├── styles/         # 全局样式
│   │   │   └── views/          # 页面组件
│   │   │       ├── Login.vue   # 登录页
│   │   │       ├── Dashboard.vue # 仪表盘
│   │   │       ├── Posts.vue   # 文章管理
│   │   │       ├── PostEdit.vue # 文章编辑
│   │   │       └── Profile.vue # 个人信息
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── README.md
├── master/                     # 主项目
│   ├── backend/                # 主项目后端
│   │   ├── .npmrc              # npm 配置
│   │   ├── server.js           # 服务器入口
│   │   ├── package.json
│   │   └── scripts/
│   │       └── start.sh        # 启动脚本
│   ├── frontend/               # 主项目前端
│   │   ├── .npmrc              # npm 配置
│   │   ├── src/
│   │   │   ├── components/     # 组件
│   │   │   │   ├── Header.vue  # 头部导航
│   │   │   │   └── Footer.vue  # 底部导航
│   │   │   ├── pages/          # 页面
│   │   │   │   ├── Home.vue    # 首页
│   │   │   │   ├── Category.vue # 分类页
│   │   │   │   └── Post.vue    # 文章详情
│   │   │   ├── router/         # 路由配置
│   │   │   ├── api.js          # API封装
│   │   │   ├── main.ts         # 应用入口
│   │   │   └── index.css       # 全局样式
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── README.md
├── blog.db                     # 博客数据库（文章数据，共享）
└── README.md
```

## 快速开始

### 环境要求

**Node.js 版本要求**
- 必须使用 Node.js >= 18.20.0
- 推荐使用 Node.js 18.20.0 或更高版本
- 项目已配置 .npmrc 文件强制检查 Node 版本

**包管理器**
- 主项目前端: pnpm >= 9.0.0
- 其他项目: npm >= 8.0.0

**检查 Node 版本**
```bash
node --version
# 输出应 >= 18.20.0
```

如果 Node 版本不符合要求，请先升级 Node.js：
- 访问 [Node.js 官网](https://nodejs.org/) 下载推荐版本
- 或使用 [nvm](https://github.com/nvm-sh/nvm) 管理多个 Node 版本

**环境检查工具**

项目提供了环境检查脚本，可以快速验证开发环境是否符合要求：

**Windows:**
```cmd
scripts\check-env.bat
```

**Linux/macOS:**
```bash
bash scripts/check-env.sh
```

该脚本会检查：
- Node.js 版本（必须 >= 18.20.0）
- npm 版本
- pnpm 版本（建议 >= 9.0.0）

### Node 版本管理

项目使用多个方式来固定和管理 Node 版本：

**1. .nvmrc 文件**
```bash
# 使用 nvm 的用户会自动切换到正确的版本
cat .nvmrc  # 输出: 18.20.0
```

**2. .npmrc 文件**
```
engine-strict=true
node-version=18.20.0
```

**3. package.json 中的 engines 字段**
```json
{
  "engines": {
    "node": ">=18.20.0"
  }
}
```

**使用 nvm 管理 Node 版本（推荐）**

安装 nvm（如果尚未安装）：
```bash
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows
# 访问 https://github.com/coreybutler/nvm-windows/releases 下载安装
```

使用正确的 Node 版本：
```bash
# 安装指定版本
nvm install 18.20.0

# 切换到指定版本
nvm use 18.20.0

# 设置为默认版本
nvm alias default 18.20.0
```

### 使用启动脚本（推荐）

项目提供了自动化启动脚本，支持 Windows、Linux 和 macOS。

#### Linux/macOS

**启动所有服务**
```bash
bash scripts/start-all.sh
# 或
./scripts/start-all.sh
```

**仅启动主项目**
```bash
bash scripts/start-master.sh
```

**仅启动管理后台**
```bash
bash scripts/start-admin.sh
```

**停止所有服务**
```bash
bash scripts/stop-all.sh
```

#### Windows

**启动所有服务**
双击 `scripts\start-all.bat` 或在命令行中运行：
```cmd
scripts\start-all.bat
```

**仅启动主项目**
双击 `scripts\start-master.bat`

**仅启动管理后台**
双击 `scripts\start-admin.bat`

**停止所有服务**
双击 `scripts\stop-all.bat`

详细脚本说明请查看 [scripts/README.md](scripts/README.md)

#### 端口检查和故障排除

如果遇到端口占用问题，可以使用以下工具：

**检查端口状态**
- Windows: `scripts\check-ports.bat`
- Linux/macOS: `bash scripts/check-ports.sh`

**故障排除指南**
详细的故障排除步骤请查看 [scripts/TROUBLESHOOTING.md](scripts/TROUBLESHOOTING.md)

### 手动启动

#### 主项目

**1. 启动后端服务（端口 3001）**
```bash
cd master/backend
npm install
npm start
```

**2. 启动前端服务（端口 5000）**
```bash
cd master/frontend
pnpm install
pnpm dev
```

**3. 访问应用**
打开浏览器访问 [http://localhost:5000](http://localhost:5000)

### 管理后台

**1. 启动后端服务（端口 3002）**
```bash
cd admin/backend
npm install
npm start
```

**2. 启动前端服务（端口 5001）**
```bash
cd admin/frontend
npm install
npm run dev
```

**3. 访问管理后台**
打开浏览器访问 [http://localhost:5001](http://localhost:5001)

**默认账号**
- 用户名：`admin`
- 密码：`admin123`

## 端口说明

| 服务 | 端口 | 说明 |
|------|------|------|
| 主项目前端 | 5000 | Vue 3 + Vite 开发服务器 |
| 主项目后端 | 3001 | Express.js API 服务 |
| 管理后台前端 | 5001 | Vue 3 + Element Plus 开发服务器 |
| 管理后台后端 | 3002 | Express.js API 服务 |

## 数据库说明

### 数据库结构

项目使用 SQLite 数据库：

**blog.db**（根目录 - 共享数据库）
- 存储文章数据（posts 表）
- 主项目和管理后台共享此数据库
- 通过 SQLite ATTACH DATABASE 实现共享访问

**admin.db**（admin/backend/ - 管理后台专用）
- 存储用户数据（users 表）
- 仅管理后台使用

### 数据表结构

**blog.db - posts 表**
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,              -- 文章标题
  excerpt TEXT NOT NULL,            -- 文章摘要
  category TEXT NOT NULL,           -- 文章分类
  date TEXT NOT NULL,               -- 发布日期
  content TEXT NOT NULL             -- 文章内容（Markdown格式）
)
```

**admin.db - users 表**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,    -- 用户名
  password TEXT NOT NULL,            -- 加密密码（bcrypt）
  email TEXT UNIQUE NOT NULL,       -- 邮箱
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- 创建时间
)
```

## API 文档

### 主项目后端 API

**基础 URL**: `http://localhost:3001/api`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /health | 健康检查 |
| GET | /posts | 获取所有文章 |
| GET | /posts/:id | 获取文章详情 |
| GET | /posts/category/:category | 按分类获取文章 |
| GET | /categories | 获取所有分类 |
| GET | /stats | 获取统计信息 |
| GET | /profile | 获取个人信息 |

### 管理后台后端 API

**基础 URL**: `http://localhost:3002/api`

需要 JWT Token 认证（除登录接口外）

#### 认证相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /auth/login | 用户登录 | 否 |
| POST | /auth/register | 用户注册 | 否 |

#### 文章管理

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /posts/list | 获取文章列表（分页） | 是 |
| GET | /posts/:id | 获取文章详情 | 是 |
| POST | /posts | 创建文章 | 是 |
| PUT | /posts/:id | 更新文章 | 是 |
| DELETE | /posts/:id | 删除文章 | 是 |
| POST | /posts/batch-delete | 批量删除文章 | 是 |
| GET | /posts/export/excel | 导出文章为 Excel | 是 |
| GET | /posts/categories/all | 获取所有分类 | 是 |

#### 个人信息

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /profile | 获取个人信息 | 是 |
| PUT | /profile | 更新个人信息 | 是 |

**认证方式**

在请求头中添加 JWT Token：
```
Authorization: Bearer <your_token>
```

## 开发规范

### 依赖管理

- **主项目**：使用 `pnpm` 管理依赖
  ```bash
  pnpm install          # 安装依赖
  pnpm add <package>    # 添加依赖
  pnpm add -D <package> # 添加开发依赖
  ```

- **管理后台**：使用 `npm` 管理依赖
  ```bash
  npm install          # 安装依赖
  npm install <package> # 添加依赖
  npm install -D <package> # 添加开发依赖
  ```

### 代码规范

- 使用 TypeScript 确保类型安全
- 遵循 ESLint 规范
- 组件化开发
- 统一代码风格（Prettier）

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

## 部署指南

### 生产构建

**主项目前端**
```bash
cd master/frontend
pnpm build
```
构建产物在 `master/frontend/dist` 目录

**管理后台前端**
```bash
cd admin/frontend
npm run build
```
构建产物在 `admin/frontend/dist` 目录

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 主项目
    location / {
        root /path/to/master/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 管理后台
    location /admin {
        alias /path/to/admin/frontend/dist;
        try_files $uri $uri/ /admin/index.html;
    }

    # 主项目后端 API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 管理后台后端 API
    location /admin/api/ {
        rewrite ^/admin/api/(.*)$ /$1 break;
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### 使用 PM2 管理后端服务

**安装 PM2**
```bash
npm install -g pm2
```

**启动服务**
```bash
pm2 start master/backend/server.js --name blog-master-backend
pm2 start admin/backend/server.js --name blog-admin-backend
```

**查看服务状态**
```bash
pm2 status
```

**开机自启**
```bash
pm2 startup
pm2 save
```

## 常见问题

### 1. 端口被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :5000
# 或
netstat -ano | findstr :5000

# 杀死进程
kill -9 <PID>
```

### 2. 数据库连接失败

**检查项**:
- 确认数据库文件路径正确
- 确认数据库文件权限可读写
- 检查 SQLite 版本兼容性

### 3. 前端代理配置问题

**开发环境**：
前端通过 Vite 代理访问后端 API，确保 `vite.config.ts` 中的代理配置正确：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### 4. 依赖安装失败

**主项目**:
```bash
# 清除缓存
rm -rf node_modules .pnpm-store
pnpm install
```

**管理后台**:
```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 更新日志

### v1.0.0 (2024-01-22)
- 初始版本发布
- 实现主项目前台展示功能
- 实现管理后台功能
- 完成前后端分离架构
- 支持文章管理、分类管理
- 支持 Markdown 渲染
- 支持 Excel 导出

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 作者：Vibe Coding
- 邮箱：contact@example.com
- 项目地址：[GitHub](https://github.com/yourusername/blog-system)

## 致谢

感谢所有为本项目做出贡献的开发者！

---

**祝您使用愉快！如有问题，欢迎提 Issue。**
