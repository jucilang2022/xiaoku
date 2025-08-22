import { useState } from 'react'
import { Image, Send, Trash2, User, UserPlus, MessageCircle } from 'lucide-react'

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
    onAddComment,
    onDeleteComment,
    onOpenAuthModal
}) => {
    const [commentTexts, setCommentTexts] = useState({})
    const [showCommentInputs, setShowCommentInputs] = useState({})

    const handleCommentSubmit = (postId) => {
        const commentText = commentTexts[postId] || ''
        if (commentText.trim()) {
            onAddComment(postId, commentText)
            setCommentTexts(prev => ({ ...prev, [postId]: '' }))
            setShowCommentInputs(prev => ({ ...prev, [postId]: false }))
        }
    }

    const toggleCommentInput = (postId) => {
        setShowCommentInputs(prev => ({ ...prev, [postId]: !prev[postId] }))
        if (!showCommentInputs[postId]) {
            setCommentTexts(prev => ({ ...prev, [postId]: '' }))
        }
    }

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
                                    onClick={() => {
                                        if (window.confirm('确定要删除这条帖子吗？')) {
                                            onDeletePost(post.id)
                                        }
                                    }}
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
                                    onClick={() => toggleCommentInput(post.id)}
                                    className="comment-btn"
                                    title="评论"
                                >
                                    <MessageCircle size={16} />
                                    {post.comments?.length || 0} 评论
                                </button>
                            </div>

                            {/* 评论输入框 */}
                            {showCommentInputs[post.id] && (
                                <div className="comment-input-container">
                                    <textarea
                                        placeholder="写下你的评论..."
                                        value={commentTexts[post.id] || ''}
                                        onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        className="comment-textarea"
                                        rows="2"
                                    />
                                    <div className="comment-input-actions">
                                        <button
                                            type="button"
                                            onClick={() => setShowCommentInputs(prev => ({ ...prev, [post.id]: false }))}
                                            className="comment-cancel-btn"
                                        >
                                            取消
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleCommentSubmit(post.id)}
                                            disabled={!commentTexts[post.id]?.trim()}
                                            className="comment-submit-btn"
                                        >
                                            发送
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 评论列表 */}
                            {post.comments && post.comments.length > 0 && (
                                <div className="comments-container">
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="comment-item">
                                            <div className="comment-header">
                                                <div className="comment-author-info">
                                                    <img src={comment.author === currentUser?.username ? currentUser?.avatar || '/vite.svg' : comment.authorAvatar} alt="头像" className="comment-author-avatar" />
                                                    <span className="comment-author">{comment.author}</span>
                                                </div>
                                                <span className="comment-time">{comment.timestamp}</span>
                                            </div>
                                            <div className="comment-content">
                                                <p>{comment.text}</p>
                                            </div>
                                            {comment.author === currentUser?.username && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('确定要删除这条评论吗？')) {
                                                            onDeleteComment(post.id, comment.id)
                                                        }
                                                    }}
                                                    className="delete-comment-btn"
                                                    title="删除评论"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

export default Notebook
