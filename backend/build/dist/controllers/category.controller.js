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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
// Get All Categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find();
        if (!categories || categories.length === 0) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }
        return res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getCategories = getCategories;
// Get Category by ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_model_1.default.findById(id).select("-password");
        if (!category) {
            res.status(404).json({ message: "Categories not found" });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        console.error("Error retrieving category:", error);
        res.status(500).json({ message: "Error retrieving category", error: error.message });
    }
});
exports.getCategoryById = getCategoryById;
// Create a New Category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        // Ensure category name is provided
        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }
        const category = yield category_model_1.default.create({
            name,
            description,
        });
        return res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.createCategory = createCategory;
// Update Category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }
        const updatedCategory = yield category_model_1.default.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, data: updatedCategory });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.updateCategory = updateCategory;
// Delete Category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedCategory = yield category_model_1.default.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.deleteCategory = deleteCategory;
