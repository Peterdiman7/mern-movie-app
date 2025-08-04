import express from "express"

import {
    getCommentsByMovieId,
    createComment,
    deleteComment,
    updateComment
} from "../controller/comment.controller.js"

const router = express.Router()

// Get all comments for a specific movie
router.get("/movie/:movieId", getCommentsByMovieId)

// Create a new comment for a movie
router.post("/movie/:movieId", createComment)

// Update a comment (users can only update their own comments)
router.put("/:commentId", updateComment)

// Delete a comment (users can only delete their own comments)
router.delete("/:commentId", deleteComment)

export default router