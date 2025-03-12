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
exports.deleteReaction = exports.createReaction = exports.getDislikes = exports.getLikes = void 0;
const react_model_1 = __importDefault(require("../models/react.model"));
const news_model_1 = __importDefault(require("../models/news.model"));
// Get All Likes 
const getLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsId } = req.params;
        const likes = yield react_model_1.default.find({ newsId, reactionType: 'like' }).populate("userId", "name email");
        if (!likes) {
            return res.status(404).json({ success: false, message: "No likes found" });
        }
        return res.status(200).json({ success: true, data: likes });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getLikes = getLikes;
// Get All Dislikes
const getDislikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsId } = req.params;
        const dislikes = yield react_model_1.default.find({ newsId, reactionType: 'dislike' }).populate("userId", "name email");
        if (!dislikes) {
            return res.status(404).json({ success: false, message: "No dislikes found" });
        }
        return res.status(200).json({ success: true, data: dislikes });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getDislikes = getDislikes;
// Create Reaction (Like or Dislike)
const createReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsId } = req.params;
        const { userId, reactionType } = req.body;
        if (!['like', 'dislike'].includes(reactionType)) {
            return res.status(400).json({ success: false, message: "Invalid reaction type" });
        }
        const news = yield news_model_1.default.findById(newsId);
        if (!news) {
            return res.status(404).json({ success: false, message: "News article not found" });
        }
        const existingReaction = yield react_model_1.default.findOne({ userId, newsId });
        if (existingReaction) {
            return res.status(400).json({ success: false, message: "User has already reacted to this news" });
        }
        const reaction = yield react_model_1.default.create({
            userId,
            newsId,
            reactionType,
        });
        return res.status(201).json({ success: true, data: reaction });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.createReaction = createReaction;
// Delete Reaction (Like or Dislike)
const deleteReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedReaction = yield react_model_1.default.findByIdAndDelete(id);
        if (!deletedReaction) {
            return res.status(404).json({ success: false, message: "Reaction not found" });
        }
        return res.status(200).json({ success: true, message: "Reaction deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.deleteReaction = deleteReaction;
