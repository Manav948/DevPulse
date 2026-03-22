import express from "express"
import { uploadthingHandler } from "../config/uploadThing"
const app = express()
app.use("/api/uploadthing", uploadthingHandler) 