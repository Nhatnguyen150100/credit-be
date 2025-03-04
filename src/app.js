import express, { json, urlencoded, static as static_ } from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { config } from "dotenv";
config();

import { log } from "console";
import informationRouter from "./routes/informationRouter";
import authRouter from "./routes/authRouter";
import connectDB from "./config/database";
import bankRouter from "./routes/bankRouter";
import authUserRouter from "./routes/authUserRouter";
import otpRouter from "./routes/otpRouter";

connectDB();

var app = express();
app.use(
  cors({
    origin: process.env.BASE_URL_CLIENT,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    exposedHeaders: ["X-Total-Count", "token"],
  })
);

app.use(helmet());
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  legacyHeaders: true,
  message: "Too many requests from this IP, please try again in 5 minutes",
});
app.use(limiter);

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "..", "public")));

app.use("/v1/information", informationRouter);
app.use("/v1/bank", bankRouter);
app.use("/v1/admin", authRouter);
app.use("/v1/auth", authUserRouter);
app.use("/v1/otp", otpRouter);

app.listen(process.env.PORT || 8081, () => {
  log("server listening on port: " + (process.env.PORT || 8081));
});

export default app;
