const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3002;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQLite 数据库连接
const dbPath = path.join(__dirname, '../../admin.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('✅ 管理后台数据库连接成功');
  }
});

// 初始化数据库表
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // 创建 users 表
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('创建 users 表失败:', err.message);
        reject(err);
      } else {
        console.log('✅ users 表创建成功');
        
        // 创建默认管理员账号（用户名：admin，密码：admin123）
        const bcrypt = require('bcryptjs');
        const defaultPassword = bcrypt.hashSync('admin123', 10);
        
        db.run(`INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)`,
          ['admin', defaultPassword, 'admin@blog.com'],
          (err) => {
            if (err) {
              console.error('创建默认管理员失败:', err.message);
            } else {
              console.log('✅ 默认管理员账号已创建 (admin/admin123)');
            }
          }
        );
      }
    });

    // 创建 posts 表（共享主站数据库的 posts 表）
    const blogDbPath = path.join(__dirname, '../../blog.db');
    const blogDb = new sqlite3.Database(blogDbPath, (err) => {
      if (err) {
        console.error('连接博客数据库失败:', err.message);
      } else {
        console.log('✅ 连接博客数据库成功');
      }
    });

    // 将博客数据库的 posts 表附加为 posts_db
    db.run(`ATTACH DATABASE '${blogDbPath}' AS posts_db`, (err) => {
      if (err) {
        console.error('附加数据库失败:', err.message);
      } else {
        console.log('✅ 附加博客数据库成功');
        resolve();
      }
    });
  });
}

// 路由
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const profileRoutes = require('./routes/profile');

app.use('/api/auth', authRoutes(db));
app.use('/api/posts', postRoutes(db));
app.use('/api/profile', profileRoutes(db));

// 启动服务器
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 管理后台后端服务运行在 http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
});
