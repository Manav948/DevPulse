import jwt from "jsonwebtoken"

export const isAuth = (req, res, next) => {
    try {
        let token;

        if (req.cookies?.token) {
            token = req.cookies.token
        }
        if (!token && req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.log("Authentication error : ", error)
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}