import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  changeAvatar,
  changePassword,
  fetchAllUser,
  getCurrUser,
  login,
  logut,
  refreshAccessToken,
  register,
  updateAccountDetails,
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
router.route("/change-password").post(verifyJwt, changePassword);
router.route("/get-current-user").get(verifyJwt, getCurrUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);
router.route("/change-avatar").post(verifyJwt, upload.single("avatar"), changeAvatar);

export default router;
