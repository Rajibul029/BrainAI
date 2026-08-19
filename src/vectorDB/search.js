import { index } from "./pinecone.js";
import { generateEmbedding } from "../ai/embeddings.js";

/**
 * Search similar chunks from Pinecone
 *
 * @param {string} query
 * @param {number} topK
 * @param {object} filter
 * @returns {Promise<Array>}
 */
export async function searchVectors(
  query,
  topK = 5,
  filter = {}
) {
  try {
    if (!query || typeof query !== "string") {
      throw new Error("Search query is required.");
    }

    // Generate embedding for the user query
    const queryEmbedding = await generateEmbedding(query);

    // Query Pinecone
    const response = await index.query({
      vector: queryEmbedding,
      topK,
      includeValues: false,
      includeMetadata: true,
      filter:
        Object.keys(filter).length > 0
          ? filter
          : undefined,
    });

    if (!response.matches || response.matches.length === 0) {
      return [];
    }

    return response.matches.map((match) => ({
      id: match.id,
      score: match.score,
      text: match.metadata?.text || "",
      filename: match.metadata?.filename || "",
      category: match.metadata?.category || "",
      chunk: match.metadata?.chunk || 0,
    }));
  } catch (error) {
    console.error("Vector Search Error:", error.message);
    throw error;
  }
}

/**
 * Build a single context string from retrieved chunks
 *
 * @param {string} query
 * @param {number} topK
 * @param {object} filter
 * @returns {Promise<string>}
 */
export async function getContext(
  query,
  topK = 5,
  filter = {}
) {
  try {
    const results = await searchVectors(
      query,
      topK,
      filter
    );

    if (results.length === 0) {
      return "";
    }

    return results
      .map(
        (item, index) =>
          `Context ${index + 1}:\n${item.text}`
      )
      .join("\n\n");
  } catch (error) {
    console.error("Context Error:", error.message);
    throw error;
  }
}

/**
 * Search within a specific document
 *
 * @param {string} filename
 * @param {string} question
 * @param {number} topK
 */
export async function searchDocument(
  filename,
  question,
  topK = 5
) {
  return await searchVectors(question, topK, {
    filename: {
      $eq: filename,
    },
  });
}

/**
 * Search within a specific category
 *
 * @param {string} category
 * @param {string} question
 * @param {number} topK
 */
export async function searchCategory(
  category,
  question,
  topK = 5
) {
  return await searchVectors(question, topK, {
    category: {
      $eq: category,
    },
  });
}

/**
 * Return search results with formatted information
 *
 * Useful for debugging and admin panel
 */
export async function searchWithMetadata(
  question,
  topK = 5
) {
  const results = await searchVectors(question, topK);

  return results.map((result) => ({
    filename: result.filename,
    category: result.category,
    chunk: result.chunk,
    similarity: Number(result.score.toFixed(4)),
    preview:
      result.text.substring(0, 200) + "...",
  }));
}