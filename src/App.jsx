import { useState } from 'react'
import './App.css'
import { Settings, Moon, Sun } from 'lucide-react'
import {
  SiGoogle,
  SiBaidu,
  SiSogou,
  SiBilibili,
  SiYoutube,
  SiTencentqq,
  SiGithub,
  SiStackoverflow,
  SiSinaweibo,
  SiZhihu,
  SiDouban,
  SiXiaohongshu,
  SiGoogletranslate,
  SiGooglecalendar,
  SiGmail
} from 'react-icons/si'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const navigationCategories = [
    {
      title: "搜索引擎",
      items: [
        { name: "Google", url: "https://www.google.com", icon: SiGoogle, color: "#4285F4" },
        { name: "百度", url: "https://www.baidu.com", icon: SiBaidu, color: "#2932E1" },
        { name: "必应", url: "https://www.bing.com", icon: SiGoogle, color: "#00A1F1" },
        { name: "搜狗", url: "https://www.sogou.com", icon: SiSogou, color: "#F60" }
      ]
    },
    {
      title: "学习资源",
      items: [
        { name: "GitHub", url: "https://github.com", icon: SiGithub, color: "#333" },
        { name: "Stack Overflow", url: "https://stackoverflow.com", icon: SiStackoverflow, color: "#F48024" },
        { name: "MDN Web Docs", url: "https://developer.mozilla.org", icon: SiGithub, color: "#000000" },
        { name: "W3Schools", url: "https://www.w3schools.com", icon: SiGithub, color: "#04AA6D" }
      ]
    },
    {
      title: "实用工具",
      items: [
        { name: "翻译", url: "https://translate.google.com", icon: SiGoogletranslate, color: "#4285F4" },
        { name: "天气", url: "https://weather.com", icon: SiYoutube, color: "#00A1D6" },
        { name: "日历", url: "https://calendar.google.com", icon: SiGooglecalendar, color: "#4285F4" },
        { name: "邮箱", url: "https://mail.google.com", icon: SiGmail, color: "#EA4335" }
      ]
    },
    {
      title: "社交媒体",
      items: [
        { name: "微博", url: "https://weibo.com", icon: SiSinaweibo, color: "#E6162D" },
        { name: "知乎", url: "https://www.zhihu.com", icon: SiZhihu, color: "#0084FF" },
        { name: "豆瓣", url: "https://www.douban.com", icon: SiDouban, color: "#007722" },
        { name: "小红书", url: "https://www.xiaohongshu.com", icon: SiXiaohongshu, color: "#FE2C55" }
      ]
    },
    {
      title: "影视娱乐",
      items: [
        { name: "哔哩哔哩", url: "https://www.bilibili.com", icon: SiBilibili, color: "#00A1D6" },
        { name: "优酷", url: "https://www.youku.com", icon: SiYoutube, color: "#00A6FF" },
        { name: "爱奇艺", url: "https://www.iqiyi.com", icon: SiYoutube, color: "#00BE06" },
        { name: "腾讯视频", url: "https://v.qq.com", icon: SiTencentqq, color: "#FF6B35" }
      ]
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank')
    }
  }

  const handleCardClick = (url) => {
    window.open(url, '_blank')
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
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
              <SiGoogle className="search-icon" size={20} />
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
                        <IconComponent size={24} />
                      </div>
                      <span className="card-name">{item.name}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
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
