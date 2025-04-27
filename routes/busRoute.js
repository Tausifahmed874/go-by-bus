import express from 'express';
import { createBus, deleteBus, getMyBuses, updateBus, getBusById } from '../controllers/busControllers.js';
import { isAuthenticate } from '../middlewares/authenticate.js';

const router = express.Router();

// All routes are protected and require authentication


router.post('/create', isAuthenticate, createBus);
router.get('/my-buses',isAuthenticate, getMyBuses);
router.put('/update/:id',isAuthenticate, updateBus);
router.delete('/delete/:id',isAuthenticate, deleteBus);
router.get('/:id',isAuthenticate, getBusById);

export default router;