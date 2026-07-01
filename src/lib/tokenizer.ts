/**
 * Basic local tokenizer approximation helpers to check character counts and estimate token sizes.
 */

/**
 * Calculates approximate token count for English text.
 * Industry standard approximation: 1 token is ~4 characters or ~0.75 words.
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  const clean = text.trim();
  if (clean.length === 0) return 0;
  
  // Calculate char-based and word-based approximations and average them
  const charApprox = Math.ceil(clean.length / 4);
  const words = clean.split(/\s+/).length;
  const wordApprox = Math.ceil(words * 1.3);

  return Math.max(charApprox, wordApprox);
}
