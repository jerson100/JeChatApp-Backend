import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { SingInRequest } from "../types/Auth";

export default class AuthController {
  static async signIn(req: Request, res: Response): Promise<Response> {
    const singInR = req.body as SingInRequest;
    const user = await AuthService.singIn(singInR);
    return res.status(200).json(user);
  }
}
