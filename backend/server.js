import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

import movieRoutes from "./routes/movie.route.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.use("/api/movies", movieRoutes)

app.listen(5000, () => {
    connectDB()
    console.log('Server started at http://localhost:' + PORT)
})