import { Router } from "express";
import { auth } from "../Middlewares/middlewares.js";
import { followUnfollow, getFollowers, getFollowings , numbers , friendList} from "../Controllers/follow.controller.js";

const router = Router();

router.post(`/follow-unfollow/:id` , auth , followUnfollow)
router.get(`/get-followers` , auth , getFollowers)
router.get(`/get-followings` , auth , getFollowings)
router.get(`/check-numbers` , auth , numbers)
router.get(`/get-user` , auth , friendList)

export default router