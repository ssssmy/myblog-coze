const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db = null;
let SQL = null;
const dbPath = path.join(__dirname, '../../blog.db');

// 将 sql.js 返回的数组转换为对象
function rowToObject(stmt, row) {
  const columns = stmt.getColumnNames();
  const obj = {};
  columns.forEach((col, i) => obj[col] = row[i]);
  return obj;
}

// 将 sql.js 返回的数组列表转换为对象列表
function rowsToObjectArray(stmt, rows) {
  const columns = stmt.getColumnNames();
  return rows.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
}

// 初始化数据库
async function initializeDatabase() {
  try {
    SQL = await initSqlJs();

    // 如果数据库文件存在，则加载它
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('✅ 数据库连接成功（从文件加载）');
    } else {
      // 否则创建新数据库
      db = new SQL.Database();
      console.log('✅ 数据库创建成功');
    }

    // 创建 users 表（管理后台用户表）
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('✅ users 表创建成功');

    // 创建默认管理员账号（用户名：admin，密码：admin123）
    try {
      const defaultPassword = bcrypt.hashSync('admin123', 10);
      const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
      stmt.bind(['admin']);
      const hasUser = stmt.step();
      stmt.free();

      if (!hasUser) {
        db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
          ['admin', defaultPassword, 'admin@blog.com']);
        console.log('✅ 默认管理员账号已创建 (admin/admin123)');
      }
    } catch (err) {
      console.error('创建默认管理员失败:', err.message);
    }

    // 创建 posts 表（文章表）
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      content TEXT NOT NULL
    )`);
    console.log('✅ posts 表创建成功');

    // 检查是否有示例数据，如果没有则插入
    const result = db.exec('SELECT COUNT(*) as count FROM posts');
    if (result.length === 0 || result[0].values[0][0] === 0) {
      insertSampleData();
      console.log('✅ 示例数据插入完成');
    } else {
      console.log(`✅ 数据库已有 ${result[0].values[0][0]} 条记录`);
    }

    // 保存数据库到文件
    saveDatabase();
  } catch (err) {
    console.error('数据库初始化失败:', err);
  }
}

// 保存数据库到文件
function saveDatabase() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('保存数据库失败:', err);
  }
}

// 插入示例数据
function insertSampleData() {
  const stmt = db.prepare(`INSERT INTO posts (title, excerpt, category, date, content) VALUES (?, ?, ?, ?, ?)`);

  stmt.run([
    'Vue 3 Composition API 深入理解',
    'Vue 3 的 Composition API 为我们提供了更灵活的代码组织方式。本文将深入探讨其核心概念、使用场景以及最佳实践。',
    '技术',
    '2024-01-15',
    `# Vue 3 Composition API 深入理解

Vue 3 的 Composition API 是一个重要的新特性，它改变了我们组织 Vue 组件代码的方式。与传统的 Options API 相比，Composition API 提供了更好的代码组织、逻辑复用和类型推断能力。

## 核心概念

### setup() 函数

Composition API 的核心是 \`setup()\` 函数，这是组件中所有组合式 API 的入口点。在 setup 函数中，我们可以定义响应式状态、计算属性、方法，并将它们返回给模板使用。

\`\`\`javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return { count, doubled, increment }
  }
}
\`\`\`

### ref 和 reactive

使用 \`ref\` 和 \`reactive\` 是创建响应式数据的两种主要方式：

- **ref**: 用于创建包装对象的响应式引用，通常用于基本类型值
- **reactive**: 用于创建响应式对象

理解它们之间的区别和使用场景是非常重要的。

\`\`\`javascript
import { ref, reactive } from 'vue'

// ref 用于基本类型
const count = ref(0)

// reactive 用于对象
const state = reactive({
  name: 'Vue',
  version: 3
})
\`\`\`

## 最佳实践

1. **按功能组织代码**: 将相关的逻辑放在一起
2. **使用组合函数**: 提取可复用的逻辑
3. **合理使用 ref 和 reactive**: 根据数据类型选择合适的方式
4. **避免过度拆分**: 保持代码的可读性

## 总结

Composition API 为 Vue 3 带来了更好的代码组织和复用能力，值得深入学习和实践。`
  ]);

  stmt.run([
    'TypeScript 高级类型技巧',
    '掌握 TypeScript 的高级类型特性，可以让你的代码更加健壮和类型安全。本文介绍泛型、条件类型、映射类型等高级技巧。',
    '技术',
    '2024-01-10',
    `# TypeScript 高级类型技巧

TypeScript 的类型系统非常强大，除了基本的类型注解外，还提供了许多高级类型特性。掌握这些特性可以让我们写出更加健壮和类型安全的代码。

## 泛型（Generics）

泛型是 TypeScript 中最重要的特性之一。它允许我们编写可以适用于多种类型的代码，同时保持类型安全。

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}

// 使用示例
const result1 = identity<string>("hello")
const result2 = identity<number>(42)
\`\`\`

### 泛型约束

我们可以对泛型进行约束，限制其范围：

\`\`\`typescript
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}
\`\`\`

## 条件类型

条件类型允许我们根据类型关系来选择类型：

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T

type Result = NonNullable<string | null> // string
\`\`\`

## 映射类型

映射类型允许我们基于现有类型创建新类型：

\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}

interface User {
  name: string
  age: number
}

type PartialUser = Partial<User>
// { name?: string; age?: number }
\`\`\`

## 总结

掌握 TypeScript 的高级类型特性，可以大大提升代码的质量和可维护性。持续学习和实践是关键。`
  ]);

  stmt.run([
    '我的程序员工涯感悟',
    '作为一个程序员，我经历了从学生到职场人的转变。在这篇文章中，我分享一些关于职业发展的思考和感悟。',
    '随笔',
    '2024-01-05',
    `# 我的程序员工涯感悟

从大学时代开始接触编程，到现在已经过去了五年时间。这五年里，我从一个对代码一无所知的新手，成长为能够独立完成项目的开发者。

## 初学者的困惑

刚开始学习编程的时候，我觉得非常困难。那些复杂的语法、抽象的概念，让我一度想要放弃。

- **语法**: 代码的规则和格式
- **概念**: 抽象的编程思想
- **调试**: 找出并修复错误的痛苦过程

但是当我第一次成功运行自己写的程序时，那种成就感让我坚定了继续学习的决心。

## 技术成长

### 学习曲线

技术的学习曲线是陡峭的，但也是值得的：

1. **基础**: 掌握基本语法和概念
2. **实践**: 通过项目锻炼能力
3. **深入**: 理解底层原理
4. **创新**: 创造新的解决方案

### 持续学习

技术更新换代很快，持续学习是必须的：

> "活到老，学到老。" - 这在技术领域尤为重要

## 职业发展

作为一名程序员，职业发展路径有很多选择：

- 技术专家
- 团队管理
- 创业
- 自由职业

每条路都有其特点和挑战，关键是找到适合自己的方向。

## 总结

程序员的成长之路充满挑战，但也充满机遇。保持学习的热情，拥抱变化，不断提升自己，你就能在这个领域走得更远。`
  ]);

  stmt.run([
    '如何保持高效的学习状态',
    '在快速变化的技术领域，持续学习是必不可少的。本文分享一些我在学习过程中总结的方法和技巧。',
    '生活',
    '2024-01-01',
    `# 如何保持高效的学习状态

在快速变化的技术领域，保持高效的学习状态是非常重要的。作为一个程序员，我每天都在面对新的技术和挑战，如何才能高效地学习呢？

## 明确学习目标

首先，要有明确的学习目标。在开始学习之前，先问问自己：

1. 我想学什么？
2. 为什么要学它？
3. 学会之后能用它做什么？

明确的目标能够让我们保持学习的动力和方向。

## 制定学习计划

一个好的学习计划应该包括：

- **长期目标**: 你想达到什么样的水平
- **短期目标**: 每个阶段需要完成什么
- **时间安排**: 每天或每周投入多少时间

\`\`\`
示例计划：
- 第1-2周：学习基础概念
- 第3-4周：完成实践项目
- 第5-6周：深入理解和优化
\`\`\`

## 实践是最好的老师

光看不练是学不会的。一定要动手实践：

> "纸上得来终觉浅，绝知此事要躬行。"

### 实践方法

1. **复制代码**: 先运行示例代码
2. **修改代码**: 改变参数，观察结果
3. **独立项目**: 从零开始完成一个项目

## 保持专注

学习需要专注，避免分心：

- 使用番茄工作法
- 关闭通知干扰
- 创造安静的学习环境

## 总结

高效学习需要明确目标、制定计划、勤于实践、保持专注。掌握这些方法，你就能在技术道路上走得更远。`
  ]);

  stmt.free();
}

// ==================== 公开 API 路由（无需认证）====================

// 获取所有分类
app.get('/api/categories', (req, res) => {
  try {
    const result = db.exec('SELECT DISTINCT category FROM posts ORDER BY category');
    const categories = result.length > 0 ? result[0].values.map(row => row[0]) : [];

    // 为每个分类添加文章数量统计
    const categoriesWithCount = categories.map(category => {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM posts WHERE category = ?');
      const countResult = stmt.get([category]);
      const countObj = rowToObject(stmt, countResult);
      stmt.free();

      return {
        name: category,
        count: countObj.count
      };
    });

    res.json({ success: true, data: categoriesWithCount });
  } catch (err) {
    console.error('获取分类失败:', err);
    res.status(500).json({ success: false, message: '获取分类失败' });
  }
});

// 根据分类获取文章
app.get('/api/posts', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM posts ORDER BY date DESC';
    let params = [];

    if (category) {
      query = 'SELECT * FROM posts WHERE category = ? ORDER BY date DESC';
      params = [category];
    }

    const stmt = db.prepare(query);
    stmt.bind(params);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('获取文章失败:', err);
    res.status(500).json({ success: false, message: '获取文章失败' });
  }
});

// 根据分类获取文章（仅返回标题和摘要）
app.get('/api/posts/titles', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT id, title, excerpt, category, date FROM posts ORDER BY date DESC';
    let params = [];

    if (category) {
      query = 'SELECT id, title, excerpt, category, date FROM posts WHERE category = ? ORDER BY date DESC';
      params = [category];
    }

    const stmt = db.prepare(query);
    stmt.bind(params);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('获取文章失败:', err);
    res.status(500).json({ success: false, message: '获取文章失败' });
  }
});

// 根据ID获取文章详情
app.get('/api/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
    const result = stmt.get([id]);
    stmt.free();

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // 创建新的 stmt 来获取列名
    const stmt2 = db.prepare('SELECT * FROM posts WHERE id = ?');
    const post = rowToObject(stmt2, result);
    stmt2.free();

    res.json({ success: true, data: post });
  } catch (err) {
    console.error('获取文章详情失败:', err);
    res.status(500).json({ success: false, message: '获取文章详情失败' });
  }
});

// 搜索文章
app.get('/api/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const stmt = db.prepare(
      'SELECT id, title, excerpt, category, date FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY date DESC'
    );
    stmt.bind([`%${q}%`, `%${q}%`]);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();

    res.json(posts);
  } catch (err) {
    console.error('搜索失败:', err);
    res.status(500).json({ error: '搜索失败' });
  }
});

// ==================== 管理 API 路由（需要认证）====================

// 用户登录
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const result = stmt.get([username]);
    stmt.free();

    if (!result || result.length === 0) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 创建新的 stmt 来获取列名
    const stmt2 = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = rowToObject(stmt2, result);
    stmt2.free();

    // 验证密码
    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 生成 JWT token
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('./middleware/auth');
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (err) {
    console.error('登录错误:', err);
    return res.status(500).json({ success: false, message: '数据库错误' });
  }
});

// 修改密码
app.post('/api/auth/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: '参数不完整' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const result = stmt.get([username]);
    stmt.free();

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // 创建新的 stmt 来获取列名
    const stmt2 = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = rowToObject(stmt2, result);
    stmt2.free();

    const isValid = bcrypt.compareSync(oldPassword, user.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: '原密码错误' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updateStmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    updateStmt.run([hashedPassword, user.id]);
    updateStmt.free();

    // 保存数据库
    saveDatabase();

    res.json({ success: true, message: '密码修改成功' });
  } catch (err) {
    console.error('修改密码错误:', err);
    return res.status(500).json({ success: false, message: '修改失败' });
  }
});

// 认证中间件
const authenticateToken = (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('./middleware/auth');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证令牌' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: '令牌无效或已过期' });
    }
    req.user = user;
    next();
  });
};

// 获取文章列表（管理后台）
app.get('/api/admin/posts/list', authenticateToken, (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', category = '' } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    if (!db) {
      console.error('db is undefined!');
      return res.status(500).json({ success: false, message: '数据库未初始化' });
    }

    let query = 'SELECT * FROM posts WHERE 1=1';
    let params = [];

    if (keyword) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // 先获取总数
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(params);
    const countObj = rowToObject(countStmt, countResult);
    countStmt.free();

    // 获取数据
    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), offset);

    const stmt = db.prepare(query);
    stmt.bind(params);

    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }

    stmt.free();

    res.json({
      success: true,
      data: {
        list: result,
        total: countObj.total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (err) {
    console.error('查询文章列表错误:', err);
    res.status(500).json({ success: false, message: '查询失败' });
  }
});

// 获取文章详情（管理后台）
app.get('/api/admin/posts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
    const result = stmt.get([id]);
    stmt.free();

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // 创建新的 stmt 来获取列名
    const stmt2 = db.prepare('SELECT * FROM posts WHERE id = ?');
    const post = rowToObject(stmt2, result);
    stmt2.free();

    res.json({ success: true, data: post });
  } catch (err) {
    console.error('查询文章详情错误:', err);
    res.status(500).json({ success: false, message: '查询失败' });
  }
});

// 创建文章
app.post('/api/admin/posts', authenticateToken, (req, res) => {
  const { title, excerpt, category, date, content } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ success: false, message: '必填字段不能为空' });
  }

  try {
    const stmt = db.prepare(
      `INSERT INTO posts (title, excerpt, category, date, content) VALUES (?, ?, ?, ?, ?)`
    );
    const info = stmt.run([
      title,
      excerpt || content.substring(0, 200),
      category,
      date || new Date().toISOString().split('T')[0],
      content
    ]);
    stmt.free();

    // 保存数据库
    saveDatabase();

    res.json({ success: true, data: { id: info.lastInsertRowid } });
  } catch (err) {
    console.error('创建文章错误:', err);
    res.status(500).json({ success: false, message: '创建失败' });
  }
});

// 更新文章
app.put('/api/admin/posts/:id', authenticateToken, (req, res) => {
  const { title, excerpt, category, date, content } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ success: false, message: '必填字段不能为空' });
  }

  try {
    const stmt = db.prepare(
      `UPDATE posts SET title = ?, excerpt = ?, category = ?, date = ?, content = ? WHERE id = ?`
    );
    stmt.run([
      title,
      excerpt || content.substring(0, 200),
      category,
      date || new Date().toISOString().split('T')[0],
      content,
      req.params.id
    ]);
    stmt.free();

    // 保存数据库
    saveDatabase();

    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    console.error('更新文章错误:', err);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

// 删除文章
app.delete('/api/admin/posts/:id', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    stmt.run([req.params.id]);
    stmt.free();

    // 保存数据库
    saveDatabase();

    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    console.error('删除文章错误:', err);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

// 批量删除文章
app.post('/api/admin/posts/batch-delete', authenticateToken, (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: '请选择要删除的文章' });
  }

  try {
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    let deletedCount = 0;

    for (const id of ids) {
      stmt.run([id]);
      deletedCount++;
    }
    stmt.free();

    // 保存数据库
    saveDatabase();

    res.json({ success: true, message: `成功删除 ${deletedCount} 篇文章` });
  } catch (err) {
    console.error('批量删除文章错误:', err);
    res.status(500).json({ success: false, message: '批量删除失败' });
  }
});

// 获取所有分类（管理后台）
app.get('/api/admin/posts/categories/all', authenticateToken, (req, res) => {
  try {
    const result = db.exec('SELECT DISTINCT category FROM posts ORDER BY category');

    if (result.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    res.json({
      success: true,
      data: result[0].values.map(row => row[0])
    });
  } catch (err) {
    console.error('查询分类错误:', err);
    res.status(500).json({ success: false, message: '查询失败' });
  }
});

// 导出文章为 Excel
app.get('/api/admin/posts/export/excel', authenticateToken, (req, res) => {
  try {
    const XLSX = require('xlsx');
    const result = db.exec('SELECT id, title, excerpt, category, date FROM posts ORDER BY id DESC');

    if (result.length === 0) {
      return res.status(500).json({ success: false, message: '导出失败' });
    }

    const columns = result[0].columns;
    const data = result[0].values.map(row => ({
      'ID': row[0],
      '标题': row[1],
      '摘要': row[2],
      '分类': row[3],
      '日期': row[4]
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '文章列表');

    const filename = `文章列表_${new Date().toISOString().split('T')[0]}.xlsx`;
    const filePath = `/tmp/${filename}`;

    XLSX.writeFile(workbook, filePath);

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('下载文件失败:', err);
      }
    });
  } catch (err) {
    console.error('导出文章错误:', err);
    res.status(500).json({ success: false, message: '导出失败' });
  }
});

// 公开获取个人信息（博客主页使用，无需认证）
app.get('/api/public/profile', (req, res) => {
  const profilePath = path.join(__dirname, '../../profile.json');

  if (fs.existsSync(profilePath)) {
    const data = fs.readFileSync(profilePath, 'utf8');
    res.json({ success: true, data: JSON.parse(data) });
  } else {
    res.json({
      success: true,
      data: {
        name: '博客主人',
        role: '全栈开发者',
        avatar: '👨‍💻',
        social: {
          github: '',
          twitter: '',
          email: ''
        }
      }
    });
  }
});

// 获取个人信息（需要认证，管理后台使用）
app.get('/api/profile', authenticateToken, (req, res) => {
  const profilePath = path.join(__dirname, '../../profile.json');

  if (fs.existsSync(profilePath)) {
    const data = fs.readFileSync(profilePath, 'utf8');
    res.json({ success: true, data: JSON.parse(data) });
  } else {
    res.json({
      success: true,
      data: {
        name: '博客主人',
        role: '全栈开发者',
        avatar: '👨‍💻',
        social: {
          github: '',
          twitter: '',
          email: ''
        }
      }
    });
  }
});

// 更新个人信息
app.put('/api/profile', authenticateToken, (req, res) => {
  const { name, role, avatar, social } = req.body;

  const profileData = {
    name: name || '博客主人',
    role: role || '全栈开发者',
    avatar: avatar || '👨‍💻',
    social: social || {
      github: '',
      twitter: '',
      email: ''
    }
  };

  const profilePath = path.join(__dirname, '../../profile.json');
  fs.writeFileSync(profilePath, JSON.stringify(profileData, null, 2));

  res.json({ success: true, message: '个人信息更新成功' });
});

// 启动服务器
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 博客后端服务运行在 http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
});
