import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { CategoriesProvider } from './context/CategoriesContext.jsx'
import { BrandsProvider } from './context/BrandsContext.jsx'
import { StoreSettingsProvider } from './context/StoreSettingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductsProvider>
      <CategoriesProvider>
        <BrandsProvider>
          <StoreSettingsProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </StoreSettingsProvider>
        </BrandsProvider>
      </CategoriesProvider>
    </ProductsProvider>
  </StrictMode>,
)
