import { Route, useNavigate } from 'react-router-dom'
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

    return (
        <div className={styles.card}>
            <img src={image} alt={title} className={styles.image} />
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.category}>{category}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={handleInfoClick} className={styles['info-btn']}>Info</button>
                <button className={styles['delete-btn']}>Delete</button>
            </div>
        </div>
    )
}

export default MovieCard

