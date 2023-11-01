import HandlerRequestError from "../lib/handlerRequestError";
import { Friend } from "../types/Friend";
import FriendModel from "../models/Friend/FriendModel";
import { StatusCodes } from "http-status-codes";

export default class FriendService {
  static createFriend = async (
    senderUserId: string,
    receiverUserId: string
  ): Promise<Friend> => {
    const exists = await FriendModel.findOne({
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
    await newFriend.save();
    const _newF: Friend = {
      _id: newFriend._id,
      senderUserId: newFriend.senderUserId,
      receiverUserId: newFriend.receiverUserId,
      connected: newFriend.connected,
      createdAt: newFriend.createdAt,
      updatedAt: newFriend.updatedAt,
    };
    return _newF;
  };

  static updateFriend = async ({
    _id,
    connected,
  }: Pick<Friend, "_id" | "connected">): Promise<Friend> => {
    const friend = await FriendModel.findOne({ _id });

    console.log(_id);
    if (!friend) {
      throw new HandlerRequestError(
        "La solicitud de amistad no existe",
        undefined,
        StatusCodes.NOT_FOUND
      );
    }

    const updatedFriend = await FriendModel.findOneAndUpdate(
      { _id },
      { $set: { connected } },
      { new: true }
    );
    if (!updatedFriend) {
      throw new HandlerRequestError(
        "La solicitud de amistad no se pudo actualizar",
        undefined,
        StatusCodes.BAD_REQUEST
      );
    }
    const objFriend: Friend = {
      _id: updatedFriend._id,
      senderUserId: updatedFriend.senderUserId,
      receiverUserId: updatedFriend.receiverUserId,
      connected: updatedFriend.connected,
      createdAt: updatedFriend.createdAt,
      updatedAt: updatedFriend.updatedAt,
    };
    return objFriend;
  };
}
