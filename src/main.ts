import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

console.log('开始初始化 Vue 应用...');

try {
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
  console.log('Vue 应用已成功挂载');
} catch (error) {
  console.error('Vue 应用初始化失败:', error);
}
