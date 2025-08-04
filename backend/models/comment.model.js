import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    username: {
        type: String,
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    }
}, {
    timestamps: true // createdAt, updatedAt
})

commentSchema.index({ movieId: 1, createdAt: -1 })

const Comment = mongoose.model('Comment', commentSchema)

export default Comment