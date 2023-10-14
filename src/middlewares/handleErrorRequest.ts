import { Request, Response, NextFunction } from "express";

type handleErrorRequestFunction = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void | Response>;

const handleErrorRequest = (cb: handleErrorRequestFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default handleErrorRequest;
