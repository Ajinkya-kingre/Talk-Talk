import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getMsg, sendMsg } from "../controllers/message.controller.js";

const router = Router();

router.route("/sendMsg").post(verifyJwt, sendMsg);
router.route("/getMsg").post(verifyJwt, getMsg);
export default router;
