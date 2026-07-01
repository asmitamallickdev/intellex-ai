/**
 * Helper utility to clean extracted text content for optimal chunking and RAG ingestion.
 */

export function cleanText(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove carriage returns
  cleaned = cleaned.replace(/\r/g, "");

  // 2. Reduce multiple spaces to a single space, keeping line breaks
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // 3. Reduce multiple consecutive line breaks to a max of two (single empty line spacing)
  // This preserves paragraph divisions without bloated whitespace gaps
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // 4. Strip control characters and invalid non-printable characters while preserving normal unicode
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");

  // 5. Trim leading and trailing whitespace
  return cleaned.trim();
}
