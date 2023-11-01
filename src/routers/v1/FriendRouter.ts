import FriendController from "../../controllers/FriendController";
import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema";
import {
  FriendSchemaUpdateValidation,
  NewFriendSchemaValidation,
} from "../../models/Friend/FriendModel.validation";
import handleErrorRequest from "../../middlewares/handleErrorRequest";
import IdValidationSchema from "../../lib/IdValidationSchema";
import passport from "passport";

const FriendRouter = Router();

FriendRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateSchema(NewFriendSchemaValidation, "body", "body"),
  handleErrorRequest(FriendController.createFriend)
);

FriendRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateSchema(IdValidationSchema, "params", "params"),
  validateSchema(FriendSchemaUpdateValidation, "body", "body"),
  handleErrorRequest(FriendController.updateFriend)
);

export default FriendRouter;
