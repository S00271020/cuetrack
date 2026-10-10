import { Router } from "express";
import { OpponentModel } from "../models/opponent.js";
import { opponentInputSchema } from "../validation/opponent.js";
import { isObjectIdOrHexString } from "mongoose";

export const opponentsRouter = Router();

// Create a new opponent
opponentsRouter.post("/", async (req, res, next) => {
  const result = opponentInputSchema.safeParse(req.body); // Validate the request body against the Zod schema

  // If validation fails, respond with a 400 Bad Request status and the validation errors
  if (!result.success) {
    res.status(400).json({
      // Respond with a 400 Bad Request status and the validation errors
      message: "Invalid opponent data",
      errors: result.error.issues,
    });
    return;
  }

  // If validation succeeds, create a new opponent in the database
  try {
    const opponent = await OpponentModel.create(result.data);
    res.status(201).json(opponent);
  } catch (error: unknown) {
    next(error);
  }
});

// Get all opponents
opponentsRouter.get("/", async (_req, res, next) => {
  try {
    const opponents = await OpponentModel.find().sort({ name: 1 });
    res.status(200).json(opponents);
  } catch (error: unknown) {
    next(error);
  }
});

// Get a specific opponent by ID
opponentsRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  // Validate the opponent ID to ensure it is a valid ObjectId or hex string
  if (!isObjectIdOrHexString(id)) {
    res.status(400).json({
      message: "Invalid opponent ID",
    });
    return;
  }

  try {
    const opponent = await OpponentModel.findById(id);

    if (!opponent) {
      res.status(404).json({
        message: "Opponent not found",
      });
      return;
    }

    res.status(200).json(opponent);
  } catch (error: unknown) {
    next(error);
  }
});

// Update an existing opponent by ID
opponentsRouter.put("/:id", async (req, res, next) => {
  const id = req.params.id;

  if (!isObjectIdOrHexString(id)) {
    res.status(400).json({ message: "Invalid opponent ID" });
    return;
  }

  const result = opponentInputSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Invalid opponent data",
      errors: result.error.issues,
    });
    return;
  }

  try {
    const opponent = await OpponentModel.findById(id);

    if (!opponent) {
      res.status(404).json({ message: "Opponent not found" });
      return;
    }

    // Replace editable fields; omitted notes remove the previous notes.
    opponent.name = result.data.name;
    opponent.notes = result.data.notes;

    await opponent.save();

    // Return the updated opponent
    res.status(200).json(opponent);
  } catch (error: unknown) {
    next(error);
  }
});

// Delete an opponent by ID
opponentsRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  if (!isObjectIdOrHexString(id)) {
    res.status(400).json({ message: "Invalid opponent ID" });
    return;
  }

  try {
    const opponent = await OpponentModel.findByIdAndDelete(id);

    if (!opponent) {
      res.status(404).json({ message: "Opponent not found" });
      return;
    }

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
});
