# MongoDB Atlas 设置指南

## 什么是 MongoDB Atlas？

MongoDB Atlas 是 MongoDB 的官方云数据库服务，提供：
- 🆓 **免费层**: 512MB 存储，完全免费
- 🌐 **全球部署**: 可选择最近的服务器
- 🔒 **安全可靠**: 自动备份和加密
- 📊 **监控工具**: 实时性能监控

## 快速设置步骤

### 1. 创建 MongoDB Atlas 账户

1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 点击 "Try Free" 或 "Get Started Free"
3. 填写基本信息并创建账户

### 2. 创建数据库集群

1. 选择 **FREE** 计划 (M0)
2. 选择云服务商 (推荐 AWS)
3. 选择地区 (推荐香港或新加坡，延迟较低)
4. 点击 "Create"

### 3. 设置数据库访问

1. 在左侧菜单选择 "Database Access"
2. 点击 "Add New Database User"
3. 创建用户名和密码 (请记住这些信息)
4. 选择 "Read and write to any database"
5. 点击 "Add User"

### 4. 设置网络访问

1. 在左侧菜单选择 "Network Access"
2. 点击 "Add IP Address"
3. 选择 "Allow Access from Anywhere" (输入 0.0.0.0/0)
4. 点击 "Confirm"

### 5. 获取连接字符串

1. 回到 "Database" 页面
2. 点击 "Connect"
3. 选择 "Connect your application"
4. 复制连接字符串

## 配置环境变量

### 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
# MongoDB Atlas 连接字符串
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nav-app?retryWrites=true&w=majority

# JWT 密钥 (生产环境请使用强密钥)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 服务器端口
PORT=3001
```

### 替换连接字符串中的参数

将连接字符串中的以下部分替换为你的实际值：
- `username`: 你的数据库用户名
- `password`: 你的数据库密码
- `cluster`: 你的集群名称
- `nav-app`: 数据库名称 (可以自定义)

## 测试连接

### 1. 启动服务器

```bash
npm run server
```

如果看到以下消息，说明连接成功：
```
🚀 服务器运行在端口 3001
📊 使用MongoDB数据库
✅ MongoDB连接成功
```

### 2. 测试注册功能

1. 启动前端: `npm run dev`
2. 尝试注册新用户
3. 检查 MongoDB Atlas 控制台是否显示新用户

## 常见问题

### 连接失败

**错误**: `MongoDB连接失败: ENOTFOUND`

**解决方案**:
1. 检查网络连接
2. 确认 IP 地址已添加到白名单
3. 验证连接字符串格式

### 认证失败

**错误**: `Authentication failed`

**解决方案**:
1. 检查用户名和密码
2. 确认用户有正确的权限
3. 验证数据库名称

### 权限不足

**错误**: `Insufficient permissions`

**解决方案**:
1. 检查用户权限设置
2. 确认用户有读写权限
3. 验证数据库访问设置

## 生产环境建议

### 1. 安全设置

- 使用强密码
- 限制 IP 访问范围
- 启用双因素认证
- 定期轮换密钥

### 2. 监控和备份

- 启用性能监控
- 设置自动备份
- 配置告警通知
- 监控存储使用量

### 3. 扩展性

- 监控性能指标
- 适时升级计划
- 考虑分片策略
- 优化查询性能

## 下一步

设置完成后，你可以：

1. **测试所有功能**: 注册、登录、发帖、评论
2. **部署到线上**: 使用 Vercel、Netlify 等平台
3. **添加更多功能**: 文件上传、搜索、通知等
4. **性能优化**: 添加缓存、索引优化等

---

**恭喜！你现在有了一个完全可扩展的云数据库解决方案！** 🎉
