import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Activity,
  BarChart3,
  Settings,
  Plus,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Monitors", path: "/dashboard", icon: Activity },
  { name: "Add monitor", path: "/add", icon: Plus },
  { name: "Analytics", path: "/dashboard", icon: BarChart3 },
  { name: "Settings", path: "/profile", icon: Settings },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    setOpen(false);
    navigate("/signin");
  };

  const linkIsActive = (item) => {
    if (location.pathname !== item.path) return false;
    if (item.path !== "/dashboard") return true;
    return item.name === "Dashboard";
  };

  return (
    <div className="flex flex-col md:h-screen md:w-72 md:shrink-0 md:border-r md:border-white/10 md:bg-black">
      {/* Mobile: single top bar (full width) */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-black/90 px-4 backdrop-blur-xl md:hidden">
        <Link
          to="/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2"
        >
          <span className="bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-lg font-bold text-transparent">
            DevPulse
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-green-400/90">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            Live
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {user && (
            <Link
              to="/profile"
              className="rounded-lg p-1.5 ring-green-500/20 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2"
              aria-label="Account"
            >
              <UserAvatar key={user?.profileImage} user={user} size="sm" />
            </Link>
          )}
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer (mobile) / rail (desktop) */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-[min(100vw,18rem)] flex-col border-r border-white/10 bg-[#050505] backdrop-blur-xl
          transition-transform duration-300 ease-out
          md:static md:h-full md:w-full md:max-w-none md:translate-x-0 md:border-0 md:bg-transparent
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Desktop brand */}
        <div className="hidden items-center justify-between gap-2 border-b border-white/10 px-5 py-6 md:flex">
          <Link
            to="/dashboard"
            className="bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-xl font-bold text-transparent"
          >
            DevPulse
          </Link>
          <span className="flex items-center gap-2 text-xs text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Live
          </span>
        </div>

        {/* Mobile drawer header — no second logo */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 md:hidden">
          <span className="text-sm font-medium text-gray-400">Navigation</span>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = linkIsActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "border border-green-500/20 bg-green-500/10 text-green-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="mt-auto border-t border-white/10 p-4 md:hidden">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <UserAvatar
                key={`${user?.profileImage}-sidebar`}
                user={user}
                size="md"
                showInfo
              />
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-green-500/25 bg-green-500/5 py-2.5 text-sm font-medium text-green-400 transition hover:bg-green-500/10"
                >
                  <Settings size={18} />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;
