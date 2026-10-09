import { Schema, model } from "mongoose";

export interface Opponent {
  name: string;
  notes?: string;
}

// Define the Mongoose schema for the Opponent model
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

// Create the Mongoose model for the Opponent schema
export const OpponentModel = model<Opponent>("Opponent", opponentSchema);
