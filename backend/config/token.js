import jwt from "jsonwebtoken"
export const generateToken = (user) => {
    try {
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
        return token
    } catch (error) {
        console.log("Error in Genereate token function : ", error);
        return null;
    }
}