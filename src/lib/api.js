// 获取你的Render后端域名，请替换为实际的域名
const RENDER_BACKEND_URL = 'https://xiaoku.onrender.com';

const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) || (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost' ? `${RENDER_BACKEND_URL}/api` : 'http://localhost:3001/api');

// 获取存储的token
const getToken = () => {
    return localStorage.getItem('authToken');
};

// 通用API请求函数
const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // 如果有token，添加到请求头
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options,
        });

        if (!response.ok) {
            let errorText = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorText = errorData.error || errorText;
            } catch { }
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
};

// 用户认证相关API
export const authAPI = {
    // 用户注册
    register: async (userData) => {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        // 保存token到localStorage
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }

        return response;
    },

    // 用户登录
    login: async (credentials) => {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // 保存token到localStorage
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }

        return response;
    },

    // 退出登录
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    // 检查是否已登录
    isAuthenticated: () => {
        return !!getToken();
    }
};

// 帖子相关API
export const postsAPI = {
    // 获取用户的所有帖子
    getUserPosts: async (userId) => {
        return apiRequest(`/posts/${userId}`);
    },

    // 创建新帖子
    createPost: async (postData) => {
        return apiRequest('/posts', {
            method: 'POST',
            body: JSON.stringify(postData),
        });
    },

    // 删除帖子
    deletePost: async (postId) => {
        return apiRequest(`/posts/${postId}`, {
            method: 'DELETE',
        });
    },

    // 清空用户所有帖子
    clearUserPosts: async (userId) => {
        return apiRequest(`/posts/user/${userId}`, {
            method: 'DELETE',
        });
    },
};

// 评论相关API
export const commentsAPI = {
    // 添加评论
    addComment: async (commentData) => {
        return apiRequest('/comments', {
            method: 'POST',
            body: JSON.stringify(commentData),
        });
    },

    // 删除评论
    deleteComment: async (commentId) => {
        return apiRequest(`/comments/${commentId}`, {
            method: 'DELETE',
        });
    },
};

// 导出所有API
export default {
    auth: authAPI,
    posts: postsAPI,
    comments: commentsAPI,
};
