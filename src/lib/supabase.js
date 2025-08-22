import { createClient } from '@supabase/supabase-js'

// 这些值需要从 Supabase 项目设置中获取
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.')
    throw new Error('Supabase environment variables are required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表结构
export const TABLES = {
    USERS: 'users',
    POSTS: 'posts',
    COMMENTS: 'comments'
}
