import { StatusCodes } from "http-status-codes";

export default class AuthenticationError extends Error {
  public status: number;
  constructor(message: string, status: number = StatusCodes.UNAUTHORIZED) {
    super(message);
    this.name = "AuthenticationError";
    this.status = status;
  }
}
