import express from 'express';
import { getProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.route('/id/:id')
  .get(protect, getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router.route('/:slug')
  .get(getProductBySlug);

export default router;
