import axios from "axios"
import User from "../model/userModel.js"
import { generateToken } from "../config/token.js"
export const githubAuth = async (req, res) => {
    try {
        const { code } = req.body;

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
        )

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.post(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const githubUser = userResponse.data

        let user = await User.findOne({
            providerId: githubUser.id
        })
        if (!user) {
            user = await User.create({
                username: githubUser.login,
                email: githubUser.email || `${githubUser.login}@github.com`,
                profileImage: githubUser.avatar_url,
                provider: "github",
                providerId: githubUser.id,
                isVerified: true
            })
        }
        const token = generateToken(user)
        res.json({
            message: "GitHub login successful",
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "GitHub authentication failed"
        });
    }
}