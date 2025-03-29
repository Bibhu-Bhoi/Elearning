import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js"; // Corrected path

export const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate OTP
        const otp = Math.floor(Math.random() * 1000000);

        // Generate activation token
        const activationToken = jwt.sign(
            { id: user._id, email: user.email, otp },
            process.env.Activation_Secret,
            { expiresIn: "5m" }
        );

        // Prepare email data
        const data = {
            name,
            otp,
        };

        // Send OTP email
        await sendMail(email, "E learning", data);

        // Send a single response
        res.status(201).json({
            message: "User registered successfully. OTP sent to your email.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            activationToken,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};