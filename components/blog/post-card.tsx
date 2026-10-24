import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog/types";

interface PostCardProps {
  post: BlogPost;
  href: string;
}

export function PostCard({ post, href }: PostCardProps) {
  return (
    <article className="blog-card">
      {post.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImageUrl} alt="" className="blog-card-cover" />
      ) : null}
      <div className="blog-card-body">
        <p className="blog-kicker">
          {post.destination || "On the road"}
          {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
        </p>
        <h2>
          <Link href={href}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <p className="blog-meta">{post.readingMinutes} min read</p>
      </div>
    </article>
  );
}
