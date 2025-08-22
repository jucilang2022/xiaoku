# Supabase 设置指南

## 🚀 快速开始

### 1. 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新项目

### 2. 获取项目配置
在项目设置中找到：
- **Project URL**: `https://your-project-id.supabase.co`
- **anon public key**: 以 `eyJ...` 开头的长字符串

### 3. 设置环境变量
在项目根目录创建 `.env.local` 文件：
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 创建数据库表

#### 用户表 (users)
```sql
-- 用户表由 Supabase Auth 自动管理，无需手动创建
-- 但需要启用 Row Level Security (RLS)
```

#### 帖子表 (posts)
```sql
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  text TEXT,
  image JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能看到自己的帖子
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

#### 评论表 (comments)
```sql
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  author_avatar TEXT,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户可以查看所有评论，但只能管理自己的
CREATE POLICY "Users can view all comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. 配置认证设置
在 Supabase Dashboard 的 Authentication > Settings 中：
1. 启用 Email 认证
2. 配置邮件模板（可选）
3. 设置重定向 URL

### 6. 测试应用
1. 启动开发服务器：`npm run dev`
2. 尝试注册/登录
3. 发布帖子和评论

## 🔧 故障排除

### 常见问题
1. **环境变量未加载**: 确保 `.env.local` 文件存在且变量名正确
2. **认证失败**: 检查 Supabase 项目设置和 RLS 策略
3. **数据库错误**: 验证表结构和策略配置

### 调试技巧
- 在浏览器控制台查看网络请求
- 检查 Supabase Dashboard 的日志
- 使用 Supabase CLI 进行本地开发

## 📚 更多资源
- [Supabase 文档](https://supabase.com/docs)
- [React 集成指南](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [RLS 策略示例](https://supabase.com/docs/guides/auth/row-level-security)
