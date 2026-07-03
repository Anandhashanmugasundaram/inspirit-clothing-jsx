

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
//   "https://inspirit-clothing-jsx-oi4h.vercel.app";

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

// // Safari private browsing (and similar restricted-storage contexts) sets
// // localStorage quota to 0, so setItem throws QuotaExceededError instead of
// // just failing quietly. Without this guard, that throw happens inside a
// // useEffect with no error boundary nearby, which crashes the whole app.
// const safeSet = (key, value) => {
//   if (typeof window === "undefined") return;
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch {
//     // Swallow it — app keeps running, it just won't persist this value.
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
//     safeSet("inspirit:user", user);
//   }, [user]);

//   useEffect(() => {
//     safeSet("inspirit:wish", wishlist);
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
  if (typeof window === "undefined") {
    console.log("[AppContext] safeGet: window undefined (SSR?), returning fallback for", key);
    return fallback;
  }
  try {
    const value = localStorage.getItem(key);
    console.log("[AppContext] safeGet OK:", key, "->", value);
    return value ? JSON.parse(value) : fallback;
  } catch (err) {
    // This is the classic Safari Private Browsing failure mode:
    // getItem/JSON.parse can throw (QuotaExceededError / SecurityError)
    console.error("[AppContext] safeGet FAILED for key:", key, err);
    return fallback;
  }
};

// Safari private browsing (and similar restricted-storage contexts) sets
// localStorage quota to 0, so setItem throws QuotaExceededError instead of
// just failing quietly. Without this guard, that throw happens inside a
// useEffect with no error boundary nearby, which crashes the whole app.
const safeSet = (key, value) => {
  if (typeof window === "undefined") {
    console.log("[AppContext] safeSet: window undefined (SSR?), skipping", key);
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log("[AppContext] safeSet OK:", key);
  } catch (err) {
    // Swallow it — app keeps running, it just won't persist this value.
    console.error(
      "[AppContext] safeSet FAILED (likely Safari private mode / quota) for key:",
      key,
      err
    );
  }
};

// ======================
// PROVIDER
// ======================
export function AppProvider({ children }) {
  console.log("[AppContext] ---- AppProvider render start ----");

  const [user, setUser] = useState(() => {
    console.log("[AppContext] initializing user state from storage");
    const initial = safeGet("inspirit:user", null);
    console.log("[AppContext] initial user value", initial);
    return initial;
  });
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    console.log("[AppContext] initializing wishlist state from storage");
    const initial = safeGet("inspirit:wish", []);
    console.log("[AppContext] initial wishlist value", initial);
    return initial;
  });

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdmin = user?.email === adminEmail;

  console.log("[AppContext] render values", {
    user,
    isAdmin,
    cartLength: cart.length,
    cartLoading,
    wishlistLength: wishlist.length,
  });

  useEffect(() => {
    console.log("[AppContext] user effect firing, persisting user:", user);
    safeSet("inspirit:user", user);
  }, [user]);

  useEffect(() => {
    console.log("[AppContext] wishlist effect firing, persisting wishlist:", wishlist);
    safeSet("inspirit:wish", wishlist);
  }, [wishlist]);

  // ======================
  // FETCH CART
  // ======================
  const fetchCart = async () => {
    console.log("[AppContext] fetchCart() called, user =", user);
    try {
      if (!user) {
        console.log("[AppContext] fetchCart: no user, clearing cart");
        setCart([]);
        return;
      }
      console.log("[AppContext] fetchCart: requesting", `${API}/api/cart`, { email: user.email });
      const res = await axios.get(`${API}/api/cart`, {
        params: { email: user.email },
      });
      console.log("[AppContext] fetchCart: success, items =", res.data?.length);
      setCart(res.data || []);
    } catch (error) {
      console.error("[AppContext] fetchCart FAILED", error);
    } finally {
      setCartLoading(false);
      console.log("[AppContext] fetchCart: cartLoading set false");
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      console.log("[AppContext] loadCart effect firing, user =", user);
      if (!user) {
        setCart([]);
        setCartLoading(false);
        console.log("[AppContext] loadCart: no user, skipping fetch");
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
    console.log("[AppContext] login() called", { email, name });
    const newUser = { email, name: name || email.split("@")[0] };
    setUser(newUser);
    toast.success(email === adminEmail ? "Welcome Admin" : "Welcome to INSPIRIT");
  };

  const logout = () => {
    console.log("[AppContext] logout() called");
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
    console.log("[AppContext] addToCart() called", { product, size, qty });
    try {
      if (!user) {
        console.warn("[AppContext] addToCart: no user logged in");
        return toast.error("Login required");
      }

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

      console.log("[AppContext] addToCart: resolved", { resolvedSize, clientStock });

      if (clientStock !== undefined && qty > clientStock) {
        console.warn("[AppContext] addToCart: insufficient stock", { clientStock, qty });
        toast.error(`Only ${clientStock} items available in size ${resolvedSize}`);
        return;
      }

      console.log("[AppContext] addToCart: posting to", `${API}/api/cart`);
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
      console.log("[AppContext] addToCart: POST success");

      // ✅ Refresh cart so stock field is up to date from server
      await fetchCart();

      toast.success(`${product.name} added to bag`);
    } catch (error) {
      // ✅ Show the server's error message (e.g. "Only 2 items available in size S")
      console.error("[AppContext] addToCart FAILED", error);
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
    console.log("[AppContext] removeFromCart() called", id);
    try {
      setCart((prev) => prev.filter((item) => item._id !== id));

      await axios.delete(`${API}/api/cart/${id}`, {
        data: { email: user.email },
      });
      console.log("[AppContext] removeFromCart: DELETE success");

      toast.success("Item removed");
    } catch (error) {
      console.error("[AppContext] removeFromCart FAILED", error);
      toast.error("Failed to remove item");
      fetchCart();
    }
  };

  // ======================
  // CLEAR CART
  // ======================
  const clearCart = async () => {
    console.log("[AppContext] clearCart() called", user?.email);
    try {
      if (!user?.email) {
        console.warn("[AppContext] clearCart: no user email, aborting");
        return;
      }
      setCart([]);
      await axios.delete(`${API}/api/cart/clear/${user.email}`);
      console.log("[AppContext] clearCart: DELETE success");
      toast.success("Cart cleared");
    } catch (error) {
      console.error("[AppContext] clearCart FAILED", error);
      toast.error("Failed to clear cart");
      fetchCart();
    }
  };

  // ======================
  // UPDATE QTY
  // ✅ Server adjusts stock diff — client clamps optimistically
  // ======================
  const updateQty = async (id, qty) => {
    console.log("[AppContext] updateQty() called", { id, qty });
    try {
      const item = cart.find((i) => i._id === id);
      const maxQty = item?.stock ?? 99;
      const safeQty = Math.min(qty, maxQty);

      console.log("[AppContext] updateQty: computed", { maxQty, safeQty });

      if (qty > maxQty) {
        console.warn("[AppContext] updateQty: qty exceeds maxQty");
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
      console.log("[AppContext] updateQty: PUT success");

      // ✅ Refresh so stock snapshot stays accurate
      await fetchCart();
    } catch (error) {
      console.error("[AppContext] updateQty FAILED", error);
      const msg = error?.response?.data?.message || "Failed to update quantity";
      toast.error(msg);
      fetchCart();
    }
  };

  // ======================
  // WISHLIST
  // ======================
  const toggleWishlist = (id) => {
    console.log("[AppContext] toggleWishlist() called", id);
    setWishlist((prev) => {
      const has = prev.includes(id);
      toast(has ? "Removed from wishlist" : "Saved to wishlist", {
        icon: has ? "✕" : "♡",
      });
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const cartCount = useMemo(() => {
    const result = cart.reduce((acc, item) => acc + item.qty, 0);
    console.log("[AppContext] cartCount recomputed", result);
    return result;
  }, [cart]);

  const cartTotal = useMemo(() => {
    const result = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
    console.log("[AppContext] cartTotal recomputed", result);
    return result;
  }, [cart]);

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

  console.log("[AppContext] ---- AppProvider render complete ----");

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => {
  const value = useContext(AppCtx);
  if (!value) {
    console.error("[AppContext] useApp() called outside AppProvider!");
    throw new Error("useApp must be used inside AppProvider");
  }
  return value;
};