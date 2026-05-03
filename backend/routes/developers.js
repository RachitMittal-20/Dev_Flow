import { Router } from "express";

export function createDevelopersRouter(developers) {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(developers);
  });

  return router;
}
