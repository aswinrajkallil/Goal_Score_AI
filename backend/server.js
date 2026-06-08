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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});