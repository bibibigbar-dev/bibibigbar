"use client";

import Link from "next/link";
import { useState } from "react";

type PostStatus = "published" | "draft" | "scheduled";

interface BlogListPost {
  id: string;
  title: string;
  status: PostStatus;
  updatedAt: string;
  previewHref: string;
  previewLabel: string;
}

interface AdminBlogListProps {
  posts: BlogListPost[];
}

export function AdminBlogList({ posts }: AdminBlogListProps) {
  const [shown, setShown] = useState(5);
  const visible = posts.slice(0, shown);

  return (
    <>
      <div className="surface overflow-x-auto rounded-[1.5rem]">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {visible.length ? (
              visible.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/blog/${post.id}`} className="font-semibold text-[var(--sky-deep)]">
                      {post.title}
                    </Link>
                    <p className="text-xs text-[var(--muted)]">
                      <a href={post.previewHref}>{post.previewLabel}</a>
                    </p>
                  </td>
                  <td className="capitalize">{post.status}</td>
                  <td>{post.updatedAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No posts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {shown < posts.length ? (
        <div className="blog-more">
          <button type="button" className="btn btn-secondary" onClick={() => setShown((count) => count + 5)}>
            Load more
          </button>
        </div>
      ) : null}
    </>
  );
}
