import express from "express";
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller";
import { authenticateUser, checkAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getTags);
router.get("/:id", getTagById);
router.post("/", authenticateUser, checkAdmin, createTag);
router.put("/:id", authenticateUser, checkAdmin, updateTag);
router.delete("/:id", authenticateUser, checkAdmin, deleteTag);

export default router;
