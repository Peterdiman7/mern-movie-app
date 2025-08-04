import { useEffect, useState } from "react"
import MovieCard from "../components/MovieCard"
import styles from "./HomePage.module.css"

const HomePage = ({ searchTerm }) => {
    const [movies, setMovies] = useState([])
    const [filteredMovies, setFilteredMovies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAllMovies = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/movies', {
                    method: 'GET',
                    cache: 'no-cache'
                })
                const data = await res.json()
                setMovies(data.data || [])
                setFilteredMovies(data.data || [])
            } catch (error) {
                console.error(error)
                setMovies([])
                setFilteredMovies([])
            } finally {
                setLoading(false)
            }
        }

        getAllMovies()
    }, [])

    useEffect(() => {
        if (!searchTerm) {
            setFilteredMovies(movies)
        } else {
            const filtered = movies.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredMovies(filtered)
        }
    }, [searchTerm, movies])

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p className={styles.loadingText}>Loading movies...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>
                    {searchTerm ? `Search Results for "${searchTerm}"` : 'Movie Collection'}
                </h1>
                {searchTerm && (
                    <p className={styles.resultCount}>
                        Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {filteredMovies.length === 0 ? (
                <div className={styles.emptyState}>
                    {searchTerm ? (
                        <>
                            <h2>🔍 No Results Found</h2>
                            <p>No movies match your search for "{searchTerm}"</p>
                            <p>Try searching with different keywords or check the spelling.</p>
                        </>
                    ) : (
                        <>
                            <h2>🎬 No Movies Yet</h2>
                            <p>Your movie collection is empty.</p>
                            <p>Start by adding your first movie!</p>
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredMovies.map((movie) => (
                        <MovieCard
                            key={movie._id}
                            title={movie.title}
                            category={movie.category}
                            id={movie._id}
                            image={movie.image}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default HomePage