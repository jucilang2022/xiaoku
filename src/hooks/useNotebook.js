import { useState, useEffect } from 'react'
import { postsAPI, commentsAPI } from '../lib/api'

export const useNotebook = (currentUser) => {
    const [posts, setPosts] = useState([])
    const [newPostText, setNewPostText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [isPosting, setIsPosting] = useState(false)

    useEffect(() => {
        if (currentUser) {
            console.log('用户状态变化，重新加载帖子:', currentUser)
            loadPosts()
        }
    }, [currentUser])

    const loadPosts = async () => {
        if (!currentUser) return

        try {
            console.log('加载帖子，用户ID:', currentUser.id)

            const data = await postsAPI.getUserPosts(currentUser.id)
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
                image: selectedImage
            }

            await postsAPI.createPost(newPost)

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
            await postsAPI.deletePost(postId)

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
                postId: postId
            }

            await commentsAPI.addComment(newComment)

            // 重新加载帖子
            await loadPosts()
        } catch (error) {
            console.error('添加评论失败:', error)
        }
    }

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await commentsAPI.deleteComment(commentId)

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
            await postsAPI.clearUserPosts(currentUser.id)
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
