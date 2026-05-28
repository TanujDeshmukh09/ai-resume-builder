/**
 * reset-password.mjs
 * ──────────────────
 * One-time script to reset a user's password in MongoDB.
 *
 * Usage:
 *   node reset-password.mjs <email> <new-password>
 *
 * Example:
 *   node reset-password.mjs john@example.com MyNewPass@123
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { resolve } from "path";

// Load .env from the Backend root (same folder as this script)
dotenv.config({ path: resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = "ai-resume-builder"; // matches your .env URI

// ── Read CLI arguments ────────────────────────────────────────────────────────
const [, , emailArg, newPasswordArg] = process.argv;

if (!emailArg || !newPasswordArg) {
  console.log("\nUsage:  node reset-password.mjs <email> <new-password>\n");
  process.exit(1);
}

// ── Connect to MongoDB ────────────────────────────────────────────────────────
await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
console.log("✅  Connected to MongoDB\n");

// ── Find user ─────────────────────────────────────────────────────────────────
const userCollection = mongoose.connection.collection("users");

const user = await userCollection.findOne({ email: emailArg.toLowerCase() });

if (!user) {
  console.log(`❌  No user found with email: ${emailArg}`);
  console.log("\n── All registered users ─────────────────────────────────");
  const allUsers = await userCollection.find({}, { projection: { email: 1, fullName: 1, createdAt: 1 } }).toArray();
  if (allUsers.length === 0) {
    console.log("   (no users registered yet)");
  } else {
    allUsers.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.email}  (${u.fullName})  — created: ${u.createdAt?.toISOString?.() ?? "N/A"}`);
    });
  }
  await mongoose.disconnect();
  process.exit(1);
}

console.log(`👤  Found user: ${user.fullName} <${user.email}>`);

// ── Hash the new password ─────────────────────────────────────────────────────
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(newPasswordArg, salt);

// ── Update in DB ──────────────────────────────────────────────────────────────
await userCollection.updateOne(
  { _id: user._id },
  { $set: { password: hashedPassword, updatedAt: new Date() } }
);

console.log(`✅  Password successfully reset for: ${user.email}`);
console.log(`   New password: ${newPasswordArg}`);
console.log("\n🔒  Done! You can now log in with the new password.\n");

await mongoose.disconnect();
