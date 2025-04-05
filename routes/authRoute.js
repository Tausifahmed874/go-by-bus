import express from 'express';
import { createUser } from '../controllers/userControllers.js';
import { getUserEmail, verifyOTP } from '../controllers/authControllers.js';




const router = express.Router();

router.post('/get-email', getUserEmail);
router.post('/verify-otp', verifyOTP);





export default router