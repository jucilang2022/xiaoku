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

        // 导入并启动服务器
        const { default: app } = await import('./server.js');

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 生产服务器运行在端口 ${PORT}`);
            console.log(`📊 使用MongoDB数据库`);
            console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 监听地址: 0.0.0.0:${PORT}`);
        });

    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
}

startServer();
