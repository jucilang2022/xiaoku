const AuthModal = ({
    showAuthModal,
    isLoginMode,
    authForm,
    authError,
    onClose,
    onSubmit,
    onFormChange,
    onSwitchMode
}) => {
    if (!showAuthModal) return null

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <h3>{isLoginMode ? '登录' : '注册'}</h3>
                    <button className="auth-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit} className="auth-form">
                    {authError && (
                        <div className="auth-error">
                            {authError}
                        </div>
                    )}

                    <div className="auth-field">
                        <label>用户名</label>
                        <input
                            type="text"
                            value={authForm.username}
                            onChange={(e) => onFormChange('username', e.target.value)}
                            required
                            placeholder="请输入用户名"
                        />
                    </div>

                    <div className="auth-field">
                        <label>密码</label>
                        <input
                            type="password"
                            value={authForm.password}
                            onChange={(e) => onFormChange('password', e.target.value)}
                            required
                            placeholder="请输入密码"
                        />
                    </div>

                    {!isLoginMode && (
                        <div className="auth-field">
                            <label>确认密码</label>
                            <input
                                type="password"
                                value={authForm.confirmPassword}
                                onChange={(e) => onFormChange('confirmPassword', e.target.value)}
                                required
                                placeholder="请再次输入密码"
                            />
                        </div>
                    )}

                    <button type="submit" className="auth-submit-btn">
                        {isLoginMode ? '登录' : '注册'}
                    </button>

                    <div className="auth-switch">
                        {isLoginMode ? (
                            <p>
                                还没有账号？
                                <button type="button" onClick={() => onSwitchMode(false)}>
                                    立即注册
                                </button>
                            </p>
                        ) : (
                            <p>
                                已有账号？
                                <button type="button" onClick={() => onSwitchMode(true)}>
                                    立即登录
                                </button>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthModal
