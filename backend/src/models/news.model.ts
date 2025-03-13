import mongoose, { Schema, Document } from "mongoose";

// News Interface
export interface INews extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  text: string;
  image: string[];
  views: number;
  likes: number;
  dislikes: number;
  authorId: mongoose.Types.ObjectId;
  tagId: mongoose.Types.ObjectId;
  publicationDate: Date;
  lastUpdated: Date;
  status: "draft" | "published";
  content?: string;
  summary?: string;
  author?: string;
  source?: string;
  url?: string;
  socialMedia?: string;
  relatedNews: mongoose.Types.ObjectId[];
  reactions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// News Schema
const NewsSchema = new Schema<INews>(
  {
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    text: { 
        type: String, 
        required: true, 
        default: "Content not available." 
    },
    image: { 
        type: [String], 
        default: [] 
    },
    views: { 
        type: Number, 
        default: 0 
    },
    likes: { 
        type: Number, 
        default: 0 
    },
    dislikes: { 
        type: Number, 
        default: 0 
    },

    // Relations
    authorId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
    },
    tagId: { 
        type: Schema.Types.ObjectId, 
        ref: "Tag", 
        required: true,
    },

    // Metadata
    publicationDate: { 
        type: Date, 
        default: Date.now 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ["draft", "published"], 
        default: "published" 
    },

    // Optional Fields
    content: { type: String },
    summary: { type: String },
    author: { type: String },
    source: { type: String },
    url: { type: String },
    socialMedia: { type: String },

    // References
    relatedNews: [{ type: Schema.Types.ObjectId, ref: "News" }],
    reactions: [{ type: Schema.Types.ObjectId, ref: "NewsReaction" }],
  },
  { timestamps: true }
);


const newsData = [
  {
    title: "AI Revolution in Tech",
    image: ["https://newslist-bice.vercel.app/assets/ai.jpg"],
    excerpt: "Major tech firms unveil a new AI model...",
    views: 1200,
    text: "In recent developments, major tech firms have introduced a revolutionary AI model that could change the landscape of technology as we know it.",
    authorId: "67d1f6787ea9f5e21a862bf5", 
    tagId: "67d31859d1af548fbd7599c9",
    status: "published",
    relatedNews: [], 
    reactions: [] 
  },
  {
    title: "Travel Industry Boom in 2025",
    image: ["https://newslist-bice.vercel.app/assets/travel.jpg"],
    excerpt: "More people are exploring the world post-pandemic...",
    views: 850,
    text: "Post-pandemic, the travel industry has seen a significant surge in demand, with people eager to explore the world once more.",
    authorId: "67d1f6787ea9f5e21a862bf5",
    tagId: "67d318a1d1af548fbd7599ca",
    status: "published",
    relatedNews: [],
    reactions: []
  },
  {
    title: "Food Science Breakthroughs",
    image: ["https://newslist-bice.vercel.app/assets/food.jpg"],
    excerpt: "Scientists introduce a sustainable food tech...",
    views: 530,
    text: "New developments in food science have led to sustainable food technology, promising a greener future for global food production.",
    authorId: "67d1f6787ea9f5e21a862bf5",
    tagId: "67d318b2d1af548fbd7599cb",
    status: "published",
    relatedNews: [],
    reactions: []
  },
  {
    title: "SpaceX to Launch Lunar Mission",
    image: ["https://newslist-bice.vercel.app/assets/lunar.jpg"],
    excerpt: "Elon Musk announces plans for another moon landing...",
    views: 2200,
    text: "SpaceX has unveiled plans for a new lunar mission, aiming to make history with another moon landing in the near future.",
    authorId: "67d1f6787ea9f5e21a862bf5", 
    tagId: "67d31859d1af548fbd7599c9", 
    status: "published",
    relatedNews: [],
    reactions: []
  },
  {
    title: "Top 10 Travel Destinations for 2025",
    image: ["https://newslist-bice.vercel.app/assets/destination.jpg"],
    excerpt: "Must-visit places for travel lovers...",
    views: 950,
    text: "Planning your next vacation? Here are the top 10 travel destinations to visit in 2025.",
    authorId: "67d1f6787ea9f5e21a862bf5", 
    tagId: "67d318a1d1af548fbd7599ca",
    status: "published",
    relatedNews: [],
    reactions: []
  }
];

// Insert the data into the News collection
newsData.forEach(async (newsItem) => {
  try {
    const newNews = await mongoose.model<INews>("News", NewsSchema).create(newsItem);
    console.log(`News article titled "${newsItem.title}" created successfully!`);
  } catch (error) {
    console.error("Error creating news article:", error);
  }
});

export default mongoose.model<INews>("News", NewsSchema);
