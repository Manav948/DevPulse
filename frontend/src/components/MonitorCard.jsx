import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate} from "react-router-dom"
import {
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";
import api from "../lib/axios";
import { EllipsisVertical } from "lucide-react";
import toast from "react-hot-toast";

const MonitorCard = ({ monitor, onDelete }) => {
    const [data, setData] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const [responseTime] = useState(() => Math.floor(Math.random() * 900 + 100));
    const menuRef = useRef();
    const navigate = useNavigate();

    const isUp = monitor.lastStatus === "UP";

    useEffect(() => {
        let direction = 1;
        let velocity = 2;

        const interval = setInterval(() => {
            setData((prev) => {
                const last = prev.length ? prev[prev.length - 1].value : 50;

                velocity += (Math.random() - 0.5) * 0.3;
                velocity = Math.max(1, Math.min(4, velocity));

                if (Math.random() < 0.2) {
                    direction *= -1;
                }

                let newValue = last + direction * velocity;

                if (isUp) newValue += 0.5;
                else newValue -= 0.5;

                newValue = Math.max(10, Math.min(100, newValue));

                return [...prev, { value: newValue }].slice(-40);
            });
        }, 250);

        return () => clearInterval(interval);
    }, [isUp]);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/v1/monitor/${monitor._id}`);
            onDelete(monitor._id)
            toast.success("Monitor Deleted Successfully")
        } catch (error) {
            console.log(error);
            toast.error("Monitor not Deleted");
        }
    }

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const createdDate = new Date(monitor.createdAt).toLocaleDateString();

    return (
        <div className="relative group">
            <Link
                to={`/monitor/${monitor._id}`}
                className="relative block overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 pr-12 shadow-lg backdrop-blur-md transition-all hover:border-[#22c55e]/25 hover:shadow-[0_12px_40px_rgba(34,197,94,0.12)]"
            >

            <div className="mb-1 relative z-10">
                <p className="text-xs text-gray-400">Total Response</p>
                <h2 className="text-2xl font-bold text-white">
                    {responseTime} ms
                </h2>
            </div>

            <div className="h-20 mb-2 relative z-10" style={{ minHeight: "80px", margin: "0 -20px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`color-${isUp ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isUp ? "#22c55e" : "#ef4444"}
                            fill={`url(#color-${isUp ? 'up' : 'down'})`}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive
                            animationDuration={200}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-start gap-3 relative z-10 mt-2">
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white leading-tight wrap-break-word line-clamp-2">
                        {monitor.title}
                    </h3>
                    <p className="text-xs text-gray-400 break-all line-clamp-2 mt-1 leading-relaxed">{monitor.url}</p>
                </div>

                <span className={`shrink-0 px-3 py-1 text-xs rounded-full ${isUp
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                    }`}>
                    {monitor.lastStatus}
                </span>
            </div>


            <div className="mt-4 text-xs text-gray-400 flex justify-between">
                <span>Created: {createdDate}</span>
                <span>
                    {monitor.lastCheckedAt
                        ? new Date(monitor.lastCheckedAt).toLocaleTimeString()
                        : "Not checked"}
                </span>
            </div>
            </Link>

            <div className="absolute top-4 right-4 z-20 cursor-pointer" ref={menuRef}>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenu(!openMenu);
                    }}
                    className="rounded-lg p-1 text-white transition hover:bg-white/10"
                    aria-label="Monitor actions"
                >
                    <EllipsisVertical className="h-5 w-5" />
                </button>

                {openMenu && (
                    <div className="absolute right-0 mt-2 w-32 rounded-lg border border-green-900/70 bg-black/95 shadow-lg backdrop-blur-md z-30">

                        <button
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenMenu(false);
                                navigate(`/update/${monitor._id}`);
                            }}
                        >
                            Update
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete();
                                setOpenMenu(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20"
                        >
                            Delete
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default MonitorCard;