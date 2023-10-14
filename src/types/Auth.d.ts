import { Types } from "mongoose";
import { User } from "./User";

interface Auth extends Pick<User, "email" | "password"> {}

type SignInResponse = {
  token: string;
  user: Omit<User, "password">;
};

type SingInRequest = Auth;

export { Auth, SignInResponse, SingInRequest };
