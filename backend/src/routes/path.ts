import { Router, Request, Response } from "express";
import { findPath } from "../services/pathService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { from, to } = req.query as { from: string; to: string };

  if (!from || !to) {
    res.status(400).json({ error: "from and to query params are required" });
    return;
  }

  if (from === to) {
    res.status(400).json({ error: "from and to must be different actors" });
    return;
  }

  try {
    const result = await findPath(from, to);

    if (!result) {
      res.status(404).json({ error: "No path found between these actors" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Path error:", error);
    res.status(500).json({ error: "Path query failed" });
  }
});

export default router;
