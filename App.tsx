import React from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { AIAdvisor } from './components/AIAdvisor';

import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import useAppData from "./hooks/useAppData";
import useCart from "./hooks/useCart";
import Footer from './layouts/Footer';
import Navbar from './layouts/Navbar';
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  const location = useLocation();

  const {
    products,
    blogs,
    projects,
    media,
    team,
    testimonials,
    siteConfig,
  } = useAppData();

  const {
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const isHeroPage = location.pathname === '/' || location.pathname === '/about';

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-stone-50 overflow-x-hidden">
        <Navbar cartCount={cartCount} config={siteConfig} />
        <main className={`flex-grow ${isHeroPage ? 'pt-0' : 'pt-24 md:pt-28'}`}>
          <AppRoutes
            projects={projects}
            blogs={blogs}
            media={media}
            testimonials={testimonials}
            team={team}
            config={siteConfig}
          />
        </main>
        <Footer config={siteConfig} />
        <WhatsAppButton number={siteConfig.whatsappEnquiry} />
        <AIAdvisor accentColor={siteConfig.accentColor} />
        <BackToTop accentColor={siteConfig.accentColor} />
      </div>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default AppWrapper;
