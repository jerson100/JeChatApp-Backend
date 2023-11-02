import { Types } from "mongoose";
import { REQUEST_STATUS } from "../config/friendRequest.const";
import { User } from "./User";

export type FriendStatus = keyof typeof REQUEST_STATUS;

export interface Friend {
  _id?: string | Types.ObjectId;
  senderUserId: string | Types.ObjectId | Omit<User, "password">;
  receiverUserId: string | Types.ObjectId | Omit<User, "password">;
  connected: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
