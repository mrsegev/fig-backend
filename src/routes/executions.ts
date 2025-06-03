import { getExecutionsByIntegrationId } from "../services/executions/executionsService";
import { Router } from "express";

const router = Router();

router.get("/:integrationId", async (req, res) => {
  const { data, error } = await getExecutionsByIntegrationId(req.params.integrationId);
  if (error) {
    return res.status(500).json({ error: "Failed to fetch executions" });
  }
  if (!data || data.length === 0) {
    return res.json([]);
  }
  res.json(data);
});

export default router;  