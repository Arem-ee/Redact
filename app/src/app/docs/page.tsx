import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Docs - Redact",
  description: "Redact keeps your crypto balance private on Monad.",
};

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          Redact hides your crypto balance from public view. Deposit, hold, and withdraw stablecoins on Monad without anyone being able to look up what you hold. Built on Unlink&apos;s privacy layer.
        </p>
        <p>
          Every wallet address on a public blockchain shows its full balance and history to anyone who looks. If your address is ever linked to your name, anyone can see exactly what you&apos;re worth. That&apos;s a documented safety risk, not just a privacy inconvenience. Redact keeps your balance off the public ledger. You decide when it&apos;s shown.
        </p>
      </>
    ),
  },
  {
    id: "how-it-works",
    title: "How it works",
    content: (
      <p>
        Non-custodial, your keys stay in your browser, Redact never holds them. Deposit moves tokens from your public wallet into a private balance using Unlink&apos;s zero-knowledge proof system, which verifies transactions are valid without revealing sender, recipient, or amount. Withdraw moves funds back out whenever you need to spend. Everything in between stays private.
      </p>
    ),
  },
  {
    id: "duress-mode",
    title: "Duress mode",
    content: (
      <p>
        A second passcode you can set in Settings. If you&apos;re ever forced to open the app under pressure, entering the duress PIN instead of your real one shows a low, harmless balance. It&apos;s entirely client-side, it never touches the chain or calls the real balance read when triggered, there&apos;s nothing for a coerced session to expose.
      </p>
    ),
  },
  {
    id: "quickstart",
    title: "Quickstart (for running it locally)",
    content: (
      <>
        <pre className="bg-studio border border-line/[0.06] p-4 font-mono text-sm text-ink overflow-x-auto">{`git clone https://github.com/Arem-ee/Redact.git
cd app
cp .env.example .env`}</pre>
        <p>Add <code className="text-redact text-xs font-mono">UNLINK_API_KEY</code> (get one at <a href="https://dashboard.unlink.xyz" target="_blank" rel="noopener noreferrer" className="text-redact hover:underline">dashboard.unlink.xyz</a>):</p>
        <pre className="bg-studio border border-line/[0.06] p-4 font-mono text-sm text-ink overflow-x-auto">{`npm install
npm run dev`}</pre>
        <p>
          Connect a wallet on Monad Testnet (chain ID 10143), your Unlink account is created automatically on first connect.
        </p>
      </>
    ),
  },
  {
    id: "contract",
    title: "Contract",
    content: (
      <div className="font-mono text-sm text-ink space-y-1">
        <p><span className="font-label text-xs uppercase tracking-wider text-muted">RedactVault</span></p>
        <p className="break-all">0xD7F7324491c831c48dE3077E24BCfE43344919CF</p>
        <p>Monad Testnet (10143)</p>
        <a
          href="https://testnet.monadexplorer.com/address/0xD7F7324491c831c48dE3077E24BCfE43344919CF"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-redact hover:underline text-sm font-sans"
        >
          Explorer <ArrowUpRight size={12} />
        </a>
      </div>
    ),
  },
  {
    id: "current-status",
    title: "Current status",
    content: (
      <p>
        Registration, private balance reads, withdrawal, and duress mode are all confirmed working. Deposit is currently blocked by a documented version mismatch between Unlink&apos;s SDK and their live Engine, reported upstream.
      </p>
    ),
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-studio text-ink font-sans antialiased selection:bg-redact selection:text-white">
      <div className="max-w-[720px] mx-auto px-6 py-16 sm:py-24">
        <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight leading-[1.1] mb-12">
          Docs
        </h1>

        <nav className="mb-16 border-b border-line/[0.06] pb-8 space-y-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block font-sans text-sm text-muted hover:text-ink transition-colors"
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="space-y-16">
          {sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="font-display text-2xl sm:text-3xl text-ink tracking-tight leading-[1.15] mb-4">
                {s.title}
              </h2>
              <div className="font-sans text-base text-ink leading-relaxed space-y-4 [&_p]:text-[15px] sm:[&_p]:text-base">
                {s.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
