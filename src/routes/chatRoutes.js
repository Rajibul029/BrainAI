import express from "express";

import {
  chat,
  chatWithDocument,
  chatWithCategory,
  generalChat,
} from "../ai/chat.js";

const router = express.Router();

/**
 * ==========================================
 * Health Check
 * GET /api/chat/health
 * ==========================================
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BrainAI Chat API is running.",
  });
});

/**
 * ==========================================
 * General RAG Chat
 * POST /api/chat
 * ==========================================
 *
 * Body:
 * {
 *   "question":"What is Artificial Intelligence?",
 *   "topK":5
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { question, topK } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const result = await chat(question, {
      topK: topK || 5,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * ==========================================
 * Chat with specific document
 * POST /api/chat/document
 * ==========================================
 *
 * Body:
 * {
 *   "filename":"AI Notes.pdf",
 *   "question":"Explain CNN",
 *   "topK":5
 * }
 */
router.post("/document", async (req, res) => {
  try {
    const {
      filename,
      question,
      topK,
    } = req.body;

    if (!filename || !question) {
      return res.status(400).json({
        success: false,
        message:
          "Filename and Question are required.",
      });
    }

    const result = await chatWithDocument(
      question,
      filename,
      topK || 5
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * ==========================================
 * Chat with category
 * POST /api/chat/category
 * ==========================================
 *
 * Body:
 * {
 *   "category":"Notice",
 *   "question":"Semester Exam",
 *   "topK":5
 * }
 */
router.post("/category", async (req, res) => {
  try {
    const {
      category,
      question,
      topK,
    } = req.body;

    if (!category || !question) {
      return res.status(400).json({
        success: false,
        message:
          "Category and Question are required.",
      });
    }

    const result = await chatWithCategory(
      question,
      category,
      topK || 5
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * ==========================================
 * Normal Gemini Chat
 * POST /api/chat/general
 * ==========================================
 *
 * Body:
 * {
 *   "question":"Hello"
 * }
 */
router.post("/general", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const result = await generalChat(question);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;