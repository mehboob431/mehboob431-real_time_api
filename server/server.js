import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import connectDb from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { socketInit } from "./socket/socket.js";


dotenv.config();
connectDb();


const app = express();
const server = http.createServer(app);


export const io = socketInit(server);


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


server.listen(process.env.PORT, () => {
console.log(`Server running on port ${process.env.PORT}`);
});