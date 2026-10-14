import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { MODE } from "./config.js";

// One database file per mode, so switching modes never mixes data.
const db = new Database(`lab-${MODE}.db`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  );
  CREATE TABLE IF NOT EXISTS journal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    body TEXT NOT NULL
  );
`);

function seed() {
  const count = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
  if (count > 0) return;

  // Vulnerable mode stores plaintext on purpose (a finding). Secure mode hashes.
  const store = (pw) => (MODE === "secure" ? bcrypt.hashSync(pw, 10) : pw);

  const addUser = db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
  addUser.run("alice", store("garden123"), "user");
  addUser.run("admin", store("Xk9#vQ2!mLp7"), "admin");

  const addEntry = db.prepare("INSERT INTO journal (user_id, body) VALUES (?, ?)");
  addEntry.run(1, "Today I noticed the birds outside. Felt calmer.");
  addEntry.run(2, "Admin private note. Flag: BLOOM{idor_reads_other_peoples_gardens}");
}

seed();
export default db;