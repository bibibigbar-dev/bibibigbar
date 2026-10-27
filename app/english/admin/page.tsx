import { EnglishAdmin, type EnglishAdminTab } from "@/components/english-admin";
import { requireAdminPage } from "@/lib/blog/guard";
import { EnglishAdminError, listCategories, listGroups, listLines, listPhrases, listScripts, listSituations, listTurns, phraseCounts } from "@/lib/english/admin-store";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "English studio",
  robots: { index: false, follow: false },
};

const tabs: EnglishAdminTab[] = ["categories", "sentences", "dialogues", "reactions"];

interface EnglishAdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function EnglishAdminPage({ searchParams }: EnglishAdminPageProps) {
  await requireAdminPage("/english/admin");
  const params = await searchParams;
  const requested = one(params.tab);
  const tab: EnglishAdminTab = tabs.includes(requested as EnglishAdminTab) ? requested as EnglishAdminTab : "categories";
  const categoryId = one(params.category);
  const situationId = one(params.situation);
  const scriptId = one(params.script);
  const groupId = one(params.group);
  const error = one(params.error);
  const saved = one(params.saved) === "1";

  let failure = "";
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let situations: Awaited<ReturnType<typeof listSituations>> = [];
  let phrases: Awaited<ReturnType<typeof listPhrases>> = [];
  let counts: Record<string, number> = {};
  let scripts: Awaited<ReturnType<typeof listScripts>> = [];
  let turns: Awaited<ReturnType<typeof listTurns>> = [];
  let groups: Awaited<ReturnType<typeof listGroups>> = [];
  let lines: Awaited<ReturnType<typeof listLines>> = [];

  try {
    categories = await listCategories();
    if (tab === "sentences" && categoryId) {
      situations = await listSituations(categoryId);
      counts = await phraseCounts();
      if (situationId) phrases = await listPhrases(situationId);
    }
    if (tab === "dialogues") {
      scripts = await listScripts();
      if (scriptId) turns = await listTurns(scriptId);
    }
    if (tab === "reactions") {
      groups = await listGroups();
      if (groupId) lines = await listLines(groupId);
    }
  } catch (caught) {
    failure = caught instanceof EnglishAdminError ? caught.message : "Could not load the catalog.";
  }

  return (
    <EnglishAdmin
      tab={tab}
      error={error}
      saved={saved}
      failure={failure}
      categories={categories}
      situations={situations}
      phrases={phrases}
      counts={counts}
      scripts={scripts}
      turns={turns}
      groups={groups}
      lines={lines}
      categoryId={categoryId}
      situationId={situationId}
      scriptId={scriptId}
      groupId={groupId}
    />
  );
}
