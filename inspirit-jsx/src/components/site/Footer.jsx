import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import Logo from './Logo';
export default function Footer() {
    return (<footer className="relative ink-section pt-24 pb-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: 'radial-gradient(circle at 80% 0%, oklch(0.55 0.25 27 / 0.25), transparent 50%)' }}/>
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-md text-white/60 leading-relaxed">
              INSPIRIT is a unisex streetwear house from the underground. Limited drops, ritual cuts, blood-tone palette.
              Wear something that means something.
            </p>
            <div className="mt-8 flex gap-3">
              {[FaInstagram, FaTiktok, FaYoutube, FaXTwitter].map((Icon, i) => (<a key={i} href="#" className="h-11 w-11 rounded-full glass flex items-center justify-center text-white hover:bg-[oklch(0.55_0.25_27)] transition">
                  <Icon className="text-lg"/>
                </a>))}
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-grotesk text-white text-sm tracking-[0.3em] mb-5">SHOP</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link to="/shop" className="hover:text-white">All Pieces</Link></li>
                <li><Link to="/shop" className="hover:text-white">Jerseys</Link></li>
                <li><Link to="/shop" className="hover:text-white">Shirts</Link></li>
                <li><Link to="/shop" className="hover:text-white">T-Shirts</Link></li>
                <li><Link to="/shop" className="hover:text-white">Pants</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-grotesk text-white text-sm tracking-[0.3em] mb-5">HOUSE</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link to="/about" className="hover:text-white">Our Story</Link></li>
                <li><Link to="/offers" className="hover:text-white">Drops</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/account" className="hover:text-white">Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-grotesk text-white text-sm tracking-[0.3em] mb-5">SUPPORT</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-white">Shipping</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Size Guide</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-white/40 text-xs text-grotesk tracking-[0.25em]">
          <div>© 2026 INSPIRIT CLOTHING — RITUAL WEAR</div>
          <div>BUILT WITH INTENT. WORN WITH PURPOSE.</div>
        </div>
      </div>
    </footer>);
}
