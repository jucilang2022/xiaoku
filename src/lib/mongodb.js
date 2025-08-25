import mongoose from 'mongoose';

// MongoDB Atlas连接字符串
// 你需要从MongoDB Atlas获取这个连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nav-app';

// 连接选项
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// 连接MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, options);
        console.log('✅ MongoDB连接成功');
    } catch (error) {
        console.error('❌ MongoDB连接失败:', error.message);
        process.exit(1);
    }
};

// 监听连接事件
mongoose.connection.on('connected', () => {
    console.log('MongoDB连接已建立');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB连接错误:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB连接已断开');
});

// 优雅关闭
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB连接已关闭');
        process.exit(0);
    } catch (error) {
        console.error('关闭MongoDB连接时出错:', error);
        process.exit(1);
    }
});

export default mongoose;
