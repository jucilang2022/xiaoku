import { useState, useEffect } from 'react'

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [authForm, setAuthForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [authError, setAuthError] = useState('')

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = () => {
        const savedUser = localStorage.getItem('currentUser')
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser))
            setIsLoggedIn(true)
        }
    }

    const handleAuthSubmit = (e) => {
        e.preventDefault()
        setAuthError('')

        if (isLoginMode) {
            // 登录逻辑
            const users = JSON.parse(localStorage.getItem('users') || '[]')
            const user = users.find(u => u.username === authForm.username && u.password === authForm.password)

            if (user) {
                setIsLoggedIn(true)
                setCurrentUser(user)
                localStorage.setItem('currentUser', JSON.stringify(user))
                setShowAuthModal(false)
                setAuthForm({ username: '', password: '', confirmPassword: '' })
            } else {
                setAuthError('用户名或密码错误')
            }
        } else {
            // 注册逻辑
            if (authForm.password !== authForm.confirmPassword) {
                setAuthError('两次输入的密码不一致')
                return
            }

            if (authForm.password.length < 6) {
                setAuthError('密码长度至少6位')
                return
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]')
            const existingUser = users.find(u => u.username === authForm.username)

            if (existingUser) {
                setAuthError('用户名已存在')
                return
            }

            const newUser = {
                id: Date.now(),
                username: authForm.username,
                password: authForm.password,
                avatar: '/vite.svg',
                createdAt: new Date().toISOString()
            }

            users.push(newUser)
            localStorage.setItem('users', JSON.stringify(users))

            // 自动登录
            setIsLoggedIn(true)
            setCurrentUser(newUser)
            localStorage.setItem('currentUser', JSON.stringify(newUser))
            setShowAuthModal(false)
            setAuthForm({ username: '', password: '', confirmPassword: '' })
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setCurrentUser(null)
        localStorage.removeItem('currentUser')
    }

    const openAuthModal = (mode = 'login') => {
        setIsLoginMode(mode === 'login')
        setShowAuthModal(true)
        setAuthError('')
        setAuthForm({ username: '', password: '', confirmPassword: '' })
    }

    const closeAuthModal = () => {
        setShowAuthModal(false)
        setAuthError('')
        setAuthForm({ username: '', password: '', confirmPassword: '' })
    }

    const updateAuthForm = (field, value) => {
        setAuthForm(prev => ({ ...prev, [field]: value }))
    }

    const updateAvatar = (newAvatar) => {
        if (!currentUser) return

        // 更新当前用户头像
        const updatedUser = { ...currentUser, avatar: newAvatar }
        setCurrentUser(updatedUser)
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))

        // 更新用户列表中的头像
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        )
        localStorage.setItem('users', JSON.stringify(updatedUsers))
    }

    return {
        isLoggedIn,
        currentUser,
        showAuthModal,
        isLoginMode,
        authForm,
        authError,
        handleAuthSubmit,
        handleLogout,
        openAuthModal,
        closeAuthModal,
        updateAuthForm,
        updateAvatar
    }
}
