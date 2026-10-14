import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../db.js";
import { MODE, JWT_SECRET } from "../config.js";

const router = Router();

function issueToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function publicUser(user) {
  return { id: user.id, username: user.username, role: user.role };
}

router.post("/login", (req, res) => {
  const { username, password } = req.body ?? {};

  if (MODE === "vulnerable") {
    // FLAW: user input is concatenated straight into the SQL string.
    const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    try {
      const user = db.prepare(sql).get();
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const body = { token: issueToken(user), user: publicUser(user) };
      if (user.role === "admin") body.flag = "BLOOM{sqli_walks_through_the_front_door}";
      return res.json(body);
    } catch (err) {
      // FLAW: verbose error leaks the raw query and DB message.
      return res.status(500).json({ error: err.message, query: sql });
    }
  }

  // SECURE: validate input, use a parameterised query, compare hashes.
  if (
    typeof username !== "string" || typeof password !== "string" ||
    username.length === 0 || username.length > 50 ||
    password.length === 0 || password.length > 100
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  const ok = user && bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" }); // same message either way

  return res.json({ token: issueToken(user), user: publicUser(user) });
});

export default router;