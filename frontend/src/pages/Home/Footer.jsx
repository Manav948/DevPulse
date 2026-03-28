import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative mt-32 text-gray-400 border-t border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 
        bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] 
        bg-size-[35px_35px] opacity-20" />

      <div className="absolute w-125 h-125 bg-emerald-500/10 blur-[140px] rounded-full -top-60 left-1/2 -translate-x-1/2" />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500 to-transparent opacity-60"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              DevPulse
            </h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Real-time API monitoring platform to track uptime,
              performance, failures and analytics with powerful insights.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-emerald-400 transition cursor-pointer">Monitoring</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Analytics</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Alerts</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Status Pages</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-emerald-400 transition cursor-pointer">About</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Blog</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Careers</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-emerald-400 transition cursor-pointer">Help Center</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Docs</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">API Reference</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Status</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">
            © 2026 DevPulse. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-emerald-400 cursor-pointer transition">Privacy</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Terms</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;