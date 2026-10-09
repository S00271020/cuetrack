import { z } from "zod";

// Define a Zod schema for validating opponent input data
export const opponentInputSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
  notes: z.string().trim().max(500).optional(),
});
