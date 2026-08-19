import ai, { chatModel } from "./gemini.js";
import { getContext, searchVectors } from "../vectorDB/search.js";

/**
 * Generate an AI answer using RAG
 *
 * @param {string} question
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export async function chat(question, options = {}) {
  try {
    if (!question || typeof question !== "string") {
      throw new Error("Question is required.");
    }

    const topK = options.topK || 5;

    // Retrieve relevant chunks
    const searchResults = await searchVectors(question, topK);

    // Build context
    const context = await getContext(question, topK);

    const prompt = `
You are BrainAI, an intelligent AI assistant for Brainware University.

Your primary goal is to help users understand information from the uploaded documents in a natural, conversational, and accurate way.

=========================
INSTRUCTIONS
=========================

1. Use the provided context as your PRIMARY source of information.

2. If the answer exists in the context:
   - Answer naturally, like ChatGPT.
   - Do NOT simply copy the text.
   - Explain the answer in your own words while preserving the original meaning.
   - Add a short explanation or background to help the user better understand the topic.
   - If appropriate, provide examples based on the context.
   - Keep the answer concise but informative.

3. If the context contains only partial information:
   - Answer using the available context.
   - Clearly mention what information is available.
   - If you add a brief general explanation, make it clear that it is general knowledge and NOT taken from the uploaded document.

4. If the answer is NOT found in the context:
   Reply ONLY with:

   "I couldn't find that information in the uploaded documents."

   Do not guess.
   Do not invent facts.
   Do not answer using your own knowledge.

5. Never contradict the provided context.

6. If the user asks for:
   - Definition → Give a clear definition followed by a short explanation.
   - Comparison → Present the comparison in a table when possible.
   - Steps or procedures → Use numbered lists.
   - Advantages/Disadvantages → Use bullet points.
   - Features → Use bullet points.

7. Use Markdown formatting:
   - ## Headings
   - Bullet lists
   - Numbered lists
   - Tables when appropriate

8. Keep the tone:
   - Friendly
   - Professional
   - Helpful
   - Easy to understand

=========================
DOCUMENT CONTEXT
=========================

${context}

=========================
USER QUESTION
=========================

${question}

=========================
ANSWER
=========================

Generate a complete response based ONLY on the document context.
`;

    const response = await ai.models.generateContent({
      model: chatModel,
      contents: prompt,
    });

    const answer = response.text;

    return {
      success: true,
      question,
      answer,
      sources: searchResults.map((item) => ({
        filename: item.filename,
        category: item.category,
        chunk: item.chunk,
        score: Number(item.score.toFixed(4)),
      })),
    };
  } catch (error) {
    console.error("Chat Error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Chat inside a specific PDF
 */
export async function chatWithDocument(
  question,
  filename,
  topK = 5
) {
  try {
    const context = await getContext(question, topK, {
      filename: {
        $eq: filename,
      },
    });

    const prompt = `
You are BrainAI.

Answer ONLY using the document context.

Document:
${filename}

Context:
${context}

Question:
${question}
`;

    const response = await ai.models.generateContent({
      model: chatModel,
      contents: prompt,
    });

    return {
      success: true,
      answer: response.text,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
}

/**
 * Chat inside a category
 */
export async function chatWithCategory(
  question,
  category,
  topK = 5
) {
  try {
    const context = await getContext(question, topK, {
      category: {
        $eq: category,
      },
    });

    const prompt = `
You are BrainAI.

Answer ONLY using the category context.

Category:
${category}

Context:
${context}

Question:
${question}
`;

    const response = await ai.models.generateContent({
      model: chatModel,
      contents: prompt,
    });

    return {
      success: true,
      answer: response.text,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
}

/**
 * Normal Gemini chat (No RAG)
 */
export async function generalChat(question) {
  try {
    const response = await ai.models.generateContent({
      model: chatModel,
      contents: question,
    });

    return {
      success: true,
      answer: response.text,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
}