import mongoose from "mongoose";
//import { duplexPair } from "nodemailer/lib/xoauth2";
const schema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    duration:{
        type: Number,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    createdBy:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },

},
{ timestamps: true });
// Exporting the model

export const Course = mongoose.model("Courses", schema);

