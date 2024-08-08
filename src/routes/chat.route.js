import { Router } from "express";
import {
  accessChat,
  createGroup,
  fetchAllChats,
  renameChat,
} from "../controllers/chat.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/access-chat").post(verifyJwt, accessChat);
router.route("/renameChat").post(verifyJwt, renameChat);

//TODO: make a request in POSTMAN for this route
router.route("/fetch-chat").get(verifyJwt, fetchAllChats);
router.route("/create-group").post(verifyJwt, createGroup);

export default router;
