import { MatchSummary } from "./match-summary.js";
import type { Match } from "../models/match.js";
import type { Statistics } from "../models/statistics.js";

type StatisticsMatch = Pick<Match, "frames">;

export function calculateStatistics(matches: StatisticsMatch[]): Statistics {
  // Implementation for calculating statistics
  const matchSummary = new MatchSummary();

  let wins = 0;
  let losses = 0;
  let draws = 0;
  let framesWon = 0;
  let framesLost = 0;
  let winPercentage = 0;

  // Iterate through each match and summarize the results
  for (const match of matches) {
    const summary = matchSummary.summarizeMatch(match.frames);

    framesWon += summary.framesWon;
    framesLost += summary.framesLost;

    if (summary.result === "win") {
      wins++;
    } else if (summary.result === "loss") {
      losses++;
    } else if (summary.result === "draw") {
      draws++;
    }
  }

  // Calculate the total number of matches played
  const matchesPlayed = matches.length;
  if (matchesPlayed > 0) {
    winPercentage = (wins / matchesPlayed) * 100;
  }

  return {
    matchesPlayed,
    wins,
    losses,
    draws,
    framesWon,
    framesLost,
    winPercentage,
  };
}
