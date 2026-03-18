import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";

const MonitorCard = ({ monitor }) => {
    const [data, setData] = useState([]);

    const isUp = monitor.lastStatus === "UP";

    //graph
    useEffect(() => {
        let direction = 1;
        let velocity = 2;

        const interval = setInterval(() => {
            setData((prev) => {
                const last = prev.length ? prev[prev.length - 1].value : 50;

                // small smooth velocity change
                velocity += (Math.random() - 0.5) * 0.3;
                velocity = Math.max(1, Math.min(4, velocity));

                // zig-zag
                if (Math.random() < 0.2) {
                    direction *= -1;
                }

                let newValue = last + direction * velocity;

                // slight bias
                if (isUp) {
                    newValue += 0.5;
                } else {
                    newValue -= 0.5;
                }

                // clamp
                newValue = Math.max(10, Math.min(100, newValue));

                return [...prev, { value: newValue }].slice(-40);
            });
        }, 250);

        return () => clearInterval(interval);
    }, [isUp]);

    const createdDate = new Date(monitor.createdAt).toLocaleDateString();

    return (
        <div className="relative bg-black border border-white/10 rounded-2xl p-5 
      shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-xl transition-all duration-300">
            <div className={`absolute inset-0 rounded-2xl blur-2xl opacity-10 ${isUp ? "bg-green-500" : "bg-red-500"
                }`} />
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
                            isAnimationActive={true}
                            animationDuration={200}
                            animationEasing="ease-out"
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