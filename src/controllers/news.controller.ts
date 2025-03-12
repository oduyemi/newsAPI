import { Request, Response } from "express";
import News from "../models/news.model";
import Category from "../models/category.model"; 
import User from "../models/user.model"; 

// Get All News
export const getNews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 3; // Load 3 news per request for infinite scrolling
    const skip = (page - 1) * limit;

    const news = await News.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name description") 
      .populate("authorId", "name email"); 

    const total = await News.countDocuments();

    return res.status(200).json({ success: true, data: news, total });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get News by ID
export const getNewsById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
  
      const news = await News.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      )
        .populate('categoryId', 'name description')
        .populate('authorId', 'name email');
  
      if (!news) {
        return res.status(404).json({ success: false, message: 'News not found' });
      }
  
      return res.status(200).json({ success: true, data: news });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error });
    }
  };

// Get News by Category
export const getNewsByCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params; // Use categoryId to refer directly to the parameter
      const news = await News.find({ categoryId })
        .populate("categoryId", "name description")
        .populate("authorId", "name email");
        
      if (!news || news.length === 0) {
        return res.status(404).json({ success: false, message: "No news found for this category" });
      }

      // Increment views for each news item in the found category
      await News.updateMany({ categoryId }, { $inc: { views: 1 } });
      return res.status(200).json({ success: true, data: news });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Create News: Only administrators
export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, text, images, tags, categoryId, authorId, status, content, summary, source, url, socialMedia, relatedNews } = req.body;
    const category = await Category.findById(categoryId);
    const author = await User.findById(authorId);
    
    if (!category) return res.status(400).json({ success: false, message: "Category not found" });
    if (!author) return res.status(400).json({ success: false, message: "Author not found" });

    const news = await News.create({
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
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update News: Only administrators
export const updateNews = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, text, images, tags, categoryId, authorId, status, content, summary, source, url, socialMedia, relatedNews } = req.body;
  
      // Validate category and author
      const category = await Category.findById(categoryId);
      const author = await User.findById(authorId);
      
      if (!category) return res.status(400).json({ success: false, message: "Category not found" });
      if (!author) return res.status(400).json({ success: false, message: "Author not found" });
  
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { title, text, images, tags, categoryId, authorId, status, content, summary, source, url, socialMedia, relatedNews },
        { new: true }
      ).populate("categoryId", "name description")
       .populate("authorId", "name email");
  
      if (!updatedNews) return res.status(404).json({ success: false, message: "News not found" });
  
      return res.status(200).json({ success: true, data: updatedNews });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Delete News: Administrators only)
export const deleteNews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedNews = await News.findByIdAndDelete(id);
        
        if (!deletedNews) return res.status(404).json({ success: false, message: "News not found" });
    
        return res.status(200).json({ success: true, message: "News deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
};
