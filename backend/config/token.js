import jwt from "jsonwebtoken"
export const generateAcessToken = (user) => {
    try {
        return jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
                type: "access"
            },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )
    } catch (error) {
        console.log("Error in Genereate token function : ", error);
        return null;
    }
}

export const generateRefreshToken = (user) => {
    try {
        return jwt.sign(
            {
                userId: user._id,
                type: "refresh"
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        )
    }
    catch (error) {
        console.log("Error in Genereate token function : ", error);
        return null;
    }
}