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
exports.deleteTag = exports.updateTag = exports.createTag = exports.getTagById = exports.getTags = void 0;
const tag_model_1 = __importDefault(require("../models/tag.model"));
// Get All Tags
const getTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield tag_model_1.default.find();
        if (!tags || tags.length === 0) {
            res.status(404).json({ success: false, message: "No tags found" });
            return;
        }
        res.status(200).json({ success: true, data: tags });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getTags = getTags;
// Get Tag by ID
const getTagById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tag = yield tag_model_1.default.findById(id).select("-password");
        if (!tag) {
            res.status(404).json({ message: "Tag not found" });
            return;
        }
        res.status(200).json(tag);
    }
    catch (error) {
        console.error("Error retrieving tag:", error);
        res.status(500).json({ message: "Error retrieving tag", error: error.message });
    }
});
exports.getTagById = getTagById;
// Create a New Tag (Admin only)
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ success: false, message: "Tag name is required" });
            return;
        }
        const tag = yield tag_model_1.default.create({ name, description });
        res.status(201).json({ success: true, data: tag });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.createTag = createTag;
// Update Tag (Admin only)
const updateTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ success: false, message: "Tag name is required" });
            return;
        }
        const updatedTag = yield tag_model_1.default.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedTag) {
            res.status(404).json({ success: false, message: "Tag not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedTag });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.updateTag = updateTag;
// Delete Tag (Admin only)
const deleteTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTag = yield tag_model_1.default.findByIdAndDelete(id);
        if (!deletedTag) {
            res.status(404).json({ success: false, message: "Tag not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Tag deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.deleteTag = deleteTag;
