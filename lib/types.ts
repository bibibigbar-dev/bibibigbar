import type { BlogPost, BlogTopic, ShopProduct } from "./blog/types";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface Board {
  id: string;
  slug: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  boardId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isHidden: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AppStore {
  users: User[];
  boards: Board[];
  posts: Post[];
  comments: Comment[];
  blogPosts: BlogPost[];
  blogTopics: BlogTopic[];
  blogProducts: ShopProduct[];
}
