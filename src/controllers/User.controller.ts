import { Request, Response } from "express";
import UserService from "../services/UserService";
import { CreatedUserRequest, PatchUserRequest } from "../types/User";

export default class UserController {
  static createUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const newUs = req.body as CreatedUserRequest;
    const user = await UserService.createUser(newUs);
    return res.status(201).json(user);
  };
  static patchUser = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body as PatchUserRequest;
    const { id } = req.params;
    const user = await UserService.patchUser(id, body);
    return res.status(200).json(user);
  };

  static getUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await UserService.getUsers();
    return res.status(200).json(users);
  };
}
