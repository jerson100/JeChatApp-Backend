import { Request, Response } from "express";
import UserService from "../services/UserService";
import { CreatedUserRequest } from "../types/User";

export default class UserController {
  static createUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const newUs = req.body as CreatedUserRequest;
    const user = await UserService.createUser(newUs);
    return res.status(201).json(user);
  };
}
