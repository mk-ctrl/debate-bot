import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
export const auth = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer token

    if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
}