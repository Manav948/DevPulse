import { generateAcessToken, generateRefreshToken } from "../config/token.js"
import User from "../model/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const signUp = async (req, res) => {

    try {
        const { username, email, password } = req.body
        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            return res.status(409).json({ message: 'User Already Exist' })
        }
        if (password.length < 6 || !password) {
            return res.status(400).json({ message: 'Password Must be 6 Digit' })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            provider: "local"
        })

        const accessToken = generateAcessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(201).json({
            message: "User registered",
            token: accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.log("Error in SignUp Router")
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const signIn = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password +refreshToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.provider !== "local") {
            return res.status(400).json({
                message: "Please login using Google"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const acessToken = generateAcessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Login successful",
            token: acessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "No Refresh Token Provided" })
        }
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId).select("+refreshToken");

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid Refersh Token" })
        }
        const newAccessToken = generateAcessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        })
        res.json({ accessToken: newAccessToken })
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const user = await User.findOne({ refreshToken: token });

            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}