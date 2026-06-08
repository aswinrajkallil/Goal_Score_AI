import axios from "axios";
import chatConfig from "./chatConfig.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userMessage = req.body?.message || "Hello";
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENROUTER_API_KEY environment variable" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: chatConfig.model,
        messages: [
          { role: "system", content: chatConfig.systemPrompt },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...chatConfig.headers,
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || "No response";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenRouter API error:", error.response?.data || error.message);
    return res.status(500).json({ reply: "Unable to get a response from OpenRouter." });
  }
}
