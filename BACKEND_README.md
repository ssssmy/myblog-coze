# 后端系统文档

## 架构说明

本项目采用前后端分离架构：
- **前端**: Vite + Vue 3，运行在 `http://localhost:5000`
- **后端**: Express.js，运行在 `http://localhost:3001`
- **API 代理**: Vite 配置了代理，前端请求 `/api/*` 会自动转发到后端

## 启动方式

### 启动后端服务器
```bash
node server.js
```
后端服务器将在 `http://localhost:3001` 启动

### 启动前端服务器
```bash
pnpm dev
```
或
```bash
coze dev
```
前端服务器将在 `http://localhost:5000` 启动

## API 接口文档

### 基础信息
- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **Response Format**: JSON

### 接口列表

#### 1. 健康检查
```
GET /api/health
```

**响应示例**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-21T14:00:00.000Z"
}
```

#### 2. 获取所有文章
```
GET /api/posts
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Vue 3 Composition API 深入理解",
      "excerpt": "文章摘要...",
      "category": "技术",
      "date": "2024-01-15",
      "content": "文章完整内容..."
    }
  ],
  "total": 6
}
```

#### 3. 按分类获取文章
```
GET /api/posts/category/:category
```

**参数**:
- `category`: 分类名称（如：技术、生活、随笔、全部）

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Vue 3 Composition API 深入理解",
      "category": "技术",
      "date": "2024-01-15"
    }
  ],
  "total": 3
}
```

#### 4. 获取文章详情
```
GET /api/posts/:id
```

**参数**:
- `id`: 文章ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Vue 3 Composition API 深入理解",
    "excerpt": "文章摘要...",
    "category": "技术",
    "date": "2024-01-15",
    "content": "文章完整内容..."
  }
}
```

#### 5. 获取所有分类
```
GET /api/categories
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "name": "全部",
      "count": 6
    },
    {
      "name": "技术",
      "count": 3
    },
    {
      "name": "生活",
      "count": 2
    },
    {
      "name": "随笔",
      "count": 1
    }
  ]
}
```

#### 6. 获取统计信息
```
GET /api/stats
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalPosts": 6,
    "totalCategories": 3,
    "latestPost": {
      "id": 1,
      "title": "Vue 3 Composition API 深入理解",
      "date": "2024-01-15"
    }
  }
}
```

## 错误处理

所有 API 返回的 JSON 格式统一：

**成功响应**:
```json
{
  "success": true,
  "data": {...}
}
```

**失败响应**:
```json
{
  "success": false,
  "message": "错误描述"
}
```

## 数据结构

### Post（文章）
```typescript
{
  id: number;           // 文章ID
  title: string;        // 文章标题
  excerpt: string;      // 文章摘要
  category: string;     // 文章分类
  date: string;         // 发布日期 (YYYY-MM-DD)
  content: string;      // 文章完整内容
}
```

### Category（分类）
```typescript
{
  name: string;         // 分类名称
  count: number;        // 该分类下的文章数量
}
```

## 技术栈

- **Node.js**: JavaScript 运行环境
- **Express.js**: Web 框架
- **CORS**: 跨域资源共享中间件

## 扩展建议

未来可以添加的功能：
1. 文章的增删改查 (CRUD) API
2. 用户认证和授权
3. 评论功能
4. 标签系统
5. 搜索功能
6. 分页功能
7. 数据库集成（MongoDB/PostgreSQL）
8. 图片上传功能

## 测试

使用 curl 测试 API:

```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取所有文章
curl http://localhost:3001/api/posts

# 按分类获取文章
curl http://localhost:3001/api/posts/category/技术

# 获取文章详情
curl http://localhost:3001/api/posts/1
```

通过前端代理测试（端口 5000）:
```bash
# 通过前端代理访问
curl http://localhost:5000/api/posts
```
