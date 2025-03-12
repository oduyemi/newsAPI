import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { authenticateUser, checkAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticateUser, checkAdmin, createCategory);
router.put("/:id", authenticateUser, checkAdmin, updateCategory);
router.delete("/:id", authenticateUser, checkAdmin, deleteCategory);

export default router;
