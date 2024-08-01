import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  fetchAllUser,
  login,
  logut,
  refreshAccessToken,
  register,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// Authentication and Authoriazation
router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, logut);
router.route("/refresh-token").post(refreshAccessToken);

// User manangement routes
router.route("/fetch-users").get(verifyJwt, fetchAllUser);

export default router;
