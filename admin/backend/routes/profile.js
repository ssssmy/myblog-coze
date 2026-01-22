const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

module.exports = (db) => {
  // 更新个人信息
  router.put('/', authenticateToken, (req, res) => {
  const { name, role, avatar, social } = req.body;

  // 这里应该将个人信息保存到配置文件或数据库
  // 为了简化，我们直接写入到主站的 profile API
  // 实际项目中应该有专门的配置表

  // 更新主站的 profile.json（如果存在）
  const fs = require('fs');
  const path = require('path');
  const profilePath = path.join(__dirname, '../../profile.json');

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

  fs.writeFile(profilePath, JSON.stringify(profileData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: '保存失败' });
    }
    res.json({ success: true, message: '个人信息更新成功' });
  });
});

// 获取个人信息
router.get('/', authenticateToken, (req, res) => {
  const fs = require('fs');
  const path = require('path');
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

  return router;
};
