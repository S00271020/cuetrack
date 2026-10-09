import { Router } from "express";
import { OpponentModel } from "../models/opponent.js";
import { opponentInputSchema } from "../validation/opponent.js";

export const opponentsRouter = Router();

opponentsRouter.post("/", async (req, res, next) => {
  const result = opponentInputSchema.safeParse(req.body); // Validate the request body against the Zod schema

  if (!result.success) {
    res.status(400).json({
      // Respond with a 400 Bad Request status and the validation errors
      message: "Invalid opponent data",
      errors: result.error.issues,
    });
    return;
  }

  try {
    const opponent = await OpponentModel.create(result.data);
    res.status(201).json(opponent);
  } catch (error: unknown) {
    next(error);
  }
});
