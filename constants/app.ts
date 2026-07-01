/**
 * Application metadata and system configuration constants.
 */
export const APP_CONFIG = {
  name: "Intellex AI",
  tagline: "Enterprise Intelligence",
  version: "1.0.0",
  copyright: "Intellex AI. All rights reserved.",
  defaultModel: "Intellex-Core-5.5",
  chunkSizeLimitBytes: 50 * 1024 * 1024, // 50MB
  supportedFormats: [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "text/csv"
  ],
} as const;
