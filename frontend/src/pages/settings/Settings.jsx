import { useEffect, useState } from "react";
import api from "../../lib/axios";
import UserAvatar from "../../components/UserAvatar";
import EditProfileModal from "../../components/EditProfileModal";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await api.get("/api/v1/users/me");
            updateUser(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="text-white flex justify-center items-center min-h-screen">
                Loading account...
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen pt-24">
            <div className="max-w-4xl mx-auto px-4 space-y-6">

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold">Account</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage your account settings and profile information.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                    >
                        <ArrowLeft size={18} />
                    </button>
                </div>
                <div className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur">
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <UserAvatar user={user} />
                            <div>
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-gray-400 text-sm break-all">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setOpen(true)}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full sm:w-auto"
                        >
                            Edit Profile
                        </button>
                    </div>

                    <div className="border-t border-white/10" />
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium">Email address</p>
                            <p className="text-gray-400 text-sm mt-1 break-all">
                                {user.email}
                            </p>
                        </div>

                        <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full sm:w-auto">
                            Change Email
                        </button>
                    </div>

                    <div className="border-t border-white/10" />
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium">Connected accounts</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Connect Google or GitHub account.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg w-full sm:w-auto">
                                Google
                            </button>
                            <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg w-full sm:w-auto">
                                GitHub
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-white/10" />
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium">Password</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Change your password.
                            </p>
                        </div>

                        <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full sm:w-auto">
                            Change Password
                        </button>
                    </div>

                    <div className="border-t border-white/10" />
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium text-red-400">
                                Delete account
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Permanently delete your account.
                            </p>
                        </div>

                        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg w-full sm:w-auto">
                            Delete
                        </button>
                    </div>

                </div>

                <EditProfileModal
                    open={open}
                    setOpen={setOpen}
                    user={user}
                    refreshUser={fetchUser}
                />
            </div>
        </div>
    );
};

export default Settings;