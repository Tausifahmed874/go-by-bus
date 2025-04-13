import { User } from "../models/userModel.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";

export const getUserEmail = async (req, res) => {
    try {

        const { email } = req.body
        let user = await User.findOne({
            email
        })

        if (!user) {
            return res.json({
                success: false,
                message: `User does not exists.`
            });
        }
        const now = Date.now(); // Current timestamp in milliseconds
        const tenMinutesLater = new Date(now + 10 * 60 * 1000); // Add 10 minutes (10 * 60 seconds * 1000 milliseconds)

        let otp = generateOtp()
        user = await User.findByIdAndUpdate(user._id, {
            verifyEmailOTP: otp,
            verifyEmailOTPExpire: tenMinutesLater

        }, { new: true })

        // sendOTP on email
        let options = {
            email: email,
            subject: "TEST email",
            message: `Hellow ${user.name},\n OTP : ${otp}. <h1>hellow</h1>`
        }
        await sendEmail(options)


        res.json({
            success: true,
            message: `OTP sent ot ${email} successfully`
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
        user = await User.findByIdAndUpdate(user._id, {
            isEmailVerified: true
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
}
