import { OpenAI } from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: apiKey || "dummy-openai-api-key-placeholder",
});

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536;

export default openai;
