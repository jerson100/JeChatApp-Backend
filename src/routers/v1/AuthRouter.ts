import AuthController from "../../controllers/AuthController";
import { Router } from "express";
import handleErrorRequestFunction from "../../middlewares/handleErrorRequest";
import validateSchema from "../../middlewares/validateSchema";
import {
  CreatedUserValidationSchema,
  SingInValidationSchema,
} from "../../models/UserModel/UserModel.validation";
import UserController from "../../controllers/User.controller";
import verifyRequestToken from "../../middlewares/verifyToken";

const AuthRouter = Router();

AuthRouter.post(
  "/signin",
  validateSchema(SingInValidationSchema, "body", "body"),
  handleErrorRequestFunction(AuthController.signIn)
);
AuthRouter.post(
  "/signup",
  validateSchema(CreatedUserValidationSchema),
  handleErrorRequestFunction(UserController.createUser)
);

AuthRouter.get(
  "/verify",
  verifyRequestToken,
  handleErrorRequestFunction(AuthController.verify)
);

export default AuthRouter;
