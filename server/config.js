import crypto from "node:crypto";

export const MODE = process.env.LAB_MODE === "secure" ? "secure" : "vulnerable";

// Weak, guessable secret in vulnerable mode. Random per start in secure mode.
export const JWT_SECRET =
  MODE === "secure" ? crypto.randomBytes(32).toString("hex") : "bloom123";