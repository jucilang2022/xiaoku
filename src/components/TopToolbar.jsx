import { User, LogOut, UserPlus, Settings } from 'lucide-react'

const TopToolbar = ({
    isLoggedIn,
    currentUser,
    onLogout,
    onOpenAuthModal,
    onToggleSettings
}) => {
    return (
        <div className="top-toolbar">
            <div className="toolbar-left">
                {isLoggedIn && (
                    <div className="user-welcome">
                        <img src={currentUser?.user_metadata?.avatar || '/vite.svg'} alt="头像" className="user-avatar" />
                        <span>欢迎, {currentUser?.user_metadata?.username || currentUser?.email}</span>
                    </div>
                )}
            </div>
            <div className="toolbar-right">
                {isLoggedIn ? (
                    <button className="toolbar-button" onClick={onLogout} title="退出登录">
                        <LogOut size={20} />
                    </button>
                ) : (
                    <>
                        <button className="toolbar-button" onClick={() => onOpenAuthModal('login')} title="登录">
                            <User size={20} />
                        </button>
                        <button className="toolbar-button" onClick={() => onOpenAuthModal('register')} title="注册">
                            <UserPlus size={20} />
                        </button>
                    </>
                )}
                <button className="toolbar-button" onClick={onToggleSettings} title="设置">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    )
}

export default TopToolbar
