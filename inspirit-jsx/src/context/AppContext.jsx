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

// SAFE LOCALSTORAGE GET
const safeGet = (key, fallback) => {

  if (typeof window === "undefined") {
    return fallback;
  }

  try {

    const value = localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;

  } catch {

    return fallback;

  }
};

export function AppProvider({ children }) {

  // STATES
  const [cart, setCart] = useState([]);

  const [wishlist, setWishlist] = useState(() =>
    safeGet("inspirit:wish", [])
  );

  const [user, setUser] = useState(() =>
    safeGet("inspirit:user", null)
  );

  // SAVE WISHLIST
  useEffect(() => {

    localStorage.setItem(
      "inspirit:wish",
      JSON.stringify(wishlist)
    );

  }, [wishlist]);

  // SAVE USER
  useEffect(() => {

    localStorage.setItem(
      "inspirit:user",
      JSON.stringify(user)
    );

  }, [user]);

  // FETCH CART
  const fetchCart = async () => {

    try {

      const res = await axios.get(
        `${API}/api/cart`
      );

      setCart(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // LOAD CART
  useEffect(() => {

    fetchCart();

  }, []);

  // ADD TO CART
  const addToCart = async (
    product,
    size =
      product.sizes?.[1] ||
      product.sizes?.[0],
    qty = 1
  ) => {

    try {

      await axios.post(
        `${API}/api/cart`,
        {
          productId:
            product._id || product.id,

          name: product.name,

          image:
            product.images?.[0] ||
            product.image,

          category:
            product.category,

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

      toast.error("Failed To Add");

    }
  };

  // REMOVE FROM CART
  const removeFromCart = async (id) => {

    try {

      await axios.delete(
        `${API}/api/cart/${id}`
      );

      fetchCart();

      toast.success("Item Removed");

    } catch (error) {

      console.log(error);

    }
  };

  // UPDATE QTY
  const updateQty = async (
    id,
    qty
  ) => {

    try {

      await axios.put(
        `${API}/api/cart/${id}`,
        { qty }
      );

      fetchCart();

    } catch (error) {

      console.log(error);

    }
  };

  // TOGGLE WISHLIST
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
        ? prev.filter((x) => x !== id)
        : [...prev, id];
    });
  };

  // LOGIN
  const login = (email, name) => {

    setUser({
      email,
      name:
        name ||
        email.split("@")[0],
    });

    toast.success(
      "Welcome to INSPIRIT"
    );
  };

  // LOGOUT
  const logout = () => {

    setUser(null);

    toast("Signed out");
  };

  // TOTAL COUNT
  const cartCount = useMemo(() => {

    return cart.reduce(
      (acc, item) =>
        acc + item.qty,
      0
    );

  }, [cart]);

  // TOTAL PRICE
  const cartTotal = useMemo(() => {

    return cart.reduce(
      (acc, item) =>
        acc +
        item.qty * item.price,
      0
    );

  }, [cart]);

  return (

    <AppCtx.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        user,
        login,
        logout,
        fetchCart,
      }}
    >

      {children}

    </AppCtx.Provider>
  );
}

// CUSTOM HOOK
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