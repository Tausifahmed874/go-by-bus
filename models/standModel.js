import mongoose from "mongoose";

const StandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

export const Stand = mongoose.model("Stand", StandSchema);

