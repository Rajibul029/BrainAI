import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/authMiddleware.js";

import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

// Admin Document Management
router.post(
  "/upload",
  protect,
  upload.single("pdf"),
  uploadDocument
);
router.get("/", protect, getAllDocuments);
router.get("/:id", protect, getDocumentById);
router.put(
  "/:id",
  protect,
  upload.single("pdf"),
  updateDocument
);
router.delete("/:id", protect, deleteDocument);

export default router;