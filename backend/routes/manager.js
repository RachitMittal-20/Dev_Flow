import { Router } from "express";
import {
  buildManagerSnapshot,
  buildManagerSummaryRows
} from "../lib/analytics.js";

export function createManagerRouter({ managerMetrics, devMetrics, developers }) {
  const router = Router();

  router.get("/", (req, res) => {
    const { month } = req.query;
    const data = buildManagerSummaryRows({
      month,
      managerMetrics,
      devMetrics,
      developers
    });

    res.json(data);
  });

  router.get("/:managerId", (req, res) => {
    const { month } = req.query;
    const snapshot = buildManagerSnapshot({
      managerId: req.params.managerId,
      month,
      managerMetrics,
      devMetrics,
      developers
    });

    if (!snapshot) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(snapshot);
  });

  return router;
}
