const express = require('express');
const XLSX = require('xlsx');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

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

module.exports = router;

// 获取所有文章（包括已删除的）
router.get('/list', authenticateToken, (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', category = '' } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const blogDb = req.blogDb;
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
    const countStmt = blogDb.prepare(countQuery);
    const countResult = countStmt.get(params);
    const countObj = rowToObject(countStmt, countResult);
    countStmt.free();

    // 获取数据
    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), offset);

    const stmt = blogDb.prepare(query);
    const result = stmt.all(params);
    const rows = rowsToObjectArray(stmt, result);
    stmt.free();

    res.json({
      success: true,
      data: {
        list: rows,
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

// 获取文章详情
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const blogDb = req.blogDb;
    const stmt = blogDb.prepare('SELECT * FROM posts WHERE id = ?');
    const result = stmt.get([req.params.id]);
    stmt.free();

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // 创建新的 stmt 来获取列名
    const stmt2 = blogDb.prepare('SELECT * FROM posts WHERE id = ?');
    const post = rowToObject(stmt2, result);
    stmt2.free();

    res.json({ success: true, data: post });
  } catch (err) {
    console.error('查询文章详情错误:', err);
    res.status(500).json({ success: false, message: '查询失败' });
  }
});

// 创建文章
router.post('/', authenticateToken, (req, res) => {
  const { title, excerpt, category, date, content } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ success: false, message: '必填字段不能为空' });
  }

  try {
    const blogDb = req.blogDb;
    const stmt = blogDb.prepare(
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
    const blogDbPath = path.join(__dirname, '../../blog.db');
    const data = blogDb.export();
    fs.writeFileSync(blogDbPath, Buffer.from(data));

    res.json({ success: true, data: { id: info.lastInsertRowid } });
  } catch (err) {
    console.error('创建文章错误:', err);
    res.status(500).json({ success: false, message: '创建失败' });
  }
});

// 更新文章
router.put('/:id', authenticateToken, (req, res) => {
  const { title, excerpt, category, date, content } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ success: false, message: '必填字段不能为空' });
  }

  try {
    const blogDb = req.blogDb;
    const stmt = blogDb.prepare(
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
    const blogDbPath = path.join(__dirname, '../../blog.db');
    const data = blogDb.export();
    fs.writeFileSync(blogDbPath, Buffer.from(data));

    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    console.error('更新文章错误:', err);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

// 逻辑删除文章
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const blogDb = req.blogDb;
    const stmt = blogDb.prepare('DELETE FROM posts WHERE id = ?');
    stmt.run([req.params.id]);
    stmt.free();

    // 保存数据库
    const blogDbPath = path.join(__dirname, '../../blog.db');
    const data = blogDb.export();
    fs.writeFileSync(blogDbPath, Buffer.from(data));

    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    console.error('删除文章错误:', err);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

// 批量删除文章
router.post('/batch-delete', authenticateToken, (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: '请选择要删除的文章' });
  }

  try {
    const blogDb = req.blogDb;
    const stmt = blogDb.prepare('DELETE FROM posts WHERE id = ?');
    let deletedCount = 0;

    for (const id of ids) {
      stmt.run([id]);
      deletedCount++;
    }
    stmt.free();

    // 保存数据库
    const blogDbPath = path.join(__dirname, '../../blog.db');
    const data = blogDb.export();
    fs.writeFileSync(blogDbPath, Buffer.from(data));

    res.json({ success: true, message: `成功删除 ${deletedCount} 篇文章` });
  } catch (err) {
    console.error('批量删除文章错误:', err);
    res.status(500).json({ success: false, message: '批量删除失败' });
  }
});

// 导出文章为 Excel
router.get('/export/excel', authenticateToken, (req, res) => {
  try {
    const blogDb = req.blogDb;
    const result = blogDb.exec('SELECT id, title, excerpt, category, date FROM posts ORDER BY id DESC');

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

// 获取所有分类
router.get('/categories/all', authenticateToken, (req, res) => {
  try {
    const blogDb = req.blogDb;
    const result = blogDb.exec('SELECT DISTINCT category FROM posts ORDER BY category');

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
