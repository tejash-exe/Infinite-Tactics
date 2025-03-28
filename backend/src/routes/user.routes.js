import { Router } from "express";
import verifyJWTUser from "../middleware/authUser.middleware.js";
import { 
    fetchLeaderboard,
    googleLogin,
    logout,
    refreshScore, 
} from "../controller/user.controller.js";

const router = Router();

router.route("/login").post(googleLogin);
router.route("/logout").post(verifyJWTUser, logout);
router.route("/refresh-score").post(verifyJWTUser, refreshScore);

router.route("/leaderboard").post(fetchLeaderboard);

export default router;