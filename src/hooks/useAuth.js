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
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: authForm.username + '@xiaoku.fun', // 使用你的域名
                    password: authForm.password
                })

                if (error) {
                    setAuthError('登录失败: ' + error.message)
                    return
                }

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

                const { data, error } = await supabase.auth.signUp({
                    email: authForm.username + '@xiaoku.fun', // 使用你的域名
                    password: authForm.password,
                    options: {
                        data: {
                            username: authForm.username,
                            avatar: '/vite.svg'
                        },
                        emailRedirectTo: undefined // 禁用邮箱重定向
                    }
                })

                if (error) {
                    setAuthError('注册失败: ' + error.message)
                    return
                }

                setShowAuthModal(false)
                setAuthForm({ username: '', password: '', confirmPassword: '' })
            }
        } catch (error) {
            setAuthError('操作失败: ' + error.message)
        }
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
        } catch (error) {
            console.error('登出失败:', error)
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
            const { error } = await supabase.auth.updateUser({
                data: { avatar: newAvatar }
            })

            if (error) {
                console.error('更新头像失败:', error)
                return
            }

            // 更新本地状态
            setCurrentUser(prev => ({
                ...prev,
                user_metadata: {
                    ...prev.user_metadata,
                    avatar: newAvatar
                }
            }))
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
