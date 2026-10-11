import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// Load env vars
dotenv.config();

// (MongoDB has been removed, Firebase will be added here)

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Pawar Enterprises API is running...', status: 'OK' });
});

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/enquiries', enquiryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
