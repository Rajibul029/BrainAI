import Document from "../models/Document.js";

export const uploadDocument =
  async (req, res) => {
    try {
      const document =
        await Document.create({
          title: req.body.title,
          category:
            req.body.category,

          filename:
            req.file.filename,

          filepath: req.file.path,

          uploadedBy: req.user.id,
        });

      res.status(201).json(
        document
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("uploadedBy", "name email");

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.title = req.body.title || document.title;
    document.category = req.body.category || document.category;

    if (req.file) {
      document.filename = req.file.filename;
      document.filepath = req.file.path;
    }

    const updatedDocument = await document.save();

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};