import { Router } from "express";
import { MatchModel } from "../models/match.js";
import { calculateStatistics } from "../services/statistics.js";

export const statisticsRouter = Router();

// Get overall statistics
statisticsRouter.get("/", async (_req, res, next) => {
  try {
    // Fetch all matches from the database, selecting only the frames field
    const matches = await MatchModel.find({}, { frames: 1, _id: 0 });
    const statistics = calculateStatistics(matches);
    res.status(200).json(statistics);
  } catch (error) {
    next(error);
  }
});
