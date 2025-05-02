import { User } from "../models/userModel.js";
import { Bus } from "../models/busModel.js";

// Add bus to favorites
export const addToFavorites = async (req, res) => {
    try {
        const { busId } = req.body;
        
        // Check if bus exists
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found"
            });
        }

        // Add to favorites if not already added
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { favoriteBuses: busId } },
            { new: true }
        ).populate('favoriteBuses');

        res.status(200).json({
            success: true,
            favorites: user.favoriteBuses,
            message: "Bus added to favorites"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Remove bus from favorites
export const removeFromFavorites = async (req, res) => {
    try {
        const { busId } = req.params;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favoriteBuses: busId } },
            { new: true }
        ).populate('favoriteBuses');

        res.status(200).json({
            success: true,
            favorites: user.favoriteBuses,
            message: "Bus removed from favorites"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get favorite buses
export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favoriteBuses');

        res.status(200).json({
            success: true,
            favorites: user.favoriteBuses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        // Verify admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can view all users"
            });
        }

        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        // Verify admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete users"
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
