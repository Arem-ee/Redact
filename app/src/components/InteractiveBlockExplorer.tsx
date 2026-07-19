"use client";

const TOKENS = [
  { name: "Monad (MON)", balance: "15,000.00 MON" },
  { name: "USD Coin (USDC)", balance: "$906,250.00" },
  { name: "Ethereum (ETH)", balance: "120.50 ETH" },
];

export function InteractiveBlockExplorer() {
  return (
    <div id="explorer-visual" className="flex flex-col lg:flex-row gap-6 w-full">
      <div className="flex-1 bg-white border border-line/40 shadow-[0_4px_24px_rgba(26,21,32,0.04)] flex flex-col">
        <div className="border-b border-line/30 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label text-[10px] uppercase tracking-[0.08em] text-muted font-bold">
              PUBLIC
            </span>
            <span className="font-label text-[9px] uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 font-medium">
              VISIBLE TO EVERYONE
            </span>
          </div>
          <span className="hover-dissolve font-mono text-xs text-muted tracking-tight inline-block cursor-default">
            0x71C2...8971
          </span>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center py-1.5 border-b border-line/20">
              <span className="font-label text-[9px] uppercase tracking-wider text-muted">Asset</span>
              <span className="font-label text-[9px] uppercase tracking-wider text-muted">Balance</span>
            </div>
            {TOKENS.map((token) => (
              <div key={token.name} className="flex justify-between items-center py-1">
                <span className="font-sans text-sm text-ink">{token.name}</span>
                <span className="font-sans text-sm font-semibold text-ink">{token.balance}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10px] text-muted leading-relaxed border-t border-line/15 pt-3">
            Wallet addresses, balances, and transaction histories are public data on every block explorer.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-redact/15 shadow-[0_4px_24px_rgba(75,29,115,0.04)] flex flex-col">
        <div className="border-b border-redact/10 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label text-[10px] uppercase tracking-[0.08em] text-redact font-bold">
              REDACTED
            </span>
            <span className="font-label text-[9px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 font-medium">
              HIDDEN ON-CHAIN
            </span>
          </div>
          <span className="hover-dissolve font-mono text-xs text-muted tracking-tight inline-block cursor-default">
            0x71C2...8971
          </span>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center py-1.5 border-b border-line/20">
              <span className="font-label text-[9px] uppercase tracking-wider text-muted">Asset</span>
              <span className="font-label text-[9px] uppercase tracking-wider text-muted">Balance</span>
            </div>
            {TOKENS.map((token) => (
              <div key={token.name} className="flex justify-between items-center py-1">
                <span className="font-sans text-sm text-ink">{token.name}</span>
                <div className="h-5 bg-gradient-to-r from-[#D4D0D8] to-[#C8C4D0] w-24 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10px] text-muted leading-relaxed border-t border-line/15 pt-3">
            Redact encrypts balances on-chain. No amount, no token, no activity is visible to anyone without your permission.
          </p>
        </div>
      </div>
    </div>
  );
}
