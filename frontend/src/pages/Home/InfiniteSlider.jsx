import { useEffect, useRef } from "react";


const row1 = [
  { icon: "⚡", label: "99.9% Uptime", sub: "SLA Guaranteed" },
  { icon: "🔔", label: "Instant Alerts", sub: "SMS · Email · Slack" },
  { icon: "🌍", label: "Global Nodes", sub: "12 Regions" },
  { icon: "📊", label: "Live Analytics", sub: "Real-time charts" },
  { icon: "🔒", label: "SSL Monitoring", sub: "Certificate expiry" },
  { icon: "🕐", label: "60s Intervals", sub: "Fastest checks" },
  { icon: "🤖", label: "AI Anomaly", sub: "Smart detection" },
  { icon: "🔗", label: "REST & GraphQL", sub: "Any endpoint" },
];

const row2 = [
  { icon: "📈", label: "Response Time", sub: "p95 tracking" },
  { icon: "🛡️", label: "DDoS Guard", sub: "Protected by default" },
  { icon: "🧪", label: "Status Pages", sub: "Public & private" },
  { icon: "🔄", label: "Auto-Retry", sub: "Flap detection" },
  { icon: "📱", label: "Mobile App", sub: "iOS & Android" },
  { icon: "🎯", label: "Custom Headers", sub: "Auth support" },
  { icon: "💬", label: "Team Alerts", sub: "Shared on-call" },
  { icon: "🌐", label: "Multi-Protocol", sub: "HTTP · TCP · DNS" },
];


const makeTrack = (items) => [...items, ...items];

const Card = ({ icon, label, sub }) => (
  <div
    className="shrink-0 flex items-center gap-3 mx-3
      px-5 py-3 rounded-2xl
      bg-white/4 border border-white/10
      backdrop-blur-sm
      shadow-[0_0_20px_rgba(34,197,94,0.06)]
      hover:border-green-500/40 hover:bg-white/[0.07]
      hover:shadow-[0_0_30px_rgba(34,197,94,0.18)]
      transition-all duration-300 cursor-default"
  >
    <span className="text-2xl leading-none">{icon}</span>
    <div>
      <p className="text-white text-sm font-semibold leading-tight whitespace-nowrap">
        {label}
      </p>
      <p className="text-gray-500 text-xs leading-tight whitespace-nowrap">
        {sub}
      </p>
    </div>
  </div>
);

const InfiniteSlider = () => {
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  /* Pause animation on hover */
  const handleMouseEnter = (ref) => {
    if (ref.current) ref.current.style.animationPlayState = "paused";
  };
  const handleMouseLeave = (ref) => {
    if (ref.current) ref.current.style.animationPlayState = "running";
  };

  return (
    <section className="relative py-20 overflow-hidden bg-black md:mt-20">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-emerald-500/10 blur-[140px] rounded-full top-0 left-1/4" />
        <div className="absolute w-80 h-80 bg-green-400/8 blur-[120px] rounded-full bottom-0 right-1/4" />
      </div>

      <div className="text-center mb-12 relative z-10 px-4">
        {/* <span className="inline-block px-4 py-1 rounded-full border border-green-500/30 text-green-400 text-xs mb-4">
          Trusted by Engineering Teams
        </span> */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Everything you need to{" "}
          <span className="bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            stay online
          </span>
        </h2>
        <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-lg mx-auto">
          A complete observability toolkit — from uptime checks to AI-powered
          anomaly detection.
        </p>
      </div>

      <div
        className="relative overflow-hidden mb-4"
        onMouseEnter={() => handleMouseEnter(track1Ref)}
        onMouseLeave={() => handleMouseLeave(track1Ref)}
      >

        <div className="absolute left-0 top-0 bottom-0 w-24 z-10
          bg-linear-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10
          bg-linear-to-l from-black to-transparent pointer-events-none" />

        <div
          ref={track1Ref}
          className="flex infinite-scroll-left"
          style={{ width: "max-content" }}
        >
          {makeTrack(row1).map((item, i) => (
            <Card key={i} {...item} />
          ))}
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => handleMouseEnter(track2Ref)}
        onMouseLeave={() => handleMouseLeave(track2Ref)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10
          bg-linear-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10
          bg-linear-to-l from-black to-transparent pointer-events-none" />

        <div
          ref={track2Ref}
          className="flex infinite-scroll-right"
          style={{ width: "max-content" }}
        >
          {makeTrack(row2).map((item, i) => (
            <Card key={i} {...item} />
          ))}
        </div>
      </div>

      {/* Inline keyframes injected via style tag */}
      <style>{`
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .infinite-scroll-left {
          animation: scrollLeft 35s linear infinite;
        }
        .infinite-scroll-right {
          animation: scrollRight 35s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default InfiniteSlider;
