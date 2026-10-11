import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, getDocs } from 'firebase/firestore';

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for categories
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const catList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setCategories(catList);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to categories:", error);
      setCategories([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading, defaultCategories: [] }}>
      {children}
    </CategoriesContext.Provider>
  );
};
