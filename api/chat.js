import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { prompt, tool } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Please enter a question." });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions:
        "You are AnuCore, a helpful AI assistant for computer science students. " +
        "Give clear, accurate answers and explain technical topics simply. " +
        "The selected mode is " + (tool || "ASK AI") + ".",
      input: prompt.trim(),
      max_output_tokens: 1200
    });

    return res.status(200).json({
      answer: response.output_text
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "AnuCore could not reach the AI service."
    });
  }
}
