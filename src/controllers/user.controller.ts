import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";


// Helper function: get users based on role
const getUsersByRole = async (role?: string) => {
    const filter = role ? { role, isActive: true } : { isActive: true };
    return User.find(filter).select("-password");
};


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsersByRole();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};


export const getAllAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const administrators = await getUsersByRole("admin");
        res.status(200).json(administrators);
    } catch (error: any) {
        res.status(500).json({ message: "Error retrieving administrators", error: error.message });
    }
};


export const getAllSuperAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const superAdmins = await getUsersByRole("superAdmin");
        res.status(200).json(superAdmins);
    } catch (error: any) {
        res.status(500).json({ message: "Error retrieving super administrators", error: error.message });
    }
};


export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.params.userID;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findOne({ _id: userID, isActive: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found!" });

        return res.json({ data: user }); 
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" }); 
    }
};


export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userID);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found or inactive" });
        }

        const updatedUserData: Partial<IUser> = req.body;
        delete updatedUserData.role;
        if (updatedUserData.password) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(userID, updatedUserData, { new: true });
        return res.status(200).json({ data: updatedUser, message: "User profile updated successfully" }); 
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" }); 
    }
};



export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const { userID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        const user = await User.findById(userID);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found or already deactivated." });
        }

        user.isActive = false;
        await user.save();

        return res.status(200).json({ message: "User deactivated successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" }); 
    }
};
