import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdmin({
          _id: user.uid,
          email: user.email,
          name: user.displayName || 'Admin'
        });
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setAdmin({
      _id: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || 'Admin'
    });
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    setAdmin(null);
  };

  const forgotPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const resetPassword = async (token, newPassword) => {
    // Note: Firebase usually handles reset tokens internally, but if you have a custom UI using the oobCode (token):
    await verifyPasswordResetCode(auth, token);
    await confirmPasswordReset(auth, token, newPassword);
    return true;
  };

  const updateProfile = async (newEmail, newPassword) => {
    if (newEmail && newEmail !== auth.currentUser.email) {
      await updateEmail(auth.currentUser, newEmail);
    }
    if (newPassword) {
      await updatePassword(auth.currentUser, newPassword);
    }
    // Update local state
    setAdmin(prev => ({ ...prev, email: newEmail || prev.email }));
    return true;
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading, forgotPassword, resetPassword, updateProfile }}>
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
