import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, getDocs } from 'firebase/firestore';

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

const DEFAULT_CATEGORIES = [
  {
    id: 'home-appliances',
    name: 'Home Appliances',
    slug: 'home-appliances',
    description: 'Essential appliances for a comfortable home.',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
    colorTheme: 'red',
    iconName: 'Home',
    status: 'Active'
  },
  {
    id: 'kitchen-appliances',
    name: 'Kitchen Appliances',
    slug: 'kitchen-appliances',
    description: 'Modern kitchen appliances for easy cooking.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    colorTheme: 'orange',
    iconName: 'Coffee',
    status: 'Active'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic products for modern living.',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
    colorTheme: 'blue',
    iconName: 'Monitor',
    status: 'Active'
  },
  {
    id: 'electrical-products',
    name: 'Electrical Products',
    slug: 'electrical-products',
    description: 'Complete range of electrical products for home and office.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    colorTheme: 'green',
    iconName: 'Zap',
    status: 'Active'
  }
];

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
    <CategoriesContext.Provider value={{ categories, loading, defaultCategories: DEFAULT_CATEGORIES }}>
      {children}
    </CategoriesContext.Provider>
  );
};
