import { Types } from "mongoose";
import { SignInResponse } from "./Auth";
import { Express } from "express";

interface User {
  _id: string | Types.ObjectId;
  username: string;
  email: string;
  password: string;
  urlImageProfile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type CreatedUserRequest = Pick<User, "username" | "password" | "email">;

type PatchUserRequest = Partial<
  Omit<User, "_id" | "createdAt" | "updatedAt" | "urlImageProfile"> & {
    image: Express.Multer.File;
  }
>;

type CreateUserResponse = SignInResponse;
type PatchUserResponse = Omit<User, "password">;
// type CreateUserResponse = Omit<User, "password">;

export {
  User,
  CreatedUserRequest,
  CreateUserResponse,
  PatchUserRequest,
  PatchUserResponse,
};
