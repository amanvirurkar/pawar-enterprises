import express from 'express';
import { loginAdmin, getAdminProfile, forgotPassword, resetPassword, updateAdminProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, getAdminProfile);
router.put('/update-profile', protect, updateAdminProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
