import { z } from "zod";

const frameInputSchema = z
  .strictObject({
    playerScore: z.number().int().min(0),
    opponentScore: z.number().int().min(0),
  })
  .refine((frame) => frame.playerScore !== frame.opponentScore, {
    message: "Player score and opponent score cannot be the same.",
  });

export const matchInputSchema = z
  .strictObject({
    opponentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid opponent ID format."),
    playedAt: z.iso
      .datetime({ offset: true })
      .transform((value) => new Date(value)),
    frames: z
      .array(frameInputSchema)
      .min(1, "At least one frame is required.")
      .max(35),
    highestBreak: z.number().int().min(0).max(155),
    notes: z.string().trim().max(500).optional(),
  })
  .refine(
    (match) =>
      match.frames.some((frame) => frame.playerScore >= match.highestBreak),
    {
      message: "Highest break cannot exceed every player frame score",
      path: ["highestBreak"],
    },
  );
