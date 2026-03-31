"use client";
import { useRef } from "react";

const upgrades = [
    {
        title: "Email Notifications",
        description:
            "Get instant email alerts when your API goes down or response time increases.",
    },
    {
        title: "Monitor Logs History",
        description:
            "View detailed logs of downtime events, response time spikes and failures.",
    },
    {
        title: "Response Time Analytics",
        description:
            "Advanced charts and analytics for performance monitoring and trends.",
    },
    {
        title: "Global Monitoring Nodes",
        description:
            "Monitor your APIs from multiple regions across the world.",
    },
    {
        title: "Team Workspaces",
        description:
            "Invite team members and manage monitors together.",
    },
    {
        title: "Docker Deployment",
        description:
            "Self-host DevPulse using Docker for full control and privacy.",
    },
];

const FutureSection = () => {
    const sectionRef = useRef(null);

    return (
        <section className="bg-black text-white py-28 px-6" ref={sectionRef}>
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        Coming Next for DevPulse
                    </h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        We are continuously improving DevPulse with powerful new features and upgrades.
                    </p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upgrades.map((item, index) => (
                        <div
                            key={index}
                            className="future-card relative p-7 rounded-2xl border border-dashed border-white/20 
              bg-linear-to-b from-white/3 to-white/1
              hover:border-green-500/40 transition duration-300"
                        >
                            <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                Coming Soon
                            </span>

                            <h3 className="text-lg font-semibold mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FutureSection;