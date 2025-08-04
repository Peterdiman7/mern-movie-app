import express from "express"

import {
    createMovie,
    deleteMovie,
    getMovieById,
    getMovies,
    updateMovie
} from "../controller/movie.controller.js"

const router = express.Router()

router.get("/", getMovies)
router.get("/:id", getMovieById)
router.post("/", createMovie)
router.put("/:id", updateMovie)
router.delete("/:id", deleteMovie)

export default router