import express from "express";
import { signUp, signin } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signin);

export default router;
