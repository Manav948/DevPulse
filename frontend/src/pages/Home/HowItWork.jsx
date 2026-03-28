import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
    {
        number: "01",
        icon: "👤",
        title: "Create Your Account",
        desc: "Sign up in seconds. No credit card required. Get instant access to your personal monitoring dashboard.",
        tag: "2 minutes",
    },
    {
        number: "02",
        icon: "🔗",
        title: "Add API Endpoints",
        desc: "Paste your API URL and configure check intervals, HTTP method, headers, and expected status codes.",
        tag: "1 step",
    },
    {
        number: "03",
        icon: "📡",
        title: "Monitor in Real-Time",
        desc: "DevPulse pings your endpoints globally every 60 seconds and records uptime, latency, and failure reasons.",
        tag: "Always on",
    },
    {
        number: "04",
        icon: "🔔",
        title: "Get Instant Alerts",
        desc: "When something breaks, you'll know immediately via email, Slack, or SMS — before your users even notice.",
        tag: "< 60s detection",
    },
    {
        number: "05",
        icon: "📊",
        title: "Analyse & Report",
        desc: "Dive into response-time charts, uptime history, and incident timelines to identify patterns and bottlenecks.",
        tag: "90-day history",
    },
    {
        number: "06",
        icon: "🚀",
        title: "Improve Reliability",
        desc: "Use actionable insights to ship faster, with confidence your APIs stay healthy and your users stay happy.",
        tag: "Continuous",
    },
];

const HowItWorks = () => {
    const navigate = useNavigate();
    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("hiw-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        cardRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative py-24 px-4 sm:px-6 bg-black text-white overflow-hidden">

            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right,#1a1a1a 1px,transparent 1px),linear-gradient(to bottom,#1a1a1a 1px,transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />


            <div className="absolute w-150 h-150 bg-emerald-500/10 blur-[160px] rounded-full -top-32 left-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute w-72 h-72 bg-green-400/8 blur-[120px] rounded-full bottom-0 right-10 pointer-events-none" />

            <div className="relative max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full border border-green-500/30 text-green-400 text-xs mb-4 tracking-wider uppercase">
                        Simple · Powerful · Instant
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                        How{" "}
                        <span className="bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            DevPulse
                        </span>{" "}
                        Works
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm sm:text-base">
                        From signup to first alert in under five minutes.
                    </p>
                </div>


                <div className="hidden md:block relative">

                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-linear-to-b from-emerald-500/60 via-emerald-500/20 to-transparent" />

                    <div className="space-y-12">
                        {steps.map((step, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div
                                    key={i}
                                    ref={(el) => (cardRefs.current[i] = el)}
                                    className={`hiw-card flex items-center gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"
                                        }`}
                                    style={{ transitionDelay: `${i * 80}ms` }}
                                >
                                    <div className="w-[46%]">
                                        <div
                                            className={`group p-6 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm
                        hover:border-emerald-500/40 hover:bg-white/6 hover:shadow-[0_0_40px_rgba(34,197,94,0.12)]
                        transition-all duration-300 ${isLeft ? "mr-auto" : "ml-auto"}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <span className="text-3xl">{step.icon}</span>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-emerald-500/60 text-xs font-mono">
                                                            {step.number}
                                                        </span>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            {step.tag}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-white mb-1">
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm leading-relaxed">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-[8%] flex justify-center">
                                        <div className="w-10 h-10 rounded-full bg-black border-2 border-emerald-500 flex items-center justify-center z-10 shadow-[0_0_16px_rgba(52,211,153,0.5)]">
                                            <span className="text-emerald-400 text-xs font-bold">{i + 1}</span>
                                        </div>
                                    </div>

                                    <div className="w-[46%]" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="md:hidden relative pl-10">

                    <div className="absolute left-4 top-2 bottom-2 w-px bg-linear-to-b from-emerald-500/60 via-emerald-500/20 to-transparent" />

                    <div className="space-y-8">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                ref={(el) => (cardRefs.current[steps.length + i] = el)}
                                className="hiw-card relative"
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className="absolute -left-6.5 top-5 w-8 h-8 rounded-full bg-black border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(52,211,153,0.5)] z-10">
                                    <span className="text-emerald-400 text-xs font-bold">{i + 1}</span>
                                </div>

                                <div className="p-5 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm
                  hover:border-emerald-500/40 hover:bg-white/6 transition-all duration-300">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{step.icon}</span>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-emerald-500/60 text-xs font-mono">{step.number}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    {step.tag}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-16">
                    <button
                        onClick={() => navigate("/signin")}
                        className="px-8 py-3.5 rounded-xl bg-linear-to-r from-green-400 to-emerald-500
              text-black font-semibold hover:opacity-90 hover:scale-105 active:scale-95
              transition-all duration-200 shadow-[0_0_30px_rgba(52,211,153,0.3)]"
                    >
                        Start Monitoring Free →
                    </button>
                </div>
            </div>

            <style>{`
        .hiw-card {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .hiw-card.hiw-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
        </section>
    );
};

export default HowItWorks;