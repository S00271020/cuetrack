import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

import { app } from "../src/app.js";
import { OpponentModel } from "../src/models/opponent.js";
import { MatchModel } from "../src/models/match.js";

// Track only records created by this test run.
const opponentIds: string[] = [];
const matchIds: string[] = [];

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required for tests");
  }

  // Override the database name to keep tests separate from app data.
  await mongoose.connect(uri, {
    dbName: "cuetrack_test",
    serverSelectionTimeoutMS: 10000,
  });
}, 15000);

afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await MatchModel.deleteMany({ _id: { $in: matchIds } });
      await OpponentModel.deleteMany({ _id: { $in: opponentIds } });
    }
  } finally {
    await mongoose.disconnect();
  }
}, 15000);

describe("CueTrack API", () => {
  it("returns the health response", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("rejects a blank opponent name", async () => {
    const response = await request(app)
      .post("/api/opponents")
      .send({ name: "   " });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid opponent data");
  });

  it("rejects an unexpected opponent field", async () => {
    const response = await request(app)
      .post("/api/opponents")
      .send({ name: "Test opponent", rating: 5 });

    expect(response.status).toBe(400);
  });

  it("rejects an invalid deletion ID", async () => {
    const response = await request(app).delete("/api/opponents/not-an-id");

    expect(response.status).toBe(400);
  });

  it("returns 404 for a missing opponent", async () => {
    const response = await request(app).get(
      "/api/opponents/000000000000000000000000",
    );

    expect(response.status).toBe(404);
  });

  it("creates, reads, updates and deletes an opponent", async () => {
    const created = await request(app)
      .post("/api/opponents")
      .send({ name: "  Test opponent  ", notes: "Initial notes" });

    if (created.body._id) {
      opponentIds.push(created.body._id);
    }

    expect(created.status).toBe(201);
    expect(created.body.name).toBe("Test opponent");

    const id = created.body._id;

    const fetched = await request(app).get(`/api/opponents/${id}`);

    expect(fetched.status).toBe(200);
    expect(fetched.body._id).toBe(id);

    const updated = await request(app)
      .put(`/api/opponents/${id}`)
      .send({ name: "Updated opponent" });

    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe("Updated opponent");
    expect(updated.body).not.toHaveProperty("notes");

    // Read again to verify that the update was persisted.
    const saved = await request(app).get(`/api/opponents/${id}`);

    expect(saved.body.name).toBe("Updated opponent");
    expect(saved.body).not.toHaveProperty("notes");

    const deleted = await request(app).delete(`/api/opponents/${id}`);

    expect(deleted.status).toBe(204);

    const missing = await request(app).get(`/api/opponents/${id}`);

    expect(missing.status).toBe(404);
  }, 15000);

  it("handles match CRUD and protects its opponent", async () => {
    const opponent = await request(app)
      .post("/api/opponents")
      .send({ name: "Match test opponent" });

    if (opponent.body._id) opponentIds.push(opponent.body._id);
    expect(opponent.status).toBe(201);

    const opponentId = opponent.body._id;

    const data = {
      opponentId,
      playedAt: "2026-10-11T14:00:00Z",
      frames: [{ playerScore: 65, opponentScore: 32 }],
      highestBreak: 42,
      notes: "Initial match",
    };

    const created = await request(app).post("/api/matches").send(data);

    if (created.body._id) matchIds.push(created.body._id);
    expect(created.status).toBe(201);

    const matchId = created.body._id;

    const fetched = await request(app).get(`/api/matches/${matchId}`);

    expect(fetched.status).toBe(200);
    expect(fetched.body.opponentId.name).toBe("Match test opponent");

    const blocked = await request(app).delete(`/api/opponents/${opponentId}`);

    expect(blocked.status).toBe(409);

    const invalid = await request(app)
      .put(`/api/matches/${matchId}`)
      .send({ ...data, highestBreak: 100 });

    expect(invalid.status).toBe(400);

    const unchanged = await request(app).get(`/api/matches/${matchId}`);

    expect(unchanged.body.highestBreak).toBe(42);

    const updated = await request(app)
      .put(`/api/matches/${matchId}`)
      .send({
        opponentId,
        playedAt: data.playedAt,
        frames: [{ playerScore: 80, opponentScore: 32 }],
        highestBreak: 50,
      });

    expect(updated.status).toBe(200);
    expect(updated.body.highestBreak).toBe(50);
    expect(updated.body).not.toHaveProperty("notes");

    const saved = await request(app).get(`/api/matches/${matchId}`);

    expect(saved.status).toBe(200);
    expect(saved.body.frames[0].playerScore).toBe(80);
    expect(saved.body.highestBreak).toBe(50);
    expect(saved.body).not.toHaveProperty("notes");

    const deleted = await request(app).delete(`/api/matches/${matchId}`);

    expect(deleted.status).toBe(204);

    const missing = await request(app).get(`/api/matches/${matchId}`);

    expect(missing.status).toBe(404);

    const deletedAgain = await request(app).delete(`/api/matches/${matchId}`);

    expect(deletedAgain.status).toBe(404);

    const opponentDeleted = await request(app).delete(
      `/api/opponents/${opponentId}`,
    );

    expect(opponentDeleted.status).toBe(204);
  }, 20000);
});
