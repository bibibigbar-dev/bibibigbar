import { blogAuthorName } from "./config";
import { excerptFrom, plainText, sanitizePostHtml } from "./html";
import { storeImageBytes } from "./images";
import { editionNotes } from "./schedule";
import type { BlogTopic, GeneratedTravelPost } from "./types";

export interface TravelBrief {
  title: string;
  destination: string;
  angle: string;
  keywords: string[];
  notes: string;
}

function aiConfig() {
  const apiKey = process.env.AI_API_KEY || "";
  const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  return { apiKey, baseUrl, model };
}

function redact(message: string, secret: string) {
  if (!secret) return message;
  return message.split(secret).join("[redacted]");
}

function parseModelJson(raw: string) {
  const trimmed = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "");
  return JSON.parse(trimmed) as unknown;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 8);
}

const briefingSystem = [
  "You write English travel briefings for people deciding whether a trip still makes sense.",
  "Subjects are entry rules, visa and fee changes, travel advisories, protests, strikes, and weather that affects travel.",
  "Never invent fees, dates, casualty counts, quotes, or official rules.",
  "Use only details supplied in the notes or research memo. If a number is missing, say to confirm it on the official source.",
  "Every concrete claim needs a source URL that already appears in the notes.",
  "Return a JSON object only.",
].join(" ");

interface ResponsePayload {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      annotations?: Array<{ url?: string }>;
    }>;
  }>;
}

function readResponseText(payload: ResponsePayload) {
  const chunks: string[] = [];
  const urls = new Set<string>();
  if (payload.output_text) chunks.push(payload.output_text);
  else for (const item of payload.output || []) {
    for (const part of item.content || []) {
      if (part.text) chunks.push(part.text);
      for (const note of part.annotations || []) {
        if (note.url) urls.add(note.url);
      }
    }
  }
  const sources = [...urls].slice(0, 8).map((url) => `- ${url}`).join("\n");
  return [chunks.join("\n").trim(), sources ? `Sources:\n${sources}` : ""].filter(Boolean).join("\n\n");
}

async function researchWeb(prompt: string) {
  const { apiKey, baseUrl, model } = aiConfig();
  const request = async (toolType: string) => {
    const response = await fetch(`${baseUrl}/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        tools: [{ type: toolType }],
        input: prompt,
      }),
    });
    const body = await response.text();
    return { ok: response.ok, status: response.status, body };
  };

  let result = await request("web_search");
  if (!result.ok && result.status === 400) result = await request("web_search_preview");
  if (!result.ok) throw new Error(redact(`AI ${result.status}: ${result.body.slice(0, 280)}`, apiKey));

  const text = readResponseText(JSON.parse(result.body) as ResponsePayload);
  if (text.length < 200) throw new Error("Travel research did not return enough sourced notes.");
  return text;
}

async function complete(prompt: string, useJsonMode: boolean) {
  const { apiKey, baseUrl, model } = aiConfig();
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 4096,
      ...(useJsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: briefingSystem },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(redact(`AI ${response.status}: ${body.slice(0, 280)}`, apiKey));
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("The model returned an empty article.");
  return content;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function notedUrls(notes: string) {
  return [...notes.matchAll(/https?:\/\/[^\s)<\]]+/g)].map((match) => match[0].replace(/[.,]$/, ""));
}

function illustrationDirection(subject: string) {
  return [
    "Simple flat editorial illustration for a travel briefing.",
    "No text, no letters, no numbers, no logos, no government seals, no photorealistic news photo, no identifiable real people.",
    `Subject: ${subject}`,
  ].join(" ");
}

async function generateIllustration(subject: string) {
  const { apiKey, baseUrl } = aiConfig();
  const preferred = process.env.AI_IMAGE_MODEL || "gpt-image-1";
  const request = async (model: string) => {
    const response = await fetch(`${baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: illustrationDirection(subject),
        n: 1,
        size: "1024x1024",
        ...(model.startsWith("dall-e") ? { response_format: "b64_json" } : { quality: "low" }),
      }),
    });
    const body = await response.text();
    return { ok: response.ok, status: response.status, body };
  };

  let result = await request(preferred);
  if (!result.ok && result.status === 400 && preferred !== "dall-e-3") result = await request("dall-e-3");
  if (!result.ok) throw new Error(redact(`AI ${result.status}: ${result.body.slice(0, 280)}`, apiKey));

  const payload = JSON.parse(result.body) as { data?: Array<{ b64_json?: string }> };
  const encoded = payload.data?.[0]?.b64_json;
  if (!encoded) throw new Error("Image generation returned no image.");
  return new Uint8Array(Buffer.from(encoded, "base64"));
}

async function storeIllustration(subject: string, alt: string) {
  const bytes = await generateIllustration(subject);
  return { url: await storeImageBytes(bytes), alt };
}

export async function generateTravelPost(topic: BlogTopic): Promise<GeneratedTravelPost> {
  const { apiKey } = aiConfig();
  if (!apiKey) throw new Error("Set AI_API_KEY before generating a post.");
  const notes = editionNotes(topic.notes);
  const allowedUrls = notedUrls(notes);
  if (!allowedUrls.length) throw new Error("The brief has no source URL, so it cannot be written.");

  const prompt = [
    "Return a JSON object with keys: title, slug, excerpt, seoTitle, seoDescription, tags, destination, sections, sources, thumbnailPrompt, imagePrompts.",
    "Write in English.",
    "slug must be English kebab-case.",
    "sections is an array of 3 to 5 items. Each item has heading and paragraphs. paragraphs is an array of 2 to 4 plain-text sentences.",
    "Do not add a sources heading inside sections. Use no more than 5 sections.",
    "Cover what changed, who it affects, whether travel is still practical, and what to verify before departure.",
    "sources is an array of objects with name and url. Use only URLs copied from Notes. Include every URL you rely on.",
    "Never state a fee, date, or official rule unless that exact detail is in Notes.",
    "thumbnailPrompt and each imagePrompts item describe a simple related illustration, not a fake photograph of the event.",
    "imagePrompts has exactly 2 items, each with alt and prompt.",
    "seoTitle should stay under 60 characters. seoDescription should stay under 160 characters.",
    "tags should contain 3 to 6 short phrases.",
    `Topic: ${topic.title}`,
    `Destination: ${topic.destination || "unspecified"}`,
    `Angle: ${topic.angle || "whether travelers can still go, and what changed"}`,
    `Keywords: ${topic.keywords.join(", ") || "none"}`,
    `Notes: ${notes || "none"}`,
    `Author name to reflect, not to print as a byline: ${blogAuthorName()}`,
  ].join("\n");

  let raw: string;
  try {
    raw = await complete(prompt, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.includes("AI 400")) throw error;
    raw = await complete(prompt, false);
  }

  let parsed: unknown;
  try {
    parsed = parseModelJson(raw);
  } catch {
    throw new Error("The model did not return valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") throw new Error("The model did not return an article object.");
  const record = parsed as Record<string, unknown>;
  const title = readString(record.title);
  const sections = readSections(record.sections);
  const sources = readSources(record.sources, allowedUrls);
  if (!title || sections.length < 3 || !sources.length) {
    throw new Error("The model returned an article without enough sourced sections.");
  }

  const thumbnailSubject = readString(record.thumbnailPrompt) || title;
  const imagePrompts = readImagePrompts(record.imagePrompts, sections);
  const [cover, ...inlineImages] = await Promise.all([
    storeIllustration(thumbnailSubject, title),
    ...imagePrompts.map((item) => storeIllustration(item.prompt, item.alt)),
  ]);
  const contentHtml = assembleBriefing(sections, inlineImages, sources);
  if (plainText(contentHtml).length < 700) throw new Error("The model returned a post that is too short to publish.");

  return {
    title: title.slice(0, 160),
    slug: readString(record.slug),
    excerpt: (readString(record.excerpt) || excerptFrom(contentHtml)).slice(0, 300),
    contentHtml,
    coverImageUrl: cover.url,
    seoTitle: (readString(record.seoTitle) || title).slice(0, 70),
    seoDescription: (readString(record.seoDescription) || excerptFrom(contentHtml, 160)).slice(0, 180),
    tags: readTags(record.tags),
    destination: readString(record.destination) || topic.destination,
  };
}

function readSections(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 5).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const heading = readString(record.heading).slice(0, 120);
    const paragraphs = Array.isArray(record.paragraphs)
      ? record.paragraphs.map((paragraph) => readString(paragraph)).filter(Boolean).slice(0, 4)
      : [];
    if (!heading || !paragraphs.length) return [];
    return [{ heading, paragraphs }];
  });
}

function readSources(value: unknown, allowedUrls: string[]) {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const url = readString(record.url);
    const allowed = allowedUrls.find((candidate) => url.startsWith(candidate) || candidate.startsWith(url));
    if (!allowed || seen.has(allowed)) return [];
    seen.add(allowed);
    return [{ name: readString(record.name).slice(0, 120) || "Source", url: allowed }];
  }).slice(0, 6);
}

function readImagePrompts(
  value: unknown,
  sections: Array<{ heading: string }>,
) {
  const prompts = Array.isArray(value)
    ? value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const record = item as Record<string, unknown>;
        const prompt = readString(record.prompt);
        if (!prompt) return [];
        return [{ prompt: prompt.slice(0, 300), alt: readString(record.alt).slice(0, 140) || "Travel briefing illustration" }];
      })
    : [];
  const fallback = sections.slice(0, 2).map((section) => ({
    prompt: section.heading,
    alt: section.heading,
  }));
  return [...prompts, ...fallback].slice(0, 2);
}

function assembleBriefing(
  sections: Array<{ heading: string; paragraphs: string[] }>,
  images: Array<{ url: string; alt: string }>,
  sources: Array<{ name: string; url: string }>,
) {
  const slots = images.length > 1 ? [0, Math.min(2, sections.length - 1)] : [0];
  const html = sections.flatMap((section, index) => {
    const imageIndex = slots.indexOf(index);
    const image = imageIndex >= 0 ? images[imageIndex] : null;
    return [
      `<h2>${escapeHtml(section.heading)}</h2>`,
      ...section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
      image ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}">` : "",
    ];
  });
  html.push("<h2>Sources</h2>");
  html.push(`<ul>${sources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.name)}</a></li>`).join("")}</ul>`);
  return sanitizePostHtml(html.filter(Boolean).join(""));
}

export async function gatherTravelBriefs(recentTitles: string[], count: number): Promise<TravelBrief[]> {
  const { apiKey } = aiConfig();
  if (!apiKey) throw new Error("Set AI_API_KEY before gathering travel notes.");
  const wanted = Math.min(5, Math.max(1, count));
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
  const memo = await researchWeb([
    `Today is ${today}. Find ${wanted} separate, current travel issues a traveler should check before booking.`,
    "Use only these kinds of stories: visa or entry rule changes, fee changes such as ESTA, official travel advisories, protests or strikes that affect visitors, and severe weather that changes whether a trip is practical.",
    "Cover different countries. Prefer developments from the last few weeks.",
    "For each issue, name the country, what changed, the date if a source states it, who is affected, whether travel is still practical, and the source name with URL.",
    "Do not invent fees, dates, or casualty numbers. Skip an issue when the source is unclear.",
    `Do not repeat these recent titles: ${recentTitles.slice(0, 40).join(" | ") || "none"}`,
  ].join("\n"));
  const prompt = [
    `Return a JSON object with key "briefs", an array of exactly ${wanted} items.`,
    "Each item has keys: title, destination, angle, keywords, notes.",
    "Write every field in English.",
    "title is a headline about the travel issue, such as a visa fee change or whether protests or weather make the trip impractical.",
    "destination is the country or city.",
    "angle is one sentence on what a traveler needs to decide.",
    "keywords is an array of 3 to 6 short phrases.",
    "notes must include the sourced facts, any stated date or fee, whether travel is currently practical, what to verify, and at least one source URL copied from the memo.",
    "Use only facts present in the research memo. Drop an item rather than guessing.",
    `Research memo:\n${memo}`,
  ].join("\n");

  let raw: string;
  try {
    raw = await complete(prompt, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.includes("AI 400")) throw error;
    raw = await complete(prompt, false);
  }

  let parsed: unknown;
  try {
    parsed = parseModelJson(raw);
  } catch {
    throw new Error("The model did not return travel notes.");
  }
  const briefs = parsed && typeof parsed === "object" ? (parsed as { briefs?: unknown }).briefs : null;
  if (!Array.isArray(briefs)) throw new Error("The model did not return travel notes.");

  return briefs.slice(0, wanted).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const title = readString(record.title).slice(0, 140);
    const notes = readString(record.notes);
    if (!title || notes.length < 80 || !/https?:\/\//.test(notes)) return [];
    return [{
      title,
      destination: readString(record.destination).slice(0, 80),
      angle: readString(record.angle).slice(0, 160),
      keywords: readTags(record.keywords),
      notes: notes.slice(0, 2000),
    }];
  });
}
