import jwt from "jsonwebtoken"

export const isAuth = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type && decoded.type !== "access") {
            return res.status(401).json({ message: "Invalid token type" });
        }
        req.user = {
            id : decoded.userId,
            email : decoded.email,
            role : decoded.role
        }
        next()
    } catch (error) {
        console.log("Authentication error : ", error)
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}