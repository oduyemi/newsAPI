"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllSuperAdmin = exports.getAllAdmin = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Helper function: get users based on role
const getUsersByRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = role ? { role, isActive: true } : { isActive: true };
    return user_model_1.default.find(filter).select("-password");
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield getUsersByRole();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const getAllAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const administrators = yield getUsersByRole("admin");
        res.status(200).json(administrators);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving administrators", error: error.message });
    }
});
exports.getAllAdmin = getAllAdmin;
const getAllSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const superAdmins = yield getUsersByRole("superAdmin");
        res.status(200).json(superAdmins);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving super administrators", error: error.message });
    }
});
exports.getAllSuperAdmin = getAllSuperAdmin;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.params.userID;
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = yield user_model_1.default.findOne({ _id: userID, isActive: true }).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found!" });
        return res.json({ data: user });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = yield user_model_1.default.findById(userID);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found or inactive" });
        }
        const updatedUserData = req.body;
        delete updatedUserData.role;
        if (updatedUserData.password) {
            updatedUserData.password = yield bcryptjs_1.default.hash(updatedUserData.password, 10);
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userID, updatedUserData, { new: true });
        return res.status(200).json({ data: updatedUser, message: "User profile updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }
        const user = yield user_model_1.default.findById(userID);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found or already deactivated." });
        }
        user.isActive = false;
        yield user.save();
        return res.status(200).json({ message: "User deactivated successfully." });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
