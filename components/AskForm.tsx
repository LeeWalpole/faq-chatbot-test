"use client";
// app/components/AskForm.tsx
import React, { useState } from "react";

const AskForm: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    setLoading(true);
    setAnswer(""); // Clear previous answer

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnswer(data.answer);
      } else {
        console.error("Failed to fetch the answer");
        setAnswer("Unable to fetch the answer. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAnswer("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {answer && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <strong>Answer:</strong> {answer}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 mr-2 w-full md:w-auto"
          placeholder="Enter your question here"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>
    </div>
  );
};

export default AskForm;
