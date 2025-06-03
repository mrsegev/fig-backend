export type Execution = {
  id: string;
  integration_id: string;
  status: "pending" | "in_progress" | "success" | "error";
  created_at: string;
  updated_at: string;
  result?: any;
  duration?: number;
};