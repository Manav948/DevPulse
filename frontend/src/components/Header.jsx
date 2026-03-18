import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

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
            <header className="w-[82%] h-16 px-6 flex items-center justify-between rounded-2xl border border-green-500/10 bg-white/5 backdrop-blur-xl relative overflow-visible">


                <div className="flex items-center gap-3 z-10">
                    <h1 className="text-xl font-bold 
                        bg-linear-to-r from-green-400 to-emerald-500 
                        bg-clip-text text-transparent">
                        CodeMonitor
                    </h1>
                    <div className="flex items-center gap-1 text-xs text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                        <span className="w-2 h-2 bg-green-400 rounded-full absolute" />
                        <span className="ml-2">Live</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 z-10 relative" ref={dropdownRef}>
                    <div
                        onClick={() => setOpen(!open)}
                        className="w-10 h-10 cursor-pointer rounded-full 
                            bg-linear-to-br from-green-500 to-emerald-600 
                            flex items-center justify-center text-white font-semibold 
                            shadow-lg hover:scale-105 transition duration-200"
                    >
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            user?.username?.charAt(0).toUpperCase()
                        )}
                    </div>

                    <span className="hidden sm:block text-gray-200 font-medium">
                        {user?.username}
                    </span>

                    {open && (
                        <div className="absolute right-0 top-14 w-52 rounded-xl border border-green-500/10 bg-[#020617]/80 backdrop-blur-xl p-2 animate-fadeIn">

                            <div className="px-4 py-2 text-xs text-gray-400">
                                Signed in as
                                <p className="text-white font-medium truncate">
                                    {user?.username}
                                </p>
                            </div>

                            <div className="h-px bg-white/10 my-2" />
                            <button
                                onClick={() => {
                                    navigate("/profile");
                                    setOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 rounded-lg 
                                    text-gray-200 hover:bg-white/10 transition"
                            >
                                ⚙️ Settings
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 rounded-lg 
                                    text-red-400 hover:bg-red-500/10 transition"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;