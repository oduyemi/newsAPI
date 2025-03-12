import { Request, Response } from "express";
import Comment from "../models/comments.model";
import News from "../models/news.model"; 



// Get All Comments for an Article
export const getComments = async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
    const comments = await Comment.find({ newsId }).populate("authorId", "name email");

    if (!comments) {
      return res.status(404).json({ success: false, message: "No comments found" });
    }

    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Create Comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
    const { text, authorId } = req.body;
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ success: false, message: "News article not found" });
    }

    const comment = await Comment.create({
      text,
      authorId,
      newsId,
    });

    return res.status(201).json({ success: true, data: comment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update Comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(id, { text }, { new: true });

    if (!updatedComment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    return res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete Comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
