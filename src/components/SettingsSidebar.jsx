const SettingsSidebar = ({
    showSettings,
    isLoggedIn,
    currentUser,
    onClose,
    onOpenAuthModal
}) => {
    return (
        <div className={`settings-sidebar ${showSettings ? 'open' : ''}`}>
            <div className="settings-header">
                <h3>设置</h3>
                <button className="settings-close-btn" onClick={onClose}>
                    ×
                </button>
            </div>

            <div className="settings-content">
                {isLoggedIn ? (
                    <>
                        <div className="settings-section">
                            <h4>个人资料</h4>
                            <div className="settings-item">
                                <span>用户名：{currentUser?.username}</span>
                            </div>
                            <div className="settings-item">
                                <span>注册时间：{new Date(currentUser?.createdAt).toLocaleDateString('zh-CN')}</span>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h4>数据管理</h4>
                            <div className="settings-item">
                                <button className="settings-btn" onClick={() => alert('导出功能开发中...')}>
                                    导出数据
                                </button>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h4>账户安全</h4>
                            <div className="settings-item">
                                <button className="settings-btn" onClick={() => alert('修改密码功能开发中...')}>
                                    修改密码
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="settings-section">
                        <p>请先登录后查看设置选项</p>
                        <button className="settings-btn" onClick={() => {
                            onClose()
                            onOpenAuthModal('login')
                        }}>
                            立即登录
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SettingsSidebar
