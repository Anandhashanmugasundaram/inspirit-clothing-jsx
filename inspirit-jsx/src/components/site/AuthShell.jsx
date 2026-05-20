import Logo from './Logo';
import { Link } from "react-router-dom";
export default function AuthShell({ title, subtitle, children, foot }) {
    return (<div className="ink-section min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-32">
      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80&auto=format" className="absolute inset-0 h-full w-full object-cover opacity-20 animate-float" alt=""/>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 30%, oklch(0.55 0.25 27 / 0.4), transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.55 0.25 27 / 0.2), transparent 50%)' }}/>
      <div className="relative glass w-full max-w-md rounded-sm p-8 md:p-10">
        <div className="text-center"><Logo /></div>
        <h1 className="mt-8 text-display text-4xl text-white text-center">{title}</h1>
        <p className="mt-2 text-white/60 text-center text-sm">{subtitle}</p>
        <div className="mt-8 space-y-4">{children}</div>
        {foot && <div className="mt-6 text-center text-sm text-white/60">{foot}</div>}
        <div className="mt-8 text-center"><Link to="/" className="text-grotesk text-[10px] tracking-[0.3em] text-white/40 hover:text-white">← BACK TO HOUSE</Link></div>
      </div>
    </div>);
}
export function Field({ label, type = 'text', value, onChange, autoComplete, required = true }) {
    return (<label className="block relative">
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder=" " required={required} autoComplete={autoComplete} className="peer w-full bg-transparent border-b border-white/20 px-1 pt-6 pb-2 text-white outline-none focus:border-[oklch(0.65_0.25_27)] transition"/>
      <span className="absolute left-1 top-1 text-grotesk text-[10px] tracking-[0.3em] text-white/40 transition-all
        peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/40
        peer-focus:top-1 peer-focus:text-[10px] peer-focus:tracking-[0.3em] peer-focus:text-[oklch(0.65_0.25_27)]">{label}</span>
    </label>);
}
