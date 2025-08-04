import { useState, useEffect } from 'react'
import styles from './CommentSection.module.css'

const CommentsSection = ({ movieId }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)

    const userMode = localStorage.getItem('userMode') || 'guest'
    const username = localStorage.getItem('username') || ''

    // Load comments from localStorage on component mount
    useEffect(() => {
        const savedComments = localStorage.getItem(`comments_${movieId}`)
        if (savedComments) {
            setComments(JSON.parse(savedComments))
        }
    }, [movieId])

    // Save comments to localStorage whenever comments change
    useEffect(() => {
        localStorage.setItem(`comments_${movieId}`, JSON.stringify(comments))
    }, [comments, movieId])

    const handleSubmitComment = async (e) => {
        e.preventDefault()

        if (!newComment.trim()) return
        if (userMode === 'guest') {
            alert('Please enter as a user to write comments!')
            return
        }

        setLoading(true)

        const comment = {
            id: Date.now().toString(),
            text: newComment.trim(),
            username: username,
            timestamp: new Date().toISOString(),
            movieId: movieId
        }

        try {
            setComments(prev => [comment, ...prev])
            setNewComment('')
        } catch (error) {
            console.error('Error adding comment:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = (commentId) => {
        const comment = comments.find(c => c.id === commentId)
        if (comment && comment.username === username) {
            setComments(prev => prev.filter(c => c.id !== commentId))
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })
    }

    return (
        <div className={styles.commentsContainer}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    💬 Comments ({comments.length})
                </h3>
            </div>

            {userMode === 'user' ? (
                <form onSubmit={handleSubmitComment} className={styles.commentForm}>
                    <div className={styles.formHeader}>
                        <span className={styles.userAvatar}>👤</span>
                        <span className={styles.formUsername}>{username}</span>
                    </div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts about this movie..."
                        className={styles.commentInput}
                        rows={3}
                        maxLength={500}
                        disabled={loading}
                    />
                    <div className={styles.formFooter}>
                        <span className={styles.charCount}>
                            {newComment.length}/500
                        </span>
                        <button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className={styles.submitButton}
                        >
                            {loading ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    Posting...
                                </>
                            ) : (
                                <>💭 Post Comment</>
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className={styles.guestMessage}>
                    <p>👋 You're browsing as a guest</p>
                    <p>Enter as a user to write comments and join the discussion!</p>
                </div>
            )}

            <div className={styles.commentsList}>
                {comments.length === 0 ? (
                    <div className={styles.emptyComments}>
                        <p>💭 No comments yet</p>
                        <p>Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <div className={styles.commentUser}>
                                    <span className={styles.avatar}>👤</span>
                                    <span className={styles.commentUsername}>
                                        {comment.username}
                                    </span>
                                    <span className={styles.commentTime}>
                                        {formatDate(comment.timestamp)}
                                    </span>
                                </div>
                                {userMode === 'user' && comment.username === username && (
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className={styles.deleteButton}
                                        title="Delete comment"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                            <div className={styles.commentText}>
                                {comment.text}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default CommentsSection