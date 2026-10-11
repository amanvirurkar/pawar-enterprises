import { Home, Coffee, Monitor, Zap } from 'lucide-react';

export const categories = [
  {
    id: 'home-appliances',
    name: 'Home Appliances',
    description: 'Essential appliances for a comfortable home.',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
    productCount: '120+',
    colorTheme: 'red',
    icon: Home,
    subcategories: []
  },
  {
    id: 'kitchen-appliances',
    name: 'Kitchen Appliances',
    description: 'Modern kitchen appliances for easy cooking.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    productCount: '200+',
    colorTheme: 'orange',
    icon: Coffee,
    subcategories: []
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest electronic products for modern living.',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
    productCount: '150+',
    colorTheme: 'blue',
    icon: Monitor,
    subcategories: []
  },
  {
    id: 'electrical-products',
    name: 'Electrical Products',
    description: 'Complete range of electrical products for home and office.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    productCount: '100+',
    colorTheme: 'green',
    icon: Zap,
    subcategories: []
  }
];
