import express from "express";
import { createTask, assignTask } from "../controllers/taskController.js";
import verifyToken from "../utils/verifyToken.js";


const router = express.Router();


router.post("/", verifyToken, createTask);
router.put("/assign/:id", verifyToken, assignTask);


export default router;