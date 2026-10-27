"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { editorFonts } from "@/lib/blog/fonts";
import { deleteBlogPostAction, saveBlogPostAction, uploadBlogImageAction } from "@/lib/actions/blog";
import { toDatetimeLocalValue } from "@/lib/blog/slug";
import type { BlogPost } from "@/lib/blog/types";

const acceptedImages = "image/jpeg,image/png,image/webp,image/gif";

function imageFiles(list: FileList | null | undefined) {
  return [...(list || [])].filter((file) => file.type.startsWith("image/"));
}

interface BlogEditorProps {
  post: BlogPost | null;
  saved?: boolean;
}

export function BlogEditor({ post, saved = false }: BlogEditorProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [activeFont, setActiveFont] = useState("");
  const [html, setHtml] = useState(post?.content || "<p></p>");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<(files: File[], position?: number) => Promise<void>>(async () => {});
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      ImageExtension.configure({ allowBase64: false }),
      Placeholder.configure({
        placeholder: "Write the travel story. Place the cursor where a photo belongs, then upload it.",
      }),
    ],
    content: post?.content || "<p></p>",
    editorProps: {
      attributes: {
        class: "blog-prose blog-editor-surface",
      },
      handlePaste: (_view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (!files.length) return false;
        event.preventDefault();
        void uploadRef.current(files);
        return true;
      },
      handleDrop: (view, event) => {
        const files = imageFiles(event.dataTransfer?.files);
        if (!files.length) return false;
        event.preventDefault();
        const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void uploadRef.current(files, position);
        return true;
      },
    },
    onUpdate: ({ editor: current }) => {
      setHtml(current.getHTML());
      setActiveFont((current.getAttributes("textStyle").fontFamily as string | undefined) || "");
    },
    onSelectionUpdate: ({ editor: current }) => {
      setActiveFont((current.getAttributes("textStyle").fontFamily as string | undefined) || "");
    },
  });

  uploadRef.current = async (files, position) => {
    if (!editor) return;
    await insertUploadedImages(editor, files, position, setError, setIsUploading);
  };

  function handleSubmit(formData: FormData) {
    formData.set("content", html);
    setError(null);
    startTransition(async () => {
      const result = await saveBlogPostAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.id) router.push(`/admin/blog/${result.id}?saved=1`);
    });
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function onInlineFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = imageFiles(event.target.files);
    event.target.value = "";
    if (!files.length) return;
    await uploadRef.current(files);
  }

  async function onCoverFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const url = await uploadImageFile(file);
      setCoverImageUrl(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload the cover.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sunset)]">Studio</p>
          <h1 className="display mt-2 text-4xl font-bold text-[var(--sky-deep)]">
            {post ? "Edit dispatch" : "New dispatch"}
          </h1>
        </div>
        <Link href="/admin/blog" className="btn btn-secondary">
          All posts
        </Link>
      </div>

      {saved ? <p className="blog-note">Saved.</p> : null}
      {error ? <p className="blog-error">{error}</p> : null}

      <form action={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <input type="hidden" name="id" value={post?.id || ""} />
        <section className="surface rounded-[1.5rem] p-4 sm:p-6">
          <label className="field">
            <span>Title</span>
            <input name="title" defaultValue={post?.title || ""} required placeholder="A slow weekend in Jeonju" />
          </label>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Put the cursor in the paragraph, then upload a JPG, PNG, WebP, or GIF. You can also paste or drop a photo there.
          </p>
          <div className="blog-toolbar" role="toolbar" aria-label="Formatting">
            <select
              aria-label="Font"
              value={activeFont}
              disabled={!editor}
              style={{ fontFamily: activeFont || undefined }}
              onChange={(event) => {
                if (!editor) return;
                const family = event.target.value;
                const chain = editor.chain().focus();
                if (!family) chain.unsetFontFamily().run();
                else chain.setFontFamily(family).run();
                setActiveFont(family);
              }}
            >
              <option value="">Default</option>
              {editorFonts.map((font) => (
                <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
                  {font.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor}>
              Bold
            </button>
            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor}>
              Italic
            </button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} disabled={!editor}>
              H2
            </button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} disabled={!editor}>
              H3
            </button>
            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} disabled={!editor}>
              List
            </button>
            <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} disabled={!editor}>
              Steps
            </button>
            <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} disabled={!editor}>
              Quote
            </button>
            <button type="button" onClick={setLink} disabled={!editor}>
              Link
            </button>
            <button type="button" onClick={() => inlineInputRef.current?.click()} disabled={!editor || isUploading}>
              {isUploading ? "Uploading..." : "Image"}
            </button>
          </div>
          <input
            ref={inlineInputRef}
            type="file"
            accept={acceptedImages}
            multiple
            className="sr-only"
            onChange={onInlineFiles}
          />
          <div className="blog-editor">
            <EditorContent editor={editor} />
          </div>
        </section>

        <aside className="surface h-fit rounded-[1.5rem] p-4">
          <div className="grid gap-4">
            <label className="field">
              <span>Slug</span>
              <input name="slug" defaultValue={post?.slug || ""} placeholder="jeonju-slow-weekend" />
            </label>
            <label className="field">
              <span>Destination</span>
              <input name="destination" defaultValue={post?.destination || ""} placeholder="Jeonju" />
            </label>
            <label className="field">
              <span>Tags</span>
              <input name="tags" defaultValue={post?.tags.join(", ") || ""} placeholder="food, hanok, weekend" />
            </label>
            <label className="field">
              <span>Excerpt</span>
              <textarea name="excerpt" rows={3} defaultValue={post?.excerpt || ""} />
            </label>
            <label className="field">
              <span>Cover image</span>
              <input
                name="coverImageUrl"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                placeholder="https://"
              />
            </label>
            <label className="btn btn-secondary cursor-pointer">
              Upload cover
              <input type="file" accept={acceptedImages} className="sr-only" onChange={onCoverFile} />
            </label>
            {coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="" className="h-28 w-full rounded-xl object-cover" />
            ) : null}
            <label className="field">
              <span>SEO title</span>
              <input name="seoTitle" defaultValue={post?.seoTitle || ""} maxLength={70} />
            </label>
            <label className="field">
              <span>SEO description</span>
              <textarea name="seoDescription" rows={3} maxLength={180} defaultValue={post?.seoDescription || ""} />
            </label>
            <label className="field">
              <span>Status</span>
              <select name="status" defaultValue={post?.status || "draft"}>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="field">
              <span>Schedule time</span>
              <input type="datetime-local" name="scheduledAt" defaultValue={toDatetimeLocalValue(post?.scheduledAt || null)} />
            </label>
            <button type="submit" name="intent" value="save" className="btn btn-secondary" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
            <button type="submit" name="intent" value="publish" className="btn btn-primary" disabled={isPending}>
              Publish now
            </button>
            {post?.source === "ai" ? <p className="text-xs text-[var(--muted)]">Started from an AI draft. Edit before it goes live.</p> : null}
          </div>
        </aside>
      </form>

      {post ? (
        <form action={deleteBlogPostAction} className="mt-4">
          <input type="hidden" name="id" value={post.id} />
          <button
            type="submit"
            className="btn btn-danger"
            onClick={(event) => {
              if (!window.confirm("Delete this post?")) event.preventDefault();
            }}
          >
            Delete post
          </button>
        </form>
      ) : null}
    </div>
  );
}

async function uploadImageFile(file: File) {
  const body = new FormData();
  body.set("file", file);
  const result = await uploadBlogImageAction(body);
  if (!result.url) throw new Error(result.error || "Could not upload the image.");
  return result.url;
}

async function insertUploadedImages(
  editor: Editor,
  files: File[],
  position: number | undefined,
  setError: (message: string | null) => void,
  setIsUploading: (value: boolean) => void,
) {
  setError(null);
  setIsUploading(true);
  try {
    let cursor = position;
    for (const file of files) {
      const src = await uploadImageFile(file);
      const alt = window.prompt("Describe this image", "") || "";
      const image = { type: "image", attrs: { src, alt } };
      const chain = editor.chain().focus();
      if (typeof cursor === "number") {
        chain.insertContentAt(cursor, image).run();
        cursor = editor.state.selection.to;
      } else {
        chain.setImage({ src, alt }).run();
      }
    }
  } catch (uploadError) {
    setError(uploadError instanceof Error ? uploadError.message : "Could not upload the image.");
  } finally {
    setIsUploading(false);
  }
}
