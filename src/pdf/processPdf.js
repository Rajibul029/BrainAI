import path from "path";

import { extractText } from "./extractText.js";
import { chunkText } from "./chunkText.js";

import { generateEmbeddings } from "../ai/embeddings.js";
import { storeVectors } from "../vectorDB/store.js";

/**
 * Process an uploaded PDF
 *
 * Flow:
 * PDF
 * ↓
 * Extract Text
 * ↓
 * Split into Chunks
 * ↓
 * Generate Embeddings
 * ↓
 * Store in Pinecone
 */
export async function processPdf(pdfPath, metadata = {}) {
  try {
    console.log("Processing PDF:", pdfPath);

    // Step 1
    const text = await extractText(pdfPath);

    console.log("Text Extracted");

    // Step 2
    const chunks = await chunkText(text);

    console.log(`Generated ${chunks.length} chunks`);

    // Step 3
    const vectors = await generateEmbeddings(chunks);

    console.log("Vectors:", vectors);
    console.log("Vector count:", vectors.length);
    console.log("First vector:", vectors[0]);
    console.log("Embeddings Generated");

    // Step 4
    await storeVectors(vectors, {
      filename: metadata.filename || path.basename(pdfPath),
      category: metadata.category || "General",
    });

    console.log("Stored in Pinecone");

    return {
      success: true,
      filename: metadata.filename || path.basename(pdfPath),
      totalChunks: vectors.length,
    };
  } catch (error) {
    console.error("PDF Processing Error:", error);

    throw error;
  }
}