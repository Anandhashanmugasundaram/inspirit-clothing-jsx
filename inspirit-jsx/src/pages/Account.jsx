import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";

import { FiUser, FiPackage, FiLogOut } from "react-icons/fi";

import { useApp } from "@/context/AppContext";

const TABS = [
  {
    k: "profile",
    l: "Profile",
    i: FiUser,
  },
  {
    k: "orders",
    l: "Orders",
    i: FiPackage,
  },
];

function Account() {
  const { user, logout } = useApp();

  const [tab, setTab] = useState("profile");

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ======================
  // FETCH ORDERS
  // ======================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.email) return;

        const res = await axios.get(`${API}/api/orders/${user.email}`);

        setOrders(res.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // ======================
  // STATUS COLORS
  // ======================
const statusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500 text-black";

    case "Processing":
      return "bg-orange-500 text-white";

    case "Shipped":
      return "bg-blue-600 text-white";

    case "Delivered":
      return "bg-green-600 text-white";

    default:
      return "bg-black text-white";
  }
};

  if (!user) return <Navigate to="/register" replace />;

  return (
    <div className="bone-section pt-32 md:pt-40 pb-24 min-h-screen bg-white">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {/* HEADING */}
        <p className="text-grotesk text-xs tracking-[0.4em] text-red-700">
          — WELCOME BACK
        </p>

        <h1 className="mt-3 text-5xl md:text-7xl font-black">
          Hello, <em className="not-italic text-red-700">{user.name}.</em>
        </h1>

        <div className="mt-12 grid lg:grid-cols-[260px_1fr] gap-10">
          {/* SIDEBAR */}
          <aside className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm tracking-[0.2em] transition rounded-xl ${
                  tab === t.k ? "bg-black text-white" : "hover:bg-black/5"
                }`}
              >
                <t.i />
                {t.l.toUpperCase()}
              </button>
            ))}

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm tracking-[0.2em] text-red-700 hover:bg-red-700 hover:text-white transition rounded-xl"
            >
              <FiLogOut />
              SIGN OUT
            </button>
          </aside>

          {/* CONTENT */}
          <section>
            {/* PROFILE */}
            {tab === "profile" && (
              <div className="space-y-8 max-w-lg">
                <h2 className="text-3xl font-black">Your details</h2>

                <div>
                  <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">
                    Name
                  </p>

                  <p className="text-3xl font-semibold mt-2">{user.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">
                    Email
                  </p>

                  <p className="text-2xl font-medium mt-2 break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {tab === "orders" && (
              <div>
                <h2 className="text-3xl font-black mb-8">Your Orders</h2>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="border rounded-3xl p-12 text-center">
                    <FiPackage size={40} className="mx-auto text-gray-400" />

                    <h3 className="mt-5 text-2xl font-bold">No Orders Yet</h3>

                    <p className="mt-2 text-gray-500">
                      Your placed orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border rounded-3xl overflow-hidden"
                      >
                        {/* TOP */}
                        <div className="p-6 border-b bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">
                              Order ID
                            </p>

                            <p className="font-semibold mt-1">{order._id}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">
                              Ordered Date
                            </p>

                            <p className="font-medium mt-1">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">
                              Total
                            </p>

                            <p className="font-black text-2xl mt-1">
                              ₹{order.total?.toFixed(2)}
                            </p>
                          </div>

                          <span
                            className={`px-4 py-2 text-xs tracking-[0.25em] rounded-full w-fit ${statusStyle(
                              order.status,
                            )}`}
                          >
                            {order.status?.toUpperCase()}
                          </span>
                        </div>

                        {/* ITEMS */}
                        <div className="p-6 space-y-5">
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col md:flex-row gap-5 border rounded-2xl p-4"
                            >
                              {/* IMAGE */}
                              <img
                                src={item.image || "/placeholder.png"}
                                alt={item.name}
                                className="w-full md:w-32 h-40 rounded-2xl object-cover bg-gray-100"
                              />

                              {/* INFO */}
                              <div className="flex-1">
                                <h3 className="text-2xl font-bold">
                                  {item.name}
                                </h3>

                                <div className="mt-4 flex flex-wrap gap-4">
                                  <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm">
                                    Qty:
                                    <span className="font-semibold ml-1">
                                      {item.qty}
                                    </span>
                                  </div>

                                  <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm">
                                    Price:
                                    <span className="font-semibold ml-1">
                                      ₹{item.price}
                                    </span>
                                  </div>

                                  <div className="bg-black text-white px-4 py-2 rounded-xl text-sm">
                                    Total:
                                    <span className="font-semibold ml-1">
                                      ₹{item.total?.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Account;
