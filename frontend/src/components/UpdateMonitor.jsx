import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useState } from "react"
import api from "../lib/axios";
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

const UpdateMonitor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        url: "",
        interval: 60
    })

    useEffect(() => {
        const fetchMonitor = async () => {
            try {
                const res = await api.get(`/api/v1/monitor/${id}`);
                setForm({
                    title: res.data.monitor.title,
                    url: res.data.monitor.url,
                    interval: res.data.monitor.interval
                })
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch monitor details");
            }
        }
        fetchMonitor();
    }, [id])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updateMonitor = await api.put(`/api/v1/monitor/${id}`, form);
            toast.success("Monitor Updated Successfully");
            navigate("/dashboard");

        } catch (error) {
            console.log("Error during update monitor", error)
            toast.error("Monitor not Updated");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full z-20">
                <Header />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-28">

                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Update Monitor
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Modify your API monitoring configuration
                    </p>
                </div>

                <form
                    onSubmit={handleUpdate}
                    className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                >

                    <div>
                        <label className="text-sm text-gray-400">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 rounded-lg bg-black/60 border border-white/10 focus:border-green-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">URL</label>
                        <input
                            type="text"
                            name="url"
                            value={form.url}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 rounded-lg bg-black/60 border border-white/10 focus:border-green-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">
                            Interval: <span className="text-green-400">{form.interval}s</span>
                        </label>

                        <input
                            type="range"
                            min="10"
                            max="300"
                            step="10"
                            value={form.interval}
                            onChange={(e) =>
                                setForm({ ...form, interval: Number(e.target.value) })
                            }
                            className="w-full mt-3 accent-green-500 cursor-pointer"
                        />

                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>10s</span>
                            <span>5min</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-green-400 to-emerald-500 text-black font-semibold py-3 rounded-lg hover:opacity-90 transition"
                    >
                        {loading ? "Updating..." : "Update Monitor"}
                    </button>

                </form>

            </div>
        </div>
    );
};


export default UpdateMonitor;
