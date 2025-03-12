import { Request, Response } from "express";
import NewsReaction from "../models/react.model";
import News from "../models/news.model";



// Add or Toggle Reaction (Like/Dislike)
export const toggleReaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { newsId } = req.params;
    const { userId, reaction } = req.body;

    if (!["like", "dislike"].includes(reaction)) {
      res.status(400).json({ success: false, message: "Invalid reaction type" });
      return;
    }

    const existingReaction = await NewsReaction.findOne({ newsId, userId });

    if (existingReaction) {
      if (existingReaction.reaction === reaction) {
        await NewsReaction.findByIdAndDelete(existingReaction._id);

        // Update news counts
        const updateField = reaction === "like" ? { $inc: { likes: -1 } } : { $inc: { dislikes: -1 } };
        await News.findByIdAndUpdate(newsId, updateField);

        res.status(200).json({ success: true, message: `Removed ${reaction}` });
      } else {
        existingReaction.reaction = reaction;
        await existingReaction.save();

        // Update news counts
        const updateFields = reaction === "like"
          ? { $inc: { likes: 1, dislikes: -1 } }
          : { $inc: { likes: -1, dislikes: 1 } };
        await News.findByIdAndUpdate(newsId, updateFields);

        res.status(200).json({ success: true, message: `Changed reaction to ${reaction}` });
      }
    } else {
      // Create new reaction
      const newReaction = new NewsReaction({ newsId, userId, reaction });
      await newReaction.save();

      // Update news counts
      const updateField = reaction === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
      await News.findByIdAndUpdate(newsId, updateField);

      res.status(201).json({ success: true, message: `Added ${reaction}` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// Get All Reactions 
export const getReactionsForNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { newsId } = req.params;
    const reactions = await NewsReaction.find({ newsId }).populate("userId", "name email");

    res.status(200).json({ success: true, data: reactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
