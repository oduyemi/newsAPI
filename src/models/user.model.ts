import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_$!%*?&])[A-Za-z\d@_$!%*?&]{8,}$/;

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "superAdmin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fname: { type: String, required: [true, "First name is required"] },
    lname: { type: String, required: [true, "Last name is required"] },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
      validate: {
        validator: (value: string) => passwordRegex.test(value),
        message: "Password must contain uppercase, lowercase, number, and special character.",
      },
    },
    role: { type: String, enum: ["admin", "superAdmin", "user"], default: "user" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

async function addSuperAdmins() {
  const superAdminUsers = [
    {
      fname: "Yemi",
      lname: "Cole",
      email: "ykay@gmail.com",
      phone: "+2348166442322",
      password: process.env.YEMI,
      role: "superAdmin",
    },
    {
      fname: "Oreoluwa",
      lname: "Smith",
      email: "oreoluwasmith@gmail.com",
      phone: "+2348133992314",
      password: process.env.OREOLUWA,
      role: "superAdmin",
    },
  ];

  for (const user of superAdminUsers) {
    try {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const newUser = new User(user);
        await newUser.save();
        console.log(`SuperAdmin ${user.email} added successfully.`);
      }
    } catch (error) {
      console.error(`Error adding SuperAdmin ${user.email}:`, error);
    }
  }
}

// addSuperAdmins().catch((err) => console.error("SuperAdmin setup failed:", err));

export default User;
