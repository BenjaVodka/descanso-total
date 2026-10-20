import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout.jsx'
import { StoreProvider } from './context/StoreProvider.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import {
  CartPage,
  CategoriesPage,
  CheckoutPage,
  HomePage,
  OffersPage,
  OrderResultPage,
  ProductDetailPage,
} from './pages/StorePages.jsx'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="categorias" element={<CategoriesPage />} />
            <Route path="categorias/:category" element={<CategoriesPage />} />
            <Route path="ofertas" element={<OffersPage />} />
            <Route path="producto/:productId" element={<ProductDetailPage />} />
            <Route path="carrito" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="resultado-compra" element={<OrderResultPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<main className="container content-section"><h1>Página no encontrada</h1><a href="/">Volver al inicio</a></main>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
