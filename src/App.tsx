import { HashRouter, Route, Routes } from 'react-router-dom';

import { AppLayout } from './modules/shared/components/AppLayout';
import { CartPage } from './modules/CartPage';
import { FavoritesPage } from './modules/FavoritesPage';
import { HomePage } from './modules/HomePage';
import { NotFoundPage } from './modules/NotFoundPage';
import { ProductDetailsPage } from './modules/ProductDetailsPage';
import { ProductsPage } from './modules/ProductsPage';

import './App.scss';

export const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="phones" element={<ProductsPage category="phones" />} />
        <Route path="tablets" element={<ProductsPage category="tablets" />} />
        <Route
          path="accessories"
          element={<ProductsPage category="accessories" />}
        />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </HashRouter>
);
