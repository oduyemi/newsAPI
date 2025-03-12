import { Request, Response } from "express";
import NewsReaction from "../models/react.model";
import News from "../models/news.model"; 



// Get All Likes 
export const getLikes = async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
    const likes = await NewsReaction.find({ newsId, reactionType: 'like' }).populate("userId", "name email");

    if (!likes) {
      return res.status(404).json({ success: false, message: "No likes found" });
    }

    return res.status(200).json({ success: true, data: likes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get All Dislikes
export const getDislikes = async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
    const dislikes = await NewsReaction.find({ newsId, reactionType: 'dislike' }).populate("userId", "name email");

    if (!dislikes) {
      return res.status(404).json({ success: false, message: "No dislikes found" });
    }

    return res.status(200).json({ success: true, data: dislikes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Create Reaction (Like or Dislike)
export const createReaction = async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
    const { userId, reactionType } = req.body; 
    if (!['like', 'dislike'].includes(reactionType)) {
      return res.status(400).json({ success: false, message: "Invalid reaction type" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ success: false, message: "News article not found" });
    }

    const existingReaction = await NewsReaction.findOne({ userId, newsId });
    if (existingReaction) {
      return res.status(400).json({ success: false, message: "User has already reacted to this news" });
    }

    const reaction = await NewsReaction.create({
      userId,
      newsId,
      reactionType,
    });

    return res.status(201).json({ success: true, data: reaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete Reaction (Like or Dislike)
export const deleteReaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedReaction = await NewsReaction.findByIdAndDelete(id);
    if (!deletedReaction) {
      return res.status(404).json({ success: false, message: "Reaction not found" });
    }

    return res.status(200).json({ success: true, message: "Reaction deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
