import mongoose, { Schema, Document } from "mongoose";


export interface IComment extends Document {
    newsId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }
  
  const CommentSchema = new Schema<IComment>(
    {
      newsId: { type: Schema.Types.ObjectId, ref: "News", required: true },
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  export default mongoose.model<IComment>("Comment", CommentSchema);
  