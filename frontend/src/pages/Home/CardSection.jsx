import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CardSection = () => {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const textRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            imageRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        ).fromTo(
            textRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
            "-=0.8"
        );

        // Floating image animation
        gsap.to(imageRef.current, {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Moving glow animation
        gsap.to(glowRef.current, {
            x: 100,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-28 px-6 text-white overflow-hidden"
        >
            {/* Grid Background */}
            <div className="absolute inset-0 
        bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] 
        bg-size-[35px_35px] opacity-20"
            />

            {/* Glow */}
            <div
                ref={glowRef}
                className="absolute w-125 h-125 bg-emerald-500/10 blur-[140px] rounded-full top-10 left-1/2 -translate-x-1/2"
            />

            <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

                {/* Image */}
                <div ref={imageRef} className="relative group">
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <video
                            src="/Video1.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>

                <div className="absolute inset-0 rounded-2xl border border-emerald-500/20 pointer-events-none"></div>
            </div>

            <div ref={textRef}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Monitor APIs in Real-Time
                </h2>

                <p className="text-gray-400 mb-6 leading-relaxed">
                    DevPulse helps you monitor uptime, response time, failures and
                    performance of your APIs with real-time analytics and alerts.
                    Get instant notifications and detailed performance insights.
                </p>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <p className="text-gray-300">Real-time uptime monitoring</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <p className="text-gray-300">Performance analytics dashboard</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <p className="text-gray-300">Instant failure alerts</p>
                    </div>
                </div>

                <button className="mt-6 px-6 py-3 rounded-xl bg-linear-to-r from-green-400 to-emerald-500 text-black font-semibold hover:opacity-90 transition">
                    Learn More
                </button>
            </div>

        </div>
    </section >
  );
};

export default CardSection;