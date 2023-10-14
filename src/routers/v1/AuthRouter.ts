import AuthController from "../../controllers/AuthController";
import { Router } from "express";
import handleErrorRequestFunction from "../../middlewares/handleErrorRequest";
import validateSchema from "../../middlewares/validateSchema";
import { SingInValidationSchema } from "../../models/UserModel/UserModel.validation";

const AuthRouter = Router();

AuthRouter.post(
  "/signin",
  validateSchema(SingInValidationSchema),
  handleErrorRequestFunction(AuthController.signIn)
);

export default AuthRouter;
