import express from "express";
import { toggleReaction, getReactionsForNews } from "../controllers/react.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/:newsId", authenticateUser, toggleReaction);
router.get("/:newsId", getReactionsForNews);

export default router;
