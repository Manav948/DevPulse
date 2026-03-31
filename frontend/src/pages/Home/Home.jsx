import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Header from "../../components/Header";
import CardSection from "./CardSection";
import Footer from "./Footer";
import Hero from "./Hero";
import HowItWorks from "./HowItWork";
import InfiniteSlider from "./InfiniteSlider";
import Features from "./UpComing";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const wrapperRef = useRef(null);
  const sliderRef = useRef(null);
  const cardRef = useRef(null);
  const howItRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Lenis smooth scroll scoped to the Home wrapper ──
    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: wrapperRef.current,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // RAF loop
    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    // Sync Lenis with GSAP ticker
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const scroller = wrapperRef.current;
    const shared = {
      scroller,
      toggleActions: "play none none reverse",
    };

    const ctx = gsap.context(() => {
      //  Infinite Slider section
      if (sliderRef.current) {
        gsap.fromTo(
          sliderRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: sliderRef.current, start: "top 88%", ...shared },
          }
        );
      }

      // Card / Video section — slide in from sides 
      if (cardRef.current) {
        const img = cardRef.current.querySelector("[data-anim='img']");
        const txt = cardRef.current.querySelector("[data-anim='txt']");

        if (img) {
          gsap.fromTo(img,
            { x: -80, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power3.out",
              scrollTrigger: { trigger: cardRef.current, start: "top 82%", ...shared } }
          );
        }
        if (txt) {
          gsap.fromTo(txt,
            { x: 80, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.15,
              scrollTrigger: { trigger: cardRef.current, start: "top 82%", ...shared } }
          );
        }
      }

      if (howItRef.current) {
        const cards = howItRef.current.querySelectorAll(".hiw-card");
        if (cards.length) {

          cards.forEach((c) => {
            c.style.opacity = "0";
            c.style.transform = "translateY(40px)";
          });

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: howItRef.current, start: "top 85%", ...shared },
          });
        }
      }

      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll(".future-card");
        if (items.length) {
          gsap.fromTo(items,
            { opacity: 0, y: 60, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: "power2.out",
              scrollTrigger: { trigger: featuresRef.current, start: "top 85%", ...shared },
            }
          );
        }
      }

      if (footerRef.current) {
        gsap.fromTo(footerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: footerRef.current, start: "top 95%", ...shared },
          }
        );
      }
    }, wrapperRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="bg-black min-h-screen text-white overflow-y-auto"
      style={{ height: "100vh" }}
    >
      <Header />

      <div>
        <Hero />

        <div ref={sliderRef}>
          <InfiniteSlider />
        </div>

        <div ref={cardRef}>
          <CardSection />
        </div>

        <div ref={howItRef}>
          <HowItWorks />
        </div>

        <div ref={featuresRef}>
          <Features />
        </div>
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
