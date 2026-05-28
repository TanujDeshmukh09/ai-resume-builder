import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./db/index.js";

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.log("MongoDB connection failed or skipped. Continuing to start server for UI testing.");
  })
  .finally(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on http://localhost:" + (process.env.PORT || 5000));
    });
  });