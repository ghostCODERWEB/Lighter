import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import announcementsRouter from "./routes/announcements.js";
import accountRouter from "./routes/account.js";
import onchainFeesRouter from "./routes/onchainFees.js";

import { attachWebsocket } from "./ws.js";
import { log } from "./util/logger.js";
import { startOnchainFeeIndexer } from "./services/onchainFeeIndexer.js"; // << ADD THIS

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/account", accountRouter);
app.use("/api/announcements", announcementsRouter);

// mount onchain fees endpoints under /api/fees/onchain
app.use("/api/fees/onchain", onchainFeesRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);
attachWebsocket(server, process.env.CORS_ORIGIN || "*");

// >>> START THE INDEXER <<<
startOnchainFeeIndexer();

const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => log("backend listening on port", PORT));
