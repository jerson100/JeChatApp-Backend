import { JwtPayload, sign, verify } from "jsonwebtoken";
import AUTH_CONTS from "../config/auth.conts";

type Payload = {
  _id: string;
  username: string;
  email: string;
  urlImageProfile?: string;
};

const generateToken = (payload: Payload) => {
  return sign(payload, AUTH_CONTS.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = (token: string): (JwtPayload & Payload) | null => {
  try {
    const payload = verify(token, AUTH_CONTS.JWT_SECRET) as JwtPayload &
      Payload;
    return payload;
  } catch (e) {
    return null;
  }
};

export { generateToken, verifyToken };
