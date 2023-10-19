import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { StatusCodes } from "http-status-codes";
import HandlerRequestError from "../lib/handlerRequestError";

const verifyRequestToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
        next();
        return;
      }
    }
    next(
      new HandlerRequestError(
        "El token no es válido",
        undefined,
        StatusCodes.UNAUTHORIZED
      )
    );
  } catch (e) {
    next(
      new HandlerRequestError(
        "El token no es válido",
        undefined,
        StatusCodes.UNAUTHORIZED
      )
    );
  }
};

export default verifyRequestToken;
