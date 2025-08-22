import { useState, useEffect } from 'react'
import { supabase, TABLES } from '../lib/supabase'

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

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setCurrentUser(session.user)
                setIsLoggedIn(true)
            } else if (event === 'SIGNED_OUT') {
                setCurrentUser(null)
                setIsLoggedIn(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setCurrentUser(session.user)
                setIsLoggedIn(true)
            }
        } catch (error) {
            console.error('检查认证状态失败:', error)
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

                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: authForm.password
                })

                if (error) {
                    console.error('登录错误详情:', error)
                    setAuthError('登录失败: ' + error.message)
                    return
                }

                console.log('登录成功:', data)

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

                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: authForm.password,
                    options: {
                        data: {
                            username: authForm.username,
                            avatar: '/vite.svg'
                        }
                    }
                })

                if (error) {
                    console.error('注册错误详情:', error)
                    setAuthError('注册失败: ' + error.message)
                    return
                }

                console.log('注册成功:', data)

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

            // 先清除本地状态
            setIsLoggedIn(false)
            setCurrentUser(null)

            // 尝试调用 Supabase 退出
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('Supabase 退出失败:', error)
                // 即使 Supabase 退出失败，本地状态已经清除
                // 尝试强制清除会话
                try {
                    await supabase.auth.setSession(null)
                } catch (clearError) {
                    console.error('清除会话失败:', clearError)
                }
            } else {
                console.log('退出登录成功')
            }

            // 确保本地存储也被清除
            localStorage.removeItem('supabase.auth.token')

        } catch (error) {
            console.error('退出登录异常:', error)
            // 确保本地状态被清除
            setIsLoggedIn(false)
            setCurrentUser(null)
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

        // 如果头像没有变化，直接返回
        if (currentUser.user_metadata?.avatar === newAvatar) {
            console.log('头像没有变化，跳过更新')
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                data: { avatar: newAvatar }
            })

            if (error) {
                console.error('更新头像失败:', error)
                return
            }

            // 只更新头像字段，避免重新获取整个用户会话
            setCurrentUser(prev => ({
                ...prev,
                user_metadata: {
                    ...prev.user_metadata,
                    avatar: newAvatar
                }
            }))

            console.log('头像更新成功:', newAvatar)
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
