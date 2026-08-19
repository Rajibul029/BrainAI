import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is missing in .env");
}

if (!process.env.PINECONE_INDEX) {
  throw new Error("PINECONE_INDEX is missing in .env");
}

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Get Index
const index = pinecone.index(process.env.PINECONE_INDEX);

export { pinecone, index };