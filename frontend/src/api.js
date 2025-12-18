import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Posts
export const getAllPosts = () => API.get('/posts');
export const getPostById = (postId) => API.get(`/posts/${postId}`);
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
// PROFILE APIs
export const getMyProfile = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/users/update', data);
export const changePassword = (data) => API.put('/users/change-password', data);

export const createPost = (data) => API.post('/posts', data);
export const updatePost = (postId, data) => API.put(`/posts/${postId}`, data);
export const deletePost = (postId) => API.delete(`/posts/${postId}`);

// Likes
export const likePost = (postId) => API.post(`/posts/${postId}/like`);

// Comments
export const getComments = (postId) => API.get(`/comments/${postId}`);
export const createComment = (postId, data) => API.post(`/comments/${postId}`, data);
export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`);

export default API;
