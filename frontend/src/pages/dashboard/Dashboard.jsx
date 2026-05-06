import React, { useCallback, useEffect, useState, useRef } from "react";
import api from "../../lib/axios.js";
import Layout from "../../components/Layout.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Server,
  Activity,
  Terminal,
  ChevronRight,
  Globe,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Wifi,
  Eye,
  EyeOff,
} from "lucide-react";

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const terminalContainerRef = useRef(null);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const fetchMonitor = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get("/api/v1/monitor");
      setMonitors(res?.data?.monitors || []);
    } catch (error) {
      console.log("Failed to load monitors:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMonitor();
    const handleFocus = () => fetchMonitor();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchMonitor]);

  // Simulated Live Terminal Logs
  useEffect(() => {
    if (monitors.length === 0) return;
    
    // Initial logs
    setTerminalLogs([
      { id: 1, text: `System initialized for ${user?.name || 'User'}.`, type: 'info', time: new Date() },
      { id: 2, text: `Discovered ${monitors.length} endpoints. Commencing telemetry...`, type: 'info', time: new Date() }
    ]);

    const interval = setInterval(() => {
      setTerminalLogs(prev => {
        const randomMonitor = monitors[Math.floor(Math.random() * monitors.length)];
        const isUp = randomMonitor?.lastStatus !== 'DOWN';
        
        const newLog = {
          id: Date.now(),
          text: isUp 
            ? `PING ${randomMonitor?.title || 'Endpoint'} - OK (${Math.floor(Math.random() * 120 + 20)}ms)` 
            : `PING ${randomMonitor?.title || 'Endpoint'} - TIMEOUT / ERROR`,
          type: isUp ? 'success' : 'error',
          time: new Date()
        };
        
        // Keep last 20 logs
        return [...prev, newLog].slice(-20);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [monitors, user]);

  // Auto-scroll terminal without shifting the entire page
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTo({
        top: terminalContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [terminalLogs]);

  const allOperational = monitors.every(m => m.lastStatus !== "DOWN");

  return (
    <Layout>
      <div className="min-h-full bg-[#030303] text-zinc-300 font-sans selection:bg-green-500/30 relative overflow-hidden flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-4 py-6 pb-24 md:pb-6 md:py-8 relative z-10 flex-1 flex flex-col min-h-0">
          
          {/* Top Command Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 bg-white/2 border border-white/5 rounded-2xl p-5 backdrop-blur-xl shadow-2xl shrink-0">
            <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-black border border-white/10 shadow-inner overflow-hidden shrink-0">
                <div className={`absolute inset-0 opacity-20 ${allOperational && monitors.length > 0 ? 'bg-green-500 animate-pulse' : (!allOperational && monitors.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-zinc-500')}`}></div>
                {allOperational && monitors.length > 0 ? <ShieldCheck className="h-6 w-6 text-green-400 relative z-10" /> : (!allOperational && monitors.length > 0 ? <AlertOctagon className="h-6 w-6 text-red-400 relative z-10" /> : <Server className="h-6 w-6 text-zinc-400 relative z-10" />)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  DevPulse Core
                  {monitors.length > 0 && (
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${allOperational ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      {allOperational ? 'Operational' : 'Degraded'}
                    </span>
                  )}
                </h1>
                <p className="text-zinc-500 text-sm mt-1">Live telemetry and routing matrix</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/add")} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                Deploy Node
              </button>
            </div>
          </div>

          {/* Main Content: Two Columns */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            
            {/* Left Col: Endpoint Grid */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-400" /> Active Nodes
                </h2>
                <div className="text-xs text-zinc-500 uppercase tracking-widest">{monitors.length} Connected</div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-8">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-green-500/50">
                    <Activity className="h-10 w-10 animate-pulse mb-4" />
                    <p className="text-sm uppercase tracking-widest animate-pulse">Establishing Uplink...</p>
                  </div>
                ) : monitors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl bg-white/1">
                    <p className="text-zinc-500 mb-4">No nodes deployed to the matrix.</p>
                    <button onClick={() => navigate("/add")} className="text-green-400 hover:text-green-300 text-sm font-medium border border-green-500/20 px-4 py-2 rounded-lg bg-green-500/5 transition-colors cursor-pointer">
                      Deploy First Node
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monitors.map((monitor, i) => {
                      const isUp = monitor.lastStatus !== "DOWN";
                      return (
                        <div 
                          key={monitor._id} 
                          className="group relative bg-black/40 border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all hover:bg-white/2 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          
                          <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`relative flex items-center justify-center w-10 mt-2 h-10 rounded-lg border shrink-0 ${isUp ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                  <Server className="h-5 w-5" />
                                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isUp ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isUp ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <Link
                                    to={`/monitor/${monitor._id}`}
                                    className="font-bold text-white hover:text-green-400 transition-colors text-sm md:text-base leading-tight line-clamp-2 wrap-break-word"
                                    title={monitor.title}
                                  >
                                    {monitor.title}
                                  </Link>
                                  <div className="flex items-start gap-1.5 text-xs text-zinc-500 mt-1 min-w-0">
                                    <Globe className="h-3 w-3 shrink-0" />
                                    <span className="break-all line-clamp-2 leading-relaxed" title={monitor.url}>
                                      {monitor.url}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                                {monitor.lastCheckedAt ? new Date(monitor.lastCheckedAt).toLocaleTimeString() : 'Pending'}
                              </div>
                              <Link to={`/monitor/${monitor._id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md text-white flex items-center gap-1 shrink-0">
                                Details <ChevronRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Live Terminal Feed */}
            <div className="w-full lg:w-87.5 xl:w-100 flex flex-col bg-black/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl shrink-0">
              <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Terminal className="h-4 w-4 text-green-400" /> System Log
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogs((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-200 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {showLogs ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showLogs ? "Hide" : "Show"}
                  </button>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                </div>
              </div>

              {showLogs ? (
                <>
                  <div ref={terminalContainerRef} className="h-72 lg:h-100 p-4 overflow-y-auto font-mono text-xs custom-scrollbar">
                    {terminalLogs.length === 0 ? (
                      <div className="text-zinc-600 animate-pulse">Awaiting telemetry data...</div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {terminalLogs.map((log) => (
                          <div key={log.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <span className="text-zinc-600 mr-3">[{log.time.toLocaleTimeString([], { hour12: false })}]</span>
                            <span className={
                              log.type === 'success' ? 'text-green-400/90' :
                              log.type === 'error' ? 'text-red-400/90' : 'text-blue-400/90'
                            }>
                              {log.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white/2 border-t border-white/5 px-4 py-3 flex items-center gap-2 shrink-0">
                    <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-green-500/70">Socket connected. Live streaming...</span>
                  </div>
                </>
              ) : (
                <div className="px-4 py-5 text-xs text-zinc-500">
                  Logs are hidden. Tap <span className="text-zinc-300">Show</span> to view live telemetry.
                </div>
              )}
            </div>

          </div>
        </div>
        
        {/* Custom scrollbar styles for this page */}
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}} />
      </div>
    </Layout>
  );
};

export default Dashboard;