import jwt from "jsonwebtoken";
import { User } from "../models/user.js"; // Corrected path

export const isAuth = async (req, res, next) => { // Marked as async
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({
                message: "Please login",
            });
        }

        const decodedData = jwt.verify(token, process.env.Jwt_Sec);
        req.user = await User.findById(decodedData.id); // Now works because the function is async
        if (!req.user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Login first",
        });
    }
};