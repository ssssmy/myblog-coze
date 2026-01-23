const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

module.exports = router;

// 用户登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
  }

  try {
    const adminDb = req.adminDb;
    const stmt = adminDb.prepare('SELECT * FROM users WHERE username = :username');
    const result = stmt.all({ ':username': username });
    stmt.free();

    if (result.length === 0) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const user = {
      id: result[0][0],
      username: result[0][1],
      password: result[0][2],
      email: result[0][3]
    };

    // 验证密码
    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 生成 JWT token
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
router.post('/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: '参数不完整' });
  }

  try {
    const adminDb = req.adminDb;
    const stmt = adminDb.prepare('SELECT * FROM users WHERE username = :username');
    const result = stmt.all({ ':username': username });
    stmt.free();

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const user = {
      id: result[0][0],
      password: result[0][2]
    };

    const isValid = bcrypt.compareSync(oldPassword, user.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: '原密码错误' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updateStmt = adminDb.prepare('UPDATE users SET password = :password WHERE id = :id');
    updateStmt.run({ ':password': hashedPassword, ':id': user.id });
    updateStmt.free();

    // 保存数据库
    const adminDbPath = path.join(__dirname, '../admin.db');
    const data = adminDb.export();
    fs.writeFileSync(adminDbPath, Buffer.from(data));

    res.json({ success: true, message: '密码修改成功' });
  } catch (err) {
    console.error('修改密码错误:', err);
    return res.status(500).json({ success: false, message: '修改失败' });
  }
});

module.exports = router;
