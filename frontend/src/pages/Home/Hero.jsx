import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Hero = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const rotatingTextRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    // Entry Animations
    gsap.fromTo(
      badgeRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );

    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    );

    gsap.fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.4 }
    );

    gsap.fromTo(
      buttonRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.6 }
    );

    // Continuous Rotating Text
    gsap.to(rotatingTextRef.current, {
      y: "-50%",
      duration: 7, // speed (increase = slower)
      ease: "linear",
      repeat: -1,
    });

  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden bg-black px-4">
      <div className="absolute inset-0 
        bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] 
        bg-size-[35px_35px] opacity-30" />

      <div className="absolute w-125 sm:w-175 h-125 sm:h-175 bg-emerald-500/20 blur-[120px] rounded-full -top-37.5 left-1/2 -translate-x-1/2" />
      <div className="absolute w-100 sm:w-125 h-100 sm:h-125 bg-green-400/10 blur-[120px] rounded-full -bottom-37.5 right-[5%]" />

      <div className="relative z-10 text-center max-w-4xl">

        <div
          ref={badgeRef}
          className="inline-block mb-4 sm:mb-6 px-4 py-1 mt-10 rounded-full border border-green-500/30 text-green-400 text-xs sm:text-sm"
        >
          Real-time Monitoring Platform
        </div>

        <div className="relative h-15 sm:h-20 md:h-27.5 overflow-hidden">

          <div
            ref={rotatingTextRef}
            className="text-3xl sm:text-5xl md:text-7xl font-bold"
          >
            <div className="h-15 sm:h-20 md:h-27.5 flex items-center justify-center">
              Monitor APIs
            </div>
            <div className="h-15 sm:h-20 md:h-27.5 flex items-center justify-center">
              Track Performance
            </div>
            <div className="h-15 sm:h-20 md:h-27.5 flex items-center justify-center">
              Detect Failures
            </div>
            <div className="h-15 sm:h-20 md:h-27.5 flex items-center justify-center">
              Analyze Uptime
            </div>

            <div className="h-15 sm:h-20 md:h-27.5 flex items-center justify-center">
              Monitor APIs
            </div>
            <div className="h-15 sm:h-20 md:h-27.5 flex items-center justify-center">
              Track Performance
            </div>
            <div className="h-15 sm:h-20 md:h-27.5 flex items-center justify-center">
              Detect Failures
            </div>
            <div className="h-15 sm:h-20 md:h-27.5 flex items-center justify-center">
              Analyze Uptime
            </div>
          </div>
        </div>

        <h1
          ref={titleRef}
          className="mt-4 text-2xl sm:text-4xl md:text-6xl font-bold leading-tight 
          bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent"
        >
          Real-time API Monitoring <br className="hidden sm:block" />
          with DevPulse
        </h1>

        <p
          ref={subtitleRef}
          className="text-gray-400 mt-4 sm:mt-6 text-sm sm:text-lg max-w-xl mx-auto"
        >
          Monitor uptime, response time, failures and performance of your APIs
          with real-time insights and analytics.
        </p>

        <div
          ref={buttonRef}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8"
        >
          <button className="px-6 py-3 rounded-xl bg-linear-to-r from-green-400 to-emerald-500 text-black font-semibold hover:opacity-90 transition">
            Get Started
          </button>

          <button className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition">
            Live Demo
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12 mt-10 sm:mt-14 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold">99.9%</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Uptime Tracking
            </p>
          </div>

          <div>
            <p className="text-xl sm:text-2xl font-bold">200ms</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Avg Response
            </p>
          </div>

          <div>
            <p className="text-xl sm:text-2xl font-bold">24/7</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Monitoring
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;