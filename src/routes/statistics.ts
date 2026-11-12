import { Router } from "express";
import { MatchModel } from "../models/match.js";
import { calculateStatistics } from "../services/statistics.js";
import { isObjectIdOrHexString } from "mongoose";

export const statisticsRouter = Router();

// Get overall statistics
statisticsRouter.get("/", async (req, res, next) => {
  // Extract the opponentId from the query parameters
  const opponentId = req.query.opponentId;

  // Validate the opponentId if it is provided
  if (
    opponentId !== undefined &&
    (typeof opponentId !== "string" || !isObjectIdOrHexString(opponentId))
  ) {
    res.status(400).json({
      message: "Invalid opponent ID",
    });
    return;
  }

  // Create a filter object based on the presence of opponentId
  const filter = opponentId ? { opponentId } : {};

  try {
    // Fetch all matches from the database, selecting only the frames field
    const matches = await MatchModel.find(filter, { frames: 1, _id: 0 });
    const statistics = calculateStatistics(matches);
    res.status(200).json(statistics);
  } catch (error) {
    next(error);
  }
});
