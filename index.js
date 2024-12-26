import express from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./Config/connectDB.js";
import userRouter from "./Routes/user.route.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import blogRouter from "./Routes/blog.route.js"
import followRouter from "./Routes/follow.route.js"
const app = express();
config();
//Global Middlewares
app.use(
  cors({
    origin: `http://localhost:5173`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(fileUpload({useTempFiles: true}));  
app.use("/api/auth", userRouter);
app.use("/api/", blogRouter);
app.use(`/api/` , followRouter);
// PORT#
const port = process.env.PORT || 3000;

// Listen the backend server..
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectDB();
});
