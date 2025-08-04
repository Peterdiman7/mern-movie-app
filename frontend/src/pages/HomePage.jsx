import { useEffect, useState } from "react"
import MovieCard from "../components/MovieCard"
import styles from "./HomePage.module.css"

const HomePage = () => {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        const getAllMovies = async () => {
            try {
                const res = await fetch('/api/movies')
                const data = await res.json()
                setMovies(data.data)
            } catch (error) {
                console.error(error)
            }
        }

        getAllMovies()
    }, [])

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Movie List</h1>
            <div className={styles.grid}>
                {movies && movies.map((movie) => (
                    <MovieCard
                        key={movie._id}
                        title={movie.title}
                        category={movie.category}
                        id={movie._id}
                        image={movie.image}
                    />
                ))}
            </div>
        </div>
    )
}

export default HomePage
