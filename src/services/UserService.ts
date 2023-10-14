import HandlerRequestError from "../lib/handlerRequestError";
import UserModel from "../models/UserModel";
import { CreateUserResponse, CreatedUserRequest } from "../types/User";

export default class UserService {
  static async createUser({
    email,
    password,
    username,
  }: CreatedUserRequest): Promise<CreateUserResponse> {
    const exitsUsersByEmailOrUsername = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (exitsUsersByEmailOrUsername) {
      throw new HandlerRequestError(
        "El correo o el nombre de usuario ya existe"
      );
    }
    const newUser = new UserModel({
      username,
      email,
    });
    await newUser.setPassword(password);
    await newUser.save();
    console.log(newUser);
    return {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }
}
