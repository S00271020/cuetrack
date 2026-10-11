import { Schema, model, Types } from "mongoose";

// Define the TypeScript interfaces for the Match and Frame models
interface Frame {
  playerScore: number;
  opponentScore: number;
}

export interface Match {
  opponentId: Types.ObjectId;
  playedAt: Date;
  frames: Frame[];
  highestBreak: number;
  notes?: string;
}

// Define the Mongoose schemas
const frameSchema = new Schema<Frame>(
  {
    playerScore: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isInteger,
    },

    opponentScore: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isInteger,
    },
  },

  { _id: false },
);

const matchSchema = new Schema<Match>(
  {
    opponentId: {
      //
      type: Schema.Types.ObjectId, // TypeScript type for ObjectId is Types.ObjectId, but Mongoose uses Schema.Types.ObjectId for schema definitions
      ref: "Opponent",
      required: true,
    },
    playedAt: {
      type: Date,
      required: true,
    },
    frames: {
      type: [frameSchema],
      required: true,
      validate: {
        validator: (frames: Frame[]) =>
          frames.length >= 1 &&
          frames.length <= 35 &&
          frames.every((frame) => frame.playerScore !== frame.opponentScore),
        message: "Provide 1 - 35 completed frames with no tied scores",
      },
    },
    highestBreak: {
      type: Number,
      required: true,
      min: 0,
      max: 155,
      validate: Number.isInteger,
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

export const MatchModel = model<Match>("Match", matchSchema);
