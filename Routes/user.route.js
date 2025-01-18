import {Router} from "express"
import {Register , Login , Logout , Delete, getInfo, getUser} from "../Controllers/user.controller.js"
import {registerMiddleware , loginMiddleware , logoutMiddleware , deleteMiddleware} from "../Middlewares/user.middleware.js"
import { auth } from "../Middlewares/middlewares.js";
const router = Router();
router.post( "/register" , registerMiddleware, Register);
router.post(`/get-info/:id` , getInfo)
router.post( "/login" , loginMiddleware, Login);
router.post("/logout" , logoutMiddleware , Logout)
router.delete("/delete" , deleteMiddleware , Delete)
router.get(`/user_profile/:id` , auth , getUser)
export default router;