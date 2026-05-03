import express from "express";
import cors from "cors";
import { developers, devMetrics, managerMetrics } from "./data/seed.js";
import { createDevelopersRouter } from "./routes/developers.js";
import { createMetricsRouter } from "./routes/metrics.js";
import { createManagerRouter } from "./routes/manager.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/developers", createDevelopersRouter(developers));
app.use(
  "/api/metrics/manager",
  createManagerRouter({ managerMetrics, devMetrics, developers })
);
app.use("/api/metrics", createMetricsRouter({ developers, devMetrics }));

app.get("/api/months", (_req, res) => {
  const months = [...new Set(devMetrics.map((entry) => entry.month))].sort();
  res.json(months);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
