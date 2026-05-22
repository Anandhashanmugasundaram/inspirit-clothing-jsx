import { createContext, useContext, useEffect, useMemo, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

const AppCtx = createContext(null);

const API = import.meta.env.VITE_API_URL || "https://inspirit-clothing-jsx.onrender.com";

// ======================
// SAFE LOCAL STORAGE
// ======================
const safeGet = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

// ======================
// PROVIDER
// ======================
export function AppProvider({ children }) {
  // ======================
  // STATES
  // ======================
  const [user, setUser] = useState(() => safeGet("inspirit:user", null));

  const [cart, setCart] = useState([]);

  const [cartLoading, setCartLoading] = useState(true);

  const [wishlist, setWishlist] = useState(() => safeGet("inspirit:wish", []));

  // ======================
  // ADMIN
  // ======================
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  const isAdmin = user?.email === adminEmail;

  // ======================
  // SAVE USER
  // ======================
  useEffect(() => {
    localStorage.setItem("inspirit:user", JSON.stringify(user));
  }, [user]);

  // ======================
  // SAVE WISHLIST
  // ======================
  useEffect(() => {
    localStorage.setItem("inspirit:wish", JSON.stringify(wishlist));
  }, [wishlist]);

  // ======================
  // FETCH CART
  // ======================
  const fetchCart = async () => {
    try {
      if (!user) {
        setCart([]);
        return;
      }

      setCartLoading(true);

      const res = await axios.get(`${API}/api/cart`, {
        params: {
          email: user.email,
        },
      });

      setCart(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setCartLoading(false);
    }
  };

  // ======================
  // LOAD CART
  // ======================
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        setCartLoading(false);
        return;
      }

      await fetchCart();
    };

    loadCart();
  }, [user]);

  // ======================
  // LOGIN
  // ======================
  const login = (email, name) => {
    const newUser = {
      email,
      name: name || email.split("@")[0],
    };

    setUser(newUser);

    if (email === adminEmail) {
      toast.success("Welcome Admin");
    } else {
      toast.success("Welcome to INSPIRIT");
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    setUser(null);

    setCart([]);

    setCartLoading(false);

    toast("Signed out");
  };

  // ======================
  // ADD TO CART
  // ======================
  const addToCart = async (
    product,
    size = product.sizes?.[1] || product.sizes?.[0],
    qty = 1,
  ) => {
    try {
      if (!user) {
        return toast.error("Login required");
      }

      const image = product?.images?.[0]?.url || product?.image || "";

      await axios.post(`${API}/api/cart`, {
        userEmail: user.email,

        productId: product._id || product.id,

        name: product.name,

        image,

        category: product.category,

        price: product.price,

        size,

        qty,
      });

      await fetchCart();

      toast.success(`${product.name} added to bag`);
    } catch (error) {
      console.log(error);

      toast.error("Failed to add");
    }
  };

  // ======================
  // REMOVE FROM CART
  // ======================
  const removeFromCart = async (id) => {
    try {
      await axios.delete(`${API}/api/cart/${id}`, {
        data: {
          email: user.email,
        },
      });

      await fetchCart();

      toast.success("Item removed");
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // CLEAR CART
  // ======================
  const clearCart = async () => {
    try {
      if (!user?.email) return;

      await axios.delete(`${API}/api/cart/clear/${user.email}`);

      setCart([]);

      toast.success("Cart cleared");
    } catch (error) {
      console.log(error);

      toast.error("Failed to clear cart");
    }
  };

  // ======================
  // UPDATE QTY
  // ======================
  const updateQty = async (id, qty) => {
    try {
      await axios.put(`${API}/api/cart/${id}`, {
        qty,
        userEmail: user.email,
      });

      await fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // WISHLIST
  // ======================
  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const has = prev.includes(id);

      toast(has ? "Removed from wishlist" : "Saved to wishlist", {
        icon: has ? "✕" : "♡",
      });

      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  // ======================
  // CART COUNT
  // ======================
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.qty, 0);
  }, [cart]);

  // ======================
  // CART TOTAL
  // ======================
  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  }, [cart]);

  // ======================
  // PROVIDER VALUE
  // ======================
  const value = {
    user,
    isAdmin,

    login,
    logout,

    cart,
    cartLoading,

    addToCart,
    removeFromCart,
    clearCart,
    updateQty,

    cartCount,
    cartTotal,
    fetchCart,

    wishlist,
    toggleWishlist,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// ======================
// CUSTOM HOOK
// ======================
export const useApp = () => {
  const value = useContext(AppCtx);

  if (!value) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return value;
};
