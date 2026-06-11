import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import chatConfig from "./chatConfig.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());



app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "Hello";

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: chatConfig.model,
        messages: [
          {
            role: "system",
            content: chatConfig.systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "GoalScore AI",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "No response received";

    res.json({ reply });
  } catch (error) {
    console.error(
      "OpenRouter Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      reply: "Failed to get response from OpenRouter",
    });
  }
});

// Endpoint to fetch football fixtures based on date

app.get("/api/fixtures", async (req, res) => {
  try {
    const response = await axios.get(
      // "https://v3.football.api-sports.io/fixtures",
      "https://www.thesportsdb.com/api/v1/json/123/eventsday.php",
      {
      params: {
        d: req.query.date,
        s: "Soccer",
      },
      }
    );

    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.error(
      "Football API Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to fetch fixtures",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});