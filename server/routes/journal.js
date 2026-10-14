import { Router } from "express";
import db from "../db.js";
import { MODE } from "../config.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// List only your own entries (safe in both modes).
router.get("/journal", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT id, body FROM journal WHERE user_id = ?").all(req.user.id);
  res.json(rows);
});

router.get("/journal/:id", requireAuth, (req, res) => {
  const entry = db.prepare("SELECT * FROM journal WHERE id = ?").get(req.params.id);
  if (!entry) return res.status(404).json({ error: "Not found" });

  // FLAW (vulnerable mode): logged in is enough, ownership is never checked.
  // FIX (secure mode): only the owner may read it. 404 avoids confirming the ID exists.
  if (MODE === "secure" && entry.user_id !== req.user.id) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(entry);
});

export default router;