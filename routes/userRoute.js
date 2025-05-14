import express from 'express';
import {  addToFavorites, removeFromFavorites, getFavorites, getAllUsers, deleteUser, requestManagerRole, getPendingManagerRequests, approveManagerRequest, getProfile } from '../controllers/userControllers.js';
import { isAuthenticate, authorize } from '../middlewares/authenticate.js';

const router = express.Router();



// Protected routes
router.post('/favorites/add',isAuthenticate, addToFavorites);
router.delete('/favorites/:busId',isAuthenticate, removeFromFavorites);
router.get('/favorites',isAuthenticate, getFavorites);

// Admin routes
router.get('/all',isAuthenticate, getAllUsers);
router.delete('/:id',isAuthenticate, deleteUser);

// Request manager role
router.post('/request-manager', isAuthenticate, requestManagerRole);

// Admin: View pending manager requests
router.get('/manager-requests', isAuthenticate, authorize(['admin']), getPendingManagerRequests);
// Admin: Approve/deny manager request
router.post('/approve-manager', isAuthenticate, authorize(['admin']), approveManagerRequest);

// Get own profile
router.get('/profile', isAuthenticate, getProfile);

export default router;