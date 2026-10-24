export type BlogPostStatus = "draft" | "scheduled" | "published";
export type BlogPostSource = "manual" | "ai";
export type BlogTopicStatus = "queued" | "generating" | "drafted" | "published" | "failed";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  destination: string;
  tags: string[];
  status: BlogPostStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  seoTitle: string;
  seoDescription: string;
  authorName: string;
  readingMinutes: number;
  source: BlogPostSource;
  aiPrompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  imageUrl: string;
  priceLabel: string;
  category: string;
  amazonUrl: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTopic {
  id: string;
  title: string;
  destination: string;
  angle: string;
  keywords: string[];
  notes: string;
  status: BlogTopicStatus;
  postId: string | null;
  error: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedTravelPost {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  destination: string;
}
