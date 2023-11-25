// app/api/answer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import faqs from "@/db/faqs.json";
import team from "@/db/team.json";
import about from "@/db/about.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { question } = req.body;

  // Find if the question already exists in db/faq.json
  const existingAnswer = faqs.faqs.find(
    (faq) => faq.question.toLowerCase() === question.toLowerCase()
  )?.answer;

  // Find team member from db/team.json
  const existingStaff = faqs.faqs.find(
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

    // Modify this line based on the actual structure of the response
    const answer =
      response.choices[0]?.message?.content?.trim() ||
      "Sorry, I couldn't process that.";
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Error querying OpenAI:", error);
    return res.status(500).json({ error: "Error processing your question" });
  }
}
