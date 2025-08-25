import { useState, useEffect } from 'react'
import { authAPI } from '../lib/api'

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

    const checkAuthStatus = async () => {
        try {
            // 检查是否有有效的token
            if (authAPI.isAuthenticated()) {
                const savedUser = localStorage.getItem('currentUser')
                if (savedUser) {
                    const user = JSON.parse(savedUser)
                    setCurrentUser(user)
                    setIsLoggedIn(true)
                }
            }
        } catch (error) {
            console.error('检查认证状态失败:', error)
            // 清除无效的认证信息
            authAPI.logout()
        }
    }

    const handleAuthSubmit = async (e) => {
        e.preventDefault()
        setAuthError('')

        try {
            if (isLoginMode) {
                // 登录逻辑
                const email = authForm.username + '@xiaoku.fun'
                console.log('尝试登录:', { username: authForm.username, email })

                const response = await authAPI.login({
                    email: email,
                    password: authForm.password
                })

                console.log('登录成功:', response)

                // 保存用户信息到localStorage
                localStorage.setItem('currentUser', JSON.stringify(response.user))

                setCurrentUser(response.user)
                setIsLoggedIn(true)
                setShowAuthModal(false)
                setAuthForm({ username: '', password: '', confirmPassword: '' })
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

                const email = authForm.username + '@xiaoku.fun'
                console.log('尝试注册:', { username: authForm.username, email })

                const response = await authAPI.register({
                    email: email,
                    username: authForm.username,
                    password: authForm.password
                })

                console.log('注册成功:', response)

                // 保存用户信息到localStorage
                localStorage.setItem('currentUser', JSON.stringify(response.user))

                setCurrentUser(response.user)
                setIsLoggedIn(true)
                setShowAuthModal(false)
                setAuthForm({ username: '', password: '', confirmPassword: '' })
            }
        } catch (error) {
            setAuthError('操作失败: ' + error.message)
        }
    }

    const handleLogout = async () => {
        try {
            console.log('开始退出登录...')

            // 清除本地状态和存储
            setIsLoggedIn(false)
            setCurrentUser(null)
            authAPI.logout()

            console.log('退出登录成功')
        } catch (error) {
            console.error('退出登录异常:', error)
            // 确保本地状态被清除
            setIsLoggedIn(false)
            setCurrentUser(null)
            authAPI.logout()
        }
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

    const updateAvatar = async (newAvatar) => {
        if (!currentUser) return

        try {
            // 更新本地状态
            const updatedUser = {
                ...currentUser,
                avatar: newAvatar
            }

            setCurrentUser(updatedUser)
            localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        } catch (error) {
            console.error('更新头像失败:', error)
        }
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
