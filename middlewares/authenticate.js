import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

export const isAuthenticate = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.status(400).json({
                message: 'Please authenticate',
                success: false
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await User.findById(decoded._id)
        if(token !== user.token) {
            return res.status(400).json({
                message: 'Please authenticate',
                success: false
            })
        }

        if (!user.token) {
            return res.status(400).json({
                message: 'Please authenticate',
                success: false
            })
        }
        req.user = user

        next()
    }
    catch (error) {
        return res.status(401).json({
            error: 'Please authenticate'
        })
    }
}

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Forbidden',
                success: false
            });
        }
        next();
    };
};