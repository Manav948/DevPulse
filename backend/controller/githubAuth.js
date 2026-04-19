import axios from "axios"
import User from "../model/userModel.js"
import { generateAcessToken, generateRefreshToken } from "../config/token.js"

const getFrontendRedirectBase = (req) => {
    const configured = process.env.FRONTEND_URL?.replace(/\/$/, "");
    if (configured) return configured;

    // Safe fallback when FRONTEND_URL is missing in production.
    const host = req.get("host");
    if (!host) return "http://localhost:5173";
    return `${req.protocol}://${host}`;
};

const authenticateWithGithubCode = async (code) => {
    const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        },
        {
            headers: { Accept: "application/json" }
        }
    );

    const accessTokenGithub = tokenResponse.data.access_token;
    if (!accessTokenGithub) {
        throw new Error("Failed to get GitHub access token");
    }

    const userResponse = await axios.get(
        "https://api.github.com/user",
        {
            headers: {
                Authorization: `Bearer ${accessTokenGithub}`,
                Accept: "application/json",
                "User-Agent": "node.js"
            }
        }
    );

    const githubUser = userResponse.data;

    let user = await User.findOne({
        providerId: githubUser.id
    });

    if (!user) {
        user = await User.create({
            username: githubUser.login,
            email: githubUser.email || `${githubUser.login}@github.com`,
            profileImage: githubUser.avatar_url,
            provider: "github",
            providerId: githubUser.id,
            isVerified: true
        });
    }
    return user;
};

export const githubAuth = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: "GitHub code missing" });
        }
        const user = await authenticateWithGithubCode(code);
        const accessToken = generateAcessToken(user)
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "Strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({
            message: "GitHub authentication successful",
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "GitHub authentication failed"
        });
    }
}

export const githubAuthCallback = async (req, res) => {
    try {
        const code = req.query.code;
        const frontendBase = getFrontendRedirectBase(req);

        if (!code) {
            return res.redirect(`${frontendBase}/signin?oauthError=github_code_missing`);
        }

        const user = await authenticateWithGithubCode(code);
        const accessToken = generateAcessToken(user)
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "Strict",
            secure: true,
        })
        return res.redirect(`${frontendBase}/oauth-success#token=${accessToken}`);
    } catch (error) {
        console.log(error);
        const frontendBase = getFrontendRedirectBase(req);
        return res.redirect(`${frontendBase}/signin?oauthError=github_failed`);
    }
};