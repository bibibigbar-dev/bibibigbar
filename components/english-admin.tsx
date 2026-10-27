import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import {
  createCategoryAction,
  createGroupAction,
  createLineAction,
  createPhraseAction,
  createScriptAction,
  createSituationAction,
  createTurnAction,
  deleteCategoryAction,
  deleteGroupAction,
  deleteLineAction,
  deletePhraseAction,
  deleteScriptAction,
  deleteSituationAction,
  deleteTurnAction,
  updateCategoryAction,
  updateGroupAction,
  updateLineAction,
  updatePhraseAction,
  updateScriptAction,
  updateSituationAction,
  updateTurnAction,
} from "@/lib/actions/english-admin";
import type {
  EnglishCategory,
  EnglishGroup,
  EnglishLine,
  EnglishPhrase,
  EnglishScript,
  EnglishSituation,
  EnglishTurn,
} from "@/lib/english/admin-store";

const tabs = [
  { id: "categories", label: "Categories" },
  { id: "sentences", label: "Sentences" },
  { id: "dialogues", label: "Dialogues" },
  { id: "reactions", label: "Reactions" },
] as const;

export type EnglishAdminTab = (typeof tabs)[number]["id"];

const shortField = { minHeight: 72 };

interface EnglishAdminProps {
  tab: EnglishAdminTab;
  error: string;
  saved: boolean;
  failure: string;
  categories: EnglishCategory[];
  situations: EnglishSituation[];
  phrases: EnglishPhrase[];
  counts: Record<string, number>;
  scripts: EnglishScript[];
  turns: EnglishTurn[];
  groups: EnglishGroup[];
  lines: EnglishLine[];
  categoryId: string;
  situationId: string;
  scriptId: string;
  groupId: string;
}

export function EnglishAdmin(props: EnglishAdminProps) {
  return (
    <div className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sunset)]">English</p>
      <h1 className="display mt-2 text-4xl font-bold text-[var(--sky-deep)]">Sentence studio</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Shared English lines, example talks, practice dialogues, and YouTube links. Names and saved sentences stay on the phone.
      </p>
      <div className="mt-8">
        <AdminNav current="english" />
      </div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Link key={item.id} href={`/english/admin?tab=${item.id}`} className={`btn !min-h-10 text-sm ${props.tab === item.id ? "btn-primary" : "btn-secondary"}`}>
            {item.label}
          </Link>
        ))}
      </div>
      {props.saved ? <p className="mt-6 rounded-2xl bg-[var(--sky-deep)]/10 px-4 py-3 text-sm font-semibold text-[var(--sky-deep)]">Saved. The app reads this on its next open.</p> : null}
      {props.error ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{props.error}</p> : null}
      {props.failure ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{props.failure}</p> : null}
      {props.failure ? null : <section className="mt-8">{panel(props)}</section>}
    </div>
  );
}

function panel(props: EnglishAdminProps) {
  if (props.tab === "sentences") return <Sentences {...props} />;
  if (props.tab === "dialogues") return <Dialogues {...props} />;
  if (props.tab === "reactions") return <Reactions {...props} />;
  return <Categories categories={props.categories} />;
}

function Categories({ categories }: { categories: EnglishCategory[] }) {
  return (
    <div className="grid gap-8">
      <form action={createCategoryAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-xl font-bold text-[var(--sky-deep)]">Add a category</h2>
        <Field label="Id" name="id" required placeholder="school" />
        <Field label="Name" name="name" required placeholder="School" />
        <Field label="Short name" name="short" placeholder="School" />
        <AudienceField />
        <Field label="Order" name="sort" type="number" />
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary">Add category</button>
        </div>
      </form>
      <div className="grid gap-4">
        {categories.map((category) => (
          <form key={category.id} action={updateCategoryAction} className="surface grid gap-4 rounded-[1.5rem] p-5 md:grid-cols-2">
            <input type="hidden" name="id" value={category.id} />
            <p className="md:col-span-2 text-sm font-semibold text-[var(--muted)]">{category.id}</p>
            <Field label="Name" name="name" required defaultValue={category.name} />
            <Field label="Short name" name="short" defaultValue={category.short} />
            <AudienceField value={category.audience} />
            <Field label="Order" name="sort" type="number" defaultValue={String(category.sort)} />
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button type="submit" className="btn btn-primary !min-h-10 text-sm">Save category</button>
              <button type="submit" formAction={deleteCategoryAction} formNoValidate className="btn btn-danger !min-h-10 text-sm">Delete</button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

function Sentences(props: EnglishAdminProps) {
  const situation = props.situations.find((item) => item.id === props.situationId);
  return (
    <div className="grid gap-8">
      <Chooser
        items={props.categories.map((category) => ({ id: category.id, label: category.name }))}
        selected={props.categoryId}
        hrefFor={(id) => `/english/admin?tab=sentences&category=${id}`}
        empty="Add a category first."
      />
      {props.categoryId ? (
        <form action={createSituationAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-xl font-bold text-[var(--sky-deep)]">Add a situation</h2>
          <input type="hidden" name="categoryId" value={props.categoryId} />
          <Field label="Id" name="id" required placeholder="absent" />
          <Field label="Title" name="title" required placeholder="Report an absence" />
          <Field label="Tip" name="tipKo" className="md:col-span-2" />
          <Field label="YouTube URL" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
          <Field label="Order" name="sort" type="number" />
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary">Add situation</button>
          </div>
        </form>
      ) : null}
      {props.situations.length ? (
        <Chooser
          items={props.situations.map((item) => ({ id: item.id, label: `${item.title} · ${props.counts[item.id] || 0}` }))}
          selected={props.situationId}
          hrefFor={(id) => `/english/admin?tab=sentences&category=${props.categoryId}&situation=${id}`}
          empty=""
        />
      ) : null}
      {situation ? (
        <form action={updateSituationAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-xl font-bold text-[var(--sky-deep)]">{situation.title}</h2>
          <input type="hidden" name="categoryId" value={props.categoryId} />
          <input type="hidden" name="id" value={situation.id} />
          <Field label="Title" name="title" required defaultValue={situation.title} />
          <Field label="Order" name="sort" type="number" defaultValue={String(situation.sort)} />
          <Field label="Tip" name="tipKo" defaultValue={situation.tipKo} className="md:col-span-2" />
          <Field label="Situation video" name="youtubeUrl" defaultValue={situation.youtubeUrl} placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
          <p className="md:col-span-2 text-sm text-[var(--muted)]">This video plays at the top of the situation, before the sentence list.</p>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button type="submit" className="btn btn-primary !min-h-10 text-sm">Save situation</button>
            <button type="submit" formAction={deleteSituationAction} formNoValidate className="btn btn-danger !min-h-10 text-sm">Delete situation and its sentences</button>
          </div>
        </form>
      ) : null}
      {situation ? (
        <form action={createPhraseAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-xl font-bold text-[var(--sky-deep)]">Add a sentence</h2>
          <input type="hidden" name="categoryId" value={props.categoryId} />
          <input type="hidden" name="situationId" value={situation.id} />
          <PhraseFields />
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary">Add sentence</button>
          </div>
        </form>
      ) : null}
      <div className="grid gap-3">
        {props.phrases.map((phrase) => (
          <details key={phrase.id} className="surface rounded-[1.5rem] p-5">
            <summary className="cursor-pointer font-semibold text-[var(--sky-deep)]">{phrase.body}</summary>
            <form action={updatePhraseAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <input type="hidden" name="categoryId" value={props.categoryId} />
              <input type="hidden" name="situationId" value={phrase.situationId} />
              <input type="hidden" name="id" value={phrase.id} />
              <PhraseFields phrase={phrase} />
              <div className="flex flex-wrap gap-2 md:col-span-2">
                <button type="submit" className="btn btn-primary !min-h-10 text-sm">Save sentence</button>
                <button type="submit" formAction={deletePhraseAction} formNoValidate className="btn btn-danger !min-h-10 text-sm">Delete sentence</button>
              </div>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function Dialogues(props: EnglishAdminProps) {
  const script = props.scripts.find((item) => item.id === props.scriptId);
  return (
    <div className="grid gap-8">
      <form action={createScriptAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-xl font-bold text-[var(--sky-deep)]">Add a dialogue</h2>
        <Field label="Id" name="id" required placeholder="school-absent" />
        <label className="field">
          <span>Category</span>
          <select name="categoryId" required defaultValue="">
            <option value="" disabled>Choose</option>
            {props.categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <TitleFields />
        <Field label="YouTube URL" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
        <p className="md:col-span-2 text-sm text-[var(--muted)]">This video is the one beside Try again after the practice ends.</p>
        <Field label="Order" name="sort" type="number" />
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary">Add dialogue</button>
        </div>
      </form>
      <Chooser
        items={props.scripts.map((item) => ({ id: item.id, label: item.title }))}
        selected={props.scriptId}
        hrefFor={(id) => `/english/admin?tab=dialogues&script=${id}`}
        empty="No dialogues yet."
      />
      {script ? (
        <form action={updateScriptAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
          <input type="hidden" name="id" value={script.id} />
          <label className="field">
            <span>Category</span>
            <select name="categoryId" defaultValue={script.categoryId}>
              {props.categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <Field label="Order" name="sort" type="number" defaultValue={String(script.sort)} />
          <TitleFields titles={{ ...script.titles, ko: script.title }} />
          <Field label="YouTube URL" name="youtubeUrl" defaultValue={script.youtubeUrl} placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button type="submit" className="btn btn-primary !min-h-10 text-sm">Save dialogue</button>
            <button type="submit" formAction={deleteScriptAction} formNoValidate className="btn btn-danger !min-h-10 text-sm">Delete dialogue</button>
          </div>
        </form>
      ) : null}
      {script ? (
        <form action={createTurnAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-xl font-bold text-[var(--sky-deep)]">Add a turn</h2>
          <input type="hidden" name="scriptId" value={script.id} />
          <TurnFields />
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary">Add turn</button>
          </div>
        </form>
      ) : null}
      <div className="grid gap-3">
        {props.turns.map((turn) => (
          <details key={turn.id} className="surface rounded-[1.5rem] p-5">
            <summary className="cursor-pointer font-semibold text-[var(--sky-deep)]">{turn.prompt}</summary>
            <form action={updateTurnAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <input type="hidden" name="scriptId" value={turn.scriptId} />
              <input type="hidden" name="id" value={turn.id} />
              <TurnFields turn={turn} />
              <div className="flex flex-wrap gap-2 md:col-span-2">
                <button type="submit" className="btn btn-primary !min-h-10 text-sm">Save turn</button>
                <button type="submit" formAction={deleteTurnAction} formNoValidate className="btn btn-danger !min-h-10 text-sm">Delete turn</button>
              </div>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function Reactions(props: EnglishAdminProps) {
  const group = props.groups.find((item) => item.id === props.groupId);
  return (
    <div className="grid gap-8">
      <form action={createGroupAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-xl font-bold text-[var(--sky-deep)]">Add a reaction group</h2>
        <Field label="Id" name="id" required placeholder="agree" />
        <Field label="Order" name="sort" type="number" />
        <TitleFields />
        <Field label="Group video" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
        <p className="md:col-span-2 text-sm text-[var(--muted)]">This video reads every line in the group. Each line can also have its own example video.</p>
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary">Add group</button>
        </div>
      </form>
      <Chooser
        items={props.groups.map((item) => ({ id: item.id, label: item.titles.ko || item.titles.en || item.id }))}
        selected={props.groupId}
        hrefFor={(id) => `/english/admin?tab=reactions&group=${id}`}
        empty="No reaction groups yet."
      />
      {group ? (
        <form action={updateGroupAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
          <input type="hidden" name="id" value={group.id} />
          <Field label="Order" name="sort" type="number" defaultValue={String(group.sort)} />
          <TitleFields titles={group.titles} />
          <Field label="Group video" name="youtubeUrl" defaultValue={group.youtubeUrl} placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button type="submit" className="btn btn-primary !min-h-10 text-sm">Save group</button>
            <button type="submit" formAction={deleteGroupAction} formNoValidate className="btn btn-danger !min-h-10 text-sm">Delete group and its lines</button>
          </div>
        </form>
      ) : null}
      {group ? (
        <form action={createLineAction} className="surface grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
          <h2 className="md:col-span-2 text-xl font-bold text-[var(--sky-deep)]">Add a line</h2>
          <input type="hidden" name="groupId" value={group.id} />
          <Field label="English" name="body" required placeholder="Okay." className="md:col-span-2" />
          <MeaningFields />
          <Field label="Line video" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
          <Field label="Order" name="sort" type="number" />
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary">Add line</button>
          </div>
        </form>
      ) : null}
      <div className="grid gap-3">
        {props.lines.map((line) => (
          <details key={line.id} className="surface rounded-[1.5rem] p-5">
            <summary className="cursor-pointer font-semibold text-[var(--sky-deep)]">{line.body}</summary>
            <form action={updateLineAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <input type="hidden" name="groupId" value={line.groupId} />
              <input type="hidden" name="id" value={line.id} />
              <Field label="English" name="body" required defaultValue={line.body} className="md:col-span-2" />
              <MeaningFields meanings={line.meanings} />
              <Field label="Line video" name="youtubeUrl" defaultValue={line.youtubeUrl} placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
              <Field label="Order" name="sort" type="number" defaultValue={String(line.sort)} />
              <div className="flex flex-wrap gap-2 md:col-span-2">
                <button type="submit" className="btn btn-primary !min-h-10 text-sm">Save line</button>
                <button type="submit" formAction={deleteLineAction} formNoValidate className="btn btn-danger !min-h-10 text-sm">Delete line</button>
              </div>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function PhraseFields({ phrase }: { phrase?: EnglishPhrase }) {
  return (
    <>
      <Field label="English sentence" name="body" required defaultValue={phrase?.body} className="md:col-span-2" />
      <MeaningFields meanings={phrase?.meanings} />
      <Field label="Example before" name="beforeBody" defaultValue={phrase?.beforeBody} placeholder="What the other person says" className="md:col-span-2" />
      <MeaningFields prefix="before" meanings={phrase?.beforeMeanings} />
      <Field label="Example after" name="afterBody" defaultValue={phrase?.afterBody} placeholder="What they say next" className="md:col-span-2" />
      <MeaningFields prefix="after" meanings={phrase?.afterMeanings} />
      <Field label="Sentence video" name="youtubeUrl" defaultValue={phrase?.youtubeUrl} placeholder="https://www.youtube.com/watch?v=" className="md:col-span-2" />
      <Field label="Order" name="sort" type="number" defaultValue={phrase ? String(phrase.sort) : undefined} />
    </>
  );
}

function TurnFields({ turn }: { turn?: EnglishTurn }) {
  return (
    <>
      <Field label="They say" name="prompt" required defaultValue={turn?.prompt} className="md:col-span-2" />
      <MeaningFields prefix="prompt" meanings={turn?.promptMeanings} />
      <Field label="Best answer" name="bestBody" required defaultValue={turn?.bestBody} className="md:col-span-2" />
      <MeaningFields prefix="best" meanings={turn?.bestMeanings} />
      <Field label="Other answer" name="altBody" defaultValue={turn?.altBody} className="md:col-span-2" />
      <Field label="Note" name="altNote" defaultValue={turn?.altNote} />
      <Field label="Order" name="sort" type="number" defaultValue={turn ? String(turn.sort) : undefined} />
      <label className="flex items-center gap-3 text-sm font-semibold md:col-span-2">
        <input type="checkbox" name="bestFirst" value="1" defaultChecked={turn ? turn.bestFirst : true} />
        <span>Show the best answer first</span>
      </label>
    </>
  );
}

function TitleFields({ titles }: { titles?: Record<string, string> }) {
  return (
    <>
      <Field label="English title" name="titleEn" required defaultValue={titles?.en} />
      <Field label="Korean title" name="titleKo" required defaultValue={titles?.ko} />
      <Field label="Spanish title" name="titleEs" defaultValue={titles?.es} />
      <Field label="Chinese title" name="titleZh" defaultValue={titles?.zh} />
      <Field label="Vietnamese title" name="titleVi" defaultValue={titles?.vi} />
    </>
  );
}

function MeaningFields({ prefix = "", meanings }: { prefix?: string; meanings?: Record<string, string> }) {
  return (
    <>
      <Field label="Korean" name={`${prefix}Ko`} defaultValue={meanings?.ko} />
      <Field label="Spanish" name={`${prefix}Es`} defaultValue={meanings?.es} />
      <Field label="Chinese" name={`${prefix}Zh`} defaultValue={meanings?.zh} />
      <Field label="Vietnamese" name={`${prefix}Vi`} defaultValue={meanings?.vi} />
    </>
  );
}

function AudienceField({ value }: { value?: string }) {
  return (
    <label className="field">
      <span>Who it is for</span>
      <select name="audience" defaultValue={value === "alone" ? "alone" : "with-child"}>
        <option value="with-child">With a child</option>
        <option value="alone">On her own</option>
      </select>
    </label>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
  className = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  const long = type === "text" && (name.includes("ody") || name === "prompt" || name === "bestBody" || name === "altBody" || name === "tipKo" || name.endsWith("Body"));
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      {long ? (
        <textarea name={name} required={required} defaultValue={defaultValue} placeholder={placeholder} style={shortField} />
      ) : (
        <input name={name} type={type} required={required} defaultValue={defaultValue} placeholder={placeholder} />
      )}
    </label>
  );
}

function Chooser({
  items,
  selected,
  hrefFor,
  empty,
}: {
  items: { id: string; label: string }[];
  selected: string;
  hrefFor: (id: string) => string;
  empty: string;
}) {
  if (!items.length) return empty ? <p className="text-[var(--muted)]">{empty}</p> : null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link key={item.id} href={hrefFor(item.id)} className={`btn !min-h-10 text-sm ${item.id === selected ? "btn-primary" : "btn-secondary"}`}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
