"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const news_controller_1 = require("../controllers/news.controller");
const router = express_1.default.Router();
router.get('/', news_controller_1.getNews);
router.get('/:id', news_controller_1.getNewsById);
router.get('/tag/:tagId', news_controller_1.getNewsByTag);
router.post("/", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, news_controller_1.createNews);
router.put('/news/:id', auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, news_controller_1.updateNews);
router.delete('/news/:id', auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, news_controller_1.deleteNews);
exports.default = router;
