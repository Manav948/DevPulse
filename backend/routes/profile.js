import express from "express"
import { isAuth } from "../middleware/auth.js";
import { getMe, updateProfile } from "../controller/ProfileController.js";

const settigsRouter = express.Router();

settigsRouter.put("/profile", isAuth, updateProfile);
settigsRouter.get("/me", isAuth, getMe);

export default settigsRouter;