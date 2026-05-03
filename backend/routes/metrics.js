import { Router } from "express";
import { buildDeveloperSnapshot } from "../lib/analytics.js";

export function createMetricsRouter({ developers, devMetrics }) {
  const router = Router();

  router.get("/ic", (req, res) => {
    const { developer_id, month } = req.query;
    const snapshot = buildDeveloperSnapshot({
      developerId: developer_id,
      month,
      developers,
      devMetrics
    });

    if (!snapshot) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(snapshot);
  });

  return router;
}
