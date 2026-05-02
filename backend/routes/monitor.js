import express from "express"
import { createMonitor, deleteMonitor, getAllMonitor, getMonitor, updateMonitor } from "../controller/MonitorController.js"
import { isAuth } from "../middleware/auth.js";

const monitorRouter = express.Router()

monitorRouter.post("/", isAuth, createMonitor);
monitorRouter.delete("/:id", isAuth , deleteMonitor);
monitorRouter.get("/:id", isAuth , getMonitor);
monitorRouter.get("/", isAuth , getAllMonitor)
monitorRouter.put("/:id", isAuth, updateMonitor);

export default monitorRouter