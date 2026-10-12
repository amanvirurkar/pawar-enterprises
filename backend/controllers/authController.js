import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { FirestoreService } from '../config/firestoreService.js';

// Generate JWT Token
const generateToken = (id, email) => {
  const secret = process.env.JWT_SECRET || 'pawar_enterprises_super_secret_jwt_key_2026';
  return jwt.sign({ id, email }, secret, { expiresIn: '30d' });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // 1. Check if admin exists in Firestore
    const admin = await FirestoreService.findOne('admins', 'email', email.toLowerCase().trim());

    if (!admin) {
      // Default initial admin bootstrap check if Firestore has no admins yet
      if (email.toLowerCase().trim() === 'kunalvirurkar31@gmail.com' && password === 'kunal123') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = await FirestoreService.create('admins', {
          name: 'Kunal Virurkar',
          email: 'kunalvirurkar31@gmail.com',
          password: hashedPassword,
          role: 'superadmin'
        }, 'primary_admin');

        return res.json({
          _id: newAdmin.id,
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          token: generateToken(newAdmin.id, newAdmin.email)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Return user info and token
    return res.json({
      _id: admin.id,
      id: admin.id,
      name: admin.name || 'Admin',
      email: admin.email,
      role: admin.role || 'admin',
      token: generateToken(admin.id, admin.email)
    });
  } catch (error) {
    console.error('Error in loginAdmin:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private/Admin
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await FirestoreService.getById('admins', req.admin.id || req.admin._id);
    if (admin) {
      const { password, ...adminWithoutPassword } = admin;
      return res.json(adminWithoutPassword);
    }
    return res.json(req.admin);
  } catch (error) {
    console.error('Error in getAdminProfile:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update Admin Profile (Email/Password)
// @route   PUT /api/auth/update-profile
// @access  Private/Admin
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id || req.admin._id;
    const admin = await FirestoreService.getById('admins', adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name.trim();
    if (req.body.email) updateData.email = req.body.email.toLowerCase().trim();

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await FirestoreService.update('admins', adminId, updateData);
    const { password, ...safeData } = updated;

    return res.json({
      ...safeData,
      token: generateToken(adminId, safeData.email)
    });
  } catch (error) {
    console.error('Error in updateAdminProfile:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await FirestoreService.findOne('admins', 'email', email?.toLowerCase()?.trim());
    if (!admin) {
      return res.status(404).json({ message: 'No admin found with this email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await FirestoreService.update('admins', admin.id, {
      resetPasswordToken,
      resetPasswordExpire
    });

    return res.json({ 
      success: true, 
      message: 'Password reset token generated successfully',
      resetToken // Returned for API testing / UI link integration
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const admin = await FirestoreService.findOne('admins', 'resetPasswordToken', resetPasswordToken);

    if (!admin || !admin.resetPasswordExpire || admin.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await FirestoreService.update('admins', admin.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null
    });

    return res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
