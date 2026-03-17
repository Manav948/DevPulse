import express from "express"
import { createMonitor } from "../controller/MonitorController.js"
import { isAuth } from "../middleware/auth.js";

const monitorRouter = express.Router()

monitorRouter.post("/", isAuth, createMonitor);

export default monitorRouter