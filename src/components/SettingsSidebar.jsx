import { useState } from 'react'
import { Camera, Trash2 } from 'lucide-react'

const SettingsSidebar = ({
    showSettings,
    isLoggedIn,
    currentUser,
    onClose,
    onOpenAuthModal,
    onUpdateAvatar
}) => {
    const [isChangingAvatar, setIsChangingAvatar] = useState(false)

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const newAvatar = e.target.result
                onUpdateAvatar(newAvatar)
                setIsChangingAvatar(false)
            }
            reader.readAsDataURL(file)
        }
    }

    const resetToDefaultAvatar = () => {
        onUpdateAvatar('/vite.svg')
    }

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

                            {/* 头像设置 */}
                            <div className="avatar-settings">
                                <div className="current-avatar">
                                    <img src={currentUser?.user_metadata?.avatar || '/vite.svg'} alt="当前头像" className="settings-avatar" />
                                </div>
                                <div className="avatar-actions">
                                    <label className="avatar-upload-btn">
                                        <Camera size={16} />
                                        更换头像
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    <button
                                        className="avatar-reset-btn"
                                        onClick={resetToDefaultAvatar}
                                        title="重置为默认头像"
                                    >
                                        <Trash2 size={16} />
                                        重置头像
                                    </button>
                                </div>
                            </div>

                            <div className="settings-item">
                                <span>用户名：{currentUser?.user_metadata?.username || currentUser?.email}</span>
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
