export type DashboardState = "loading" | "connected" | "error";
export type ModalType = "deposit" | "withdraw" | "settings" | null;

export interface ActivityItem {
  id: string;
  type: "deposit" | "withdraw";
  amount: string;
  timestamp: number;
}
