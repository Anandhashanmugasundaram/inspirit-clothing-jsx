import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { HiOutlineMenuAlt4, HiOutlineX } from 'react-icons/hi';
import { FiSearch, FiUser, FiShoppingBag, FiHeart } from 'react-icons/fi';
import Logo from './Logo';
import { useApp } from '@/context/AppContext';
const NAV = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/offers', label: 'Drops' },
    { to: '/about', label: 'Story' },
    { to: '/contact', label: 'Contact' },
];
export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { cartCount, wishlist } = useApp();
    const loc = useLocation();
    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 30);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);
    useEffect(() => { setOpen(false); }, [loc.pathname]);
    return (<>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-3' : 'py-5'}`}>
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-10">
            {NAV.map(n => (<Link key={n.to} to={n.to} className="text-grotesk text-sm tracking-[0.25em] text-white/80 hover:text-white relative group">
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[oklch(0.55_0.25_27)] transition-all duration-500 group-hover:w-full"/>
              </Link>))}
          </nav>
          <div className="flex items-center gap-3 md:gap-5 text-white">
            <button data-cursor className="hidden md:inline-flex hover:text-[oklch(0.65_0.25_27)] transition" aria-label="Search"><FiSearch className="text-xl"/></button>
            <Link to="/account" data-cursor className="hover:text-[oklch(0.65_0.25_27)] transition" aria-label="Account"><FiUser className="text-xl"/></Link>
            <Link to="/account" data-cursor className="relative hover:text-[oklch(0.65_0.25_27)] transition" aria-label="Wishlist">
              <FiHeart className="text-xl"/>
              {wishlist.length > 0 && <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 text-[10px] rounded-full bg-[oklch(0.55_0.25_27)] flex items-center justify-center">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" data-cursor className="relative hover:text-[oklch(0.65_0.25_27)] transition" aria-label="Bag">
              <FiShoppingBag className="text-xl"/>
              {cartCount > 0 && <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 text-[10px] rounded-full bg-[oklch(0.55_0.25_27)] flex items-center justify-center">{cartCount}</span>}
            </Link>
            <button onClick={() => setOpen(true)} data-cursor className="lg:hidden text-white" aria-label="Menu"><HiOutlineMenuAlt4 className="text-2xl"/></button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[80] lg:hidden transition ${open ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)}/>
        <aside className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-[oklch(0.06_0.005_20)] border-l border-white/10 p-7 flex flex-col transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between">
            <Logo />
            <button onClick={() => setOpen(false)} className="text-white"><HiOutlineX className="text-2xl"/></button>
          </div>
          <nav className="mt-12 flex flex-col gap-1">
            {NAV.map((n, i) => (<Link key={n.to} to={n.to} className="group block py-4 border-b border-white/10">
                <span className="text-grotesk text-3xl text-white group-hover:text-[oklch(0.65_0.25_27)] transition">{String(i + 1).padStart(2, '0')}. {n.label}</span>
              </Link>))}
          </nav>
          <div className="mt-auto text-white/50 text-xs tracking-[0.3em] text-grotesk">© INSPIRIT — RITUAL WEAR</div>
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 glass rounded-full px-6 py-3 flex items-center justify-between text-white">
        <Link to="/" aria-label="Home" className="hover:text-[oklch(0.65_0.25_27)]"><FiSearch className="text-lg"/></Link>
        <Link to="/shop" aria-label="Shop"><span className="text-grotesk text-sm tracking-[0.2em]">SHOP</span></Link>
        <Link to="/account" aria-label="Account"><FiUser className="text-lg"/></Link>
        <Link to="/cart" aria-label="Bag" className="relative">
          <FiShoppingBag className="text-lg"/>
          {cartCount > 0 && <span className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[10px] rounded-full bg-[oklch(0.55_0.25_27)] flex items-center justify-center">{cartCount}</span>}
        </Link>
      </div>
    </>);
}
