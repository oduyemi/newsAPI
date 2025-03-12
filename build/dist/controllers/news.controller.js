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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsByTag = exports.getNewsById = exports.getNews = void 0;
const news_model_1 = __importDefault(require("../models/news.model"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Get All News
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3; // Load 3 news per request for infinite scrolling
        const skip = (page - 1) * limit;
        const news = yield news_model_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("tagId", "name description")
            .populate("authorId", "name email");
        const total = yield news_model_1.default.countDocuments();
        res.status(200).json({ success: true, data: news, total });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getNews = getNews;
// Get News by ID
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const news = yield news_model_1.default.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
            .populate("tagId", "name description")
            .populate("authorId", "name email");
        if (!news) {
            res.status(404).json({ success: false, message: "News not found" });
            return;
        }
        res.status(200).json({ success: true, data: news });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getNewsById = getNewsById;
// Get News by Tag
const getNewsByTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tagId } = req.params;
        const news = yield news_model_1.default.find({ tagId })
            .populate("tagId", "name description")
            .populate("authorId", "name email");
        if (!news || news.length === 0) {
            res.status(404).json({ success: false, message: "No news found for this tag" });
            return;
        }
        // Increment views for each news item in the found tag
        yield news_model_1.default.updateMany({ tagId }, { $inc: { views: 1 } });
        res.status(200).json({ success: true, data: news });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getNewsByTag = getNewsByTag;
// Create News: Only administrators
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, text, images, tags, tagId, authorId, status, content, summary, source, url, socialMedia, relatedNews } = req.body;
        const tag = yield tag_model_1.default.findById(tagId);
        if (!tag) {
            res.status(400).json({ success: false, message: "Tag not found" });
            return;
        }
        const author = yield user_model_1.default.findById(authorId);
        if (!author) {
            res.status(400).json({ success: false, message: "Author not found" });
            return;
        }
        const news = yield news_model_1.default.create({
            title,
            text,
            images,
            tags,
            tagId,
            authorId,
            status,
            content,
            summary,
            source,
            url,
            socialMedia,
            relatedNews,
        });
        res.status(201).json({ success: true, data: news });
    }
    catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.createNews = createNews;
// Update News: Only administrators
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, text, images, tags, tagId, authorId, status, content, summary, source, url, socialMedia, relatedNews } = req.body;
        // Validate tag and author
        const tag = yield tag_model_1.default.findById(tagId);
        const author = yield user_model_1.default.findById(authorId);
        if (!tag) {
            res.status(400).json({ success: false, message: "Tag not found" });
            return;
        }
        if (!author) {
            res.status(400).json({ success: false, message: "Author not found" });
            return;
        }
        const updatedNews = yield news_model_1.default.findByIdAndUpdate(id, { title, text, images, tags, tagId, authorId, status, content, summary, source, url, socialMedia, relatedNews }, { new: true }).populate("tagId", "name description")
            .populate("authorId", "name email");
        if (!updatedNews) {
            res.status(404).json({ success: false, message: "News not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedNews });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.updateNews = updateNews;
// Delete News: Administrators only)
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedNews = yield news_model_1.default.findByIdAndDelete(id);
        if (!deletedNews) {
            res.status(404).json({ success: false, message: "News not found" });
            return;
        }
        res.status(200).json({ success: true, message: "News deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.deleteNews = deleteNews;
