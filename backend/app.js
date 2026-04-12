import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import router from "./routes/user.js";
import cors from 'cors'
import monitorRouter from "./routes/monitor.js";
import { startMonitor } from "./controller/MonitorController.js";
import settigsRouter from "./routes/profile.js";

dotenv.config();
const app = express()

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

startMonitor();
app.get("/", (req, res) => {
    res.send("This is response form TRacker")
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`The server is running on port : ${PORT}`)
    })
}).catch((error) => {
    console.error('Failed to connect to database:', error);
})