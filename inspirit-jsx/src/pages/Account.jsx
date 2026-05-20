import { Navigate } from "react-router-dom";
import { useState } from "react";
import { FiUser, FiPackage, FiLogOut } from "react-icons/fi";
import { useApp } from "@/context/AppContext";

const TABS = [
  { k: "profile", l: "Profile", i: FiUser },
  { k: "orders", l: "Orders", i: FiPackage },
];

function Account() {
  const { user, logout } = useApp();
  const [tab, setTab] = useState("profile");

  if (!user) return <Navigate to="/register" replace />;

  return (
    <div className="bone-section pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)]">
          — WELCOME BACK
        </p>

        <h1 className="mt-3 text-display text-5xl md:text-7xl">
          Hello,{" "}
          <em className="not-italic text-[oklch(0.48_0.22_25)]">
            {user.name}.
          </em>
        </h1>

        <div className="mt-12 grid lg:grid-cols-[260px_1fr] gap-10">
          {/* SIDEBAR */}
          <aside className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-grotesk text-sm tracking-[0.2em] transition ${
                  tab === t.k ? "bg-black text-white" : "hover:bg-black/5"
                }`}
              >
                <t.i /> {t.l.toUpperCase()}
              </button>
            ))}

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-grotesk text-sm tracking-[0.2em] text-[oklch(0.48_0.22_25)] hover:bg-[oklch(0.48_0.22_25)] hover:text-white transition"
            >
              <FiLogOut /> SIGN OUT
            </button>
          </aside>

          {/* CONTENT */}
          <section>
            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div className="space-y-8 max-w-lg">
                <h2 className="text-display text-3xl">Your details</h2>

                <div>
                  <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">
                    Name
                  </p>
                  <p className="text-3xl font-semibold mt-2">
                    {user.name}
                  </p>
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

            {/* ORDERS TAB */}
            {tab === "orders" && (
              <div>
                <h2 className="text-display text-3xl mb-6">
                  Recent orders
                </h2>

                {[
                  {
                    id: "INSP-2026-0042",
                    date: "May 12, 2026",
                    total: "$348",
                    status: "Delivered",
                  },
                  {
                    id: "INSP-2026-0019",
                    date: "Apr 02, 2026",
                    total: "$189",
                    status: "Delivered",
                  },
                ].map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between p-5 border border-black/10 mb-3"
                  >
                    <div>
                      <p className="font-medium">{o.id}</p>
                      <p className="text-sm text-[oklch(0.45_0.01_20)]">
                        {o.date}
                      </p>
                    </div>

                    <span className="text-grotesk text-xs tracking-[0.3em] bg-black text-white px-3 py-1">
                      {o.status.toUpperCase()}
                    </span>

                    <span className="font-semibold">{o.total}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Account;