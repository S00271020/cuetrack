import type { Frame } from "../models/match.js";

export class MatchSummary {
  // Summarizes the match data based on the frames provided
  public summarizeMatch(frames: Frame[]) {
    let playerFrames = 0;
    let opponentFrames = 0;
    let result: "win" | "loss" | "draw";

    // Validate the frames array
    if (frames.length === 0) {
      throw new Error("Match has no frames.");
    } else if (frames.length > 35) {
      throw new Error("Match has too many frames.");
    }

    // Check for tied frames and count wins/losses
    for (const frame of frames) {
      if (frame.playerScore === frame.opponentScore) {
        throw new Error("Match has tied frames.");
      } else if (frame.playerScore > frame.opponentScore) {
        playerFrames++;
      } else {
        opponentFrames++;
      }
    }

    // Determine the result based on the number of frames won/lost
    if (playerFrames > opponentFrames) {
      result = "win";
    } else if (playerFrames < opponentFrames) {
      result = "loss";
    } else {
      result = "draw";
    }
    return { framesWon: playerFrames, framesLost: opponentFrames, result };
  }
}
