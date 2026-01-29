import express from "express";
import register from "../controllers/Auth/register.js";
import login from "../controllers/Auth/login.js";
import verifyOtp from "../controllers/Auth/verifyOtp.js";


const router = express.Router();


router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);


export default router;