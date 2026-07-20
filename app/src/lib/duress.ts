const STORAGE_KEY = "redact_pins";
const DUPRESS_STORAGE_KEY = "redact_duress_mode";

interface StoredPins {
  standardHash: string;
  duressHash: string | null;
  decoyBalance: string;
}

function getStored(): StoredPins | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStored(pins: StoredPins): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
}

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function saveStandardPin(pin: string): Promise<void> {
  const hash = await hashPin(pin);
  const existing = getStored();
  setStored({
    standardHash: hash,
    duressHash: existing?.duressHash ?? null,
    decoyBalance: existing?.decoyBalance ?? "$0.00",
  });
}

export async function saveDuressPin(pin: string): Promise<void> {
  const hash = await hashPin(pin);
  const existing = getStored();
  setStored({
    standardHash: existing?.standardHash ?? "",
    duressHash: hash,
    decoyBalance: existing?.decoyBalance ?? "$0.00",
  });
}

export async function verifyCurrentPin(pin: string): Promise<boolean> {
  const stored = getStored();
  if (!stored) return false;
  const hash = await hashPin(pin);
  return hash === stored.standardHash;
}

export async function changeStandardPin(currentPin: string, newPin: string): Promise<boolean> {
  const stored = getStored();
  if (!stored) return false;
  const currentHash = await hashPin(currentPin);
  if (currentHash !== stored.standardHash) return false;
  const newHash = await hashPin(newPin);
  setStored({
    standardHash: newHash,
    duressHash: stored.duressHash,
    decoyBalance: stored.decoyBalance,
  });
  return true;
}

export async function identifyPin(pin: string): Promise<"standard" | "duress" | null> {
  const stored = getStored();
  if (!stored) return null;
  const hash = await hashPin(pin);
  if (hash === stored.standardHash) return "standard";
  if (hash === stored.duressHash) return "duress";
  return null;
}

export function isDuressModeActive(): boolean {
  return localStorage.getItem(DUPRESS_STORAGE_KEY) === "true";
}

export function setDuressModeActive(active: boolean): void {
  if (active) {
    localStorage.setItem(DUPRESS_STORAGE_KEY, "true");
  } else {
    localStorage.removeItem(DUPRESS_STORAGE_KEY);
  }
}

export function getDecoyBalance(): string {
  const stored = getStored();
  return stored?.decoyBalance ?? "$0.00";
}

export function hasPins(): boolean {
  const stored = getStored();
  return !!stored && stored.standardHash.length > 0;
}

export function hasDuressPin(): boolean {
  const stored = getStored();
  return !!stored && !!stored.duressHash;
}

const RATE_LIMIT_KEY = "redact_pin_attempts";

interface RateLimitState {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

function getRateLimitState(): RateLimitState {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    return raw ? JSON.parse(raw) : { count: 0, firstAttempt: 0, lockedUntil: null };
  } catch {
    return { count: 0, firstAttempt: 0, lockedUntil: null };
  }
}

function setRateLimitState(state: RateLimitState): void {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
}

export function recordFailedAttempt(): void {
  const state = getRateLimitState();
  const now = Date.now();

  if (state.lockedUntil && now < state.lockedUntil) return;

  if (state.count === 0) state.firstAttempt = now;
  state.count += 1;

  if (state.count >= 5) {
    state.lockedUntil = now + 10000;
    state.count = 0;
  } else if (state.count >= 3) {
    state.lockedUntil = now + 3000;
  }

  setRateLimitState(state);
}

export function resetRateLimit(): void {
  localStorage.removeItem(RATE_LIMIT_KEY);
}

export function getRateLimitDelay(): number {
  const state = getRateLimitState();
  const now = Date.now();
  if (state.lockedUntil && now < state.lockedUntil) {
    return state.lockedUntil - now;
  }
  return 0;
}
