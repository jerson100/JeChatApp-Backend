import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import logger from "morgan";
import cors from "cors";
import AuthRouter from "./routers/v1/AuthRouter";
import UserRouter from "./routers/v1/UserRouter";
import { connectDB } from "./lib/mongodb";
import HandlerRequestError from "./lib/handlerRequestError";
import AuthenticationError from "./lib/AuthenticationError";
import { StatusCodes } from "http-status-codes";
import { MulterError } from "multer";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { v2 as cloudinary } from "cloudinary";

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

connectDB();

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (payload, done) => {
      done(null, payload);
    }
  )
);

app.use(passport.initialize());

app.use(logger("dev"));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof HandlerRequestError) {
    res.status(error.status).json({
      message: error.message,
      errors: error.errors,
    });
  } else if (error instanceof AuthenticationError) {
    res.status(error.status).json({
      message: error.message,
    });
  } else if (error instanceof MulterError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.field ? `El archivo ${error.field} es muy grande` : error,
    });
  } else {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});
