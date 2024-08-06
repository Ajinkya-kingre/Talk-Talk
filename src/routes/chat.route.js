import { Router } from "express"
import { accessChat } from "../controllers/chat.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router =  Router();


router.route('/access-chat').post(verifyJwt, accessChat);


export default router;