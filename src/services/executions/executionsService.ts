import { Execution } from "./type/Execution";
import db from "../../lib/database/utils/dbClient";

export const createExecution = async (execution: Omit<Execution, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await db.from("executions").insert(execution).select();
  
  if (error || !data || data.length === 0) {
    throw new Error("Failed to create execution");
  }

  return data[0] as Execution;
};

export const getExecutionById = async (id: string) => {
  const { data, error } = await db.from("executions").select("*").eq("id", id);
  return { data, error };
};

export const getExecutionsByIntegrationId = async (integrationId: string) => {
  const { data, error } = await db.from("executions").select("*").eq("integration_id", integrationId).order("created_at", { ascending: false });
  return { data, error };
};

export const updateExecution = async (id: string, execution: Partial<Execution>) => {
  const { data, error } = await db.from("executions").update(execution).eq("id", id).select();

  if (error || !data || data.length === 0) {
    throw new Error("Failed to update execution");
  }

  return data[0] as Execution;
};