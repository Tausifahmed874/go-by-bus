import express from 'express';
import {  addToFavorites, removeFromFavorites, getFavorites, getAllUsers, deleteUser } from '../controllers/userControllers.js';
import { isAuthenticate } from '../middlewares/authenticate.js';

const router = express.Router();



// Protected routes
router.post('/favorites/add',isAuthenticate, addToFavorites);
router.delete('/favorites/:busId',isAuthenticate, removeFromFavorites);
router.get('/favorites',isAuthenticate, getFavorites);

// Admin routes
router.get('/all',isAuthenticate, getAllUsers);
router.delete('/:id',isAuthenticate, deleteUser);

export default router;