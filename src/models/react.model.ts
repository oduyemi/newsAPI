import mongoose, { Schema, Document } from "mongoose";

export interface INewsReaction extends Document {
  _id: mongoose.Types.ObjectId;
  newsId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  reaction: "like" | "dislike"; 
}

const NewsReactionSchema = new Schema<INewsReaction>(
  {
    newsId: { type: Schema.Types.ObjectId, ref: "News", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reaction: { type: String, enum: ["like", "dislike"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INewsReaction>("NewsReaction", NewsReactionSchema);
