import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load env vars
dotenv.config();

// Initialize Firebase Backend Connection
import './config/firebase.js';

const app = express();

// Middleware
app.use(express.json());

// CORS configuration supporting local dev and production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://pawar-enterprises.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o) || o === '*')) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all legitimate frontend origins
  },
  credentials: true
}));

// Basic health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Pawar Enterprises API is running with Cloud Firestore...', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Pawar Enterprises Server running on port ${PORT}`);
});

export default app;
