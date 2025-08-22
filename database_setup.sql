-- Supabase 数据库设置脚本
-- 在 Supabase Dashboard > SQL Editor 中运行此脚本

-- 1. 创建帖子表
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  text TEXT,
  image JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  author_avatar TEXT,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 启用 Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. 创建帖子表的 RLS 策略
-- 用户只能看到自己的帖子
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

-- 用户只能插入自己的帖子
CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的帖子
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- 用户只能删除自己的帖子
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- 5. 创建评论表的 RLS 策略
-- 用户可以查看所有评论
CREATE POLICY "Users can view all comments" ON comments
  FOR SELECT USING (true);

-- 用户只能插入自己的评论
CREATE POLICY "Users can insert own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的评论
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- 6. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 7. 验证表创建
SELECT 'posts' as table_name, count(*) as row_count FROM posts
UNION ALL
SELECT 'comments' as table_name, count(*) as row_count FROM comments;
