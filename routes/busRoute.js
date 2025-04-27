import express from 'express';
import { createBus, deleteBus, getMyBuses, updateBus, getBusById } from '../controllers/busControllers.js';
import { isAuthenticate } from '../middlewares/authenticate.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(isAuthenticate);

router.post('/create', createBus);
router.get('/my-buses', getMyBuses);
router.put('/update/:id', updateBus);
router.delete('/delete/:id', deleteBus);
router.get('/:id', getBusById);

export default router;