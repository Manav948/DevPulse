import React, { useEffect, useState, useRef } from "react";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";
import api from "../lib/axios";
import { EllipsisIcon, EllipsisVertical } from "lucide-react";
import toast from "react-hot-toast";

const MonitorCard = ({ monitor, onDelete }) => {
    const [data, setData] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef();

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
        <div className="relative bg-black border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">

            <div className={`absolute inset-0 rounded-2xl blur-2xl opacity-10 ${isUp ? "bg-green-500" : "bg-red-500"}`} />

            <div className="absolute top-4 right-4 cursor-pointer" ref={menuRef}>
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="text-white text-lg cursor-pointer"
                >
                    <EllipsisVertical />
                </button>

                {openMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-black border border-green-900/70 rounded-lg shadow-lg z-10 cursor-pointer">

                        <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 text-white"
                        >
                            Update
                        </button>

                        <button
                            onClick={handleDelete}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500/20 text-red-400"
                        >
                            Delete
                        </button>

                    </div>
                )}
            </div>

            <div className="mb-3">
                <p className="text-xs text-gray-400">Total Response</p>
                <h2 className="text-2xl font-bold text-white">
                    {Math.floor(Math.random() * 900 + 100)} ms
                </h2>
            </div>

            <div className="h-24 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <Area
                            type="linear"
                            dataKey="value"
                            stroke={isUp ? "#00ff9c" : "#ff4d4f"}
                            fill={isUp ? "rgba(0,255,156,0.15)" : "rgba(255,77,79,0.15)"}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive
                            animationDuration={200}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        {monitor.title}
                    </h3>
                    <p className="text-xs text-gray-400">{monitor.url}</p>
                </div>

                <span className={`px-3 py-1 text-xs rounded-full ${isUp
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
        </div>
    );
};

export default MonitorCard;