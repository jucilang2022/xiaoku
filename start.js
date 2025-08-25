#!/usr/bin/env node

import 'dotenv/config';
import { connectDB } from './src/lib/mongodb.js';

// 生产环境启动脚本
async function startServer() {
    try {
        console.log('🚀 正在启动生产服务器...');

        // 连接数据库
        await connectDB();
        console.log('✅ MongoDB连接成功');

        // 直接启动server.js
        const PORT = process.env.PORT || 3001;
        console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🌐 监听地址: 0.0.0.0:${PORT}`);

        // 导入server.js，它会自动启动
        await import('./server.js');

    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
}

startServer();
