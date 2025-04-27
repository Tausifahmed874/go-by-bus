import express from 'express';
import { createSchedule, getBusSchedule, searchBuses, deleteSchedule } from '../controllers/scheduleControllers.js';
import { isAuthenticate } from '../middlewares/authenticate.js';
import { getAllStands, getStandById, updateStand, deleteStand } from '../controllers/standControllers.js';

const router = express.Router();

// Protected routes
router.post('/create', isAuthenticate, createSchedule);
router.get('/bus/:busId', getBusSchedule);
router.delete('/bus/:busId', isAuthenticate, deleteSchedule);

// Stand routes
router.get('/stands', getAllStands);
router.get('/stands/:id', getStandById);
router.put('/stands/:id', isAuthenticate, updateStand);
router.delete('/stands/:id', isAuthenticate, deleteStand);

// Public route for searching buses
router.get('/search', searchBuses);

export default router;