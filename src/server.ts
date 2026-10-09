import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import { opponentsRouter } from "./routes/opponent.js";

// Create an Express application
const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

// Use the opponents router for handling opponent-related API routes
app.use("/api/opponents", opponentsRouter);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    application: "CueTrack API",
  });
});

// Start the server and connect to MongoDB
async function startServer(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  app.listen(port, () => {
    console.log(`CueTrack API running at http://localhost:${port}`);
  });
}

// Start the server and handle any startup errors
startServer().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(`Server startup failed: ${error.name}: ${error.message}`);
  } else {
    console.error("Server startup failed with an unknown error.");
  }

  process.exit(1);
});
