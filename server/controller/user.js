import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js"; // Corrected path
import TryCatch from "../middleware/TryCatch.js";

export const register = TryCatch(async (req, res) => {
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

    // Generate OTP
    const otp = Math.floor(Math.random() * 1000000);

    // Generate activation token
    const activationToken = jwt.sign(
        { name, email, password: hashedPassword, otp },
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
        activationToken,
    });
});


export const verifyUser = TryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;

    // Verify the activation token
    let verify;
    try {
        verify = jwt.verify(activationToken, process.env.Activation_Secret);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
        });
    }

    // Check if the OTP matches
    if (verify.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP",
        });
    }

    // Create and save the user
    await User.create({
        name: verify.name,
        email: verify.email,
        password: verify.password,
    });

    res.json({
        message: "User verified and registered successfully",
    });
});

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "User does not exist",
        });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials",
        });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.Jwt_Sec, {
        expiresIn: "1h",
    });

    res.status(200).json({
        message: "Login successful",
        token,
    });
});

export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({user});
});