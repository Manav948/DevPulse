import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import UserAvatar from "./UserAvatar";
import { Settings, LogOut, Menu, X } from "lucide-react";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
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
        <div className="w-full flex justify-center px-4 pt-4 sm:pt-6">
            <header className="w-full max-w-6xl h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between 
                rounded-xl sm:rounded-2xl border border-green-500/30 bg-black backdrop-blur-xl 
                shadow-[0_0_30px_rgba(34,197,94,0.1)] relative z-50">

                <div className="flex items-center gap-2 sm:gap-3">
                    <h1
                        onClick={() => navigate("/")}
                        className="cursor-pointer text-lg sm:text-xl font-bold 
                        bg-linear-to-r from-green-400 to-emerald-500 
                        bg-clip-text text-transparent"
                    >
                        DevPulse
                    </h1>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-green-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        Live
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 relative" ref={dropdownRef}>
                    {user ? (
                        <>
                            <div
                                onClick={() => setOpen(!open)}
                                className="cursor-pointer"
                            >
                                <UserAvatar key={user?.profileImage} user={user} size="md" />
                            </div>

                            {open && (
                                <div className="absolute right-0 top-14 w-56 rounded-xl border border-green-500/10 
                                    bg-black backdrop-blur-xl shadow-[0_0_25px_rgba(34,197,94,0.15)] p-2">

                                    <div className="px-3 py-2">
                                        <UserAvatar
                                            key={user?.profileImage + "dropdown"}
                                            user={user}
                                            size="sm"
                                            showInfo
                                        />
                                    </div>

                                    <div className="h-px bg-white/10 my-2" />

                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg 
                                        text-gray-200 hover:bg-white/10 transition"
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg 
                                        text-red-400 hover:bg-red-500/10 transition"
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
                                onClick={() => navigate("/signin")}
                                className="px-4 py-2 text-sm rounded-lg border border-green-500/30 
                                text-green-400 hover:bg-green-500/10 transition"
                            >
                                Sign In
                            </button>

                            <button
                                onClick={() => navigate("/signup")}
                                className="px-4 py-2 text-sm rounded-lg 
                                bg-linear-to-r from-green-400 to-emerald-500 
                                text-black font-semibold hover:opacity-90 transition"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                <div className="sm:hidden flex items-center gap-2">
                    {!user && (
                        <button
                            onClick={() => navigate("/signin")}
                            className="px-3 py-1.5 text-xs rounded-lg border border-green-500/30 
            text-green-400 hover:bg-green-500/10 transition"
                        >
                            Sign In
                        </button>
                    )}

                    {user && (
                        <div onClick={() => navigate("/profile")} className="cursor-pointer">
                            <UserAvatar user={user} size="sm" />
                        </div>
                    )}

                    <button onClick={() => setMobileMenu(!mobileMenu)}>
                        {mobileMenu ? <X /> : <Menu />}
                    </button>
                </div>

                {mobileMenu && (
                    <div className="absolute top-16 right-0 w-48 rounded-xl border border-green-500/20 
                        bg-black backdrop-blur-xl shadow-lg p-3 sm:hidden">

                        {user ? (
                            <>
                                <button
                                    onClick={() => {
                                        navigate("/profile");
                                        setMobileMenu(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 text-gray-200 hover:bg-white/10 rounded-lg"
                                >
                                    Profile
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/signin")}
                                    className="block w-full text-left px-3 py-2 text-green-400 hover:bg-green-500/10 rounded-lg"
                                >
                                    Sign In
                                </button>

                                <button
                                    onClick={() => navigate("/signup")}
                                    className="block w-full text-left px-3 py-2 text-green-400 hover:bg-green-500/10 rounded-lg"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                )}
            </header>
        </div>
    );
};

export default Header;