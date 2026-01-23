// API 基础配置
const API_BASE_URL = '/api';

// API 请求函数
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API 请求错误:', error);
    throw error;
  }
}

// 获取所有文章
export async function getAllPosts() {
  return apiRequest('/posts');
}

// 根据分类获取文章（使用查询参数）
export async function getPostsByCategory(category) {
  return apiRequest(`/posts?category=${encodeURIComponent(category)}`);
}

// 获取文章详情
export async function getPostById(id) {
  return apiRequest(`/posts/${id}`);
}

// 获取所有分类
export async function getCategories() {
  return apiRequest('/categories');
}

// 获取统计信息
export async function getStats() {
  return apiRequest('/stats');
}

// 健康检查
export async function healthCheck() {
  return apiRequest('/health');
}
