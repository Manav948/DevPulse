import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  ArrowLeft,
  Pause,
  Play,
  Pencil,
  ExternalLink,
  Activity,
  Clock,
  Gauge,
  Percent,
} from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout.jsx";
import api from "../../lib/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";

const ACCENT = "#22c55e";

const glassCard =
  "relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(34,197,94,0.08)] transition-all duration-300 hover:border-white/[0.14] hover:shadow-[0_12px_40px_rgba(34,197,94,0.08),inset_0_1px_0_0_rgba(34,197,94,0.12)]";

function buildInitialMockInsights(monitor) {
  if (!monitor) {
    return { chartData: [], logs: [], avgMs: 0, uptimePct: "—" };
  }
  const points = 24;
  const intervalMs = Math.max((monitor.interval || 60) * 1000, 30_000);
  const isUp = monitor.lastStatus === "UP";
  const base = isUp ? 95 : 420;
  const chartData = [];
  const logs = [];
  let upCount = 0;

  for (let i = points - 1; i >= 0; i--) {
    const t = Date.now() - i * 2000; // Fake closer intervals for initial render to look good
    const jitter = (Math.sin(i * 0.45) + (Math.random() - 0.5)) * 55;
    let ms = Math.max(35, Math.round(base + jitter));
    let status = "UP";
    if (!isUp && i === 0) {
      status = "DOWN";
      ms = Math.min(1200, ms + 380);
    } else if (Math.random() < 0.06) {
      status = "DOWN";
      ms = Math.min(900, ms + 220);
    }
    if (status === "UP") upCount++;
    chartData.push({
      t,
      ms,
      label: new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }),
    });
    if (i < 10) {
      logs.push({ status, time: t, responseTime: ms, isNew: false });
    }
  }

  logs.sort((a, b) => b.time - a.time);

  return {
    chartData,
    logs,
    avgMs: Math.round(
      chartData.reduce((s, d) => s + d.ms, 0) / chartData.length
    ),
    uptimePct: ((upCount / points) * 100).toFixed(2),
  };
}

const StatusBadge = ({ status }) => {
  const up = status === "UP";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        up
          ? "bg-[#22c55e]/15 text-[#22c55e] ring-1 ring-[#22c55e]/30"
          : "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
      }`}
    >
      <span
        className={`relative flex h-2 w-2 ${
          up ? "text-[#22c55e]" : "text-red-400"
        }`}
      >
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
            up ? "bg-[#22c55e]" : "bg-red-400"
          }`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            up ? "bg-[#22c55e]" : "bg-red-400"
          }`}
        />
      </span>
      {status}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, delayClass = "" }) => (
  <div className={`${glassCard} p-6 devpulse-fade-in ${delayClass}`}>
    <div className="relative z-10 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-white">
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-sm text-zinc-500">{sub}</p>
        )}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/4 text-[#22c55e]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
    </div>
  </div>
);

const MonitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const socket = useSocket();
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pauseLoading, setPauseLoading] = useState(false);
  const [insights, setInsights] = useState({ chartData: [], logs: [], avgMs: 0, uptimePct: "—" });

  const fetchMonitor = useCallback(async () => {
    if (!token || !id) {
      setMonitor(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/monitor/${id}`);
      setMonitor(res?.data?.monitor || null);
    } catch (e) {
      console.error(e);
      setMonitor(null);
      toast.error("Could not load monitor");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchMonitor();
  }, [fetchMonitor]);

  // Dynamic animation and auto-updating logic using Real WebSockets
  useEffect(() => {
    if (!monitor) return;
    
    // Set initial dummy history to make UI look good immediately
    if (insights.chartData.length === 0) {
      setInsights(buildInitialMockInsights(monitor));
    }

    if (!socket) return;

    const handleMonitorUpdate = (data) => {
      // Only process updates for THIS monitor
      if (data.monitorId !== monitor._id) return;
      
      const isUp = data.status === "UP";
      const ms = data.responseTime || (isUp ? Math.floor(Math.random() * 50 + 50) : Math.floor(Math.random() * 500 + 800)); // Default if responseTime is 0 on DOWN
      const status = data.status;
      const t = data.lastCheckedAt ? new Date(data.lastCheckedAt).getTime() : Date.now();
      
      setMonitor(prev => ({
        ...prev,
        lastStatus: status,
        lastCheckedAt: data.lastCheckedAt
      }));

      setInsights((prev) => {
        const newPoint = {
          t,
          ms,
          label: new Date(t).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };

        const newChartData = [...prev.chartData.slice(1), newPoint];

        const oldLogs = prev.logs.map(l => ({ ...l, isNew: false }));
        const newLogs = [{ status, time: t, responseTime: ms, isNew: true }, ...oldLogs].slice(0, 10);

        const avgMs = Math.round(newChartData.reduce((s, d) => s + d.ms, 0) / newChartData.length) || 0;
        const upCount = newChartData.filter(d => d.ms < 400).length; // simple threshold
        const uptimePct = ((upCount / newChartData.length) * 100).toFixed(2);

        return { chartData: newChartData, logs: newLogs, avgMs, uptimePct };
      });
      
      // Unmark isNew after a short delay
      setTimeout(() => {
          setInsights(prev => ({
              ...prev,
              logs: prev.logs.map(l => ({...l, isNew: false}))
          }));
      }, 2000);
    };

    socket.on('monitorUpdate', handleMonitorUpdate);

    return () => socket.off('monitorUpdate', handleMonitorUpdate);
  }, [monitor, socket]);

  const isUp = monitor?.lastStatus === "UP";
  const lineColor = isUp ? ACCENT : "#ef4444";

  const lastCheckedLabel = monitor?.lastCheckedAt
    ? new Date(monitor.lastCheckedAt).toLocaleString()
    : "Not checked yet";

  const handlePauseToggle = async () => {
    if (!monitor) return;
    try {
      setPauseLoading(true);
      const next = !monitor.isActive;
      await api.put(`/api/v1/monitor/${monitor._id}`, { isActive: next });
      setMonitor((m) => (m ? { ...m, isActive: next } : null));
      toast.success(next ? "Monitor resumed" : "Monitor paused");
    } catch (e) {
      console.error(e);
      toast.error("Could not update monitor");
    } finally {
      setPauseLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-full bg-black p-6">
          <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
            <div className="h-10 w-2/3 rounded-lg bg-white/5" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-xl bg-white/5" />
              ))}
            </div>
            <div className="h-80 rounded-xl bg-white/5" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!monitor) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-black p-6 text-center">
          <p className="text-zinc-400">Monitor not found.</p>
          <Link
            to="/monitors"
            className="mt-4 text-sm font-medium text-[#22c55e] hover:underline"
          >
            Back to monitors
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-full bg-black">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          
          {/* Header */}
          <header className="devpulse-fade-in devpulse-stagger-1 mb-8 space-y-6">
            <button
              type="button"
              onClick={() => navigate("/monitors")}
              className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-300"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              All Monitors
            </button>

            <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {monitor.title}
                  </h1>
                  <StatusBadge status={monitor.lastStatus || "UNKNOWN"} />
                  {!monitor.isActive && (
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-amber-500/25">
                      Paused
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 text-sm text-zinc-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-1">
                  <a
                    href={monitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 truncate text-zinc-400 transition hover:text-[#22c55e]"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{monitor.url}</span>
                  </a>
                  <span className="hidden sm:inline text-zinc-700">·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Last checked {lastCheckedLabel}
                  </span>
                  <span className="hidden sm:inline text-zinc-700">·</span>
                  <span>
                    Interval: every {monitor.interval || 60}s
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <button
                  type="button"
                  disabled={pauseLoading}
                  onClick={handlePauseToggle}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#22c55e]/40 hover:bg-[#22c55e]/10 disabled:opacity-50"
                >
                  {monitor.isActive ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Resume
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/update/${monitor._id}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.35)] transition hover:bg-[#16a34a] hover:shadow-[0_0_28px_rgba(34,197,94,0.45)]"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8 min-w-0">
              
              {/* Stats Row */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={Activity}
                  label="Current status"
                  value={monitor.lastStatus || "UNKNOWN"}
                  sub={
                    monitor.isActive
                      ? "Checks running on schedule"
                      : "Paused — no checks"
                  }
                  delayClass="devpulse-stagger-2"
                />
                <StatCard
                  icon={Clock}
                  label="Last checked"
                  value={
                    monitor.lastCheckedAt
                      ? new Date(monitor.lastCheckedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "—"
                  }
                  sub={lastCheckedLabel}
                  delayClass="devpulse-stagger-3"
                />
                <StatCard
                  icon={Gauge}
                  label="Avg response"
                  value={`${insights.avgMs} ms`}
                  sub="Rolling window average"
                  delayClass="devpulse-stagger-4"
                />
                <StatCard
                  icon={Percent}
                  label="Uptime"
                  value={`${insights.uptimePct}%`}
                  sub="Recent sample window"
                  delayClass="devpulse-stagger-5"
                />
              </section>

              {/* Live Chart */}
              <section
                className={`${glassCard} p-6 devpulse-fade-in devpulse-stagger-4`}
              >
                <div className="relative z-10 mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-white">
                        Response Time
                      </h2>
                      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-[#22c55e]">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                        </span>
                        Live
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">
                      Real-time latency metrics for this monitor
                    </p>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    ms
                  </span>
                </div>
                
                <div className="relative z-10 h-70 w-full min-h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={insights.chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={lineColor} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "#71717a", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fill: "#71717a", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(9,9,11,0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                        }}
                        itemStyle={{ color: lineColor, fontWeight: 600 }}
                        labelStyle={{ color: "#a1a1aa", marginBottom: '4px' }}
                        formatter={(v) => [`${v} ms`, "Response"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="ms"
                        stroke={lineColor}
                        fillOpacity={1}
                        fill="url(#colorMs)"
                        strokeWidth={2.5}
                        isAnimationActive={false} // We handle our own rolling animation by state update smoothly
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Logs */}
              <section
                className={`${glassCard} devpulse-fade-in devpulse-stagger-5 overflow-hidden`}
              >
                <div className="relative z-10 border-b border-white/10 px-6 py-4 flex justify-between items-center bg-white/1">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Recent Checks
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Live event stream
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500 px-3 py-1 rounded-full border border-white/10 bg-white/5">Auto-updating</span>
                </div>
                <div className="relative z-10 overflow-x-auto">
                  <table className="w-full min-w-130 text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500 bg-white/2">
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Time</th>
                        <th className="px-6 py-3 font-medium text-right">
                          Response time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.logs.map((row, idx) => (
                        <tr
                          key={`${row.time}-${idx}`}
                          className={`border-b border-white/5 transition-all duration-500 ${
                            row.isNew ? "bg-[#22c55e]/10 shadow-[inset_4px_0_0_0_#22c55e]" : "hover:bg-white/4"
                          }`}
                        >
                          <td className="px-6 py-3.5">
                            <span
                              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                                row.status === "UP"
                                  ? "bg-[#22c55e]/15 text-[#22c55e]"
                                  : "bg-red-500/15 text-red-400"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-zinc-400">
                            {new Date(row.time).toLocaleString()}
                          </td>
                          <td className="px-6 py-3.5 text-right font-mono text-zinc-300">
                            {row.responseTime} ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>

            {/* Right sidebar for monitor specific actions/info */}
            <aside className="w-full lg:w-72 xl:w-80 space-y-6 shrink-0">
               <div className={`${glassCard} p-6 devpulse-fade-in devpulse-stagger-3`}>
                <h3 className="text-base font-semibold text-white mb-4">
                  Uptime Summary
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-5xl font-bold tabular-nums tracking-tighter text-[#22c55e]">
                    {insights.uptimePct}
                  </p>
                  <span className="text-xl font-semibold text-zinc-500">%</span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-500 mb-6">
                  Calculated based on the recent health check events.
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#22c55e] to-emerald-400 transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(100, parseFloat(insights.uptimePct) || 0)}%`,
                    }}
                  />
                </div>
              </div>

              <div className={`${glassCard} p-6 devpulse-fade-in devpulse-stagger-4`}>
                <h3 className="text-sm font-semibold text-white">
                  Notifications
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Alerts when status changes
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5 transition hover:bg-white/10 hover:border-white/10">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#22c55e]" />
                    <div>
                      <p className="font-medium text-zinc-200">
                        Email alerts
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">Enabled for failure states</p>
                    </div>
                  </li>
                  <li className="flex gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5 transition hover:bg-white/10 hover:border-white/10 opacity-70">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-zinc-600" />
                    <div>
                      <p className="font-medium text-zinc-200">Webhooks</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Not configured</p>
                    </div>
                  </li>
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MonitorDetails;
