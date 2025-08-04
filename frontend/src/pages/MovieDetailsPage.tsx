import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './MovieDetailsPage.module.css'

interface Movie {
    _id: string
    title: string
    category: string
    description: string
    image: string
    createdAt: string
    updatedAt: string
}

const MovieDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`/api/movies/${id}`)
                const data = await response.json()

                if (data.success) {
                    setMovie(data.data)
                } else {
                    setError('Movie not found')
                }
            } catch (err) {
                setError('Failed to fetch movie details')
                console.error('Error fetching movie:', err)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchMovie()
        }
    }, [id])

    const handleDelete = async () => {
        if (!movie || !window.confirm('Are you sure you want to delete this movie?')) {
            return
        }

        try {
            const response = await fetch(`/api/movies/${movie._id}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (data.success) {
                navigate('/')
            } else {
                alert('Failed to delete movie')
            }
        } catch (err) {
            console.error('Error deleting movie:', err)
            alert('Failed to delete movie')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Action': '#ff6b6b',
            'Comedy': '#4ecdc4',
            'Drama': '#45b7d1',
            'Horror': '#96ceb4',
            'Romance': '#ffeaa7',
            'Sci-Fi': '#a29bfe',
            'Thriller': '#fd79a8',
            'Animation': '#fdcb6e',
            'Fantasy': '#6c5ce7',
            'Adventure': '#00b894'
        }
        return colors[category] || '#74b9ff'
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading movie details...</p>
                </div>
            </div>
        )
    }

    if (error || !movie) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>😔 Oops!</h2>
                    <p>{error || 'Movie not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className={styles.backButton}
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.imageSection}>
                    <img
                        src={movie.image}
                        alt={movie.title}
                        className={styles.movieImage}
                    />
                    <div className={styles.imageOverlay}>
                        <span
                            className={styles.categoryBadge}
                            style={{ backgroundColor: getCategoryColor(movie.category) }}
                        >
                            {movie.category}
                        </span>
                    </div>
                </div>

                <div className={styles.detailsSection}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{movie.title}</h1>
                        <div className={styles.metadata}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Category:</span>
                                <span className={styles.metaValue}>{movie.category}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Added:</span>
                                <span className={styles.metaValue}>{formatDate(movie.createdAt)}</span>
                            </div>
                            {movie.updatedAt !== movie.createdAt && (
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Last Updated:</span>
                                    <span className={styles.metaValue}>{formatDate(movie.updatedAt)}</span>
                                </div>
                            )}
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Movie ID:</span>
                                <span className={styles.metaValue}>{movie._id}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <h3>About this Movie</h3>
                        {movie.description ?
                            <p>{movie.description}</p>
                            :
                            <p>
                                This {movie.category.toLowerCase()} movie "{movie.title}" was added to our collection
                                on {formatDate(movie.createdAt)}. Experience the magic of cinema with this
                                carefully curated title that promises to deliver entertainment and memorable moments.
                            </p>}
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>★</div>
                            <div className={styles.statLabel}>Featured</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>HD</div>
                            <div className={styles.statLabel}>Quality</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>📺</div>
                            <div className={styles.statLabel}>Streaming</div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={() => navigate('/')}
                            className={styles.backButton}
                        >
                            ← Back to Movies
                        </button>
                        <button
                            onClick={handleDelete}
                            className={styles.deleteButton}
                        >
                            🗑️ Delete Movie
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetailsPage