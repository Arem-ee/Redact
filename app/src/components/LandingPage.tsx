"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { UnsealRedactionBar } from "./UnsealRedactionBar";
import { RedactionBar } from "./RedactionBar";
import { InteractiveBlockExplorer } from "./InteractiveBlockExplorer";
import { InteractiveDuressDemo } from "./InteractiveDuressDemo";
import { InteractiveShieldingTerminal } from "./InteractiveShieldingTerminal";
import { HeroBalancePreview } from "./HeroBalancePreview";
import { BrandWordmark } from "./BrandWordmark";
import { useInView } from "./useInView";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroUnsealed, setHeroUnsealed] = useState(false);

  const [problemRef, problemUnsealed] = useInView(0.3);
  const [howRef, howUnsealed] = useInView(0.3);
  const [duressRef, duressUnsealed] = useInView(0.3);
  const [monadRef, monadUnsealed] = useInView(0.3);
  const [trustRef, trustUnsealed] = useInView(0.3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroUnsealed(true);
    }, 500);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-room text-paper-text font-sans antialiased selection:bg-redact selection:text-paper">
      <header
        id="app-header"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-room/95 backdrop-blur-md border-b border-line/10 py-3 shadow-md"
            : "bg-transparent py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <button
            id="brand-wordmark"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer focus:outline-2 focus:outline-paper-text focus:outline-offset-2"
          >
            <BrandWordmark className="text-lg tracking-[0.15em]" iconSize="w-5 h-5" />
          </button>

          <button
            id="header-cta-btn"
            onClick={() => scrollToSection("shielding-section")}
            className="bg-redact text-paper text-xs font-label uppercase tracking-widest px-4 py-2 rounded-[4px] hover:bg-reveal focus:outline-2 focus:outline-paper-text focus:outline-offset-2 transition-colors duration-150 cursor-pointer"
          >
            Hide your balance
          </button>
        </div>
      </header>

      <section
        id="hero-section"
        className="py-12 bg-room relative overflow-hidden"
      >
        <div className="max-w-[1100px] mx-auto paper-elevation-wrapper">
          <div className="deckled-paper paper-grain bg-paper text-ink p-8 md:p-16 rounded-none border border-line/30 relative overflow-hidden">
            <div
              id="confidential-stamp"
              className="absolute right-6 top-8 lg:top-16 opacity-15 pointer-events-none select-none hidden md:block"
            >
              <svg width="240" height="80" viewBox="0 0 240 80" className="text-redact">
                <defs>
                  <filter id="ink-bleed">
                    <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </defs>
                <g filter="url(#ink-bleed)" style={{ transform: "rotate(-10deg)", transformOrigin: "center" }}>
                  <rect x="10" y="10" width="220" height="60" fill="none" stroke="currentColor" strokeWidth="3.5" rx="1" strokeDasharray="180 1 120 2 150 1" />
                  <text x="120" y="47" textAnchor="middle" className="font-label text-xl font-black tracking-[0.25em]" fill="currentColor">
                    CONFIDENTIAL
                  </text>
                </g>
              </svg>
            </div>

            <div className="max-w-4xl">
              <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1] tracking-tight mb-8">
                Your wallet <UnsealRedactionBar extraPrefix="shows " unsealed={heroUnsealed}>everything</UnsealRedactionBar>. Redact <UnsealRedactionBar extraPrefix="shows " unsealed={heroUnsealed}>nothing</UnsealRedactionBar> — until you decide.
              </h1>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <p className="font-sans text-base sm:text-lg md:text-xl text-muted leading-relaxed max-w-2xl">
                  Every balance on a public blockchain is visible to anyone who looks. That&apos;s not a privacy inconvenience, it&apos;s a safety problem. Redact keeps your balance hidden by default, on Monad.
                </p>
                <div className="flex-shrink-0 self-center lg:self-start">
                  <HeroBalancePreview />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id="hero-primary-cta"
                  onClick={() => scrollToSection("shielding-section")}
                  className="bg-redact text-paper text-sm font-label uppercase tracking-wider py-4 px-8 rounded-[4px] hover:bg-reveal focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-colors duration-150 text-center cursor-pointer"
                >
                  Hide your balance
                </button>

                <button
                  id="hero-secondary-cta"
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-ink text-sm font-label uppercase tracking-wider py-4 px-6 text-center hover:underline hover:underline-offset-4 cursor-pointer focus:outline-2 focus:outline-ink focus:outline-offset-2 transition-all duration-150"
                >
                  See how it works
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="problem-section"
        className="py-12 bg-room"
      >
        <div className="max-w-[1100px] mx-auto mb-8 px-6 sm:px-0">
          <span className="font-label text-xs uppercase tracking-[0.04em] text-paper-text/60 block mb-2">
            THE PROBLEM
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-paper-text tracking-tight">
            Everyone can already see what you&apos;re worth
          </h2>
        </div>

        <div ref={problemRef} className="max-w-[1100px] mx-auto paper-elevation-wrapper">
          <div className="deckled-paper paper-grain bg-paper text-ink p-8 md:p-12 rounded-none border border-line/30 relative overflow-hidden">
            <p className="font-sans text-base sm:text-lg text-muted leading-relaxed max-w-3xl mb-8">
              Wallet addresses are public. Balances are public. Transaction history is public. If your address is ever linked to your name, anyone can look up exactly how much crypto you hold. That visibility has led to real <UnsealRedactionBar extraSuffix=" and worse" unsealed={problemUnsealed}>extortion</UnsealRedactionBar>, not hypothetically, documented cases, rising every year.
            </p>

            <InteractiveBlockExplorer />
          </div>
        </div>
      </section>

      <section className="py-[128px] px-6 bg-room flex items-center justify-center text-center">
        <p className="font-display text-2xl sm:text-3xl md:text-4xl text-paper-text max-w-3xl leading-relaxed tracking-tight italic select-none">
          &ldquo;The moment your address has a name, your balance has a target.&rdquo;
        </p>
      </section>

      <section
        id="how-it-works"
        className="py-12 bg-room"
      >
        <div className="max-w-[1100px] mx-auto mb-8 px-6 sm:px-0">
          <span className="font-label text-xs uppercase tracking-[0.04em] text-paper-text/60 block mb-2">
            ARCHITECTURAL DESIGN
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-paper-text tracking-tight">
            Three steps to on-chain privacy
          </h2>
        </div>

        <div ref={howRef} className="max-w-[1100px] mx-auto paper-elevation-wrapper">
          <div className="deckled-paper paper-grain bg-paper text-ink p-8 md:p-12 rounded-none border border-line/30 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div id="step-card-01" className="space-y-4 bg-paper/30 p-6 border border-line">
                <div className="flex justify-between items-start">
                  <span className="font-label text-3xl lg:text-4xl text-muted font-medium block">
                    01
                  </span>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-redact flex-shrink-0">
                    <path d="M20 8v18M12 18l8 8 8-8" />
                    <path d="M8 28v4h24v-4" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-ink">Deposit</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  Move stablecoins into your <UnsealRedactionBar extraPrefix="private " unsealed={howUnsealed}>balance</UnsealRedactionBar>. It leaves the public ledger the moment it lands.
                </p>
              </div>

            <div id="step-card-02" className="space-y-4 bg-paper/30 p-6 border border-line">
              <div className="flex justify-between items-start">
                <span className="font-label text-3xl lg:text-4xl text-muted font-medium block">
                  02
                </span>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-redact flex-shrink-0">
                  <path d="M8 17q12 12 24 0" />
                  <path d="M11 21l-2 3M15 23l-1 4M20 24v4M25 23l1 4M29 21l2 3" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-ink">Hold</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Your balance is yours to see. No one else&apos;s.
              </p>
            </div>

            <div id="step-card-03" className="space-y-4 bg-paper/30 p-6 border border-line">
              <div className="flex justify-between items-start">
                <span className="font-label text-3xl lg:text-4xl text-muted font-medium block">
                  03
                </span>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-redact flex-shrink-0">
                  <path d="M6 20c6-10 22-10 28 0-6 10-22 10-28 0z" />
                  <circle cx="20" cy="20" r="5" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-ink">Reveal, on your terms</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Withdraw when you need to. Nothing about your holdings is exposed until you choose to move it.
              </p>
            </div>
          </div>
        </div>
      </div>
      </section>

      <section
        id="shielding-section"
        className="py-12 bg-room"
      >
        <div className="text-center max-w-2xl mx-auto mb-8 px-6 sm:px-0">
          <span className="font-label text-xs uppercase tracking-[0.04em] text-paper-text/60 block mb-2">
            VAULT SETUP
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-paper-text tracking-tight mb-4">
            Initiate Balance Redaction
          </h2>
          <p className="font-sans text-sm sm:text-base text-paper-text/70">
            Configure your zero-knowledge private ledger profile. Verify your asset vulnerability and generate your secure keys.
          </p>
        </div>

        <InteractiveShieldingTerminal />
      </section>

      <section
        id="duress-mode"
        className="py-12 bg-room"
      >
        <div className="max-w-[1100px] mx-auto mb-8 px-6 sm:px-0">
          <span className="font-label text-xs uppercase tracking-[0.04em] text-paper-text/60 block mb-2">
            PHYSICAL DEFENSE
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-paper-text tracking-tight">
            A second passcode that shows nothing worth taking
          </h2>
        </div>

        <div ref={duressRef} className="max-w-[1100px] mx-auto paper-elevation-wrapper">
          <div className="deckled-paper paper-grain bg-paper text-ink p-8 md:p-12 rounded-none border border-line/30 relative overflow-hidden">
            <p className="font-sans text-base sm:text-lg text-muted leading-relaxed max-w-3xl mb-8">
              Set a duress PIN. If you&apos;re ever forced to open your wallet, it shows a <UnsealRedactionBar extraPrefix="low, harmless " unsealed={duressUnsealed}>balance</UnsealRedactionBar> instead of the real one. Nobody has to know there was ever anything else to see.
            </p>

            <InteractiveDuressDemo />
          </div>
        </div>
      </section>

      <section
        id="monad-section"
        className="py-12 bg-room"
      >
        <div ref={monadRef} className="max-w-[1100px] mx-auto paper-elevation-wrapper">
          <div className="deckled-paper paper-grain bg-paper text-ink p-8 md:p-12 rounded-none border border-line/30 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="font-label text-xs uppercase tracking-[0.04em] text-muted block">
                  INFRASTRUCTURE
                </span>
                <h2 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-ink tracking-tight">
                  Redact runs on Monad. Fast, low-cost, and fully compatible with the <UnsealRedactionBar extraPrefix="wallets " unsealed={monadUnsealed}>you already use</UnsealRedactionBar>.
                </h2>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div id="metric-tps" className="bg-paper border border-line p-6 rounded-none text-center">
                  <span className="font-label text-3xl font-semibold text-redact block mb-1">
                    10,000+
                  </span>
                  <span className="font-sans text-xs text-muted uppercase tracking-wider">
                    TPS Capacity
                  </span>
                </div>
                <div id="metric-cost" className="bg-paper border border-line p-6 rounded-none text-center">
                  <span className="font-label text-3xl font-semibold text-redact block mb-1">
                    &lt;$0.01
                  </span>
                  <span className="font-sans text-xs text-muted uppercase tracking-wider">
                    Average Fee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="trust-section"
        className="py-12 bg-room"
      >
        <div className="max-w-[1100px] mx-auto mb-8 px-6 sm:px-0">
          <span className="font-label text-xs uppercase tracking-[0.04em] text-paper-text/60 block mb-2">
            BEFORE YOU DEPOSIT
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-paper-text tracking-tight">
            Verify the architecture of Redact
          </h2>
        </div>

        <div ref={trustRef} className="max-w-[1100px] mx-auto paper-elevation-wrapper">
          <div className="deckled-paper paper-grain bg-paper text-ink p-8 md:p-12 rounded-none border border-line/30 relative overflow-hidden">
            <div id="trust-qa-list" className="space-y-8 divide-y divide-line">
              <div id="qa-item-1" className="space-y-3 pt-0">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
                  Do you hold my funds?
                </h3>
                <p className="font-sans text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
                  No. Your account is non-custodial, the same as your wallet. Redact never has access to your keys or your balance.
                </p>
              </div>

              <div id="qa-item-2" className="space-y-3 pt-8">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
                  What if I&apos;m forced to open the app under pressure?
                </h3>
                <p className="font-sans text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
                  Enter your duress PIN instead of your real one. It shows a low balance and nothing about your actual holdings. There&apos;s no way to tell from the screen that a duress PIN was used.
                </p>
              </div>

              <div id="qa-item-3" className="space-y-3 pt-8">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
                  Is my balance actually private, or just hidden in your interface?
                </h3>
                <p className="font-sans text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
                  It&apos;s private on-chain, not just visually hidden. Nobody, including us, can see your balance by looking at the <UnsealRedactionBar unsealed={trustUnsealed}>blockchain</UnsealRedactionBar>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="app-footer"
        className="w-full bg-room text-paper-text pt-20 pb-12 border-t border-redact mt-16 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-repeat z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        <div className="absolute right-[-5%] bottom-[-10%] text-[12rem] sm:text-[18rem] md:text-[24rem] lg:text-[30rem] font-display font-black text-paper-text/[0.04] pointer-events-none select-none tracking-tighter leading-none z-0 uppercase">
          REDACT
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 space-y-4">
              <BrandWordmark className="text-xl tracking-[0.15em] mb-3" iconSize="w-6 h-6" />
              <p className="font-sans text-sm text-paper-text/80 max-w-sm leading-relaxed">
                Your balance stays yours until you decide otherwise.
              </p>
              <div className="space-y-1.5">
                <p className="font-sans text-xs text-paper-text/50">
                  Non-custodial. Your keys, your account, always.
                </p>
                <p className="font-sans text-xs text-paper-text/50">
                  <a
                    href="https://testnet.monadexplorer.com/address/0x56a6ecda04b8bfd38c6d1d4d38f2b1867c29a4a7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-reveal transition-colors duration-150 group"
                  >
                    <span>Contract verified on Monad</span>
                    <ArrowUpRight size={12} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </p>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="font-label text-xs uppercase tracking-[0.04em] text-paper-text/50 font-bold">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("shielding-section")}
                    className="font-sans text-sm text-paper-text/80 hover:text-paper-text hover:underline hover:underline-offset-4 cursor-pointer focus:outline-none"
                  >
                    Deposit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("duress-mode")}
                    className="font-sans text-sm text-paper-text/80 hover:text-paper-text hover:underline hover:underline-offset-4 cursor-pointer focus:outline-none"
                  >
                    Duress mode
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="font-sans text-sm text-paper-text/80 hover:text-paper-text hover:underline hover:underline-offset-4 cursor-pointer focus:outline-none"
                  >
                    How it works
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="font-label text-xs uppercase tracking-[0.04em] text-paper-text/50 font-bold">
                Elsewhere
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/redact-privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-paper-text/80 hover:text-paper-text hover:underline hover:underline-offset-4 inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    Github <ArrowUpRight size={12} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/redact_privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-paper-text/80 hover:text-paper-text hover:underline hover:underline-offset-4 inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    X <ArrowUpRight size={12} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full h-[1px] bg-paper-text/15 mt-16 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans text-xs text-paper-text/50 text-center md:text-left w-full">
              &copy; 2026 Redact. Built on Monad.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
