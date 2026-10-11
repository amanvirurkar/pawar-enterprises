import express from 'express';
import { getStore, updateStore } from '../controllers/storeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(getStore).put(protect, updateStore);

export default router;
