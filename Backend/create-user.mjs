/**
 * create-user.mjs
 * ────────────────
 * Creates a new user directly in MongoDB (bypasses the API).
 *
 * Usage:
 *   node create-user.mjs <fullName> <email> <password>
 *
 * Example:
 *   node create-user.mjs "John Doe" john@example.com MyPass@123
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = "ai-resume-builder";

const [, , fullNameArg, emailArg, passwordArg] = process.argv;

if (!fullNameArg || !emailArg || !passwordArg) {
  console.log('\nUsage:  node create-user.mjs "Full Name" email@example.com password\n');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
console.log("✅  Connected to MongoDB\n");

const col = mongoose.connection.collection("users");

// Check if email already exists
const existing = await col.findOne({ email: emailArg.toLowerCase() });
if (existing) {
  console.log(`⚠️   A user with email "${emailArg}" already exists.`);
  console.log("    Use reset-password.mjs to change their password instead.\n");
  await mongoose.disconnect();
  process.exit(0);
}

// Hash password with bcrypt (same as the app)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(passwordArg, salt);

// Insert the user
await col.insertOne({
  fullName: fullNameArg,
  email: emailArg.toLowerCase(),
  password: hashedPassword,
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log("🎉  User created successfully!\n");
console.log(`   Name    : ${fullNameArg}`);
console.log(`   Email   : ${emailArg}`);
console.log(`   Password: ${passwordArg}`);
console.log("\n👉  Go to http://localhost:5173 and sign in with these credentials.\n");

await mongoose.disconnect();
