console.log('测试脚本已加载');
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = '<h1 style="color: red; font-size: 48px;">这是直接设置的内容</h1>';
    console.log('已设置内容到 app div');
  } else {
    console.error('找不到 app div');
  }
});
