import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import Cursor from '@/components/site/Cursor';
import ScrollProgress from '@/components/site/ScrollProgress';
import IntroLoader from '@/components/site/IntroLoader';

import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import Product from '@/pages/Product';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Offers from '@/pages/Offers';
import Account from '@/pages/Account';

import Register from '@/pages/Register';
import Forgot from '@/pages/Forgot';
import AdminPage from './pages/AdminPage';
import ReturnPolicy from './pages/ReturnPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-20 lg:bottom-8 right-5 z-40 h-12 w-12 rounded-full btn-blood flex items-center justify-center transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <FiArrowUp />
    </button>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center ink-section px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-[8rem] leading-none text-[oklch(0.55_0.25_27)]">404</h1>
        <p className="mt-4 text-grotesk tracking-[0.3em] text-white/70">PAGE LOST IN THE RITUAL</p>
        <Link to="/" className="mt-8 inline-block btn-blood px-8 py-3 text-grotesk tracking-[0.25em]">RETURN HOME</Link>
      </div>
    </div>
  );
}

export default function App() {
  const loc = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  return (
    <>
      <IntroLoader />
   
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          {/* <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="*" element={<NotFound />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
