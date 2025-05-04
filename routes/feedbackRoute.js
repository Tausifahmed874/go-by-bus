import express from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';
import { isAuthenticate } from '../middlewares/authenticate.js';

const router = express.Router();

// POST /api/feedback
router.post('/', isAuthenticate , submitFeedback);

export default router; 