import type { BlogPost, BlogTopic, ShopProduct } from "./types";

export interface BlogRepository {
  promoteScheduled(): Promise<number>;
  listPosts(): Promise<BlogPost[]>;
  listPublished(): Promise<BlogPost[]>;
  getPostById(id: string): Promise<BlogPost | null>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  savePost(post: BlogPost): Promise<BlogPost>;
  deletePost(id: string): Promise<void>;
  listTopics(): Promise<BlogTopic[]>;
  saveTopic(topic: BlogTopic): Promise<BlogTopic>;
  deleteTopic(id: string): Promise<void>;
  listProducts(): Promise<ShopProduct[]>;
  listVisibleProducts(): Promise<ShopProduct[]>;
  getProductById(id: string): Promise<ShopProduct | null>;
  saveProduct(product: ShopProduct): Promise<ShopProduct>;
  deleteProduct(id: string): Promise<void>;
}
