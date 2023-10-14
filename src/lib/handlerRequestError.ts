import { StatusCodes } from "http-status-codes";

export default class HandlerRequestError extends Error {
  public status: number;
  public errors?: { [property: string]: string[] };
  constructor(
    message: string,
    errors?: { [property: string]: string[] },
    status: number = StatusCodes.BAD_REQUEST
  ) {
    super(message);
    this.name = "HandlerRequestError";
    this.status = status;
    this.errors = errors;
  }
}
