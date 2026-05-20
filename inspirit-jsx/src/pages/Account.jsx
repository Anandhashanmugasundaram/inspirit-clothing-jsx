import { Link } from "react-router-dom";
import { useState } from 'react';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';
import { useApp } from '@/context/AppContext';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/site/ProductCard';
({ component: Account,
    head: () => ({ meta: [{ title: 'Account — INSPIRIT' }] }),
});
const TABS = [
    { k: 'profile', l: 'Profile', i: FiUser },
    { k: 'orders', l: 'Orders', i: FiPackage },
    { k: 'wishlist', l: 'Wishlist', i: FiHeart },
    { k: 'addresses', l: 'Addresses', i: FiMapPin },
    { k: 'settings', l: 'Settings', i: FiSettings },
];
function Account() {
    const { user, logout, wishlist } = useApp();
    const [tab, setTab] = useState('profile');
    if (!user)
        return <Navigate to="/login"/>;
    const wishProducts = PRODUCTS.filter(p => wishlist.includes(p.id));
    return (<div className="bone-section pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)]">— WELCOME BACK</p>
        <h1 className="mt-3 text-display text-5xl md:text-7xl">Hello, <em className="not-italic text-[oklch(0.48_0.22_25)]">{user.name}.</em></h1>

        <div className="mt-12 grid lg:grid-cols-[260px_1fr] gap-10">
          <aside className="space-y-1">
            {TABS.map(t => (<button key={t.k} onClick={() => setTab(t.k)} className={`w-full flex items-center gap-3 px-4 py-3 text-grotesk text-sm tracking-[0.2em] transition ${tab === t.k ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
                <t.i /> {t.l.toUpperCase()}
              </button>))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-grotesk text-sm tracking-[0.2em] text-[oklch(0.48_0.22_25)] hover:bg-[oklch(0.48_0.22_25)] hover:text-white transition">
              <FiLogOut /> SIGN OUT
            </button>
          </aside>

          <section>
            {tab === 'profile' && (<div className="space-y-5 max-w-lg">
                <h2 className="text-display text-3xl">Your details</h2>
                <input defaultValue={user.name} className="w-full px-4 py-3 border border-black/15"/>
                <input defaultValue={user.email} className="w-full px-4 py-3 border border-black/15"/>
                <button className="btn-blood px-6 py-3 text-grotesk text-sm tracking-[0.3em]">SAVE</button>
              </div>)}
            {tab === 'orders' && (<div>
                <h2 className="text-display text-3xl mb-6">Recent orders</h2>
                {[
                { id: 'INSP-2026-0042', date: 'May 12, 2026', total: '$348', status: 'Delivered' },
                { id: 'INSP-2026-0019', date: 'Apr 02, 2026', total: '$189', status: 'Delivered' },
            ].map(o => (<div key={o.id} className="flex items-center justify-between p-5 border border-black/10 mb-3">
                    <div>
                      <p className="font-medium">{o.id}</p>
                      <p className="text-sm text-[oklch(0.45_0.01_20)]">{o.date}</p>
                    </div>
                    <span className="text-grotesk text-xs tracking-[0.3em] bg-black text-white px-3 py-1">{o.status.toUpperCase()}</span>
                    <span className="font-semibold">{o.total}</span>
                  </div>))}
              </div>)}
            {tab === 'wishlist' && (<div>
                <h2 className="text-display text-3xl mb-6">Saved pieces ({wishProducts.length})</h2>
                {wishProducts.length === 0 ? (<p className="text-[oklch(0.45_0.01_20)]">Nothing saved yet. <Link to="/shop" className="underline">Browse the canon</Link>.</p>) : (<div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                    {wishProducts.map(p => <ProductCard key={p.id} p={p}/>)}
                  </div>)}
              </div>)}
            {tab === 'addresses' && (<div>
                <h2 className="text-display text-3xl mb-6">Saved addresses</h2>
                <div className="p-5 border border-black/10">
                  <p className="font-medium">Home</p>
                  <p className="text-sm text-[oklch(0.45_0.01_20)] mt-1">Rua das Janelas Verdes 47 · Lisbon · Portugal</p>
                </div>
              </div>)}
            {tab === 'settings' && (<div className="space-y-4 max-w-lg">
                <h2 className="text-display text-3xl">Settings</h2>
                <label className="flex justify-between p-4 border border-black/10"><span>Drop alerts</span><input type="checkbox" defaultChecked/></label>
                <label className="flex justify-between p-4 border border-black/10"><span>Marketing emails</span><input type="checkbox"/></label>
                <label className="flex justify-between p-4 border border-black/10"><span>Order updates</span><input type="checkbox" defaultChecked/></label>
              </div>)}
          </section>
        </div>
      </div>
    </div>);
}
export default Account;
