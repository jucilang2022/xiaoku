import { useState } from 'react'
import './App.css'

// 导入组件
import TopToolbar from './components/TopToolbar'
import Header from './components/Header'
import Notebook from './components/Notebook'
import AuthModal from './components/AuthModal'
import SettingsSidebar from './components/SettingsSidebar'
import Footer from './components/Footer'

// 导入自定义 hooks
import { useAuth } from './hooks/useAuth'
import { useNotebook } from './hooks/useNotebook'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  // 使用自定义 hooks
  const {
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
  } = useAuth()

  const {
    posts,
    newPostText,
    selectedImage,
    isPosting,
    setNewPostText,
    handleImageSelect,
    handlePostSubmit,
    handleDeletePost,
    handleAddComment,
    handleDeleteComment,
    handleRemoveImage
  } = useNotebook(currentUser)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`, '_blank')
    }
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  return (
    <div className="app dark-mode">
      <div className="container">
        {/* 顶部工具栏 */}
        <TopToolbar
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuthModal={openAuthModal}
          onToggleSettings={toggleSettings}
        />

        {/* 头部搜索区域 */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />

        {/* 主要内容区域 */}
        <main className="main-content">
          {/* 记事簿模块 */}
          <Notebook
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            posts={posts}
            newPostText={newPostText}
            selectedImage={selectedImage}
            isPosting={isPosting}
            onNewPostTextChange={setNewPostText}
            onImageSelect={handleImageSelect}
            onRemoveImage={handleRemoveImage}
            onSubmitPost={handlePostSubmit}
            onDeletePost={handleDeletePost}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onOpenAuthModal={openAuthModal}
          />
        </main>

        {/* 登录/注册弹窗 */}
        <AuthModal
          showAuthModal={showAuthModal}
          isLoginMode={isLoginMode}
          authForm={authForm}
          authError={authError}
          onClose={closeAuthModal}
          onSubmit={handleAuthSubmit}
          onFormChange={updateAuthForm}
          onSwitchMode={(mode) => {
            if (mode) {
              openAuthModal('login')
            } else {
              openAuthModal('register')
            }
          }}
        />

        {/* 设置侧边栏 */}
        <SettingsSidebar
          showSettings={showSettings}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onClose={toggleSettings}
          onOpenAuthModal={openAuthModal}
          onUpdateAvatar={updateAvatar}
        />

        {/* 页脚 */}
        <Footer />
      </div>
    </div>
  )
}

export default App
