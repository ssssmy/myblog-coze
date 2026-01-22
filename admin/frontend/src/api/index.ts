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
  return request.get('/posts/list', { params })
}

// 获取文章详情
export const getPostDetail = (id: number) => {
  return request.get(`/posts/${id}`)
}

// 创建文章
export const createPost = (data: any) => {
  return request.post('/posts', data)
}

// 更新文章
export const updatePost = (id: number, data: any) => {
  return request.put(`/posts/${id}`, data)
}

// 删除文章
export const deletePost = (id: number) => {
  return request.delete(`/posts/${id}`)
}

// 批量删除文章
export const batchDeletePosts = (ids: number[]) => {
  return request.post('/posts/batch-delete', { ids })
}

// 导出文章
export const exportPosts = () => {
  return request.get('/posts/export/excel', { responseType: 'blob' })
}

// 获取所有分类
export const getCategories = () => {
  return request.get('/posts/categories/all')
}

// 获取个人信息
export const getProfile = () => {
  return request.get('/profile')
}

// 更新个人信息
export const updateProfile = (data: any) => {
  return request.put('/profile', data)
}
