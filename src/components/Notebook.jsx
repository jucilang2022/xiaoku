import { Image, Send, Trash2, User, UserPlus } from 'lucide-react'

const Notebook = ({
    isLoggedIn,
    currentUser,
    posts,
    newPostText,
    selectedImage,
    isPosting,
    onNewPostTextChange,
    onImageSelect,
    onRemoveImage,
    onSubmitPost,
    onDeletePost,
    onLikePost,
    onOpenAuthModal
}) => {
    if (!isLoggedIn) {
        return (
            <section className="category-section">
                <div className="login-prompt">
                    <h2 className="category-title">记事簿功能</h2>
                    <p>登录后可使用记事簿功能，记录你的想法和分享图片</p>
                    <div className="prompt-actions">
                        <button className="prompt-btn login-prompt-btn" onClick={() => onOpenAuthModal('login')}>
                            <User size={16} />
                            立即登录
                        </button>
                        <button className="prompt-btn register-prompt-btn" onClick={() => onOpenAuthModal('register')}>
                            <UserPlus size={16} />
                            注册账号
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="category-section">
            <h2 className="category-title">{currentUser?.username}的记事簿</h2>

            {/* 发布新帖子 */}
            <div className="post-form-container">
                <form onSubmit={onSubmitPost} className="post-form">
                    <div className="post-input-wrapper">
                        <textarea
                            placeholder={`${currentUser?.username || '你'}这一刻的想法...`}
                            value={newPostText}
                            onChange={(e) => onNewPostTextChange(e.target.value)}
                            className="post-textarea"
                            rows="3"
                        />
                        {selectedImage && (
                            <div className="selected-image-preview">
                                <img src={selectedImage.data} alt="预览" />
                                <button
                                    type="button"
                                    onClick={onRemoveImage}
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
                                    onChange={onImageSelect}
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
                        <p>{currentUser?.username}还没有发布任何内容，快来分享你的第一个想法吧！</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="post-info">
                                    <div className="post-author-info">
                                        <img src={currentUser?.avatar || '/vite.svg'} alt="头像" className="post-author-avatar" />
                                        <span className="post-author">{currentUser?.username}</span>
                                    </div>
                                    <span className="post-time">{post.timestamp}</span>
                                </div>
                                <button
                                    onClick={() => onDeletePost(post.id)}
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
                                    onClick={() => onLikePost(post.id)}
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
    )
}

export default Notebook
