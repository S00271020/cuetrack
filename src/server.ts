import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

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

startServer().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(`Server startup failed: ${error.name}: ${error.message}`);
  } else {
    console.error("Server startup failed with an unknown error.");
  }

  process.exit(1);
});
