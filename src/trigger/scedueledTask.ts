import {
  createExecution,
  updateExecution,
} from "@/services/executions/executionsService";
import { getIntegrationById } from "@/services/integrations/integrationsService";
import { logger, schedules, wait } from "@trigger.dev/sdk/v3";

export const scheduledTask = schedules.task({
  id: "scheduled-task",
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    const startTime = Date.now();
    logger.log("Scheduled task started", { payload });

    if (!payload.externalId) {
      logger.error("No externalId found in payload");
      return;
    }

    const { data: integration, error: integrationError } =
      await getIntegrationById(payload.externalId);

    if (integrationError || !integration || integration.length === 0) {
      logger.error("Integration not found");
      return;
    }

    const execution = await createExecution({
      integration_id: integration[0].id,
      status: "in_progress",
    });

    // Wait for 5 seconds
    await wait.for({ seconds: 5 });

    const duration = Date.now() - startTime;

    await updateExecution(execution.id, {
      status: "success",
      duration,
      result: {
        message: "Execution completed",
      },
    });

    logger.log("Scheduled task finished");
  },
});
