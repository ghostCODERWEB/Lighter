// routes/onchainFees.js
import express from "express";
import {
    getAllFeeEvents,
    get24hRevenue,
    getIndexerDebug,
    __resetIndexer,
    // setFeeDivisor, // <- uncomment if you want the admin endpoint below
} from "../services/onchainFeeIndexer.js";

const router = express.Router();

// All fee events (~48h). Add ?includeZero=1 to see zero-fee trades too.
router.get("/txs", (req, res) => {
    const includeZero = req.query.includeZero === "1";
    res.json(getAllFeeEvents({ includeZero }));
});

// 24h totals + 1y projection
router.get("/summary", (_req, res) => {
    res.json(get24hRevenue());
});

// Debug: counters, last message types, subscribed markets, buffers
router.get("/debug", (_req, res) => {
    res.json(getIndexerDebug());
});

// Admin: reset buffers (safe)
router.post("/reset", (_req, res) => {
    __resetIndexer();
    res.json({ ok: true });
});

/*
// Admin: live change divisor (optional)
router.post("/divisor", (req, res) => {
  const { divisor } = req.body || {};
  if (!setFeeDivisor(divisor)) return res.status(400).json({ ok: false, error: "invalid divisor" });
  return res.json({ ok: true });
});
*/

export default router;
