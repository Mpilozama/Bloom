import { Router } from "express";
import db from "../db.js";
import { MODE } from "../config.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// FLAW (vulnerable mode): no auth at all. Security by obscurity.
// FIX (secure mode): token required AND admin role.
const guard = MODE === "secure" ? [requireAuth, requireRole("admin")] : [];

router.get("/backup", ...guard, (req, res) => {
  if (MODE === "vulnerable") {
    // FLAW: SELECT * leaks plaintext passwords too.
    const users = db.prepare("SELECT * FROM users").all();
    return res.json({ flag: "BLOOM{robots_txt_is_not_access_control}", users });
  }
  const users = db.prepare("SELECT id, username, role FROM users").all();
  res.json({ users });
});

export default router;
