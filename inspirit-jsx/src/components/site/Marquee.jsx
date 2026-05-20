import { GiFlame } from 'react-icons/gi';
export default function Marquee({ items, variant = 'dark' }) {
    const row = [...items, ...items, ...items];
    return (<div className={`overflow-hidden border-y ${variant === 'red' ? 'bg-[oklch(0.48_0.22_25)] border-white/15 text-white' : 'bg-black border-white/10 text-white'} py-5`}>
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {row.map((t, i) => (<span key={i} className="text-grotesk text-3xl md:text-5xl tracking-[0.15em] flex items-center gap-12">
            {t}
            <GiFlame className="text-[oklch(0.65_0.25_27)] text-2xl"/>
          </span>))}
      </div>
    </div>);
}
