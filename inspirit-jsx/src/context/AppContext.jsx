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
  "http://localhost:5000";

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

export function AppProvider({ children }) {

  // ======================
  // STATES
  // ======================
  const [user, setUser] = useState(() =>
    safeGet("inspirit:user", null)
  );

  const [cart, setCart] = useState([]);

  const [wishlist, setWishlist] = useState(() =>
    safeGet("inspirit:wish", [])
  );

  // ======================
  // ADMIN
  // ======================
  const adminEmail =
    import.meta.env.VITE_ADMIN_EMAIL;

  const isAdmin =
    user?.email === adminEmail;

  // ======================
  // SAVE USER
  // ======================
  useEffect(() => {
    localStorage.setItem(
      "inspirit:user",
      JSON.stringify(user)
    );
  }, [user]);

  // ======================
  // SAVE WISHLIST
  // ======================
  useEffect(() => {
    localStorage.setItem(
      "inspirit:wish",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  // ======================
  // FETCH CART
  // ======================
  const fetchCart = async () => {
    try {
      if (!user) return;

      const res = await axios.get(
        `${API}/api/cart`,
        {
          params: {
            email: user.email,
          },
        }
      );

      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // LOAD CART
  // ======================
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  // ======================
  // LOGIN
  // ======================
  const login = (email, name) => {
    const newUser = {
      email,
      name:
        name || email.split("@")[0],
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

    toast("Signed out");
  };

  // ======================
  // ADD TO CART
  // ======================
  const addToCart = async (
    product,
    size =
      product.sizes?.[1] ||
      product.sizes?.[0],
    qty = 1
  ) => {
    try {
      if (!user) {
        return toast.error(
          "Login required"
        );
      }

      await axios.post(
        `${API}/api/cart`,
        {
          userEmail: user.email,

          productId:
            product._id || product.id,

          name: product.name,

          image:
            product.images?.[0] ||
            product.image,

          category: product.category,

          price: product.price,

          size,

          qty,
        }
      );

      fetchCart();

      toast.success(
        `${product.name} added to bag`
      );
    } catch (error) {
      console.log(error);

      toast.error("Failed to add");
    }
  };

  // ======================
  // REMOVE FROM CART
  // ======================
  const removeFromCart = async (
    id
  ) => {
    try {
      await axios.delete(
        `${API}/api/cart/${id}`,
        {
          data: {
            email: user.email,
          },
        }
      );

      fetchCart();

      toast.success("Item removed");
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // UPDATE QTY
  // ======================
  const updateQty = async (
    id,
    qty
  ) => {
    try {
      await axios.put(
        `${API}/api/cart/${id}`,
        {
          qty,
          userEmail: user.email,
        }
      );

      fetchCart();
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

      toast(
        has
          ? "Removed from wishlist"
          : "Saved to wishlist",
        {
          icon: has ? "✕" : "♡",
        }
      );

      return has
        ? prev.filter(
            (x) => x !== id
          )
        : [...prev, id];
    });
  };

  // ======================
  // CART COUNT
  // ======================
  const cartCount = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc + item.qty,
      0
    );
  }, [cart]);

  // ======================
  // CART TOTAL
  // ======================
  const cartTotal = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc +
        item.qty * item.price,
      0
    );
  }, [cart]);

  // ======================
  // PROVIDER
  // ======================
  return (
    <AppCtx.Provider
      value={{
        user,
        isAdmin,

        login,
        logout,

        cart,
        addToCart,
        removeFromCart,
        updateQty,

        cartCount,
        cartTotal,
        fetchCart,

        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

// ======================
// CUSTOM HOOK
// ======================
export const useApp = () => {
  const value =
    useContext(AppCtx);

  if (!value) {
    throw new Error(
      "useApp outside provider"
    );
  }

  return value;
};