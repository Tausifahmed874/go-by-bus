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

// Request manager role
export const requestManagerRole = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.managerRequestStatus === "pending") {
            return res.status(400).json({
                success: false,
                message: "Manager role request already pending."
            });
        }
        if (user.managerRequestStatus === "approved" || user.role === "manager") {
            return res.status(400).json({
                success: false,
                message: "You are already a manager."
            });
        }
        user.managerRequestStatus = "pending";
        await user.save();
        res.status(200).json({
            success: true,
            message: "Manager role request submitted and pending admin approval."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: View pending manager requests
export const getPendingManagerRequests = async (req, res) => {
    try {
        const pendingUsers = await User.find({ managerRequestStatus: "pending" });
        res.status(200).json({
            success: true,
            users: pendingUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Approve/deny manager request
export const approveManagerRequest = async (req, res) => {
    try {
        const { userId, approve } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.managerRequestStatus !== "pending") {
            return res.status(400).json({
                success: false,
                message: "No pending manager request for this user."
            });
        }
        if (approve) {
            user.role = "manager";
            user.managerRequestStatus = "approved";
        } else {
            user.managerRequestStatus = "denied";
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: approve ? "Manager role approved." : "Manager role denied."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get own profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -token');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
