// app/api/answer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import faqs from "@/db/faqs.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET request - Useful for simple testing
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'API is working' });
  }

  // Handle POST request
  if (req.method === 'POST') {
    const { question } = req.body;

    // Find if the question already exists in db/faq.json
    const existingAnswer = faqs.faqs.find(
      (faq) => faq.question.toLowerCase() === question.toLowerCase()
    )?.answer;

    if (existingAnswer) {
      return res.status(200).json({ answer: existingAnswer });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });

      const answer = response.choices[0]?.message?.content?.trim() || "Sorry, I couldn't process that.";
      return res.status(200).json({ answer });
    } catch (error) {
      console.error("Error querying OpenAI:", error);
      return res.status(500).json({ error: "Error processing your question" });
    }
  }

  // Handle other methods
  res.status(405).json({ error: 'Method Not Allowed' });
}
