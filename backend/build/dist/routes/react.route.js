"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const react_controller_1 = require("../controllers/react.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/:newsId", auth_middleware_1.authenticateUser, react_controller_1.toggleReaction);
router.get("/:newsId", react_controller_1.getReactionsForNews);
exports.default = router;
