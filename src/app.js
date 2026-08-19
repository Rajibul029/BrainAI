import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/chat", chatRoutes);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);

export default app;