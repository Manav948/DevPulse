import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import router from "./routes/user.js";
import cors from 'cors'
import monitorRouter from "./routes/monitor.js";
import { startMonitor } from "./controller/MonitorController.js";
import settigsRouter from "./routes/profile.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendDistPath = path.join(__dirname, "../frontend/dist")

const PORT = process.env.PORT || 5000
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

const defaultOrigins = ["http://localhost:5173", "https://devpulse.manavvalani.in"]
const frontendOrigin = process.env.FRONTEND_URL?.replace(/\/$/, "")
const allowedOrigins = frontendOrigin ? [...new Set([...defaultOrigins, frontendOrigin])] : defaultOrigins

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        callback(new Error(`CORS policy violation: origin ${origin} not allowed`))
    },
    credentials: true,
}))

app.use("/api/v1/auth", router)
app.use("/api/v1/monitor", monitorRouter)
app.use("/api/v1/users", settigsRouter)

app.use(express.static(frontendDistPath))

// Explicitly handle OAuth callback routes to avoid 404s on refresh/direct hit.
app.get(["/github/callback", "/google/callback"], (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"))
})

// Serve React app for all non-API routes.
app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"))
})

startMonitor();

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`The server is running on port : ${PORT}`)
    })
}).catch((error) => {
    console.error('Failed to connect to database:', error);
})