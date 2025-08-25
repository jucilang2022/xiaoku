# 后端部署指南

## 部署到 Railway

### 1. 准备工作

#### 1.1 确保代码已提交到GitHub
```bash
git add .
git commit -m "准备部署到Railway"
git push origin main
```

#### 1.2 检查MongoDB Atlas设置
- 确保MongoDB Atlas集群已创建
- 获取连接字符串
- 设置网络访问（允许所有IP或Railway的IP）

### 2. 部署到Railway

#### 2.1 注册Railway账号
- 访问 [railway.app](https://railway.app)
- 使用GitHub账号登录

#### 2.2 创建新项目
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择你的代码仓库

#### 2.3 配置环境变量
在Railway项目设置中添加以下环境变量：

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

**重要提示：**
- 将 `username`、`password`、`cluster`、`database_name` 替换为你的实际MongoDB信息
- `JWT_SECRET` 应该是一个长且随机的字符串

#### 2.4 部署
- Railway会自动检测到Node.js项目
- 点击 "Deploy" 开始部署
- 等待部署完成

#### 2.5 获取部署URL
- 部署完成后，Railway会提供一个URL
- 格式类似：`https://your-app-name.railway.app`

### 3. 更新前端配置

#### 3.1 修改前端API基础URL
在Vercel项目设置中添加环境变量：

```
VITE_API_BASE_URL=https://your-app-name.railway.app/api
```

#### 3.2 重新部署前端
- 提交代码更改
- Vercel会自动重新部署

### 4. 测试部署

#### 4.1 测试健康检查
访问：`https://your-app-name.railway.app/api/health`

应该返回：
```json
{
  "ok": true,
  "time": "2024-01-01T00:00:00.000Z"
}
```

#### 4.2 测试用户注册
使用Postman或前端测试注册功能

### 5. 常见问题解决

#### 5.1 部署失败
- 检查环境变量是否正确设置
- 查看Railway部署日志
- 确保所有依赖都在package.json中

#### 5.2 数据库连接失败
- 检查MongoDB Atlas网络设置
- 确认连接字符串格式正确
- 检查用户名密码是否正确

#### 5.3 CORS错误
- 检查前端域名是否在CORS允许列表中
- 可能需要更新server.js中的CORS配置

### 6. 监控和维护

#### 6.1 查看日志
- 在Railway控制台查看应用日志
- 监控错误和性能

#### 6.2 更新部署
- 推送代码到GitHub
- Railway会自动重新部署

#### 6.3 扩展资源
- 根据使用情况调整Railway资源分配
- 监控使用量和费用

## 其他部署选项

### Render
- 免费额度：750小时/月
- 部署简单，支持自动部署

### Heroku
- 经典选择，但免费层已取消
- 需要信用卡验证

### Vercel Serverless Functions
- 适合轻量级API
- 与前端部署在同一平台
