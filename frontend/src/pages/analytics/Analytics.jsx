import React, { useCallback, useEffect, useState } from "react";
import api from "../../lib/axios.js";
import Layout from "../../components/Layout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Server,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

// Helper for random mock data
const generateMockData = (monitors) => {
  const now = new Date();
  
  // Uptime Trend (last 24 points)
  const uptimeTrend = Array.from({ length: 24 }).map((_, i) => ({
    time: new Date(now.getTime() - (23 - i) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    uptime: 98 + Math.random() * 2 // 98% to 100%
  }));

  // Response Time Comparison (one per monitor, or dummy if none)
  const responseTimes = monitors.length > 0 
    ? monitors.map(m => ({
        id: m._id,
        name: m.title || "Unknown API",
        time: Math.floor(Math.random() * 600) + 50, // 50ms to 650ms
        status: m.lastStatus
      }))
    : Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        name: `Service ${i + 1}`,
        time: Math.floor(Math.random() * 600) + 50,
        status: "UP"
      }));

  // Sort by slowest
  const slowestApis = [...responseTimes].sort((a, b) => b.time - a.time).slice(0, 4);

  // Most Failing Monitors
  const failingMonitors = monitors
    .map(m => ({
      id: m._id,
      name: m.title,
      failures: Math.floor(Math.random() * 15),
      lastFailure: new Date(now.getTime() - Math.random() * 86400000 * 3) // random within last 3 days
    }))
    .filter(m => m.failures > 0)
    .sort((a, b) => b.failures - a.failures)
    .slice(0, 4);

  // Recent Incidents
  const incidents = monitors
    .filter(m => m.lastStatus === "DOWN" || Math.random() > 0.7) // some random ones if all UP
    .map(m => ({
      id: Math.random().toString(36).substr(2, 9),
      monitorName: m.title,
      status: m.lastStatus === "DOWN" ? "DOWN" : (Math.random() > 0.5 ? "DOWN" : "DEGRADED"),
      time: new Date(now.getTime() - Math.random() * 3600000 * 5),
      responseTime: Math.floor(Math.random() * 1000) + 200
    }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 5);

  const globalUptime = 99.9 + (Math.random() * 0.09);
  const avgResponse = Math.floor(responseTimes.reduce((acc, curr) => acc + curr.time, 0) / (responseTimes.length || 1));

  return {
    uptimeTrend,
    responseTimes,
    slowestApis,
    failingMonitors,
    incidents,
    globalUptime,
    avgResponse
  };
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-lg p-3 shadow-2xl backdrop-blur-md">
        <p className="text-zinc-400 text-xs mb-1">{label}</p>
        <p className="text-green-400 font-bold text-sm">
          {payload[0].value.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-lg p-3 shadow-2xl backdrop-blur-md">
        <p className="text-zinc-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">
          {payload[0].value} ms
        </p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mockStats, setMockStats] = useState(null);
  const { token } = useAuth();

  const fetchMonitor = useCallback(async () => {
    if (!token) {
      setMonitors([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/api/v1/monitor");
      const fetchedMonitors = res?.data?.monitors || [];
      setMonitors(fetchedMonitors);
      setMockStats(generateMockData(fetchedMonitors));
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
    const handleFocusRefetch = () => fetchMonitor();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchMonitor();
    };
    window.addEventListener("focus", handleFocusRefetch);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", handleFocusRefetch);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchMonitor]);

  if (loading || !mockStats) {
    return (
      <Layout>
        <div className="min-h-full bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-green-500">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <p className="text-sm text-zinc-400 animate-pulse">Loading Analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const activeMonitors = monitors.filter(m => m.isActive !== false);
  const upCount = activeMonitors.filter(m => m.lastStatus === "UP").length;
  const downCount = activeMonitors.filter(m => m.lastStatus === "DOWN").length;

  return (
    <Layout>
      <div className="min-h-full bg-black text-white selection:bg-green-500/30 font-sans">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 animate-in fade-in duration-700">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Global Analytics</h1>
              <p className="text-zinc-400 text-sm">System-wide health, performance trends, and incidents.</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-400">All Systems Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="group rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-5 hover:bg-white/[0.02] hover:border-white/10 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.15)] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-zinc-800/50 text-zinc-400 rounded-xl group-hover:text-white transition-colors">
                  <Server className="h-5 w-5" />
                </div>
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Total Monitors</p>
              <p className="text-3xl font-bold text-white tracking-tight">{monitors.length}</p>
            </div>

            <div className="group rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-5 hover:bg-white/[0.02] hover:border-white/10 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.15)] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-green-500/10 text-green-400 rounded-xl">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Active (UP)</p>
              <p className="text-3xl font-bold text-white tracking-tight">{upCount}</p>
            </div>

            <div className="group rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-5 hover:bg-white/[0.02] hover:border-white/10 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.15)] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Down Monitors</p>
              <p className="text-3xl font-bold text-white tracking-tight">{downCount}</p>
            </div>

            <div className="group rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-5 hover:bg-white/[0.02] hover:border-white/10 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.15)] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl group-hover:text-blue-300 transition-colors">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="flex items-center text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  0.02%
                </div>
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Global Uptime</p>
              <p className="text-3xl font-bold text-white tracking-tight">{mockStats.globalUptime.toFixed(2)}%</p>
            </div>

            <div className="group rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-5 hover:bg-white/[0.02] hover:border-white/10 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl group-hover:text-purple-300 transition-colors">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="flex items-center text-xs font-medium text-red-400 bg-red-500/10 px-2 py-1 rounded-md">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  12ms
                </div>
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Avg Response</p>
              <p className="text-3xl font-bold text-white tracking-tight">{mockStats.avgResponse}ms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Uptime Trend</h3>
                  <p className="text-sm text-zinc-500">Average system availability over 24h</p>
                </div>
                <div className="flex gap-2">
                  {['24h', '7d', '30d'].map(t => (
                    <button key={t} className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${t === '24h' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:bg-white/5'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockStats.uptimeTrend}>
                    <defs>
                      <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis domain={['dataMin - 1', 100]} stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={val => `${val}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="uptime" stroke="#22c55e" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#22c55e", stroke: "#000", strokeWidth: 2 }} fill="url(#colorUptime)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-6 shadow-lg flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Slowest Endpoints</h3>
                <p className="text-sm text-zinc-500">APIs needing optimization</p>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                {mockStats.slowestApis.length > 0 ? mockStats.slowestApis.map((api, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-2 rounded-lg ${api.time > 500 ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-sm text-zinc-200 truncate" title={api.name}>{api.name}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-3 shrink-0">
                      <span className={`text-sm font-bold ${api.time > 500 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {api.time}ms
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-zinc-500 text-sm">No data available</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Response Times Comparison</h3>
                <p className="text-sm text-zinc-500">Average latency across monitors</p>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockStats.responseTimes.slice(0, 10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} dy={10} tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                      {mockStats.responseTimes.slice(0, 10).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.time > 500 ? '#ef4444' : (entry.time > 200 ? '#eab308' : '#22c55e')} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-6 shadow-lg flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">High Failure Rate</h3>
                <p className="text-sm text-zinc-500">Monitors with the most downtime events</p>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                {mockStats.failingMonitors.length > 0 ? mockStats.failingMonitors.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-red-500/[0.02] border border-red-500/10 hover:bg-red-500/[0.05] transition-colors">
                    <div className="overflow-hidden pr-3">
                      <h4 className="font-medium text-sm text-zinc-200 mb-1 truncate" title={m.name}>{m.name}</h4>
                      <p className="text-xs text-zinc-500">Last: {m.lastFailure.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20 flex items-center gap-1 shrink-0">
                      <AlertTriangle className="h-3 w-3" />
                      {m.failures} Failures
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 flex flex-col items-center">
                    <CheckCircle2 className="h-10 w-10 text-green-500/50 mb-3" />
                    <p className="text-zinc-400 text-sm">No failing monitors recently.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-6 shadow-lg overflow-hidden">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Incidents</h3>
              <p className="text-sm text-zinc-500">Log of recent downtime or performance issues</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-white/[0.03] text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-l-lg">Monitor</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium rounded-r-lg">Response Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockStats.incidents.length > 0 ? mockStats.incidents.map((incident, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-4 font-medium text-zinc-200 max-w-[200px] truncate" title={incident.monitorName}>{incident.monitorName}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          incident.status === 'DOWN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${incident.status === 'DOWN' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-zinc-500">
                        {incident.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {incident.time.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 font-mono text-zinc-400">
                        {incident.responseTime}ms
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-zinc-500">No recent incidents recorded.</td>
                    </tr>
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

export default Analytics;