import TryCatch from "../middleware/TryCatch.js";
import { Course } from "../models/Course.js";

export const createCourse = TryCatch(async (req, res) => {
    const { title, description, category, createdBy, duration, price } = req.body;
    const image = req.file; 
    await Course.create({
        title,
        description,
        category,
        createdBy,
        duration,
        price,
        image: image?.path, // Save the path of the uploaded image
    });

    res.status(201).json({
        message: "Course created successfully",
    });
});