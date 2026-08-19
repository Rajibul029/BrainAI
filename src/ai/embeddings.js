import ai, { embeddingModel } from "./gemini.js";

/**
 * Generate embedding for a single text
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text) {
  try {
    // Validate input
    if (!text || typeof text !== "string") {
      throw new Error("Text must be a non-empty string.");
    }

    const cleanText = text.trim();

    if (cleanText.length === 0) {
      throw new Error("Text cannot be empty.");
    }

    // Generate embedding
    const response = await ai.models.embedContent({
      model: embeddingModel,
      contents: cleanText,
    });

    // Validate response
    if (
      !response ||
      !response.embeddings ||
      response.embeddings.length === 0
    ) {
      throw new Error("No embedding returned from Gemini.");
    }

    return response.embeddings[0].values;
  } catch (error) {
    console.error("Embedding Generation Error:", error.message);
    throw error;
  }
}

/**
 * Generate embeddings for multiple text chunks
 * @param {string[]} chunks
 * @returns {Promise<Array<{text:string, embedding:number[]}>>}
 */
export async function generateEmbeddings(chunks) {
  try {
    if (!Array.isArray(chunks)) {
      throw new Error("Chunks must be an array.");
    }

    if (chunks.length === 0) {
      return [];
    }

    // Generate embeddings in parallel
    const vectors = await Promise.all(
      chunks.map(async (chunk) => ({
        text: chunk,
        embedding: await generateEmbedding(chunk),
      }))
    );

    return vectors;
  } catch (error) {
    console.error("Batch Embedding Error:", error.message);
    throw error;
  }
}

/**
 * Returns the embedding dimension.
 * Useful while creating Pinecone index.
 */
export async function getEmbeddingDimension() {
  const embedding = await generateEmbedding("BrainAI");

  return embedding.length;
}

/**
 * Health check for Gemini Embedding API.
 * Returns true if the API is working.
 */
export async function testEmbeddingAPI() {
  try {
    const embedding = await generateEmbedding("Hello BrainAI");

    return {
      success: true,
      dimension: embedding.length,
      message: "Gemini Embedding API is working.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}