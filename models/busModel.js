import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    busNumber: {
        type: String,
        required: true
    },
    busType:{
        type: String,
        default: "regular",
        enum: ["regular", "sleeper", "volvo", "mini"],
    },
    seatCapacity:{
        type: Number,
        required: true
    },
    isAC:{
        type: Boolean,
        default: false
    },
    isExpress:{
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const Bus = mongoose.model("Bus", BusSchema);

