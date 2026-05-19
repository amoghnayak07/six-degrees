import { Router, Request, Response } from "express";
import { searchActors } from "../services/searchService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || query.trim().length < 2) {
    res.json([]);
    return;
  }

  try {
    const actors = await searchActors(query);
    res.json(actors);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
