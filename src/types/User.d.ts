import { Types } from "mongoose";

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

type CreateUserResponse = Omit<User, "password">;

export { User, CreatedUserRequest, CreateUserResponse };
