import Link from "next/link";
import { getActiveBoards } from "@/lib/queries";

export const metadata = {
  title: "Boards",
};

export default async function BoardsPage() {
  const boards = await getActiveBoards();

  return (
    <div className="container py-12">
      <h1 className="display text-4xl font-bold text-[var(--sky-deep)]">Boards</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Choose a topic and join the conversation.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.slug}`}
            className="surface rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
          >
            <h2 className="text-2xl font-bold text-[var(--sky-deep)]">{board.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{board.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
