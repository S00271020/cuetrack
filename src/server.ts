import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    application: "CueTrack API",
  });
});

app.listen(port, () => {
  console.log(`CueTrack API running at http://localhost:${port}`);
});
