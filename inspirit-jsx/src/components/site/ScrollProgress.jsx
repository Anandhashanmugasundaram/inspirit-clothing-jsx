import { useEffect, useState } from 'react';
export default function ScrollProgress() {
    const [p, setP] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const total = h.scrollHeight - h.clientHeight;
            setP(total > 0 ? (h.scrollTop / total) * 100 : 0);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (<div className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-transparent">
      <div className="h-full bg-[oklch(0.55_0.25_27)] transition-[width] duration-150" style={{ width: `${p}%`, boxShadow: '0 0 16px oklch(0.55 0.25 27 / 0.8)' }}/>
    </div>);
}
