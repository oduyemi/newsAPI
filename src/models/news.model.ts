import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  text: string;
  images: string[];
  tags: string[];
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

const NewsSchema = new Schema<INews>(
  {
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    images: { 
        type: [String], 
        default: [] 
    },
    tags: { 
        type: [String], 
        required: true 
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
        ref: "User", required: true 
    },
    tagId: { 
        type: Schema.Types.ObjectId, 
        ref: "Tag", 
        required: true 
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
        default: "draft" 
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

NewsSchema.virtual("populatedReactions", {
  ref: "NewsReaction",
  localField: "_id",
  foreignField: "newsId",
});

export default mongoose.model<INews>("News", NewsSchema);
