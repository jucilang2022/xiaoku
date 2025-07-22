import { useState, useEffect } from 'react';
import Game2048 from './Game2048.jsx';
import GameFlappyBird from './GameFlappyBird.jsx';
import { SiDouban, SiXiaohongshu, SiGithub, SiTencentqq, SiWechat, SiNeteasecloudmusic } from 'react-icons/si';
import { Email } from '@mui/icons-material';
import './App.css';

const profile = {
  zh: {
    name: '菊次郎',
    desc: '你好，我是菊次郎，一名热爱前端开发和生活的年轻人。喜欢探索新技术，热衷于分享和记录生活。',
    links: [
      { icon: <SiDouban />, name: '豆瓣', url: 'https://www.douban.com/people/230674291' },
      { icon: <SiXiaohongshu />, name: '小红书', url: 'https://www.xiaohongshu.com/user/profile/5e8efca8000000000100a2d3' },
      { icon: <SiGithub />, name: 'GitHub', url: 'https://github.com/jucilang2022' },
      { icon: <SiNeteasecloudmusic />, name: '网易云音乐', url: 'https://music.163.com/#/user/home?id=1443295984' },
    ],
    contacts: [
      { icon: <SiTencentqq />, label: 'QQ', value: '2544668581' },
      { icon: <Email />, label: '邮箱', value: 'lizhengyang@douban.com' },
      { icon: <SiWechat />, label: '微信', value: 'L15191880198' },
    ],
  },
  en: {
    name: 'Yueliang',
    desc: "Hi, I'm Yueliang, a young developer passionate about frontend and life. I love exploring new tech and sharing my journey.",
    links: [
      { icon: <SiDouban />, name: 'Douban', url: 'https://www.douban.com/people/230674291' },
      { icon: <SiXiaohongshu />, name: 'Xiaohongshu', url: 'https://www.xiaohongshu.com/user/profile/5e8efca8000000000100a2d3' },
      { icon: <SiGithub />, name: 'GitHub', url: 'https://github.com/jucilang2022' },
      { icon: <SiNeteasecloudmusic />, name: 'Music163', url: 'https://music.163.com/#/user/home?id=1443295984' },
    ],
    contacts: [
      { icon: <SiTencentqq />, label: 'QQ', value: '2544668581' },
      { icon: <Email />, label: 'Email', value: 'lizhengyang@douban.com' },
      { icon: <SiWechat />, label: 'WeChat', value: 'L15191880198' },
    ],
  },
};

// 电子时钟组件
function DigitalClock({ lang }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const zh = now.toLocaleTimeString('zh-CN', { hour12: false });
  const en = now.toLocaleTimeString('en-US', { hour12: false });
  return (
    <div style={{
      position: 'fixed',
      top: 18,
      left: 18,
      background: 'rgba(255,255,255,0.92)',
      color: '#4f8cff',
      fontWeight: 1000,
      fontSize: '1.35em',
      letterSpacing: '0.08em',
      borderRadius: 10,
      boxShadow: '0 2px 8px 0 rgba(79,140,255,0.08)',
      padding: '0.45em 1.2em',
      zIndex: 100,
      fontFamily: 'monospace',
      userSelect: 'none',
    }}>{lang === 'en' ? en : zh}</div>
  );
}

function App() {
  const [lang, setLang] = useState('zh');
  const [showContact, setShowContact] = useState(false);
  const [showContactQuiz, setShowContactQuiz] = useState(false);
  const [quizInput, setQuizInput] = useState('');
  const [quizError, setQuizError] = useState('');
  const [avatarSpin, setAvatarSpin] = useState(false);
  const [tip, setTip] = useState('');
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const tips = [
    '今天也在发光 ✨',
    '点我干嘛？😏',
    '祝你天天开心！',
    '前端万岁！',
    '你发现了隐藏彩蛋！',
    '要不要一起写代码？',
    '生活要有点小乐趣~',
  ];
  const p = profile[lang];

  // 每日一句/签名内容
  const dailyQuotes = {
    zh: [
      '愿你走出半生，归来仍是少年。',
      '保持热爱，奔赴山海。',
      '星光不问赶路人，时光不负有心人。',
      '生活明朗，万物可爱。',
      '前端改变世界，代码点亮人生。',
      '世界很大，开心最重要。',
      '愿你所想皆如愿，所行化坦途。',
    ],
    en: [
      'May you return as a youth after half a lifetime.',
      'Keep passion, chase the mountains and seas.',
      'Stars don’t ask the wayfarer, time rewards the diligent.',
      'Life is bright, everything is lovely.',
      'Frontend changes the world, code lights up life.',
      'The world is big, happiness matters most.',
      'May all your wishes come true and your path be smooth.',
    ],
  };
  const quoteList = dailyQuotes[lang] || dailyQuotes.zh;
  const todayIdx = new Date().getDate() % quoteList.length;
  const todayQuote = quoteList[todayIdx];

  // 网易云音乐歌单ID（可替换为你喜欢的歌单）
  const songId = '541326593'; // 默认单曲ID，可替换为你喜欢的单曲
  const musicTitle = lang === 'en' ? 'Music' : '音乐';

  const handleAvatarClick = () => {
    setAvatarSpin(true);
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    setTimeout(() => setAvatarSpin(false), 1000);
    setTimeout(() => setTip(''), 2500);
  };

  const handleOpenGameModal = () => {
    setShowGameModal(true);
    setSelectedGame(null);
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  const handleCloseGameModal = () => {
    setShowGameModal(false);
    setSelectedGame(null);
  };

  function handleQuizSubmit() {
    if (quizInput.trim() === '李郑洋') {
      setShowContactQuiz(false);
      setShowContact(true);
    } else {
      setQuizError(lang === 'zh' ? '答案错误，请重试！' : 'Incorrect answer, please try again!');
    }
  }

  const texts = {
    zh: {
      select: '选择一个小游戏',
      close: '关闭',
      game2048: '2048',
      flappy: 'Flappy Bird',
      gameBtn: '小游戏',
    },
    en: {
      select: 'Choose a mini game',
      close: 'Close',
      game2048: '2048',
      flappy: 'Flappy Bird',
      gameBtn: 'Mini Game',
    },
  };
  const t = texts[lang] || texts.zh;

  return (
    <div className="homepage-container">
      <DigitalClock lang={lang} />
      <div className="rainbow-bar"></div>
      {/* 右上角头像 */}
      <img
        className={`avatar-floating${avatarSpin ? ' spin' : ''}`}
        src="https://img9.doubanio.com/icon/ul290069963-4.jpg"
        alt="avatar"
        onClick={handleAvatarClick}
        style={{ cursor: 'pointer' }}
      />
      {tip && (
        <div style={{
          position: 'absolute',
          top: 110,
          right: 40,
          background: 'rgba(255,255,255,0.95)',
          color: '#00796b',
          borderRadius: 12,
          padding: '0.6em 1.2em',
          boxShadow: '0 2px 8px 0 rgba(38,166,154,0.10)',
          zIndex: 99,
          fontWeight: 600,
          fontSize: '1.05em',
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
        }}>{tip}</div>
      )}
      <div className="lang-switch">
        <button
          className={lang === 'zh' ? 'active' : ''}
          onClick={() => setLang('zh')}
        >
          中文
        </button>
        <span>|</span>
        <button
          className={lang === 'en' ? 'active' : ''}
          onClick={() => setLang('en')}
        >
          EN
        </button>
      </div>
      <div className="profile-card">
        <h1>{p.name}</h1>
        <p className="desc">{p.desc}</p>
        {/* 每日一句/签名模块（暂时注释）
        <div style={{
          margin: '0.5em 0 1.2em 0',
          padding: '0.7em 1.2em',
          background: 'rgba(79,140,255,0.08)',
          borderRadius: 10,
          color: '#4f8cff',
          fontWeight: 600,
          fontSize: '1.08em',
          textAlign: 'center',
          boxShadow: '0 2px 8px 0 rgba(79,140,255,0.06)',
          letterSpacing: '0.5px',
        }}>{todayQuote}</div>
        */}
        <div className="links">
          {p.links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              {link.icon}
              <span>{link.name}</span>
            </a>
          ))}
        </div>
        {/* 底部widgets：小游戏和音乐播放器 */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          marginTop: 32,
          marginBottom: 0,
          minHeight: 80,
        }}>
          {/* 小游戏入口按钮 */}
          <button className="game-btn" onClick={handleOpenGameModal} style={{ background: '#a084ee', color: '#fff', fontWeight: 700, fontSize: '1.08em', borderRadius: 10, padding: '0.5em 1.5em', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(160,132,238,0.10)' }}>🎮 {t.gameBtn}</button>
          {/* 网易云音乐单曲播放器 */}
          <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 10, boxShadow: '0 2px 8px 0 rgba(79,140,255,0.08)', padding: '0.3em 0.7em', minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#4f8cff', fontWeight: 700, fontSize: '1em', marginBottom: 4 }}>{musicTitle}</div>
            <iframe allow="encrypted-media; accelerometer; gyroscope" frameBorder="no" border="0" marginWidth="0" marginHeight="0" width="170" height="52" style={{ borderRadius: 8 }}
              src={`https://music.163.com/outchain/player?type=2&id=${songId}&auto=0&height=32`} />
          </div>
        </div>
      </div>
      {/* 游戏弹窗 */}
      {showGameModal && (
        <div className="contact-modal-mask" onClick={handleCloseGameModal}>
          <div className="contact-modal" style={{ minWidth: 320, minHeight: 220 }} onClick={e => e.stopPropagation()}>
            {!selectedGame && (
              <>
                <h2 style={{ marginBottom: '1em' }}>{t.select}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', alignItems: 'center' }}>
                  <button onClick={() => handleSelectGame('2048')} style={{ padding: '0.7em 2em', fontSize: '1.1em', borderRadius: 8, border: 'none', background: '#43e97b', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{t.game2048}</button>
                  <button onClick={() => handleSelectGame('flappy')} style={{ padding: '0.7em 2em', fontSize: '1.1em', borderRadius: 8, border: 'none', background: '#ff6ec4', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{t.flappy}</button>
                </div>
                <button className="close-btn" style={{ marginTop: '2em' }} onClick={handleCloseGameModal}>{t.close}</button>
              </>
            )}
            {selectedGame === '2048' && (
              <Game2048 lang={lang} />
            )}
            {selectedGame === 'flappy' && (
              <GameFlappyBird lang={lang} />
            )}
          </div>
        </div>
      )}
      {/* 页脚联系方式按钮 */}
      <footer className="footer-contact">
        <button className="contact-btn" onClick={() => { setShowContactQuiz(true); setQuizInput(''); setQuizError(''); }}>
          {lang === 'zh' ? '联系方式' : 'Contact'}
        </button>
      </footer>
      {/* 联系方式答题弹窗 */}
      {showContactQuiz && (
        <div className="contact-modal-mask" onClick={() => setShowContactQuiz(false)}>
          <div className="contact-modal" style={{ minWidth: 260 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1em', color: '#26a69a', fontWeight: 700, fontSize: '1.2em' }}>{lang === 'zh' ? '我的真实姓名是？' : 'What is my real name?'}</h2>
            <input
              type="text"
              value={quizInput}
              onChange={e => { setQuizInput(e.target.value); setQuizError(''); }}
              placeholder={lang === 'zh' ? '请输入...' : 'Please enter...'}
              style={{ width: '100%', padding: '0.6em', fontSize: '1em', borderRadius: 8, border: '1.5px solid #b2ebf2', marginBottom: 12 }}
              onKeyDown={e => { if (e.key === 'Enter') { handleQuizSubmit(); } }}
              autoFocus
            />
            {quizError && <div style={{ color: '#ff6ec4', marginBottom: 8, fontWeight: 600 }}>{quizError}</div>}
            <button className="contact-btn" style={{ width: '100%', marginBottom: 8 }} onClick={handleQuizSubmit}>
              {lang === 'zh' ? '提交' : 'Submit'}
            </button>
            <button className="close-btn" onClick={() => setShowContactQuiz(false)}>{lang === 'zh' ? '取消' : 'Cancel'}</button>
          </div>
        </div>
      )}
      {/* 弹窗 */}
      {showContact && (
        <div className="contact-modal-mask" onClick={() => setShowContact(false)}>
          <div className="contact-modal" onClick={e => e.stopPropagation()}>
            <h2>{lang === 'zh' ? '联系方式' : 'Contact Info'}</h2>
            <div className="modal-contacts">
              {p.contacts.map((c) => (
                <div className="contact-item modal" key={c.label}>
                  {c.icon}
                  <span>{c.label}:</span>
                  <span className="contact-value">{c.value}</span>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowContact(false)}>
              {lang === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
