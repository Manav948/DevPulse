import React, { useState } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const intervals = [
  { label: "Every 30 seconds", value: 30 },
  { label: "Every 1 minute", value: 60 },
  { label: "Every 5 minutes", value: 300 },
];

const AddMonitor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    url: "",
    interval: 60,
  });

  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedInterval = intervals.find(
    (i) => i.value === Number(form.interval)
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    } catch {
      toast.error("Failed to add monitor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black relative overflow-hidden">

        <div className="relative z-10 flex justify-center px-4 py-16">
          <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">

            <div className="border-b border-white/10 pb-4">
              <h1 className="text-3xl font-bold">
                Add New Monitor
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Monitor uptime, performance and reliability of your APIs in real-time.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Monitor Name</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="My API Service"
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/10 focus:border-green-400 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Endpoint URL</label>
                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://api.example.com"
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/10 focus:border-green-400 outline-none"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm text-gray-400">Check Interval</label>

                <div
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/10 cursor-pointer flex justify-between items-center"
                >
                  <span>{selectedInterval.label}</span>
                  <span>⌄</span>
                </div>

                {openDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 rounded-xl bg-black border border-white/10 shadow-xl z-50">
                    {intervals.map((item) => (
                      <div
                        key={item.value}
                        onClick={() => {
                          setForm({ ...form, interval: item.value });
                          setOpenDropdown(false);
                        }}
                        className="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm"
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl font-semibold bg-linear-to-r from-green-400 to-emerald-500 text-black hover:opacity-90 transition"
                >
                  {loading ? "Creating..." : "Create Monitor"}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddMonitor;