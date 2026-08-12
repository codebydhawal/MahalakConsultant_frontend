import React, { lazy, Suspense } from 'react';
import { HashRouter, useLocation } from 'react-router-dom';

import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import useAppData from "./hooks/useAppData";
import Footer from './layouts/Footer';
import Navbar from './layouts/Navbar';
import AppRoutes from "./routes/AppRoutes";

// The AI SDK is large and is only needed after a visitor opens the advisor.
const AIAdvisor = lazy(() => import('./components/AIAdvisor').then(({ AIAdvisor }) => ({ default: AIAdvisor })));

const App: React.FC = () => {
  const location = useLocation();

  const { siteConfig } = useAppData();

  const isHeroPage = location.pathname === '/' || location.pathname === '/about';

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-stone-50 overflow-x-hidden">
        <Navbar config={siteConfig} />
        <main className={`flex-grow ${isHeroPage ? 'pt-0' : 'pt-24 md:pt-28'}`}>
          <AppRoutes config={siteConfig} />
        </main>
        <Footer config={siteConfig} />
        <WhatsAppButton number={siteConfig.whatsappEnquiry} />
        <Suspense fallback={null}>
          <AIAdvisor accentColor={siteConfig.accentColor} />
        </Suspense>
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
