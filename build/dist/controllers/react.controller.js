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
exports.getReactionsForNews = exports.toggleReaction = void 0;
const react_model_1 = __importDefault(require("../models/react.model"));
const news_model_1 = __importDefault(require("../models/news.model"));
// Add or Toggle Reaction (Like/Dislike)
const toggleReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsId } = req.params;
        const { userId, reaction } = req.body;
        if (!["like", "dislike"].includes(reaction)) {
            res.status(400).json({ success: false, message: "Invalid reaction type" });
            return;
        }
        const existingReaction = yield react_model_1.default.findOne({ newsId, userId });
        if (existingReaction) {
            if (existingReaction.reaction === reaction) {
                yield react_model_1.default.findByIdAndDelete(existingReaction._id);
                // Update news counts
                const updateField = reaction === "like" ? { $inc: { likes: -1 } } : { $inc: { dislikes: -1 } };
                yield news_model_1.default.findByIdAndUpdate(newsId, updateField);
                res.status(200).json({ success: true, message: `Removed ${reaction}` });
            }
            else {
                existingReaction.reaction = reaction;
                yield existingReaction.save();
                // Update news counts
                const updateFields = reaction === "like"
                    ? { $inc: { likes: 1, dislikes: -1 } }
                    : { $inc: { likes: -1, dislikes: 1 } };
                yield news_model_1.default.findByIdAndUpdate(newsId, updateFields);
                res.status(200).json({ success: true, message: `Changed reaction to ${reaction}` });
            }
        }
        else {
            // Create new reaction
            const newReaction = new react_model_1.default({ newsId, userId, reaction });
            yield newReaction.save();
            // Update news counts
            const updateField = reaction === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
            yield news_model_1.default.findByIdAndUpdate(newsId, updateField);
            res.status(201).json({ success: true, message: `Added ${reaction}` });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.toggleReaction = toggleReaction;
// Get All Reactions 
const getReactionsForNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsId } = req.params;
        const reactions = yield react_model_1.default.find({ newsId }).populate("userId", "name email");
        res.status(200).json({ success: true, data: reactions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getReactionsForNews = getReactionsForNews;
