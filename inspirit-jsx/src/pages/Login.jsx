import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaApple } from 'react-icons/fa';
import AuthShell, { Field } from '@/components/site/AuthShell';
import { useApp } from '@/context/AppContext';
({ component: Login,
    head: () => ({ meta: [{ title: 'Sign In — INSPIRIT' }] }),
});
function Login() {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [show, setShow] = useState(false);
    const { login } = useApp();
    const nav = useNavigate();
    return (<AuthShell title="Re-enter the ritual." subtitle="Sign in to continue." foot={<>No account? <Link to="/register" className="text-[oklch(0.65_0.25_27)] hover:underline">Begin the rite</Link></>}>
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); login(email); nav('/account'); }}>
        <Field label="EMAIL" type="email" value={email} onChange={setEmail} autoComplete="email"/>
        <div className="relative">
          <Field label="PASSWORD" type={show ? 'text' : 'password'} value={pw} onChange={setPw} autoComplete="current-password"/>
          <button type="button" onClick={() => setShow(!show)} className="absolute right-1 top-6 text-white/50 hover:text-white">{show ? <FiEyeOff /> : <FiEye />}</button>
        </div>
        <div className="flex justify-between text-xs">
          <label className="text-white/60 flex items-center gap-2"><input type="checkbox"/> Remember me</label>
          <Link to="/forgot" className="text-[oklch(0.65_0.25_27)] hover:underline">Forgot?</Link>
        </div>
        <button className="w-full btn-blood py-4 text-grotesk text-sm tracking-[0.3em]">SIGN IN</button>
      </form>
      <div className="my-6 flex items-center gap-4 text-white/30 text-xs"><div className="h-px flex-1 bg-white/10"/>OR<div className="h-px flex-1 bg-white/10"/></div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => { login('google.user@inspirit.clothing'); nav('/account'); }} className="glass py-3 flex items-center justify-center gap-2 text-white text-sm"><FaGoogle /> Google</button>
        <button onClick={() => { login('apple.user@inspirit.clothing'); nav('/account'); }} className="glass py-3 flex items-center justify-center gap-2 text-white text-sm"><FaApple /> Apple</button>
      </div>
    </AuthShell>);
}
export default Login;
