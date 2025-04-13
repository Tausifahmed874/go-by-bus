import { User } from "../models/userModel.js";

export const createUser = async (req, res) => {
    try {

        // HW : req.body theke requered data for user and then create a user


        const user = await User.create(req.body);
        // HW : create function in utils folder which will create a 6 digit random otp and will return it  ex-op : 124872
        // save the otp in user data

        res.json({
            user,
            success: true,
            message: "User created successfully"
        });

    } catch (error) {
        res.json({
            error: error.message,
            success: false
        });
    }
}
