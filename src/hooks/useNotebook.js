import { useState, useEffect } from 'react'

export const useNotebook = (currentUser) => {
    const [posts, setPosts] = useState([])
    const [newPostText, setNewPostText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [isPosting, setIsPosting] = useState(false)

    useEffect(() => {
        if (currentUser) {
            loadPosts()
        }
    }, [currentUser])

    const loadPosts = () => {
        if (!currentUser) return
        const savedPosts = localStorage.getItem(`notebook-posts-${currentUser.id}`)
        if (savedPosts) {
            setPosts(JSON.parse(savedPosts))
        }
    }

    const savePosts = (newPosts) => {
        if (!currentUser) return
        localStorage.setItem(`notebook-posts-${currentUser.id}`, JSON.stringify(newPosts))
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

    const handlePostSubmit = (e) => {
        e.preventDefault()
        if (!newPostText.trim() && !selectedImage) return

        setIsPosting(true)

        const newPost = {
            id: Date.now(),
            text: newPostText.trim(),
            image: selectedImage,
            timestamp: new Date().toLocaleString('zh-CN'),
            comments: []
        }

        const updatedPosts = [newPost, ...posts]
        savePosts(updatedPosts)

        // 重置表单
        setNewPostText('')
        setSelectedImage(null)
        setIsPosting(false)
    }

    const handleDeletePost = (postId) => {
        const updatedPosts = posts.filter(post => post.id !== postId)
        savePosts(updatedPosts)
    }

    const handleAddComment = (postId, commentText) => {
        if (!commentText.trim()) return

        const newComment = {
            id: Date.now(),
            text: commentText.trim(),
            author: currentUser.username,
            authorAvatar: currentUser.avatar || '/vite.svg',
            timestamp: new Date().toLocaleString('zh-CN')
        }

        const updatedPosts = posts.map(post =>
            post.id === postId
                ? { ...post, comments: [...post.comments, newComment] }
                : post
        )
        savePosts(updatedPosts)
    }

    const handleDeleteComment = (postId, commentId) => {
        const updatedPosts = posts.map(post =>
            post.id === postId
                ? { ...post, comments: post.comments.filter(comment => comment.id !== commentId) }
                : post
        )
        savePosts(updatedPosts)
    }

    const handleRemoveImage = () => {
        setSelectedImage(null)
    }

    const clearPosts = () => {
        setPosts([])
        if (currentUser) {
            localStorage.removeItem(`notebook-posts-${currentUser.id}`)
        }
    }

    // 更新所有历史评论中当前用户的头像
    const updateUserAvatarInComments = () => {
        if (!currentUser) return

        const updatedPosts = posts.map(post => ({
            ...post,
            comments: post.comments.map(comment =>
                comment.author === currentUser.username
                    ? { ...comment, authorAvatar: currentUser.avatar || '/vite.svg' }
                    : comment
            )
        }))

        // 只有在头像确实有变化时才保存
        const hasChanges = posts.some(post =>
            post.comments.some(comment =>
                comment.author === currentUser.username &&
                comment.authorAvatar !== (currentUser.avatar || '/vite.svg')
            )
        )

        if (hasChanges) {
            savePosts(updatedPosts)
        }
    }

    // 当用户头像变化时，更新所有评论中的头像
    useEffect(() => {
        if (currentUser && posts.length > 0) {
            updateUserAvatarInComments()
        }
    }, [currentUser?.avatar])

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
