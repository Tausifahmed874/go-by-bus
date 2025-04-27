import { Stand } from "../models/standModel.js";

// Get all stands
export const getAllStands = async (req, res) => {
    try {
        const stands = await Stand.find();
        res.status(200).json({
            success: true,
            stands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get stand by ID
export const getStandById = async (req, res) => {
    try {
        const stand = await Stand.findById(req.params.id);
        if (!stand) {
            return res.status(404).json({
                success: false,
                message: "Stand not found"
            });
        }
        res.status(200).json({
            success: true,
            stand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update stand (Admin only)
export const updateStand = async (req, res) => {
    try {
        // Verify admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can update stands"
            });
        }

        const { name, distance, price } = req.body;
        const stand = await Stand.findByIdAndUpdate(
            req.params.id,
            { name, distance, price },
            { new: true }
        );

        if (!stand) {
            return res.status(404).json({
                success: false,
                message: "Stand not found"
            });
        }

        res.status(200).json({
            success: true,
            stand,
            message: "Stand updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete stand (Admin only)
export const deleteStand = async (req, res) => {
    try {
        // Verify admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete stands"
            });
        }

        const stand = await Stand.findByIdAndDelete(req.params.id);
        if (!stand) {
            return res.status(404).json({
                success: false,
                message: "Stand not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Stand deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 