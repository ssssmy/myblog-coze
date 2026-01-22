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
const dbPath = path.join(__dirname, '../../blog.db');
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
        content: `# Vue 3 Composition API 深入理解

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
      },
      {
        title: 'TypeScript 高级类型技巧',
        excerpt: '掌握 TypeScript 的高级类型特性，可以让你的代码更加健壮和类型安全。本文介绍泛型、条件类型、映射类型等高级技巧。',
        category: '技术',
        date: '2024-01-10',
        content: `# TypeScript 高级类型技巧

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
      },
      {
        title: '我的程序员工涯感悟',
        excerpt: '作为一个程序员，我经历了从学生到职场人的转变。在这篇文章中，我分享一些关于职业发展的思考和感悟。',
        category: '随笔',
        date: '2024-01-05',
        content: `# 我的程序员工涯感悟

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
      },
      {
        title: '如何保持高效的学习状态',
        excerpt: '在快速变化的技术领域，持续学习是必不可少的。本文分享一些我在学习过程中总结的方法和技巧。',
        category: '生活',
        date: '2024-01-01',
        content: `# 如何保持高效的学习状态

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
      },
      {
        title: '前端性能优化实战指南',
        excerpt: '从代码层面到架构层面，全方位介绍前端性能优化的策略和最佳实践，帮助你构建更快的 Web 应用。',
        category: '技术',
        date: '2023-12-28',
        content: `# 前端性能优化实战指南

前端性能优化是提升用户体验的关键因素之一。一个快速响应的网站不仅能让用户感到满意，还能提高搜索引擎排名和转化率。本文将介绍一些实用的前端性能优化技巧。

## 加载性能优化

### 代码分割和懒加载

代码分割和懒加载是优化首屏加载时间的重要手段。通过将代码拆分成多个小块，我们可以按需加载资源，减少初始加载时间。

\`\`\`javascript
// 动态 import 实现懒加载
const LazyComponent = lazy(() => import('./LazyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
\`\`\`

### 图片优化

- 使用 WebP 格式
- 实现图片懒加载
- 压缩图片大小
- 使用 CDN 加速

\`\`\`html
<img 
  src="image.webp" 
  loading="lazy" 
  alt="描述" 
  width="800" 
  height="600"
/>
\`\`\`

## 运行时性能优化

### 虚拟列表

对于长列表，使用虚拟列表可以大幅提升性能：

\`\`\`javascript
// 只渲染可见区域的列表项
const visibleItems = items.slice(startIndex, endIndex)
\`\`\`

### 防抖和节流

对于频繁触发的事件，使用防抖和节流：

\`\`\`javascript
// 防抖：延迟执行
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流：限制执行频率
function throttle(fn, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
\`\`\`

## 性能监控

使用工具监控性能：

- Chrome DevTools
- Lighthouse
- WebPageTest
- Performance API

\`\`\`javascript
// 使用 Performance API
const perfData = performance.getEntriesByType('navigation')[0]
console.log('页面加载时间:', perfData.loadEventEnd - perfData.fetchStart)
\`\`\`

## 总结

前端性能优化是一个持续的过程，需要从多个方面入手。通过合理使用代码分割、懒加载、图片优化等技术，我们可以显著提升应用性能。`
      },
      {
        title: '周末的咖啡时光',
        excerpt: '在一个阳光明媚的周末，我来到了一家安静的咖啡馆，享受难得的闲暇时光。',
        category: '生活',
        date: '2023-12-25',
        content: `# 周末的咖啡时光

这是一个阳光明媚的周末，我决定给自己放个假，来到城市角落里的一家安静咖啡馆。推开木门，浓郁的咖啡香气扑面而来，让人瞬间放松下来。

## 咖啡馆的小确幸

点了一杯拿铁，找了一个靠窗的位置坐下。阳光透过玻璃窗洒在桌面上，给整个空间镀上了一层金色的光晕。街道上行人稀少，偶尔有几辆车驶过，打破了午后的宁静。

> 生活不需要太多的奢华，一杯咖啡、一缕阳光，就足以让人感到幸福。

## 观察与思考

坐在咖啡馆里，我开始观察周围的每一个人：

- 角落里的老人，正在专心地看报纸
- 年轻的情侣，低声交谈着什么
- 学生模样的女孩，在电脑上敲击着键盘

每个人都有自己的故事，每个人都在为了生活而努力。

## 放松身心

这样的时光，是难得的休息。平时忙碌的生活，让我们很少有时间停下来，好好看看这个世界。

> 忙碌是为了更好地生活，但别忘了生活本身。

## 归途

黄昏时分，我起身离开。夕阳的余晖洒在街道上，为这个美好的周末画上了一个完美的句号。带着满满的能量，我准备好迎接新的一周了。

---

生活需要这样的小确幸，让我们在忙碌中找到平衡，在平凡中发现美好。`
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
