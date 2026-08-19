import ai from "./src/ai/gemini.js";

try {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: "Hello BrainAI",
  });

  console.log(response.embeddings[0].values.length);
} catch (err) {
  console.error(err);
}