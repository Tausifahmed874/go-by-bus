import { sendFeedback } from '../utils/sendFeedback.js';

export const submitFeedback = async (req, res) => {
    const {message, adminEmail } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }
    try {
        await sendFeedback({
            name: req.user.name,
            email: req.user.email,
            adminEmail : adminEmail || process.env.SMPT_MAIL,
            message,
            // Optionally, you can set adminEmail here if needed
        });
        res.status(200).json({ success: true, message: 'Feedback submitted successfully.' });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ error: 'Failed to submit feedback. Please try again later.' });
    }
}; 