# Render部署指南 - 免费后端部署

## 🎯 为什么选择Render？

- ✅ **完全免费**：750小时/月
- ✅ **自动部署**：连接GitHub自动更新
- ✅ **支持Node.js**：完美兼容你的项目
- ✅ **全球CDN**：访问速度快
- ✅ **SSL证书**：自动HTTPS

## 🚀 部署步骤

### 第一步：准备代码

确保你的代码已提交到GitHub：

```bash
git add .
git commit -m "准备部署到Render"
git push origin main
```

### 第二步：注册Render账号

1. 访问 [render.com](https://render.com)
2. 点击 **"Get Started"**
3. 选择 **"Continue with GitHub"**
4. 授权GitHub访问权限

### 第三步：创建Web Service

1. 在Render控制台点击 **"New +"**
2. 选择 **"Web Service"**
3. 连接你的GitHub仓库
4. 选择包含后端代码的仓库

### 第四步：配置部署设置

#### 基本设置：
- **Name**: `xiaoku-backend`
- **Environment**: `Node`
- **Region**: 选择离你最近的地区（如Singapore）
- **Branch**: `main`
- **Root Directory**: 留空（如果代码在根目录）

#### 构建和启动命令：
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### 第五步：配置环境变量

在 **"Environment Variables"** 部分添加：

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority` |
| `JWT_SECRET` | `你的JWT密钥` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://www.xiaoku.fun` |
| `PORT` | `10000` |

**重要提示：**
- 将MongoDB连接字符串中的占位符替换为实际值
- JWT_SECRET应该是一个长且随机的字符串

### 第六步：部署

1. 点击 **"Create Web Service"**
2. Render会自动开始构建和部署
3. 等待部署完成（通常需要2-5分钟）

### 第七步：获取部署URL

部署完成后，Render会提供一个URL：
- 格式：`https://xiaoku-backend.onrender.com`
- 或者：`https://你的自定义域名.onrender.com`

## 🧪 测试部署

### 测试健康检查
访问：`https://你的域名.onrender.com/api/health`

应该返回：
```json
{
  "ok": true,
  "time": "2024-01-01T00:00:00.000Z"
}
```

### 测试用户注册
使用Postman或前端测试注册功能

## 🔧 更新前端配置

### 在Vercel中添加环境变量：
```
VITE_API_BASE_URL=https://你的域名.onrender.com/api
```

### 重新部署前端：
- 提交代码更改
- Vercel会自动重新部署

## 📊 监控和维护

### 查看部署状态
- 在Render控制台查看部署日志
- 监控应用性能

### 自动部署
- 每次推送代码到GitHub，Render会自动重新部署
- 无需手动操作

### 查看日志
- 在Render控制台查看应用日志
- 监控错误和性能

## 🆘 常见问题解决

### 1. 部署失败
- 检查环境变量是否正确
- 查看构建日志
- 确保所有依赖都在package.json中

### 2. 数据库连接失败
- 检查MongoDB Atlas网络设置
- 确认连接字符串格式正确
- 检查用户名密码

### 3. 应用无法启动
- 检查startCommand是否正确
- 查看启动日志
- 确认PORT环境变量设置

### 4. 健康检查失败
- 确认healthCheckPath设置正确
- 检查应用是否正常启动
- 查看应用日志

## 💡 优化建议

### 1. 性能优化
- 启用Render的自动扩展
- 配置合适的资源分配

### 2. 安全优化
- 定期更换JWT_SECRET
- 监控异常访问

### 3. 成本控制
- 免费计划每月750小时
- 监控使用量，避免超出免费额度

## 🎉 部署完成后的效果

- ✅ 后端API正常运行
- ✅ 前端可以正常访问后端
- ✅ 用户注册、登录、发帖、评论功能正常
- ✅ 完全免费，无需担心费用

现在开始部署吧！如果遇到任何问题，随时告诉我。
