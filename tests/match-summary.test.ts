import { describe, it, expect } from "vitest";
import { MatchSummary } from "../src/services/match-summary.js";

// Test suite for the MatchSummary class
describe("MatchSummary", () => {
  const matchSummary = new MatchSummary();

  // Test case for calculating a match win from frame scores
  it("calculates a match win from frame scores", () => {
    const result = matchSummary.summarizeMatch([
      { playerScore: 3, opponentScore: 2 },
      { playerScore: 4, opponentScore: 1 },
      { playerScore: 2, opponentScore: 3 },
    ]);

    // Expect the result to indicate 2 frames won, 1 frame lost, and a match win
    expect(result).toEqual({ framesWon: 2, framesLost: 1, result: "win" });
  });

  it("calculates a match loss from frame scores", () => {
    const result = matchSummary.summarizeMatch([
      { playerScore: 20, opponentScore: 70 },
    ]);

    expect(result).toEqual({ framesWon: 0, framesLost: 1, result: "loss" });
  });

  it("calculates a match draw from frame scores", () => {
    const result = matchSummary.summarizeMatch([
      { playerScore: 65, opponentScore: 30 },
      { playerScore: 20, opponentScore: 80 },
    ]);
    expect(result).toEqual({ framesWon: 1, framesLost: 1, result: "draw" });
  });

  it("throws an error for tied frames", () => {
    expect(() =>
      matchSummary.summarizeMatch([{ playerScore: 50, opponentScore: 50 }]),
    ).toThrow("Match has tied frames.");
  });

  it("throws an error for no frames", () => {
    expect(() => matchSummary.summarizeMatch([])).toThrow(
      "Match has no frames.",
    );
  });

  it("throws an error for too many frames", () => {
    const frames = Array.from({ length: 36 }, () => ({
      playerScore: 1,
      opponentScore: 2,
    }));
    expect(() => matchSummary.summarizeMatch(frames)).toThrow(
      "Match has too many frames.",
    );
  });

  it("accepts exactly 35 frames", () => {
    const frames = Array.from({ length: 35 }, (_, i) => ({
      playerScore: i + 1,
      opponentScore: i,
    }));
    const result = matchSummary.summarizeMatch(frames);
    expect(result).toEqual({ framesWon: 35, framesLost: 0, result: "win" });
  });
});
