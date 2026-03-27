import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRouter from "./user/user.routes.js";
import transactionRouter from "./transaction/transaction.routes.js";
import dashboardRouter from "./dashboard/dashboard.routes.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error", err));

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // ✅ FIXED
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/dashboard", dashboardRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});