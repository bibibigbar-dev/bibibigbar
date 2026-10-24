import { AdminNav } from "@/components/admin-nav";
import { BlogEditor } from "@/components/blog/blog-editor";
import { requireAdminPage } from "@/lib/blog/guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "New post" };

export default async function NewBlogPostPage() {
  await requireAdminPage("/admin/blog/new");

  return (
    <div className="container py-12">
      <AdminNav current="blog" />
      <BlogEditor post={null} />
    </div>
  );
}
