import HandlerRequestError from "../lib/handlerRequestError";
import { Friend } from "../types/Friend";
import FriendModel from "../models/Friend/FriendModel";
import { StatusCodes } from "http-status-codes";

export default class FriendService {
  static createFriend = async (
    senderUserId: string,
    receiverUserId: string
  ): Promise<Friend> => {
    const exists = await FriendModel.findOne<Friend>({
      $or: [
        { senderUserId, receiverUserId },
        { senderUserId: receiverUserId, receiverUserId: senderUserId },
      ],
    });
    if (exists) {
      throw new HandlerRequestError(
        "La solicitud de amistad ya existe",
        undefined,
        400
      );
    }
    const newFriend = new FriendModel({
      senderUserId,
      receiverUserId,
    });
    newFriend.save();
    await newFriend.populate("senderUserId", "-password");
    await newFriend.populate("receiverUserId", "-password");
    console.log(newFriend);
    return newFriend;
  };

  static updateFriend = async ({
    _id,
    connected,
  }: Pick<Friend, "_id" | "connected">): Promise<Friend> => {
    const friend = await FriendModel.findOne<Friend>({ _id });

    if (!friend) {
      throw new HandlerRequestError(
        "La solicitud de amistad no existe",
        undefined,
        StatusCodes.NOT_FOUND
      );
    }

    const updatedFriend = await FriendModel.findOneAndUpdate<Friend>(
      { _id },
      { $set: { connected } },
      { new: true }
    )
      .populate("senderUserId", "-password")
      .populate("receiverUserId", "-password");
    if (!updatedFriend) {
      throw new HandlerRequestError(
        "La solicitud de amistad no se pudo actualizar",
        undefined,
        StatusCodes.BAD_REQUEST
      );
    }
    return updatedFriend;
  };

  static getRequestByIdUser = async (idUser: string): Promise<Friend[]> => {
    const friends = await FriendModel.find<Friend>({
      $or: [{ receiverUserId: idUser }],
      connected: false,
    })
      .populate("senderUserId", "-password")
      .populate("receiverUserId", "-password");
    return friends;
  };
}
