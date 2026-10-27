"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  EnglishAdminError,
  createCategory,
  createGroup,
  createLine,
  createPhrase,
  createScript,
  createSituation,
  createTurn,
  deleteCategory,
  deleteGroup,
  deleteLine,
  deletePhrase,
  deleteScript,
  deleteSituation,
  deleteTurn,
  updateCategory,
  updateGroup,
  updateLine,
  updatePhrase,
  updateScript,
  updateSituation,
  updateTurn,
} from "@/lib/english/admin-store";

function text(form: FormData, name: string) {
  return String(form.get(name) || "").trim();
}

function cleanId(value: string) {
  const id = value.trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ? id : "";
}

function numberValue(form: FormData, name: string) {
  const raw = text(form, name);
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

function requiredNumber(form: FormData, name: string) {
  const value = numberValue(form, name);
  return value ?? 0;
}

function audience(form: FormData) {
  return text(form, "audience") === "alone" ? "alone" as const : "with-child" as const;
}

function meanings(form: FormData, prefix = "") {
  const result: Record<string, string> = {};
  const pairs = [
    ["ko", "Ko"],
    ["es", "Es"],
    ["zh", "Zh"],
    ["vi", "Vi"],
  ] as const;
  for (const [lang, suffix] of pairs) {
    const value = text(form, `${prefix}${suffix}`);
    if (value) result[lang] = value;
  }
  return result;
}

function titles(form: FormData) {
  const result: Record<string, string> = {};
  for (const lang of ["en", "ko", "es", "zh", "vi"] as const) {
    const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
    const value = text(form, `title${suffix}`);
    if (value) result[lang] = value;
  }
  return result;
}

function youtube(form: FormData, name = "youtubeUrl") {
  const raw = text(form, name);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    const allowed = host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com";
    if (url.protocol === "https:" && allowed) return raw;
  } catch {
    return "invalid" as const;
  }
  return "invalid" as const;
}

function checked(form: FormData, name: string) {
  return form.get(name) === "1";
}

function finish(params: Record<string, string>) {
  revalidatePath("/english/admin");
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  redirect(`/english/admin?${search.toString()}`);
}

function fail(params: Record<string, string>, error: unknown) {
  if (typeof error === "object" && error !== null && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) {
    throw error;
  }
  const message = error instanceof EnglishAdminError ? error.message : "Could not save.";
  finish({ ...params, error: message });
}

function requireYoutube(form: FormData) {
  const value = youtube(form);
  if (value === "invalid") throw new EnglishAdminError("Use a full https YouTube link.");
  return value;
}

export async function createCategoryAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "categories" };
  try {
    const id = cleanId(text(form, "id"));
    const name = text(form, "name");
    if (!id || !name) throw new EnglishAdminError("Add a short id, using letters and numbers, and a name.");
    await createCategory({ id, name, short: text(form, "short"), audience: audience(form), sort: numberValue(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function updateCategoryAction(form: FormData) {
  await requireAdmin();
  const id = cleanId(text(form, "id"));
  const back = { tab: "categories" };
  try {
    const name = text(form, "name");
    if (!id || !name) throw new EnglishAdminError("A category needs a name.");
    await updateCategory({ id, name, short: text(form, "short"), audience: audience(form), sort: requiredNumber(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function deleteCategoryAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "categories" };
  try {
    const id = cleanId(text(form, "id"));
    if (!id) throw new EnglishAdminError("Missing category.");
    await deleteCategory(id);
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function createSituationAction(form: FormData) {
  await requireAdmin();
  const categoryId = cleanId(text(form, "categoryId"));
  const back = { tab: "sentences", category: categoryId };
  try {
    const id = cleanId(text(form, "id"));
    const title = text(form, "title");
    if (!categoryId || !id || !title) throw new EnglishAdminError("Add a situation id and a title.");
    await createSituation({
      id,
      categoryId,
      title,
      tipKo: text(form, "tipKo"),
      youtubeUrl: requireYoutube(form),
      sort: numberValue(form, "sort"),
    });
    finish({ ...back, situation: id, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function updateSituationAction(form: FormData) {
  await requireAdmin();
  const categoryId = cleanId(text(form, "categoryId"));
  const id = cleanId(text(form, "id"));
  const back = { tab: "sentences", category: categoryId, situation: id };
  try {
    const title = text(form, "title");
    if (!id || !title) throw new EnglishAdminError("A situation needs a title.");
    await updateSituation({ id, title, tipKo: text(form, "tipKo"), youtubeUrl: requireYoutube(form), sort: requiredNumber(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function deleteSituationAction(form: FormData) {
  await requireAdmin();
  const categoryId = cleanId(text(form, "categoryId"));
  const back = { tab: "sentences", category: categoryId };
  try {
    const id = cleanId(text(form, "id"));
    if (!id) throw new EnglishAdminError("Missing situation.");
    await deleteSituation(id);
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

function phraseInput(form: FormData) {
  const body = text(form, "body");
  if (!body) throw new EnglishAdminError("Add the English sentence.");
  return {
    body,
    meanings: meanings(form),
    beforeBody: text(form, "beforeBody"),
    beforeMeanings: meanings(form, "before"),
    afterBody: text(form, "afterBody"),
    afterMeanings: meanings(form, "after"),
    youtubeUrl: requireYoutube(form),
  };
}

export async function createPhraseAction(form: FormData) {
  await requireAdmin();
  const categoryId = cleanId(text(form, "categoryId"));
  const situationId = cleanId(text(form, "situationId"));
  const back = { tab: "sentences", category: categoryId, situation: situationId };
  try {
    if (!situationId) throw new EnglishAdminError("Choose a situation first.");
    await createPhrase({ situationId, ...phraseInput(form), sort: numberValue(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function updatePhraseAction(form: FormData) {
  await requireAdmin();
  const categoryId = cleanId(text(form, "categoryId"));
  const situationId = cleanId(text(form, "situationId"));
  const id = text(form, "id").trim();
  const back = { tab: "sentences", category: categoryId, situation: situationId };
  try {
    if (!id) throw new EnglishAdminError("Missing sentence.");
    await updatePhrase({ id, ...phraseInput(form), sort: requiredNumber(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function deletePhraseAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "sentences", category: cleanId(text(form, "categoryId")), situation: cleanId(text(form, "situationId")) };
  try {
    const id = text(form, "id").trim();
    if (!id) throw new EnglishAdminError("Missing sentence.");
    await deletePhrase(id);
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function createScriptAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "dialogues" };
  try {
    const id = cleanId(text(form, "id"));
    const categoryId = cleanId(text(form, "categoryId"));
    const title = text(form, "titleKo");
    if (!id || !categoryId || !title) throw new EnglishAdminError("Add a dialogue id, a category, and a Korean title.");
    await createScript({ id, categoryId, title, titles: titles(form), youtubeUrl: requireYoutube(form), sort: numberValue(form, "sort") });
    finish({ ...back, script: id, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function updateScriptAction(form: FormData) {
  await requireAdmin();
  const id = cleanId(text(form, "id"));
  const back = { tab: "dialogues", script: id };
  try {
    const categoryId = cleanId(text(form, "categoryId"));
    const title = text(form, "titleKo");
    if (!id || !categoryId || !title) throw new EnglishAdminError("A dialogue needs a category and a Korean title.");
    await updateScript({ id, categoryId, title, titles: titles(form), youtubeUrl: requireYoutube(form), sort: requiredNumber(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function deleteScriptAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "dialogues" };
  try {
    const id = cleanId(text(form, "id"));
    if (!id) throw new EnglishAdminError("Missing dialogue.");
    await deleteScript(id);
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

function turnInput(form: FormData) {
  const prompt = text(form, "prompt");
  const bestBody = text(form, "bestBody");
  if (!prompt || !bestBody) throw new EnglishAdminError("Add what the other person says and the best answer.");
  return {
    prompt,
    promptMeanings: meanings(form, "prompt"),
    bestBody,
    bestMeanings: meanings(form, "best"),
    altBody: text(form, "altBody"),
    altNote: text(form, "altNote"),
    bestFirst: checked(form, "bestFirst"),
  };
}

export async function createTurnAction(form: FormData) {
  await requireAdmin();
  const scriptId = cleanId(text(form, "scriptId"));
  const back = { tab: "dialogues", script: scriptId };
  try {
    if (!scriptId) throw new EnglishAdminError("Choose a dialogue first.");
    await createTurn({ scriptId, ...turnInput(form), sort: numberValue(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function updateTurnAction(form: FormData) {
  await requireAdmin();
  const scriptId = cleanId(text(form, "scriptId"));
  const id = text(form, "id").trim();
  const back = { tab: "dialogues", script: scriptId };
  try {
    if (!id) throw new EnglishAdminError("Missing line.");
    await updateTurn({ id, ...turnInput(form), sort: requiredNumber(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function deleteTurnAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "dialogues", script: cleanId(text(form, "scriptId")) };
  try {
    const id = text(form, "id").trim();
    if (!id) throw new EnglishAdminError("Missing line.");
    await deleteTurn(id);
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function createGroupAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "reactions" };
  try {
    const id = cleanId(text(form, "id"));
    const names = titles(form);
    if (!id || !names.en || !names.ko) throw new EnglishAdminError("Add an id plus English and Korean names.");
    await createGroup({ id, titles: names, youtubeUrl: requireYoutube(form), sort: numberValue(form, "sort") });
    finish({ ...back, group: id, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function updateGroupAction(form: FormData) {
  await requireAdmin();
  const id = cleanId(text(form, "id"));
  const back = { tab: "reactions", group: id };
  try {
    const names = titles(form);
    if (!id || !names.en || !names.ko) throw new EnglishAdminError("A reaction group needs English and Korean names.");
    await updateGroup({ id, titles: names, youtubeUrl: requireYoutube(form), sort: requiredNumber(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function deleteGroupAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "reactions" };
  try {
    const id = cleanId(text(form, "id"));
    if (!id) throw new EnglishAdminError("Missing reaction group.");
    await deleteGroup(id);
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function createLineAction(form: FormData) {
  await requireAdmin();
  const groupId = cleanId(text(form, "groupId"));
  const back = { tab: "reactions", group: groupId };
  try {
    const body = text(form, "body");
    if (!groupId || !body) throw new EnglishAdminError("Add the short English line.");
    await createLine({ groupId, body, meanings: meanings(form), youtubeUrl: requireYoutube(form), sort: numberValue(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function updateLineAction(form: FormData) {
  await requireAdmin();
  const groupId = cleanId(text(form, "groupId"));
  const id = text(form, "id").trim();
  const back = { tab: "reactions", group: groupId };
  try {
    const body = text(form, "body");
    if (!id || !body) throw new EnglishAdminError("Add the short English line.");
    await updateLine({ id, body, meanings: meanings(form), youtubeUrl: requireYoutube(form), sort: requiredNumber(form, "sort") });
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}

export async function deleteLineAction(form: FormData) {
  await requireAdmin();
  const back = { tab: "reactions", group: cleanId(text(form, "groupId")) };
  try {
    const id = text(form, "id").trim();
    if (!id) throw new EnglishAdminError("Missing line.");
    await deleteLine(id);
    finish({ ...back, saved: "1" });
  } catch (error) {
    fail(back, error);
  }
}
