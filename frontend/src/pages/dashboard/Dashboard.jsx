import React, { useEffect, useState } from "react";
import api from "../../lib/axios.js";
import Header from "../../components/Header.jsx";
import MonitorCard from "../../components/MonitorCard.jsx";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const upCount = monitors.filter((m) => m.lastStatus === "UP").length;
  const downCount = monitors.filter((m) => m.lastStatus === "DOWN").length;

  const handleDelete = (id) => {
    setMonitors((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
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
              <MonitorCard key={monitor._id} monitor={monitor} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;