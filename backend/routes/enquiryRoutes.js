import express from 'express';
import { getEnquiries, createEnquiry, updateEnquiryStatus, deleteEnquiry } from '../controllers/enquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, getEnquiries).post(createEnquiry); // Public POST for contact form
router.route('/:id').put(protect, updateEnquiryStatus).delete(protect, deleteEnquiry);

export default router;
