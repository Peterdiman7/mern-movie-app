import { useNavigate } from 'react-router-dom'
import styles from './MovieCard.module.css'

type Movie = {
    title: string
    category: string
    image: string
    id: string
}

const MovieCard = ({ title, category, image, id }: Movie) => {
    const navigate = useNavigate()

    const handleInfoClick = () => {
        navigate(`/${id}`)
    }

    const handleDeleteClick = async () => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return
        }

        try {
            const response = await fetch(`/api/movies/${id}`, {
                method: 'DELETE'
            })
            
            const data = await response.json()
            
            if (data.success) {
                // Refresh the page to update the movie list
                window.location.reload()
            } else {
                alert('Failed to delete movie')
            }
        } catch (error) {
            console.error('Error deleting movie:', error)
            alert('Failed to delete movie')
        }
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

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={image} alt={title} className={styles.image} />
                <div className={styles.categoryBadge} style={{ backgroundColor: getCategoryColor(category) }}>
                    {category}
                </div>
            </div>
            <div className={styles.content}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.buttons}>
                    <button onClick={handleInfoClick} className={styles.infoBtn}>
                        📖 Details
                    </button>
                    <button onClick={handleDeleteClick} className={styles.deleteBtn}>
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MovieCard