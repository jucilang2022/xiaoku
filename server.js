import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from './src/lib/mongodb.js';
import User from './src/models/User.js';
import Post from './src/models/Post.js';
import Comment from './src/models/Comment.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 简单请求日志
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// 中间件
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://www.xiaoku.fun', 'https://xiaoku.fun']
        : true,
    credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});

// 连接MongoDB
connectDB();

// JWT认证中间件
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '访问令牌缺失' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: '用户不存在' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: '无效的访问令牌' });
    }
};

// 用户相关API
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // 校验
        if (!email || !username || !password) {
            return res.status(400).json({ error: '缺少必要参数' });
        }
        if (username.length < 2) {
            return res.status(400).json({ error: '用户名至少2个字符' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: '密码至少6位' });
        }

        // 检查用户是否已存在
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email ? '邮箱已被注册' : '用户名已被使用'
            });
        }

        // 加密密码
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 创建新用户
        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        // 生成JWT令牌
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            user: newUser,
            token
        });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({ error: '注册失败，请稍后重试' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 校验
        if (!email || !password) {
            return res.status(400).json({ error: '缺少必要参数' });
        }

        // 查找用户
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: '密码错误' });
        }

        // 更新最后登录时间
        user.lastLogin = new Date();
        await user.save();

        // 生成JWT令牌
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            user,
            token
        });
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ error: '登录失败，请稍后重试' });
    }
});

// 帖子相关API
app.get('/api/posts/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username avatar');

        const postsWithComments = await Promise.all(
            posts.map(async (post) => {
                const comments = await Comment.find({ postId: post._id })
                    .sort({ createdAt: 1 });

                return {
                    ...post.toJSON(),
                    comments: comments.map(c => c.toJSON())
                };
            })
        );

        res.json(postsWithComments);
    } catch (error) {
        console.error('获取帖子失败:', error);
        res.status(500).json({ error: '获取帖子失败' });
    }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
    try {
        const { text, image } = req.body;
        const userId = req.user._id;

        const newPost = new Post({
            text,
            image,
            userId
        });

        await newPost.save();
        await newPost.populate('userId', 'username avatar');

        res.status(201).json(newPost);
    } catch (error) {
        console.error('创建帖子失败:', error);
        res.status(500).json({ error: '创建帖子失败' });
    }
});

app.delete('/api/posts/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findOne({ _id: postId, userId });
        if (!post) {
            return res.status(404).json({ error: '帖子不存在或无权限删除' });
        }

        await Comment.deleteMany({ postId });
        await Post.findByIdAndDelete(postId);

        res.json({ message: '帖子删除成功' });
    } catch (error) {
        console.error('删除帖子失败:', error);
        res.status(500).json({ error: '删除帖子失败' });
    }
});

// 评论相关API
app.post('/api/comments', authenticateToken, async (req, res) => {
    try {
        const { text, postId } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: '帖子不存在' });
        }

        const newComment = new Comment({
            text,
            author: req.user.username,
            authorAvatar: req.user.avatar,
            postId,
            userId
        });

        await newComment.save();

        res.status(201).json(newComment);
    } catch (error) {
        console.error('添加评论失败:', error);
        res.status(500).json({ error: '添加评论失败' });
    }
});

app.delete('/api/comments/:commentId', authenticateToken, async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findOne({ _id: commentId, userId });
        if (!comment) {
            return res.status(404).json({ error: '评论不存在或无权限删除' });
        }

        await Comment.findByIdAndDelete(commentId);

        res.json({ message: '评论删除成功' });
    } catch (error) {
        console.error('删除评论失败:', error);
        res.status(500).json({ error: '删除评论失败' });
    }
});

// 清空用户所有帖子
app.delete('/api/posts/user/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        if (userId !== currentUserId.toString()) {
            return res.status(403).json({ error: '无权限执行此操作' });
        }

        const posts = await Post.find({ userId });
        const postIds = posts.map(post => post._id);

        await Comment.deleteMany({ postId: { $in: postIds } });
        await Post.deleteMany({ userId });

        res.json({ message: '所有帖子删除成功' });
    } catch (error) {
        console.error('清空帖子失败:', error);
        res.status(500).json({ error: '清空帖子失败' });
    }
});

// 托管前端静态文件（生产）
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));
// 非 /api 的路由全部交给前端
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`);
    console.log(`📊 使用MongoDB数据库`);
    console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 监听地址: 0.0.0.0:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', async () => {
    console.log('正在关闭服务器...');
    process.exit(0);
});
