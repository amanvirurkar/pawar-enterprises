import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const BrandsContext = createContext();

export const useBrands = () => useContext(BrandsContext);

export const BrandsProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'brands'), (snapshot) => {
      const brandList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setBrands(brandList);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to brands:", error);
      setBrands([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrandsContext.Provider value={{ brands, loading, defaultBrands: [] }}>
      {children}
    </BrandsContext.Provider>
  );
};
