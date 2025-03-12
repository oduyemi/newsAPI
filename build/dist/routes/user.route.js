"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_middleware_2 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/", user_controller_1.getAllUsers);
router.get("/admin", user_controller_1.getAllAdmin);
router.get("/user/:id", user_controller_1.getUserById);
router.get("/admin/:id", user_controller_1.getAdminById);
router.put("/:id", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, user_controller_1.updateUser);
router.put("/:id/role/admin", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, user_controller_1.promoteToAdmin);
router.put("/:id/role/user", auth_middleware_1.authenticateUser, auth_middleware_2.checkSuperAdmin, user_controller_1.demoteToUser);
router.delete("/:id", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, user_controller_1.deleteUser);
exports.default = router;
