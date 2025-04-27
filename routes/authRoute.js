import express from 'express';
import { createUser } from '../controllers/userControllers.js';
import { getUserEmail, verifyOTP, updateProfile, logout } from '../controllers/authControllers.js';
import { isAuthenticate } from '../middlewares/authenticate.js';

const router = express.Router();

// Public routes
router.post('/get-email', getUserEmail);
router.post('/verify-otp', verifyOTP);

// Protected routes
router.use(isAuthenticate);
router.post('/update-profile', updateProfile);
router.post('/logout', logout);

export default router;