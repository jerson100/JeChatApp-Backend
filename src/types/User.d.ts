import { Types } from "mongoose";
import { SignInResponse } from "./Auth";
import { Express } from "express";
import { MetaDataPaginationResponse, QueryPagination } from "./utils";
import { Friend } from "./Friend";

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

type UserQueryParams = {
  username?: string;
} & QueryPagination;

type GetAllUserResponse = {
  metadata: MetaDataPaginationResponse;
  users: Omit<User, "password">[] & {
    friend?: Friend;
  };
};

export {
  User,
  CreatedUserRequest,
  CreateUserResponse,
  PatchUserRequest,
  PatchUserResponse,
  UserQueryParams,
  GetAllUserResponse,
};
