import {
  chat,
  chatWithDocument,
  chatWithCategory,
  generalChat,
} from "../ai/chat.js";

/**
 * ============================================================
 * Helper Functions
 * ============================================================
 */

const sendSuccess = (
  res,
  message,
  data = {},
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
    timestamp: new Date().toISOString(),
  });
};

const sendError = (
  res,
  message,
  statusCode = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};

/**
 * ============================================================
 * Health Check
 * ============================================================
 *
 * GET /api/chat/health
 */

export const health = async (req, res) => {
  try {
    return sendSuccess(
      res,
      "BrainAI Chat Service is running.",
      {
        service: "BrainAI",
        version: "1.0.0",
        uptime: process.uptime(),
      }
    );
  } catch (error) {
    console.error(error);

    return sendError(
      res,
      "Unable to fetch health status."
    );
  }
};

/**
 * ============================================================
 * General RAG Chat
 * ============================================================
 *
 * POST /api/chat
 */

export const chatController = async (
  req,
  res
) => {
  try {
    const {
      question,
      topK = 5,
    } = req.body;

    if (
      !question ||
      question.trim() === ""
    ) {
      return sendError(
        res,
        "Question is required.",
        400
      );
    }

    const result = await chat(
      question.trim(),
      {
        topK,
      }
    );

    return sendSuccess(
      res,
      "Response generated successfully.",
      {
        question,
        answer: result.answer,
        sources: result.sources,
      }
    );
  } catch (error) {
    console.error(
      "Chat Controller Error:",
      error
    );

    return sendError(
      res,
      error.message ||
        "Failed to generate response."
    );
  }
};

/**
 * ============================================================
 * Normal Gemini Chat
 * ============================================================
 *
 * POST /api/chat/general
 */

export const generalChatController =
  async (req, res) => {
    try {
      const { question } = req.body;

      if (
        !question ||
        question.trim() === ""
      ) {
        return sendError(
          res,
          "Question is required.",
          400
        );
      }

      const result =
        await generalChat(
          question.trim()
        );

      return sendSuccess(
        res,
        "Response generated successfully.",
        {
          question,
          answer: result.answer,
        }
      );
    } catch (error) {
      console.error(
        "General Chat Error:",
        error
      );

      return sendError(
        res,
        error.message ||
          "Failed to generate response."
      );
    }
  };

  /**
 * ============================================================
 * Chat With Specific Document
 * ============================================================
 *
 * POST /api/chat/document
 */

export const chatWithDocumentController = async (
  req,
  res
) => {
  try {
    const {
      filename,
      question,
      topK = 5,
    } = req.body;

    if (!filename || filename.trim() === "") {
      return sendError(
        res,
        "Filename is required.",
        400
      );
    }

    if (!question || question.trim() === "") {
      return sendError(
        res,
        "Question is required.",
        400
      );
    }

    const result = await chatWithDocument(
      question.trim(),
      filename.trim(),
      topK
    );

    return sendSuccess(
      res,
      "Response generated successfully.",
      {
        filename,
        question,
        answer: result.answer,
      }
    );
  } catch (error) {
    console.error(
      "Document Chat Controller Error:",
      error
    );

    return sendError(
      res,
      error.message ||
        "Unable to process document chat."
    );
  }
};

/**
 * ============================================================
 * Chat With Category
 * ============================================================
 *
 * POST /api/chat/category
 */

export const chatWithCategoryController =
  async (req, res) => {
    try {
      const {
        category,
        question,
        topK = 5,
      } = req.body;

      if (
        !category ||
        category.trim() === ""
      ) {
        return sendError(
          res,
          "Category is required.",
          400
        );
      }

      if (
        !question ||
        question.trim() === ""
      ) {
        return sendError(
          res,
          "Question is required.",
          400
        );
      }

      const result =
        await chatWithCategory(
          question.trim(),
          category.trim(),
          topK
        );

      return sendSuccess(
        res,
        "Response generated successfully.",
        {
          category,
          question,
          answer: result.answer,
        }
      );
    } catch (error) {
      console.error(
        "Category Chat Error:",
        error
      );

      return sendError(
        res,
        error.message ||
          "Unable to process category chat."
      );
    }
  };

/**
 * ============================================================
 * Chat Statistics
 * ============================================================
 *
 * GET /api/chat/stats
 */

export const chatStatisticsController =
  async (req, res) => {
    try {
      return sendSuccess(
        res,
        "Statistics fetched successfully.",
        {
          serverTime:
            new Date().toISOString(),

          uptime: process.uptime(),

          memoryUsage:
            process.memoryUsage(),

          nodeVersion:
            process.version,

          platform:
            process.platform,
        }
      );
    } catch (error) {
      console.error(error);

      return sendError(
        res,
        "Unable to fetch statistics."
      );
    }
  };

/**
 * ============================================================
 * Supported Models
 * ============================================================
 *
 * GET /api/chat/models
 */

export const supportedModelsController =
  async (req, res) => {
    try {
      return sendSuccess(
        res,
        "Supported models.",
        {
          embeddingModel:
            "text-embedding-004",

          chatModel:
            "gemini-2.5-flash",

          vectorDatabase:
            "Pinecone",

          chunkSize: 1000,

          chunkOverlap: 200,
        }
      );
    } catch (error) {
      console.error(error);

      return sendError(
        res,
        "Unable to fetch model information."
      );
    }
  };

/**
 * ============================================================
 * Default Export
 * ============================================================
 */

export default {
  health,

  chatController,

  generalChatController,

  chatWithDocumentController,

  chatWithCategoryController,

  chatStatisticsController,

  supportedModelsController,
};