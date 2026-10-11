import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const BrandsContext = createContext();

export const useBrands = () => useContext(BrandsContext);

const DEFAULT_BRANDS = [
  { id: 'samsung', name: 'Samsung', status: 'Active', description: 'Global electronics and appliances leader', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=200' },
  { id: 'lg', name: 'LG', status: 'Active', description: 'Life\'s Good - Innovative home appliances', logo: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=200' },
  { id: 'sony', name: 'Sony', status: 'Active', description: 'Premium entertainment & sound systems', logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=200' },
  { id: 'philips', name: 'Philips', status: 'Active', description: 'Personal care & kitchen electronics', logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200' },
  { id: 'bosch', name: 'Bosch', status: 'Active', description: 'Engineered for excellence', logo: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?auto=format&fit=crop&q=80&w=200' },
  { id: 'daikin', name: 'Daikin', status: 'Active', description: 'Air conditioning & climate comfort', logo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200' },
  { id: 'kent', name: 'Kent', status: 'Active', description: 'Water purifiers & appliances', logo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=200' },
  { id: 'haier', name: 'Haier', status: 'Active', description: 'Smart home & kitchen appliances', logo: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=200' },
];

export const BrandsProvider = ({ children }) => {
  const [brands, setBrands] = useState(DEFAULT_BRANDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'brands'), async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const brand of DEFAULT_BRANDS) {
            await setDoc(doc(db, 'brands', brand.id), {
              ...brand,
              createdAt: serverTimestamp()
            });
          }
          setBrands(DEFAULT_BRANDS);
        } catch (e) {
          console.warn("Could not seed brands, using local defaults:", e);
          setBrands(DEFAULT_BRANDS);
        }
      } else {
        const brandList = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setBrands(brandList);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to brands:", error);
      setBrands(DEFAULT_BRANDS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrandsContext.Provider value={{ brands, loading, defaultBrands: DEFAULT_BRANDS }}>
      {children}
    </BrandsContext.Provider>
  );
};
