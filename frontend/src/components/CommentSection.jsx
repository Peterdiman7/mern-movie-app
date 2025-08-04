import { useState, useEffect } from 'react'
import styles from './CommentSection.module.css'

const CommentsSection = ({ movieId }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [commentsLoading, setCommentsLoading] = useState(true)
    const [error, setError] = useState('')

    const userMode = localStorage.getItem('userMode') || 'guest'
    const username = localStorage.getItem('username') || ''

    // Load comments from MongoDB on component mount
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setCommentsLoading(true)
                const response = await fetch(`/api/comments/movie/${movieId}`)
                const data = await response.json()

                if (data.success) {
                    setComments(data.data || [])
                } else {
                    console.error('Failed to fetch comments:', data.message)
                    setComments([])
                }
            } catch (error) {
                console.error('Error fetching comments:', error)
                setComments([])
            } finally {
                setCommentsLoading(false)
            }
        }

        if (movieId) {
            fetchComments()
        }
    }, [movieId])

    const handleSubmitComment = async (e) => {
        e.preventDefault()

        if (!newComment.trim()) return
        if (userMode === 'guest') {
            alert('Please enter as a user to write comments!')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/comments/movie/${movieId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: newComment.trim(),
                    username: username
                })
            })

            const data = await response.json()

            if (data.success) {
                // Add the new comment to the beginning of the list
                setComments(prev => [data.data, ...prev])
                setNewComment('')
            } else {
                setError(data.message || 'Failed to post comment')
            }
        } catch (error) {
            console.error('Error posting comment:', error)
            setError('Failed to post comment. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return
        }

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            })

            const data = await response.json()

            if (data.success) {
                setComments(prev => prev.filter(comment => comment._id !== commentId))
            } else {
                alert(data.message || 'Failed to delete comment')
            }
        } catch (error) {
            console.error('Error deleting comment:', error)
            alert('Failed to delete comment. Please try again.')
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

    if (commentsLoading) {
        return (
            <div className={styles.commentsContainer}>
                <div className={styles.header}>
                    <h3 className={styles.title}>💬 Comments</h3>
                </div>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading comments...</p>
                </div>
            </div>
        )
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

                    {error && <div className={styles.errorMessage}>{error}</div>}

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
                        <div key={comment._id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <div className={styles.commentUser}>
                                    <span className={styles.avatar}>👤</span>
                                    <span className={styles.commentUsername}>
                                        {comment.username}
                                    </span>
                                    <span className={styles.commentTime}>
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                                {userMode === 'user' && comment.username === username && (
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
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