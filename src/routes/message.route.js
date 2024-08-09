import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { sendMsg } from "../controllers/message.controller.js";

const router = Router();

router.route("/sendMsg").post(verifyJwt, sendMsg);

export default router;
