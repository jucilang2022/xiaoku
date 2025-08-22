import { useState, useEffect } from 'react'
import { supabase, TABLES } from '../lib/supabase'

export const useNotebook = (currentUser) => {
    const [posts, setPosts] = useState([])
    const [newPostText, setNewPostText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [isPosting, setIsPosting] = useState(false)

    // 调试信息
    console.log('useNotebook 当前用户状态:', {
        hasUser: !!currentUser,
        userId: currentUser?.id,
        userMetadata: currentUser?.user_metadata
    })

    useEffect(() => {
        if (currentUser) {
            console.log('用户状态变化，重新加载帖子:', currentUser)
            loadPosts()
        }
    }, [currentUser])

    // 添加认证状态检查
    const checkAuthAndLoadPosts = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (session && session.user) {
                console.log('当前会话用户:', session.user)
                // 如果当前用户状态为空或者用户ID不匹配，直接加载帖子
                if (!currentUser || currentUser.id !== session.user.id) {
                    console.log('用户状态不匹配或为空，直接加载帖子')
                    // 直接使用会话中的用户信息加载帖子
                    await loadPostsWithUser(session.user)
                }
            } else {
                console.log('没有有效会话')
            }
        } catch (error) {
            console.error('检查认证状态失败:', error)
        }
    }

    // 在组件挂载时检查认证状态
    useEffect(() => {
        checkAuthAndLoadPosts()
    }, [])

    // 监听认证状态变化，确保在用户登录后能加载帖子
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                console.log('检测到用户登录，尝试加载帖子')
                await loadPostsWithUser(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const loadPosts = async () => {
        if (!currentUser) return
        await loadPostsWithUser(currentUser)
    }

    const loadPostsWithUser = async (user) => {
        if (!user || !user.id) {
            console.log('用户信息无效，无法加载帖子')
            return
        }

        try {
            console.log('加载帖子，用户ID:', user.id)

            const { data, error } = await supabase
                .from(TABLES.POSTS)
                .select(`
                    *,
                    comments (*)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('加载帖子失败:', error)
                return
            }

            console.log('加载到的帖子:', data)
            setPosts(data || [])
        } catch (error) {
            console.error('加载帖子失败:', error)
        }
    }

    const savePosts = (newPosts) => {
        setPosts(newPosts)
    }

    const handleImageSelect = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage({
                    name: file.name,
                    data: e.target.result,
                    type: file.type
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault()
        if (!newPostText.trim() && !selectedImage) return

        setIsPosting(true)

        try {
            const newPost = {
                text: newPostText.trim(),
                image: selectedImage,
                user_id: currentUser.id,
                created_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from(TABLES.POSTS)
                .insert([newPost])
                .select()

            if (error) {
                console.error('发布帖子失败:', error)
                return
            }

            // 重新加载帖子
            await loadPosts()

            // 重置表单
            setNewPostText('')
            setSelectedImage(null)
        } catch (error) {
            console.error('发布帖子失败:', error)
        } finally {
            setIsPosting(false)
        }
    }

    const handleDeletePost = async (postId) => {
        try {
            const { error } = await supabase
                .from(TABLES.POSTS)
                .delete()
                .eq('id', postId)

            if (error) {
                console.error('删除帖子失败:', error)
                return
            }

            // 重新加载帖子
            await loadPosts()
        } catch (error) {
            console.error('删除帖子失败:', error)
        }
    }

    const handleAddComment = async (postId, commentText) => {
        if (!commentText.trim()) return

        try {
            const newComment = {
                text: commentText.trim(),
                author: currentUser.user_metadata?.username || currentUser.email,
                author_avatar: currentUser.user_metadata?.avatar || '/vite.svg',
                post_id: postId,
                user_id: currentUser.id,
                created_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from(TABLES.COMMENTS)
                .insert([newComment])

            if (error) {
                console.error('添加评论失败:', error)
                return
            }

            // 重新加载帖子
            await loadPosts()
        } catch (error) {
            console.error('添加评论失败:', error)
        }
    }

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const { error } = await supabase
                .from(TABLES.COMMENTS)
                .delete()
                .eq('id', commentId)

            if (error) {
                console.error('删除评论失败:', error)
                return
            }

            // 重新加载帖子
            await loadPosts()
        } catch (error) {
            console.error('删除评论失败:', error)
        }
    }

    const handleRemoveImage = () => {
        setSelectedImage(null)
    }

    const clearPosts = async () => {
        try {
            const { error } = await supabase
                .from(TABLES.POSTS)
                .delete()
                .eq('user_id', currentUser.id)

            if (error) {
                console.error('清空帖子失败:', error)
                return
            }

            setPosts([])
        } catch (error) {
            console.error('清空帖子失败:', error)
        }
    }



    return {
        posts,
        newPostText,
        selectedImage,
        isPosting,
        setNewPostText,
        handleImageSelect,
        handlePostSubmit,
        handleDeletePost,
        handleAddComment,
        handleDeleteComment,
        handleRemoveImage,
        clearPosts
    }
}
