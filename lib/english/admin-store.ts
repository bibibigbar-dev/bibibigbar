import { supabaseProjectUrl } from "@/lib/blog/config";

export class EnglishAdminError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export interface EnglishCategory {
  id: string;
  name: string;
  short: string;
  sort: number;
  audience: "with-child" | "alone";
}

export interface EnglishSituation {
  id: string;
  categoryId: string;
  title: string;
  sort: number;
  tipKo: string;
  youtubeUrl: string;
}

export interface EnglishPhrase {
  id: string;
  situationId: string;
  body: string;
  sort: number;
  meanings: Record<string, string>;
  beforeBody: string;
  beforeMeanings: Record<string, string>;
  afterBody: string;
  afterMeanings: Record<string, string>;
  youtubeUrl: string;
}

export interface EnglishScript {
  id: string;
  categoryId: string;
  title: string;
  titles: Record<string, string>;
  sort: number;
  youtubeUrl: string;
}

export interface EnglishTurn {
  id: string;
  scriptId: string;
  sort: number;
  prompt: string;
  promptMeanings: Record<string, string>;
  bestBody: string;
  bestMeanings: Record<string, string>;
  altBody: string;
  altNote: string;
  bestFirst: boolean;
}

export interface EnglishGroup {
  id: string;
  sort: number;
  titles: Record<string, string>;
  youtubeUrl: string;
}

export interface EnglishLine {
  id: string;
  groupId: string;
  sort: number;
  body: string;
  meanings: Record<string, string>;
  youtubeUrl: string;
}

interface CategoryRow {
  id: string;
  name: string;
  short: string;
  sort: number;
  audience: string | null;
}

interface SituationRow {
  id: string;
  category_id: string;
  title: string;
  sort: number;
  tip: Record<string, string> | null;
  youtube_url: string | null;
}

interface PhraseRow {
  id: string;
  situation_id: string;
  body: string;
  meanings: Record<string, string> | null;
  sort: number;
  before: { body?: string; meanings?: Record<string, string> } | null;
  after: { body?: string; meanings?: Record<string, string> } | null;
  youtube_url: string | null;
}

interface ScriptRow {
  id: string;
  category_id: string;
  title: string;
  titles: Record<string, string> | null;
  sort: number;
  youtube_url: string | null;
}

interface TurnRow {
  id: string;
  situation_id: string;
  prompt: string;
  prompt_meanings: Record<string, string> | null;
  best_body: string;
  best_meanings: Record<string, string> | null;
  alt_body: string;
  alt_note: string;
  best_first: boolean;
  sort: number;
}

interface GroupRow {
  id: string;
  titles: Record<string, string> | null;
  sort: number;
  youtube_url: string | null;
}

interface LineRow {
  id: string;
  group_id: string;
  body: string;
  meanings: Record<string, string> | null;
  sort: number;
  youtube_url: string | null;
}

function config() {
  const url = supabaseProjectUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new EnglishAdminError("Supabase is not configured.");
  return { url, key };
}

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.method && init.method !== "GET" ? { Prefer: "return=minimal" } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    if (response.status === 404 || body.includes("PGRST205") || body.includes("does not exist")) {
      throw new EnglishAdminError("The English tables are not in the database yet. Apply the be_ catalog SQL in the amatdda project, then reload.");
    }
    if (response.status === 409) throw new EnglishAdminError("That id already exists, or this item still has sentences inside it.");
    throw new EnglishAdminError("Could not save the English catalog.");
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function textMap(value: Record<string, string> | null | undefined) {
  return value || {};
}

async function nextSort(table: string, column?: string, value?: string) {
  const filter = column && value ? `&${column}=eq.${encodeURIComponent(value)}` : "";
  const rows = await rest<{ sort: number }[]>(`${table}?select=sort${filter}&order=sort.desc&limit=1`);
  return (rows[0]?.sort ?? -1) + 1;
}

export async function listCategories() {
  const rows = await rest<CategoryRow[]>("be_categories?select=id,name,short,sort,audience&order=sort.asc");
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    short: row.short,
    sort: row.sort,
    audience: row.audience === "alone" ? "alone" as const : "with-child" as const,
  }));
}

export async function listSituations(categoryId: string) {
  const rows = await rest<SituationRow[]>(
    `be_situations?select=id,category_id,title,sort,tip,youtube_url&category_id=eq.${encodeURIComponent(categoryId)}&order=sort.asc`,
  );
  return rows.map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    sort: row.sort,
    tipKo: row.tip?.ko || "",
    youtubeUrl: row.youtube_url || "",
  }));
}

export async function phraseCounts() {
  const rows = await rest<{ situation_id: string }[]>("be_phrases?select=situation_id");
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.situation_id] = (counts[row.situation_id] || 0) + 1;
  return counts;
}

export async function listPhrases(situationId: string) {
  const rows = await rest<PhraseRow[]>(
    `be_phrases?select=id,situation_id,body,meanings,sort,before,after,youtube_url&situation_id=eq.${encodeURIComponent(situationId)}&order=sort.asc`,
  );
  return rows.map((row) => ({
    id: row.id,
    situationId: row.situation_id,
    body: row.body,
    sort: row.sort,
    meanings: textMap(row.meanings),
    beforeBody: row.before?.body || "",
    beforeMeanings: textMap(row.before?.meanings),
    afterBody: row.after?.body || "",
    afterMeanings: textMap(row.after?.meanings),
    youtubeUrl: row.youtube_url || "",
  }));
}

export async function listScripts() {
  const rows = await rest<ScriptRow[]>("be_scripts?select=id,category_id,title,titles,sort,youtube_url&order=sort.asc");
  return rows.map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    titles: textMap(row.titles),
    sort: row.sort,
    youtubeUrl: row.youtube_url || "",
  }));
}

export async function listTurns(scriptId: string) {
  const rows = await rest<TurnRow[]>(
    `be_practice_turns?select=id,situation_id,prompt,prompt_meanings,best_body,best_meanings,alt_body,alt_note,best_first,sort&situation_id=eq.${encodeURIComponent(scriptId)}&order=sort.asc`,
  );
  return rows.map((row) => ({
    id: row.id,
    scriptId: row.situation_id,
    sort: row.sort,
    prompt: row.prompt,
    promptMeanings: textMap(row.prompt_meanings),
    bestBody: row.best_body,
    bestMeanings: textMap(row.best_meanings),
    altBody: row.alt_body,
    altNote: row.alt_note,
    bestFirst: row.best_first,
  }));
}

export async function listGroups() {
  const rows = await rest<GroupRow[]>("be_short_groups?select=id,titles,sort,youtube_url&order=sort.asc");
  return rows.map((row) => ({
    id: row.id,
    sort: row.sort,
    titles: textMap(row.titles),
    youtubeUrl: row.youtube_url || "",
  }));
}

export async function listLines(groupId: string) {
  const rows = await rest<LineRow[]>(
    `be_short_lines?select=id,group_id,body,meanings,sort,youtube_url&group_id=eq.${encodeURIComponent(groupId)}&order=sort.asc`,
  );
  return rows.map((row) => ({
    id: row.id,
    groupId: row.group_id,
    sort: row.sort,
    body: row.body,
    meanings: textMap(row.meanings),
    youtubeUrl: row.youtube_url || "",
  }));
}

export async function createCategory(input: { id: string; name: string; short: string; audience: "with-child" | "alone"; sort?: number }) {
  const sort = input.sort ?? (await nextSort("be_categories"));
  await rest("be_categories", {
    method: "POST",
    body: JSON.stringify({ id: input.id, name: input.name, short: input.short || input.name, sort, audience: input.audience }),
  });
}

export async function updateCategory(input: { id: string; name: string; short: string; audience: "with-child" | "alone"; sort: number }) {
  await rest(`be_categories?id=eq.${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    body: JSON.stringify({ name: input.name, short: input.short || input.name, sort: input.sort, audience: input.audience }),
  });
}

export async function deleteCategory(id: string) {
  await rest(`be_categories?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function createSituation(input: { id: string; categoryId: string; title: string; tipKo: string; youtubeUrl: string | null; sort?: number }) {
  const sort = input.sort ?? (await nextSort("be_situations", "category_id", input.categoryId));
  await rest("be_situations", {
    method: "POST",
    body: JSON.stringify({
      id: input.id,
      category_id: input.categoryId,
      title: input.title,
      ready: true,
      builder: null,
      has_script: false,
      tip: input.tipKo ? { ko: input.tipKo } : {},
      sort,
      youtube_url: input.youtubeUrl,
    }),
  });
}

export async function updateSituation(input: { id: string; title: string; tipKo: string; youtubeUrl: string | null; sort: number }) {
  const current = await rest<SituationRow[]>(`be_situations?select=tip&id=eq.${encodeURIComponent(input.id)}&limit=1`);
  const tip = { ...(current[0]?.tip || {}) };
  if (input.tipKo) tip.ko = input.tipKo;
  else delete tip.ko;
  await rest(`be_situations?id=eq.${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: input.title,
      tip,
      sort: input.sort,
      youtube_url: input.youtubeUrl,
    }),
  });
}

export async function deleteSituation(id: string) {
  await rest(`be_situations?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

function lineJson(body: string, meanings: Record<string, string>) {
  if (!body) return null;
  return { body, meanings };
}

export async function createPhrase(input: {
  situationId: string;
  body: string;
  meanings: Record<string, string>;
  beforeBody: string;
  beforeMeanings: Record<string, string>;
  afterBody: string;
  afterMeanings: Record<string, string>;
  youtubeUrl: string | null;
  sort?: number;
}) {
  const sort = input.sort ?? (await nextSort("be_phrases", "situation_id", input.situationId));
  const id = `${input.situationId}-n${Date.now().toString(36)}`;
  await rest("be_phrases", {
    method: "POST",
    body: JSON.stringify({
      id,
      situation_id: input.situationId,
      body: input.body,
      meanings: input.meanings,
      sort,
      before: lineJson(input.beforeBody, input.beforeMeanings),
      after: lineJson(input.afterBody, input.afterMeanings),
      youtube_url: input.youtubeUrl,
    }),
  });
}

export async function updatePhrase(input: {
  id: string;
  body: string;
  meanings: Record<string, string>;
  beforeBody: string;
  beforeMeanings: Record<string, string>;
  afterBody: string;
  afterMeanings: Record<string, string>;
  youtubeUrl: string | null;
  sort: number;
}) {
  await rest(`be_phrases?id=eq.${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      body: input.body,
      meanings: input.meanings,
      sort: input.sort,
      before: lineJson(input.beforeBody, input.beforeMeanings),
      after: lineJson(input.afterBody, input.afterMeanings),
      youtube_url: input.youtubeUrl,
    }),
  });
}

export async function deletePhrase(id: string) {
  await rest(`be_phrases?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function createScript(input: {
  id: string;
  categoryId: string;
  title: string;
  titles: Record<string, string>;
  youtubeUrl: string | null;
  sort?: number;
}) {
  const sort = input.sort ?? (await nextSort("be_scripts", "category_id", input.categoryId));
  await rest("be_scripts", {
    method: "POST",
    body: JSON.stringify({
      id: input.id,
      category_id: input.categoryId,
      title: input.title,
      titles: input.titles,
      sort,
      youtube_url: input.youtubeUrl,
    }),
  });
}

export async function updateScript(input: {
  id: string;
  categoryId: string;
  title: string;
  titles: Record<string, string>;
  youtubeUrl: string | null;
  sort: number;
}) {
  await rest(`be_scripts?id=eq.${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      category_id: input.categoryId,
      title: input.title,
      titles: input.titles,
      sort: input.sort,
      youtube_url: input.youtubeUrl,
    }),
  });
}

export async function deleteScript(id: string) {
  await rest(`be_practice_turns?situation_id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  await rest(`be_scripts?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function createTurn(input: {
  scriptId: string;
  prompt: string;
  promptMeanings: Record<string, string>;
  bestBody: string;
  bestMeanings: Record<string, string>;
  altBody: string;
  altNote: string;
  bestFirst: boolean;
  sort?: number;
}) {
  const sort = input.sort ?? (await nextSort("be_practice_turns", "situation_id", input.scriptId));
  await rest("be_practice_turns", {
    method: "POST",
    body: JSON.stringify({
      id: `${input.scriptId}-t${Date.now().toString(36)}`,
      situation_id: input.scriptId,
      prompt: input.prompt,
      prompt_meanings: input.promptMeanings,
      best_body: input.bestBody,
      best_meanings: input.bestMeanings,
      alt_body: input.altBody,
      alt_note: input.altNote,
      best_first: input.bestFirst,
      sort,
    }),
  });
}

export async function updateTurn(input: {
  id: string;
  prompt: string;
  promptMeanings: Record<string, string>;
  bestBody: string;
  bestMeanings: Record<string, string>;
  altBody: string;
  altNote: string;
  bestFirst: boolean;
  sort: number;
}) {
  await rest(`be_practice_turns?id=eq.${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      prompt: input.prompt,
      prompt_meanings: input.promptMeanings,
      best_body: input.bestBody,
      best_meanings: input.bestMeanings,
      alt_body: input.altBody,
      alt_note: input.altNote,
      best_first: input.bestFirst,
      sort: input.sort,
    }),
  });
}

export async function deleteTurn(id: string) {
  await rest(`be_practice_turns?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function createGroup(input: { id: string; titles: Record<string, string>; youtubeUrl: string | null; sort?: number }) {
  const sort = input.sort ?? (await nextSort("be_short_groups"));
  await rest("be_short_groups", {
    method: "POST",
    body: JSON.stringify({ id: input.id, titles: input.titles, sort, youtube_url: input.youtubeUrl }),
  });
}

export async function updateGroup(input: { id: string; titles: Record<string, string>; youtubeUrl: string | null; sort: number }) {
  await rest(`be_short_groups?id=eq.${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    body: JSON.stringify({ titles: input.titles, sort: input.sort, youtube_url: input.youtubeUrl }),
  });
}

export async function deleteGroup(id: string) {
  await rest(`be_short_lines?group_id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  await rest(`be_short_groups?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function createLine(input: {
  groupId: string;
  body: string;
  meanings: Record<string, string>;
  youtubeUrl: string | null;
  sort?: number;
}) {
  const sort = input.sort ?? (await nextSort("be_short_lines", "group_id", input.groupId));
  await rest("be_short_lines", {
    method: "POST",
    body: JSON.stringify({
      id: `${input.groupId}-${sort}`,
      group_id: input.groupId,
      body: input.body,
      meanings: input.meanings,
      sort,
      youtube_url: input.youtubeUrl,
    }),
  });
}

export async function updateLine(input: {
  id: string;
  body: string;
  meanings: Record<string, string>;
  youtubeUrl: string | null;
  sort: number;
}) {
  await rest(`be_short_lines?id=eq.${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      body: input.body,
      meanings: input.meanings,
      sort: input.sort,
      youtube_url: input.youtubeUrl,
    }),
  });
}

export async function deleteLine(id: string) {
  await rest(`be_short_lines?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}
