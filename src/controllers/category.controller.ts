import { Request, Response } from "express";
import Category from "../models/category.model";


// Get All Categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      res.status(404).json({ success: false, message: "No categories found" });
      return;
    }

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get Category by ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id).select("-password");

        if (!category) {
            res.status(404).json({ message: "Categories not found" });
            return;
        }

        res.status(200).json(category);
    } catch (error: any) {
        console.error("Error retrieving category:", error);
        res.status(500).json({ message: "Error retrieving category", error: error.message });
    }
};


// Create a New Category (Admin only)
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Category name is required" });
      return;
    }

    const category = await Category.create({ name, description });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update Category (Admin only)
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Category name is required" });
      return;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });

    if (!updatedCategory) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete Category (Admin only)
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
