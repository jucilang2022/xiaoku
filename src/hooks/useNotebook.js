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
            likes: 0
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

    const handleLikePost = (postId) => {
        const updatedPosts = posts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
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

    return {
        posts,
        newPostText,
        selectedImage,
        isPosting,
        setNewPostText,
        handleImageSelect,
        handlePostSubmit,
        handleDeletePost,
        handleLikePost,
        handleRemoveImage,
        clearPosts
    }
}
