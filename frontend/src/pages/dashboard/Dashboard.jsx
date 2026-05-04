import React, { useCallback, useEffect, useState } from "react";
import api from "../../lib/axios.js";
import MonitorCard from "../../components/MonitorCard.jsx";
import Layout from "../../components/Layout.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Activity, AlertTriangle, CheckCircle2, Server } from "lucide-react";

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchMonitor = useCallback(async () => {
    if (!token) {
      setMonitors([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/api/v1/monitor");
      setMonitors(res?.data?.monitors || []);
    } catch (error) {
      console.log("Failed to load monitors:", error);
      setMonitors([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMonitor();
  }, [fetchMonitor]);

  useEffect(() => {
    const handleFocusRefetch = () => {
      // Keep dashboard fresh when user returns from another page/tab.
      fetchMonitor();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMonitor();
      }
    };

    window.addEventListener("focus", handleFocusRefetch);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocusRefetch);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchMonitor]);

  const upCount = monitors.filter((m) => m.lastStatus === "UP").length;
  const downCount = monitors.filter((m) => m.lastStatus === "DOWN").length;

  const handleDelete = (id) => {
    setMonitors((prev) => prev.filter((m) => m._id !== id));
  };

  const activeMonitors = monitors.filter(m => m.isActive !== false);
  const upMonitors = activeMonitors.filter(m => m.lastStatus === "UP").length;
  const downMonitors = activeMonitors.filter(m => m.lastStatus === "DOWN").length;

  return (
    <Layout>
      <div className="min-h-full bg-black">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Monitoring Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Track uptime, performance and status of your services in real-time.
            </p>
          </div>

          <button
            onClick={() => navigate("/add")}
            className="bg-green-500/80 px-5 py-2 rounded-xl font-medium shadow-lg hover:opacity-90 transition cursor-pointer"
          >
            + Add Monitor
          </button>
        </div>

        {/* Summary Stats */}
        {!loading && monitors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total Monitors</p>
                <p className="text-2xl font-bold text-white">{monitors.length}</p>
              </div>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 text-green-400 rounded-lg">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Up Monitors</p>
                <p className="text-2xl font-bold text-white">{upMonitors}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Down Monitors</p>
                <p className="text-2xl font-bold text-white">{downMonitors}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Active Rate</p>
                <p className="text-2xl font-bold text-white">
                  {monitors.length > 0 ? Math.round((activeMonitors.length / monitors.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 animate-pulse">Loading monitors...</div>
        ) : monitors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No monitors found</p>
            <button
              onClick={() => navigate("/add")}
              className="bg-green-600 px-4 py-2 rounded-lg cursor-pointer"
            >
              Create your first monitor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitors.map((monitor) => (
              <MonitorCard
                key={monitor._id}
                monitor={monitor}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default Dashboard;