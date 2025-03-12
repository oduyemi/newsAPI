import express from "express";
import { authenticateUser, checkAdmin } from "../middlewares/auth.middleware";
import { getNews, getNewsById, createNews, updateNews, deleteNews, getNewsByTag } from "../controllers/news.controller";

const router = express.Router();

router.get('/', getNews);
router.get('/:id', getNewsById);
router.get('/tag/:tagId', getNewsByTag);
router.post("/", authenticateUser, checkAdmin, createNews);
router.put('/news/:id', authenticateUser, checkAdmin, updateNews);
router.delete('/news/:id', authenticateUser, checkAdmin, deleteNews);

export default router;
