import { Response, Request, NextFunction, Router } from "express";
import UserController from "../../controllers/User.controller";
import multer from "multer";
import validateSchema from "../../middlewares/validateSchema";
import {
  ParamsGetAllUserSchema,
  PatchUserValidationSchema,
} from "../../models/UserModel";
import passport from "passport";
import IdValidationSchema from "../../lib/IdValidationSchema";
import handleErrorRequest from "../../middlewares/handleErrorRequest";

const UserRouter = Router();

const storage = multer.diskStorage({});

const upload = multer({
  storage,
  limits: {
    // fileSize: 1024 * 1024 * 2,
    // files: 1,
  },

  //   fileFilter: (req, file, cb) => {
  //     if (file.mimetype === "image/jpeg") {
  //       cb(null, true);
  //     } else {
  //       cb(new HandlerRequestError("El tipo de archivo no es válido"));
  //     }
  //   },
});

UserRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateSchema(IdValidationSchema, "params", "params"),
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.file) req.body = { ...req.body, image: req.file };
    console.log(req.file);
    next();
  },
  validateSchema(PatchUserValidationSchema, "body"),
  handleErrorRequest(UserController.patchUser)
);

UserRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateSchema(ParamsGetAllUserSchema, "query", "query"),
  handleErrorRequest(UserController.getUsers)
);

export default UserRouter;
