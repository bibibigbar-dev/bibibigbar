import { randomBytes } from "crypto";
import { hashSync } from "bcryptjs";
import type { AppStore } from "./types";

const now = new Date().toISOString();

export function createSeedStore(): AppStore {
  return {
    users: [
      {
        id: "user-admin",
        email: "bibibigbar@gmail.com",
        name: "bibibigbar",
        passwordHash: hashSync(process.env.ADMIN_PASSWORD || randomBytes(24).toString("base64url"), 10),
        role: "admin",
        createdAt: now,
      },
    ],
    boards: [
      {
        id: "board-free",
        slug: "free",
        name: "Free Talk",
        description: "Everyday chat for Dallas neighbors.",
        order: 1,
        isActive: true,
        createdAt: now,
      },
      {
        id: "board-living",
        slug: "living",
        name: "Living Tips",
        description: "Utilities, driving, schools, and daily life hacks.",
        order: 2,
        isActive: true,
        createdAt: now,
      },
      {
        id: "board-housing",
        slug: "housing",
        name: "Housing & Rent",
        description: "Apartments, houses, leases, and neighborhood advice.",
        order: 3,
        isActive: true,
        createdAt: now,
      },
      {
        id: "board-food",
        slug: "food",
        name: "Food & Cafes",
        description: "Korean spots, BBQ, brunch, and hidden gems.",
        order: 4,
        isActive: true,
        createdAt: now,
      },
      {
        id: "board-jobs",
        slug: "jobs",
        name: "Jobs",
        description: "Openings, referrals, and career tips around DFW.",
        order: 5,
        isActive: true,
        createdAt: now,
      },
      {
        id: "board-market",
        slug: "market",
        name: "Marketplace",
        description: "Buy, sell, and give away local items.",
        order: 6,
        isActive: true,
        createdAt: now,
      },
      {
        id: "board-qna",
        slug: "qna",
        name: "Q&A",
        description: "Ask anything about settling into Dallas life.",
        order: 7,
        isActive: true,
        createdAt: now,
      },
    ],
    posts: [
      {
        id: "post-welcome",
        boardId: "board-free",
        authorId: "user-admin",
        title: "Welcome to Living in Dallas",
        content:
          "Share tips, ask questions, and help neighbors settle into DFW life. Please be kind and keep posts local and useful.",
        createdAt: now,
        updatedAt: now,
        isPinned: true,
        isHidden: false,
      },
      {
        id: "post-housing",
        boardId: "board-housing",
        authorId: "user-admin",
        title: "Good starter neighborhoods near Plano?",
        content:
          "Moving next month for work. Looking for quiet apartments with easy highway access. Any recommendations?",
        createdAt: now,
        updatedAt: now,
        isPinned: false,
        isHidden: false,
      },
      {
        id: "post-food",
        boardId: "board-food",
        authorId: "user-admin",
        title: "Best Korean BBQ for a weekend hangout",
        content:
          "Trying to find a spot that is not too crowded on Saturday evenings. Open to Carrollton or Richardson.",
        createdAt: now,
        updatedAt: now,
        isPinned: false,
        isHidden: false,
      },
    ],
    comments: [
      {
        id: "comment-1",
        postId: "post-housing",
        authorId: "user-admin",
        content:
          "Check Legacy West / The Colony for newer communities, and look at commute times during rush hour.",
        createdAt: now,
      },
    ],
    blogPosts: [],
    blogTopics: [],
    blogProducts: [],
  };
}
