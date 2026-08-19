import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * Split extracted text into chunks
 *
 * @param {string} text
 * @returns {Promise<string[]>}
 */
export async function chunkText(text) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Text cannot be empty.");
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);

    return docs.map((doc) => doc.pageContent.trim());
  } catch (error) {
    console.error("Chunking Error:", error.message);
    throw error;
  }
}