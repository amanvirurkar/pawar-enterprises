import express from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(getBrands).post(protect, createBrand);
router.route('/:id').put(protect, updateBrand).delete(protect, deleteBrand);

export default router;
