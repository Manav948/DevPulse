import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Clock, MoreVertical, Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import Layout from "../../components/Layout.jsx";
import api from "../../lib/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const up = status === "UP";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide ${
        up
          ? "bg-[#22c55e]/15 text-[#22c55e] ring-1 ring-[#22c55e]/30"
          : "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
      }`}
    >
      <span
        className={`relative flex h-1.5 w-1.5 ${
          up ? "text-[#22c55e]" : "text-red-400"
        }`}
      >
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
            up ? "bg-[#22c55e]" : "bg-red-400"
          }`}
        />
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            up ? "bg-[#22c55e]" : "bg-red-400"
          }`}
        />
      </span>
      {status || "UNKNOWN"}
    </span>
  );
};

const Monitors = () => {
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
      toast.error("Failed to load monitors");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMonitor();
  }, [fetchMonitor]);

  useEffect(() => {
    const handleFocusRefetch = () => {
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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/monitor/${id}`);
      setMonitors((prev) => prev.filter((m) => m._id !== id));
      toast.success("Monitor Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Monitor not Deleted");
    }
  };

  return (
    <Layout>
      <div className="min-h-full bg-black">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">All Monitors</h1>
              <p className="text-gray-400 mt-1">
                Manage and track all your configured services.
              </p>
            </div>

            <button
              onClick={() => navigate("/add")}
              className="inline-flex items-center gap-2 bg-[#22c55e] px-5 py-2.5 rounded-xl font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-[#16a34a] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Add Monitor
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/2 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300 min-w-full md:min-w-200">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-400 border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">Monitor Name</th>
                    <th scope="col" className="px-6 py-4 font-medium">Status</th>
                    <th scope="col" className="px-6 py-4 font-medium">Target URL</th>
                    <th scope="col" className="px-6 py-4 font-medium">Last Checked</th>
                    <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-zinc-500 animate-pulse">
                        Loading monitors...
                      </td>
                    </tr>
                  ) : monitors.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                        No monitors found. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    monitors.map((monitor) => (
                      <tr
                        key={monitor._id}
                        className="transition-colors hover:bg-white/4 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className={`p-2 rounded-lg ${monitor.lastStatus === 'UP' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              <Activity className="h-4 w-4" />
                            </div>
                            <Link to={`/monitor/${monitor._id}`} className="font-semibold text-white hover:text-green-400 transition-colors wrap-break-words">
                              {monitor.title}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={monitor.lastStatus} />
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                            <span className="max-w-full wrap-break-words text-xs sm:text-sm" title={monitor.url}>{monitor.url}</span>
                            <a href={monitor.url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-green-400 transition">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {monitor.lastCheckedAt
                              ? new Date(monitor.lastCheckedAt).toLocaleString()
                              : "Pending"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/update/${monitor._id}`)}
                              className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(monitor._id)}
                              className="p-1.5 text-red-400/80 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-md transition"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Monitors;
