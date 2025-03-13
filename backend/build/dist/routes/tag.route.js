"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tag_controller_1 = require("../controllers/tag.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/", tag_controller_1.getTags);
router.get("/:id", tag_controller_1.getTagById);
router.post("/", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, tag_controller_1.createTag);
router.put("/:id", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, tag_controller_1.updateTag);
router.delete("/:id", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, tag_controller_1.deleteTag);
exports.default = router;
