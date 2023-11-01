import { StatusCodes } from "http-status-codes";
import HandlerRequestError from "../lib/handlerRequestError";
import { generateToken } from "../lib/jwt";
import UserModel from "../models/UserModel";
import { Types } from "mongoose";
import {
  CreateUserResponse,
  CreatedUserRequest,
  GetAllUserResponse,
  PatchUserRequest,
  PatchUserResponse,
  User,
  UserQueryParams,
} from "../types/User";
import { MappedTypeString } from "../types/utils";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { Friend } from "../types/Friend";

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
    const authObj = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      urlImageProfile: newUser.urlImageProfile,
    };
    const token = generateToken(authObj);
    return {
      user: authObj,
      token: token,
    };
  }

  static async patchUser(
    idUser: string,
    { email, image, password, username }: PatchUserRequest
  ): Promise<PatchUserResponse> {
    const user = await UserModel.findOne({ _id: idUser });
    if (!user)
      throw new HandlerRequestError(
        "El usuario no existe",
        undefined,
        StatusCodes.NOT_FOUND
      );

    const existsUser = await UserModel.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: idUser },
    });
    if (existsUser)
      throw new HandlerRequestError(
        "El correo o el nombre de usuario ya existe"
      );

    let _urlImage = "";
    if (image) {
      try {
        //get puvlic_id of url image
        const options: UploadApiOptions = { folder: "JeChatApp/profiles" };
        if (user.urlImageProfile) {
          const array = user.urlImageProfile.split("/");
          const public_id = array[array.length - 1].split(".")[0];
          options.public_id = public_id;
        }
        const result = await cloudinary.uploader.upload(image.path, options);
        // console.log(result.public_id);
        _urlImage = result.secure_url;
      } catch (e) {
        throw new HandlerRequestError(
          "Error al subir la imagen",
          undefined,
          StatusCodes.BAD_REQUEST
        );
      }
    }

    const obj: MappedTypeString = {};
    if (email) obj.email = email;
    if (username) obj.username = username;
    if (password) obj.password = await UserModel.setPassword(password);
    if (_urlImage) obj.urlImageProfile = _urlImage;
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: idUser,
      },
      {
        $set: obj,
      },
      {
        new: true,
      }
    );
    if (!updatedUser)
      throw new HandlerRequestError(
        "Error al actualizar el usuario",
        undefined,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    return {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      urlImageProfile: updatedUser.urlImageProfile,
    };
  }

  static async getUsers(
    query: UserQueryParams,
    idUser?: string
  ): Promise<GetAllUserResponse> {
    const _q_idUser = idUser ? { _id: { $ne: idUser } } : {};
    const _q_username = query.username
      ? {
          username: {
            $regex: new RegExp(`.*(${query.username}).*`, "i"),
          },
        }
      : {};
    const countItems = await UserModel.countDocuments({
      ..._q_idUser,
      ..._q_username,
    });
    const users = await UserModel.aggregate<
      User & {
        friend?: Friend;
      }
    >([
      {
        $match: { ..._q_idUser, ..._q_username },
      },
      {
        $lookup: {
          from: "friends",
          let: { idUser: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        {
                          $eq: ["$senderUserId", "$$idUser"],
                        },
                        {
                          $eq: [
                            "$receiverUserId",
                            new Types.ObjectId(idUser as string),
                          ],
                        },
                      ],
                    },
                    {
                      $and: [
                        {
                          $eq: ["$receiverUserId", "$$idUser"],
                        },
                        {
                          $eq: [
                            "$senderUserId",
                            new Types.ObjectId(idUser as string),
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "friend",
        },
      },
      {
        $sort: {
          username: 1,
        },
      },
      {
        $skip: (query.page - 1) * query.limit,
      },
      {
        $limit: query.limit,
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $unwind: {
          path: "$friend",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return {
      metadata: {
        totalItems: countItems,
        itemsPerPage: query.limit,
        currentPage: query.page,
      },
      users,
    };
  }
}
