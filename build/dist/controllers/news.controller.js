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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsByCategory = exports.getNewsById = exports.getNews = void 0;
const news_model_1 = __importDefault(require("../models/news.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
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
            .populate("categoryId", "name description")
            .populate("authorId", "name email");
        const total = yield news_model_1.default.countDocuments();
        return res.status(200).json({ success: true, data: news, total });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getNews = getNews;
// Get News by ID
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const news = yield news_model_1.default.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
            .populate('categoryId', 'name description')
            .populate('authorId', 'name email');
        if (!news) {
            return res.status(404).json({ success: false, message: 'News not found' });
        }
        return res.status(200).json({ success: true, data: news });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.getNewsById = getNewsById;
// Get News by Category
const getNewsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params; // Use categoryId to refer directly to the parameter
        const news = yield news_model_1.default.find({ categoryId })
            .populate("categoryId", "name description")
            .populate("authorId", "name email");
        if (!news || news.length === 0) {
            return res.status(404).json({ success: false, message: "No news found for this category" });
        }
        // Increment views for each news item in the found category
        yield news_model_1.default.updateMany({ categoryId }, { $inc: { views: 1 } });
        return res.status(200).json({ success: true, data: news });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getNewsByCategory = getNewsByCategory;
// Create News: Only administrators
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, text, images, tags, categoryId, authorId, status, content, summary, source, url, socialMedia, relatedNews } = req.body;
        const category = yield category_model_1.default.findById(categoryId);
        const author = yield user_model_1.default.findById(authorId);
        if (!category)
            return res.status(400).json({ success: false, message: "Category not found" });
        if (!author)
            return res.status(400).json({ success: false, message: "Author not found" });
        const news = yield news_model_1.default.create({
            title,
            text,
            images,
            tags,
            categoryId,
            authorId,
            status,
            content,
            summary,
            source,
            url,
            socialMedia,
            relatedNews,
        });
        return res.status(201).json({ success: true, data: news });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.createNews = createNews;
// Update News: Only administrators
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, text, images, tags, categoryId, authorId, status, content, summary, source, url, socialMedia, relatedNews } = req.body;
        // Validate category and author
        const category = yield category_model_1.default.findById(categoryId);
        const author = yield user_model_1.default.findById(authorId);
        if (!category)
            return res.status(400).json({ success: false, message: "Category not found" });
        if (!author)
            return res.status(400).json({ success: false, message: "Author not found" });
        const updatedNews = yield news_model_1.default.findByIdAndUpdate(id, { title, text, images, tags, categoryId, authorId, status, content, summary, source, url, socialMedia, relatedNews }, { new: true }).populate("categoryId", "name description")
            .populate("authorId", "name email");
        if (!updatedNews)
            return res.status(404).json({ success: false, message: "News not found" });
        return res.status(200).json({ success: true, data: updatedNews });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.updateNews = updateNews;
// Delete News: Administrators only)
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedNews = yield news_model_1.default.findByIdAndDelete(id);
        if (!deletedNews)
            return res.status(404).json({ success: false, message: "News not found" });
        return res.status(200).json({ success: true, message: "News deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.deleteNews = deleteNews;
