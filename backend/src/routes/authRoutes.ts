import express from "express";
import { signUp, signin, verify } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signin);
router.get("/verify", verify);

export default router;
