import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
const AppCtx = createContext(null);
const safeGet = (k, fallback) => {
    if (typeof window === 'undefined')
        return fallback;
    try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : fallback;
    }
    catch {
        return fallback;
    }
};
export function AppProvider({ children }) {
    const [cart, setCart] = useState(() => safeGet('inspirit:cart', []));
    const [wishlist, setWishlist] = useState(() => safeGet('inspirit:wish', []));
    const [user, setUser] = useState(() => safeGet('inspirit:user', null));
    useEffect(() => { localStorage.setItem('inspirit:cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('inspirit:wish', JSON.stringify(wishlist)); }, [wishlist]);
    useEffect(() => { localStorage.setItem('inspirit:user', JSON.stringify(user)); }, [user]);
    const addToCart = (p, size = p.sizes[1] || p.sizes[0], qty = 1) => {
        setCart(prev => {
            const i = prev.findIndex(c => c.product.id === p.id && c.size === size);
            if (i >= 0) {
                const next = [...prev];
                next[i] = { ...next[i], qty: next[i].qty + qty };
                return next;
            }
            return [...prev, { product: p, size, qty }];
        });
        toast.success(`${p.name} added to bag`);
    };
    const removeFromCart = (id, size) => setCart(prev => prev.filter(c => !(c.product.id === id && c.size === size)));
    const updateQty = (id, size, qty) => setCart(prev => prev.map(c => (c.product.id === id && c.size === size ? { ...c, qty: Math.max(1, qty) } : c)));
    const toggleWishlist = (id) => {
        setWishlist(prev => {
            const has = prev.includes(id);
            toast(has ? 'Removed from wishlist' : 'Saved to wishlist', { icon: has ? '✕' : '♡' });
            return has ? prev.filter(x => x !== id) : [...prev, id];
        });
    };
    const login = (email, name) => {
        setUser({ email, name: name || email.split('@')[0] });
        toast.success('Welcome to INSPIRIT');
    };
    const logout = () => { setUser(null); toast('Signed out'); };
    const cartCount = useMemo(() => cart.reduce((a, c) => a + c.qty, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((a, c) => a + c.qty * c.product.price, 0), [cart]);
    return (<AppCtx.Provider value={{ cart, addToCart, removeFromCart, updateQty, cartCount, cartTotal, wishlist, toggleWishlist, user, login, logout }}>
      {children}
    </AppCtx.Provider>);
}
export const useApp = () => {
    const v = useContext(AppCtx);
    if (!v)
        throw new Error('useApp outside provider');
    return v;
};
