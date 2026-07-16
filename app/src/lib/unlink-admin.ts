import { createUnlinkAdmin } from "@unlink-xyz/sdk/admin";

let _admin: ReturnType<typeof createUnlinkAdmin> | null = null;

export function getUnlinkAdmin() {
  if (_admin) return _admin;
  const apiKey = process.env.UNLINK_API_KEY;
  if (!apiKey) {
    throw new Error("UNLINK_API_KEY environment variable is not set");
  }
  _admin = createUnlinkAdmin({
    environment: "monad-testnet",
    apiKey,
  });
  return _admin;
}
