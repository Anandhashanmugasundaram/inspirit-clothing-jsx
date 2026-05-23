import logo from '@/assets/inspirit-logo.png';
import { Link } from "react-router-dom";
export default function Logo({ className = '', invert = false }) {
    return (<Link to="/" className={`relative inline-flex items-center ${className}`} aria-label="INSPIRIT Clothing — Home">
      <img src={logo} alt="INSPIRIT Clothing" className={`h-10 md:h-12 w-auto select-none ${invert ? '' : 'mix-blend-screen'}`} style={{ filter: invert ? 'none' : 'contrast(1.1)' }} draggable={false}/>
    </Link>);
}
