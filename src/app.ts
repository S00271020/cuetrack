import express from "express";
import type { ErrorRequestHandler } from "express";
import { opponentsRouter } from "./routes/opponent.js";
import { matchesRouter } from "./routes/match.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { readFileSync } from "node:fs";

// Set up the Express app
export const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Load the OpenAPI specification from the YAML file
const openApiDocument = YAML.parse(
  readFileSync(new URL("../openapi.yaml", import.meta.url), "utf8"),
);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Mount the routers for opponents and matches
app.use("/api/opponents", opponentsRouter);
app.use("/api/matches", matchesRouter);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    application: "CueTrack API",
  });
});

// Catch-all route for undefined endpoints
app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Global error handler
const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  // Express's JSON parser forwards malformed JSON here.
  if (
    error instanceof SyntaxError &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({ message: "Invalid JSON body" });
    return;
  }

  console.error("Unhandled API error");
  res.status(500).json({ message: "Internal server error" });
};

// Use the global error handler
app.use(errorHandler);
