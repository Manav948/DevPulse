import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import UserAvatar from "./UserAvatar";
import { Settings, LogOut } from "lucide-react";

const Header = () => {
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
        <div className="w-full flex justify-center pt-6">
            <header className="w-[82%] h-16 px-6 flex items-center justify-between 
                rounded-2xl border border-green-500/30 bg-black backdrop-blur-xl 
                shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-visible">

                <div className="flex items-center gap-3 z-10">
                    <h1 className="text-xl font-bold bg-linear-to-r from-green-400 to-emerald-500 
                        bg-clip-text text-transparent">
                        CodeMonitor
                    </h1>

                    <div className="flex items-center gap-2 text-xs text-green-400 relative">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        Live
                    </div>
                </div>

                <div className="flex items-center gap-3 z-10 relative" ref={dropdownRef}>
                    <div
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer flex items-center gap-2"
                    >
                        <UserAvatar user={user} size="md" />
                    </div>

                    {open && (
                        <div className="absolute right-0 top-14 w-56  rounded-xl border border-green-500/10 bg-black backdrop-blur-xl shadow-[0_0_25px_rgba(34,197,94,0.15)] p-2">

                            <div className="px-3 py-2">
                                <UserAvatar user={user} size="sm" showInfo />
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
                                <Settings size={16} className="text-gray-200" />
                                Settings
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg 
                              text-red-400 hover:bg-red-500/10 transition"
                            >
                                <LogOut size={16} className="text-red-400" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;