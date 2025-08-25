# 个人导航应用

一个简洁的个人导航应用，支持自定义链接、笔记记录和个性化设置。

## 功能特性

- 🚀 **快速导航**: 自定义常用网站链接
- 📝 **笔记记录**: 支持文本和图片的笔记功能
- 🎨 **个性化设置**: 自定义主题、布局和头像
- 💾 **云数据库**: 使用MongoDB Atlas云数据库，数据持久化
- 🔐 **用户认证**: 简单的用户注册和登录系统

## 技术架构

- **前端**: React 19 + Vite (部署在 Vercel)
- **后端**: Express.js服务器 (部署在 Render)
- **数据库**: MongoDB Atlas
- **样式**: CSS3 + 响应式设计

## 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd nav
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发环境
```bash
# 同时启动前后端
npm run dev:full

# 或者分别启动
npm run server    # 后端服务器 (端口3001)
npm run dev       # 前端开发服务器 (端口5173)
```

### 4. 访问应用
- 前端: http://localhost:5173
- 后端: http://localhost:3001

## 项目结构

```
nav/
├── src/
│   ├── components/     # React组件
│   ├── hooks/         # 自定义Hooks
│   ├── lib/           # 工具库和API
│   └── assets/        # 静态资源
├── data/              # 数据文件存储
├── server.js          # Express后端服务器
└── package.json       # 项目配置
```

## 数据存储

应用使用MongoDB Atlas云数据库存储数据，包括：
- 用户信息
- 笔记内容
- 评论数据

## 部署说明

当前架构已部署到生产环境：
- **前端**: Vercel (自动部署，全球CDN)
- **后端**: Render (自动部署，支持Node.js)
- **数据库**: MongoDB Atlas (云数据库服务)

## 开发指南

### 添加新功能
1. 在`src/components/`中创建新组件
2. 在`src/hooks/`中添加相关逻辑
3. 在`server.js`中添加API接口
4. 更新数据模型

### 代码规范
- 使用ES6+语法
- 组件使用函数式组件和Hooks
- 遵循React最佳实践

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
