import { Document, model, Schema, Model } from "mongoose";
import { User } from "../../types/User";
import bcrypt from "bcrypt";

interface UserDocument extends Omit<User, "_id">, Document {
  setPassword(password: string): Promise<void>;
  equalPassword(plainPassword: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
  setPassword(password: string): Promise<string>;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    urlImageProfile: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.setPassword = async function (password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  this.password = hash;
};

UserSchema.statics.setPassword = async function (password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

UserSchema.methods.equalPassword = async function (
  plainPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, this.password);
};

export default model<UserDocument, UserModel>("User", UserSchema);
