import mongoose from "mongoose"
import Movie from "../models/movie.model.js"

export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({})
        res.setHeader('Cache-Control', 'no-store')
        res.status(200).json({ success: true, data: movies })
    } catch (error) {
        console.log("Error in fetching movies: ", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const getMovieById = async (req, res) => {
    const id = req.params.id
    console.log("id: ", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Movie Id!" })
    }

    try {
        const movie = await Movie.findById(id)
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found!" })
        }
        res.status(200).json({ success: true, data: movie })
    } catch (error) {
        console.log("Error in fetching movie: ", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const createMovie = async (req, res) => {
    const movie = req.body // user sends the data

    if (!movie.title || !movie.category || !movie.image || !movie.description) {
        return res.status(400).json({ success: false, message: "Please provide all fields" })
    }

    const newMovie = new Movie(movie)

    try {
        await newMovie.save()
        res.status(201).json({ success: true, data: newMovie })
    } catch (error) {
        console.log("Error in Create movie: ", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const updateMovie = async (req, res) => {
    const id = req.params.id

    const movie = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Movie Id!" })
    }

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(id, movie, { new: true })
        res.status(200).json({ success: true, data: updatedMovie })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const deleteMovie = async (req, res) => {
    const id = req.params.id
    console.log("id: ", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Movie Id!" })
    }

    try {
        await Movie.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: "Movie Deleted!" })
    } catch (error) {
        console.log("Error in deleting movie: ", error.message)
        res.status(500).json({ success: false, message: "Server Error!" })
    }
}