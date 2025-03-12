import { Request, Response } from "express";
import News from "../models/news.model";
import Tag from "../models/tag.model"; 
import User from "../models/user.model"; 

// Get All News
export const getNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 3; // Load 3 news per request for infinite scrolling
    const skip = (page - 1) * limit;

    const news = await News.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("tagId", "name description") 
      .populate("authorId", "name email"); 

    const total = await News.countDocuments();

    res.status(200).json({ success: true, data: news, total });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// Get News by ID
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("tagId", "name description")
      .populate("authorId", "name email");

    if (!news) {
      res.status(404).json({ success: false, message: "News not found" });

      return;
    }

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get News by Tag
export const getNewsByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;
    const news = await News.find({ tagId })
      .populate("tagId", "name description")
      .populate("authorId", "name email");
    if (!news || news.length === 0) {
      res.status(404).json({ success: false, message: "No news found for this tag" });
      return;
    }

    // Increment views for each news item in the found tag
    await News.updateMany({ tagId }, { $inc: { views: 1 } });

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// Create News: Only administrators
export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, text, images, tags, tagId, authorId, status, content, summary, source, url, socialMedia, relatedNews } = req.body;
    
    const tag = await Tag.findById(tagId);
    if (!tag) {
      res.status(400).json({ success: false, message: "Tag not found" });
      return;
    }

    const author = await User.findById(authorId);
    if (!author) {
      res.status(400).json({ success: false, message: "Author not found" });
      return;
    }

    const news = await News.create({
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
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// Update News: Only administrators
export const updateNews = async (req: Request, res: Response): Promise<void> => {
  try {
      const { id } = req.params;
      const { title, text, images, tags, tagId, authorId, status, content, summary, source, url, socialMedia, relatedNews } = req.body;

      // Validate tag and author
      const tag = await Tag.findById(tagId);
      const author = await User.findById(authorId);
      
      if (!tag) {
          res.status(400).json({ success: false, message: "Tag not found" });
          return;
      }
      if (!author) {
          res.status(400).json({ success: false, message: "Author not found" });
          return;
      }

      const updatedNews = await News.findByIdAndUpdate(
          id,
          { title, text, images, tags, tagId, authorId, status, content, summary, source, url, socialMedia, relatedNews },
          { new: true }
      ).populate("tagId", "name description")
       .populate("authorId", "name email");

      if (!updatedNews) {
          res.status(404).json({ success: false, message: "News not found" });
          return;
      }

      res.status(200).json({ success: true, data: updatedNews });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
  }
};


// Delete News: Administrators only)
export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
      const { id } = req.params;
      const deletedNews = await News.findByIdAndDelete(id);
      
      if (!deletedNews) {
          res.status(404).json({ success: false, message: "News not found" });
          return;
      }

      res.status(200).json({ success: true, message: "News deleted successfully" });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
  }
};
