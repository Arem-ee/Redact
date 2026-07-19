"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { InteractiveBlockExplorer } from "./InteractiveBlockExplorer";
import { InteractiveDuressDemo } from "./InteractiveDuressDemo";
import { BrandWordmark } from "./BrandWordmark";
import { DissolvingAddress } from "./DissolvingAddress";
import { FakeExplorerDemo } from "./FakeExplorerDemo";
import { useInView } from "./useInView";

function AnimatedCountUp({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [ref, inView] = useInView(0.5);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const dur = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(ease * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

const GAS_FEES = ["$12.48", "$4.90", "$0.82", "<$0.01"];

function GasFeeCountdown() {
  const [ref, inView] = useInView(0.5);
  const [phase, setPhase] = useState(0);
  const values = GAS_FEES;
  const phases = useRef(false);

  useEffect(() => {
    if (!inView || phases.current) return;
    phases.current = true;

    values.forEach((_, i) => {
      setTimeout(() => setPhase(i + 1), i * 400 + 200);
    });
  }, [inView, values]);

  return (
    <span ref={ref}>
      {values[Math.min(phase, values.length - 1)]}
    </span>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const [howRef, howInView] = useInView(0.2);
  const [duressRef, duressInView] = useInView(0.2);
  const [monadRef, monadInView] = useInView(0.2);
  const [trustRef, trustInView] = useInView(0.2);
  const [problemRef, problemInView] = useInView(0.15);
  const [explorerRef, explorerInView] = useInView(0.2);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 70;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  const steps = [
    {
      id: "deposit",
      number: "01",
      title: "Deposit",
      desc: "Send stablecoins into your private balance. They leave the public ledger the moment they arrive.",
      detail: "Your funds leave the public ledger instantly. No waiting, no traces.",
    },
    {
      id: "hold",
      number: "02",
      title: "Hold",
      desc: "Your balance is yours to see. No one else can read it.",
      detail: "Read your balance anytime. No one else can.",
    },
    {
      id: "reveal",
      number: "03",
      title: "Reveal, on your terms",
      desc: "Withdraw when you need to. Nothing is exposed until you choose to move it.",
      detail: "Withdraw to any address. Your privacy, your schedule.",
    },
  ];

  const trustItems = [
    {
      title: "Non-custodial",
      desc: "Redact never holds your keys or your funds. Your account is yours alone. Keys never leave your browser.",
    },
    {
      title: "Duress mode",
      desc: "Set a duress PIN. If you are forced to open the app, entering it shows a low harmless balance instead of your real one. No visible difference.",
    },
    {
      title: "Real privacy, not just UI hiding",
      desc: "Balances are encrypted on-chain, not visually hidden. Nobody, including us, can see your holdings by looking at the blockchain.",
    },
  ];

  return (
    <div className="min-h-screen bg-studio text-ink font-sans antialiased selection:bg-redact selection:text-white">

      <header
        id="app-header"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-studio/95 backdrop-blur-md border-b border-line/[0.06] shadow-[0_1px_0_0_rgba(0,0,0,0.02)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
          <button
            id="brand-wordmark"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
          >
            <BrandWordmark className="text-lg tracking-[0.15em]" iconSize="w-5 h-5" />
          </button>

          <div className="flex items-center gap-8">
            <a
              href="https://docs.redact.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-label uppercase tracking-widest text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
            >
              Docs
            </a>
            <button
              id="header-cta-btn"
              onClick={() => router.push("/dashboard")}
              className="bg-redact text-white text-xs font-label uppercase tracking-widest px-5 py-2.5 hover:bg-[#3E1660] focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      <section
        id="hero-section"
        className="pt-28 pb-20 md:pt-32 md:pb-24 bg-studio relative"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#B27AFF]/[0.03] blur-[120px]" />
        </div>

        <div className="max-w-[900px] mx-auto px-8 text-center">
          <div className="mb-6">
            <div className="inline-block px-3 py-1.5 border border-line/[0.06] bg-studio/50">
              <span className="font-label text-[10px] uppercase tracking-[0.12em] text-muted">
                ONCHAIN PRIVACY
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="font-mono text-[clamp(2rem,6vw,4.5rem)] font-semibold text-ink tracking-tight leading-none select-none">
              <DissolvingAddress />
            </div>
          </div>

          <p className="font-display text-xl sm:text-2xl md:text-3xl text-muted leading-snug max-w-xl mx-auto mb-10">
            Redact hides your balance. You decide when it is shown.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-primary-cta"
              onClick={() => router.push("/dashboard")}
              className="bg-redact text-white text-sm font-label uppercase tracking-wider py-4 px-8 hover:bg-[#3E1660] focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-center cursor-pointer"
            >
              Hide your balance
            </button>
            <button
              id="hero-secondary-cta"
              onClick={() => scrollToSection("problem-section")}
              className="text-ink text-sm font-label uppercase tracking-wider py-4 px-6 text-center hover:text-redact cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              See how it works
            </button>
          </div>
        </div>
      </section>

      <section
        id="problem-section"
        className="py-24 md:py-28 bg-studio relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#B27AFF]/[0.02] blur-[100px]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-8">
          <motion.div
            className="max-w-[520px]"
            initial={prefersReducedMotion ? {} : { y: 40, opacity: 0 }}
            animate={problemInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
              THE PROBLEM
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1] mb-6">
              Everyone can already see what you are worth
            </h2>
            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Wallet addresses are public. Balances are public. Every transaction is public. If your address is ever linked to your name, anyone can look up exactly how much crypto you hold. That visibility has led to real extortion, documented cases, rising every year.
            </p>
          </motion.div>

          <div ref={problemRef} className="mt-12">
            <InteractiveBlockExplorer />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-studio flex flex-col items-center justify-center text-center relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#B27AFF]/[0.02] blur-[100px]" />
        </div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="px-8"
        >
          <div className="w-12 h-px bg-line/[0.06] mb-8 mx-auto" />
          <p className="font-display text-2xl sm:text-3xl md:text-4xl text-ink max-w-2xl leading-relaxed tracking-tight italic select-none">
            {prefersReducedMotion ? (
              <span>{"\u201CThe moment your address has a name, your balance has a target.\u201D"}</span>
            ) : (
              <LetterReveal text={"\u201CThe moment your address has a name, your balance has a target.\u201D"} />
            )}
          </p>
          <div className="w-12 h-px bg-line/[0.06] mt-8 mx-auto" />
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-studio relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#B27AFF]/[0.015] blur-[150px]" />
        </div>
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-8 max-w-3xl"
        >
          <p className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.06] tracking-tight">
            Privacy is not hiding.
          </p>
          <p className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-muted leading-[1.06] tracking-tight mt-4">
            It is choosing.
          </p>
        </motion.div>
      </section>

      <section
        id="how-it-works"
        className="py-24 md:py-32 bg-studio relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/4 top-0 w-[400px] h-[400px] rounded-full bg-[#B27AFF]/[0.02] blur-[100px]" />
          <div className="absolute right-1/4 bottom-0 w-[400px] h-[400px] rounded-full bg-[#B27AFF]/[0.015] blur-[100px]" />
        </div>

        <div className="max-w-[1100px] mx-auto px-8">
          <div className="mb-16 md:mb-24">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
              HOW IT WORKS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1] max-w-lg">
              Three steps to on-chain privacy
            </h2>
          </div>

          <div ref={howRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={prefersReducedMotion ? {} : { y: 30, opacity: 0 }}
                animate={howInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                <div className="mb-4">
                  <span className="font-display text-5xl font-semibold text-redact/20 select-none">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed flex-1">
                  {step.desc}
                </p>
                <p className="text-xs text-muted/60 leading-relaxed mt-3 border-t border-line/[0.05] pt-3">
                  {step.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="monad-section"
        className="py-24 md:py-28 bg-studio relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-[-10%] top-0 w-[500px] h-[500px] rounded-full bg-[#B27AFF]/[0.02] blur-[120px]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-8">
          <div ref={monadRef} className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20">
            <motion.div
              className="lg:w-[45%]"
              initial={prefersReducedMotion ? {} : { y: 30, opacity: 0 }}
              animate={monadInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
                INFRASTRUCTURE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1] mb-6">
                Redact runs on Monad. Fast, low-cost, and compatible with the wallets you already use.
              </h2>
              <p className="text-base text-muted leading-relaxed max-w-md">
                Monad delivers the throughput of a centralized database with the verifiability of a public blockchain. Your wallet, your tools, everything you already use, no migration needed.
              </p>
            </motion.div>

            <motion.div
              className="lg:w-[55%]"
              initial={prefersReducedMotion ? {} : { y: 30, opacity: 0 }}
              animate={monadInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid grid-cols-2 gap-0 border border-line/[0.06]">
                <div id="metric-tps" className="p-8 md:p-10 border-r border-b border-line/[0.06] text-right">
                  <span className="font-display text-5xl font-semibold text-redact block mb-1">
                    <AnimatedCountUp value={10000} suffix="+" />
                  </span>
                  <span className="text-xs text-muted uppercase tracking-wider font-label">
                    TPS Capacity
                  </span>
                </div>
                <div id="metric-cost" className="p-8 md:p-10 border-b border-line/[0.06] text-right">
                  <span className="font-display text-5xl font-semibold text-redact block mb-1">
                    <GasFeeCountdown />
                  </span>
                  <span className="text-xs text-muted uppercase tracking-wider font-label">
                    Average Fee
                  </span>
                </div>
                <div id="metric-finality" className="p-8 md:p-10 border-r border-line/[0.06] text-right col-span-1">
                  <span className="font-display text-5xl font-semibold text-redact block mb-1">
                    1s
                  </span>
                  <span className="text-xs text-muted uppercase tracking-wider font-label">
                    Finality
                  </span>
                </div>
                <div id="metric-evm" className="p-8 md:p-10 text-right col-span-1">
                  <span className="font-display text-5xl font-semibold text-redact block mb-1">
                    100%
                  </span>
                  <span className="text-xs text-muted uppercase tracking-wider font-label">
                    EVM Compatible
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 pt-10 border-t border-line/[0.04] flex items-center gap-8 justify-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={monadInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 text-muted/50">
              <span className="text-[10px] font-label uppercase tracking-wider">Built on</span>
              <Image src="/monad-logo.svg" alt="Monad" width={0} height={0} className="h-5 w-auto opacity-60" unoptimized />
            </div>
            <div className="w-px h-6 bg-line/[0.06]" />
            <div className="flex items-center gap-3 text-muted/50">
              <span className="text-[10px] font-label uppercase tracking-wider">Powered by</span>
              <Image src="/unlink-logo.svg" alt="Unlink" width={0} height={0} className="h-5 w-auto opacity-60" unoptimized />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="duress-mode"
        className="py-24 md:py-28 bg-studio relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#B27AFF]/[0.02] blur-[120px]" />
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px]" style={{ opacity: 0.03 }}>
            <svg viewBox="0 0 220 220" className="w-full h-full">
              <circle cx="110" cy="110" r="80" fill="none" stroke="#4B1D73" strokeWidth="0.5" />
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1={110 + 80 * Math.cos((i / 8) * Math.PI * 2)}
                  y1={110 + 80 * Math.sin((i / 8) * Math.PI * 2)}
                  x2={110}
                  y2={110}
                  stroke="#4B1D73"
                  strokeWidth="0.3"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-8">
          <motion.div
            className="max-w-[480px] mb-12"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={duressInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
              PHYSICAL DEFENSE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1] mb-6">
              A second passcode that shows nothing worth taking
            </h2>
          </motion.div>

          <motion.div
            ref={duressRef}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={duressInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <InteractiveDuressDemo />
          </motion.div>
        </div>
      </section>

      <section
        id="explorer-demo"
        className="py-24 md:py-28 bg-studio relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#B27AFF]/[0.015] blur-[150px]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-8">
          <motion.div
            ref={explorerRef}
            initial={prefersReducedMotion ? {} : { scale: 0.97, opacity: 0 }}
            animate={explorerInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
              SEE IT IN ACTION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1] max-w-lg mx-auto">
              A wallet before and after Redact
            </h2>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
            animate={explorerInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <FakeExplorerDemo />
          </motion.div>
        </div>
      </section>

      <section
        id="trust-section"
        className="py-24 md:py-28 bg-studio"
      >
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="max-w-[520px] mb-14">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
              TRUST &amp; SECURITY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1]">
              What Redact does and does not do
            </h2>
          </div>

          <div ref={trustRef} className="space-y-0">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={prefersReducedMotion ? {} : { scale: 0.98, opacity: 0 }}
                animate={trustInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group border-t border-line/[0.05] py-8 md:py-10 ${
                  i === trustItems.length - 1 ? "border-b border-line/[0.05]" : ""
                }`}
              >
                <div className="flex items-start gap-5 md:gap-8 lg:gap-12">
                  <div className="flex-shrink-0 mt-1.5 w-8 h-8 border border-line/[0.08] flex items-center justify-center text-redact/40 group-hover:text-redact/70 transition-colors duration-200">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="0.8">
                      <circle cx="7" cy="7" r="3" />
                      <path d="M14 7q-7-7-14 0" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer
        id="app-footer"
        className="w-full bg-studio text-ink pt-20 pb-12 mt-16 relative overflow-hidden"
      >
        <div className="absolute right-[-5%] bottom-[-10%] text-[12rem] sm:text-[18rem] md:text-[24rem] lg:text-[30rem] font-display font-black text-ink/[0.02] pointer-events-none select-none tracking-tighter leading-none z-0 uppercase">
          REDACT
        </div>

        <div className="max-w-[1100px] mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 md:gap-16">
            <div className="space-y-4 md:max-w-xs">
              <BrandWordmark className="text-xl tracking-[0.15em]" iconSize="w-6 h-6" />
              <p className="text-sm text-muted leading-relaxed">
                Your balance stays yours until you decide otherwise.
              </p>
              <div className="space-y-1">
                <p className="text-xs text-muted/60">
                  Non-custodial. Your keys, your account, always.
                </p>
                <p className="text-xs text-muted/60">
                  <a
                    href="https://testnet.monadexplorer.com/address/0x56a6ecda04b8bfd38c6d1d4d38f2b1867c29a4a7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-redact transition-colors duration-150 group"
                  >
                    <span>Contract verified on Monad</span>
                    <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-12 md:gap-16">
              <div className="space-y-4">
                <h4 className="font-label text-xs uppercase tracking-[0.04em] text-muted/50 font-bold">
                  Product
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => scrollToSection("how-it-works")}
                      className="text-sm text-muted hover:text-ink transition-colors cursor-pointer focus:outline-none"
                    >
                      Deposit
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("duress-mode")}
                      className="text-sm text-muted hover:text-ink transition-colors cursor-pointer focus:outline-none"
                    >
                      Duress mode
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("how-it-works")}
                      className="text-sm text-muted hover:text-ink transition-colors cursor-pointer focus:outline-none"
                    >
                      How it works
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-label text-xs uppercase tracking-[0.04em] text-muted/50 font-bold">
                  Elsewhere
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://github.com/redact-privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-ink inline-flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                    >
                      Github <ArrowUpRight size={12} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/redact_privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-ink inline-flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                    >
                      X <ArrowUpRight size={12} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-line/[0.05] mt-16 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted/60 text-center md:text-left">
              &copy; 2026 Redact. Built on Monad.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LetterReveal({ text }: { text: string }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <span className="inline">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.03, delay: i * 0.015 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
