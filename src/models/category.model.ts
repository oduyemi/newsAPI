import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
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

export default mongoose.model<ICategory>("Category", CategorySchema);
