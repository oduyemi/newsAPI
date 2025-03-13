import { Request, Response } from "express";
import Tag from "../models/tag.model";


// Get All Tags
export const getTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Tag.find();
    if (!tags || tags.length === 0) {
      res.status(404).json({ success: false, message: "No tags found" });
      return;
    }

    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get Tag by ID
export const getTagById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tag = await Tag.findById(id).select("-password");

        if (!tag) {
            res.status(404).json({ message: "Tag not found" });
            return;
        }

        res.status(200).json(tag);
    } catch (error: any) {
        console.error("Error retrieving tag:", error);
        res.status(500).json({ message: "Error retrieving tag", error: error.message });
    }
};


// Create a New Tag (Admin only)
export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Tag name is required" });
      return;
    }

    const tag = await Tag.create({ name, description });

    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update Tag (Admin only)
export const updateTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Tag name is required" });
      return;
    }

    const updatedTag = await Tag.findByIdAndUpdate(id, { name, description }, { new: true });

    if (!updatedTag) {
      res.status(404).json({ success: false, message: "Tag not found" });
      return;
    }

    res.status(200).json({ success: true, data: updatedTag });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete Tag (Admin only)
export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) {
      res.status(404).json({ success: false, message: "Tag not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
