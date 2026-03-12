import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import router from "./routes/user.js";

dotenv.config();
const app = express()

const PORT = process.env.PORT || 5000
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/auth",router)


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