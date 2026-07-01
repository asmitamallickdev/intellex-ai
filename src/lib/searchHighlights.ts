/**
 * Extracts snippets around matched search query words, highlighting hits.
 */
export function generateHighlightSnippet(
  content: string,
  query: string,
  maxLength: number = 180
): string {
  if (!content) return "";
  
  const cleanContent = content.replace(/\s+/g, " ").trim();
  const cleanQuery = query.toLowerCase().trim();
  
  if (!cleanQuery) {
    return cleanContent.slice(0, maxLength) + (cleanContent.length > maxLength ? "..." : "");
  }

  const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 2);
  if (queryTokens.length === 0) {
    return cleanContent.slice(0, maxLength) + (cleanContent.length > maxLength ? "..." : "");
  }

  // Find the first token match location in content
  let matchIndex = -1;
  const contentLower = cleanContent.toLowerCase();

  for (const token of queryTokens) {
    const idx = contentLower.indexOf(token);
    if (idx !== -1) {
      matchIndex = idx;
      break;
    }
  }

  // If no match found, fallback to beginning
  if (matchIndex === -1) {
    return cleanContent.slice(0, maxLength) + (cleanContent.length > maxLength ? "..." : "");
  }

  // Get a window of text around the match index
  const start = Math.max(0, matchIndex - Math.floor(maxLength / 3));
  const end = Math.min(cleanContent.length, start + maxLength);
  let snippet = cleanContent.slice(start, end);

  // Add ellipses if truncated
  if (start > 0) snippet = "..." + snippet;
  if (end < cleanContent.length) snippet = snippet + "...";

  // Inject markdown formatting tags around query tokens for high-fidelity UI rendering
  let highlighted = snippet;
  const escapedTokens = queryTokens.map(token => token.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

  for (const escToken of escapedTokens) {
    const regex = new RegExp(`(${escToken})`, "gi");
    highlighted = highlighted.replace(regex, `<mark>$1</mark>`);
  }

  return highlighted;
}
