import express from "express";
import { MODE } from "./config.js";
import "./db.js";

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, mode: MODE });
});

const PORT = 3001;
// Bound to localhost on purpose: the vulnerable lab must never be reachable from the network.
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Bloom Lab server running in ${MODE} mode on http://127.0.0.1:${PORT}`);
});