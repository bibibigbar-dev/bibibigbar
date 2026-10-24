import { readStore, updateStore } from "@/lib/store";
import type { BlogPost } from "./types";
import type { BlogRepository } from "./repository";

function isDue(post: BlogPost, now: number) {
  return post.status === "scheduled" && !!post.scheduledAt && Date.parse(post.scheduledAt) <= now;
}

export const jsonBlogRepository: BlogRepository = {
  async promoteScheduled() {
    const preview = await readStore();
    const now = Date.now();
    if (!preview.blogPosts.some((post) => isDue(post, now))) return 0;

    let count = 0;
    await updateStore((current) => {
      const stamp = new Date().toISOString();
      const clock = Date.now();
      count = 0;
      return {
        ...current,
        blogPosts: current.blogPosts.map((post) => {
          if (!isDue(post, clock)) return post;
          count += 1;
          return {
            ...post,
            status: "published",
            publishedAt: post.scheduledAt,
            updatedAt: stamp,
          };
        }),
      };
    });
    return count;
  },

  async listPosts() {
    const store = await readStore();
    return [...store.blogPosts].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  },

  async listPublished() {
    await jsonBlogRepository.promoteScheduled();
    const store = await readStore();
    const now = Date.now();
    return store.blogPosts
      .filter((post) => post.status === "published" && post.publishedAt && Date.parse(post.publishedAt) <= now)
      .sort((a, b) => Date.parse(b.publishedAt || "") - Date.parse(a.publishedAt || ""));
  },

  async getPostById(id) {
    const store = await readStore();
    return store.blogPosts.find((post) => post.id === id) || null;
  },

  async getPostBySlug(slug) {
    await jsonBlogRepository.promoteScheduled();
    const store = await readStore();
    return store.blogPosts.find((post) => post.slug === slug) || null;
  },

  async savePost(post) {
    await updateStore((current) => {
      const exists = current.blogPosts.some((item) => item.id === post.id);
      return {
        ...current,
        blogPosts: exists
          ? current.blogPosts.map((item) => (item.id === post.id ? post : item))
          : [post, ...current.blogPosts],
      };
    });
    return post;
  },

  async deletePost(id) {
    await updateStore((current) => ({
      ...current,
      blogPosts: current.blogPosts.filter((post) => post.id !== id),
    }));
  },

  async listTopics() {
    const store = await readStore();
    return [...store.blogTopics].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  },

  async saveTopic(topic) {
    await updateStore((current) => {
      const exists = current.blogTopics.some((item) => item.id === topic.id);
      return {
        ...current,
        blogTopics: exists
          ? current.blogTopics.map((item) => (item.id === topic.id ? topic : item))
          : [topic, ...current.blogTopics],
      };
    });
    return topic;
  },

  async deleteTopic(id) {
    await updateStore((current) => ({
      ...current,
      blogTopics: current.blogTopics.filter((topic) => topic.id !== id),
    }));
  },

  async listProducts() {
    const store = await readStore();
    return [...store.blogProducts].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  },

  async listVisibleProducts() {
    const products = await jsonBlogRepository.listProducts();
    return products.filter((product) => product.isVisible);
  },

  async getProductById(id) {
    const store = await readStore();
    return store.blogProducts.find((product) => product.id === id) || null;
  },

  async saveProduct(product) {
    await updateStore((current) => {
      const exists = current.blogProducts.some((item) => item.id === product.id);
      return {
        ...current,
        blogProducts: exists
          ? current.blogProducts.map((item) => (item.id === product.id ? product : item))
          : [product, ...current.blogProducts],
      };
    });
    return product;
  },

  async deleteProduct(id) {
    await updateStore((current) => ({
      ...current,
      blogProducts: current.blogProducts.filter((product) => product.id !== id),
    }));
  },
};
