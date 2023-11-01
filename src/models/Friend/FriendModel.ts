import { Document, Model, Schema, model } from "mongoose";
import { Friend } from "../../types/Friend";
import { REQUEST_STATUS } from "../../config/friendRequest.const";

interface FriendDocument extends Omit<Friend, "_id">, Document {}

interface FriendModel extends Model<FriendDocument> {}

const FriendSchema: Schema<FriendDocument> = new Schema(
  {
    senderUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connected: {
      type: Boolean,
      //   enum: REQUEST_STATUS,
      //   default: REQUEST_STATUS.PENDING,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FriendModel = model<FriendDocument, FriendModel>("Friend", FriendSchema);

export default FriendModel;
