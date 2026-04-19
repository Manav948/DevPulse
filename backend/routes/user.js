import express from "express"
import { signIn, signUp, logout, refreshToken } from "../controller/auth.js"
import { googleAuth } from "../controller/googleAuth.js";
import { githubAuth, githubAuthCallback } from "../controller/githubAuth.js";
import { isAuth } from "../middleware/auth.js";
import { authlimit } from "../middleware/rateLimit.js";

const router = express.Router()

router.post("/signUp", authlimit, signUp);
router.post("/signIn", authlimit, signIn);
router.post("/logout", logout)
router.post("/refresh", refreshToken)
router.post("/google", googleAuth)
router.post("/github", githubAuth)
router.get("/github/callback", githubAuthCallback)

export default router; 