import { Schema, ValidationError } from "yup";
import { Request, Response, NextFunction } from "express";
import HandlerRequestError from "../lib/handlerRequestError";

type Options = "body" | "file" | "params" | "query";

type validateSchemaType = <T>(
  schema: Schema<T>,
  options?: Options,
  reqParam?: Options
) => (req: Request, res: Response, next: NextFunction) => void;

const validateSchema: validateSchemaType = (
  schema,
  options = "body",
  reqParam = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[reqParam] = schema.validateSync(req[options], {
        abortEarly: false,
      });
      next();
    } catch (error: ValidationError | any) {
      if (error instanceof ValidationError) {
        const errors: { [key: string]: string[] } = {};
        error.inner.forEach((err) => {
          errors[err.path as string] = err.errors;
        });
        next(new HandlerRequestError(error.errors.join(", "), errors));
      } else {
        next(new HandlerRequestError(error.message ?? error));
      }
    }
  };
};

export default validateSchema;
