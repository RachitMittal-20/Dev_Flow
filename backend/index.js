import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { developers, devMetrics, managerMetrics } from "./data/seed.js";
import { createDevelopersRouter } from "./routes/developers.js";
import { createMetricsRouter } from "./routes/metrics.js";
import { createManagerRouter } from "./routes/manager.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

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

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(frontendIndexPath);
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
