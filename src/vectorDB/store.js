import crypto from "crypto";
import { index } from "./pinecone.js";

/**
 * Store a single vector in Pinecone
 *
 * @param {string} text
 * @param {number[]} embedding
 * @param {object} metadata
 * @returns {Promise<string>}
 */
export async function storeVector(
  text,
  embedding,
  metadata = {}
) {
  try {
    if (!text) {
      throw new Error("Text is required.");
    }

    if (!Array.isArray(embedding)) {
      throw new Error("Embedding must be an array.");
    }

    const id = crypto.randomUUID();

    await index.upsert([
      {
        id,
        values: embedding,
        metadata: {
          text,
          filename: metadata.filename || "Unknown",
          category: metadata.category || "General",
          chunk: metadata.chunk || 0,
          totalChunks: metadata.totalChunks || 0,
          uploadedAt: new Date().toISOString(),
        },
      },
    ]);

    return id;
  } catch (error) {
    console.error("Store Vector Error:", error.message);
    throw error;
  }
}

/**
 * Store multiple vectors
 *
 * @param {Array<{text:string,embedding:number[]}>} vectors
 * @param {object} metadata
 */
export async function storeVectors(
  vectors,
  metadata = {}
) {
  try {
    if (!Array.isArray(vectors)) {
      throw new Error("Vectors must be an array.");
    }

    if (vectors.length === 0) {
      return;
    }

    const records = vectors.map((vector, indexNumber) => ({
      id: crypto.randomUUID(),

      values: vector.embedding,

      metadata: {
        text: vector.text,
        filename: metadata.filename || "Unknown",
        category: metadata.category || "General",
        chunk: indexNumber + 1,
        totalChunks: vectors.length,
        uploadedAt: new Date().toISOString(),
      },
    }));
    console.log("Records:", records);
    console.log("Record count:", records.length);
    console.log("First Record:", records[0]);

    await index.upsert({
    records: records
    });

    console.log(await index.describeIndexStats());
    console.log(`${records.length} vectors stored successfully.`);
  } catch (error) {
    console.error("Store Multiple Vectors Error:", error.message);
    throw error;
  }
}

/**
 * Delete vectors by filename
 */
export async function deleteDocument(filename) {
  try {
    await index.deleteMany({
      filename,
    });

    console.log("Document deleted:", filename);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Delete all vectors
 */
export async function deleteAllVectors() {
  try {
    await index.deleteAll();

    console.log("All vectors deleted.");
  } catch (error) {
    console.error(error);
    throw error;
  }
}