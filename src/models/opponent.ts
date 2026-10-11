import { Schema, model } from "mongoose";

// Define the TypeScript interfaces for the Opponent model
export interface Opponent {
  name: string;
  notes?: string;
}

const opponentSchema = new Schema<Opponent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
    },
  },

  // Enable timestamps for createdAt and updatedAt fields
  { timestamps: true },
);

// Create the Mongoose models for the Opponent and Match schemas
export const OpponentModel = model<Opponent>("Opponent", opponentSchema);
