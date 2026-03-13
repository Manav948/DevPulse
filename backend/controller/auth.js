import { generateToken } from "../config/token.js"
import User from "../model/userModel.js"
import bcrypt from "bcryptjs"

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

        const token = generateToken(user);
        res.status(201).json({
            message : "User registered successfully",
            token,
            user : {
                id: user._id,
                username : user.username,
                email : user.email

            }
        })   
    } catch (error) {
        console.log("Error in SignUp Router")
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const signIn = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(user.provider !== "local"){
            return res.status(400).json({
                message : "Please login using Google"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        user.lastLogin  = new Date();
        await user.save()
        
        const token = generateToken(user)

        res.status(200).json({
            message: "Login successful",
            token,
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