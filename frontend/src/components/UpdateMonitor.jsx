import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const UpdateMonitor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    url: "",
    interval: 60,
  });

  useEffect(() => {
    const fetchMonitor = async () => {
      try {
        const res = await api.get(`/api/v1/monitor/${id}`);
        setForm(res.data.monitor);
      } catch {
        toast.error("Failed to fetch monitor");
      }
    };
    fetchMonitor();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(`/api/v1/monitor/${id}`, form);
      toast.success("Monitor Updated");
      navigate("/dashboard");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10 md:min-h-[calc(100vh-4rem)]">
        <form
          onSubmit={handleUpdate}
          className="w-full max-w-2xl backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 
          shadow-[0_0_60px_rgba(0,0,0,0.8)]"
        >
          <div className="border-b border-white/10 pb-4">
            <h1 className="text-3xl font-bold">Update Monitor</h1>
            <p className="text-gray-400 text-sm mt-1">
              Configure your API monitoring settings
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-400">Monitor Name</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-black/60 border border-white/10 focus:border-green-400 outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-400">Endpoint URL</label>
            <input
              type="text"
              name="url"
              value={form.url}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-black/60 border border-white/10 focus:border-green-400 outline-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">
                Check Interval
              </label>
              <span className="text-green-400 font-semibold">
                {form.interval}s
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={form.interval}
              onChange={(e) =>
                setForm({ ...form, interval: Number(e.target.value) })
              }
              className="w-full accent-green-500 cursor-pointer"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>10s</span>
              <span>1m</span>
              <span>3m</span>
              <span>5m</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold 
            bg-linear-to-r from-green-400 to-emerald-500 text-black 
            hover:opacity-90 transition"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
    </Layout>
  );
};

export default UpdateMonitor;