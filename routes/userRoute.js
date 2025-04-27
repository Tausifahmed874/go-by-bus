import express from 'express';
import { createUser, addToFavorites, removeFromFavorites, getFavorites, getAllUsers, deleteUser } from '../controllers/userControllers.js';
import { isAuthenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/create-user', createUser);

// Protected routes
router.use(isAuthenticate);
router.post('/favorites/add', addToFavorites);
router.delete('/favorites/:busId', removeFromFavorites);
router.get('/favorites', getFavorites);

// Admin routes
router.get('/all', getAllUsers);
router.delete('/:id', deleteUser);

export default router;