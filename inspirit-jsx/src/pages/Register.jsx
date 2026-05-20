import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import AuthShell, { Field } from '@/components/site/AuthShell';
import { useApp } from '@/context/AppContext';
({ component: Register,
    head: () => ({ meta: [{ title: 'Join — INSPIRIT' }] }),
});
function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [show, setShow] = useState(false);
    const { login } = useApp();
    const nav = useNavigate();
    return (<AuthShell title="Join the house." subtitle="Create your account." foot={<>Already in? <Link to="/login" className="text-[oklch(0.65_0.25_27)] hover:underline">Sign in</Link></>}>
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); login(email, name); nav('/account'); }}>
        <Field label="NAME" value={name} onChange={setName} autoComplete="name"/>
        <Field label="EMAIL" type="email" value={email} onChange={setEmail} autoComplete="email"/>
        <div className="relative">
          <Field label="PASSWORD" type={show ? 'text' : 'password'} value={pw} onChange={setPw} autoComplete="new-password"/>
          <button type="button" onClick={() => setShow(!show)} className="absolute right-1 top-6 text-white/50 hover:text-white">{show ? <FiEyeOff /> : <FiEye />}</button>
        </div>
        <button className="w-full btn-blood py-4 text-grotesk text-sm tracking-[0.3em]">CREATE ACCOUNT</button>
      </form>
    </AuthShell>);
}
export default Register;
