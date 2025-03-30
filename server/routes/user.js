import express from "express";
import { register,verifyUser,loginUser, myProfile} from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// Corrected route path
router.post('/user/register', register);
router.post('/user/verify', verifyUser); // Assuming you have a verifyUser function
// router.post('/user/verify', TryCatch(async (req, res) => {
router.post('/user/login', loginUser); // Assuming you have a loginUser function
router.get('user/me',isAuth, myProfile); // Assuming you have a myProfile function

export default router;