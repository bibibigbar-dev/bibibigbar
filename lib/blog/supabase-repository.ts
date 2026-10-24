import { isSupabaseConfigured, supabaseProjectUrl } from "./config";
import type { BlogRepository } from "./repository";
import type { BlogPost, BlogPostSource, BlogPostStatus, BlogTopic, BlogTopicStatus, ShopProduct } from "./types";

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  destination: string | null;
  tags: string[] | null;
  status: string;
  published_at: string | null;
  scheduled_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  author_name: string | null;
  reading_minutes: number | null;
  source: string | null;
  ai_prompt: string | null;
  created_at: string;
  updated_at: string;
}

interface TopicRow {
  id: string;
  title: string;
  destination: string | null;
  angle: string | null;
  keywords: string[] | null;
  notes: string | null;
  status: string;
  post_id: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

function requireConfig() {
  const url = supabaseProjectUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  return { url, key };
}

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, key } = requireConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body.slice(0, 280)}`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function asPostStatus(value: string): BlogPostStatus {
  if (value === "published" || value === "scheduled" || value === "draft") return value;
  return "draft";
}

function asSource(value: string | null): BlogPostSource {
  return value === "ai" ? "ai" : "manual";
}

function asTopicStatus(value: string): BlogTopicStatus {
  if (
    value === "queued" ||
    value === "generating" ||
    value === "drafted" ||
    value === "published" ||
    value === "failed"
  ) {
    return value;
  }
  return "queued";
}

function mapPost(row: PostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content || "",
    coverImageUrl: row.cover_image_url || "",
    destination: row.destination || "",
    tags: row.tags || [],
    status: asPostStatus(row.status),
    publishedAt: row.published_at,
    scheduledAt: row.scheduled_at,
    seoTitle: row.seo_title || "",
    seoDescription: row.seo_description || "",
    authorName: row.author_name || "bibibigbar",
    readingMinutes: row.reading_minutes || 1,
    source: asSource(row.source),
    aiPrompt: row.ai_prompt || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toPostRow(post: BlogPost): PostRow {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    cover_image_url: post.coverImageUrl,
    destination: post.destination,
    tags: post.tags,
    status: post.status,
    published_at: post.publishedAt,
    scheduled_at: post.scheduledAt,
    seo_title: post.seoTitle,
    seo_description: post.seoDescription,
    author_name: post.authorName,
    reading_minutes: post.readingMinutes,
    source: post.source,
    ai_prompt: post.aiPrompt,
    created_at: post.createdAt,
    updated_at: post.updatedAt,
  };
}

function mapTopic(row: TopicRow): BlogTopic {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination || "",
    angle: row.angle || "",
    keywords: row.keywords || [],
    notes: row.notes || "",
    status: asTopicStatus(row.status),
    postId: row.post_id,
    error: row.error || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toTopicRow(topic: BlogTopic): TopicRow {
  return {
    id: topic.id,
    title: topic.title,
    destination: topic.destination,
    angle: topic.angle,
    keywords: topic.keywords,
    notes: topic.notes,
    status: topic.status,
    post_id: topic.postId,
    error: topic.error,
    created_at: topic.createdAt,
    updated_at: topic.updatedAt,
  };
}

interface ProductRow {
  id: string;
  name: string;
  image_url: string | null;
  price_label: string | null;
  category: string | null;
  amazon_url: string;
  is_visible: boolean | null;
  created_at: string;
  updated_at: string;
}

function mapProduct(row: ProductRow): ShopProduct {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url || "",
    priceLabel: row.price_label || "",
    category: row.category || "",
    amazonUrl: row.amazon_url,
    isVisible: row.is_visible !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toProductRow(product: ShopProduct): ProductRow {
  return {
    id: product.id,
    name: product.name,
    image_url: product.imageUrl,
    price_label: product.priceLabel,
    category: product.category,
    amazon_url: product.amazonUrl,
    is_visible: product.isVisible,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  };
}

async function upsertPost(post: BlogPost) {
  const rows = await rest<PostRow[]>("blog_posts?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(toPostRow(post)),
  });
  return mapPost(rows[0] || toPostRow(post));
}

export const supabaseBlogRepository: BlogRepository = {
  async promoteScheduled() {
    if (!isSupabaseConfigured()) return 0;
    const now = new Date().toISOString();
    const due = await rest<PostRow[]>(
      `blog_posts?status=eq.scheduled&scheduled_at=lte.${encodeURIComponent(now)}&select=*`
    );
    for (const row of due) {
      await rest(`blog_posts?id=eq.${encodeURIComponent(row.id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          status: "published",
          published_at: row.scheduled_at,
          updated_at: now,
        }),
      });
    }
    return due.length;
  },

  async listPosts() {
    const rows = await rest<PostRow[]>("blog_posts?select=*&order=updated_at.desc");
    return rows.map(mapPost);
  },

  async listPublished() {
    await supabaseBlogRepository.promoteScheduled();
    const now = new Date().toISOString();
    const rows = await rest<PostRow[]>(
      `blog_posts?status=eq.published&published_at=lte.${encodeURIComponent(now)}&select=*&order=published_at.desc`
    );
    return rows.map(mapPost);
  },

  async getPostById(id) {
    const rows = await rest<PostRow[]>(`blog_posts?id=eq.${encodeURIComponent(id)}&select=*`);
    return rows[0] ? mapPost(rows[0]) : null;
  },

  async getPostBySlug(slug) {
    await supabaseBlogRepository.promoteScheduled();
    const rows = await rest<PostRow[]>(`blog_posts?slug=eq.${encodeURIComponent(slug)}&select=*`);
    return rows[0] ? mapPost(rows[0]) : null;
  },

  async savePost(post) {
    return upsertPost(post);
  },

  async deletePost(id) {
    await rest(`blog_posts?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
  },

  async listTopics() {
    const rows = await rest<TopicRow[]>("blog_topics?select=*&order=created_at.desc");
    return rows.map(mapTopic);
  },

  async saveTopic(topic) {
    const rows = await rest<TopicRow[]>("blog_topics?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(toTopicRow(topic)),
    });
    return mapTopic(rows[0] || toTopicRow(topic));
  },

  async deleteTopic(id) {
    await rest(`blog_topics?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
  },

  async listProducts() {
    const rows = await rest<ProductRow[]>("blog_products?select=*&order=updated_at.desc");
    return (rows || []).map(mapProduct);
  },

  async listVisibleProducts() {
    const rows = await rest<ProductRow[]>("blog_products?is_visible=eq.true&select=*&order=updated_at.desc");
    return (rows || []).map(mapProduct);
  },

  async getProductById(id) {
    const rows = await rest<ProductRow[]>(`blog_products?id=eq.${encodeURIComponent(id)}&select=*`);
    return rows?.[0] ? mapProduct(rows[0]) : null;
  },

  async saveProduct(product) {
    const rows = await rest<ProductRow[]>("blog_products?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(toProductRow(product)),
    });
    return mapProduct(rows[0] || toProductRow(product));
  },

  async deleteProduct(id) {
    await rest(`blog_products?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
  },
};
