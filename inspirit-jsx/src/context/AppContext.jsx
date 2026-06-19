// // AppContext.jsx

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import axios from "axios";
// import toast from "react-hot-toast";

// const AppCtx = createContext(null);

// const API =
//   import.meta.env.VITE_API_URL ||
//   "https://inspirit-clothing-jsx.onrender.com";

// // ======================
// // SAFE LOCAL STORAGE
// // ======================
// const safeGet = (key, fallback) => {
//   if (typeof window === "undefined") return fallback;
//   try {
//     const value = localStorage.getItem(key);
//     return value ? JSON.parse(value) : fallback;
//   } catch {
//     return fallback;
//   }
// };

// // ======================
// // PROVIDER
// // ======================
// export function AppProvider({ children }) {

//   const [user, setUser] = useState(() => safeGet("inspirit:user", null));
//   const [cart, setCart] = useState([]);
//   const [discount, setDiscount] = useState(0);
//   const [cartLoading, setCartLoading] = useState(true);
//   const [wishlist, setWishlist] = useState(() => safeGet("inspirit:wish", []));

//   const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
//   const isAdmin = user?.email === adminEmail;

//   useEffect(() => {
//     localStorage.setItem("inspirit:user", JSON.stringify(user));
//   }, [user]);

//   useEffect(() => {
//     localStorage.setItem("inspirit:wish", JSON.stringify(wishlist));
//   }, [wishlist]);

//   // ======================
//   // FETCH CART
//   // ======================
//   const fetchCart = async () => {
//     try {
//       if (!user) {
//         setCart([]);
//         return;
//       }
//       const res = await axios.get(`${API}/api/cart`, {
//         params: { email: user.email },
//       });
//       setCart(res.data || []);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setCartLoading(false);
//     }
//   };

//   useEffect(() => {
//     const loadCart = async () => {
//       if (!user) {
//         setCart([]);
//         setCartLoading(false);
//         return;
//       }
//       setCartLoading(true);
//       await fetchCart();
//     };
//     loadCart();
//   }, [user]);

//   // ======================
//   // LOGIN / LOGOUT
//   // ======================
//   const login = (email, name) => {
//     const newUser = { email, name: name || email.split("@")[0] };
//     setUser(newUser);
//     toast.success(email === adminEmail ? "Welcome Admin" : "Welcome to INSPIRIT");
//   };

//   const logout = () => {
//     setUser(null);
//     setCart([]);
//     setCartLoading(false);
//     toast("Signed out");
//   };

//   // ======================
//   // ADD TO CART
//   // ✅ Server validates & decrements stock — we just handle the response
//   // ======================
//   const addToCart = async (product, size, qty = 1) => {
//     try {
//       if (!user) return toast.error("Login required");

//       // Resolve size if not passed
//       const resolvedSize =
//         size || Object.keys(product?.sizes || {})[0] || "";

//       const image =
//         product?.images?.[0]?.url ||
//         product?.image ||
//         "";

//       // ✅ Client-side pre-check using sizes object { S: 2, M: 5 }
//       const sizes = product?.sizes || {};
//       // Mongoose Map serializes to plain object on frontend
//       const clientStock =
//         typeof sizes.get === "function"
//           ? sizes.get(resolvedSize)     // Mongoose Map (shouldn't happen on frontend)
//           : sizes[resolvedSize];        // Plain object (normal case)

//       if (clientStock !== undefined && qty > clientStock) {
//         toast.error(`Only ${clientStock} items available in size ${resolvedSize}`);
//         return;
//       }

//       await axios.post(`${API}/api/cart`, {
//         userEmail: user.email,
//         productId: product._id || product.id,
//         name: product.name,
//         image,
//         category: product.category,
//         price: product.price,
//         size: resolvedSize,
//         qty,
//         stock: clientStock ?? 99,
//       });

//       // ✅ Refresh cart so stock field is up to date from server
//       await fetchCart();

//       toast.success(`${product.name} added to bag`);
//     } catch (error) {
//       // ✅ Show the server's error message (e.g. "Only 2 items available in size S")
//       const msg =
//         error?.response?.data?.message || "Failed to add";
//       toast.error(msg);
//     }
//   };

//   // ======================
//   // REMOVE FROM CART
//   // ✅ Server restores stock on delete
//   // ======================
//   const removeFromCart = async (id) => {
//     try {
//       setCart((prev) => prev.filter((item) => item._id !== id));

//       await axios.delete(`${API}/api/cart/${id}`, {
//         data: { email: user.email },
//       });

//       toast.success("Item removed");
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to remove item");
//       fetchCart();
//     }
//   };

//   // ======================
//   // CLEAR CART
//   // ======================
//   const clearCart = async () => {
//     try {
//       if (!user?.email) return;
//       setCart([]);
//       await axios.delete(`${API}/api/cart/clear/${user.email}`);
//       toast.success("Cart cleared");
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to clear cart");
//       fetchCart();
//     }
//   };

//   // ======================
//   // UPDATE QTY
//   // ✅ Server adjusts stock diff — client clamps optimistically
//   // ======================
//   const updateQty = async (id, qty) => {
//     try {
//       const item = cart.find((i) => i._id === id);
//       const maxQty = item?.stock ?? 99;
//       const safeQty = Math.min(qty, maxQty);

//       if (qty > maxQty) {
//         toast.error(
//           `Only ${maxQty} items available in size ${item?.size || ""}`
//         );
//         if (safeQty === item?.qty) return;
//       }

//       // Optimistic UI update
//       setCart((prev) =>
//         prev.map((i) => (i._id === id ? { ...i, qty: safeQty } : i))
//       );

//       await axios.put(`${API}/api/cart/${id}`, {
//         qty: safeQty,
//         userEmail: user.email,
//       });

//       // ✅ Refresh so stock snapshot stays accurate
//       await fetchCart();
//     } catch (error) {
//       const msg = error?.response?.data?.message || "Failed to update quantity";
//       toast.error(msg);
//       fetchCart();
//     }
//   };

//   // ======================
//   // WISHLIST
//   // ======================
//   const toggleWishlist = (id) => {
//     setWishlist((prev) => {
//       const has = prev.includes(id);
//       toast(has ? "Removed from wishlist" : "Saved to wishlist", {
//         icon: has ? "✕" : "♡",
//       });
//       return has ? prev.filter((x) => x !== id) : [...prev, id];
//     });
//   };

//   const cartCount = useMemo(
//     () => cart.reduce((acc, item) => acc + item.qty, 0),
//     [cart]
//   );

//   const cartTotal = useMemo(
//     () => cart.reduce((acc, item) => acc + item.qty * item.price, 0),
//     [cart]
//   );

//   const value = {
//     user,
//     isAdmin,
//     login,
//     logout,
//     cart,
//     cartLoading,
//     addToCart,
//     removeFromCart,
//     clearCart,
//     updateQty,
//     cartCount,
//     cartTotal,
//     fetchCart,
//     wishlist,
//     toggleWishlist,
//       discount,
//   setDiscount,
//   };

//   return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
// }

// export const useApp = () => {
//   const value = useContext(AppCtx);
//   if (!value) throw new Error("useApp must be used inside AppProvider");
//   return value;
// };

// AppContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

const AppCtx = createContext(null);

const API =
  import.meta.env.VITE_API_URL ||
  "https://inspirit-clothing-jsx-oi4h.vercel.app";

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

// Safari private browsing (and similar restricted-storage contexts) sets
// localStorage quota to 0, so setItem throws QuotaExceededError instead of
// just failing quietly. Without this guard, that throw happens inside a
// useEffect with no error boundary nearby, which crashes the whole app.
const safeSet = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Swallow it — app keeps running, it just won't persist this value.
  }
};

// ======================
// PROVIDER
// ======================
export function AppProvider({ children }) {

  const [user, setUser] = useState(() => safeGet("inspirit:user", null));
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => safeGet("inspirit:wish", []));

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdmin = user?.email === adminEmail;

  useEffect(() => {
    safeSet("inspirit:user", user);
  }, [user]);

  useEffect(() => {
    safeSet("inspirit:wish", wishlist);
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
      const res = await axios.get(`${API}/api/cart`, {
        params: { email: user.email },
      });
      setCart(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        setCartLoading(false);
        return;
      }
      setCartLoading(true);
      await fetchCart();
    };
    loadCart();
  }, [user]);

  // ======================
  // LOGIN / LOGOUT
  // ======================
  const login = (email, name) => {
    const newUser = { email, name: name || email.split("@")[0] };
    setUser(newUser);
    toast.success(email === adminEmail ? "Welcome Admin" : "Welcome to INSPIRIT");
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setCartLoading(false);
    toast("Signed out");
  };

  // ======================
  // ADD TO CART
  // ✅ Server validates & decrements stock — we just handle the response
  // ======================
  const addToCart = async (product, size, qty = 1) => {
    try {
      if (!user) return toast.error("Login required");

      // Resolve size if not passed
      const resolvedSize =
        size || Object.keys(product?.sizes || {})[0] || "";

      const image =
        product?.images?.[0]?.url ||
        product?.image ||
        "";

      // ✅ Client-side pre-check using sizes object { S: 2, M: 5 }
      const sizes = product?.sizes || {};
      // Mongoose Map serializes to plain object on frontend
      const clientStock =
        typeof sizes.get === "function"
          ? sizes.get(resolvedSize)     // Mongoose Map (shouldn't happen on frontend)
          : sizes[resolvedSize];        // Plain object (normal case)

      if (clientStock !== undefined && qty > clientStock) {
        toast.error(`Only ${clientStock} items available in size ${resolvedSize}`);
        return;
      }

      await axios.post(`${API}/api/cart`, {
        userEmail: user.email,
        productId: product._id || product.id,
        name: product.name,
        image,
        category: product.category,
        price: product.price,
        size: resolvedSize,
        qty,
        stock: clientStock ?? 99,
      });

      // ✅ Refresh cart so stock field is up to date from server
      await fetchCart();

      toast.success(`${product.name} added to bag`);
    } catch (error) {
      // ✅ Show the server's error message (e.g. "Only 2 items available in size S")
      const msg =
        error?.response?.data?.message || "Failed to add";
      toast.error(msg);
    }
  };

  // ======================
  // REMOVE FROM CART
  // ✅ Server restores stock on delete
  // ======================
  const removeFromCart = async (id) => {
    try {
      setCart((prev) => prev.filter((item) => item._id !== id));

      await axios.delete(`${API}/api/cart/${id}`, {
        data: { email: user.email },
      });

      toast.success("Item removed");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
      fetchCart();
    }
  };

  // ======================
  // CLEAR CART
  // ======================
  const clearCart = async () => {
    try {
      if (!user?.email) return;
      setCart([]);
      await axios.delete(`${API}/api/cart/clear/${user.email}`);
      toast.success("Cart cleared");
    } catch (error) {
      console.log(error);
      toast.error("Failed to clear cart");
      fetchCart();
    }
  };

  // ======================
  // UPDATE QTY
  // ✅ Server adjusts stock diff — client clamps optimistically
  // ======================
  const updateQty = async (id, qty) => {
    try {
      const item = cart.find((i) => i._id === id);
      const maxQty = item?.stock ?? 99;
      const safeQty = Math.min(qty, maxQty);

      if (qty > maxQty) {
        toast.error(
          `Only ${maxQty} items available in size ${item?.size || ""}`
        );
        if (safeQty === item?.qty) return;
      }

      // Optimistic UI update
      setCart((prev) =>
        prev.map((i) => (i._id === id ? { ...i, qty: safeQty } : i))
      );

      await axios.put(`${API}/api/cart/${id}`, {
        qty: safeQty,
        userEmail: user.email,
      });

      // ✅ Refresh so stock snapshot stays accurate
      await fetchCart();
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update quantity";
      toast.error(msg);
      fetchCart();
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

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty * item.price, 0),
    [cart]
  );

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
      discount,
  setDiscount,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => {
  const value = useContext(AppCtx);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
};