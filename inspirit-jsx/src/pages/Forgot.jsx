import { Link } from "react-router-dom";
import { useState } from 'react';
import AuthShell, { Field } from '@/components/site/AuthShell';
import toast from 'react-hot-toast';
({ component: Forgot,
    head: () => ({ meta: [{ title: 'Reset Password — INSPIRIT' }] }),
});
function Forgot() {
    const [email, setEmail] = useState('');
    return (<AuthShell title="Lost the key?" subtitle="We'll send a recovery link." foot={<><Link to="/login" className="text-[oklch(0.65_0.25_27)] hover:underline">← Back to sign in</Link></>}>
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); toast.success('Recovery link sent'); }}>
        <Field label="EMAIL" type="email" value={email} onChange={setEmail}/>
        <button className="w-full btn-blood py-4 text-grotesk text-sm tracking-[0.3em]">SEND LINK</button>
      </form>
    </AuthShell>);
}
export default Forgot;
