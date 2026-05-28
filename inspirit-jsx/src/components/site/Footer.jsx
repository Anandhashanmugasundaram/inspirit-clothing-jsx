import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";

import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative ink-section pt-24 pb-10 overflow-hidden">
      {/* BACKGROUND EFFECT */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle at 80% 0%, oklch(0.55 0.25 27 / 0.25), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <Logo />

            <p className="mt-6 max-w-md text-white/60 leading-relaxed">
              INSPIRIT is a modern streetwear brand built for people who love
              bold fashion, premium quality, and unique identity. Every drop is
              designed to make you stand out with confidence.
            </p>

            {/* SOCIAL ICONS */}
            <div className="mt-8 flex gap-3">
              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/inspiritclothings?igsh=MWplbWdxaDljZ2I1cA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 rounded-full glass flex items-center justify-center text-white hover:bg-pink-500 transition"
              >
                <FaInstagram className="text-lg" />
              </a>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/917397284491"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 rounded-full glass flex items-center justify-center text-white hover:bg-green-500 transition"
              >
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* SHOP */}
            <div>
              <h4 className="text-grotesk text-white text-sm tracking-[0.3em] mb-5">
                SHOP
              </h4>

              <ul className="space-y-3 text-white/60">
                <li>
                  <Link to="/shop" className="hover:text-white transition">
                    All Products
                  </Link>
                </li>

                <li>
                  <Link to="/shop" className="hover:text-white transition">
                    Hoodies
                  </Link>
                </li>

                <li>
                  <Link to="/shop" className="hover:text-white transition">
                    Oversized Tees
                  </Link>
                </li>

                <li>
                  <Link to="/shop" className="hover:text-white transition">
                    Shirts
                  </Link>
                </li>

                <li>
                  <Link to="/shop" className="hover:text-white transition">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-grotesk text-white text-sm tracking-[0.3em] mb-5">
                COMPANY
              </h4>

              <ul className="space-y-3 text-white/60">
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>

                <li>
                  <Link to="/offers" className="hover:text-white transition">
                    Offers
                  </Link>
                </li>

                <li>
                  <Link to="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>

                <li>
                  <Link to="/account" className="hover:text-white transition">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
  <h4 className="text-grotesk text-white text-sm tracking-[0.3em] mb-5">
    Legal Policies
  </h4>

  <ul className="space-y-3 text-white/60">
    <li>
      <Link to="/return-policy" className="hover:text-white transition">
        Return Policy
      </Link>
    </li>

    <li>
      <Link to="/terms" className="hover:text-white transition">
        Terms & Conditions
      </Link>
    </li>

    <li>
      <Link to="/privacy-policy" className="hover:text-white transition">
        Privacy Policy
      </Link>
    </li>
  </ul>
</div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-white/40 text-xs text-grotesk tracking-[0.25em]">
          <div>© 2026 INSPIRIT CLOTHING</div>

          <div>DESIGNED FOR STREET CULTURE.</div>
        </div>
      </div>
    </footer>
  );
}