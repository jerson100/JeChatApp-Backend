import AuthenticationError from "../lib/AuthenticationError";
import { generateToken } from "../lib/jwt";
import UserModel from "../models/UserModel/UserModel";
import { Auth, SignInResponse } from "../types/Auth";

export default class AuthService {
  static async singIn({
    email,
    password,
  }: Auth): Promise<SignInResponse | null> {
    const user = await UserModel.findOne({
      email: email,
    });
    if (user) {
      const passwordMatch = await user.equalPassword(password);
      if (passwordMatch) {
        const newToken = generateToken({
          _id: user._id,
          username: user.username,
          email: user.email,
          urlImageProfile: user.urlImageProfile,
        });
        return {
          token: newToken,
          user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            urlImageProfile: user.urlImageProfile,
          },
        };
      }
    }
    throw new AuthenticationError("Correo o contraseña incorrectos");
  }
}
