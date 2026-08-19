import Document from "../models/Document.js";
import { processPdf } from "../pdf/processPdf.js";

/**
 * Upload a PDF document
 *
 * Flow:
 * Upload PDF
 * ↓
 * Process PDF
 * ↓
 * Store vectors in Pinecone
 * ↓
 * Save metadata in MongoDB
 */
export const uploadDocument = async (req, res) => {
  try {
    // Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file.",
      });
    }

    console.log("====================================");
    console.log("New Document Upload");
    console.log("====================================");

    console.log("Title:", req.body.title);
    console.log("Category:", req.body.category);
    console.log("Filename:", req.file.filename);

    // -----------------------------
    // Step 1 : Process PDF
    // -----------------------------
    const processingResult = await processPdf(req.file.path, {
      filename: req.file.filename,
      category: req.body.category,
    });

    console.log("PDF Indexed Successfully");

    // -----------------------------
    // Step 2 : Save MongoDB
    // -----------------------------
    const document = await Document.create({
      title: req.body.title,
      category: req.body.category,
      filename: req.file.filename,
      filepath: req.file.path,
      uploadedBy: req.user.id,
    });

    console.log("MongoDB Saved Successfully");

    res.status(201).json({
      success: true,
      message: "Document uploaded and indexed successfully.",
      document,
      indexing: processingResult,
    });
  } catch (error) {
    console.error("====================================");
    console.error("Upload Document Error");
    console.error(error);
    console.error("====================================");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all documents
 */
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get document by ID
 */
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("uploadedBy", "name email");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update document metadata
 */
export const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    document.title = req.body.title || document.title;
    document.category = req.body.category || document.category;

    if (req.file) {
      document.filename = req.file.filename;
      document.filepath = req.file.path;
    }

    const updatedDocument = await document.save();

    res.status(200).json({
      success: true,
      message: "Document updated successfully.",
      document: updatedDocument,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete document
 *
 * NOTE:
 * This currently removes only MongoDB metadata.
 * You should also remove vectors from Pinecone
 * and delete the physical PDF file if desired.
 */
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};