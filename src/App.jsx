import { useState, useEffect } from 'react'
import './App.css'
import { Settings, Moon, Sun, Image, Send, Trash2 } from 'lucide-react'
import {
  SiBaidu,
  SiGoogle,
  SiGithub,
  SiGoogletranslate,
  SiDouban
} from 'react-icons/si'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // 记事簿相关状态
  const [posts, setPosts] = useState([])
  const [newPostText, setNewPostText] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isPosting, setIsPosting] = useState(false)

  const navigationCategories = [
    {
      title: "常用网站",
      items: [
        { name: "GitHub", url: "https://github.com/jucilang2022", icon: SiGithub, color: "#333" },
        { name: "Google", url: "https://www.google.com", icon: SiGoogle, color: "#4285F4" },
        { name: "翻译", url: "https://fanyi.baidu.com/mtpe-individual/multimodal?ext_channel=DuSearch", icon: SiGoogletranslate, color: "#4285F4" },
        { name: "豆瓣", url: "https://www.douban.com/people/230674291", icon: SiDouban, color: "#007722" }
      ]
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`, '_blank')
    }
  }

  const handleCardClick = (url) => {
    window.open(url, '_blank')
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // 记事簿功能函数
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    const savedPosts = localStorage.getItem('notebook-posts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }
  }

  const savePosts = (newPosts) => {
    localStorage.setItem('notebook-posts', JSON.stringify(newPosts))
    setPosts(newPosts)
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage({
          name: file.name,
          data: e.target.result,
          type: file.type
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePostSubmit = (e) => {
    e.preventDefault()
    if (!newPostText.trim() && !selectedImage) return

    setIsPosting(true)

    const newPost = {
      id: Date.now(),
      text: newPostText.trim(),
      image: selectedImage,
      timestamp: new Date().toLocaleString('zh-CN'),
      likes: 0
    }

    const updatedPosts = [newPost, ...posts]
    savePosts(updatedPosts)

    // 重置表单
    setNewPostText('')
    setSelectedImage(null)
    setIsPosting(false)
  }

  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId)
    savePosts(updatedPosts)
  }

  const handleLikePost = (postId) => {
    const updatedPosts = posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    )
    savePosts(updatedPosts)
  }

  return (
    <div className={`app dark-mode`}>
      <div className="container">
        {/* 顶部工具栏 */}
        <div className="top-toolbar">
          <div className="toolbar-left"></div>
          <div className="toolbar-right">
            <button className="toolbar-button" title="设置">
              <Settings size={20} />
            </button>
            <button className="toolbar-button" onClick={toggleTheme} title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* 头部搜索区域 */}
        <header className="header">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <SiBaidu className="search-icon" size={20} />
              <input
                type="text"
                placeholder="搜索任何内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button">
              搜索
            </button>
          </form>
        </header>

        {/* 导航卡片区域 */}
        <main className="main-content">
          {navigationCategories.map((category, categoryIndex) => (
            <section key={categoryIndex} className="category-section">
              <h2 className="category-title">{category.title}</h2>
              <div className="cards-grid">
                {category.items.map((item, itemIndex) => {
                  const IconComponent = item.icon
                  return (
                    <div
                      key={itemIndex}
                      className={`nav-card ${hoveredCard === `${categoryIndex}-${itemIndex}` ? 'hovered' : ''}`}
                      onClick={() => handleCardClick(item.url)}
                      onMouseEnter={() => setHoveredCard(`${categoryIndex}-${itemIndex}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="card-icon" style={{ backgroundColor: item.color }}>
                        <IconComponent size={18} />
                      </div>
                      <span className="card-name">{item.name}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          {/* 记事簿模块 */}
          <section className="category-section">
            <h2 className="category-title">我的记事簿</h2>

            {/* 发布新帖子 */}
            <div className="post-form-container">
              <form onSubmit={handlePostSubmit} className="post-form">
                <div className="post-input-wrapper">
                  <textarea
                    placeholder="这一刻的想法..."
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    className="post-textarea"
                    rows="3"
                  />
                  {selectedImage && (
                    <div className="selected-image-preview">
                      <img src={selectedImage.data} alt="预览" />
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="remove-image-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="post-actions">
                  <div className="post-tools">
                    <label className="image-upload-btn">
                      <Image size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isPosting || (!newPostText.trim() && !selectedImage)}
                    className="post-submit-btn"
                  >
                    <Send size={16} />
                    发布
                  </button>
                </div>
              </form>
            </div>

            {/* 帖子列表 */}
            <div className="posts-container">
              {posts.length === 0 ? (
                <div className="empty-posts">
                  <p>还没有发布任何内容，快来分享你的第一个想法吧！</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <div className="post-info">
                        <span className="post-author">我</span>
                        <span className="post-time">{post.timestamp}</span>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="delete-post-btn"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {post.text && (
                      <div className="post-content">
                        <p>{post.text}</p>
                      </div>
                    )}

                    {post.image && (
                      <div className="post-image">
                        <img src={post.image.data} alt="帖子图片" />
                      </div>
                    )}

                    <div className="post-footer">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="like-btn"
                      >
                        ❤️ {post.likes}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* 页脚 */}
        <footer className="footer">
          <p>© 2025 @菊次郎</p>
        </footer>
      </div>
    </div>
  )
}

export default App
