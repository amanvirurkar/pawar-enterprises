import jwt from 'jsonwebtoken';
import { FirestoreService } from '../config/firestoreService.js';
import { adminMode, admin } from '../config/firebase.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Try Firebase Admin ID Token verification if Admin SDK is active
      if (adminMode && admin?.auth) {
        try {
          const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
          req.admin = {
            id: decodedFirebaseToken.uid,
            _id: decodedFirebaseToken.uid,
            email: decodedFirebaseToken.email,
            role: 'admin'
          };
          return next();
        } catch (firebaseErr) {
          // If not a Firebase token, fall through to JWT verification
        }
      }

      // Verify custom backend JWT Token
      const secret = process.env.JWT_SECRET || 'pawar_enterprises_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);
      
      // Look up admin profile in Firestore
      const adminUser = await FirestoreService.getById('admins', decoded.id);
      if (adminUser) {
        req.admin = adminUser;
        return next();
      }

      // If valid JWT signature but admin doc not stored yet, trust verified token payload
      req.admin = {
        id: decoded.id,
        _id: decoded.id,
        email: decoded.email || 'admin@pawarenterprises.com',
        role: 'admin'
      };
      return next();
    } catch (error) {
      console.error('Auth protect error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export { protect };
export default protect;
