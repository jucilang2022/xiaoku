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

    const saveCurrentUserSafely = (rawUser) => {
        const minimalUser = {
            id: rawUser?.id || rawUser?._id || rawUser?.user_id,
            email: rawUser?.email || rawUser?.user_metadata?.email || '',
            username: rawUser?.username || rawUser?.user_metadata?.username || '',
            // 移除avatar字段，避免base64数据占用大量存储空间
            createdAt: rawUser?.createdAt || rawUser?.created_at || null
        }

        try {
            localStorage.setItem('currentUser', JSON.stringify(minimalUser))
        } catch (e) {
            console.error("写入localStorage失败，尝试使用sessionStorage保存currentUser:", e)
            try {
                sessionStorage.setItem('currentUser', JSON.stringify(minimalUser))
            } catch (err) {
                console.error('写入sessionStorage也失败，放弃持久化currentUser:', err)
            }
        }

        return minimalUser
    }

    const checkAuthStatus = async () => {
        try {
            // 检查是否有有效的token
            if (authAPI.isAuthenticated()) {
                let savedUser = localStorage.getItem('currentUser')
                if (!savedUser) {
                    savedUser = sessionStorage.getItem('currentUser')
                }
                if (savedUser) {
                    const user = JSON.parse(savedUser)
                    // 只恢复基本信息，头像等完整信息需要重新获取
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

                // 保存精简用户信息到存储，完整信息到状态
                const minimal = saveCurrentUserSafely(response.user)
                setCurrentUser(response.user) // 保存完整用户信息到状态
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

                // 保存精简用户信息到存储，完整信息到状态
                const minimal = saveCurrentUserSafely(response.user)
                setCurrentUser(response.user) // 保存完整用户信息到状态
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
            // 调用后端API更新头像
            const response = await authAPI.updateAvatar(newAvatar)

            // 更新本地状态
            const updatedUser = {
                ...currentUser,
                avatar: newAvatar
            }

            setCurrentUser(updatedUser)
            // 不再保存头像数据到存储中，避免配额问题

            console.log('头像更新成功:', response.message)
        } catch (error) {
            console.error('更新头像失败:', error)
            // 如果后端更新失败，回滚本地状态
            throw error
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
