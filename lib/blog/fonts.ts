export interface EditorFont {
  label: string;
  family: string;
}

export const editorFonts: EditorFont[] = [
  { label: "Noto Sans", family: "Noto Sans KR, sans-serif" },
  { label: "Noto Serif", family: "Noto Serif KR, serif" },
  { label: "Literata", family: "Literata, serif" },
  { label: "Outfit", family: "Outfit, sans-serif" },
];

export const editorFontStylesheet =
  "https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400&family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@400;700&family=Outfit:wght@400;700&display=swap";

function exactStyle(value: string) {
  return new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
}

export const editorFontFamilyPatterns = editorFonts.map((font) => exactStyle(font.family));
