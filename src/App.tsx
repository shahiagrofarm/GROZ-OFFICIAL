/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { route } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-red-600 selection:text-white bg-groz-main text-groz-main transition-colors">
      <Header />
      <main className="flex-1">
        {route === 'home' && <HomePage />}
        {route === 'shop' && <ShopPage />}
        {route === 'cart' && <CartPage />}
        {route === 'checkout' && <CheckoutPage />}
        {route === 'about' && <AboutPage />}
        {route === 'contact' && <ContactPage />}
        {route === 'admin' && <AdminPage />}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
