import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User, { IUser } from "../models/user.model";

dotenv.config();

interface UserSession {
    userID: mongoose.Types.ObjectId;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt?: Date;
}

declare module "express-session" {
    interface SessionData {
        user?: UserSession;
    }
}

export {};


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fname, lname, email, phone, password, confirmPassword } = req.body;
        if (![fname, lname, email, phone, password, confirmPassword].every((field) => field)) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ message: "Both passwords must match!" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email is already registered" });
            return;
        }

        const newUser: IUser = new User({ 
            fname, 
            lname, 
            email, 
            phone, 
            password: password,
            role: "user" 
        }) as IUser;
        await newUser.save();

        const token = jwt.sign(
            { userID: newUser._id, email: newUser.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        const userSession = {
            userID: newUser._id,
            fname: newUser.fname,
            lname: newUser.lname,
            email: newUser.email,
            phone: newUser.phone,
            role: "user", // default role
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        };

        req.session.user = userSession;

        res.status(201).json({
            message: "Registration successful!.",
            token,
            user: {
                fname: newUser.fname,
                lname: newUser.lname,
                email: newUser.email,
                phone: newUser.phone,
            },
            nextStep: "/next-login-page",
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return; 
        }

        const user: IUser | null = await User.findOne({ email }).select("+password");

        if (!user) {
            res.status(401).json({ message: "Email not registered. Please register first." });
            return; 
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const payload = { userID: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const userSession = {
            userID: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        req.session.user = userSession;

        res.status(200).json({
            message: "success",
            userID: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone: user.phone,
            nextStep: "/next-dashboard",
            token,
        });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ message: "Error logging in user" });
    }
};


export const logout = (req: Request, res: Response) => {
    const userID = req.params.userID;
    try {
        if (!req.session.user || req.session.user.userID.toString() !== userID) {
            res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
            return; 
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: "Error logging out" });
            }
            res.status(200).json({ message: "Logout successful!" });
        });
    } catch (error) {
        console.error("Error during user logout:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};