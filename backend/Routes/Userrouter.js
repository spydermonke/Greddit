import express from "express" 

import { getUserFollowers , updateUserprofile, getUserFollowing , getAllUsers, Remove , Unfollow , getPotentialFollowings, Follow} from "../Controllers/User.js";
// import { verifyToken } from "../Middleware/Authentication.js";

const router = express.Router();


router.patch("/updateprofile", updateUserprofile )
router.post("/followers", getUserFollowers)
router.post("/followers/remove", Remove)
router.post("/followings", getUserFollowing)
router.post("/followings/unfollow", Unfollow)
router.post("/potential_followings", getPotentialFollowings)
router.post("/potential_followings/follow", Follow)
router.post("/all_users", getAllUsers)

export default router