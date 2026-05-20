import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';
({ component: Checkout,
    head: () => ({ meta: [{ title: 'Checkout — INSPIRIT' }] }),
});
function Checkout() {
    const { cart, cartTotal } = useApp();
    const [done, setDone] = useState(false);
    const nav = useNavigate();
    const submit = (e) => {
        e.preventDefault();
        setDone(true);
        toast.success('Order received');
        setTimeout(() => nav('/'), 4000);
    };
    const shipping = cartTotal > 250 || cartTotal === 0 ? 0 : 20;
    const total = cartTotal + shipping;
    if (done) {
        return (<div className="ink-section min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="mx-auto h-24 w-24 rounded-full btn-blood flex items-center justify-center animate-pulse-glow"><FiCheck className="text-4xl"/></div>
          <h1 className="mt-8 text-display text-5xl text-white">Welcome to the ritual.</h1>
          <p className="mt-4 text-white/60">Your order has been received. A confirmation just left for your inbox.</p>
          <Link to="/" className="mt-8 inline-block text-grotesk text-xs tracking-[0.3em] text-[oklch(0.65_0.25_27)] underline underline-offset-8">RETURN HOME →</Link>
        </div>
      </div>);
    }
    return (<div className="bone-section pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <h1 className="text-display text-5xl md:text-7xl">Checkout.</h1>
        <form onSubmit={submit} className="mt-12 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h3 className="text-grotesk text-sm tracking-[0.3em] mb-5">CONTACT</h3>
              <input required type="email" placeholder="Email" className="w-full px-4 py-3 border border-black/15 outline-none focus:border-black"/>
            </section>
            <section>
              <h3 className="text-grotesk text-sm tracking-[0.3em] mb-5">SHIPPING</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <input required placeholder="First name" className="px-4 py-3 border border-black/15 outline-none focus:border-black"/>
                <input required placeholder="Last name" className="px-4 py-3 border border-black/15 outline-none focus:border-black"/>
                <input required placeholder="Address" className="md:col-span-2 px-4 py-3 border border-black/15 outline-none focus:border-black"/>
                <input required placeholder="City" className="px-4 py-3 border border-black/15 outline-none focus:border-black"/>
                <input required placeholder="Postal code" className="px-4 py-3 border border-black/15 outline-none focus:border-black"/>
                <input required placeholder="Country" className="md:col-span-2 px-4 py-3 border border-black/15 outline-none focus:border-black"/>
              </div>
            </section>
            <section>
              <h3 className="text-grotesk text-sm tracking-[0.3em] mb-5">PAYMENT</h3>
              <input required placeholder="Card number" className="w-full px-4 py-3 border border-black/15 outline-none focus:border-black"/>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <input required placeholder="MM / YY" className="px-4 py-3 border border-black/15 outline-none focus:border-black"/>
                <input required placeholder="CVC" className="px-4 py-3 border border-black/15 outline-none focus:border-black"/>
              </div>
            </section>
          </div>
          <aside className="bg-black text-white p-7 h-fit sticky top-32">
            <h3 className="text-display text-2xl">Order</h3>
            <div className="mt-5 space-y-3 max-h-64 overflow-auto">
              {cart.map(i => (<div key={i.product.id + i.size} className="flex gap-3 text-sm">
                  <img src={i.product.images[0]} className="h-14 w-12 object-cover"/>
                  <div className="flex-1">
                    <p>{i.product.name}</p>
                    <p className="text-white/50 text-xs">{i.size} · {i.qty}×</p>
                  </div>
                  <span>${i.product.price * i.qty}</span>
                </div>))}
            </div>
            <dl className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd>${cartTotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-white/60">Shipping</dt><dd>{shipping ? `$${shipping}` : 'FREE'}</dd></div>
              <div className="flex justify-between pt-3 border-t border-white/10 text-lg font-semibold"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div>
            </dl>
            <button className="mt-6 w-full btn-blood py-4 text-grotesk text-sm tracking-[0.3em]">CONFIRM ORDER</button>
          </aside>
        </form>
      </div>
    </div>);
}
export default Checkout;
