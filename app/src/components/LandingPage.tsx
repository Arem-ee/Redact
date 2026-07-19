"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Shield, CheckCircle } from "lucide-react";
import { BrandWordmark } from "./BrandWordmark";
import { DissolvingAddress } from "./DissolvingAddress";
import { useInView } from "./useInView";

function PinDot({ filled }: { filled: boolean }) {
  return (
    <div
      className={`w-3 h-3 border transition-colors duration-150 ${
        filled ? "bg-redact border-redact" : "border-line bg-transparent"
      }`}
    />
  );
}

function MiniBalanceMockup() {
  return (
    <div className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] rounded-none p-5 max-w-[280px] mx-auto">
      <p className="font-label text-[10px] uppercase tracking-[0.06em] text-muted mb-3">Your balance</p>
      <div className="min-h-[54px]">
        <div className="font-display font-bold text-xl text-ink tracking-tight relative inline-block cursor-default select-none">
          <span style={{ filter: "blur(3px)", opacity: 0.25 }}>$$•••,•••,•••.00</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="flex-1 bg-redact/10 h-8" />
        <div className="flex-1 border border-redact/10 h-8" />
      </div>
    </div>
  );
}

function MiniPinMockup() {
  return (
    <div className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] rounded-none p-6 max-w-[240px] mx-auto space-y-4">
      <h3 className="font-display font-bold text-sm text-ink text-center">Enter PIN</h3>
      <div className="flex justify-center gap-2.5">
        <PinDot filled />
        <PinDot filled />
        <PinDot filled />
        <PinDot filled />
      </div>
    </div>
  );
}

function MiniConfirmMockup() {
  return (
    <div className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] rounded-none p-5 max-w-[280px] mx-auto space-y-3">
      <p className="font-label text-[10px] uppercase tracking-[0.06em] text-muted">Withdraw</p>
      <div className="bg-studio border border-line/[0.06] p-3">
        <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-700" />
          <p className="font-sans text-xs text-emerald-700 font-semibold">Withdraw confirmed</p>
        </div>
        <p className="font-mono text-[10px] text-muted break-all mt-1">tx: 0xa0c8...</p>
      </div>
    </div>
  );
}

function MiniDepositMockup() {
  return (
    <div className="bg-white shadow-[0_2px_16px_rgba(26,21,32,0.04)] rounded-none p-5 max-w-[280px] mx-auto space-y-3">
      <p className="font-label text-[10px] uppercase tracking-[0.06em] text-muted">Deposit</p>
      <div className="space-y-2">
        <div className="border border-line/[0.08] bg-studio px-3 py-2 font-sans text-[11px] text-muted">0x0000...</div>
        <div className="border border-line/[0.08] bg-studio px-3 py-2 font-sans text-[11px] text-muted">100.0</div>
      </div>
      <div className="bg-redact text-white text-[10px] font-label uppercase tracking-wider text-center py-2.5">Deposit</div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line/[0.06]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2"
      >
        <span className="font-display text-lg text-ink pr-4">{question}</span>
        <span className={`text-muted transition-transform duration-200 shrink-0 ${open ? "rotate-45" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-4">
          <p className="font-sans text-sm text-muted leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const [privacyRef, privacyInView] = useInView(0.15);
  const [trustRef, trustInView] = useInView(0.15);
  const [howRef, howInView] = useInView(0.15);
  const [faqRef, faqInView] = useInView(0.15);

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
      Mini: MiniDepositMockup,
    },
    {
      id: "hold",
      number: "02",
      title: "Hold",
      desc: "Your balance is yours to see. No one else can read it.",
      detail: "Read your balance anytime. No one else can.",
      Mini: MiniBalanceMockup,
    },
    {
      id: "reveal",
      number: "03",
      title: "Reveal, on your terms",
      desc: "Withdraw when you need to. Nothing is exposed until you choose to move it.",
      detail: "Withdraw to any address. Your privacy, your schedule.",
      Mini: MiniConfirmMockup,
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
    {
      title: "Built on Monad and Unlink",
      desc: "Monad delivers throughput and verifiability. Unlink handles the cryptography. Redact is the surface you actually use.",
    },
  ];

  const faqs = [
    {
      q: "Who can see my balance?",
      a: "No one. Your balance is encrypted on-chain. Not us, not the network, not anyone looking at the blockchain explorer. You are the only person who can read it.",
    },
    {
      q: "What happens if I forget my PIN?",
      a: "The PIN is client-side only. It controls what the app displays, not what exists on-chain. You can recover by disconnecting and reconnecting your wallet, the PIN lock is local to your browser session.",
    },
    {
      q: "Is Redact non-custodial?",
      a: "Yes. Your keys stay in your browser at all times. Redact never holds them. Deposits and withdrawals are signed by your wallet directly.",
    },
    {
      q: "Does duress mode look different from the real view?",
      a: "No. The duress PIN shows the same layout, same structure, same styling. The only thing different is the balance number and the activity list. There is no indicator that duress mode is active.",
    },
  ];

  const privacyCards = [
    {
      label: "Balance",
      headline: "Your balance is hidden by default",
      body: "Numbers stay blurred until you hover. After a few seconds, it dissolves back. No one over your shoulder sees anything.",
      tint: "bg-[#F2EFF6]",
      Mini: MiniBalanceMockup,
    },
    {
      label: "PIN lock",
      headline: "Four digits between your wallet and your vault",
      body: "Every time you connect, you enter a PIN. Without it, the vault stays locked. Nothing leaks before you authenticate.",
      tint: "bg-[#F8F6F2]",
      Mini: MiniPinMockup,
    },
    {
      label: "Withdraw",
      headline: "Move funds back out, on your terms",
      body: "Nothing is exposed until you choose to withdraw. Send to any address, any time. The chain sees a fresh transaction with no history.",
      tint: "bg-[#F0EDF5]",
      Mini: MiniConfirmMockup,
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
              href="/docs"
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
        className="pt-28 pb-16 md:pt-36 md:pb-20 bg-studio relative"
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

          <div className="mb-6">
            <div className="font-mono text-[clamp(2rem,6vw,4.5rem)] font-semibold text-ink tracking-tight leading-none select-none">
              <DissolvingAddress />
            </div>
          </div>

          <p className="font-display text-xl sm:text-2xl md:text-3xl text-muted leading-snug max-w-xl mx-auto mb-8">
            Redact hides your balance. You decide when it is shown.
          </p>

          <p className="font-sans text-base text-muted max-w-md mx-auto mb-8 leading-relaxed">
            Wallet addresses are public. If your address is ever linked to your name, anyone can look up exactly what you hold. That visibility has real consequences.
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
              onClick={() => scrollToSection("privacy-section")}
              className="text-ink text-sm font-label uppercase tracking-wider py-4 px-6 text-center hover:text-redact cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              See how it works
            </button>
          </div>
        </div>
      </section>

      <section
        id="privacy-section"
        className="py-24 md:py-32 bg-studio"
      >
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="mb-14">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
              YOUR PRIVACY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1] max-w-lg">
              Your balance stays yours
            </h2>
          </div>

          <div ref={privacyRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {privacyCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={prefersReducedMotion ? {} : { y: 30, opacity: 0 }}
                animate={privacyInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`${card.tint} p-8 h-full flex flex-col`}>
                  <span className="font-label text-[10px] uppercase tracking-[0.08em] text-muted mb-6">
                    {card.label}
                  </span>
                  <div className="mb-8">
                    <card.Mini />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink mb-3 leading-tight">
                    {card.headline}
                  </h3>
                  <p className="font-sans text-sm text-muted leading-relaxed">
                    {card.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="trust-section"
        className="py-24 md:py-32 bg-[#15101A] relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#B27AFF]/[0.04] blur-[180px]" />
        </div>

        <div ref={trustRef} className="max-w-[1200px] mx-auto px-8 relative z-10">
          <div className="mb-14">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-white/40 block mb-3">
              BUILT TO BE TRUSTED
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-white tracking-tight leading-[1.1] max-w-lg">
              Privacy that you can verify
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={prefersReducedMotion ? {} : { y: 30, opacity: 0 }}
                animate={trustInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="bg-[#1D1724] p-6 h-full">
                  <div className="w-8 h-8 mb-4 flex items-center justify-center bg-[#2A2332]">
                    <Shield size={14} className="text-[#B27AFF]/70" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-[#B0A8B8] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 pt-10 border-t border-white/[0.06] flex items-center gap-8 justify-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={trustInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 text-[#B0A8B8]/40">
              <span className="text-[10px] font-label uppercase tracking-wider">Built on</span>
              <Image src="/monad-logo.svg" alt="Monad" width={0} height={0} className="h-5 w-auto opacity-50" unoptimized />
            </div>
            <div className="w-px h-6 bg-white/[0.08]" />
            <div className="flex items-center gap-3 text-[#B0A8B8]/40">
              <span className="text-[10px] font-label uppercase tracking-wider">Powered by</span>
              <Image src="/unlink-logo.svg" alt="Unlink" width={0} height={0} className="h-5 w-auto opacity-50" unoptimized />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-24 md:py-32 bg-studio"
      >
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="mb-14">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
              HOW IT WORKS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1] max-w-lg">
              Three steps to on-chain privacy
            </h2>
          </div>

          <div ref={howRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={prefersReducedMotion ? {} : { y: 30, opacity: 0 }}
                animate={howInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`p-8 h-full flex flex-col ${
                  i === 0 ? "bg-[#F2EFF6]" : i === 1 ? "bg-[#F8F6F2]" : "bg-[#F0EDF5]"
                }`}>
                  <div className="mb-6">
                    <step.Mini />
                  </div>
                  <span className="font-display text-5xl font-semibold text-redact/15 select-none mb-3">
                    {step.number}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-ink mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-muted leading-relaxed flex-1">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq-section"
        className="py-24 md:py-32 bg-studio"
      >
        <div className="max-w-[780px] mx-auto px-8">
          <div className="mb-14">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-muted block mb-3">
              QUESTIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] text-ink tracking-tight leading-[1.1]">
              What you might be wondering
            </h2>
          </div>

          <div ref={faqRef}>
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={prefersReducedMotion ? {} : { y: 20, opacity: 0 }}
                animate={faqInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <FaqItem question={faq.q} answer={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cta-section"
        className="py-24 md:py-32 bg-studio relative"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#B27AFF]/[0.02] blur-[150px]" />
        </div>

        <div className="max-w-[700px] mx-auto px-8 text-center relative">
          <p className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.08] tracking-tight mb-6">
            Privacy is not hiding. It is choosing.
          </p>
          <p className="font-sans text-base sm:text-lg text-muted mb-10 max-w-md mx-auto leading-relaxed">
            Open the app, connect your wallet, and see it for yourself. No setup, no signup, nothing to install.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-redact text-white text-sm font-label uppercase tracking-wider py-4 px-10 hover:bg-[#3E1660] focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            Open Redact
          </button>
        </div>
      </section>

      <footer
        id="app-footer"
        className="w-full bg-studio text-ink pt-20 pb-12 relative overflow-hidden"
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
                      How it works
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("privacy-section")}
                      className="text-sm text-muted hover:text-ink transition-colors cursor-pointer focus:outline-none"
                    >
                      Privacy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("trust-section")}
                      className="text-sm text-muted hover:text-ink transition-colors cursor-pointer focus:outline-none"
                    >
                      Security
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
                      href="/docs"
                      className="text-sm text-muted hover:text-ink inline-flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                    >
                      Docs
                    </a>
                  </li>
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