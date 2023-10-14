import UserController from "../controllers/User.controller";
import { Router } from "express";
import handleErrorRequest from "../middlewares/handleErrorRequest";
import validateSchema from "../middlewares/validateSchema";
import { CreatedUserValidationSchema } from "../models/UserModel";

const UserRouter = Router();

UserRouter.post(
  "/",
  validateSchema(CreatedUserValidationSchema),
  handleErrorRequest(UserController.createUser)
);

export default UserRouter;
