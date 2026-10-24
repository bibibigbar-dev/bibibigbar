import Link from "next/link";

interface AdminNavProps {
  current: "overview" | "blog" | "shop" | "boards" | "posts" | "users";
}

const links = [
  { href: "/admin", key: "overview", label: "Overview" },
  { href: "/admin/blog", key: "blog", label: "Blog" },
  { href: "/admin/shop", key: "shop", label: "Shop" },
  { href: "/admin/boards", key: "boards", label: "Boards" },
  { href: "/admin/posts", key: "posts", label: "Posts" },
  { href: "/admin/users", key: "users", label: "Users" },
] as const;

export function AdminNav({ current }: AdminNavProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          className={`btn !min-h-10 text-sm ${
            current === link.key ? "btn-primary" : "btn-secondary"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
