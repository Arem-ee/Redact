# Redact

Every balance on a public blockchain is visible to anyone who looks, that's not a hypothetical problem. If your wallet address ever gets linked to your real name, someone can look up exactly how much crypto you hold, what you've done with it, where it came from. That visibility has consequences. There are documented cases of people being extorted after their on-chain holdings were discovered. The amounts were sometimes small. It didn't matter.

This is the problem we wanted to solve for Monad.

When we started looking at how to actually do this, we found Unlink. It is a privacy layer already running on Monad as a deployed smart contract. No bridge, no separate chain, no new L1 to wait for. It uses zero-knowledge proofs so a transaction can be verified as valid without ever revealing the sender, the recipient, or the amount. The hard cryptographic work was already done, correctly, in production.

We thought about building our own privacy layer. Then we thought about what could go wrong. A subtly broken privacy system is worse than none at all, especially when people are supposed to trust it with their safety. So we built Redact on top of Unlink instead of trying to replace it. Unlink handles the cryptography. Redact is the surface, the thing a person actually opens, deposits into, and relies on.

### What it does

Deposit into a private balance that no one else can see. Check that balance privately whenever you want. Withdraw back to the public ledger when you need to spend. And duress mode, which is the feature I'm most glad exists: a second passcode that, if someone forces you to open the app, shows a low fake balance instead of your real one. There is no visible difference on screen between the real mode and the duress mode. It just shows a different balance. Nobody has to know there was ever anything else to see.

### How it works, briefly and honestly

Non-custodial. Your keys stay in your browser, always. Redact never holds them. The chain is Monad Testnet (chain ID 10143). The privacy underneath is Unlink, a privacy layer deployed as a smart contract on Monad.

### Setup

```bash
git clone <repo>
cd app
cp .env.example .env
```

Set your Unlink admin API key in `.env`:

```
UNLINK_API_KEY=your_admin_api_key
```

This key is used server-side only (in Next.js API routes) to register users and issue scoped authorization tokens. It never reaches the browser. Generate one at dashboard.unlink.xyz: sign in, create an organization, create a project, then create an API key.

Then:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`. Connect a wallet (MetaMask or any injected wallet configured for Monad Testnet, chain ID 10143). The first time you connect, your Unlink account is created automatically. You should see your private balance (zero at first, unless you've used the faucet).

### Current state of the deposit flow

Registration works. Private balance reads work. Duress mode works. It is intentionally client-side only, it never touches the chain or calls the real balance read when the duress PIN is entered, that is the whole point, there is nothing for a coerced session to expose.

The actual deposit flow (moving tokens into the private balance) is partially blocked by what looks like a version mismatch between the Unlink SDK (`@unlink-xyz/sdk@0.3.0-canary.738`) and the Unlink engine. The `POST /transactions/deposit/prepare` endpoint returns HTTP 201 with a valid `tx_id` and `notes_hash`, but the SDK expects a `prepared_artifacts` field in the response that the server no longer provides. The error from the SDK is: `deposit.prepare.prepared_artifacts is missing; Engine is incompatible with this SDK version`. This has been reported upstream. When it is resolved on the engine side, the client code should start working without any changes.

Everything else in the flow that does not depend on deposit confirmation (registration, authorization token issuance, environment info, faucet balance claims) works as expected.

### Contract

```
Network:  Monad Testnet (10143)
Address:  0x56a6ecda04b8bfd38c6d1d4d38f2b1867c29a4a7
Explorer: https://testnet.monadexplorer.com/address/0x56a6ecda04b8bfd38c6d1d4d38f2b1867c29a4a7
```
