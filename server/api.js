// server.js
import express from "express";
import dotenv from "dotenv";
import debatJudge from "./debateJudge.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/judge", async (req, res) => {
  const { argument } = req.body;
  try {
    const result = await debatJudge(argument);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process argument" });
  }
});

app.listen(3001, () => console.log("API running at http://localhost:3001"));
