import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

import movieRoutes from "./routes/movie.route.js"
import commentRoutes from "./routes/comment.route.js"

import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Required for ES Modules (__dirname fix)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

app.use("/api/movies", movieRoutes)
app.use("/api/comments", commentRoutes)

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    const frontendBuildPath = path.join(__dirname, "../frontend/build")
    app.use(express.static(frontendBuildPath))

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendBuildPath, "index.html"))
    })
}

app.listen(PORT, () => {
    connectDB()
    console.log(`Server started on port ${PORT}`)
})
