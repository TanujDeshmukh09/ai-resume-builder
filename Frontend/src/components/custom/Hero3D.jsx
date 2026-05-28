import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// ── Floating document card (pure CSS/SVG 3D) ──────────────────────────────────
function ResumeCard3D({ style, accentColor, delay, lines = 5, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="absolute"
      style={{ ...style, transformStyle: "preserve-3d" }}
    >
      {/* Floating animation loop */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5 + delay, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card face */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: "160px",
            height: "210px",
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            boxShadow: `0 25px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.8)`,
          }}
        >
          {/* Header strip */}
          <div style={{ background: accentColor, height: "38px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <div className="w-5 h-5 rounded-full bg-white/30" />
            <div className="flex-1 h-2 rounded-full bg-white/40" />
          </div>

          {/* Content stubs */}
          <div className="p-3 flex flex-col gap-2 mt-1">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  height: "8px",
                  width: i % 3 === 0 ? "90%" : i % 3 === 1 ? "70%" : "80%",
                  background: i === 0 ? accentColor + "55" : "#e5e7eb",
                }}
              />
            ))}

            {/* Skills chips */}
            <div className="flex gap-1 mt-1 flex-wrap">
              {["React", "AI", "PDF"].map((s) => (
                <span
                  key={s}
                  className="text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: accentColor }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Label badge */}
          <div
            className="absolute bottom-3 left-3 right-3 text-center text-[9px] font-bold rounded-lg py-1"
            style={{ background: accentColor + "22", color: accentColor }}
          >
            {label}
          </div>
        </div>

        {/* Card bottom shadow (3D depth illusion) */}
        <div
          className="absolute left-3 right-3 bottom-0 rounded-b-2xl"
          style={{
            height: "20px",
            background: accentColor + "33",
            filter: "blur(12px)",
            transform: "translateY(10px) scaleY(0.5)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Orbiting ring SVG ──────────────────────────────────────────────────────────
function OrbitRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[200, 280, 360].map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }}
          style={{
            width: r,
            height: r,
            borderColor: `rgba(139,92,246,${0.5 - i * 0.1})`,
            borderWidth: "1px",
            borderStyle: "dashed",
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ── Central AI globe (CSS radial gradients) ────────────────────────────────────
function AIGlobe() {
  return (
    <motion.div
      className="absolute"
      style={{
        width: 180,
        height: 180,
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
      }}
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: "scale(1.5)",
        }}
      />
      {/* Globe body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed 50%, #4c1d95 100%)",
          boxShadow:
            "0 0 60px rgba(139,92,246,0.6), inset 0 0 40px rgba(255,255,255,0.15), inset -10px -10px 30px rgba(0,0,0,0.2)",
        }}
      />
      {/* Highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: "50%",
          height: "35%",
          top: "14%",
          left: "15%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.45) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
      {/* AI label */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ color: "white", fontSize: 28, fontWeight: 900, letterSpacing: "-1px", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
      >
        AI
      </div>
    </motion.div>
  );
}

// ── Floating sparkle dots ──────────────────────────────────────────────────────
function Particles() {
  const dots = Array.from({ length: 22 }).map((_, i) => ({
    x: `${10 + Math.sin(i * 37) * 40 + 40}%`,
    y: `${10 + Math.cos(i * 53) * 35 + 40}%`,
    size: 3 + (i % 4),
    delay: (i * 0.3) % 2,
    dur: 2.5 + (i % 3),
    color: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#6366f1", "#818cf8"][i % 5],
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: d.size, height: d.size, left: d.x, top: d.y, background: d.color }}
          animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Main Hero3D component ──────────────────────────────────────────────────────
export default function Hero3D() {
  const containerRef = useRef(null);

  // Mouse-tilt for the whole scene
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      el.style.transform = `perspective(1200px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
    };
    const handleLeave = () => {
      el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      style={{ height: "540px" }}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
          cursor: "grab",
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(139,92,246,0.15) 0%, transparent 70%)",
          }}
        />

        <OrbitRings />
        <Particles />
        <AIGlobe />

        {/* Resume cards */}
        <ResumeCard3D
          style={{ left: "5%", top: "12%" }}
          accentColor="#8b5cf6"
          delay={0.1}
          label="AI Generated"
        />
        <ResumeCard3D
          style={{ right: "5%", top: "18%" }}
          accentColor="#3b82f6"
          delay={0.25}
          label="ATS Optimized"
        />
        <ResumeCard3D
          style={{ left: "38%", bottom: "4%", transform: "scale(0.82)" }}
          accentColor="#10b981"
          delay={0.4}
          lines={4}
          label="Download PDF"
        />
      </div>
    </div>
  );
}
