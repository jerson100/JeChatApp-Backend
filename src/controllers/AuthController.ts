import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { SingInRequest } from "../types/Auth";
import { Payload } from "../lib/jwt";

export default class AuthController {
  static async signIn(req: Request, res: Response): Promise<Response> {
    const singInR = req.body as SingInRequest;
    const user = await AuthService.singIn(singInR);
    return res.status(200).json(user);
  }
  static async verify(req: Request, res: Response): Promise<Response> {
    const us = req.user as Payload;
    const auth = await AuthService.verify(us.username);
    return res.status(200).json(auth);
  }
}
