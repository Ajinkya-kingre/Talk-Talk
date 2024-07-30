import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js";
import { login, register } from "../controllers/user.controller.js";



const router = Router();


router.route('/register').post(
    upload.single("avatar"),
    register
)

router.route('/login').post(login);


export default router;







