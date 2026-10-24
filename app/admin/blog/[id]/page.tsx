import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { BlogEditor } from "@/components/blog/blog-editor";
import { requireAdminPage } from "@/lib/blog/guard";
import { getBlogRepository } from "@/lib/blog";

export const dynamic = "force-dynamic";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export async function generateMetadata({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const post = await getBlogRepository().getPostById(id);
  return { title: post ? `Edit ${post.title}` : "Edit post" };
}

export default async function EditBlogPostPage({ params, searchParams }: EditBlogPostPageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  await requireAdminPage(`/admin/blog/${id}`);
  const post = await getBlogRepository().getPostById(id);
  if (!post) notFound();

  return (
    <div className="container py-12">
      <AdminNav current="blog" />
      <BlogEditor post={post} saved={saved === "1"} />
    </div>
  );
}
