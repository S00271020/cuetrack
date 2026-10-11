import { Router } from "express";
import { MatchModel } from "../models/match.js";
import { OpponentModel } from "../models/opponent.js";
import { matchInputSchema } from "../validation/match.js";
import { isObjectIdOrHexString } from "mongoose";

export const matchesRouter = Router();

// Create a new match
matchesRouter.post("/", async (req, res, next) => {
  const result = matchInputSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Invalid match data",
      errors: result.error.issues,
    });
    return;
  }

  try {
    // Check if the opponent exists before creating the match
    const opponentExists = await OpponentModel.exists({
      _id: result.data.opponentId,
    });
    if (!opponentExists) {
      res.status(404).json({
        message: "Opponent not found",
      });
      return;
    }

    const match = await MatchModel.create(result.data);
    res.status(201).json(match);
  } catch (error: unknown) {
    next(error);
  }
});

// Get all matches
matchesRouter.get("/", async (_req, res, next) => {
  try {
    const matches = await MatchModel.find()
      .populate("opponentId", "name")
      .sort({ playedAt: -1 });

    res.status(200).json(matches);
  } catch (error: unknown) {
    next(error);
  }
});

// Get a specific match by ID
matchesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  if (!isObjectIdOrHexString(id)) {
    res.status(400).json({ message: "Invalid match ID" });
    return;
  }

  try {
    const match = await MatchModel.findById(id).populate("opponentId", "name");

    if (!match) {
      res.status(404).json({ message: "Match not found" });
      return;
    }

    res.status(200).json(match);
  } catch (error: unknown) {
    next(error);
  }
});

// Update a specific match by ID
matchesRouter.put("/:id", async (req, res, next) => {
  const id = req.params.id;

  if (!isObjectIdOrHexString(id)) {
    res.status(400).json({ message: "Invalid match ID" });
    return;
  }

  const result = matchInputSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Invalid match data",
      errors: result.error.issues,
    });
    return;
  }

  try {
    const match = await MatchModel.findById(id);

    if (!match) {
      res.status(404).json({ message: "Match not found" });
      return;
    }

    const opponentExists = await OpponentModel.exists({
      _id: result.data.opponentId,
    });

    if (!opponentExists) {
      res.status(404).json({ message: "Opponent not found" });
      return;
    }

    // Apply all validated editable fields, including clearing omitted notes.
    match.set({
      ...result.data,
      notes: result.data.notes,
    });

    await match.save();

    res.status(200).json(match);
  } catch (error: unknown) {
    next(error);
  }
});

// Delete a specific match by ID
matchesRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  if (!isObjectIdOrHexString(id)) {
    res.status(400).json({ message: "Invalid match ID" });
    return;
  }

  try {
    const match = await MatchModel.findByIdAndDelete(id);

    if (!match) {
      res.status(404).json({ message: "Match not found" });
      return;
    }

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
});
