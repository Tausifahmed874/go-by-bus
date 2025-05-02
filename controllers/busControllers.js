import { Bus } from "../models/busModel.js";
import { BusSchedule } from "../models/busScheduleModel.js";
import { User } from "../models/userModel.js";

// Create a new bus (Driver only)
export const createBus = async (req, res) => {
    try {
        const { name, registrationNumber, busNumber, busType, seatCapacity, isAC, isExpress } = req.body;
        
        console.log(req.body, req.user);
        // Check if user is a driver
        if (req.user.role !== "driver") {
            return res.status(403).json({
                success: false,
                message: "Only drivers can create buses"
            });
        }

        const bus = await Bus.create({
            name,
            registrationNumber,
            busNumber,
            busType,
            seatCapacity,
            isAC,
            isExpress,
            owner: req.user._id
        });

        res.status(201).json({
            success: true,
            bus,
            message: "Bus created successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all buses for a driver
export const getMyBuses = async (req, res) => {
    try {
        const buses = await Bus.find({ owner: req.user._id });
        res.status(200).json({
            success: true,
            buses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update bus details
export const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findOne({ _id: req.params.id, owner: req.user._id });
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found or you don't have permission"
            });
        }

        Object.assign(bus, req.body);
        await bus.save();

        res.status(200).json({
            success: true,
            bus,
            message: "Bus updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a bus
export const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findOne({ _id: req.params.id, owner: req.user._id });
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found or you don't have permission"
            });
        }

        await bus.deleteOne();
        
        // Delete associated schedules
        await BusSchedule.deleteMany({ bus: req.params.id });

        res.status(200).json({
            success: true,
            message: "Bus and its schedules deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get bus by ID (Authenticated users)
export const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found"
            });
        }
        res.status(200).json({
            success: true,
            bus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};