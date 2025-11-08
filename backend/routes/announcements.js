import { Router } from "express";
import { fetchAnnouncements } from "../services/announcements.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const data = await fetchAnnouncements({ limit });
    res.json({ items: data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "announcements error" });
  }
});

export default router;
