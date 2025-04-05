import { User } from "../models/userModel.js";

export const getUserEmail = async (req, res) => {
    try {

        const {email} = req.body
        // create user if not exists (email is already)

        // HW : create function in utils folder which will create a 6 digit random otp and will return it  ex-op : 124872

        // save otp to user model
        // sendOTP on email


        res.json({
            email,
            success : true,
            message: `OTP sent ot ${email} successfully`
        });

    } catch (error) {
        res.json({
            error: error.message,
            success : false
        });
    }
}
export const verifyOTP = async (req, res) => {
    try {

        const {otp} = req.body
        // verify otp


        res.status(200).json({
            otp,
            success : true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
            success : false
        });
    }
}
