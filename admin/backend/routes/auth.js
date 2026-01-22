const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET } = require('../middleware/auth');

module.exports = (db) => {
  // 用户登录
  router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }

      if (!user) {
        return res.status(401).json({ success: false, message: '用户名或密码错误' });
      }

      // 验证密码
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          return res.status(500).json({ success: false, message: '认证失败' });
        }

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
      });
    });
  });

  // 修改密码
  router.post('/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: '参数不完整' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err || !user) {
        return res.status(404).json({ success: false, message: '用户不存在' });
      }

      bcrypt.compare(oldPassword, user.password, (err, isValid) => {
        if (err || !isValid) {
          return res.status(401).json({ success: false, message: '原密码错误' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: '修改失败' });
          }
          res.json({ success: true, message: '密码修改成功' });
        });
      });
    });
  });

  return router;
};
