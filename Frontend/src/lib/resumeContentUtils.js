/**
 * resumeContentUtils.js
 *
 * Shared utility for normalising and clamping HTML/plain-text content stored
 * in resume sections (Experience workSummary, Project projectSummary, Research abstract).
 *
 * The WYSIWYG editor and AI can produce any of these formats:
 *  1. Proper HTML:   <ul><li>...</li><li>...</li></ul>
 *  2. <p> tags:      <p>• Developed...</p><p>• Integrated...</p>
 *  3. Plain text with bullet prefixes:  "• line1\n• line2" or "- line1\n* line2"
 *  4. Plain newline-separated text:     "line1\nline2\nline3"
 *  5. Mixed <br> separated text inside one <p>
 *
 * normalizeToHtmlBullets() converts ALL of the above into a clean
 * <ul><li>...</li></ul> structure, then clamps to maxBullets items.
 */

/** Strip HTML tags, returning clean text. */
const stripTags = (html) => html.replace(/<[^>]+>/g, "");

/** Return true if the string already contains real list markup. */
const hasListMarkup = (html) => /<li[\s>]/i.test(html);

/** Return true if the string contains any HTML tags at all. */
const hasHtmlTags = (html) => /<[a-z][\s\S]*?>/i.test(html);

/**
 * Detect "bullet prefix" characters at the start of a trimmed line.
 * Covers: •  ·  ‣  –  —  -  *  >  ►  ▸
 */
const BULLET_PREFIX_RE = /^[•·‣–—\-\*>►▸]\s*/;

/**
 * Convert any text/html into an array of clean bullet strings.
 * Each element of the returned array becomes one <li>.
 */
function extractLines(raw) {
  if (!raw || !raw.trim()) return [];

  let text = raw;

  // ── Case 1: Already has <li> markup ──────────────────────────────────────
  if (hasListMarkup(text)) {
    // Pull out all <li>...</li> contents
    const liMatches = text.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    return liMatches.map((li) => stripTags(li).trim()).filter(Boolean);
  }

  // ── Case 2: <p> or <div> or <br> separated lines ─────────────────────────
  if (hasHtmlTags(text)) {
    // Replace block-level closing tags with newlines so we can split on them
    text = text
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/li>/gi, "\n");
    // Now strip remaining tags and split
    text = stripTags(text);
  }

  // ── Case 3 & 4: Plain text with or without bullet prefixes ───────────────
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map((line) => line.replace(BULLET_PREFIX_RE, "").trim()).filter(Boolean);
}

/**
 * Main export.
 *
 * Converts any stored summary string into clean HTML bullet list markup,
 * clamped to `maxBullets` items.
 *
 * @param {string} html       – raw stored content (any format)
 * @param {number} maxBullets – max number of <li> items to show
 * @param {number} maxChars   – fallback plain-text truncation limit (when 0 lines found)
 * @returns {string}          – clean HTML string safe for dangerouslySetInnerHTML
 */
export function normalizeToHtmlBullets(html, maxBullets = 4, maxChars = 400) {
  if (!html || !html.trim()) return "";

  const lines = extractLines(html);

  if (lines.length === 0) {
    // Last resort: plain truncated text
    const plain = stripTags(html).trim();
    if (!plain) return "";
    const truncated = plain.length > maxChars ? plain.slice(0, maxChars).trimEnd() + "…" : plain;
    return `<ul><li>${truncated}</li></ul>`;
  }

  // Clamp to maxBullets
  const capped = lines.slice(0, maxBullets);

  // Build proper HTML list
  const listItems = capped.map((line) => `<li>${line}</li>`).join("");
  return `<ul>${listItems}</ul>`;
}
