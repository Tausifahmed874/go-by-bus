import { BusSchedule } from "../models/busScheduleModel.js";
import { Bus } from "../models/busModel.js";
import { Stand } from "../models/standModel.js";

// Create or update bus schedule
export const createSchedule = async (req, res) => {
    try {
        const { busId, scheduleStops } = req.body;
        
        // Verify user is a driver
        if (req.user.role !== "driver") {
            return res.status(403).json({
                success: false,
                message: "Only drivers can create or update schedules"
            });
        }

        // Verify bus ownership
        const bus = await Bus.findOne({ _id: busId, owner: req.user._id });
        if (!bus) {
            return res.status(403).json({
                success: false,
                message: "Bus not found or you don't have permission"
            });
        }

        // Process and validate stops
        let previousTime = null;
        const processedStops = [];

        for (let stop of scheduleStops) {
            // Find or create stand by name
            let stand = await Stand.findOne({ name: stop.standName });
            
            if (!stand) {
                // If stand doesn't exist, create it with default distance and price
                // These can be updated later by admin
                stand = await Stand.create({
                    name: stop.standName,
                    distance: 0, // Default distance
                    price: 0 // Default price
                });
            }

            // Validate time format (HH:mm)
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(stop.arrivalTime)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid time format for stand ${stop.standName}. Use HH:mm format (e.g., 09:30)`
                });
            }

            // Validate chronological order
            if (previousTime) {
                const [prevHour, prevMin] = previousTime.split(':').map(Number);
                const [currHour, currMin] = stop.arrivalTime.split(':').map(Number);
                const prevMinutes = prevHour * 60 + prevMin;
                const currMinutes = currHour * 60 + currMin;

                if (currMinutes <= prevMinutes) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid schedule: Arrival time at ${stop.standName} must be after previous stop`
                    });
                }
            }
            previousTime = stop.arrivalTime;

            processedStops.push({
                stand: stand._id,
                arrivalTime: stop.arrivalTime
            });
        }

        // Create or update schedule
        const schedule = await BusSchedule.findOneAndUpdate(
            { bus: busId },
            { 
                bus: busId,
                schedule: processedStops
            },
            { new: true, upsert: true }
        ).populate('schedule.stand');

        res.status(200).json({
            success: true,
            schedule,
            message: "Schedule updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get schedule for a specific bus
export const getBusSchedule = async (req, res) => {
    try {
        const schedule = await BusSchedule.findOne({ bus: req.params.busId })
            .populate('bus')
            .populate('schedule.stand');

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });
        }

        res.status(200).json({
            success: true,
            schedule
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Search buses by source and destination
export const searchBuses = async (req, res) => {
    try {
        const { source, destination, date } = req.query;

        // Find schedules that include both source and destination stands
        const schedules = await BusSchedule.find({
            'schedule.stand': { 
                $all: [source, destination] 
            }
        })
        .populate('bus')
        .populate('schedule.stand');

        // Filter and sort schedules
        const validSchedules = schedules.map(schedule => {
            const sourceIndex = schedule.schedule.findIndex(s => s.stand._id.toString() === source);
            const destIndex = schedule.schedule.findIndex(s => s.stand._id.toString() === destination);
            
            if (sourceIndex < destIndex) {
                return {
                    ...schedule.toObject(),
                    sourceTime: schedule.schedule[sourceIndex].arrivalTime,
                    destinationTime: schedule.schedule[destIndex].arrivalTime,
                    duration: calculateDuration(
                        schedule.schedule[sourceIndex].arrivalTime,
                        schedule.schedule[destIndex].arrivalTime
                    )
                };
            }
            return null;
        }).filter(s => s !== null);

        res.status(200).json({
            success: true,
            schedules: validSchedules
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to calculate duration between times
const calculateDuration = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight routes
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
};

// Delete schedule (Bus owner only)
export const deleteSchedule = async (req, res) => {
    try {
        const schedule = await BusSchedule.findOne({ bus: req.params.busId });
        
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });
        }

        // Verify bus ownership
        const bus = await Bus.findOne({ _id: schedule.bus, owner: req.user._id });
        if (!bus) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this schedule"
            });
        }

        await schedule.deleteOne();

        res.status(200).json({
            success: true,
            message: "Schedule deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};