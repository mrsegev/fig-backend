import { Integration } from "./types/Integration";
import { z } from "zod";

const webhookConfigSchema = z.object({
  target_url: z.string().url(),
});

const scheduleConfigSchema = z.object({
  cron_expression: z.string(),
});

const eventConfigSchema = z.object({
  action_id: z.string(),
});

const commonFieldsSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["webhook", "schedule", "event"]).optional(),
  enabled: z.boolean().optional(),
});

const configurationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("webhook"),
    configuration: webhookConfigSchema,
  }),
  z.object({
    type: z.literal("schedule"),
    configuration: scheduleConfigSchema,
  }),
  z.object({
    type: z.literal("event"),
    configuration: eventConfigSchema,
  }),
]);

export const validateIntegration = (integration: Partial<Integration>) => {
  try {    
    commonFieldsSchema.parse(integration);
        
    if (integration.type && integration.configuration) {
      configurationSchema.parse({
        type: integration.type,
        configuration: integration.configuration,
      });
    }
    
    return true;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
    }
    return false;
  }
}