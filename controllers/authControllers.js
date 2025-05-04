import { User } from "../models/userModel.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

export const getUserEmail = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email: email });
        }

        const now = Date.now();
        const tenMinutesLater = new Date(now + 10 * 60 * 1000);

        let otp = generateOtp();
        user = await User.findByIdAndUpdate(user._id, {
            verifyEmailOTP: otp,
            verifyEmailOTPExpire: tenMinutesLater
        }, { new: true });

        // Send OTP via email with beautiful template
        let options = {
            email: email,
            subject: "Your Verification Code",
            otp: otp,
            name: user.name // Include if available
        };

        await sendEmail(options);

        res.json({
            success: true,
            message: `OTP sent to ${email} successfully, please check your email spam section also.`
        });

    } catch (error) {
        res.json({
            error: error.message,
            success: false
        });
    }
}
export const verifyOTP = async (req, res) => {
    try {

        const { otp } = req.body
        // verify otp
        let user = await User.findOne({
            verifyEmailOTP: otp
        })

        if (!user) {
            return res.json({
                success: false,
                message: `User does not exists.`
            });
        }
        if (user.verifyEmailOTPExpire < Date.now()) {
            return res.json({
                success: false,
                message: `OTP expired, Try again.`
            });
        }
        const token = jwt.sign({
            _id: user._id,
        }, process.env.JWT_SECRET)

        user = await User.findByIdAndUpdate(user._id, {
            isEmailVerified: true,
            token: token
        }, { new: true })



        res.status(200).json({
            user,
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, bio, address, role, mobileNumber, aadharNumber, drivingLicenseNumber } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                name,
                role,
                bio,
                address, 
                mobileNumber,
                aadharNumber,  
                drivingLicenseNumber
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            token: null
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
