const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3002;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const profileRoutes = require('./routes/profile');

// 初始化数据库并启动服务
async function startServer() {
  const SQL = await initSqlJs();

  const adminDbPath = path.join(__dirname, 'admin.db');
  const blogDbPath = path.join(__dirname, '../../blog.db');

  // 初始化管理后台数据库
  let adminDb;
  if (fs.existsSync(adminDbPath)) {
    const fileBuffer = fs.readFileSync(adminDbPath);
    adminDb = new SQL.Database(fileBuffer);
    console.log('✅ 管理后台数据库连接成功');
  } else {
    adminDb = new SQL.Database();
    console.log('✅ 管理后台数据库创建成功');
  }

  // 创建 users 表
  adminDb.run(`CREATE TABLE IF NOT EXISTS users (
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
    const stmt = adminDb.prepare('SELECT * FROM users WHERE username = ?');
    stmt.bind(['admin']);
    const hasUser = stmt.step();
    stmt.free();

    if (!hasUser) {
      adminDb.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        ['admin', defaultPassword, 'admin@blog.com']);
      console.log('✅ 默认管理员账号已创建 (admin/admin123)');
    }
  } catch (err) {
    console.error('创建默认管理员失败:', err.message);
  }

  // 保存管理后台数据库
  const adminData = adminDb.export();
  fs.writeFileSync(adminDbPath, Buffer.from(adminData));

  // 初始化博客数据库
  let blogDb;
  if (fs.existsSync(blogDbPath)) {
    const blogFileBuffer = fs.readFileSync(blogDbPath);
    blogDb = new SQL.Database(blogFileBuffer);
    console.log('✅ 连接博客数据库成功');
  } else {
    blogDb = new SQL.Database();
    console.log('✅ 创建博客数据库成功');
  }

  // 创建 posts 表（如果不存在）
  blogDb.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    content TEXT NOT NULL
  )`);

  // 保存博客数据库
  const blogData = blogDb.export();
  fs.writeFileSync(blogDbPath, Buffer.from(blogData));

  console.log('✅ 附加博客数据库成功');

  // 将数据库实例附加到请求对象
  app.use((req, res, next) => {
    req.adminDb = adminDb;
    req.blogDb = blogDb;
    next();
  });

  // 注册路由（在数据库初始化之后）
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/profile', profileRoutes);

  // 启动服务
  app.listen(PORT, () => {
    console.log(`🚀 管理后台后端服务运行在 http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});
