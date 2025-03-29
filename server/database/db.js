import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB); // Removed deprecated options
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection error:", error);
    }
};