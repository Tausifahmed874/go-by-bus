import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    verifyEmailOTP:{
        type: String,
    },
    verifyEmailOTPExpire:{
        type: Date,
    },
    role: {
        type: String,
        default: "passenger",
        enum: ["admin", "passenger", "driver"],
        required: true
    },
    avatar: {
        public_id:{
            type: String
        },
        url: {
            type: String
        }
    },
    bio: {
        type: String
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String }
    },

    // driver specific
    licenseNumber: {
        type: String
    },
    busNumber:{
        type: String
    },
    aadharNumber:{
        type: Number
    }
   
})

export const User = mongoose.model("User", userSchema);