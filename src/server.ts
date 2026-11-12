import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";

// Set the port from environment variable or default to 3000
const port = Number(process.env.PORT ?? 3000);

// Start the server and connect to MongoDB
async function startServer(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  // Check if the MongoDB URI is provided in the environment variables
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  // Connect to MongoDB using Mongoose
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  // Start the Express server
  app.listen(port, () => {
    console.log(`CueTrack API running at http://localhost:${port}`);
  });
}

// Handle any errors that occur during server startup
startServer().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(`Server startup failed: ${error.name}: ${error.message}`);
  } else {
    console.error("Server startup failed with an unknown error.");
  }

  // Exit the process with a failure code
  process.exit(1);
});
