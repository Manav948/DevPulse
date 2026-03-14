import { OAuth2Client } from "google-auth-library"
import User from "../model/userModel.js"
import { generateToken } from "../config/token.js"
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload();

        const { sub, email, name, picture } = payload;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                username: name,
                email,
                profileImage: picture,
                provider: "google",
                providerId: sub,
                isVarified: true
            })
        }
        const jwtToken = generateToken(user);
        res.status(200).json({
            message: "Google login successfully",
            token: jwtToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })
    }
    catch (err) {
        console.log("Google auth error:", err);
        res.status(500).json({
            message: "Google authentication failed"
        });
    }
}