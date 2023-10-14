import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import logger from "morgan";
import cors from "cors";
import AuthRouter from "./routers/v1/AuthRouter";
import UserRouter from "./routers/UserRouter";
import { connectDB } from "./lib/mongodb";
import HandlerRequestError from "./lib/handlerRequestError";
import AuthenticationError from "./lib/AuthenticationError";
import { StatusCodes } from "http-status-codes";

const app = express();

connectDB();

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
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});
