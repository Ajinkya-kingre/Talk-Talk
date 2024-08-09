import { Router } from "express";
import {
  accessChat,
  addToGroup,
  createGroup,
  fetchAllChats,
  removeFronGroup,
  renameChat,
} from "../controllers/chat.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/access-chat").post(verifyJwt, accessChat);
router.route("/renameChat").post(verifyJwt, renameChat);
router.route("/fetch-chat").get(verifyJwt, fetchAllChats);
router.route("/create-group").post(verifyJwt, createGroup);
router.route("/add-member").post(verifyJwt, addToGroup);
router.route("/remove-member").post(verifyJwt, removeFronGroup);

export default router;
