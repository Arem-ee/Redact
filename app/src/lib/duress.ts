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
