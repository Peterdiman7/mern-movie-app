import mongoose from "mongoose"
import Comment from "../models/comment.model.js"
import Movie from "../models/movie.model.js"

export const getCommentsByMovieId = async (req, res) => {
    const { movieId } = req.params

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(404).json({ success: false, message: "Invalid Movie Id!" })
    }

    try {
        const comments = await Comment.find({ movieId })
            .sort({ createdAt: -1 })
            .limit(100)

        res.status(200).json({ success: true, data: comments })
    } catch (error) {
        console.log("Error in fetching comments: ", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const createComment = async (req, res) => {
    const { movieId } = req.params
    const { text, username } = req.body

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(404).json({ success: false, message: "Invalid Movie Id!" })
    }

    if (!text || !username) {
        return res.status(400).json({ success: false, message: "Please provide text and username" })
    }

    if (text.length > 500) {
        return res.status(400).json({ success: false, message: "Comment text cannot exceed 500 characters" })
    }

    try {
        // Check if movie exists
        const movie = await Movie.findById(movieId)
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found!" })
        }

        const newComment = new Comment({
            text: text.trim(),
            username: username.trim(),
            movieId
        })

        await newComment.save()
        res.status(201).json({ success: true, data: newComment })
    } catch (error) {
        console.log("Error in creating comment: ", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const deleteComment = async (req, res) => {
    const { commentId } = req.params
    const { username } = req.body

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(404).json({ success: false, message: "Invalid Comment Id!" })
    }

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required" })
    }

    try {
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found!" })
        }

        // Check if the user owns this comment
        if (comment.username !== username.trim()) {
            return res.status(403).json({ success: false, message: "You can only delete your own comments" })
        }

        await Comment.findByIdAndDelete(commentId)
        res.status(200).json({ success: true, message: "Comment deleted successfully!" })
    } catch (error) {
        console.log("Error in deleting comment: ", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const updateComment = async (req, res) => {
    const { commentId } = req.params
    const { text, username } = req.body

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(404).json({ success: false, message: "Invalid Comment Id!" })
    }

    if (!text || !username) {
        return res.status(400).json({ success: false, message: "Please provide text and username" })
    }

    if (text.length > 500) {
        return res.status(400).json({ success: false, message: "Comment text cannot exceed 500 characters" })
    }

    try {
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found!" })
        }

        if (comment.username !== username.trim()) {
            return res.status(403).json({ success: false, message: "You can only edit your own comments" })
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { text: text.trim() },
            { new: true }
        )

        res.status(200).json({ success: true, data: updatedComment })
    } catch (error) {
        console.log("Error in updating comment: ", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}