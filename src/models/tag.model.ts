import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true 
        },
        description: { 
            type: String 
        },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<ITag>("Tag", TagSchema);
