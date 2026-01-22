const express = require('express');
const XLSX = require('xlsx');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

module.exports = (db) => {
  // 获取所有文章（包括已删除的）
  router.get('/list', authenticateToken, (req, res) => {
    const { page = 1, pageSize = 10, keyword = '', category = '' } = req.query;
    const offset = (page - 1) * pageSize;

    let query = 'SELECT * FROM posts_db.posts WHERE 1=1';
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
    
    db.get(countQuery, params, (err, countResult) => {
      if (err) {
        return res.status(500).json({ success: false, message: '查询失败' });
      }

      // 获取数据
      query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(pageSize), offset);

      db.all(query, params, (err, rows) => {
        if (err) {
          return res.status(500).json({ success: false, message: '查询失败' });
        }

        res.json({
          success: true,
          data: {
            list: rows,
            total: countResult.total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
          }
        });
      });
    });
  });

  // 获取文章详情
  router.get('/:id', authenticateToken, (req, res) => {
    db.get('SELECT * FROM posts_db.posts WHERE id = ?', [req.params.id], (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: '查询失败' });
      }
      if (!row) {
        return res.status(404).json({ success: false, message: '文章不存在' });
      }
      res.json({ success: true, data: row });
    });
  });

  // 创建文章
  router.post('/', authenticateToken, (req, res) => {
    const { title, excerpt, category, date, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: '必填字段不能为空' });
    }

    const query = `INSERT INTO posts_db.posts (title, excerpt, category, date, content) VALUES (?, ?, ?, ?, ?)`;
    const params = [
      title,
      excerpt || content.substring(0, 200),
      category,
      date || new Date().toISOString().split('T')[0],
      content
    ];

    db.run(query, params, function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: '创建失败' });
      }
      res.json({ success: true, data: { id: this.lastID } });
    });
  });

  // 更新文章
  router.put('/:id', authenticateToken, (req, res) => {
    const { title, excerpt, category, date, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: '必填字段不能为空' });
    }

    const query = `UPDATE posts_db.posts SET title = ?, excerpt = ?, category = ?, date = ?, content = ? WHERE id = ?`;
    const params = [
      title,
      excerpt || content.substring(0, 200),
      category,
      date || new Date().toISOString().split('T')[0],
      content,
      req.params.id
    ];

    db.run(query, params, function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: '更新失败' });
      }
      res.json({ success: true, message: '更新成功' });
    });
  });

  // 逻辑删除文章
  router.delete('/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM posts_db.posts WHERE id = ?', [req.params.id], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: '删除失败' });
      }
      res.json({ success: true, message: '删除成功' });
    });
  });

  // 批量删除文章
  router.post('/batch-delete', authenticateToken, (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: '请选择要删除的文章' });
    }

    const placeholders = ids.map(() => '?').join(',');
    db.run(`DELETE FROM posts_db.posts WHERE id IN (${placeholders})`, ids, function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: '批量删除失败' });
      }
      res.json({ success: true, message: `成功删除 ${this.changes} 篇文章` });
    });
  });

  // 导出文章为 Excel
  router.get('/export/excel', authenticateToken, (req, res) => {
    db.all('SELECT id, title, excerpt, category, date FROM posts_db.posts ORDER BY id DESC', (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: '导出失败' });
      }

      const data = rows.map(row => ({
        'ID': row.id,
        '标题': row.title,
        '摘要': row.excerpt,
        '分类': row.category,
        '日期': row.date
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
    });
  });

  // 获取所有分类
  router.get('/categories/all', authenticateToken, (req, res) => {
    db.all('SELECT DISTINCT category FROM posts_db.posts ORDER BY category', (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: '查询失败' });
      }
      res.json({
        success: true,
        data: rows.map(row => row.category)
      });
    });
  });

  return router;
};
