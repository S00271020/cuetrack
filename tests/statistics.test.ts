import { describe, it, expect } from "vitest";
import { calculateStatistics } from "../src/services/statistics.js";

describe("calculateStatistics", () => {
  it("calculates statistics correctly for a set of matches", () => {
    const matches = [
      { frames: [{ playerScore: 10, opponentScore: 5 }] },
      { frames: [{ playerScore: 8, opponentScore: 12 }] },
      { frames: [{ playerScore: 15, opponentScore: 7 }] },
    ];
    const result = calculateStatistics(matches);
    expect(result).toMatchObject({
      matchesPlayed: 3,
      wins: 2,
      losses: 1,
      draws: 0,
      framesWon: 2,
      framesLost: 1,
    });
    expect(result.winPercentage).toBeCloseTo((2 / 3) * 100);
  });
});
