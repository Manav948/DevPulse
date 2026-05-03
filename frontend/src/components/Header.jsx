import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import UserAvatar from "./UserAvatar";
import { Settings, LogOut } from "lucide-react";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="hidden w-full shrink-0 border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md md:flex md:justify-end md:px-6">
      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        {user ? (
          <>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="cursor-pointer rounded-lg outline-none ring-green-500/30 transition hover:opacity-90 focus-visible:ring-2"
              aria-expanded={open}
              aria-haspopup="true"
            >
              <UserAvatar key={user?.profileImage} user={user} size="md" />
            </button>
            {open && (
              <div
                className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-xl border border-green-500/20 bg-black/95 p-2 shadow-[0_0_25px_rgba(34,197,94,0.15)] backdrop-blur-xl"
                role="menu"
              >
                <div className="px-3 py-2">
                  <UserAvatar
                    key={`${user?.profileImage}-dropdown`}
                    user={user}
                    size="sm"
                    showInfo
                  />
                </div>
                <div className="my-2 h-px bg-white/10" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-200 transition hover:bg-white/10"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="rounded-lg border border-green-500/30 px-4 py-2 text-sm text-green-400 transition hover:bg-green-500/10"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="rounded-lg bg-linear-to-r from-green-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

/** Landing / marketing page header */
const MarketingHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex w-full justify-center px-4 py-6 pb-4">
      <header className="relative z-40 flex h-16 w-full max-w-7xl items-center justify-between rounded-2xl border border-green-500/20 bg-black/50 px-6 shadow-[0_0_20px_rgba(34,197,94,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <h1
            onClick={() => navigate("/")}
            className="cursor-pointer bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-xl font-bold text-transparent transition hover:opacity-80"
          >
            DevPulse
          </h1>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Live
          </div>
        </div>

        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="cursor-pointer transition hover:opacity-80"
              >
                <UserAvatar key={user?.profileImage} user={user} size="md" />
              </button>
              {open && (
                <div className="absolute right-0 top-16 w-56 rounded-xl border border-green-500/20 bg-black p-2 shadow-[0_0_25px_rgba(34,197,94,0.15)] backdrop-blur-xl">
                  <div className="px-3 py-2">
                    <UserAvatar
                      key={`${user?.profileImage}-dropdown`}
                      user={user}
                      size="sm"
                      showInfo
                    />
                  </div>
                  <div className="my-2 h-px bg-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-200 transition hover:bg-white/10"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="rounded-lg border border-green-500/30 px-4 py-2 text-sm text-green-400 transition hover:bg-green-500/10"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="rounded-lg bg-linear-to-r from-green-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

const Header = ({ variant = "marketing" }) => {
  if (variant === "app") {
    return <AppHeader />;
  }
  return <MarketingHeader />;
};

export default Header;
