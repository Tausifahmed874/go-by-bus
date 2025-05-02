import express from 'express';

import { getUserEmail, verifyOTP, updateProfile, logout } from '../controllers/authControllers.js';
import { isAuthenticate } from '../middlewares/authenticate.js';

const router = express.Router();

// Public routes
router.post('/get-email', getUserEmail);
router.post('/verify-otp', verifyOTP);

// Protected routes
router.post('/update-profile',isAuthenticate, updateProfile);
router.post('/logout', isAuthenticate, logout);

export default router;