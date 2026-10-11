import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const StoreSettingsContext = createContext();

export const useStoreSettings = () => useContext(StoreSettingsContext);

export const DEFAULT_HOMEPAGE = {
  headline: 'आपके घर की हर जरूरत, एक ही जगह।',
  subheading: 'Explore quality home appliances, kitchen appliances, electronics and electrical products at Pawar Enterprises.',
  heroBadge: 'YOUR HOME OUR PRIORITY',
  heroImage: '',
  primaryBtnText: 'Explore Products',
  secondaryBtnText: 'Get Directions',
  aboutHeading: 'Welcome to Pawar Enterprises',
  aboutShortDesc: 'Your trusted local destination for premium appliances and electronics in Balaghat. We believe in providing the best quality products at competitive prices with excellent after-sales support.',
  showFeatured: true,
  showCategories: true
};

export const DEFAULT_ABOUT = {
  heading: 'Pawar Enterprises Your Trusted Partner for a Better Home.',
  eyebrow: 'ABOUT US',
  fullDescription: 'Pawar Enterprises is a trusted name in Balaghat, offering a wide range of home appliances, kitchen appliances, electronics and electrical products from top brands. We are committed to providing genuine products, fair pricing and excellent customer service to make your home and lifestyle better.',
  storyTitle: 'A Local Store With A Bigger Vision',
  storyDescription: 'Started in Balaghat, Pawar Enterprises has always focused on one thing - giving our customers the best products, honest advice and reliable service. Over the years, we have built strong relationships with leading brands and thousands of happy customers.',
  aboutImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
  happyCustomers: '5000+',
  experienceYears: '10+',
  productsCount: '1000+',
  topBrandsCount: '20+'
};

export const DEFAULT_STORE_INFO = {
  businessName: 'Pawar Enterprises',
  address: 'In front of sharnagat hardware, Bhidiya Balaghat',
  city: 'Balaghat',
  pincode: '481001',
  phone: '+91 94244 57796',
  whatsapp: '+91 94244 57796',
  email: 'contact@pawarenterprises.com',
  mapsUrl: 'https://maps.google.com/?q=Pawar+Enterprises+Balaghat',
  hours: {
    Monday: { open: true, from: '10:00', to: '20:00' },
    Tuesday: { open: true, from: '10:00', to: '20:00' },
    Wednesday: { open: true, from: '10:00', to: '20:00' },
    Thursday: { open: true, from: '10:00', to: '20:00' },
    Friday: { open: true, from: '10:00', to: '20:00' },
    Saturday: { open: true, from: '10:00', to: '20:00' },
    Sunday: { open: false, from: '10:00', to: '20:00' }
  }
};

export const DEFAULT_SEO = {
  homeTitle: 'Pawar Enterprises - Electronics & Appliances in Balaghat',
  homeDescription: 'Shop the best home appliances, kitchen appliances, and electronics at Pawar Enterprises, Balaghat.',
  productsTitle: 'Our Products | Pawar Enterprises',
  productsDescription: 'Browse our extensive catalogue of refrigerators, TVs, washing machines, and electrical accessories.',
  aboutTitle: 'About Us | Pawar Enterprises Balaghat',
  aboutDescription: 'Discover the story and mission of Pawar Enterprises, your trusted electronics store in Balaghat.',
  contactTitle: 'Contact Us | Pawar Enterprises',
  contactDescription: 'Get in touch with Pawar Enterprises in Balaghat for enquiries, directions, and customer support.'
};

export const StoreSettingsProvider = ({ children }) => {
  const [homepage, setHomepage] = useState(DEFAULT_HOMEPAGE);
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [storeInfo, setStoreInfo] = useState(DEFAULT_STORE_INFO);
  const [seo, setSeo] = useState(DEFAULT_SEO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to homepage settings
    const unsubHome = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        setHomepage({ ...DEFAULT_HOMEPAGE, ...docSnap.data() });
      }
    }, (err) => console.warn('Homepage settings listener error:', err));

    // Listen to about settings
    const unsubAbout = onSnapshot(doc(db, 'settings', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        setAbout({ ...DEFAULT_ABOUT, ...docSnap.data() });
      }
    }, (err) => console.warn('About settings listener error:', err));

    // Listen to store info settings
    const unsubStore = onSnapshot(doc(db, 'settings', 'storeInfo'), (docSnap) => {
      if (docSnap.exists()) {
        setStoreInfo({ ...DEFAULT_STORE_INFO, ...docSnap.data() });
      }
    }, (err) => console.warn('Store info listener error:', err));

    // Listen to SEO settings
    const unsubSeo = onSnapshot(doc(db, 'settings', 'seo'), (docSnap) => {
      if (docSnap.exists()) {
        setSeo({ ...DEFAULT_SEO, ...docSnap.data() });
      }
    }, (err) => console.warn('SEO settings listener error:', err));

    setLoading(false);

    return () => {
      unsubHome();
      unsubAbout();
      unsubStore();
      unsubSeo();
    };
  }, []);

  const updateHomepageSettings = async (newData) => {
    await setDoc(doc(db, 'settings', 'homepage'), newData, { merge: true });
    setHomepage(prev => ({ ...prev, ...newData }));
  };

  const updateAboutSettings = async (newData) => {
    await setDoc(doc(db, 'settings', 'about'), newData, { merge: true });
    setAbout(prev => ({ ...prev, ...newData }));
  };

  const updateStoreInfoSettings = async (newData) => {
    await setDoc(doc(db, 'settings', 'storeInfo'), newData, { merge: true });
    setStoreInfo(prev => ({ ...prev, ...newData }));
  };

  const updateSeoSettings = async (newData) => {
    await setDoc(doc(db, 'settings', 'seo'), newData, { merge: true });
    setSeo(prev => ({ ...prev, ...newData }));
  };

  return (
    <StoreSettingsContext.Provider value={{
      homepage,
      about,
      storeInfo,
      seo,
      loading,
      updateHomepageSettings,
      updateAboutSettings,
      updateStoreInfoSettings,
      updateSeoSettings
    }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};
