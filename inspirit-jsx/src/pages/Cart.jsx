import { Link } from "react-router-dom";
import { useState } from 'react';
import { FiMinus, FiPlus, FiX, FiArrowRight } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';
({ component: Cart,
    head: () => ({ meta: [{ title: 'Your Bag — INSPIRIT' }] }),
});
function Cart() {
    const { cart, removeFromCart, updateQty, cartTotal } = useApp();
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const shipping = cartTotal > 250 || cartTotal === 0 ? 0 : 20;
    const total = Math.max(0, cartTotal - discount) + shipping;
    const applyCoupon = (e) => {
        e.preventDefault();
        if (coupon.toUpperCase() === 'RITUAL10') {
            setDiscount(cartTotal * 0.1);
            toast.success('10% discount applied');
        }
        else {
            toast.error('Invalid code');
        }
    };
    return (<div className="bone-section pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)]">— YOUR BAG</p>
        <h1 className="mt-3 text-display text-5xl md:text-7xl">The ritual cart.</h1>

        {cart.length === 0 ? (<div className="mt-20 text-center">
            <p className="text-display text-3xl">Your bag is empty.</p>
            <p className="mt-2 text-[oklch(0.45_0.01_20)]">Begin the ritual.</p>
            <Link to="/shop" className="mt-6 inline-flex btn-blood px-7 py-3 text-grotesk tracking-[0.3em]">ENTER THE SHOP</Link>
          </div>) : (<div className="mt-12 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (<div key={item.product.id + item.size} className="flex gap-5 p-4 border border-black/10 bg-white">
                  <img src={item.product.images[0]} className="h-32 w-28 object-cover" alt=""/>
                  <div className="flex-1">
                    <p className="text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">{item.product.category.toUpperCase()}</p>
                    <Link to={`/product/${item.product.slug}`} className="font-medium hover:text-[oklch(0.48_0.22_25)]">{item.product.name}</Link>
                    <p className="text-sm text-[oklch(0.45_0.01_20)] mt-1">Size {item.size}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-black/15">
                        <button onClick={() => updateQty(item.product.id, item.size, item.qty - 1)} className="h-9 w-9 flex items-center justify-center"><FiMinus /></button>
                        <span className="w-8 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.size, item.qty + 1)} className="h-9 w-9 flex items-center justify-center"><FiPlus /></button>
                      </div>
                      <span className="font-semibold">${item.product.price * item.qty}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id, item.size)} className="self-start text-[oklch(0.45_0.01_20)] hover:text-[oklch(0.48_0.22_25)]"><FiX /></button>
                </div>))}
            </div>
            <aside className="bg-black text-white p-7 h-fit sticky top-32">
              <h3 className="text-display text-2xl">Summary</h3>
              <form onSubmit={applyCoupon} className="mt-5 flex gap-2">
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Promo code (try RITUAL10)" className="flex-1 bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/40"/>
                <button className="px-4 text-grotesk text-xs tracking-[0.25em] bg-[oklch(0.48_0.22_25)]">APPLY</button>
              </form>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd>${cartTotal.toFixed(2)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-[oklch(0.65_0.25_27)]"><dt>Discount</dt><dd>-${discount.toFixed(2)}</dd></div>}
                <div className="flex justify-between"><dt className="text-white/60">Shipping</dt><dd>{shipping === 0 ? 'FREE' : `$${shipping}`}</dd></div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-lg font-semibold"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div>
              </dl>
              <Link to="/checkout" className="mt-6 w-full btn-blood inline-flex items-center justify-center gap-2 py-4 text-grotesk text-sm tracking-[0.3em]">CHECKOUT <FiArrowRight /></Link>
              <p className="mt-4 text-xs text-white/40">Free worldwide shipping on orders over $250.</p>
            </aside>
          </div>)}
      </div>
    </div>);
}
export default Cart;
