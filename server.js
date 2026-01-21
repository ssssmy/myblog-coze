const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// SQLite 数据库连接
const dbPath = path.join(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('✅ 数据库连接成功');
  }
});

// 初始化数据库表
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // 创建 posts 表
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      content TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('创建表失败:', err.message);
        reject(err);
      } else {
        console.log('✅ 数据表创建成功');
        // 检查是否有数据，如果没有则插入示例数据
        db.get('SELECT COUNT(*) as count FROM posts', (err, row) => {
          if (err) {
            reject(err);
          } else if (row.count === 0) {
            insertSampleData().then(resolve).catch(reject);
          } else {
            console.log(`✅ 数据库已有 ${row.count} 条记录`);
            resolve();
          }
        });
      }
    });
  });
}

// 插入示例数据
function insertSampleData() {
  return new Promise((resolve, reject) => {
    const samplePosts = [
      {
        title: 'Vue 3 Composition API 深入理解',
        excerpt: 'Vue 3 的 Composition API 为我们提供了更灵活的代码组织方式。本文将深入探讨其核心概念、使用场景以及最佳实践。',
        category: '技术',
        date: '2024-01-15',
        content: `Vue 3 的 Composition API 是一个重要的新特性，它改变了我们组织 Vue 组件代码的方式。与传统的 Options API 相比，Composition API 提供了更好的代码组织、逻辑复用和类型推断能力。

Composition API 的核心是 setup() 函数，这是组件中所有组合式 API 的入口点。在 setup 函数中，我们可以定义响应式状态、计算属性、方法，并将它们返回给模板使用。

使用 ref 和 reactive 是创建响应式数据的两种主要方式。ref 用于创建包装对象的响应式引用，通常用于基本类型值；而 reactive 则用于创建响应式对象。理解它们之间的区别和使用场景是非常重要的。`
      },
      {
        title: 'TypeScript 高级类型技巧',
        excerpt: '掌握 TypeScript 的高级类型特性，可以让你的代码更加健壮和类型安全。本文介绍泛型、条件类型、映射类型等高级技巧。',
        category: '技术',
        date: '2024-01-10',
        content: `TypeScript 的类型系统非常强大，除了基本的类型注解外，还提供了许多高级类型特性。掌握这些特性可以让我们写出更加健壮和类型安全的代码。

泛型（Generics）是 TypeScript 中最重要的特性之一。它允许我们编写可以适用于多种类型的代码，同时保持类型安全。我们可以使用泛型来创建可复用的函数、类和接口。`
      },
      {
        title: '我的程序员工涯感悟',
        excerpt: '作为一个程序员，我经历了从学生到职场人的转变。在这篇文章中，我分享一些关于职业发展的思考和感悟。',
        category: '随笔',
        date: '2024-01-05',
        content: `从大学时代开始接触编程，到现在已经过去了五年时间。这五年里，我从一个对代码一无所知的新手，成长为能够独立完成项目的开发者。

刚开始学习编程的时候，我觉得非常困难。那些复杂的语法、抽象的概念，让我一度想要放弃。但是当我第一次成功运行自己写的程序时，那种成就感让我坚定了继续学习的决心。`
      },
      {
        title: '如何保持高效的学习状态',
        excerpt: '在快速变化的技术领域，持续学习是必不可少的。本文分享一些我在学习过程中总结的方法和技巧。',
        category: '生活',
        date: '2024-01-01',
        content: `在快速变化的技术领域，保持高效的学习状态是非常重要的。作为一个程序员，我每天都在面对新的技术和挑战，如何才能高效地学习呢？

首先，要有明确的学习目标。在开始学习之前，先问问自己：我想学什么？为什么要学它？学会之后能用它做什么？明确的目标能够让我们保持学习的动力和方向。`
      },
      {
        title: '前端性能优化实战指南',
        excerpt: '从代码层面到架构层面，全方位介绍前端性能优化的策略和最佳实践，帮助你构建更快的 Web 应用。',
        category: '技术',
        date: '2023-12-28',
        content: `前端性能优化是提升用户体验的关键因素之一。一个快速响应的网站不仅能让用户感到满意，还能提高搜索引擎排名和转化率。本文将介绍一些实用的前端性能优化技巧。

代码分割和懒加载是优化首屏加载时间的重要手段。通过将代码拆分成多个小块，我们可以按需加载资源，减少初始加载时间。Webpack 的动态 import 语法和 Vue 的异步组件是实现代码分割的常用方式。`
      },
      {
        title: '周末的咖啡时光',
        excerpt: '在一个阳光明媚的周末，我来到了一家安静的咖啡馆，享受难得的闲暇时光。',
        category: '生活',
        date: '2023-12-25',
        content: `这是一个阳光明媚的周末，我决定给自己放个假，来到城市角落里的一家安静咖啡馆。推开木门，浓郁的咖啡香气扑面而来，让人瞬间放松下来。

点了一杯拿铁，找了一个靠窗的位置坐下。阳光透过玻璃窗洒在桌面上，给整个空间镀上了一层金色的光晕。街道上行人稀少，偶尔有几辆车驶过，打破了午后的宁静。`
      }
    ];

    const stmt = db.prepare('INSERT INTO posts (title, excerpt, category, date, content) VALUES (?, ?, ?, ?, ?)');

    db.serialize(() => {
      samplePosts.forEach(post => {
        stmt.run(post.title, post.excerpt, post.category, post.date, post.content);
      });
      stmt.finalize((err) => {
        if (err) {
          console.error('插入示例数据失败:', err.message);
          reject(err);
        } else {
          console.log(`✅ 成功插入 ${samplePosts.length} 条示例数据`);
          resolve();
        }
      });
    });
  });
}

// API 路由

// 获取所有文章
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: '获取文章列表失败'
      });
    } else {
      res.json({
        success: true,
        data: rows,
        total: rows.length
      });
    }
  });
});

// 根据分类获取文章
app.get('/api/posts/category/:category', (req, res) => {
  const category = decodeURIComponent(req.params.category);
  let query = 'SELECT * FROM posts';
  let params = [];

  if (category !== '全部') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY date DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: '获取文章列表失败'
      });
    } else {
      res.json({
        success: true,
        data: rows,
        total: rows.length
      });
    }
  });
});

// 获取单篇文章详情
app.get('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: '获取文章详情失败'
      });
    } else if (row) {
      res.json({
        success: true,
        data: row
      });
    } else {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
  });
});

// 获取所有分类
app.get('/api/categories', (req, res) => {
  db.all('SELECT category, COUNT(*) as count FROM posts GROUP BY category', [], (err, rows) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: '获取分类列表失败'
      });
    } else {
      db.get('SELECT COUNT(*) as total FROM posts', [], (err, totalRow) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: '获取总数失败'
          });
        } else {
          res.json({
            success: true,
            data: [
              { name: '全部', count: totalRow.total },
              ...rows.map(row => ({ name: row.category, count: row.count }))
            ]
          });
        }
      });
    }
  });
});

// 获取统计信息
app.get('/api/stats', (req, res) => {
  db.get('SELECT COUNT(*) as totalPosts FROM posts', [], (err, postCountRow) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: '获取统计信息失败'
      });
    } else {
      db.all('SELECT COUNT(DISTINCT category) as totalCategories FROM posts', [], (err, catCountRow) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: '获取分类统计失败'
          });
        } else {
          db.get('SELECT * FROM posts ORDER BY date DESC LIMIT 1', [], (err, latestRow) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: '获取最新文章失败'
              });
            } else {
              res.json({
                success: true,
                data: {
                  totalPosts: postCountRow.totalPosts,
                  totalCategories: catCountRow[0].totalCategories,
                  latestPost: latestRow
                }
              });
            }
          });
        }
      });
    }
  });
});

// 获取个人信息
app.get('/api/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Alex Chen',
      role: '全栈开发工程师',
      bio: '热爱技术与生活',
      avatar: '👨‍💻',
      social: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        email: 'hello@example.com'
      }
    }
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📝 API 端点:`);
    console.log(`   GET  /api/health        - 健康检查`);
    console.log(`   GET  /api/posts         - 获取所有文章`);
    console.log(`   GET  /api/posts/:id     - 获取文章详情`);
    console.log(`   GET  /api/posts/category/:category - 按分类获取文章`);
    console.log(`   GET  /api/categories    - 获取所有分类`);
    console.log(`   GET  /api/stats         - 获取统计信息`);
    console.log(`   GET  /api/profile       - 获取个人信息`);
  });
}).catch(err => {
  console.error('数据库初始化失败:', err.message);
  process.exit(1);
});

// 优雅关闭
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('关闭数据库连接失败:', err.message);
    } else {
      console.log('✅ 数据库连接已关闭');
    }
    process.exit(0);
  });
});
