import { useMemo, useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '@/components/site/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/products';
({
    component: Shop,
    head: () => ({ meta: [{ title: 'Shop — INSPIRIT Clothing' }, { name: 'description', content: 'Browse the full INSPIRIT collection: jerseys, shirts, t-shirts and pants.' }] }),
});
function Shop() {
    const [cat, setCat] = useState('All');
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('latest');
    const [open, setOpen] = useState(false);
    const filtered = useMemo(() => {
        let list = PRODUCTS.filter(p => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
        if (sort === 'price-asc')
            list = [...list].sort((a, b) => a.price - b.price);
        if (sort === 'price-desc')
            list = [...list].sort((a, b) => b.price - a.price);
        if (sort === 'popular')
            list = [...list].sort((a, b) => b.reviews - a.reviews);
        return list;
    }, [cat, q, sort]);
    return (<div className="bone-section pt-32 md:pt-40 pb-24">
      {/* Header */}
      <section className="ink-section pb-20 md:pb-28 -mt-32 md:-mt-40 pt-44 md:pt-56 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(ellipse at 20% 100%, oklch(0.55 0.25 27 / 0.5), transparent 60%)' }}/>
        <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
          <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)]">— THE COLLECTION</p>
          <h1 className="mt-4 text-display text-6xl md:text-[8rem] leading-[0.9] text-white">Shop the<br /><em className="text-[oklch(0.65_0.25_27)] not-italic">canon.</em></h1>
          <p className="mt-6 max-w-xl text-white/60">Every piece, every silhouette, every chapter. {PRODUCTS.length} ritual garments.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 md:px-10 mt-12">
        {/* Filter bar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 border-y border-black/10 py-5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
            {['All', ...CATEGORIES.map(c => c.key)].map((c) => (<button key={c} onClick={() => setCat(c)} className={`shrink-0 text-grotesk text-xs tracking-[0.25em] px-4 py-2 rounded-full border transition ${cat === c ? 'bg-black text-white border-black' : 'border-black/15 hover:border-black'}`}>
                {String(c).toUpperCase()}
              </button>))}
          </div>
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"/>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pieces…" className="w-full pl-11 pr-4 py-3 bg-[oklch(0.94_0.005_60)] outline-none rounded-sm focus:bg-white border border-transparent focus:border-black/20"/>
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-grotesk text-xs tracking-[0.25em] py-3 px-4 bg-[oklch(0.94_0.005_60)] rounded-sm border border-transparent focus:border-black/20 outline-none">
              <option value="latest">LATEST</option>
              <option value="popular">POPULAR</option>
              <option value="price-asc">PRICE ↑</option>
              <option value="price-desc">PRICE ↓</option>
            </select>
            <button onClick={() => setOpen(true)} className="md:hidden inline-flex items-center gap-2 px-4 py-3 border border-black/15 rounded-sm">
              <FiFilter /> <span className="text-grotesk text-xs tracking-[0.25em]">FILTERS</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
          {filtered.map(p => <ProductCard key={p.id} p={p}/>)}
        </div>
        {filtered.length === 0 && (<div className="py-24 text-center">
            <p className="text-display text-3xl">Nothing in this corner.</p>
            <p className="mt-2 text-[oklch(0.45_0.01_20)]">Try clearing your filters.</p>
            <button onClick={() => { setCat('All'); setQ(''); }} className="mt-6 btn-blood px-6 py-3 text-grotesk tracking-[0.25em]">RESET</button>
          </div>)}
      </div>

      {/* Mobile filter sheet */}
      {open && (<div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)}/>
          <div className="absolute bottom-0 inset-x-0 bg-white p-6 rounded-t-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-display text-2xl">Filters</h3>
              <button onClick={() => setOpen(false)}><FiX /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['All', ...CATEGORIES.map(c => c.key)].map(c => (<button key={c} onClick={() => { setCat(c); setOpen(false); }} className={`py-3 rounded-sm border text-grotesk text-xs tracking-[0.25em] ${cat === c ? 'bg-black text-white' : 'border-black/15'}`}>
                  {String(c).toUpperCase()}
                </button>))}
            </div>
          </div>
        </div>)}
    </div>);
}
export default Shop;
