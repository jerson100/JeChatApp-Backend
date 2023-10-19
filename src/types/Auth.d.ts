import { Types } from "mongoose";
import { User } from "./User";
import { Payload } from "../lib/jwt";

interface Auth extends Pick<User, "username" | "password"> {}

type SignInResponse = {
  token: string;
  user: Omit<User, "password">;
};

type SingInRequest = Auth;

declare global {
  namespace Express {
    interface Request {
      user?: Payload;
    }
  }
}

export { Auth, SignInResponse, SingInRequest };
