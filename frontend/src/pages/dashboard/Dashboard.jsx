import React, { useEffect, useState } from "react";
import api from "../../lib/axios.js";
import Header from "../../components/Header.jsx";
import MonitorCard from "../../components/MonitorCard.jsx";

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitor = async () => {
      try {
        const res = await api.get("/api/v1/monitor");
        setMonitors(res.data.monitors);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitor();
  }, []);

  const upCount = monitors.filter(m => m.lastStatus === "UP").length;
  const downCount = monitors.filter(m => m.lastStatus === "DOWN").length;

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

          <div>
            <h1 className="text-3xl font-bold">
              Monitoring Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Track uptime, performance and status of your services in real-time.
            </p>
          </div>

          <button className="bg-green-500/80
            px-5 py-2 rounded-xl font-medium shadow-lg hover:opacity-90 transition">
            + Add Monitor
          </button>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-lg">
            <p className="text-gray-400 text-sm">Total Monitors</p>
            <h2 className="text-2xl font-bold">{monitors.length}</h2>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-400 text-sm">Up</p>
            <h2 className="text-2xl font-bold text-green-400">{upCount}</h2>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm">Down</p>
            <h2 className="text-2xl font-bold text-red-400">{downCount}</h2>
          </div>

        </div> */}
        {loading ? (
          <div className="text-gray-400 animate-pulse">
            Loading monitors...
          </div>
        ) : monitors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">
              No monitors found
            </p>
            <button className="bg-blue-600 px-4 py-2 rounded-lg">
              Create your first monitor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {monitors.map((monitor) => (
              <MonitorCard key={monitor._id} monitor={monitor} />
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;