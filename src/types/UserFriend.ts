import Friend from "../models/Friend";
import { User } from "./User";

export type UserFriend = Omit<User, "password"> & {
  friend?: Friend;
};
