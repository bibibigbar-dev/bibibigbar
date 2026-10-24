import { isSupabaseConfigured } from "./config";
import { jsonBlogRepository } from "./json-repository";
import { supabaseBlogRepository } from "./supabase-repository";

export function getBlogRepository() {
  return isSupabaseConfigured() ? supabaseBlogRepository : jsonBlogRepository;
}
