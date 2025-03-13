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
exports.deleteComment = exports.updateComment = exports.createComment = exports.getComments = void 0;
const comments_model_1 = __importDefault(require("../models/comments.model"));
const news_model_1 = __importDefault(require("../models/news.model"));
// Get All Comments for an Article
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsId } = req.params;
        const comments = yield comments_model_1.default.find({ newsId }).populate("authorId", "name email");
        if (!comments) {
            return res.status(404).json({ success: false, message: "No comments found" });
        }
        return res.status(200).json({ success: true, data: comments });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getComments = getComments;
// Create Comment
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsId } = req.params;
        const { text, authorId } = req.body;
        const news = yield news_model_1.default.findById(newsId);
        if (!news) {
            return res.status(404).json({ success: false, message: "News article not found" });
        }
        const comment = yield comments_model_1.default.create({
            text,
            authorId,
            newsId,
        });
        return res.status(201).json({ success: true, data: comment });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.createComment = createComment;
// Update Comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const updatedComment = yield comments_model_1.default.findByIdAndUpdate(id, { text }, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        return res.status(200).json({ success: true, data: updatedComment });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.updateComment = updateComment;
// Delete Comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedComment = yield comments_model_1.default.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        return res.status(200).json({ success: true, message: "Comment deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.deleteComment = deleteComment;
