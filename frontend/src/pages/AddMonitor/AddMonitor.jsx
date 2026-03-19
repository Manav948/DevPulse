import React, { useState } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const AddMonitor = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        url: "",
        interval: 60,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.url) {
            return toast.error("All fields are required");
        }

        try {
            setLoading(true);

            await api.post("/api/v1/monitor", form);

            toast.success("Monitor added successfully");
            navigate("/dashboard");
        } catch (error) {
            toast.error("Failed to add monitor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden">

            <div className="absolute inset-0 
            bg-linear-to-br from-green-500 via-transparent to-transparent 
            blur-3xl opacity-30" />

            <Header />
            <div className="flex items-center justify-center px-4 py-16 relative z-10">
                <div className="relative w-full max-w-md rounded-2xl p-px
                bg-linear-to-br from-green-500/20 via-emerald-400/10 to-transparent">

                    <div className="absolute -inset-2 
                    bg-green-500/10 blur-2xl opacity-40 rounded-2xl" />

                    <div className="relative bg-[#020617]/90 backdrop-blur-xl borderborder-green-400/10 
                    rounded-2xl p-7 shadow-[0_0_80px_rgba(34,197,94,0.15)]">

                        <div className="absolute inset-0 rounded-2xl 
                    bg-linear-to-br from-green-400/10 via-transparent to-transparent 
                    opacity-40 pointer-events-none" />

                        <div className="absolute top-0 left-0 w-full h-px 
                    bg-linear-to-r from-transparent via-green-400/40 to-transparent" />

                        <div className="relative z-10">

                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-white">
                                    Add New Monitor
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Track uptime and performance of your service.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">

                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">
                                        Monitor Name
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="My Website"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg 
                                        bg-black/40 border border-green-500/10 
                                        text-white placeholder-gray-500 
                                        focus:outline-none focus:ring-2 focus:ring-green-400/40 
                                      focus:border-green-400/30 transition"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">
                                        Website URL
                                    </label>
                                    <input
                                        type="url"
                                        name="url"
                                        placeholder="https://example.com"
                                        value={form.url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg 
                                        bg-black/40 border border-green-500/10 
                                        text-white placeholder-gray-500 
                                        focus:outline-none focus:ring-2 focus:ring-green-400/40 
                                        focus:border-green-400/30 transition"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">
                                        Check Interval
                                    </label>

                                    <div className="relative">

                                        <select
                                            name="interval"
                                            value={form.interval}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pr-10 rounded-lg 
                                            bg-[#020617]/80 border border-green-500/20 
                                            text-white appearance-none 
                                            hover:border-green-400/30
                                            focus:outline-none focus:ring-2 focus:ring-green-400/40 
                                            focus:border-green-400/40 transition"
                                        >
                                            <option className="bg-[#020617] text-white" value={30}>
                                                Every 30 seconds
                                            </option>
                                            <option className="bg-[#020617] text-white" value={60}>
                                                Every 1 minute
                                            </option>
                                            <option className="bg-[#020617] text-white" value={300}>
                                                Every 5 minutes
                                            </option>
                                        </select>

                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <svg
                                                className="w-4 h-4 text-green-400 opacity-80"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        <div className="absolute inset-0 rounded-lg 
                                        bg-green-500/5 blur-md opacity-0 
                                        focus-within:opacity-100 transition pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-5">

                                    <button
                                        type="button"
                                        onClick={() => navigate("/dashboard")}
                                        className="flex-1 py-2.5 rounded-lg 
                                       bg-white/5 text-gray-300 
                                       hover:bg-white/10 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-2.5 rounded-lg 
                                        bg-linear-to-r from-green-500 to-emerald-600 
                                        hover:from-green-600 hover:to-emerald-700 
                                        text-white font-medium 
                                        flex items-center justify-center 
                                        shadow-[0_0_25px_rgba(34,197,94,0.35)] 
                                        transition"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "Create"
                                        )}
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMonitor;