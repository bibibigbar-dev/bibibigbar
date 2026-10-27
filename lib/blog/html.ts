import sanitizeHtml from "sanitize-html";
import { editorFontFamilyPatterns } from "./fonts";

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2",
    "h3",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "a",
    "blockquote",
    "img",
    "hr",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title"],
    span: ["style"],
  },
  allowedStyles: {
    span: {
      "font-family": editorFontFamilyPatterns,
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

export function sanitizePostHtml(value: string) {
  return sanitizeHtml(value, options).trim();
}

export function plainText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(html: string) {
  const length = plainText(html).length;
  if (!length) return 1;
  return Math.max(1, Math.round(length / 500));
}

export function excerptFrom(html: string, max = 180) {
  const text = plainText(html);
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}
