import "dotenv/config";

export default {
  JWT_SECRET: process.env.JWT_SECRET as string,
};
