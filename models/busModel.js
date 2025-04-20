import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String
    },
    busNumber: {
        type: String
    },
    aadharNumber: {
        type: Number
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const Bus = mongoose.model("Bus", BusSchema);

