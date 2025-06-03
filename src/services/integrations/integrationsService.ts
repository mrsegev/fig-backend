import {
  Integration,
  ScheduleIntegrationConfig,
} from "@/services/integrations/types/Integration";
import db from "../../lib/database/utils/dbClient";
import { validateIntegration } from "./utils";
import { schedules } from "@trigger.dev/sdk/v3";

export const getIntegrations = async () => {
  const { data, error } = await db.from("integrations").select("*").order("updated_at", { ascending: false });
  return { data, error };
};

export const getIntegrationById = async (id: string) => {
  const { data, error } = await db
    .from("integrations")
    .select("*")
    .eq("id", id);
  return { data, error };
};

export const createIntegration = async (integration: Integration) => {
  if (!validateIntegration(integration)) {
    throw new Error("Invalid integration"); // return http 400
  }

  const now = new Date().toISOString();
  const { data, error } = await db
    .from("integrations")
    .insert({
      ...integration,
      created_at: now,
      updated_at: now,
    })
    .select();

  // handle creation
  if (error || !data || data.length === 0) {
    throw new Error("Failed to create integration");
  }

  await initializeIntegration(data[0]);

  return data[0] as Integration;
};

export const updateIntegration = async (
  id: string,
  integration: Partial<Integration>
) => {
  if (!validateIntegration(integration)) {
    throw new Error("Invalid integration");
  }

  const now = new Date().toISOString();
  const { data, error } = await db
    .from("integrations")
    .update({
      ...integration,
      updated_at: now,
    })
    .eq("id", id)
    .select();

  if (error || !data || data.length === 0) {
    throw new Error("Failed to update integration");
  }

  await initializeIntegration(data[0]);

  return data[0] as Integration;
};

export const deleteIntegration = async (id: string) => {
  const { data, error } = await db.from("integrations").delete().eq("id", id);
  return { data, error };
};

export const triggerIntegration = async (id: string) => {
  const { data, error } = await db
    .from("integrations")
    .select("*")
    .eq("id", id);
  return { data, error };
};

const initializeIntegration = async (integration: Integration) => {
  switch (integration.type) {
    case "schedule":
      return initializeScheduleIntegration(integration);
    // case "webhook":
    //   return initializeWebhookIntegration(integration);
    // case "event":
    //   return initializeEventIntegration(integration);
  }
};

const initializeScheduleIntegration = async (integration: Integration) => {
  try {
    const scheduleConfig =
      integration.configuration as ScheduleIntegrationConfig;

    const createdSchedule = await schedules.create({
      task: "scheduled-task", // use const
      cron: scheduleConfig.cron_expression,
      deduplicationKey: integration.id,
      externalId: integration.id,
    });

    return createdSchedule;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to initialize schedule integration: ${error}`);
  }
};
