import { Document, model, Schema } from "mongoose";

export interface IAuth extends Document {
  email: string;
  password: string;
  urlImageProfile?: string;
}

const AuthSchema: Schema = new Schema<IAuth>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    urlImageProfile: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default model<IAuth>("Auth", AuthSchema);
