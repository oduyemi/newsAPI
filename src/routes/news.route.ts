import express from "express";
import { authenticateUser, checkAdmin } from "../middlewares/auth.middleware";
import { getNews, getNewsById, createNews, updateNews, deleteNews, getNewsByCategory } from "../controllers/news.controller";

const router = express.Router();

router.get('/', getNews);
router.get('/:id', getNewsById);
router.get('/category/:categoryId', getNewsByCategory);
router.post("/", authenticateUser, checkAdmin, createNews);
router.put('/news/:id', authenticateUser, checkAdmin, updateNews);
router.delete('/news/:id', authenticateUser, checkAdmin, deleteNews);

export default router;
