import express from "express"
import { signIn, signUp } from "../controller/auth.js"
import { googleAuth } from "../controller/googleAuth.js";
import { githubAuth, githubAuthCallback } from "../controller/githubAuth.js";
import { isAuth } from "../middleware/auth.js";
import { updateProfile } from "../controller/ProfileController.js";

const router = express.Router()

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/google", googleAuth)
router.post("/github", githubAuth)
router.get("/github/callback", githubAuthCallback)

export default router;