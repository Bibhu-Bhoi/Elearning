import jwt from "jsonwebtoken";
import { User } from "../models/user.js"; // Corrected path

export const isAuth = async (req, res, next) => {
    try {
        // Extract token directly from the Authorization header
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                message: "Please login",
            });
        }

        // Verify the token
        const decodedData = jwt.verify(token, process.env.Jwt_Sec);

        // Fetch the user from the database and include the role field
        req.user = await User.findById(decodedData.id).select("role");
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

export const isAdmin = async (req, res, next) => {
    try {
        // Ensure req.user exists and has a role
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not Admin",
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};