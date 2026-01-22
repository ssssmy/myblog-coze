import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../pages/Home.vue';
import Post from '../pages/Post.vue';
import Category from '../pages/Category.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/post/:id',
    name: 'post',
    component: Post,
  },
  {
    path: '/category/:name',
    name: 'category',
    component: Category,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
