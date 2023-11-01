import { Request, Response } from "express";
import FriendService from "../services/FriendService";
import { Friend } from "../types/Friend";
import { StatusCodes } from "http-status-codes";
import { Payload } from "../lib/jwt";

export default class FriendController {
  static createFriend = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { _id: senderUserId } = req.user as Payload;
    const { receiverUserId } = req.body as Friend;
    const friend = await FriendService.createFriend(
      senderUserId as string,
      receiverUserId as string
    );
    return res.status(StatusCodes.CREATED).json(friend);
  };

  static updateFriend = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const { connected } = req.body as Friend;
    const friend = await FriendService.updateFriend({
      _id: id,
      connected,
    });
    return res.status(StatusCodes.OK).json(friend);
  };
}
