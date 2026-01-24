import request from './request'

// 用户登录
export const login = (data: { username: string; password: string }) => {
  return request.post<any>('/auth/login', data)
}

// 修改密码
export const changePassword = (data: { username: string; oldPassword: string; newPassword: string }) => {
  return request.post('/auth/change-password', data)
}

// 获取文章列表
export const getPostList = (params: any) => {
  return request.get('/admin/posts/list', { params })
}

// 获取文章详情
export const getPostDetail = (id: number) => {
  return request.get(`/admin/posts/${id}`)
}

// 创建文章
export const createPost = (data: any) => {
  return request.post('/admin/posts', data)
}

// 更新文章
export const updatePost = (id: number, data: any) => {
  return request.put(`/admin/posts/${id}`, data)
}

// 删除文章
export const deletePost = (id: number) => {
  return request.delete(`/admin/posts/${id}`)
}

// 批量删除文章
export const batchDeletePosts = (ids: number[]) => {
  return request.post('/admin/posts/batch-delete', { ids })
}

// 导出文章
export const exportPosts = () => {
  return request.get('/admin/posts/export/excel', { responseType: 'blob' })
}

// 获取所有分类（用于下拉选择）
export const getCategories = () => {
  return request.get('/admin/posts/categories/all')
}

// 获取分类列表（带分页）
export const getCategoryList = (params: any) => {
  return request.get('/admin/categories', { params })
}

// 获取分类树（用于树形展示）
export const getCategoryTree = () => {
  return request.get('/admin/categories/tree')
}

// 创建分类
export const createCategory = (data: any) => {
  return request.post('/admin/categories', data)
}

// 更新分类
export const updateCategory = (id: number, data: any) => {
  return request.put(`/admin/categories/${id}`, data)
}

// 删除分类（支持单个或批量删除）
export const deleteCategory = (id: number | number[]) => {
  if (Array.isArray(id)) {
    return request.post('/admin/categories/batch-delete', { ids: id })
  }
  return request.delete(`/admin/categories/${id}`)
}

// 获取个人信息
export const getProfile = () => {
  return request.get('/profile')
}

// 更新个人信息
export const updateProfile = (data: any) => {
  return request.put('/profile', data)
}
